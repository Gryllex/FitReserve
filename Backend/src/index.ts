import express from 'express'
import cors from 'cors'
import config from './config'
import { userRoutes } from './routes/user.routes';

const PORT = config.app.PORT;

const app = express();

// middleware
app.use(express.json());
app.use(cors);


// routes
app.use('/api/user', userRoutes);



app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
})