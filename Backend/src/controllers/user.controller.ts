import { UserModel } from "../models/user.model"
import { Request, Response } from "express"
import { validateUser, validatePartialUser } from "../schemas/userSchema";

export class UserController {

    static getAllUsers = async (req: Request, res: Response) => {
        try {
            const allUsers = await UserModel.getAllUsers();
            res.status(200).json(allUsers);
        } catch(e) {
            console.log(e)
            res.status(500).json({ error: 'Error al obtener los usuarios' })
        }
    }

    static updateUser = async (req: Request, res: Response) => {
        const validated = validatePartialUser(req.body)
        
        if (!validated.success) {
        return res.status(400).json({
            error: validated.error.issues
            // error: JSON.parse(validated.error.message)
        });
        }

        const { id } = req.params

        try {
            const updatedUser = await UserModel.updateUser( id, {data: validated.data})
            res.status(200).json(updatedUser)

        } catch(e) {
            console.error(e)
            res.status(400).json({ error: 'Error al actualizar el usuario' })
        }
    }

    static deleteUser = async (req: Request, res: Response) => {
        const { id } = req.params
        try {
            const deletedUser = await UserModel.deleteUser(id)
            res.status(200).json(deletedUser)
        } catch(e) {
            console.log(e)
            res.status(500).json({ error: 'Error al eliminar el usuario' })
        }
    }

    static createUser = async (req: Request, res: Response) => {
        const validated = validateUser(req.body)

        if (!validated.success) {
        return res.status(400).json({
            error: validated.error.issues
            // error: JSON.parse(validated.error.message)
            });
        }

        try {
            const newUser = await UserModel.createUser({ data: validated.data })
            res.status(201).json(newUser)
        } catch(e) {
            console.error(e);
            res.status(500).json({ error: 'Error al crear el usuario' });
        }
    }
}