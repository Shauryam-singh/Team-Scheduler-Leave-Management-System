import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import leaveRoutes from '../src/routes/leaveRoutes';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/leaves', leaveRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
