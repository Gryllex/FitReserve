import { Request, Response } from "express";
import { TrainerModel } from "../models/trainer.model.ts";
import { validatePartialTrainer, validateTrainer } from "../schemas/trainerSchema.ts";
import { AuthenticatedRequest } from "../middlewares/auth.middlewares.ts";


export class TrainerController {

    static createAvailability = async (req: Request, res: Response) => {
        const { trainerId, daysOfWeek, startTime, endTime } = req.body

        const validated = validateTrainer({ trainerId, daysOfWeek, startTime, endTime})

        if (!validated.success) {
        return res.status(400).json({ error: validated.error.issues });
        }

        try {
            const newAvailability = await TrainerModel.createAvailability( validated.data )
            res.status(200).json(newAvailability)
        } catch(e) {
            console.log(e);
            res.status(500).json({ error: 'Error creating availability' });
        }
    }

    static getAvailabilityByTrainer = async (req: Request, res: Response) => {
        const trainerId = Number(req.query.trainerId)

        if (isNaN(trainerId)) return res.status(400).json({
            error: 'trainerId must be a number'
        })

        try {
            const trainerAvailability = await TrainerModel.getAvailabilityByTrainer( trainerId )
            if (!trainerAvailability || trainerAvailability.length === 0) return res.status(404).json({ error: 'Could not get availability'})
            res.status(200).json(trainerAvailability)
        } catch(e) {
            console.log(e);
            res.status(500).json({ error: 'Error getting availability' });
        }
    }


    static getAvailabilityForDay = async (req: Request, res: Response) => {
        const trainerId = Number(req.query.trainerId)
        const dayOfWeek = Number(req.query.dayOfWeek)

        if(isNaN(trainerId) || isNaN(dayOfWeek)) return res.status(400).json({
            error: 'trainerId and dayOfWeek must be numbers'
        })

        try {
            const trainerAvailability = await TrainerModel.getAvailabilityForDay( trainerId, dayOfWeek )
            if (!trainerAvailability) return res.status(404).json({ error: 'Could not get availability'})
            res.status(200).json(trainerAvailability)
        } catch(e) {
            console.log(e);
            res.status(500).json({ error: 'Error getting availability' });
        }
    }


    static updateAvailability = async (req: AuthenticatedRequest, res: Response) => {
        if (!req.user){
            return res.status(401).json({ error: 'No autorizado '})
        }

        const trainerId = req.user.userId   // Trainer ID
        const id = Number(req.params.id)    // Availability ID
        const { daysOfWeek, startTime, endTime } = req.body

        if (!id || isNaN(id)) return res.status(400).json({ error: 'Availability ID is required' })

        const validated = validatePartialTrainer({ daysOfWeek, startTime, endTime})

        if (!validated.success) {
        return res.status(400).json({ error: validated.error.issues });
        }

        try {
            const newAvailability = await TrainerModel.updateAvailability( id, trainerId, validated.data )
            res.status(200).json(newAvailability)
        } catch(e) {
            console.log(e);
            res.status(403).json({ error: 'Error updating availability' });
        }
    }
}