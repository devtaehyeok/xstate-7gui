import styled from "styled-components";
import { Button as _Button } from "antd";
const Form = styled.form`
  width: 30em;
  max-width: 90%;
  border: 1px solid gray;
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
  return (
    <Form>
      <header>CRUD</header>

      <Grid>
        <Options>
          <Label className="filter">
            Filter: <Input id="filter" />
          </Label>
          <Select id="users" size={4}></Select>
        </Options>

        <NameFields>
          <Label>
            Name: <Input id="name" />
          </Label>
          <Label>
            Surname: <Input id="surname" />
          </Label>
        </NameFields>
      </Grid>

      <Buttons className="buttons">
        <Button type="button" id="create">
          Create
        </Button>
        <Button type="button" id="update">
          Update
        </Button>
        <Button type="button" id="delete">
          Delete
        </Button>
        <Button type="button" id="cancel">
          Cancel
        </Button>
      </Buttons>
    </Form>
  );
}
