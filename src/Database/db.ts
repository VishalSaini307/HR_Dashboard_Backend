import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// Support both MONGO_URI and MONGODB_URI environment variable names
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

let isConnected = false; // Cache connection across invocations

export const connectDB = async () => {
  if (isConnected) return;

  if (!MONGO_URI) {
    const msg = 'MONGO_URI or MONGODB_URI is not defined in environment variables.';
    console.error(msg);
    throw new Error(msg);
  }

  try {
    await mongoose.connect(MONGO_URI);
    isConnected = true;
    if (process.env.NODE_ENV !== 'production') {
      console.log('✅ MongoDB connected');
    }
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    throw err;
  }
};
