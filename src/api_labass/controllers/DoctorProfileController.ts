// Assuming this file is located at: controllers/DoctorProfileController.ts
import { Request, Response } from "express";
import { injectable, inject } from "tsyringe";
import { DoctorProfileService } from "../services/DoctorProfileService";

@injectable()
export class DoctorProfileController {
  constructor(
    @inject(DoctorProfileService)
    private doctorProfileService: DoctorProfileService
  ) {}

  createDoctor = async (req: Request, res: Response) => {
    try {
      const doctorProfile = await this.doctorProfileService.createDoctor(
        req.body
      );
      res.status(201).json(doctorProfile);
    } catch (error) {
      res.status(500).json({
        message: `Failed to create doctor profile: ${
          error instanceof Error ? error.message : error
        }`,
      });
    }
  };

  /*getAllDoctors:
//Retrieves all doctor profiles along with the count of their consultations. 
This uses a service method that performs a complex operation involving both 
fetching doctor profiles and counting their associated Closed consultations.*/
  getAllDoctors = async (_: Request, res: Response) => {
    try {
      const doctors =
        await this.doctorProfileService.getAllDoctorProfilesWithConsultationCounts();
      res.json(doctors);
    } catch (error) {
      res.status(500).json({
        message: `Failed to retrieve all doctor profiles: ${
          error instanceof Error ? error.message : error
        }`,
      });
    }
  };

  // Placeholder for additional methods such as updateDoctorProfile, deleteDoctorProfile, getDoctorProfileById, etc.
}
