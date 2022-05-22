import React, { createContext, useContext, useState } from "react";
import styled from "styled-components";
import { interpret, InterpreterFrom } from "xstate";
import { useInterpret, useSelector } from "@xstate/react";

import { cellsAtom, expSelector } from "./atom";
import { useRecoilState, RecoilRoot, useRecoilValue } from "recoil";

const Table = styled.table`
  border-collapse: collapse;
  table-layout: fixed;
  height: 80%;
  width: 100%;
`;

const Th = styled.th`
  background-color: lightgray;
  tr:first-of-type & {
    width: 80px;
  }
  tr:first-of-type &:first-of-type {
    width: 25px;
  }
`;
const Wrapper = styled.section`
  position: relative;
  left: 0px;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
`;

const Td = styled.td`
  border: 1px solid lightgray;
  height: 1.5em;
  overflow: hidden;
`;

const Input = styled.input`
  width: 100%;
  height: 100%;
`;

const H1 = styled.h1`
  text-align: center;
  width: 100%;
`;

const COLUMNS = Array.from(Array(26).keys())
  .map((i) => i + "A".charCodeAt(0))
  .map((i) => String.fromCharCode(i));
const ROWS = Array.from(Array(10).keys()).map(String);

const Cells = () => {
  return (
    <RecoilRoot>
      <Wrapper>
        <H1>
          I was trying to solve this problem with XState,
          <br />
          but since the case involves nested references,
          <br />I think using a solution with built-in reactive is a better
          choice.
        </H1>
        <Table>
          <thead>
            <tr>
              <Th></Th>
              {COLUMNS.map((c) => (
                <Th key={c}>{c}</Th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r}>
                <Th>{r}</Th>
                {COLUMNS.map((c) => (
                  <Cell key={`${c}${r}`} id={`${c}${r}`} />
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </Wrapper>
    </RecoilRoot>
  );
};

const Cell = ({ id }: { id: string }) => {
  const [isSelected, setSelected] = useState(false);
  const [cell, setCellValue] = useRecoilState(cellsAtom(id));
  const exp = useRecoilValue(expSelector(id));
  return (
    <Td onClick={() => setSelected(true)}>
      {isSelected ? (
        <Input
          defaultValue={cell.val}
          autoFocus
          onBlur={(e) => {
            setSelected(false);
            setCellValue({
              type: e.target.value.startsWith("=") ? "exp" : "val",
              val: e.target.value
            });
          }}
        />
      ) : (
        exp
      )}
    </Td>
  );
};

export default Cells;
