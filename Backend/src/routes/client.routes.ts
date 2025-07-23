import { Router } from "express";
import { SessionController } from '../controllers/session.controller.ts';
import { authMiddleware } from "../middlewares/auth.middlewares.ts";

export const clientRoutes = Router();

// Public routes for clients
clientRoutes.get('/me/sessions', authMiddleware, SessionController.getClientSessions);      // Historial del cliente
clientRoutes.post('/sessions', authMiddleware, SessionController.bookSession);              // Reservar una sesión
clientRoutes.delete('/sessions/:id', authMiddleware, SessionController.cancelSession);      // Cancelar una sesión
