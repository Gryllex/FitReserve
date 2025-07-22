import { Request, Response } from "express";
import { validateUser } from "../schemas/userSchema";
import { UserModel } from "../models/user.model";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET;

export class AuthenticationController {

    //  --- REGISTER ---
    static register = async (req: Request, res: Response) => {
        const validated = validateUser(req.body);

        if (!validated.success) {
        return res.status(400).json({ error: validated.error.issues });
        }

        try {
            const { name, email, password, role } = validated.data

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
                JWT_SECRET!, 
                { expiresIn: '7d'}
            );

            return res.status(201).json({
                message: 'User created',
                token
            });

        } catch(e) {
            console.error(e);
            res.status(500).json({ error: 'Error al crear el usuario' });
        }
    }


    // --- LOGIN ---
    static login = async (req: Request, res: Response) => {
        const validated = validateUser(req.body);

        if (!validated.success) {
        return res.status(400).json({ error: validated.error.issues });
        }

        try {
            const { email, password } = validated.data;

            const user  = await UserModel.getUserByEmail(email);
            if (!user) return res.status(401).json({ error: 'Invalid email or password' })

            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) return res.status(401).json({ error: 'Invalid email or password'})
            
            const token = jwt.sign(
                { userId: user.id, email: user.email, role: user.role }, 
                JWT_SECRET!, 
                {expiresIn: '7d'}
            )

            return res.status(200).json({
                message: 'User logged in',
                token
            });

        } catch(e) {
            console.log(e);
            res.status(500).json({ error: 'Error al iniciar sesion' })
        }
    }
}