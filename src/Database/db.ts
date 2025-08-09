//data: src/Database/db.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config(); 

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  throw new Error('MONGO_URI is not defined in environment variables.');
}
console.log('MongoDB URI:', MONGO_URI);

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};