// Visual for theory-14 "Bugs: why programs go wrong" - data-only, decoupled from
// theory-14.js. LEVEL-0 execution scene: just the code with a moving current
// line and a flat Name | Value table - no board, no stack/heap split, no
// addresses. We step through a tiny routine to see a syntax error stop the
// build, a logic error leave a wrong value in a box, and debugging fill the
// boxes one line at a time until the bug is found.
(function () {
  "use strict";

  const CODE = [
    "int a = 10",
    "int b = 5",
    "int total = a - b",
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
        narr: "A **bug** is a mistake in the instructions.\nThe computer did exactly what you wrote, not what you meant - so when a program misbehaves, the fault is almost always in the code.",
        pc: 0, codeLive: true,
        stack: [frame([box("a", 10), box("b", 5), box("total", null)])],
      },
      {
        narr: "One kind breaks the language's rules - a **syntax error**, like a missing symbol.\nThe compiler catches it before anything runs and refuses to build until you fix it.",
        pc: 2, codeLive: true,
        stack: [frame([box("a", 10), box("b", 5), box("total", null)])],
      },
      {
        narr: "The other kind is sneakier. This code builds and runs fine, but it used `-` where it meant `+`, so `total` comes out `5` - when adding `10` and `5` should give `15`.\nThat is a **logic error**: valid code doing the wrong thing.",
        pc: 2, codeLive: true,
        stack: [frame([box("a", 10), box("b", 5), box("total", 5, true)])],
      },
      {
        narr: "**Debugging** means stepping through line by line, watching each box fill.\nFirst line: `a` gets `10`.",
        pc: 0, codeLive: true,
        stack: [frame([box("a", 10, true), box("b", null), box("total", null)])],
      },
      {
        narr: "Next line: `b` gets `5`.\nSo far the boxes hold what you expect.",
        pc: 1, codeLive: true,
        stack: [frame([box("a", 10), box("b", 5, true), box("total", null)])],
      },
      {
        narr: "At this line the value goes wrong - `total` becomes `5`, not `15`. You have **found the bug**: the `-` should be a `+`.\nFix that one line, run again, and `total` reads `15`.",
        pc: 2, codeLive: true,
        stack: [frame([box("a", 10), box("b", 5), box("total", 15, true)])],
      },
    ],
  };
})();
