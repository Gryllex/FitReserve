import { prisma } from "../lib/prisma.ts"

export class TrainerModel {

    // Create availability for a trainer
    static async createAvailability( data: {
        trainerId: number,
        daysOfWeek: number,
        startTime: number,
        endTime: number
    }) {
        return await prisma.trainerAvailability.create({ data })
    }


    // Get all availabilities for a trainer
    static async getAvailabilityByTrainer(trainerId: number) {
        return await prisma.trainerAvailability.findMany({
        where: { trainerId },
    });
  }

    // Get a specficic day's availability for a trainer
    static async getAvailabilityForDay( trainerId: number, dayOfWeek: number){
        return await prisma.trainerAvailability.findFirst({
            where: {
                trainerId,
                daysOfWeek: dayOfWeek
            }
        });
    }

    // Update availability 
    static async updateAvailability(
        id: number, 
        trainerId: number,
        data: Partial<{
            daysOfWeek: number,
            startTime: number,
            endTime: number
        }>
    ) {

        const availability = await prisma.trainerAvailability.findUnique({
            where: { id }
        })

        if (!availability || availability.trainerId != trainerId) {
            throw new Error('You can only modify your own availability')
        }
        return await prisma.trainerAvailability.update({
            where: { id },
            data
        });
    }
}