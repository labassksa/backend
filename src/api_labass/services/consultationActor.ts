// import { consultationMachine } from "./consultationStateMachine"; // Adjust the import path
// import { createActor } from "xstate";

//  export const consultationActor = createActor(consultationMachine).start();
// // const subscription = consultationActor.subscribe({
// //   next(snapshot) {
// //     console.log(snapshot.value);
// //     if (snapshot.matches("new")) {
// //       // Handle new consultation logic, e.g., notify users
// //       console.log(`the new state from the subscriber is is is is ${snapshot.value} ${snapshot.context.consultationId}`);

// //       const consultationId = snapshot.context.consultationId;
// //       const newStatus = snapshot.context.status;
// //     }
// //   },
// //   error(err) {
// //     // ...
// //   },
// //   complete() {
// //     // ...
// //   },
// // });

// // const persistedState = consultationActor.getPersistedSnapshot();
// // const snapshot = consultationActor.getSnapshot();
// // console.log(`persistedState is:  ${persistedState}.`);
// // console.log(`snapshot is: ${snapshot}.`);



// // console.log(`persistedState is:  ${persistedState}.`);
// // console.log(`snapshot is: ${snapshot.context}.`);
// // // consultationActor.send({
// //   type: "DOCTOR_STARTS",
// // });
// // consultationActor.send({
// //   type: "PATIENT_JOINS",
// // });
// // consultationActor.send({
// //   type: "END_CONSULTATION",
// // })
