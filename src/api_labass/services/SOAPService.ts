import { SOAP } from "../models/Soap";
import { injectable, inject } from "tsyringe";
import { ConsultationService } from "./ConsultationService";
import AppDataSource from "../../configuration/ormconfig";
import { Consultation } from "../models/Consultation";

@injectable()
export class SOAPService {
  private readonly consultationRepository =
    AppDataSource.getRepository(Consultation);
  constructor(
    @inject(ConsultationService)
    private consultationService: ConsultationService
  ) {}

  async issueOrUpdateSOAP(consultationId: number, soapData: Partial<SOAP>) {
    // This direct call from SOAP service should be adjusted to call the consultation service instead of Directly using the consultation repo
    const consultation = await this.consultationRepository.findOne({
      where: { id: consultationId },
      relations: ["soap"],
    });
    // If no consultation found, throw an error
    if (!consultation) {
      throw new Error(`Consultation with ID ${consultationId} not found.`);
    }

    let soap = consultation.soap || new SOAP();
    Object.assign(soap, soapData);
    consultation.soap = soap;

    await this.consultationService.saveConsultation(consultation);
  }

  async getSOAPByConsultationId(
    consultationId: number
  ): Promise<SOAP | undefined> {
    // This direct call from SOAP service should be adjusted to call the consultation service instead of Directly using the consultation repo
    const consultation = await this.consultationRepository.findOne({
      where: { id: consultationId },
      relations: ["soap"],
    });
    // If no consultation found, throw an error
    if (!consultation) {
      throw new Error(`Consultation with ID ${consultationId} not found.`);
    }

    return consultation.soap;
  }
}
