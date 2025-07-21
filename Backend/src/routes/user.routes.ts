import { Router } from "express";
import { UserController } from '../controllers/user.controller'
import { authMiddleware } from "../middlewares/auth.middlewares";


export const userRoutes = Router();

userRoutes.post('/', UserController.createUser);
userRoutes.patch('/:id', authMiddleware, UserController.updateUser);
userRoutes.delete('/:id', authMiddleware, UserController.deleteUser);
userRoutes.get('/me', authMiddleware, UserController.getCurrentUser);
