import express from 'express'
import cors from 'cors'
import config from './config'
import { userRoutes } from './routes/user.routes';
import { clientRoutes } from './routes/client.routes';
import { trainerRoutes } from './routes/trainer.routes';
import { authRoutes } from './routes/auth.routes';

const PORT = config.app.PORT;

const app = express();

// middleware
app.use(express.json());
app.use(cors());


// routes
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/trainers', trainerRoutes);


app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port http://localhost:${PORT}`);
})