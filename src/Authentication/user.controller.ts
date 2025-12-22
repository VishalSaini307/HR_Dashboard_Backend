import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from './user.model.js';
import passport from 'passport';
import { getCache, setCache } from '../Cache/cacheHelper.js';
import { log } from 'console';


const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES_IN = '2h';

// Registration
export const register = async (req: Request, res: Response) => {
  const { fullName, email, password, confirmPassword } = req.body;
  if (process.env.NODE_ENV !== 'production') {
    console.log('Registration request body:', req.body);
  }
  // Basic validation
  if (!fullName || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match.' });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ fullName, email, password: hashedPassword });
    await user.save();
    return res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error.' });
  }
};

// Login
// Login - Improved version
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required.'
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
export const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email']
});

export const googleCallback = async (req: Request, res: Response) => {
  try {
    const user = req.user as any

    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }

    );
    // Use root frontend URL by default and trim trailing slash if present

    const frontendBase = (process.env.FRONTEND_URL || 'https://hr-dashboard-frontend-five.vercel.app/').replace(/\/$/, '');
    const redirectUrl = `${frontendBase}/google-success?token=${encodeURIComponent(token)}`;

    console.log('🔁 Redirecting OAuth callback to:', redirectUrl);
    // If the request expects JSON, return JSON; otherwise redirect browser to frontend
    if (req.headers.accept?.includes('application/json')) {
      return res.json({ success: true, token, user });
    }

    return res.redirect(redirectUrl);
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Google Authentication Failed' });
  }
};
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?._id;
    const cacheKey = `user:${userId}`;
    
    // Check cache first
    let user = await getCache(cacheKey);
    if (user) {
      return res.json({ success: true, user, fromCache: true });
    }
    
    // Query database
    user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Store in cache
    await setCache(cacheKey, user);
    return res.json({ success: true, user });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};
export const getAllUsers = async (req : Request ,res : Response) =>{
  const cacheKey ="users:all";
  const cachedUsers = await getCache(cacheKey);
  if(cachedUsers){
    console.log("from redis");
    return res.json(cachedUsers)
  }
  const user = await User.find();
  await setCache(cacheKey , user)

  console.log("from mongoDB")
  res.json(user)
}