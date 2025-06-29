import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../models/user.models.js";


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BASE_URL}/api/auth/oauth/callback`
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let Oauth_user = await User.findOne({ email:profile.emails[0].value });
    if (!Oauth_user) {
    const randomPassword = crypto.randomBytes(32).toString("hex");
    const hashedPassword = await bcrypt.hash(randomPassword, 10);
      Oauth_user = await User.create({
        fullname: profile.displayName,
        email: profile.emails[0].value,
        password:hashedPassword
      });
    }
    return done(null, Oauth_user);
  } catch (err) {
    return done(err, null);
  }
}));
