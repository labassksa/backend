import { Request, Response } from "express";
import { injectable, inject } from "tsyringe";
import { SickLeaveService } from "../services/SickLeaveService";

@injectable()
export class SickLeaveController {
  constructor(@inject(SickLeaveService) private sickLeaveService: SickLeaveService) {}

  issueOrUpdateSickLeave = async (req: Request, res: Response) => {
    try {
      const { consultationId } = req.params;
      const sickLeaveData = req.body;
      await this.sickLeaveService.issueOrUpdateSickLeave(Number(consultationId), sickLeaveData);
      res.status(200).json({ message: "Sick leave issued/updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error issuing/updating sick leave", error });
    }
  };

  getSickLeaveByConsultationId = async (req: Request, res: Response) => {
    try {
      const { consultationId } = req.params;
      const sickLeave = await this.sickLeaveService.getSickLeaveByConsultationId(Number(consultationId));
      if (!sickLeave) return res.status(404).json({ message: "Sick leave not found" });
      res.status(200).json(sickLeave);
    } catch (error) {
      res.status(500).json({ message: "Error fetching sick leave", error });
    }
  };
}
