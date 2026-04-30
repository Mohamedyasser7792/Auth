import { Request, Response, NextFunction , RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { checkRole } from "./role.middleware";

interface AuthRequest extends Request {
  user?: any;
}

export const verifyToken:RequestHandler = (
  req:AuthRequest,
  res:Response,
  next:NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader?.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    (req as AuthRequest).user = decoded;
    next();

  } catch (error) {
console.error('Token verification error' , error)
return res.status(403).json({message:"Forbidden"})
  }
};
