import { atomFamily, selectorFamily, SerializableParam } from "recoil";
import { evaluate } from "mathjs";
import { string } from "fp-ts";

type Cell = {
  type: "exp" | "val";
  val: string;
};

export const cellsAtom = atomFamily<Cell, string>({
  key: "valueAtom",
  default: { type: "val", val: "" }
});

export const expSelector = selectorFamily<string, string>({
  key: "expSelector",
  get: (id) => ({ get }) => {
    const cell = get(cellsAtom(id));
    switch (cell.type) {
      case "exp": {
        const result = evalCells(cell, id);
        try {
          return Number.isNaN(evaluate(result))
            ? "#ERROR"
            : String(evaluate(result)) === "undefined"
            ? "#ERROR"
            : String(evaluate(result));
        } catch (e) {
          return "#ERROR";
        }
      }
      case "val": {
        return cell.val ?? "#ERROR";
      }
    }

    function evalCells(cell: Cell, id: string): string {
      switch (cell.type) {
        case "exp": {
          const targets = cell.val.match(/\b([A-Z]\d{1,2})\b/g) || [];
          const result = targets
            .filter((d) => d !== id)
            .reduce(
              (acc, d) => acc.replaceAll(d, evalCells(get(cellsAtom(d)), d)),
              cell.val.slice(1)
            );
          return result;
        }
        case "val": {
          return cell.val ?? "#ERROR";
        }
      }

      return "never";
    }
  }
});
