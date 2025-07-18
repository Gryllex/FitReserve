import z from 'zod'

const userSchema = z.object({
    user: z.string().min(3).max(25),
    email: z.string().includes('@').includes('.'),
    password: z.string().min(6)
})

export function validateUser(object: object){
    return userSchema.safeParse(object)
}


export function validatePartialUser(object: object){
    return userSchema.partial().safeParse(object)
}