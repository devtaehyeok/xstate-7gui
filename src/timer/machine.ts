import { useMachine } from "@xstate/react";
import {
  createMachine,
  assign,
  spawn,
  Sender,
  Receiver,
  send,
  ActorRef,
  sendParent
} from "xstate";
import { Actor } from "xstate/lib/Actor";
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
    }
  | {
      type: "DURATION.CHANGED";
      value: number;
    };

// const counterInterval = (
//   callback: Sender<TimerEvent>,
//   receive: Receiver<TimerEvent>
// ) => {
//   let count = 0;

//   const intervalId = setInterval(() => {
//     callback({ type: "COUNT.UPDATE", count });
//     count++;
//   }, 1000);

//   receive((event) => {
//     if (event.type === "INC") {
//       count++;
//     }
//   });

//   return () => {
//     clearInterval(intervalId);
//   };
// };

/**
 ** "running" - the state where the timer is running, receiving TICK events from some invoked interval service, and updating context.elapsed.
 ** "paused" - the state where the timer is not running and no longer receiving TICK events.
 */
// const tickMachine:()=>(context, event) =>
//   spawn((callback, receive) => {
//     // send to parent

//     const interval = setInterval(() => {
//       callback("TICK");
//     }, 1000 * context.interval);

//     // receive from parent
//     receive((event) => {
//       // handle event
//     });

//     // disposal
//     return () => {
//       clearInterval(interval);
//     }});

const TimerMachine = createMachine<TimerContext, TimerEvent>(
  {
    initial: "running",
    schema: {
      context: {} as TimerContext
    },
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
        always: [{ cond: "shouldPause", target: "paused" }],
        on: {
          TICK: { actions: ["tick"] }
        }
      },
      paused: {
        always: [{ cond: "shouldBePaused", target: "running" }]
      }
    },
    on: {
      "DURATION.UPDATE": {
        actions: ["updateDuration"]
      },
      RESET: { actions: ["reset"] }
    }
  },
  {
    guards: {
      shouldPause: (context: TimerContext) => {
        return context.elapsed >= context.duration;
      },
      shouldBePaused: (context: TimerContext) => {
        return context.elapsed < context.duration;
      }
    },
    actions: {
      tick: assign<TimerContext, TimerEvent>({
        elapsed: (context) => +(context.elapsed + context.interval).toFixed(2)
      }),
      reset: assign<TimerContext, TimerEvent>({
        elapsed: 0
      }),
      updateDuration: assign<TimerContext, TimerEvent>({
        duration: (ctx, event) =>
          event.type === "DURATION.UPDATE" ? event.value : ctx.duration
      })
    }
  }
);
const useTemperatureMachine = () => useMachine(TimerMachine);

export default useTemperatureMachine;
