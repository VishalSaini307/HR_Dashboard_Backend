import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './Database/db';

import userRoutes from './Authentication/user.routes';
import candidateRoutes from './Module/Candidiate/candidiate.routes';
import employeeLeaveRoutes from './Module/EmployeeLeave/employeeleave.routes';
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
  .then(() => console.log('✅ Database connected successfully'))
  .catch((err) => console.error('❌ Database connection failed:', err));

app.use('/api', userRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/employee-leaves', employeeLeaveRoutes);


app.get('/', (_req, res) => {
  res.send('Server is running!');
});

// Catch-all 404 for debugging
app.use((req, res) => {
  res.status(404).send(`Not found: ${req.method} ${req.originalUrl}`);
});

export default app;
