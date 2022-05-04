import { useMachine } from "@xstate/react";
import { createMachine, assign } from "xstate";

/**
 * Modeling
 *
 * Instead of thinking about this as bidirectional data flow,
 * it can be simpler to think of this as a UI rendered from two values: C and F,
 * and these two values can be updated due to events,
 * such as CELSIUS for changing the C˚ input value
 * and FAHRENHEIT for changing the F˚ input value.
 * It just so happens that the <input> element both displays and updates the values,
 * but that's just an implementation detail.
 * (we can focus on `event`)
 */

/**
 * Context (descriptive data)
 ** C - the temperature in degrees Celsius
 ** F - the temperature in degrees Fahrenheit
 */
interface TemperatureContext {
  C: string;
  F: string;
}
/**
 * Note that when one of these events is sent to the machine,
 * two things happen simultaneously:
 **  The desired temperature value is assigned to the event value
 **  The other temperature value is calculated and assigned based on that same event value
 */
type TemperatureEvent =
  | {
      type: "CELSIUS";
      value: string; //  signals that the Celsius value should change
    }
  | {
      type: "FAHRENHEIT";
      value: string; // signals that the Fahrenheit value should change
    };

/**
 * state
 * active
 */
const TemperatureMachine = createMachine<TemperatureContext, TemperatureEvent>({
  initial: "active",
  context: { C: "", F: "" },
  states: {
    active: {
      on: {
        CELSIUS: {
          actions: assign({
            C: (_, event) => event.value,
            F: (_, event) =>
              event.value.length ? String(+event.value * (9 / 5) + 32) : ""
          })
        },
        FAHRENHEIT: {
          actions: assign({
            C: (_, event) =>
              event.value.length ? String((+event.value - 32) * (5 / 9)) : "",
            F: (_, event) => event.value
          })
        }
      }
    }
  }
});

const useTemperatureMachine = () => useMachine(TemperatureMachine);

export default useTemperatureMachine;
