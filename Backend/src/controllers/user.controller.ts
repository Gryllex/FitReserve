import { UserModel } from "../models/user.model"
import { Request, Response } from "express"
import { validateUser, validatePartialUser } from "../schemas/userSchema";
import { AuthenticatedRequest } from "../middlewares/auth.middlewares";

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
            res.status(500).json({ error: 'Error al crear el usuario' });
        }
    }


    static updateUser = async (req: Request, res: Response) => {
        const validated = validatePartialUser(req.body)
        
        if (!validated.success) {
        return res.status(400).json({ error: validated.error.issues });
        }

        const id = Number(req.params.id)
        if (isNaN(id)) { return res.status(400).json({ error: 'ID Inválido' })}

        try {
            const userExists = await UserModel.getUserById(id)
            if (!userExists) {
                return res.status(404).json({ error: 'El usuario solicitado no existe'})
            }
            
            const updatedUser = await UserModel.updateUser( id, validated.data)
            res.status(200).json(updatedUser)

        } catch(e) {
            console.error(e)
            res.status(500).json({ error: 'Error al actualizar el usuario' })
        }
    }

    static deleteUser = async (req: Request, res: Response) => {

        const id = Number(req.params.id)
        if (isNaN(id)) { return res.status(400).json({ error: 'ID Inválido' })}

        try {
            const userExists = await UserModel.getUserById(id)
            if (!userExists) {
                return res.status(404).json({ error: 'El usuario solicitado no existe'})
            }
            
            const deletedUser = await UserModel.deleteUser(id)
            res.status(200).json(deletedUser)
        } catch(e) {
            console.log(e)
            res.status(500).json({ error: 'Error al eliminar el usuario' })
        }
    }

    static getCurrentUser = async (req: AuthenticatedRequest, res: Response) => {
        if (!req.user){
            return res.status(401).json({ error: 'No autorizado '})
        }
        const userId = req.user.userId; // Middleware pendiente, req.body.userId para que no de error
    
        try {
            const user = await UserModel.getUserById( userId )
            res.status(200).json({ user })
        } catch(e) {
            console.log('[getUserById] Error: ', e)
            res.status(400).json({ error: 'Error al recuperar el usuario'})
        }
    
    }
}