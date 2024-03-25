import { Repository } from "typeorm";
import { injectable } from "tsyringe";
import { Consultation } from "../models/consultation";
import AppDataSource from "../../configuration/ormconfig";
import { consultationMachine } from "./consultationStateMachine"; // Adjust the import path
import { createActor } from "xstate";
import { UserService } from "./UserService";
import { PatientService } from "./PatientService";
import { ConsultationStatus } from "../../types/consultationstatus";
import { PatientProfile } from "../models/patientProfile";

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
      // Use UserService to find user role or patient/doctor profile
      const user = await this.userService.findUserById(userId);
      const patientProfileResult = await this.patientService.hasPatientProfile(
        userId
      );

      const newConsultation = await this.consultationRepository.create({
        patient: patientProfileResult.profile,
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

  async updateConsultationStatus({
    consultationId,
    newStatus,
  }: {
    consultationId: number;
    newStatus: ConsultationStatus;
  }) {
    try {
      const consultationRepository = AppDataSource.getRepository(Consultation);
      const consultationToUpdate = await consultationRepository.findOne({
        where: { id: consultationId },
      });

      if (!consultationToUpdate) {
        console.log(`Consultation with ID ${consultationId} not found.`);
        throw Error();
      }

      consultationToUpdate.status = newStatus;
      const updatedConsultationStatus = await consultationRepository.save(
        consultationToUpdate
      );
      console.error(
        `Saved Status inside consultationService: ${updatedConsultationStatus.status}`
      );
      return updatedConsultationStatus;
    } catch (error) {
      console.error("Failed to update consultation status:", error);
      throw new Error(`Consultation with ID ${consultationId} not found.`);
    }
    // Delay of 1 second
  }

  async updateStatus(consultationId: number) {
    const consultationActor = createActor(consultationMachine, {
      input: {
        consultationId: consultationId,
      },
    }).start();
    const subscription = consultationActor.subscribe({
      next(snapshot) {
        console.log(
          `the current state from the subscriber inside the service is is is is ${snapshot.value} ${snapshot.context.consultationId}`
        );
        if (snapshot.matches("paid")) {
          // Handle new consultation logic, e.g., notify users
        }
      },
      error(err) {
        // ...
      },
      complete() {
        // ...
      },
    });

    // This event should be dispatched once informed by the Payment Service,
    // Mark the consultation as "paid" and store the payment transaction ID
    consultationActor.send({
      type: "PAYMENT_SUCCESSFUL",
    });

    // This event should be dispatched once the doctor sends it.
    // The consultation doctorOpenedAt field should be updated in the database
    consultationActor.send({
      type: "DOCTOR_STARTS",
    });

    // This event should be distpatched when the patient presses a button.
    // check if the doctor has started or not and send back an apprpriate mesaage
    consultationActor.send({
      type: "PATIENT_JOINS",
    });

    // Chat should be checked if saved or not before the doctor ends the consultation
    // A notification
    consultationActor.send({
      type: "END_CONSULTATION",
    });
    const currentState = consultationActor.getSnapshot().value;
    const currentcontext = consultationActor.getSnapshot().context;
    console.log(
      `the current state after patient joined is:${currentState} , current context status ${currentcontext.status}`
    );
    // console.log(`current status ${currentState}`)
    // const persistedState = consultationMachineActor.getPersistedSnapshot();
    // const snapshot = consultationMachineActor.getSnapshot();
    // console.log(`persistedState is:  ${persistedState}.`);
    // console.log(`snapshot is: ${snapshot}.`);
    // consultationMachineActor.send({
    //   type: "PAYMENT_SUCCESSFUL",
    // });
    // console.log(`persistedState is:  ${persistedState}.`);
    // console.log(`snapshot is: ${snapshot.context}.`);
    // consultationMachineActor.send({
    //   type: "DOCTOR_STARTS",
    // });
    // consultationMachineActor.send({
    //   type: "PATIENT_JOINS",
    // });
    // consultationMachineActor.send({
    //   type: "END_CONSULTATION",
    // });
  }
  // Other service methods...
}
