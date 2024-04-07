import { Request, Response } from "express";
import { injectable, inject } from "tsyringe";
import { UserService } from "../services/UserService";



@injectable()
export class UserController {
  constructor(
    @inject(UserService) private userService: UserService
  ) {}

  createPartialUser = async (req: Request, res: Response) => {
    try {
      const { phoneNumber, role } = req.body;
      const user = await this.userService.createPartialUser(phoneNumber, role);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({
        message: `Error creating user: ${
          error instanceof Error ? error.message : error
        }`,
      });
    }
  };

  completeUserInfo = async (req: Request, res: Response) => {
    const userInfo = req.body;

    try {
      // Call the service method to fill user info and create patient profile
      const user = await this.userService.completeUserInfo(req.user, userInfo);
      console.log(`user inside user info in patient controller: ${user}`);
      // If successful, return the updated user
      res.status(200).json(user);
    } catch (error) {
      console.error("Error in fillUserInfo", error);
      res.status(500).send({
        message: `Error completing user info: ${
          error instanceof Error ? error.message : error
        }`,
      });
    }
  };

  getUser = async (req: Request, res: Response) => {
    try {
      const user = await this.userService.findUserById(Number(req.user.id));
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user", error: error });
    }
  };
  getUsers = async (req: Request, res: Response) => {
    try {
      const users = await this.userService.getUsers();
      if (!users) {
        return res.status(404).json({ message: "Users not found" });
      }
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user", error: error });
    }
  };

  updateUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userData = req.body;
      const updatedUser = await this.userService.updateUser(
        Number(id),
        userData
      );
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Error updating user", error: error });
    }
  };

  deleteUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.userService.deleteUser(Number(id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting user", error: error });
    }
  };

  
}
