import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import serverless from 'serverless-http';
import { connectDB } from '../src/Database/db';

import userRoutes from '../src/Authentication/user.routes';
import candidateRoutes from '../src/Module/Candidiate/candidiate.routes';
import employeeLeaveRoutes from '../src/Module/EmployeeLeave/employeeleave.routes.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true              
}));

app.use(express.json());

// Connect to DB
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


export default serverless(app);
