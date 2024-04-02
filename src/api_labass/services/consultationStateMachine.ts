import { assign, setup, fromPromise, createActor, emit } from "xstate";
import { ConsultationStatus } from "../../types/consultationstatus";
import { ConsultationService } from "./ConsultationService";
import { container } from "tsyringe";

// async function updateConsultationStatus(
//   consultationId: number,
//   newStatus: ConsultationStatus
// ) {
//   const consultationService = container.resolve(ConsultationService);

//   await consultationService.updateConsultationStatus({
//     consultationId,
//     newStatus,
//   });
// }

// const updateStatusLogic = fromPromise(
//   async ({
//     input,
//   }: {
//     input: { consultationId: number; status: ConsultationStatus };
//   }) => {
//     console.error(
//       `inside FromPromise,  consultationId is: ${input.consultationId} status is:${input.status}`
//     );

//     try {
//       const result = await updateConsultationStatus(
//         input.consultationId,
//         input.status
//       );
//       return result; // Assuming this is successful case
//     } catch (error) {
//       console.error(`Error inside fromPromise:`, error);
//       throw error; // Explicitly throw error to ensure onError transition
//     }
//   }
// );
// const updateStatusActorLogic = createActor(updateStatusLogic, {
//   input: { consultationId: 2, status: ConsultationStatus.New },
// });
const consultationMachine = setup({
  types: {
    emitted: {} as
      | { type: "PAYMENT_SUCCESSFUL" }
      | { type: "doctor_joining"; status: ConsultationStatus }
      | { type: "patient_joining"; status: ConsultationStatus }
      | { type: "notification"; message: string }
      | { type: "error"; error: Error },

    // ...

    // context: {} as {
    //   consultationId: number;
    //   hasDoctorJoined: boolean;
    //   status: ConsultationStatus;
    // },
    input: {} as {
      // Define the input type here
      consultationId: number;
    },
    // events: {} as
    //   | { type: "PAYMENT_SUCCESSFUL" }
    //   | { type: "DOCTOR_STARTS" }
    //   | { type: "PATIENT_JOINS"; hasDoctorJoined: boolean }
    //   | { type: "END_CONSULTATION"; consultationId:number },
  },
  actors: {
    // updateStatus: updateStatusLogic, // Use the promise actor logic for updating status
  },
  actions: {
    // cancelWaitingForDoctorTimer: "waitingForDoctorTimer",
    // Other actions...

    // Define your actions here
    notifyParticipants: assign(({ context }) => {
      // Implementation of your action
      console.log("Notification action placeholder");
      return context;
    }),
    consoleLogValue: ({ context, event }) => {
      if (event.type === "DOCTOR_STARTS") {
        event.type;
        //if Typegen is used No need for the if condtion
      }
    },
  },
  guards: {
    hasDoctorJoined: ({ context }) => {
      console.error(
        `hasDoctorJoined inside the guard from the current context is:  ${context.hasDoctorJoined}`
      );
      return context.hasDoctorJoined;
    },
  },
}).createMachine({
  id: "consultation",
  initial: "PendingPayment",
  context: ({ input }) => ({
    consultationID: input.consultationId,
    hasDoctorJoined: false,
    status: ConsultationStatus.PendingPayment,
  }),
  states: {
    PendingPayment: {
      on: {
        PAYMENT_SUCCESSFUL: {
          target: "Paid",
          actions: emit({
            type: "PAYMENT_SUCCESSFUL",
            status: ConsultationStatus.Paid,
          }),
        },
      },
      // exit: [
      //   // Inline action
      //   ({ context }) => {
      //     console.log(`exit Pending payment with status ${context.status}`);
      //   },
      // ],
    },
    Paid: {
      entry: assign({
        status: ConsultationStatus.Paid,
      }),
      // after: {
      //   timerDuration: {
      //     target: "WaitingForDoctor",
      //     id: "waitingForDoctorTimer",
      //   },
      // },
      on: {
        DOCTOR_STARTS: {
          target: "AfterPayment",
          actions: [
            // emit({
            //   type: "doctor_joining",
            //   status: ConsultationStatus.AfterPayment,
            // }),
            // "cancelWaitingForDoctorTimer",
          ],
        },
      },
      exit: [
        assign({
          status: ConsultationStatus.AfterPayment,
        }),
        // Inline action
        ({ context }) => {
          console.error(`exit paid with status ${context.status}`);
        },
      ],
    },
    AfterPayment: {
      entry: [
        assign({
          status: ConsultationStatus.AfterPayment,
          hasDoctorJoined: true,
        }),
      ],
      // invoke: {
      //   id: "updateConsultationStatus",
      //   src: "updateStatus",
      //   // Pass the current context as input to the promise actor
      //   input: ({ context, event }) => ({
      //     consultationId: context.consultationId,
      //     status: context.status,
      //   }),
      //   onDone: {
      //     target: "Open",
      //     actions: [
      //       ({ event, context }) => {
      //         console.error(
      //           `on Done inside state machine afterPayment state, contextstate: ${context.status} .  event output: ${event.output}`
      //         );
      //       },
      //     ],
      //   },
      //   onError: "AfterPayment",
      // },
      on: {
        PATIENT_JOINS: {
          guard: ({ event }) => {
            return event.hasDoctorJoined;
          },
          target: "Open",
          actions: [
            assign({
              status: ConsultationStatus.Open,
            }),
            emit({
              type: "patient_joining",
              status: ConsultationStatus.Open,
            }),
          ],
        },
      },
    },
    Open: {
      // invoke: {
      //   id: "updateConsultationStatus",
      //   src: "updateStatus",
      //   // Pass the current context as input to the promise actor
      //   input: ({ context, event }) => ({
      //     consultationId: context.consultationId,
      //     status: context.status,
      //   }),
      //   onDone: {
      //     target: "Open",
      //     actions: ({ event, context }) => {
      //       console.error(
      //         `on Done inside state machine afterPayment state, contextstate: ${context.status} .  event output: ${event.output}`
      //       );
      //     },
      //   },
      //   onError: "AfterPayment",
      // },
      on: {
        END_CONSULTATION: {
          target: "SavingClosedAt",
          actions: assign(({ context, event }) => {
            return {
              consultationId: event.consultationId,
            };
          }),
        },
        // a notification should be sent for the customer including the prescription
      },
    },
    SavingClosedAt: {
      entry: [
        assign({
          status: ConsultationStatus.Closed,
        }),
        ({ context }) => {
          console.error(
            `entered SavingClosedAt with context.consultationId: ${context.consultationId}`
          );
          assign({
            status: ConsultationStatus.Closed,
          });
        },
      ],
      // invoke: {
      //   id: "updateConsultationStatus",
      //   src: "updateStatus",
      //   // Pass the current context as input to the promise actor

      //   input: ({ context, event }) => ({
      //     consultationId: event.consultationId,
      //     status: context.status,
      //   }),
      //   onDone: "Closed",
      //   onError: {},
      // },
    },
    Closed: {
      entry: [
        assign({
          status: ConsultationStatus.Closed,
        }),
      ],
      type: "final",
    },
  },
});

export { consultationMachine };
