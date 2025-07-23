import z from 'zod'
import { Role } from '../enum/enum.ts'

const rolesArray = Object.values(Role) as [Role, ...Role[]]

const userSchema = z.object({
    name: z.string().min(3).max(25),
    email: z.email(),
    password: z.string().min(6),
    role: z.enum(rolesArray)
})

export function validateUser(object: object){
    return userSchema.safeParse(object)
}

export function validatePartialUser(object: object){
    return userSchema.partial().safeParse(object)
}