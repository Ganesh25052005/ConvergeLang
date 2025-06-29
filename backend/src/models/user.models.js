import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    fullname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:8
    },
    profilePic:{
        type:String,
        default:""
    },
    bioData:{
        type:String,
        default:""
    },
    nativeLanguage:{
        type:String,
        default:""
    },
    learningLanguage:{
        type:String,
        default:""
    },
    location:{
        type:String,
        default:""
    },
    Onboarded:{
        type:Boolean,
        default:false
    },

    friends: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
        }
    ]
},
{
    timestamps:true
});

const User = mongoose.model("User",UserSchema);

export default User;