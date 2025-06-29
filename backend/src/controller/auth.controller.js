import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { upsertStreamUser } from "../lib/stream.js";

export async function signup(req, res) {
  const { fullname, email, password,confirmPassword } = req.body;
  try {
    if (!fullname || !email || !password || !confirmPassword)
      return res.status(400).json({ message: "All fields are required" });

    if (password.length < 8)
      return res
        .status(400)
        .json({ message: "Password must be atleast 8 Characters" });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already exists, please use a different one" });
    }
    if(password!==confirmPassword) return res.status(400).json({message:"Passwords don't match"});

    const idx = Math.floor(Math.random() * 1000) + 1;
    const randomAvatar = `https://api.dicebear.com/9.x/micah/svg?seed=${idx}`;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      email: email,
      password: hashedPassword,
      fullname: fullname,
      profilePic: randomAvatar,
    });

    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullname,
        image: newUser.profilePic || "",
      });
      console.log(`Stream user created for ${newUser.fullname}`);
    } catch (error) {
      console.error("Error in Creating Stream User:", error);
    }

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7* 24 * 3600 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    console.log("Error in Signup", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;
  try {
    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    if (password.length < 8)
      return res
        .status(400)
        .json({ message: "Password must be atleast 8 Characters" });

    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ message: "Invalid Credentials" });

    const isCorrectPassword = await bcrypt.compare(password, user.password);

    if (!isCorrectPassword)
      return res.status(400).json({ message: "Invalid Credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ success: true, user: user });
  } catch (error) {
    console.log("Error in login", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export function logout(req, res) {
  try {
    res.clearCookie("jwt");
    res.status(200).json({ success: true, message: "Logout successful" });
  } catch (error) {
    console.log("Error in logout", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


export async function onboard (req, res) {
  const userId = req.user._id;
  try {

    const {fullname,bio,nativeLanguage,learningLanguage,location,profilePic} = req.body;
    if(!fullname || !bio || !nativeLanguage || !learningLanguage || !location) {
      return res.status(400).json({ message: "All fields are required" 
        ,missingFields:[
          !fullname && "fullname",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !location && "location"
        ].filter(Boolean),
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        fullname: fullname,
        bioData: bio,
        profilePic:profilePic,
        nativeLanguage: nativeLanguage,
        learningLanguage: learningLanguage,
        location: location,
        Onboarded: true,
      },
      { new: true }
    );

    if(!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    try {
      await upsertStreamUser({
      id: updatedUser._id.toString(),
      name: updatedUser.fullname,
      image: updatedUser.profilePic || "",
    });
      
    } catch (error) {
      console.error("Error in Updating Stream User:", error);
      return res.status(500).json({ message: "Failed to update Stream user" });
    }

    res.status(200).json({
      success: true,
      message: "Onboarding successful",
      user: updatedUser,
    });
  } catch (error) {
    console.log("Error in onboarding", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


export async function Oauth(req,res) {
  try {
    const token = jwt.sign({ userId: req.user._id.toString() }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.redirect('http://localhost:5173/');

  } catch (error) {
    console.log("Oauth error",error);
    res.status(500).json({ message: "OAuth error", error });
  }
}