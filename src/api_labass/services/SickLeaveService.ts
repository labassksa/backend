import { injectable } from "tsyringe";
import { SickLeave } from "../models/sickLeave";
import { ConsultationService } from "./consultationService";

@injectable()
export class SickLeaveService {
  constructor(private consultationService: ConsultationService) {}

  async issueOrUpdateSickLeave(
    consultationId: number,
    sickLeaveData: Partial<SickLeave>
  ) {
    const consultation =
      await this.consultationService.getConsultationWithRelatedEntity(
        consultationId,
        "sickLeave"
      );

    let sickLeave = consultation.sickLeave || new SickLeave();
    Object.assign(sickLeave, sickLeaveData);
    consultation.sickLeave = sickLeave;
    // Persist changes to the database
    await this.consultationService.saveConsultation(consultation);
  }

  async getSickLeaveByConsultationId(
    consultationId: number
  ): Promise<SickLeave | undefined> {
    const consultation =
      await this.consultationService.getConsultationWithRelatedEntity(
        consultationId,
        "sickLeave"
      );
    return consultation?.sickLeave;
  }
}
