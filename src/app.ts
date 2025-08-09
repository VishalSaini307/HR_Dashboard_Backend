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
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// No need for explicit app.options('*', ...) — cors handles it

app.use(express.json());

connectDB()
  .then(() => console.log(' Database connected successfully'))
  .catch((err) => console.error('Database connection failed:', err));

app.use('/api', userRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/employee-leaves', employeeLeaveRoutes);

app.get('/', (_req, res) => {
  res.send('Server is running!');
});

// Catch-all 404 with CORS headers
app.use((req, res) => {
  const origin = typeof req.headers.origin === 'string' ? req.headers.origin : '';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigins.includes(origin) ? origin : '');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.status(404).send(`Not found: ${req.method} ${req.originalUrl}`);
});

export default app;
