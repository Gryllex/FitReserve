import { Router } from "express";
import { UserController } from '../controllers/user.controller'


export const userRoutes = Router();
userRoutes.get('/', UserController.getAllUsers);
userRoutes.post('/', UserController.createUser);
userRoutes.patch('/:id', UserController.updateUser);
userRoutes.delete('/:id', UserController.deleteUser);