import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { Role } from "../enum/enum";


const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET no está definido en el archivo .env");
}

// Middleware for protected routes that need to access to req.user (Already logged users)
export interface AuthenticatedRequest extends Request {
    user?: {
        userId: number,
        email: string,
        role: Role;
    }
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith(' Bearer ')){
        return res.status(401).json({ error: 'Token no proporcionado' })
    }

    const token = authHeader.split(' ')[1]

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as unknown as {
            userId: number,
            email: string,
            role: Role
        }

        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role as Role
        }

        next()
    } catch(e) {
        console.log('[authMiddleware] Error: ', e)
        res.status(403).json({ error: 'Token inválido o expirado '})
    }
}


// export const roleMiddleware = (allowedRoles: Role) => (
//     req: AuthenticatedRequest,
//     res: Response,
//     next: NextFunction
//     ) => {

//         const userRole = req.user?.role
//         if (!req.user || !allowedRoles.includes(userRole)) {
//             return res.status(403).json({ error: 'Access not authorized '})
//         }
//         next()
// }