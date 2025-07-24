import z from 'zod'

const trainerSchema = z.object({
    trainerId: z.number(),
    daysOfWeek: z.array(z.number().min(0).max(6))
        .min(1, { message: 'At least one day must be selected'})
        .max(7, { message: 'Too many days selected'}),
    startTime: z.number().min(360).max(1200),
    endTime: z.number().min(480).max(1440)
}).refine(data => data.startTime < data.endTime, {
    message: 'startTime must be lower than endTime',
    path: ['startTime']
}).refine(data => new Set(data.daysOfWeek).size === data.daysOfWeek.length, {
    message: 'Duplicate days are not allowed',
    path: ['daysOfWeek']
})

const trainerAvailabilitySchema = z.object({
    daysOfWeek: z.array(z.number().min(0).max(6))
        .min(1, { message: 'At least one day must be selected'})
        .max(7, { message: 'Too many days selected'}),
    startTime: z.number().min(360).max(1200),
    endTime: z.number().min(480).max(1440)
}).refine(data => data.startTime < data.endTime, {
    message: 'startTime must be lower than endTime',
    path: ['startTime']
}).refine(data => new Set(data.daysOfWeek).size === data.daysOfWeek.length, {
    message: 'Duplicate days are not allowed',
    path: ['daysOfWeek']
})

const singleAvailabilitySchema = z.object({
    dayOfWeek: z.number().min(0).max(6),
    startTime: z.number().min(360).max(1200),
    endTime: z.number().min(480).max(1440)
}).refine(data => data.startTime < data.endTime, {
    message: 'startTime must be lower than endTime',
    path: ['startTime']
})

export function validateTrainer(object: object) {
    return trainerSchema.safeParse(object)
}

export function validateTrainerAvailability(object: object) {
    return trainerAvailabilitySchema.safeParse(object)
}

export function validateSingleAvailability(object: object) {
    return singleAvailabilitySchema.safeParse(object)
}