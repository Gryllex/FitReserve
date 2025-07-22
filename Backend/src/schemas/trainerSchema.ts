import z from 'zod'

const trainerSchema = z.object({
    trainerId: z.number(),
    daysOfWeek: z.number().min(0).max(6),
    startTime: z.number().min(360).max(1200),
    endTime: z.number().min(480).max(1440)
}).refine(data => data.startTime < data.endTime, {
    message: 'starTime must be lower than endTime',
    path: ['startTime']
})


export function validateTrainer(object: object) {
    return trainerSchema.safeParse(object)
}

export function validatePartialTrainer(object: object) {
    return trainerSchema.partial().safeParse(object)
}