import { UserModel } from "../models/user.model.ts"
import { Request, Response } from "express"
import { validateUser, validatePartialUser } from "../schemas/userSchema.ts";
import { AuthenticatedRequest } from "../middlewares/auth.middlewares.ts";

export class UserController {

    static createUser = async (req: Request, res: Response) => {
        const validated = validateUser(req.body)

        if (!validated.success) {
        return res.status(400).json({ error: validated.error.issues });
        }

        try {
            const newUser = await UserModel.createUser( validated.data )
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

        try {
            const userExists = await UserModel.getUserById(userId)
            if (!userExists) {
                return res.status(404).json({ error: 'User does not exists'})
            }
            
            const updatedUser = await UserModel.updateUser( userId, validated.data)
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
                return res.status(404).json({ error: 'User does not exists'})
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
            res.status(200).json({ user })
        } catch(e) {
            console.log('[getUserById] Error: ', e)
            res.status(400).json({ error: 'Error trying to get user'})
        }
    
    }
}