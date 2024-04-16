import { Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
import { PatientService } from "../services/patientService"; // Adjust the import path to where your PatientService is located
import { PatientProfile } from "../models/patientProfile";

async function isPatientProfileCompleted(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Assuming the user ID is stored in the request, e.g., from a previous authentication middleware
  const userId = req.user.id; // Or however you store/access the user ID

  if (!userId) {
    return res.status(401).send({ message: "User not authenticated." });
  }

  // Use dependency injection to get the PatientService instance
  const patientService = container.resolve(PatientService);

  try {
    const { exists, profile, message } = await patientService.hasPatientProfile(
      userId
    );

    if (!profile) {
      // If the patient profile does not exist, return an error response
      return res.status(400).send({ message: message });
      // If the profile exists, attach it to the request object
    }
    // attach patient profile to the request
    req.patientProfile = profile;
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    console.error(" Middleware error checking for patient profile:", error);
    return res.status(500).send({
      message: "Internal server error while checking patient profile.",
    });
  }
}

export { isPatientProfileCompleted };
