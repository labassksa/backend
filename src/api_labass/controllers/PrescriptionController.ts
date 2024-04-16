import { Request, Response } from "express";
import { injectable, inject } from "tsyringe";
import { PrescriptionService } from "../services/prescriptionService";

@injectable()
export class PrescriptionController {
  constructor(
    @inject(PrescriptionService)
    private prescriptionService: PrescriptionService
  ) {}

  issueOrUpdatePrescription = async (req: Request, res: Response) => {
    try {
      const { consultationId } = req.params;
      const prescriptionData = req.body;
      await this.prescriptionService.issueOrUpdatePrescription(
        Number(consultationId),
        prescriptionData
      );
      res
        .status(200)
        .json({ message: "Prescription issued/updated successfully." });
    } catch (error) {
      res.status(500).json({
        message: `Error issuing/updating prescription: ${
          error instanceof Error ? error.message : error
        }`,
      });
    }
  };

  getPrescriptionByConsultationId = async (req: Request, res: Response) => {
    try {
      const { consultationId } = req.params;
      const prescription =
        await this.prescriptionService.getPrescriptionByConsultationId(
          Number(consultationId)
        );
      if (!prescription) {
        return res.status(404).json({ message: "Prescription not found" });
      }
      res.status(200).json(prescription);
    } catch (error) {
      res.status(500).json({
        message: `Error fetching prescription: ${
          error instanceof Error ? error.message : error
        }`,
      });
    }
  };
}
