import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { checkRole } from "../middleware/role.middleware";


interface AuthRequest extends Request {
  user?: any;
}



export const registerUser = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { email, password , role } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    const exitingUser = await User.findOne({ email });
    if (exitingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      role: role || 'user',
    });

    return res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error registering user", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id , role: user.role},
      process.env.JWT_SECRET || "JSHGD73782HDHD",
      { expiresIn: "1h" }
    );

    return res
      .status(201)
      .json({ message: "Login Successful", token, user: user });
  } catch (error) {
    console.error("Error logging is user:", error);
  }
};

export const getUser = async(req:AuthRequest , res:Response):Promise<any>=>{

  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select("-password");
    if(!user){
      return res.status(404).json({message:"User not Found"});
    }

    return res.status(200).json({user})

  } catch (error) {
    console.error("Error getting user: " , error);
    res.status(500).json({message:"Internal server error"});
  }

}