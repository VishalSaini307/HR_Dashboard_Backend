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

// CORS middleware with dynamic origin check & logging
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`❌ CORS blocked for origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

//  Explicitly handle OPTIONS preflight requests
app.options('*', cors());

app.use(express.json());

// Database connection
connectDB()
  .then(() => console.log('Database connected successfully'))
  .catch((err) => console.error('Database connection failed:', err));

// Routes
app.use('/api', userRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/employee-leaves', employeeLeaveRoutes);

app.get('/', (_req, res) => {
  res.send('Server is running!');
});

// Catch-all 404 with CORS headers
app.use((req, res) => {
  const origin = typeof req.headers.origin === 'string' ? req.headers.origin : '';
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  res.status(404).send(`Not found: ${req.method} ${req.originalUrl}`);
});

export default app;
