import styled from "styled-components";
import { Button as _Button } from "antd";
import { useMachine } from "@xstate/react";
import { interpret } from "xstate";
import machine from "./machine";
import React from "react";
const Form = styled.form`
  width: 30em;
  max-width: 90%;
  border: 1px solid gray;
  padding: 20px;
`;

const Grid = styled.div`
  margin: 1rem 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 1rem;
  width: 100%;
  align-items: end;
`;

const Select = styled.select`
  width: 100%;
`;

const Options = styled.div`
  display: grid;
  gap: 1rem;
  width: 100%;
  align-items: start;
`;

const NameFields = styled.div`
  display: grid;
  gap: 0.5rem;
  width: 100%;
  align-items: start;
`;

const Label = styled.label`
  display: grid;
  gap: 0.25rem;
  width: 100%;
`;

const Input = styled.input`
  ${Label} & {
    flex: 1 1 auto;
    width: auto;
  }
`;

const Buttons = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  ${Buttons} & {
    flex: 1 1 auto;
    padding: 1rem;
  }
`;

export default function Crud() {
  const [state, send] = useMachine(machine);
  const [selectId, setSelectId] = React.useState(0);
  const refreshView = () => setSelectId((v) => v + 1);

  return (
    <Form>
      <h1>CRUD</h1>
      <p>Challenges: separating the domain and presentation logic</p>
      <p>managing mutation, building a non-trivial layout.</p>
      <Grid>
        <Options>
          <Label className="filter">
            Filter:{" "}
            <Input
              id="filter"
              value={state.context.filter}
              onChange={(e) => send({ type: "FILTER", value: e.target.value })}
            />
          </Label>
          <Select id="users" size={4} key={selectId}>
            {state.context.users
              .filter((d) =>
                `${d.name}${d.surname}`
                  .toUpperCase()
                  .includes(state.context.filter.toUpperCase())
              )
              .map((d, i) => (
                <option
                  key={d.surname + String(i)}
                  onClick={() => send({ type: "SELECT", index: i })}
                >{`${d.name} ${d.surname}`}</option>
              ))}
          </Select>
        </Options>

        <NameFields>
          <Label>
            Name:{" "}
            <Input
              id="name"
              value={state.context.name}
              onChange={(e) =>
                send({ type: "name.change", value: e.target.value })
              }
            />
          </Label>
          <Label>
            Surname:{" "}
            <Input
              id="surname"
              value={state.context.surname}
              onChange={(e) =>
                send({ type: "surname.change", value: e.target.value })
              }
            />
          </Label>
        </NameFields>
      </Grid>

      <Buttons className="buttons">
        <Button
          type="button"
          id="create"
          disabled={!state.can("CREATE")}
          onClick={() => {
            send("CREATE");
            refreshView();
          }}
        >
          Create
        </Button>
        <Button
          type="button"
          id="update"
          disabled={!state.can("UPDATE")}
          onClick={() => {
            send("UPDATE");
            refreshView();
          }}
        >
          Update
        </Button>
        <Button
          type="button"
          id="delete"
          disabled={!state.can("DELETE")}
          onClick={() => {
            send("DELETE");
            refreshView();
          }}
        >
          Delete
        </Button>
        <Button
          type="button"
          id="cancel"
          disabled={!state.can("CANCEL")}
          onClick={() => {
            send("CANCEL");
            refreshView();
          }}
        >
          Cancel
        </Button>
      </Buttons>
    </Form>
  );
}
