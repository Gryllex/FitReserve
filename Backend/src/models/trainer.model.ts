import { prisma } from "../lib/prisma.ts"

export class TrainerModel {

    // Create availability for a trainer
    static async createAvailability( data: {
        trainerId: number,
        dayOfWeek: number,
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
                dayOfWeek: dayOfWeek
            }
        });
    }

    // Update availability 

    static async updateAvailability(
        trainerId: number,
        { daysOfWeek, startTime, endTime } : {
            daysOfWeek: number[],
            startTime: number,
            endTime: number
        }
    ) {

        await prisma.trainerAvailability.deleteMany({
            where: { trainerId }
        })

        await prisma.trainerAvailability.createMany({

            data: daysOfWeek.map(day => ({
                trainerId,
                dayOfWeek: day,
                startTime,
                endTime
            }))
        })
    }


    static async updateSingleAvailability(
        id: number, 
        trainerId: number,
        data: Partial<{
            dayOfWeek: number,
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