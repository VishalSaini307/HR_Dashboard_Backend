import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    throw new Error('MONGO_URI is not defined in environment variables.');
}
let isConnected = false; // Cache connection across invocations
export const connectDB = async () => {
    if (isConnected)
        return;
    try {
        await mongoose.connect(MONGO_URI);
        isConnected = true;
        console.log('✅ MongoDB connected');
    }
    catch (err) {
        console.error('❌ MongoDB connection error:', err);
        throw err;
    }
};
