import { Router } from "express";
import { UserController } from '../controllers/user.controller.ts'
import { authMiddleware } from "../middlewares/auth.middlewares.ts";


export const userRoutes = Router();

// userRoutes.post('/', UserController.createUser);
userRoutes.patch('/update', authMiddleware, UserController.updateUser);
userRoutes.delete('/delete', authMiddleware, UserController.deleteUser);
userRoutes.get('/me', authMiddleware, UserController.getCurrentUser);
