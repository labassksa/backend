// controllers/consultationController.ts
import { Request, Response } from "express";
import { container } from "tsyringe";
import { ConsultationService } from "../services/ConsultationService";
import { PatientProfile } from "../models/PatientProfile";

export class ConsultationController {
  async createConsultation(req: Request, res: Response) {
    const { patientProfile } = req;
    console.error(`patient profile from create consultation ${patientProfile}`); // Assuming patientProfile is passed directly or derived from userId
    const userId = req.user.id;
    // Dependency injection to get the ConsultationService instance
    const consultationService = container.resolve(ConsultationService);

    try {
      // Assuming patientProfile is either fetched based on userId or passed in request body
      // You would typically fetch patientProfile from the database based on userId
      const newConsultation = await consultationService.createConsultation(
        userId,
        patientProfile
      );
      res.status(201).json(newConsultation);
    } catch (error) {
      console.error("Error creating consultation:", error);
      res.status(500).send({ message: "Failed to create consultation" });
    }
  }

  // Existing code...

  async getConsultation(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const consultation = await container
        .resolve(ConsultationService)
        .getConsultation(Number(id));
      res.json(consultation);
    } catch (error) {
      console.error("Error getting consultation:", error);
      res.status(404).send({ message: "Consultation not found" });
    }
  }

  async updateConsultation(req: Request, res: Response) {
    const { id } = req.params;
    const updateData = req.body;
    try {
      console.error(
        `the consultation id is ${id} and the typeof is ${typeof id} typeof Number(id) is ${typeof Number(
          id
        )}`
      );
      console.error(
        `the consultation updateData is ${updateData}`
      );
      const idAsnumber = Number(id)
      const updatedConsultation = await container
        .resolve(ConsultationService)
        .updateConsultation(idAsnumber, updateData);
      res.json(updatedConsultation);
    } catch (error) {
      console.error("Error updating consultation:", error);
      res.status(500).send({ message: "Error updating consultation" });
    }
  }

  async deleteConsultation(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await container
        .resolve(ConsultationService)
        .deleteConsultation(Number(id));
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting consultation:", error);
      res.status(404).send({ message: "Consultation not found" });
    }
  }
}