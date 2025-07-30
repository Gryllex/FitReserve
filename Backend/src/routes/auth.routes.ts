import { Router } from "express";
import { AuthenticationController } from "../controllers/auth.controller.ts";
import { authMiddleware } from "../middlewares/auth.middlewares.ts";

export const authRoutes = Router()

authRoutes.post('/register', AuthenticationController.register)
authRoutes.post('/login', AuthenticationController.login)
authRoutes.post('/logout', authMiddleware, AuthenticationController.logout)
authRoutes.get('/authentication', authMiddleware, AuthenticationController.authentication)