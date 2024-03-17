// patientController.ts
import { Request, Response } from "express";
import { autoInjectable, inject, injectable } from "tsyringe";
import { PatientService } from "../services/PatientService";
import { User } from "../models/user";

// declare global {
//   namespace Express {
//     interface Request {
//       user: User;
//     }
//   }
// }
export
@injectable() // Use @autoInjectable for classes that might be instantiated without the container.
class PatientController {
  constructor(
    @inject(PatientService) private patientService: PatientService // Mark as optional to allow instantiation without container
  ) {}

  async addDependent(req: Request, res: Response) {
    const dependentUserInfo = req.body;
    try {
      if (!this.patientService) {
        throw new Error("PatientService not available");
      }

      const newDependent = await this.patientService.addDependent(
        req.user.id,
        dependentUserInfo
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
        req.user.id
      );
      res.json(dependents);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      }
    }
  }
}
