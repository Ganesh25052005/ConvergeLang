import express from 'express';
import { protectRoute } from '../middleware/middleware.controller.js';
import { acceptFriendRequest, getFriendrequests, getMyFriends, getOutgoingRequests, getRecommendedUsers, sendFriendRequest } from '../controller/user.controller.js';

const router = express.Router();

// apply middleware to protect all routes in this router
router.use(protectRoute);

router.get('/getRecommendations',getRecommendedUsers)

router.get('/friends',getMyFriends);

router.post('/friend-request/:id', sendFriendRequest);

router.put('/friend-request/:id/accept', acceptFriendRequest);

router.get('/friend-requests',getFriendrequests);

router.get('/outgoing-requests',getOutgoingRequests);


export default router;