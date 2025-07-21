import z from 'zod'

const sessionSchema = z.object({
    trainerId: z.number(),
    clientId: z.number(),
    duration: z.number().min(30).max(120),
    date: z.coerce.date()
})


export function validateSession(object: object) {
    return sessionSchema.safeParse(object)
}

// export function validatePartialSession(object: object) {
//     return sessionSchema.partial().safeParse(object)
// }