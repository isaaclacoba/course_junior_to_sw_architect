// Visual for theory-10 "Types" - data-only, decoupled from theory-10.js.
// LEVEL-0 execution scene: just the code with a moving current line and a flat
// Name | Value table - no memory board, no stack/heap split, no addresses.
// We step through a tiny routine to see that every value has a type, a variable's
// type stays fixed, and the compiler stops the wrong kind of value going in.
(function () {
  "use strict";

  const CODE = [
    "int age",
    "age = 30",
    'string name = "Mia"',
    "age = age + 1",
    'age = "Mia"  // not allowed',
  ];

  // One box in the variable table. `hot` marks the box that changed THIS step
  // (static amber highlight); omit a value to show it as "unassigned".
  const box = (k, v, hot) => (v == null ? { id: k, k, empty: true } : { id: k, k, v: String(v), hot });
  const frame = (vars) => ({ id: "prog", name: "your program", vars });

  window.LESSON_CONFIG = {
    code: CODE,
    layout: {
      visual: [{ type: "code" }, { type: "vartable" }],
      aside: [{ type: "narration" }, { type: "controls" }],
    },
    legend: [{ sw: "#f59e0b", label: "changed this step" }],
    steps: [
      {
        narr: "Every value has a **type** - a kind.\n`int age` creates a variable meant for whole numbers. The box exists, but it does not have a value yet.",
        pc: 0, codeLive: true,
        stack: [frame([box("age", null)])],
      },
      {
        narr: "**Assignment** writes a value into the variable.\n`age = 30` puts `30` in the `age` box. That value is a whole number, so it fits the `int` variable.",
        pc: 1, codeLive: true,
        stack: [frame([box("age", 30, true)])],
      },
      {
        narr: "Different kinds of values have different types.\n`string name = \"Mia\"` creates a text variable and gives it text. You will also meet `double` for decimals and `bool` for `true`/`false`.",
        pc: 2, codeLive: true,
        stack: [frame([box("age", 30), box("name", '"Mia"', true)])],
      },
      {
        narr: "The type stays with the variable for its whole life.\n`age` is still an `int` box. Its value can change from `30` to `31`, but it is still for whole numbers.",
        pc: 3, codeLive: true,
        stack: [frame([box("age", 31, true), box("name", '"Mia"')])],
      },
      {
        narr: "The compiler uses the type to catch a misuse early.\nTrying to put `\"Mia\"` into `age` is the wrong kind of value, so the program is stopped before it runs. The `age` box stays a number box.",
        pc: 4, codeLive: true,
        stack: [frame([box("age", 31), box("name", '"Mia"')])],
      },
    ],
  };
})();
