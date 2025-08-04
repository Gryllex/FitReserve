import { UserModel } from "../models/user.model.ts"
import { Request, Response } from "express"
import { validateUser, validatePartialUser } from "../schemas/userSchema.ts";
import { AuthenticatedRequest } from "../middlewares/auth.middlewares.ts";
import { Role } from "../enum/enum"
import bcrypt from 'bcrypt';

type updateUserData = { 
        name?: string, 
        email?: string, 
        password?: string, 
        role?: Role
    }

export class UserController {

    static createUser = async (req: Request, res: Response) => {
        const validatedUser = validateUser(req.body)

        if (!validatedUser.success) {
        return res.status(400).json({ error: validatedUser.error.issues });
        }

        const { name, email, password, role} = validatedUser.data

        try {
            const existingUser = await UserModel.getUserByEmail( email );
            if (existingUser) {
                return res.status(409).json({ error: 'Email already in use' });
            }

            const hashedPassword = await bcrypt.hash(password, 10)

            const newUser = await UserModel.createUser( {
                name,
                email,
                password: hashedPassword,
                role
            });

            res.status(201).json(newUser)
        } catch(e) {
            console.error(e);
            res.status(500).json({ error: 'Error creating user' });
        }
    }


    static updateUser = async (req: AuthenticatedRequest, res: Response) => {
        if (!req.user){
            return res.status(401).json({ error: 'Not authorized '})
        }
        const userId = req.user.userId;
        
        const validated = validatePartialUser(req.body)
        if (!validated.success) {
        return res.status(400).json({ error: validated.error.issues });
        }

        const { name, email, password, role } = validated.data

        try {
            const userExists = await UserModel.getUserById(userId)
            if (!userExists) {
                return res.status(404).json({ error: 'User does not exist'})
            }
            
            const newData: updateUserData = { name, email, role }

            if (password) {
                const hashedPassword = await bcrypt.hash(password, 10)
                newData.password = hashedPassword
            }

            const updatedUser = await UserModel.updateUser( userId, newData)
            res.status(200).json(updatedUser)

        } catch(e) {
            console.error(e)
            res.status(500).json({ error: 'Error trying to update user' })
        }
    }

    static deleteUser = async (req: AuthenticatedRequest, res: Response) => {
        if (!req.user){
            return res.status(401).json({ error: 'Not authorized '})
        }
        const userId = req.user.userId;

        try {
            const userExists = await UserModel.getUserById(userId)
            if (!userExists) {
                return res.status(404).json({ error: 'User does not exist'})
            }
            
            const deletedUser = await UserModel.deleteUser(userId)
            res.status(200).json(deletedUser)
        } catch(e) {
            console.log(e)
            res.status(500).json({ error: 'Error trying to delete user' })
        }
    }

    static getCurrentUser = async (req: AuthenticatedRequest, res: Response) => {
        if (!req.user){
            return res.status(401).json({ error: 'Not authorized '})
        }
        const userId = req.user.userId;
    
        try {
            const user = await UserModel.getUserById( userId )
            if (!user) return res.status(404).json({ error: 'User not found'})

            // Return a safe user copy without the hashed password
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...safeUser } = user
            res.status(200).json({ user: safeUser })
        } catch(e) {
            console.log('[getUserById] Error: ', e)
            res.status(400).json({ error: 'Error trying to get user'})
        }
    }
}