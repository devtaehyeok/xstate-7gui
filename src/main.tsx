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

const Header = styled.h1`
  text-align: center;
`;

export default function Main() {
  return (
    <Wrapper>
      <Header>
        <a href="https://eugenkiss.github.io/7guis/tasks" target="_blank">
          7-GUIs examples with React & XState
        </a>
      </Header>
      <Button type="primary">
        <Link to="/counter">1. Counter</Link>
      </Button>
      <Button type="primary">
        <Link to="/temperature">2. Temperature</Link>
      </Button>
      <Button type="primary">
        <Link to="/flightbooker">3. Flightbooker</Link>
      </Button>
      <Button type="primary">
        <Link to="/timer">4. Timer</Link>
      </Button>
      <Button type="primary">
        <Link to="/crud">5. Crud</Link>
      </Button>
      <Button type="primary">
        <Link to="/circledrawer">6. Circle Drawer</Link>
      </Button>
    </Wrapper>
  );
}
