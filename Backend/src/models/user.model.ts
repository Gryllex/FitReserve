import { prisma } from "../lib/prisma.ts"

import { Role } from "../enum/enum"

export class UserModel {
    
    static async createUser(data: {
        email: string,
        password: string,
        name: string,
        role: Role
    }) {
        return await prisma.user.create({ data })
    }

    static async updateUser(id: number, data: Partial<{
        email: string, password: string, name: string, role: Role}>
    ) {
        return await prisma.user.update({
            where: { id },
            data
        })
    }

    static async deleteUser( id: number ) {
        return await prisma.user.delete({
            where: { id }
        })
    }

    static async getUserById( id: number ){
        return await prisma.user.findUnique({
            where: { id }
        })
    }

    static async getUserByEmail( email: string ){
        return await prisma.user.findUnique({
            where: { email }
        })
    }

    static async getUserByRole( role: Role ){
        return await prisma.user.findMany({
            where: { role }
        })
    }
}