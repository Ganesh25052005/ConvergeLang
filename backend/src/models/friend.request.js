import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    status:{   
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending"
    }, 
},
{
    timestamps:true
}
);

const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);
export default FriendRequest;