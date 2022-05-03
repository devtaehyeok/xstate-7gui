import * as React from "react";
import * as ReactDOM from "react-dom";
import styled from "styled-components";
import useTemperatureMachine from "./machine";

const Wrapper = styled.section`
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
    display: block;
  }

  section {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    width: 20rem;
  }

  input {
    background: var(--color-bg-input);
    border: none;
    height: 2rem;
    border-radius: 0.25rem;
    font-size: 1rem;
    padding: 0 0.5rem;
    border: 2px solid transparent;
    width: 100%;
    margin: 0;
    box-sizing: border-box;
  }

  select {
    appearance: none;
    background: var(--color-bg-input);
    height: 2rem;
    border: none;
    font-size: 1rem;
  }

  label {
    > span {
      display: block;
      font-size: 0.875rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    margin: 0.5rem 0;
  }

  progress {
    width: 100%;
  }
`;

const Timer = () => {
  const [state, send] = useTemperatureMachine();

  const { elapsed, duration } = state.context;

  return (
    <Wrapper>
      <h1>
        Challenges: concurrency, competing user/signal interactions,
        responsiveness.
      </h1>
      <label>
        <span>Elapsed time:</span>
        <output>
          {elapsed.toFixed(1)}s / {duration.toFixed(1)}s
        </output>
        <progress max={duration} value={elapsed} />
      </label>
      <label>
        <span>Duration:</span>
        <input
          type="range"
          min={0}
          max={30}
          value={duration}
          onChange={(e) => {
            send("DURATION.UPDATE", { value: +e.target.value });
          }}
        />
      </label>
      <button onClick={(_) => send("RESET")}>Reset</button>
    </Wrapper>
  );
};

export default Timer;
