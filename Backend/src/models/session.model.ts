import { prisma } from '../lib/prisma' 

export class SessionModel {

    static async createSession (data: {
        trainerId: number;
        clientId: number;
        date: Date;
        duration: number;
        }) {
            return await prisma.session.create({ data });
    }

    static async cancelSession (id: number) {
        return await prisma.session.update({
            where: { id },
            data: { cancelled: true}
        })
    }

    static async getSessionById (id: number) {
        return await prisma.session.findUnique({
            where: { id }
        })
    }

    static async getTrainerSessions (trainerId: number) {
        return await prisma.session.findMany({
            where: { trainerId, cancelled: false },
            orderBy: { date: 'asc'},
            include: {
                trainer: {
                    select: { name: true, email: true}
                }
            }
        })
    }

    static async getClientSessions (clientId: number) {
        return await prisma.session.findMany({
            where: { clientId, cancelled: false },
            orderBy: { date: 'asc'},
            include: {
                client: {
                    select: { name: true, email: true}
                }
            }
        })
    }

    static async getTrainerSessionsAt (trainerId: number, date: Date) {
        return await prisma.session.findFirst({
            where: { trainerId, date, cancelled: false},
        })
    }

    static async getClientSessionsAt (clientId: number, date: Date) {
        return await prisma.session.findFirst({
            where: { clientId, date, cancelled: false},
        })
    }
}