import { useMachine } from "@xstate/react";
import { createMachine, assign, actions } from "xstate";

interface CounterContext {
  count: number;
}

type CounterEvent =
  | {
      type: "INCREMENT";
    }
  | {
      type: "DECREMENT";
    };

const counterMachine = createMachine<CounterContext, CounterEvent>(
  {
    initial: "active",
    schema: {
      context: {} as CounterContext
    },
    context: { count: 0 },
    states: {
      active: {
        on: {
          INCREMENT: {
            actions: ["increment", "logging"]
          },
          DECREMENT: {
            actions: ["decrement", "logging"]
          }
        }
      }
    }
  },
  {
    actions: {
      increment: assign<CounterContext, CounterEvent>({
        count: (ctx) => ctx.count + 1
      }),
      decrement: assign<CounterContext, CounterEvent>({
        count: (ctx) => ctx.count - 1
      }),
      logging: actions.log()
    }
  }
);

const useCounterMachine = () => useMachine(counterMachine);

export default useCounterMachine;
