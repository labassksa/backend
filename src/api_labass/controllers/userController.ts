import { Request, Response } from "express";
import { UserService } from "../services/UserService"; // Ensure the path is correct
import { injectable, inject } from "tsyringe";

@injectable()
export class UserController {

  constructor(
    @inject(UserService) private userService: UserService
  ) {}

  createUser = async (req: Request, res: Response) => {
    try {
      const { phoneNumber, role } = req.body;
      const user = await this.userService.createUser(phoneNumber, role);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: "Error creating user", error: error });
    }
  };

  getUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await this.userService.findUserById(Number(id));
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
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

// // Assuming you have a way to handle DI, you would then export an instance of UserController
// // This part is highly dependent on how DI is setup in your application
// const userService = new UserService(); // This should be handled by your DI container in a real app
// const userController = new UserController(userService);

