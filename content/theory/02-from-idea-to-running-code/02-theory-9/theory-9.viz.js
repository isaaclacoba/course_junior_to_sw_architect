// Visual for theory-9 "Variables" - data-only, decoupled from theory-9.js.
// LEVEL-0 execution scene: just the code with a moving current line and a flat
// Name | Value table - no memory board, no stack/heap split, no addresses.
// We step through a tiny routine to see a variable get a name, a value, a new
// value, and then get read.
(function () {
  "use strict";

  const CODE = [
    "int score",
    "score = 10",
    "score = 25",
    "print score",
  ];

  // One box in the variable table. `hot` marks the box that changed THIS step
  // (static amber highlight); omit a value to show it as "unassigned".
  const box = (k, v, hot) => (v == null ? { id: k, k, empty: true } : { id: k, k, v: String(v), hot });
  const frame = (vars) => ({ id: "prog", name: "your program", vars });

  window.LESSON_VIZ = {
    code: CODE,
    layout: {
      visual: [{ type: "code" }, { type: "vartable" }],
      aside: [{ type: "narration" }, { type: "controls" }],
    },
    legend: [{ sw: "#f59e0b", label: "changed this step" }],
    steps: [
      {
        narr: "A **variable** is a named box for a value.\n`int score` creates the box named `score`. It is ready to hold a value, but right now it is **unassigned**.",
        pc: 0, codeLive: true,
        stack: [frame([box("score", null)])],
      },
      {
        narr: "**Assignment** writes a value into the box.\n`score = 10` puts `10` into the variable named `score`.",
        pc: 1, codeLive: true,
        stack: [frame([box("score", 10, true)])],
      },
      {
        narr: "The **name** - `score` - is what you use in code when you want that box.\nClear names are for people reading the program.",
        pc: 1, codeLive: true,
        stack: [frame([box("score", 10)])],
      },
      {
        narr: "The **value** can change as the program runs.\n`score = 25` writes a new value into the same box.",
        pc: 2, codeLive: true,
        stack: [frame([box("score", 25, true)])],
      },
      {
        narr: "A variable holds only **one value at a time**.\nThe `25` replaced the old `10`, so `print score` reads the value that is there now - `25`.",
        pc: 3, codeLive: true,
        stack: [frame([box("score", 25)])],
      },
    ],
  };
})();
