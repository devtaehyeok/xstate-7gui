import { useMachine } from "@xstate/react";
import { createMachine, assign } from "xstate";

/**
 * Modeling
 *
 ** When in the running state, some elapsed variable is incremented by some interval on every TICK event.
 ** Always check that elapsed does not exceed duration (guarded transition) in the running state (transient transition)
 *** If elapsed exceeds duration, transition to the paused state.
 ** Always check that duration does not exceed elapsed (guarded transition) in the paused state.
 *** If duration exceeds elapsed, transition to the running state.
 ** The duration can always be updated via some DURATION.UPDATE event.
 ** A RESET event resets elapsed to 0.
 */

/**
 * Context (descriptive data)
 ** C - the temperature in degrees Celsius
 ** F - the temperature in degrees Fahrenheit
 */
interface TimerContext {
  // The elapsed time (in seconds)
  elapsed: number;
  // The maximum time (in seconds)
  duration: number;
  // The interval to send TICK events (in seconds)
  interval: number;
}

type TimerEvent =
  | {
      // The TICK event sent by the spawned interval service
      type: "TICK";
    }
  | {
      // User intent to update the duration
      type: "DURATION.UPDATE";
      value: number;
    }
  | {
      // User intent to reset the elapsed time to 0
      type: "RESET";
    };

/**
 ** "running" - the state where the timer is running, receiving TICK events from some invoked interval service, and updating context.elapsed.
 ** "paused" - the state where the timer is not running and no longer receiving TICK events.
 */
const TimerMachine = createMachine<TimerContext, TimerEvent>({
  initial: "running",
  context: {
    elapsed: 0,
    duration: 5,
    interval: 0.1
  },
  states: {
    running: {
      invoke: {
        src: (context) => (cb) => {
          const interval = setInterval(() => {
            cb("TICK");
          }, 1000 * context.interval);

          return () => {
            clearInterval(interval);
          };
        }
      },
      on: {
        // react to all event
        "": {
          target: "paused",
          cond: (context) => {
            return context.elapsed >= context.duration;
          }
        },
        TICK: {
          actions: assign({
            elapsed: (context) =>
              +(context.elapsed + context.interval).toFixed(2)
          })
        }
      }
    },
    paused: {
      on: {
        // react to all event
        "": {
          target: "running",
          cond: (context) => context.elapsed < context.duration
        }
      }
    }
  },
  on: {
    "DURATION.UPDATE": {
      actions: assign({
        duration: (_, event) => event.value
      })
    },
    RESET: {
      actions: assign({
        elapsed: 0
      })
    }
  }
});
const useTemperatureMachine = () => useMachine(TimerMachine);

export default useTemperatureMachine;
