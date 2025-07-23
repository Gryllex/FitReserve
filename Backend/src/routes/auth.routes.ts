import { Router } from "express";
import { AuthenticationController } from "../controllers/auth.controller.ts";

export const authRoutes = Router()

authRoutes.post('/login', AuthenticationController.login)
authRoutes.post('/register', AuthenticationController.register)