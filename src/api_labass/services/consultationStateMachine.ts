import { createMachine, interpret, assign, createActor } from "xstate";
import { fromPromise } from "xstate";
import { consultationService } from "./consultationService";
import { UpdateDateColumn } from "typeorm";

interface ConsultationContext {
  id: number;
  status: string;
}

// Assuming your event to start update could carry id and status
interface UpdateEvent {
  type: "UPDATE";
  id: number;
  status: string;
}

const updateStatusActorLogic = fromPromise(
  async (context: { input: { id: number; status: string } }) => {
    // Ensure that input contains the necessary properties
    if (
      !context.input ||
      typeof context.input.id !== "number" ||
      typeof context.input.status !== "string"
    ) {
      throw new Error("Invalid input for updateStatusActor");
    }

    // Call the updateConsultationStatus service with the provided id and status
    await consultationService.updateConsultationStatus(
      context.input.id,
      context.input.status
    );
  }
);

const consultationStateMachine = createMachine({
  id: "consultation",
  initial: "idle",

  context: {
    id: 0,
    status: "",
  },
  states: {
    idle: {
      on: { UPDATE: "updating" },
    },
    updating: {
      invoke: {
        id: "updateConsultationStatus",
        src: updateStatusActorLogic,
        onDone: "updated",
        onError: "error",
      },
    },
    updated: {
      type: "final",
      // Assuming the new status is in event.data
    },
    error: {
      // Handle error
    },
  },
});

// Adjust your logic for creating and interacting with the actor
const consultationActor = createActor(consultationStateMachine, {
  input: {
    // Initial input data here
    id: 0,
    status: "",
  },
});

consultationActor.subscribe({
  next: (state) => console.log(state.value, state.context),
  error: (err) => console.error(err),
  complete: () => console.log("Actor completed"),
});

// Start the actor
consultationActor.start();

// Send an event to the actor
consultationActor.send({ type: "UPDATE", id: 1, status: "Completed" });
