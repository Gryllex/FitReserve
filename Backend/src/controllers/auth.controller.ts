import { Request, Response } from "express";
import { validatePartialUser, validateUser } from "../schemas/userSchema.ts";
import { UserModel } from "../models/user.model.ts";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validateTrainerAvailability } from "../schemas/trainerSchema.ts";
import { TrainerModel } from "../models/trainer.model.ts";
import { AuthenticatedRequest } from "../middlewares/auth.middlewares.ts";

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}

export class AuthenticationController {

    //  --- REGISTER ---
    static register = async (req: Request, res: Response) => {
        const validatedUser = validateUser(req.body);
        if (!validatedUser.success) {
        return res.status(400).json({ error: validatedUser.error.issues });
        }

        const { name, email, password, role } = validatedUser.data

        // Validate before creating user
        let validatedAvailability;
        if (role === 'TRAINER'){
            const { daysOfWeek, startTime, endTime } = req.body

            validatedAvailability = validateTrainerAvailability({ daysOfWeek, startTime, endTime })
            if (!validatedAvailability.success) {
                return res.status(400).json({ 
                    error: validatedAvailability.error.issues.map(issue => [issue.path, issue.message]) 
                });
            }
        }

        try {
            const existingUser = await UserModel.getUserByEmail( email );
            if (existingUser) {
                return res.status(409).json({ error: 'Email already in use' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await UserModel.createUser({
                name, 
                email,
                password: hashedPassword,
                role
            });

            const token = jwt.sign(
                { userId: newUser.id, email: newUser.email, role: newUser.role},
                JWT_SECRET, 
                { expiresIn: '7d'}
            );

            // If the new user is a trainer
            if (newUser.role === 'TRAINER' && validatedAvailability) {
                const { daysOfWeek, startTime, endTime } = validatedAvailability.data

                await Promise.all(
                    daysOfWeek.map((day: number) =>
                        TrainerModel.createAvailability({
                            trainerId: newUser.id,
                            dayOfWeek: day,
                            startTime,
                            endTime
                        })
                    )
                )
            }

            return res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000
            })
                .status(201).json({
                message: role === 'TRAINER' ? 'Trainer registered' : 'User registered'});

        } catch(e) {
            console.error(e);
            res.status(500).json({ error: 'Error al crear el usuario' });
        }
    }


    // --- LOGIN ---
    static login = async (req: Request, res: Response) => {
        const validated = validatePartialUser(req.body);

        if (!validated.success) {
        return res.status(400).json({ error: 'Invalid email or password' });
        }

        try {
            const { email, password } = validated.data;

            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are needed' })
            }

            const user  = await UserModel.getUserByEmail(email);
            if (!user) return res.status(401).json({ error: 'Invalid email or password' })

            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) return res.status(401).json({ error: 'Invalid email or password'})
            
            const token = jwt.sign(
                { userId: user.id, email: user.email, role: user.role }, 
                JWT_SECRET!, 
                {expiresIn: '7d'}
            )

            return res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000
                }).status(200).json({ message: 'User logged in' });

        } catch(e) {
            console.error(e);
            res.status(500).json({ error: 'Error al iniciar sesion' })
        }
    }

    static logout = (req: Request, res: Response) => {
        return res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        }).status(200).json({ message: 'Loged out successfully'})
    }

    static authentication = (req: AuthenticatedRequest, res: Response) => {
        res.status(200).json({ user: req.user })
    }
}