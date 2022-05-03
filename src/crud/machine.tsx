import { createMachine } from "xstate";

const crudMachine = createMachine({
  context: {
    users: [
      {
        name: "Billy",
        surname: "Jean"
      },
      {
        name: "David",
        surname: "Khourshid"
      },
      {
        name: "Stephen",
        surname: "Shaw"
      }
    ],
    name: "",
    surname: "",
    selectedUser: null,
    filter: ""
  },
  initial: "newUser",
  states: {
    newUser: {
      entry: [
        assign({
          name: "",
          surname: "",
          selectedUser: null
        }),
        updateFields
      ],
      on: {
        CREATE: {
          cond: (ctx) => !!ctx.name && !!ctx.surname,
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
            updateUsers,
            updateFields
          ]
        }
      },
      SUBMIT: {
        actions: send("CREATE")
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
                ctx.users[ctx.selectedUser] = {
                  name: ctx.name,
                  surname: ctx.surname
                };
                return ctx.users;
                //return ctx.users.filter((_, i) => i !== ctx.selectedUser);
              }
            }),
            updateUsers,
            updateFields
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
            }),
            updateUsers,
            updateFields
          ]
        },
        CANCEL: "newUser",
        SUBMIT: {
          actions: send("UPDATE")
        }
      }
    }
  },
  entry: updateUsers,
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
        }),
        updateFields
      ]
    },
    FILTER: {
      actions: [
        assign({
          filter: (_, e) => e.value,
          selectedUser: null,
          name: "",
          surname: ""
        }),
        updateUsers,
        updateFields
      ]
    }
  }
});
