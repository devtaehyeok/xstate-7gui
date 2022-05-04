import { useMachine } from "@xstate/react";
import { createMachine, assign } from "xstate";

// Context
interface FlightContext {
  startDate?: string;
  returnDate?: string;
  trip: "oneWay" | "roundTrip";
}

/**
 * Event
 *
 *  Context vs. State
 ** Notice that we decided not to model the machine with nested states for the trip,
 ** such as editing.oneWay or editing.roundTrip.
 ** The reason is simply that even though this is technically a finite state (
 ** and you are free to model it this way),
 ** it is also a contextual value that we need to read from in order to display the value in the trip select input:
 ** context.trip
 */
type FlightEvent =
  | {
      type: "SET_TRIP";
      value: "oneWay" | "roundTrip";
    }
  | {
      type: "startDate.UPDATE";
      value: string;
    }
  | {
      type: "returnDate.UPDATE";
      value: string;
    }
  | { type: "SUBMIT" };
/**
 * State
 ** "editing" - the state where the flight booking information is being edited
 ** "submitted" - the state where the flight booking information has been submitted successfully, and no further changes can be made
 */
// 게임중 : 값 스타크래프트 / 게임중 { 스타크래프트} / 스타크래프트
const machine = createMachine<FlightContext, FlightEvent>({
  id: "flight",
  initial: "editing",
  context: {
    startDate: undefined,
    returnDate: undefined,
    trip: "oneWay" // or 'roundTrip'
  },
  states: {
    editing: {
      on: {
        "startDate.UPDATE": {
          actions: assign({
            startDate: (_, event) => event.value
          })
        },
        // when context.trip === "roundTrip"
        "returnDate.UPDATE": {
          actions: assign({
            returnDate: (_, event) => event.value
          }),
          cond: (context) => context.trip === "roundTrip"
        },
        SET_TRIP: {
          actions: assign({
            trip: (_, event) => event.value
          }),
          cond: (_, event) =>
            event.value === "oneWay" || event.value === "roundTrip"
        },
        SUBMIT: {
          target: "submitted",
          cond: (context) => {
            if (context.trip === "oneWay") {
              return !!context.startDate;
            } else {
              return (
                !!context.startDate &&
                !!context.returnDate &&
                context.returnDate > context.startDate
              );
            }
          }
        }
      }
    },
    submitted: {
      type: "final"
    }
  }
});

export default machine;
