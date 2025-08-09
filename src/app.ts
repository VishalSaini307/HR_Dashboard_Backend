import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; //
import { connectDB } from './Database/db';


import userRoutes from './Authentication/user.routes';
import candidateRoutes from './Module/Candidiate/candidiate.routes';
import employeeLeaveRoutes from './Module/EmployeeLeave/employeeleave.routes';


dotenv.config();

const app = express();


app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true              
}));

app.use(express.json());

connectDB().then(() => {
  console.log('Database connected successfully');
}).catch((err) => {
  console.error('Database connection failed:', err);
});




app.use('/api', userRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/employee-leaves', employeeLeaveRoutes);


app.get('/', (_req, res) => {
  res.send('Server is running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});


