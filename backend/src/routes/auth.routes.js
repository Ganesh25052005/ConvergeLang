import express from 'express';
const router = express.Router();

// import functions 
import { login, logout, signup, onboard, Oauth } from '../controller/auth.controller.js';

import { protectRoute } from '../middleware/middleware.controller.js';
import passport from 'passport';

router.post('/signup',signup);

router.post('/login',login);

router.post('/logout',logout);

router.get('/oauth',passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/oauth/callback',passport.authenticate('google', { session: false, failureRedirect: '/login' }),Oauth)

router.post('/onboarding', protectRoute,onboard);

router.get('/me', protectRoute, (req, res) => {
    res.status(200).json({ user: req.user });
})

export default  router;
