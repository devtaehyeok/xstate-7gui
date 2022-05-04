import { Button } from "antd";
import Input from "antd/lib/input/Input";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 32em;
  max-width: 90%;
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

export default function CircleDrawer() {
  return (
    <Wrapper>
      <h1>Canvas Drawing</h1>
      <p>Challenges: undo/redo, custom drawing, dialog control*.</p>
      <hr />
      <Controls>
        <Button id="undo">Undo</Button>
        <Button id="redo">Redo</Button>

        <Input type="range" id="radius" min="10" max="200" />
      </Controls>

      <Canvas id="canvas" width="700" height="500" />
    </Wrapper>
  );
}
