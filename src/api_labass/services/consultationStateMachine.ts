import { assign, setup, fromPromise, createActor } from "xstate";
import { ConsultationStatus } from "../../types/consultationstatus";
import { ConsultationService } from "./consultationService";
import { container } from "tsyringe";
import { resolve } from "path";

async function updateConsultationStatus(
  consultationId: number,
  newStatus: ConsultationStatus
) {
  const consultationService = container.resolve(ConsultationService);

  await consultationService.updateConsultationStatus({
    consultationId,
    newStatus,
  });
}

const updateStatusLogic = fromPromise(
  async ({
    input,
  }: {
    input: { consultationId: number; status: ConsultationStatus };
  }) => {
    console.log(
      `inside Frompromise status consultationId is: ${input.consultationId} status is:${input.status}`
    );
    try {
      const result = await updateConsultationStatus(
        input.consultationId,
        input.status
      );
      return result; // Assuming this is successful case
    } catch (error) {
      console.error(`Error inside fromPromise:`, error);
      throw error; // Explicitly throw error to ensure onError transition
    }
  }
);
// const updateStatusActorLogic = createActor(updateStatusLogic, {
//   input: { consultationId: 2, status: ConsultationStatus.New },
// });
const consultationMachine = setup({
  types: {
    context: {} as {
      consultationId: number;
      hasDoctorJoined: boolean;
      patientJoined: boolean;
      status: ConsultationStatus;
    },
    input: {} as {
      // Define the input type here
      consultationId: number;
    },
    events: {} as
      | { type: "PAYMENT_SUCCESSFUL" }
      | { type: "DOCTOR_STARTS" }
      | { type: "PATIENT_JOINS" }
      | { type: "END_CONSULTATION" },
  },
  actors: {
    updateStatus: updateStatusLogic, // Use the promise actor logic for updating status
  },
  actions: {
    // Define your actions here
    notifyParticipants: assign(({ context }) => {
      // Implementation of your action
      console.log("Notification action placeholder");
      return context;
    }),
    consoleLogValue: ({ context, event }) => {
      if (event.type === "DOCTOR_STARTS") {
      }
    },
  },
  guards: {
    hasDoctorJoined: ({ context }) => {
      return context.hasDoctorJoined;
    },
  },
}).createMachine({
  id: "consultation",
  initial: "pendingPayment",
  context: ({ input }) => ({
    consultationId: input.consultationId,
    hasDoctorJoined: false,
    patientJoined: false,
    status: ConsultationStatus.PendingPayment,
  }),
  states: {
    pendingPayment: {
      on: {
        PAYMENT_SUCCESSFUL: {
          target: "new",
        },
      },
      exit: assign({ status: ({ context }) => ConsultationStatus.New }),
    },
    new: {
      entry: assign({
        status: ConsultationStatus.New,
      }),
      on: {
        DOCTOR_STARTS: {
          target: "afterPayment",
          actions: "consoleLogValue",
        },
      },
      exit: [
        // Inline action
        ({ context, event }) => {
          console.log(`exit new with status ${context.status}`);
        },
        assign({
          status: ConsultationStatus.AfterPayment,
        }),
      ],
    },
    afterPayment: {
      entry: [
        assign({
          status: ConsultationStatus.AfterPayment,
          hasDoctorJoined: true,
        }),
        ({ context }) => {
          console.log(
            `entered afterpayment with status ${context.status} has doctor Joined ${context.hasDoctorJoined}`
          );
        },
      ],
      invoke: {
        id: "updateConsultationStatus",
        src: "updateStatus",
        // Pass the current context as input to the promise actor
        input: ({ context }) => ({
          consultationId: context.consultationId,
          status: context.status,
        }),
        onDone: "open",
        onError: "afterPayment",
      },
      on: {
        PATIENT_JOINS: {
          guard: "hasDoctorJoined",
          target: "open",
        },
      },
    },
    open: {
      on: {
        END_CONSULTATION: {
          target: "closed",
        },
      },
    },
    closed: {
      type: "final",
    },
  },
});

const consultationMachineActor = createActor(consultationMachine, {
  input: {
    consultationId: 5,
  },
});
// At the end of your consultationMachine definition file

// const currentState = consultationMachineActor.getSnapshot();

// console.log(`State is: ${consultationMachineActor.getSnapshot().value}`);
// consultationMachineActor.send({ type: "PAYMENT_SUCCESSFUL" });
// //when the paiment is successful and "PAYMENT_SUCCESSFUL" event is sent, the patientPaidAt should be stored in the database

// //question for gpt: should we enter the consultationId to the actor or restored actor with restored state , or pass it with the event in the send method
// console.log(`State is: ${consultationMachineActor.getSnapshot().value}`);
// // console.log(
// //   `Persisted Snapshot: ${consultationMachineActor.getPersistedSnapshot()}`
// // );
// console.log(
//   "Payment is successful but doctor did not start the consultation"
// );
// //Payment is successful but doctor did not start the consultation,
// // this event is sent after verifying payment from payment service, which informs the consultation service, which hence send the "PAYMENT_SUCCESSFUL" event with asoociated context if needed.
// console.log(
//   `Doctor Joined the  consultation? ${
//     consultationMachineActor.getSnapshot().context.doctorJoined
//   }`
// );
// //The online doctor will be able to start the consultation, doctorOpenedAT should saved to the database
// consultationMachineActor.send({ type: "DOCTOR_STARTS" });
// console.log(
//   "Doctor Starts the consultation , DOCTOR_STARTS event sent "
// );
// console.log(`State is: ${consultationMachineActor.getSnapshot().value}`);
// console.log(
//   `Doctor Joined the  consultation? ${
//     consultationMachineActor.getSnapshot().context.doctorJoined
//   }`
// );
// // The patient joins the consultation's chat conversation,
// // patientJoinedAt should be stored in the database after "PATIENT_JOINS" event is triggered from the consultation service which uses the consultationStateMachine.
// consultationMachineActor.send({ type: "PATIENT_JOINS" });
// console.log(
//   `Doctor Joined the  consultation and PATIENT_JOINS? ${
//     consultationMachineActor.getSnapshot().context.doctorJoined
//   }`
// );
// console.log(`State is: ${consultationMachineActor.getSnapshot().value}`);
// // console.log(`Context is: ${consultationMachineActor.getSnapshot().context}`);

// consultationMachineActor.send({ type: "END_CONSULTATION" });
// //when the doctor ends the consultation, closedAt and consultation status should be saved to the database.
// console.log(`State is: ${consultationMachineActor.getSnapshot().value}`);
// // console.log(`Context is: ${consultationMachineActor.getSnapshot().context}`);

// // consultationMachineActor.send({ type: "PATIENT_JOINS" });
// // console.log(currentState.value);

// // const nextSnapshot = getNextSnapshot(
// //   consultationMachine,
// //   consultationMachine.resolveState({
// //     value: "pendingPayment" ,
// //     context: undefined ,
// //   }),
// // { type: 'DOCTOR_STARTS' }
// // );
// //You can access an actor’s emitted state (or snapshot) by subscribing to or reading from the actor’s .getSnapshot() method.

export { consultationMachine, consultationMachineActor };
