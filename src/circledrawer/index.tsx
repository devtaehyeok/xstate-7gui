import { useMachine } from "@xstate/react";
import { Button } from "antd";
import React, { useCallback, useRef } from "react";
import Input from "antd/lib/input/Input";
import { useLayoutEffect } from "react";
import styled from "styled-components";
import createMachine from "./machine";
import { inspect } from "@xstate/inspect";
const Wrapper = styled.div`
  width: 1000px;
  height: 660px;

  padding: 10px;

  border: 1px solid black;
`;

const Controls = styled.div`
  margin: 0.5rem 0;
  display: flex;
  gap: 0.5rem;
`;

const Canvas = styled.canvas`
  max-width: 100%;
  height: auto;
  border: solid 0.25rem;
`;

const canvasDimension = { width: 970, height: 500, radius: 40 };

const onClickCanvas = (dim: typeof canvasDimension) => (
  callback: (e: {
    circle: { x: number; y: number; radius: number };
    type: "CANVAS.CLICK";
  }) => void
) => (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const pointerX = e.clientX;
  const pointerY = e.clientY;
  const scaleX = rect.width / dim.width;
  const scaleY = rect.height / dim.height;

  callback({
    type: "CANVAS.CLICK",
    circle: {
      x: (pointerX - rect.left) / scaleX,
      y: (pointerY - rect.top) / scaleY,
      radius: dim.radius
    }
  });
};

inspect({
  url: "https://statecharts.io/inspect",
  iframe: false
});

const machine = createMachine(canvasDimension.width, canvasDimension.height);

export default function CircleDrawer() {
  const [state, send] = useMachine(machine, { devTools: true });
  const clickCanvas = useCallback(onClickCanvas(canvasDimension), [
    canvasDimension
  ]);
  const ref = useRef<HTMLCanvasElement>(null);

  React.useLayoutEffect(() => {
    const canvasContext = ref?.current?.getContext("2d");
    const { circles, circle: selectedCircle, width, height } = state.context;

    canvasContext?.clearRect(0, 0, width, height);

    circles.forEach((circle) => {
      if (!canvasContext) return;
      canvasContext?.beginPath();
      canvasContext?.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
      if (circle.x === selectedCircle?.x && circle.y === selectedCircle?.y) {
        canvasContext.strokeStyle = "#32302c";
        canvasContext.fillStyle = "#f4d4d1";
        canvasContext.fill();
      } else {
        canvasContext.strokeStyle =
          selectedCircle !== null ? "rgba(0,0,0,0.1)" : "#32302c";
      }
      canvasContext.lineWidth = 5;
      canvasContext.stroke();
    });
  });

  return (
    <Wrapper>
      <h1>Canvas Drawing</h1>
      <p>Challenges: undo/redo, custom drawing, dialog control*.</p>
      <hr />
      <Controls>
        <Button
          id="undo"
          type="primary"
          onClick={() => send("UNDO")}
          disabled={!state.can("UNDO")}
        >
          Undo
        </Button>
        <Button
          id="redo"
          type="primary"
          onClick={() => send("REDO")}
          disabled={!state.can("REDO")}
        >
          Redo
        </Button>
        {state.context.circle && (
          <Input
            type="range"
            id="radius"
            min="10"
            max="200"
            value={state.context.circle.radius}
            onChange={(e) => {
              send({ type: "CIRCLE.CHANGE", radius: +e.target.value });
            }}
          />
        )}
      </Controls>
      <Canvas
        ref={ref}
        id="canvas"
        onClick={clickCanvas(send)}
        width={canvasDimension.width}
        height={canvasDimension.height}
      />
    </Wrapper>
  );
}
