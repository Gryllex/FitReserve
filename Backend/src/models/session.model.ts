import { prisma } from '../lib/prisma.ts' 


interface Session {
  date: Date;
  duration: number;
}

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
                }, 
                client: {
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
                trainer: {
                    select: { name: true, email: true}
                }, 
                client: {
                    select: { name: true, email: true}
                }
            }
        })
    }

    static async getTrainerSessionsAt (trainerId: number, sessionDate: Date, duration: number) {
        // Specified time to check if it's available
        const start = sessionDate;
        const end = new Date(start.getTime() + duration * 60000) // Duration is in minutes, need to transform to ms
        
        return this.findOverlappingSession( { trainerId }, start, end)
    }

    static async getClientSessionsAt (clientId: number, sessionDate: Date, duration: number) {
        // Specified time to check if it's available
        const start = sessionDate;
        const end = new Date(start.getTime() + duration * 60000) // Duration is in minutes, need to transform to ms

        return this.findOverlappingSession( { clientId }, start, end)
    }



    // Private function to find if theres a session overlap between requested and existing sessions
    private static async findOverlappingSession( whereClause: object, start: Date, end: Date){

        // Geting interval for the whole day
        const dayStart = new Date(start)
        dayStart.setHours(0,0,0,0)
        const dayEnd = new Date(end)
        dayEnd.setHours(23,59,59,999)

        // Get all sessions for the day
        const sessions = await prisma.session.findMany({
            where: {
                ...whereClause,
                cancelled: false,
                date: {
                    gte: dayStart,
                    lte: dayEnd
                }
            }
        })

        // Check if requested session overlaps an existing session
        return sessions.find(( session: Session ) => {
            const existingStart = new Date(session.date)
            const existingEnd = new Date(existingStart.getTime() + session.duration * 60000)
            return start < existingEnd && end > existingStart
        })
    }
}