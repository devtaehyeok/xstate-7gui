import { assign, send, ContextFrom, EventFrom } from "xstate";
import { choose, log } from "xstate/lib/actions";
import { createModel } from "xstate/lib/model";

export interface Circle {
  x: number;
  y: number;
  radius: number;
}

const CircleDrawerModel = createModel(
  {
    width: 0,
    height: 0,
    circles: [] as Circle[],
    circle: null as Circle | null,
    snapshots: [] as Circle[][],
    redo: [] as Circle[][]
  },
  {
    events: {
      "CIRCLE.CREATE": (circle: Circle) => ({ circle }),
      "CIRCLE.SELECT": (circle: Circle) => ({ circle }),
      "CIRCLE.CHANGE": (radius: number) => ({ radius }),
      "CANVAS.CLICK": (circle: Circle) => ({ circle }),
      UNDO: () => ({}),
      REDO: () => ({})
    }
  }
);
type CContext = ContextFrom<typeof CircleDrawerModel>;
type CEvent = EventFrom<typeof CircleDrawerModel>;
const undo = CircleDrawerModel.assign((ctx) => {
  const lastCircles = ctx.snapshots.pop() || [];
  return {
    circles: ctx.snapshots[ctx.snapshots.length - 1] ?? [],
    snapshots: [...ctx.snapshots],
    redo: [...ctx.redo, lastCircles]
  };
});

const redo = CircleDrawerModel.assign((ctx) => {
  const redoCircles = ctx.redo.pop() || [];
  return {
    circles: redoCircles,
    snapshots: [...ctx.snapshots, redoCircles],
    redo: [...ctx.redo]
  };
});

const circleAdded = CircleDrawerModel.assign((ctx, e) => {
  if (e.type === "CIRCLE.CREATE") {
    return { circles: [...ctx.circles, e.circle] };
  }
  return { circles: ctx.circles };
});

const snapshot = CircleDrawerModel.assign({
  snapshots: (ctx) => {
    return [...ctx.snapshots, ctx.circles];
  }
});

const circleSelected = CircleDrawerModel.assign({
  circle: (ctx, e) => (e.type === "CIRCLE.SELECT" ? e.circle : ctx.circle)
});

const circieChanged = CircleDrawerModel.assign((ctx, e) =>
  e.type === "CIRCLE.CHANGE"
    ? {
        circles: ctx.circles.map((c) =>
          c.x === ctx?.circle?.x && c.y === ctx?.circle?.y
            ? { ...c, radius: e.radius }
            : c
        ),
        circle: ctx.circle
          ? { ...ctx.circle, radius: e.radius }
          : { x: 0, y: 0, radius: 40 }
      }
    : { circles: ctx.circles }
);

const selectCircle = send(
  (ctx: CContext, e: { type: "CRICLE.SELECT"; circle: Circle }) =>
    CircleDrawerModel.events["CIRCLE.SELECT"](
      ctx.circles.filter(
        (c: Circle) =>
          (c.x - e.circle.x) * (c.x - e.circle.x) +
            (c.y - e.circle.y) * (c.y - e.circle.y) <
          c.radius * c.radius
      )?.[0]
    )
);

const createCircle = send(
  (c: CContext, e: Extract<CEvent, { type: "CIRCLE.CREATE" }>) =>
    CircleDrawerModel.events["CIRCLE.CREATE"](e.circle)
);

const exit = assign<CContext>({
  circle: null
});

const createDrawerMachine = (width: number, height: number) =>
  CircleDrawerModel.createMachine(
    {
      context: { ...CircleDrawerModel.initialContext, width, height },
      initial: "drawing",
      states: {
        drawing: {
          on: {
            "CIRCLE.CREATE": {
              actions: ["circleAdded", "snapshot", "logging"]
            },
            "CIRCLE.SELECT": {
              actions: ["circleSelected", "logging"],
              target: "editing"
            },
            UNDO: {
              cond: "isSnapshot",
              actions: ["undo", "logging"]
            },
            REDO: {
              cond: "canRedo",
              actions: "redo"
            },
            "CANVAS.CLICK": {
              actions: "chooseEditOrAdd"
            }
          }
        },
        editing: {
          exit: "exit",
          on: {
            "CANVAS.CLICK": {
              target: "drawing",
              actions: ["snapshot", "logging"]
            },
            "CIRCLE.CHANGE": {
              actions: "circieChanged"
            }
          }
        }
      }
    },
    {
      actions: {
        circleAdded: circleAdded,
        circleSelected: circleSelected,
        undo: undo,
        redo: redo,
        snapshot: snapshot,
        selectCircle: selectCircle,
        createCircle: createCircle,
        circieChanged: circieChanged,
        chooseEditOrAdd: choose([
          {
            cond: "hasLastClosestCircle",
            actions: ["selectCircle", "logging"]
          },
          { actions: ["createCircle", "logging"] }
        ]),
        exit: exit,
        logging: log()
      },
      guards: {
        isSnapshot: (ctx) => ctx.snapshots.length > 0,
        hasLastClosestCircle: (ctx, e) =>
          e.type === "CANVAS.CLICK" &&
          ctx.circles.filter(
            (c) =>
              (c.x - e.circle.x) * (c.x - e.circle.x) +
                (c.y - e.circle.y) * (c.y - e.circle.y) <
              c.radius * c.radius
          ).length
            ? true
            : false,
        canRedo: (ctx) => ctx.redo.length > 0
      }
    }
  );

export default createDrawerMachine;
