import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from '../src/Database/db';

import userRoutes from '../src/Authentication/user.routes';
import candidateRoutes from '../src/Module/Candidiate/candidiate.routes';
import employeeLeaveRoutes from '../src/Module/EmployeeLeave/employeeleave.routes.js';

dotenv.config();
const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://hr-dashboard-frontend-iota.vercel.app'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.options('*', cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());

connectDB()
  .then(() => console.log('Database connected successfully'))
  .catch((err) => console.error('Database connection failed:', err));

app.use('/api', userRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/employee-leaves', employeeLeaveRoutes);

app.get('/', (_req, res) => {
  res.send('Server is running!');
});

export default app; // important for serverless
