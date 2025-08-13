import { Router } from "express";
import { SessionController } from '../controllers/session.controller.ts';
import { authMiddleware } from "../middlewares/auth.middlewares.ts";
import { TrainerController } from "../controllers/trainer.controller.ts";


export const trainerRoutes = Router();

// Routes for trainers
trainerRoutes.get('/me/sessions', authMiddleware,  SessionController.getTrainerSessions);       // Ver sesiones propias
trainerRoutes.put('/sessions/:id', authMiddleware,  SessionController.cancelSession);        // Cancelar una sesión
trainerRoutes.get('/availability', authMiddleware, TrainerController.getAvailabilityByTrainer); // Get schedule
trainerRoutes.put('/availability/', authMiddleware, TrainerController.updateAvailability);      // Update schedule