import express from 'express';
const app = express();

// import and initailize dotenv
import dotenv from 'dotenv';
dotenv.config();

// use json
app.use(express.json());

// import cookieParser and use it
import cookieParser from 'cookie-parser';
app.use(cookieParser());

// import path
import path from 'path';

const __dirname = path.resolve();

import cors from 'cors';

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true, // Allow cookies to be sent
}));


// Importing Routes
import authRoutes from './routes/auth.routes.js';

app.use('/api/auth',authRoutes);

import userRoutes from './routes/user.routes.js';
app.use('/api/users',userRoutes);

import chatRoutes from './routes/chat.routes.js';
app.use('/api/chat',chatRoutes);

// import connectdb to connect to MongoDb
import { connectDb } from './lib/db.js';

// Set Port from env
const PORT = process.env.PORT;

import passport from 'passport';
import './config/passport.js';

app.use(passport.initialize());

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// Running Server
app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`);
    connectDb();
});