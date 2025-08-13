import { Response } from "express";
import { SessionModel } from "../models/session.model.ts";
import { validateSession } from "../schemas/sessionSchema.ts";
import { AuthenticatedRequest } from "../middlewares/auth.middlewares.ts";
import { TrainerModel } from "../models/trainer.model.ts";
import { UserModel } from "../models/user.model.ts";

export class SessionController {

    // Get all the sessions for a client
    static getClientSessions = async (req: AuthenticatedRequest, res: Response) => {
        try {
            if (!req.user){
                return res.status(401).json({ error: 'No autorizado '})
            }
            const userId = req.user.userId;
            const sessions = await SessionModel.getClientSessions(userId)
            return res.status(200).json({ sessions })
        } catch(e) {
            console.log('[clientSessions] Error: ', e)
            return res.status(500).json( {error: 'Something went wrong'} )
        }
    }

    static getTrainerSessions = async (req: AuthenticatedRequest, res: Response) => {
        try {
            if (!req.user){
                return res.status(401).json({ error: 'No autorizado '})
            }
            const userId = req.user.userId;
            const sessions = await SessionModel.getTrainerSessions(userId)
            return res.status(200).json({ sessions })
        } catch(e) {
            console.log('[trainerSessions] Error: ', e)
            return res.status(500).json( {error: 'Something went wrong'} )
        }
    }


    // Book a new session
    static bookSession = async (req: AuthenticatedRequest, res: Response) => {
        try {
            // Verify user
            if (!req.user){
                return res.status(401).json({ error: 'No autorizado '})
            }

            // Verify trainer
            const trainer = await UserModel.getUserByEmail(req.body.trainerEmail)
            if (!trainer) return res.status(404).json({error: 'Trainer not found'})
            if (trainer.role !== 'TRAINER') return res.status(400).json({ error: 'User is not a trainer' });

            const { date, duration } = req.body
            const trainerId = trainer.id
            const clientId = req.user.userId;

            // Data verification using ZOD
            const validatedData = validateSession({trainerId, clientId, date, duration})
            if (!validatedData.success) {
                return res.status(400).json({ error: validatedData.error.issues})
            }

            const { date: sessionDate } = validatedData.data

            // Check trainer's working schedule
            const dayOfWeek = sessionDate.getDay()
            const startTime = sessionDate.getHours() * 60 + sessionDate.getMinutes() 
            const endTime = startTime + duration

            const availability = await TrainerModel.getAvailabilityForDay( trainerId, dayOfWeek)

            if (!availability || availability == null) return res.status(400).json({ error: 'Trainer is not available' })

            const isAvailable = startTime >= availability.startTime && endTime <= availability.endTime;
            // const isAvailable = availability.some( (trainer: {startTime: number; endTime: number}) =>
            //     startTime >= trainer.startTime && endTime <= trainer.endTime
            // )

            if (!isAvailable) return res.status(400).json({ error: 'Trainer is not available at selected date' })


            // check if a trainer is busy for the date
            const trainerBusy = await SessionModel.getTrainerSessionsAt(trainerId, sessionDate, duration)
            if (trainerBusy) {
                return res.status(401).json({error: 'The trainer is busy at the date specified'})
            }

            // check if client has already a booked session for the date
            const clientBusy = await SessionModel.getClientSessionsAt(clientId, sessionDate, duration)
            if (clientBusy) {
                return res.status(401).json({ error: 'You cannot book more than 1 session for the same date' })
            }
            

            const session = await SessionModel.createSession({
                trainerId, clientId, date: sessionDate, duration
            })

            return res.status(201).json({ message: 'Session booked', session })
        } catch (e) {
            console.error('[bookSession] Error:', e);
            return res.status(500).json({ error: 'Something went wrong while booking the session' });
        } 
    }


    // Cancel an existing session
    static cancelSession = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const sessionId = Number(req.params.id)

            if (isNaN(sessionId)) {
                return res.status(400).json({ error: 'Invalid session ID' });
            }

            const sessionExists = await SessionModel.getSessionById(sessionId)
            if (!sessionExists) {
                return res.status(404).json({ error: 'Cannot cancel a session that does not exist'})
            }

            const canceledSession = await SessionModel.cancelSession( sessionId )
            return res.status(202).json({ message: 'Session canceled', canceledSession})

        } catch (e) {
            console.error('[deleteSession] Error:', e);
            return res.status(500).json({ error: 'Something went wrong' });
        }
    }
}