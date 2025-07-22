import z from 'zod'

const sessionSchema = z.object({
    trainerId: z.number(),
    clientId: z.number(),
    duration: z.union([
        z.literal(30),
        z.literal(45),
        z.literal(60),
        z.literal(75),
        z.literal(90)]
    ),
    date: z.coerce.date()
})


export function validateSession(object: object) {
    return sessionSchema.safeParse(object)
}

export function validatePartialSession(object: object) {
    return sessionSchema.partial().safeParse(object)
}