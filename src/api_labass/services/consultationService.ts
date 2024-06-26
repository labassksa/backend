import { Repository } from "typeorm";
import { injectable } from "tsyringe";
import { Consultation } from "../models/consultation";
import AppDataSource from "../../configuration/ormconfig";
import { consultationMachine } from "./consultationStateMachine";
import { createActor, StateValue } from "xstate";
import { UserService } from "./userService";
import { PatientService } from "./patientService";
import { ConsultationStatus } from "../../types/consultationstatus";
import { PatientProfile } from "../models/patientProfile";
import { eventNames } from "process";
import e from "express";

@injectable()
export class ConsultationService {
  private consultationRepository: Repository<Consultation> =
    AppDataSource.getRepository(Consultation);
  constructor(
    private userService: UserService, // Automatic injection by class type
    private patientService: PatientService
  ) {}

  async createConsultation(
    userId: number,
    patientProfile: PatientProfile
  ): Promise<Consultation> {
    try {
      // The patient should be able to create a consultation without filling the profile, it should be completed after payment and before starting the consultation
      // patientProfile = this.patientService.createProvile()
      const newConsultation = this.consultationRepository.create({
        patient: patientProfile,
      });
      const savedNewConsultation = await this.consultationRepository.save(
        newConsultation
      );

      return savedNewConsultation;
    } catch (error) {
      // Better error propagation
      console.error("Error creating consultation:", error);
      throw new Error("Failed to create consultation");
    }
  }

  // Other service methods...
  async getConsultationById(id: number): Promise<Consultation> {
    const consultation = await this.consultationRepository.findOneBy({ id });
    if (!consultation) {
      throw new Error(`Consultation with ID ${id} not found.`);
    }
    return consultation;
  }

  // async getAllConsultationsForPatient(
  //   patientId: number
  // ): Promise<Consultation[]> {
  //   // Use find() to retrieve all consultations for a given patientId
  //   const consultations = await this.consultationRepository.find({
  //     where: { patient: { id: patientId } },
  //     relations: ["doctor", "patient", "prescription", "soap", "sickLeave"],
  //   });

  //   if (consultations.length === 0) {
  //     // If no consultations found, throw an error or handle as needed
  //     throw new Error(
  //       `No consultations found for patient with ID ${patientId}.`
  //     );
  //   }

  //   return consultations;
  // }

  async getAllConsultationsForPatient(patientId: number): Promise<Consultation[]> {
    const consultations = await this.consultationRepository.find({
      where: { patient: { id: patientId } },
      relations: [
        "doctor.user", // Assuming 'user' is the relation from DoctorProfile to User
        "patient.user", // Assuming 'user' is the relation from PatientProfile to User
        "prescription", 
        "soap", 
        "sickLeave"
      ],
    });
  
    if (consultations.length === 0) {
      throw new Error(`No consultations found for patient with ID ${patientId}.`);
    }
  
    return consultations;
  }
  

  async updateConsultation(
    id: number,
    updateData: Partial<Consultation>
  ): Promise<Consultation> {
    await this.consultationRepository.update(id, updateData);
    return this.getConsultationById(id);
  }

  //These methods is designed to be used by Prescription, SOAP, and Sick leave to issue/update a consultation
  // and retrieve a consultation with the the related entity
  async saveConsultation(
    consultation: Partial<Consultation>
  ): Promise<Consultation> {
    const savedConsultation = await this.consultationRepository.save(
      consultation
    );
    return savedConsultation;
  }

  // Other service methods...
  async getConsultationWithRelatedEntity(
    id: number,
    relatedEntity: string
  ): Promise<Consultation> {
    const consultation = await this.consultationRepository.findOne({
      where: { id: id },
      relations: [relatedEntity],
    });
    if (!consultation) {
      throw new Error(`Consultation with ID ${id} not found.`);
    }
    return consultation;
  }

  async deleteConsultation(id: number): Promise<void> {
    const deletionResult = await this.consultationRepository.delete(id);
    if (deletionResult.affected === 0) {
      throw new Error(`Consultation with ID ${id} not found.`);
    }
  }

  async improvedupdateStatus(consultationId: number, eventType: string) {
    let consultationToUpdate = await this.consultationRepository.findOne({
      where: { id: consultationId },
    });

    if (!consultationToUpdate) {
      console.error(`Consultation with ID ${consultationId} not found.`);
      throw new Error(`Consultation with ID ${consultationId} not found.`);
    }

    // Prepare the actor with the current state
    const currentStateFromDB = consultationToUpdate.status;
    const consultationActor = createActor(consultationMachine, {
      input: { consultationId },
      snapshot: consultationMachine.resolveState({
        value: currentStateFromDB,
        context: {
          consultationId,
          hasDoctorJoined: !!consultationToUpdate.doctorJoinedAT,
          // Add other context properties as needed
        },
      }),
    }).start();

    // Handle the event based on the event type
    switch (eventType) {
      case "PAYMENT_SUCCESSFUL":
        consultationToUpdate.patientPaidAT = new Date();
        consultationToUpdate.status = ConsultationStatus.Paid;
        consultationActor.on("PAYMENT_SUCCESSFUL", async (event) => {
          console.error(
            `Hello from inside actor on from the improved updatestatus
            `
          );
        });
        consultationActor.send({ type: "PAYMENT_SUCCESSFUL" });
        break;
      case "DOCTOR_STARTS":
        consultationToUpdate.doctorJoinedAT = new Date();
        consultationToUpdate.status = ConsultationStatus.AfterPayment;
        //assign a doctor for the consultation

        consultationActor.send({ type: "DOCTOR_STARTS" });
        break;
      case "PATIENT_JOINS":
        if (consultationToUpdate.doctorJoinedAT) {
          consultationToUpdate.patientJoinedAT = new Date();
          consultationToUpdate.status = ConsultationStatus.Open;

          consultationActor.send({ type: "PATIENT_JOINS" });
        } else {
          console.error("Doctor has not joined yet.");
          // Handle the case when the doctor hasn't joined
        }
        break;
      case "END_CONSULTATION":
        consultationToUpdate.closedAt = new Date();
        consultationToUpdate.status = ConsultationStatus.Closed;

        consultationActor.send({ type: "END_CONSULTATION" });
        break;
      default:
        console.error(`Unhandled event type: ${eventType}`);
        break;
    }

    // Persist the changes in the database
    try {
      const updatedConsultationStatus = await this.consultationRepository.save(
        consultationToUpdate
      );
      console.log(
        `Data persisted for consultation ID ${consultationId}:`,
        updatedConsultationStatus
      );
    } catch (error) {
      console.error(
        `Failed to persist changes for consultation ID ${consultationId}:`,
        error
      );
      throw error;
    }
  }

  async updateStatusfrominvokedActor(
    this: any,
    consultationId: number,
    status: ConsultationStatus
  ) {
    const consultationToUpdate = await this.consultationRepository.findOne({
      where: { id: consultationId },
    });

    if (!consultationToUpdate) {
      console.error(`Consultation with ID ${consultationId} not found.`);
      throw new Error(`Consultation with ID ${consultationId} not found.`);
    }

    const consultationActor = createActor(consultationMachine, {
      input: { consultationId },
      // Ensure you've initialized the actor with the current state appropriately
    }).start();

    let updateData = {};

    switch (status) {
      case ConsultationStatus.Paid:
        updateData = {
          patientPaidAT: new Date(),
        };
        consultationActor.send({ type: "PAYMENT_SUCCESSFUL" });
        break;
      case ConsultationStatus.AfterPayment:
        updateData = {
          doctorJoinedAT: new Date(),
        };
        consultationActor.send({ type: "DOCTOR_STARTS" });
        break;
      case ConsultationStatus.Open:
        if (consultationToUpdate.doctorJoinedAT) {
          updateData = {
            patientJoinedAT: new Date(),
          };
          consultationActor.send({ type: "PATIENT_JOINS" });
        } else {
          console.error("Doctor has not joined yet.");
        }
        break;
      case ConsultationStatus.Closed:
        updateData = {
          closedAt: new Date(),
        };
        consultationActor.send({ type: "END_CONSULTATION" });
        break;
      default:
        console.error(`Unhandled status: ${status}`);
        break;
    }

    // Update changes in the database
    try {
      await this.consultationRepository.updateConsultation(
        { id: consultationId },
        updateData
      );
      console.log(`Data updated for consultation ID ${consultationId}`);
    } catch (error) {
      console.error(
        `Failed to update changes for consultation ID ${consultationId}:`,
        error
      );
      throw error;
    }
  }
}
