import { Request, Response } from "express";
import { injectable, inject } from "tsyringe";
import { SOAPService } from "../services/SOAPService";

@injectable()
export class SOAPController {
  constructor(
    @inject(SOAPService) private soapService: SOAPService
  ) {}

  issueOrUpdateSOAP = async (req: Request, res: Response) => {
    try {
      const { consultationId } = req.params;
      const soapData = req.body;
      await this.soapService.issueOrUpdateSOAP(Number(consultationId), soapData);
      res.status(200).json({ message: "SOAP issued/updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error issuing/updating SOAP", error });
    }
  };

  getSOAPByConsultationId = async (req: Request, res: Response) => {
    try {
      const { consultationId } = req.params;
      const soap = await this.soapService.getSOAPByConsultationId(Number(consultationId));
      if (!soap) return res.status(404).json({ message: "SOAP not found" });
      res.status(200).json(soap);
    } catch (error) {
      res.status(500).json({ message: "Error fetching SOAP", error });
    }
  };
}
