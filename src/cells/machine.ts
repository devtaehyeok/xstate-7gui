import { assign, send, ContextFrom, EventFrom, interpret } from "xstate";
import { choose, log } from "xstate/lib/actions";
import { createModel } from "xstate/lib/model";
import { atomFamily, selectorFamily } from "recoil";
import { evaluate } from "mathjs";
export const cellsAtom = atomFamily<string, string>({
  key: "valueAtom",
  default: ""
});

export const expSelector = selectorFamily<string, string>({
  key: "expSelector",
  get: (exp: string, id: string) => ({ get }) => {
    if (exp.startsWith("=")) {
      const result = evalCells(exp, id);
      try {
        return Number.isNaN(evaluate(result))
          ? "#ERROR"
          : String(evaluate(result)) === "undefined"
          ? "#ERROR"
          : String(evaluate(result));
      } catch (e) {
        return "#ERROR";
      }
    } else {
      return exp ?? "#ERROR";
    }

    function evalCells(exp: string, id: string) {
      if (exp.startsWith("=")) {
        const targets = exp.match(/\b([A-Z]\d{1,2})\b/g) || [];
        const result = targets
          .filter((d) => d !== id)
          .reduce(
            (acc, d) => acc.replaceAll(d, evalCells(get(cellsAtom(d)), d)),
            exp.slice(1)
          );
        return result;
      } else {
        return exp;
      }
    }
  }
});

// inspired by https://codesandbox.io/s/jotai-7guis-task7-cells-forked-bntloo?file=/src/App.tsx:181-188
const CellsModel = createModel(
  {
    target: "",
    cellAtom: cellsAtom,
    expSelector: expSelector
  },
  {
    events: {
      "CELLS.SELECT": (id: string) => ({ id }),
      "CELLS.UNSELECT": () => ({})
    }
  }
);

type CellsContext = ContextFrom<typeof CellsModel>;
type CellsEvent = EventFrom<typeof CellsModel>;

const cellsSelected = CellsModel.assign(
  (ctx, e: { type: "CELLS.SELECT"; id: string }) => {
    return {
      target: e.id,
      cellAtom: cellsAtom,
      expSelector: expSelector
    };
  }
);

const exit = CellsModel.assign((ctx, e: any) => ({
  target: "",
  cellAtom: cellsAtom,
  expSelector: expSelector
}));
const CellsMachine = CellsModel.createMachine(
  {
    context: { ...CellsModel.initialContext },
    initial: "unselect",
    states: {
      unselect: {
        on: {
          "CELLS.SELECT": {
            actions: ["cellsSelected"],
            target: "select"
          }
        }
      },
      select: {
        exit: exit,
        on: {
          "CELLS.SELECT": {
            actions: ["cellsSelected"]
          }
        }
      },
      edit: {}
    }
  },
  { actions: { cellsSelected, exit, log: log() } }
);

export default CellsMachine;
