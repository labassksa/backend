import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService'; 
import { container } from 'tsyringe'; 

export async function checkUserInfoCompletion(req: Request, res: Response, next: NextFunction) {
  const userId = req.user?.id; 

  if (!userId) {
    return res.status(401).json({ message: 'User ID is missing from the request' });
  }

  const userService = container.resolve(UserService);

  try {
    const isComplete = await userService.checkUserInfo(userId);
    if (!isComplete) {
      return res.status(400).json({ message: 'User profile information is incomplete, complete user information first' });
    }
    next();
  } catch (error) {
    console.error('Middleware error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
