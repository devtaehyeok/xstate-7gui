import { Button, Input } from "antd";
import styled from "styled-components";
import useTemperatureMachine from "./machine";
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

const Row = styled.div`
  width: 250px;
  display: flex;
  flex-grow: 0;
  align-items: center;
`;

export default function Temperature() {
  const [state, send] = useTemperatureMachine();
  const { C, F } = state.context;
  return (
    <Wrapper>
      <h1>Challenges: bidirectional data flow, user-provided text input.</h1>
      <Row>
        <div style={{ width: "250px" }}>
          <Input
            size="large"
            type="number"
            id="celsius"
            value={C ?? ""}
            onChange={(e) => {
              send("CELSIUS", { value: e.target.value });
            }}
            placeholder="e.g., 0"
          />
        </div>
        <div style={{ width: "100px", textAlign: "center" }}>
          <span>˚C</span>
        </div>
      </Row>
      <div>
        <span>= (equals)</span>
      </div>
      <Row>
        <div style={{ width: "250px" }}>
          <Input
            size="large"
            type="number"
            id="fahrenheit"
            value={F ?? ""}
            onChange={(e) => {
              send("FAHRENHEIT", { value: e.target.value });
            }}
            placeholder="e.g., 32"
          />
        </div>

        <div style={{ width: "100px", textAlign: "center" }}>
          <span>˚F</span>
        </div>
      </Row>
    </Wrapper>
  );
}
