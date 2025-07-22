import { Router } from "express";
import { SessionController } from '../controllers/session.controller';
import { authMiddleware } from "../middlewares/auth.middlewares";
import { TrainerController } from "../controllers/trainer.controller";


export const trainerRoutes = Router();

// Routes for trainers
trainerRoutes.get('/me/sessions', authMiddleware,  SessionController.getTrainerSessions);   // Ver sesiones propias
trainerRoutes.delete('/sessions/:id', authMiddleware,  SessionController.cancelSession);    // Cancelar una sesión
trainerRoutes.put('/availability/:id', authMiddleware, TrainerController.updateAvailability)