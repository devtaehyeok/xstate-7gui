import { useMachine } from "@xstate/react";
import { createMachine, assign, actions } from "xstate";
import { createModel } from "xstate/lib/model";

const TemperatureModel = createModel(
  {
    C: 0,
    F: 0
  },
  {
    events: {
      CELSIUS: (value: number) => ({ value: String(value) }),
      FAHRENHEIT: (value: number) => ({ value: String(value) })
    }
  }
);
const assignC = TemperatureModel.assign({
  C: (_, event) => +event.value,
  F: (_, event) => (event.value.length ? +event.value * (9 / 5) + 32 : 0)
});

const assignF = TemperatureModel.assign({
  C: (_, event) => (event.value.length ? (+event.value - 32) * (5 / 9) : 0),
  F: (_, event) => +event.value
});

const TemperatureMachine2 = TemperatureModel.createMachine(
  {
    context: TemperatureModel.initialContext,
    initial: "active",
    states: {
      active: {
        on: {
          CELSIUS: {
            actions: "assignC"
          },
          FAHRENHEIT: {
            actions: "assignF"
          }
        }
      }
    }
  },
  {
    actions: {
      assignC: assignC,
      assignF: assignF
    }
  }
);
const useTemperatureMachine = () => useMachine(TemperatureMachine2);

export default useTemperatureMachine;
