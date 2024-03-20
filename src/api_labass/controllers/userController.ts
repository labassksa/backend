import { Request, Response } from "express";
import { injectable, inject } from "tsyringe";
import { UserPatientFacade } from "../services/userPatientFacadeService";
import { UserService } from "../services/UserService";



@injectable()
export class UserController {
  constructor(
    @inject(UserPatientFacade) private userPatientFacade: UserPatientFacade,
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
  fillUserInfoandCreatePatient = async (req: Request, res: Response) => {
    const userInfo = req.body;

    try {
      // Validate request data as necessary
      if (!userInfo) {
        return res.status(400).send({ message: "Missing required fields" });
      }

      // Call the service method to fill user info and create patient profile
      const user = await this.userPatientFacade.fillUserInfoAndCreatePatient(
        req.user.id,
        userInfo,
        req.user.role
      );

      // If successful, return the updated user
      res.status(200).json(user);
    } catch (error) {
      console.error("Error in fillUserInfoandCreatePatient:", error);
      res.status(500).send({
        message: `Error updating user info: ${
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
