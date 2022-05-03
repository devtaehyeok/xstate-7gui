import { Button } from "antd";
import styled from "styled-components";
import useCounterMachine from "./machine";
const Wrapper = styled.div`
  width: 800px;
  height: 800px;
  border: 1px solid gray;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;

const Viewer = styled.span`
  width: 100px;
  height: 100px;
  border: 1px solid gray;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function Counter() {
  const [machine, send] = useCounterMachine();

  return (
    <Wrapper>
      <h1>Challenge: Understanding the basic ideas of a language/toolkit.</h1>
      <Viewer>
        <span>{machine.context.count}</span>
      </Viewer>
      <Button type="primary" onClick={() => send("INCREMENT")}>
        increment
      </Button>
    </Wrapper>
  );
}
