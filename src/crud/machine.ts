import { createMachine, assign, send } from "xstate";

type User = {
  name: string;
  surname: string;
};

interface CrudContext {
  name: string;
  surname: string;
  filter: string;
  selectedUser: number;
  users: User[];
}

type CrudEvent =
  | {
      type: "CREATE";
    }
  | {
      type: "UPDATE";
    }
  | { type: "DELETE" }
  | { type: "SELECT"; index: number }
  | { type: "CANCEL" }
  | { type: "FILTER"; value: string }
  | { type: "name.change"; value: string }
  | { type: "surname.change"; value: string };

const crudMachine = createMachine<CrudContext, CrudEvent>(
  {
    schema: { context: {} as CrudContext },
    context: {
      users: [
        {
          name: "LG",
          surname: "CNS"
        },
        {
          name: "Samsung",
          surname: "SDS"
        },
        {
          name: "SK",
          surname: "CNC"
        },
        {
          name: "Kakao",
          surname: "Enterprise"
        }
      ],
      name: "",
      surname: "",
      filter: "",
      selectedUser: -1
    },
    initial: "newUser",
    states: {
      newUser: {
        entry: [
          assign({
            name: "",
            surname: "",
            filter: "",
            selectedUser: -1
          })
        ],
        on: {
          CREATE: {
            actions: [
              assign({
                users: (ctx) => {
                  return ctx.users.concat({
                    name: ctx.name,
                    surname: ctx.surname
                  });
                },
                name: "",
                surname: ""
              }),
              () => {
                if ("activeElement" in document)
                  (document?.activeElement as HTMLElement)?.blur();
              }
            ],
            cond: (ctx) => !!ctx.name && !!ctx.surname
          }
        }
      },
      editUser: {
        on: {
          UPDATE: {
            cond: (ctx) => ctx.selectedUser >= 0 && !!ctx.name && !!ctx.surname,
            target: "newUser",
            actions: [
              assign({
                users: (ctx) => {
                  ctx.users[ctx?.selectedUser] = {
                    name: ctx.name,
                    surname: ctx.surname
                  };
                  return ctx.users;
                }
              })
            ]
          },
          DELETE: {
            target: "newUser",
            cond: (ctx) => ctx.selectedUser >= 0,
            actions: [
              assign({
                users: (ctx) => {
                  return ctx.users.filter((_, i) => i !== ctx.selectedUser);
                }
              })
            ]
          },
          CANCEL: "newUser"
        }
      }
    },
    on: {
      "name.change": {
        actions: assign({
          name: (ctx, e) => e.value
        })
      },
      "surname.change": {
        actions: assign({
          surname: (ctx, e) => e.value
        })
      },
      SELECT: {
        target: ".editUser",
        actions: [
          assign({
            selectedUser: (_, e) => e.index,
            name: (ctx, e) => ctx.users[e.index].name,
            surname: (ctx, e) => ctx.users[e.index].surname
          })
        ]
      },
      FILTER: {
        actions: ["assignFilter"]
      }
    }
  },
  {
    actions: {
      assignFilter: assign<CrudContext, CrudEvent>({
        filter: (ctx, e) => (e.type === "FILTER" ? e.value || "" : ctx.filter),
        selectedUser: -1,
        name: "",
        surname: ""
      })
    }
  }
);

export default crudMachine;
