import { Router } from 'express';
import { register, login, googleAuth, googleCallback } from './user.controller.js';
import passport from 'passport';
const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/google', googleAuth);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  googleCallback
);

export default router;
