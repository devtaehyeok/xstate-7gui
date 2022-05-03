import { Button } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 600px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  align-items: stretch;
  gap: 20px;
`;

export default function Main() {
  return (
    <Wrapper>
      <Button>
        <Link to="/counter">Counter</Link>
      </Button>
      <Button>
        <Link to="/temperature">temperature</Link>
      </Button>
      <Button>
        <Link to="/flightbooker">flightbooker</Link>
      </Button>
      <Button>
        <Link to="/timer">Timer</Link>
      </Button>
      <Button>
        <Link to="/crud">Crud</Link>
      </Button>
    </Wrapper>
  );
}
