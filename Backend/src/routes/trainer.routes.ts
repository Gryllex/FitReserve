import { Router } from "express";
import { SessionController } from '../controllers/session.controller.ts';
import { authMiddleware } from "../middlewares/auth.middlewares.ts";
import { TrainerController } from "../controllers/trainer.controller.ts";


export const trainerRoutes = Router();

// Routes for trainers
trainerRoutes.get('/me/sessions', authMiddleware,  SessionController.getTrainerSessions);   // Ver sesiones propias
trainerRoutes.delete('/sessions/:id', authMiddleware,  SessionController.cancelSession);    // Cancelar una sesión
trainerRoutes.put('/availability/:id', authMiddleware, TrainerController.updateAvailability)