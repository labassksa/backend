//Verify JWT tokens from the Authorization header.
//Decode and attach user payload to the request object for further use.

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { container } from "tsyringe";
import { UserService } from "../services/UserService";
import { User } from "../models/user";

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

export const AuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new Error("No token provided");

    const [, token] = authHeader.split(" ");
    if (!token) throw new Error('Token format is "Bearer [token]"');

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    if (!decoded) throw new Error("Token invalid");

    // Optionally, attach user to request if further user information is needed down the line
    const userService = container.resolve(UserService);
    const user = await userService.findUserById(decoded.id);
    if (!user) throw new Error("User not found");

    // User is found and not null here
    req.user = user;
    console.log(`User object ${req.user}`);
    console.log(`User id ${req.user.id}`);
    console.log("Token is Valid");
    next(); // Token is valid, proceed to the next middleware
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized: " + error });
  }
};
