import * as React from "react";
import FlightInput from "./FlightInput";
import machine from "./machine";
import styled from "styled-components";
import { useMachine } from "@xstate/react";

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 40px;
  border: 1px solid lightgray;
  button {
    padding: 0 1rem;
    height: 2rem;
    background: #41aaf3;
    color: white;
    font-weight: 700;
    font-size: 100%;
    border-radius: 0.25rem;
    border: none;
    cursor: pointer;

    &[disabled] {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &[data-state="submitted"] {
      background-color: #2ad142;
    }
  }

  output {
    color: #555;
    font-weight: bold;
    font-size: 200%;
    padding: 0.5rem;
    border: 1px solid #aaa;
    border-radius: 0.25rem;
    margin-bottom: 1rem;
    text-align: center;
  }

  section {
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }

  input {
    background: var(--color-bg-input);
    border: none;
    height: 2rem;
    border-radius: 0.25rem;
    font-size: 1rem;
    padding: 0 0.5rem;
    border: 2px solid transparent;
  }

  select {
    appearance: none;
    background: var(--color-bg-input);
    height: 2rem;
    border: none;
    font-size: 1rem;
  }

  label {
    input + span {
      margin-left: 1rem;
    }

    > span {
      display: block;
      font-size: 0.875rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    margin: 0.5rem 0;

    &[data-state="error"] {
      > input {
        border: 2px solid red;
      }
    }
  }
`;

const FlightBooker = () => {
  const [state, send] = useMachine(machine);
  const canSubmit = machine.transition(state, "SUBMIT").changed;
  const { startDate, returnDate, trip } = state.context;

  return (
    <Wrapper>
      <form style={{ display: "flex", flexDirection: "column" }}>
        <select
          onChange={(e) => {
            send({ type: "returnDate.UPDATE", value: "" });
            send({
              type: "SET_TRIP",
              value: e.target.value as "oneWay" | "roundTrip"
            });
          }}
          value={trip}
        >
          <option value="oneWay">One way</option>
          <option value="roundTrip">Round trip</option>
        </select>
        <FlightInput
          value={startDate}
          onChange={(value: string) =>
            send({ type: "startDate.UPDATE", value })
          }
          error={!startDate}
          label="Start date"
        />
        <FlightInput
          value={returnDate}
          onChange={(value: string) =>
            send({ type: "returnDate.UPDATE", value })
          }
          error={
            trip === "roundTrip" &&
            (!startDate || !returnDate || returnDate <= startDate)
          }
          disabled={trip === "oneWay"}
          label="Return date"
        />
        <button
          type="button"
          onClick={() => send("SUBMIT")}
          disabled={!canSubmit}
          data-state={state.toStrings().join(" ")}
        >
          {state.matches("editing") && "Submit"}
          {state.matches("submitted") && "Success!"}
        </button>
      </form>
    </Wrapper>
  );
};

export default FlightBooker;
