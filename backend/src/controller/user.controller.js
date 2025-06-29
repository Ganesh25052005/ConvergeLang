import FriendRequest from "../models/friend.request.js";
import User from "../models/user.models.js";


export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user._id;
    const currentUser = req.user;
    const recommededUsers =await User.find({
    _id: { $ne: currentUserId, $nin: currentUser.friends },
    Onboarded:true
}).select("-password");
    res.status(200).json({
      success: true,
      data: recommededUsers,
    });
  } catch (error) {
    console.error("Error fetching recommended users:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
export async function getMyFriends(req, res) {
  try {
    const user = await User.findById(req.user._id)
      .select("friends")
      .populate(
        "friends",
        "fullname profilePic nativeLanguage learningLanguage"
      );
    res.status(200).json({
      success: true,
      data: user.friends,
    });
  } catch (error) {
    console.error("Error fetching friends:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch friends",
    });
  }
}

export async function sendFriendRequest(req, res) {
  try {
    const senderId = req.user._id;
    const { id: receiverId } = req.params;
    if (senderId === receiverId) {
      return res.status(400).json({
        success: false,
        message: "You cannot send a friend request to yourself",
      });
    }
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: "Recipient not found",
      });
    }
    if (receiver.friends.includes(senderId)) {
      return res.status(400).json({
        success: false,
        message: "You are already friends with this user",
      });
    }
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "Friend request already exists",
      });
    }

    const request = await FriendRequest.create({
      sender: senderId,
      receiver: receiverId,
    });

    res.status(201).json({
      success: true,
      data: request,
    });
  } catch (error) {
    console.error("Error sending friend request:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function acceptFriendRequest(req, res) {
  try {
    const userId = req.user._id;
    const { id: requestId } = req.params;

    const request = await FriendRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Friend request not found",
      });
    }

    if (request.receiver.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only accept requests sent to you",
      });
    }

    request.status = "accepted";
    await request.save();

    // Add each other as friends
    await User.findByIdAndUpdate(request.sender, {
      $addToSet: { friends: request.receiver },
    });

    await User.findByIdAndUpdate(request.receiver, {
      $addToSet: { friends: request.sender },
    });

    res.status(200).json({
      success: true,
      message: "Friend request accepted",
    });
  } catch (error) {
    console.error("Error accepting friend request:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}


export async function getFriendrequests(req, res) {
    try {
        
        const incomingRequests = await FriendRequest.find({
            receiver: req.user._id,
            status: "pending"
        }).populate("sender", "fullname profilePic nativeLanguage learningLanguage");

        const acceptedRequests = await FriendRequest.find({
            sender: req.user._id,
            status: "accepted"
        }).populate("receiver", "fullname profilePic");

        res.status(200).json({
            success: true,
            data: {
                incomingRequests,
                acceptedRequests
            }
        });
    } catch (error) {
        console.error("Error fetching friend requests:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}

export async function getOutgoingRequests(req, res) {
    try {
        const requests = await FriendRequest.find({
            sender: req.user._id,
            status: "pending"
        }).populate("receiver", "fullname profilePic nativeLanguage learningLanguage");

        res.status(200).json({
            success: true,
            data: requests
        });
    } catch (error) {
        console.error("Error fetching outgoing friend requests:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
        
    }
}