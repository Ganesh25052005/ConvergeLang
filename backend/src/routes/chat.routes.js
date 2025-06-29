import express from 'express';
const router = express.Router();

import { getStreamtoken } from '../controller/chat.controller.js';
import { protectRoute } from '../middleware/middleware.controller.js';



router.get('/token',protectRoute,getStreamtoken);


export default router;