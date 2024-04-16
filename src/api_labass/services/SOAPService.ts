import { SOAP } from "../models/soap";
import { injectable, inject } from "tsyringe";
import { ConsultationService } from "./consultationService";
import AppDataSource from "../../configuration/ormconfig";
import { Consultation } from "../models/consultation";

@injectable()
export class SOAPService {
  private readonly consultationRepository =
    AppDataSource.getRepository(Consultation);
  constructor(
    @inject(ConsultationService)
    private consultationService: ConsultationService
  ) {}

  async issueOrUpdateSOAP(consultationId: number, soapData: Partial<SOAP>) {
    const consultation =
      await this.consultationService.getConsultationWithRelatedEntity(
        consultationId,
        "prescription"
      );

    let soap = consultation.soap || new SOAP();
    Object.assign(soap, soapData);
    consultation.soap = soap;

    await this.consultationService.saveConsultation(consultation);
  }

  async getSOAPByConsultationId(
    consultationId: number
  ): Promise<SOAP | undefined> {
    const consultation =
      await this.consultationService.getConsultationWithRelatedEntity(
        consultationId,
        "soap"
      );
    // If no consultation found, throw an error
    if (!consultation) {
      throw new Error(`Consultation with ID ${consultationId} not found.`);
    }

    return consultation.soap;
  }
}
