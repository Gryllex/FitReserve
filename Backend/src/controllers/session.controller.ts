import { Response } from "express";
import { SessionModel } from "../models/session.model";
import { validateSession } from "../schemas/sessionSchema";
import { AuthenticatedRequest } from "../middlewares/auth.middlewares";

export class SessionController {

    static getClientSessions = async (req: AuthenticatedRequest, res: Response) => {
        try {
            if (!req.user){
                return res.status(401).json({ error: 'No autorizado '})
            }
            const userId = req.user.userId; // Middleware pendiente, req.body.userId para que no de error
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
            const userId = req.user.userId; // Middleware pendiente, req.body.userId para que no de error
            const sessions = await SessionModel.getTrainerSessions(userId)
            return res.status(200).json({ sessions })
        } catch(e) {
            console.log('[trainerSessions] Error: ', e)
            return res.status(500).json( {error: 'Something went wrong'} )
        }
    }


    static bookSession = async (req: AuthenticatedRequest, res: Response) => {
        try {
            if (!req.user){
                return res.status(401).json({ error: 'No autorizado '})
            }
            const { trainerId, date, duration } = req.body
            const clientId = req.user.userId; // Middleware pendiente, req.body.userId para que no de error

            // Data verification using ZOD
            const validatedData = validateSession({trainerId, clientId, date, duration})
            if (!validatedData.success) {
                return res.status(400).json({ error: validatedData.error.issues})
            }

            const { date: sessionDate } = validatedData.data

            // check if a trainer is busy for the date
            const trainerBusy = await SessionModel.getTrainerSessionsAt(trainerId, sessionDate)
            if (trainerBusy) {
                return res.status(401).json({error: 'The trainer is busy at the date specified'})
            }

            // check if client has already a booked session for the date
            const clientBusy = await SessionModel.getClientSessionsAt(clientId, sessionDate)
            if (clientBusy) {
                return res.status(401).json({ error: 'You cannot book more than 1 session for the same date' })
            }
            
            const session = await SessionModel.createSession({
                trainerId, clientId, date: sessionDate, duration
            })

            return res.status(201).json({ message: 'Session booked', session })
        } catch (e) {
            console.error('[bookSession] Error:', e);
            return res.status(500).json({ error: 'Something went wrong' });
        } 
    }

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