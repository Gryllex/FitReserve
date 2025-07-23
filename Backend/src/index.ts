import express from 'express'
import cors from 'cors'
import config from './config.js'
import { userRoutes } from './routes/user.routes.ts';
import { clientRoutes } from './routes/client.routes.ts';
import { trainerRoutes } from './routes/trainer.routes.ts';
import { authRoutes } from './routes/auth.routes.ts';

const PORT = config.app.PORT;

const app = express();

// middleware
app.use(express.json());
app.disable('x-powered-by')
app.use(cors({
    origin: 'http://localhost:8000'
}));



// routes
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/trainers', trainerRoutes);


app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port http://localhost:${PORT}`);
})