// Visual for theory-11 "Statements and expressions" - data-only, decoupled from
// theory-11.js. LEVEL-0 execution scene: just the code with a moving current
// line and a flat Name | Value table - no memory board, no stack/heap split, no
// addresses. We step through statements while expressions compute values that
// land in a named box.
(function () {
  "use strict";

  const CODE = [
    "int total",
    "total = 2 + 3",
    "total = total + 1",
    "print total",
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
        narr: "A **statement** is one complete instruction - a single step the program takes.\n`int total` is one statement. It creates the box named `total`, ready for a value.",
        pc: 0, codeLive: true,
        stack: [frame([box("total", null)])],
      },
      {
        narr: "An **expression** is a piece of code that produces a value.\nIn `total = 2 + 3`, the expression `2 + 3` works out to `5`.",
        pc: 1, codeLive: true,
        stack: [frame([box("total", null)])],
      },
      {
        narr: "Statements use expressions to get values.\nThis statement takes the value from `2 + 3` and stores it in `total`.",
        pc: 1, codeLive: true,
        stack: [frame([box("total", 5, true)])],
      },
      {
        narr: "Statements run **in order**, top to bottom.\nNext line: `total = total + 1`. The expression `total + 1` reads the current `5` and computes `6`.",
        pc: 2, codeLive: true,
        stack: [frame([box("total", 5)])],
      },
      {
        narr: "**Assignment** is the storing part.\nThe `=` writes the computed value back into the box, so `total` changes from `5` to `6`.",
        pc: 2, codeLive: true,
        stack: [frame([box("total", 6, true)])],
      },
      {
        narr: "The last statement reads `total` and prints it - `6`.\nOne step after another, in the **order** they are written.",
        pc: 3, codeLive: true,
        stack: [frame([box("total", 6)])],
      },
    ],
  };
})();
