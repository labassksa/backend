// patientController.ts
import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { PatientService } from "../services/PatientService";

// declare global {
//   namespace Express {
//     interface Request {
//       user: User;
//     }
//   }
// }
export
@injectable() 
class PatientController {
  constructor(
    @inject(PatientService) private patientService: PatientService // Mark as optional to allow instantiation without container
  ) {}

  fillUserInfoandCreatePatient = async (req: Request, res: Response) => {
    const userInfo = req.body;

    try {
      // Call the service method to fill user info and create patient profile
      const user = await this.patientService.createPatientProfileForUser(
        req.user,
        userInfo
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

  createPatient = async (req: Request, res: Response) => {
    try {
      // Call the service method to fill user info and create patient profile
      const patientProfile = await this.patientService.createPatient(req.user);

      res.status(200).json(patientProfile);
    } catch (error) {
      res.status(500).send({
        message: `Error creating patient profile: ${
          error instanceof Error ? error.message : error
        }`,
      });
    }
  };

  getPatient = async (req: Request, res: Response) => {
    try {
      // Call the service method to fill user info and create patient profile
      const patientProfile = await this.patientService.getPatient(req.user);

      res.status(200).json(patientProfile);
    } catch (error) {
      res.status(500).send({
        message: `Error retrieving patient: ${
          error instanceof Error ? error.message : error
        }`,
      });
    }
  };

  async addDependent(req: Request, res: Response) {
    const dependentUserInfo = req.body;
    try {
      if (!this.patientService) {
        throw new Error("PatientService not available");
      }

      const newDependent = await this.patientService.addDependent(
        req.user.id,
        dependentUserInfo,
        req.patientProfile
      );
      res.status(201).json(newDependent);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      }
    }
  }

  async getDependents(req: Request, res: Response) {
    try {
      req.user.id;
      const dependents = await this.patientService.getDependentsForUser(
        req.user.id,
        req.patientProfile
      );
      res.json(dependents);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      }
    }
  }
}
