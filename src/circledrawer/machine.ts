import { createMachine, assign, send } from "xstate";

const elApp = document.querySelector("#app");
const elCanvas = document.querySelector("#canvas");
const canvasContext = elCanvas.getContext("2d");

const elUndo = document.querySelector("#undo");
const elRedo = document.querySelector("#redo");
const elRadius = document.querySelector("#radius");

const snapshot = assign({
  snapshots: (ctx) => {
    return [...ctx.snapshots, ctx.circles];
  }
});

function findLastIndex(array, predicate) {
  let index = -1;
  for (let i = 0; i < array.length; i++) {
    if (predicate(array[i], i)) {
      index = i;
    }
  }

  return index;
}

function getCircleIndex(circles, x, y) {
  return findLastIndex(circles, (circle) => {
    return Math.hypot(circle.x - x, circle.y - y) < circle.radius;
  });
}

export interface Circle {
  x: number;
  y: number;
  radius: number;
}

const initialCircles: Circle[] = [];

interface Context {
  width: number;
  height: number;
}

const drawingMachine = createMachine({
  context: {
    width: elCanvas.width,
    height: elCanvas.height,
    circles: initialCircles,
    circle: null,
    snapshots: [initialCircles],
    redo: []
  },
  initial: "drawing",
  states: {
    drawing: {
      on: {
        "CIRCLE.CREATE": {
          actions: [
            assign({
              circle: null,
              circles: (ctx, e) => ctx.circles.concat(e.circle)
            }),
            snapshot
          ]
        },
        "CIRCLE.SELECT": {
          actions: assign({
            circle: (ctx, e) => e.circle
          }),
          target: "editing"
        },
        UNDO: {
          cond: (ctx) => ctx.snapshots.length > 0,
          actions: assign((ctx) => {
            const lastCircles = ctx.snapshots.pop();

            return {
              circles: ctx.snapshots[ctx.snapshots.length - 1] || [],
              snapshots: [...ctx.snapshots],
              redo: [...ctx.redo, lastCircles]
            };
          })
        },
        REDO: {
          cond: (ctx) => ctx.redo.length > 0,
          actions: assign((ctx) => {
            const redoCircles = ctx.redo.pop();

            return {
              circles: redoCircles,
              snapshots: [...ctx.snapshots, redoCircles],
              redo: [...ctx.redo]
            };
          })
        }
      }
    },
    editing: {
      exit: assign({
        circle: null
      }),
      on: {
        "CIRCLE.CHANGE": {
          actions: assign({
            circles: (ctx, e) => {
              return ctx.circles.map((circle, i) => {
                if (i !== ctx.circle) {
                  return circle;
                }

                return {
                  ...circle,
                  radius: e.radius
                };
              });
            }
          })
        },
        "CANVAS.CLICK": {
          target: "drawing",
          actions: snapshot
        }
      }
    }
  },
  on: {
    "CANVAS.CLICK": [
      {
        cond: (ctx, e) => {
          return getCircleIndex(ctx.circles, e.circle.x, e.circle.y) !== -1;
        },
        actions: [
          send((ctx, e) => ({
            type: "CIRCLE.SELECT",
            circle: getCircleIndex(ctx.circles, e.circle.x, e.circle.y)
          }))
        ]
      },
      {
        actions: send((ctx, e) => ({
          type: "CIRCLE.CREATE",
          circle: e.circle
        }))
      }
    ]
  }
});
