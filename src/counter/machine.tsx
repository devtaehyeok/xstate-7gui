import { useMachine } from "@xstate/react";
import { createMachine, assign } from "xstate";

interface CounterContext {
  count: number;
}

type CounterEvent = {
  type: "INCREMENT";
};

const counterMachine = createMachine<CounterContext, CounterEvent>({
  initial: "active",
  context: { count: 0 },
  states: {
    active: {
      on: {
        INCREMENT: {
          actions: assign({ count: (ctx) => ctx.count + 1 })
        }
      }
    }
  }
});

const useCounterMachine = () => useMachine(counterMachine);

export default useCounterMachine;
