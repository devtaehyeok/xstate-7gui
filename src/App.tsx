import { Routes, Route, Navigate, Outlet, Link } from "react-router-dom";
import "antd/dist/antd.css";
import styled from "styled-components";
import Main from "./main";
import Counter from "./counter";
import Temperature from "./temperature";
import FlightBooker from "./flightbooker";
import Crud from "./crud";
import Timer from "./timer";
import CircleDrawer from "./circledrawer";
import { Button } from "antd";

const Layout = styled.section`
  height: 100vh;
  /* background-color: #f4d4d1; */
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;
const Back = styled(Button)`
  padding: 5px 20px;
  width: 200px;
  text-align: center;
  margin: 20px;
`;
export default function App() {
  return (
    <Layout>
      <Back>
        <Link to="/">Main</Link>
      </Back>
      <Routes>
        <Route path="/counter" element={<Counter />} />
        <Route path="/temperature" element={<Temperature />} />
        <Route path="/flightbooker" element={<FlightBooker />} />
        <Route path="/timer" element={<Timer />} />
        <Route path="/crud" element={<Crud />} />
        <Route path="/circledrawer" element={<CircleDrawer />} />
        <Route path="*" element={<Main />} />
      </Routes>
      <Outlet />
    </Layout>
  );
}
