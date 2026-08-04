// Visual for theory-12 "Decisions and repetition" - data-only, decoupled from
// theory-12.js. LEVEL-0 execution scene: just the code with a moving current
// line and a flat Name | Value table - no memory board, no stack/heap split, no
// addresses. We step through one counter as an if/else chooses a branch and a
// loop reuses the same box, writing a new value on each pass.
(function () {
  "use strict";

  const CODE = [
    "int count = 0",
    "if (count == 0)",
    '  print "start"',
    "else",
    '  print "already running"',
    "while (count < 3)",
    "  count = count + 1",
    "print count",
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
        narr: "A program does not always march straight down the list - it can **choose** what to do next.\nHere `count` starts at `0`, and that one value drives the first choice.",
        pc: 0, codeLive: true,
        stack: [frame([box("count", 0, true)])],
      },
      {
        narr: "A **condition** is a yes/no question.\n`count == 0` reads the box and answers `true`, because `count` is holding `0`.",
        pc: 1, codeLive: true,
        stack: [frame([box("count", 0)])],
      },
      {
        narr: "Because the condition is `true`, the `if` branch runs and prints `\"start\"`.\nThe `else` branch is skipped. If the answer were `false`, the other branch would run instead.",
        pc: 2, codeLive: true,
        stack: [frame([box("count", 0)])],
      },
      {
        narr: "A **loop** repeats while its condition stays `true`.\n`count < 3` asks another yes/no question. With `count` at `0`, the answer is `true`, so the loop body runs.",
        pc: 5, codeLive: true,
        stack: [frame([box("count", 0)])],
      },
      {
        narr: "The loop body reuses the **same box**.\n`count = count + 1` reads the old `0`, computes `1`, and writes `1` back into `count`.",
        pc: 6, codeLive: true,
        stack: [frame([box("count", 1, true)])],
      },
      {
        narr: "The loop jumps back to the condition instead of carrying on.\n`count < 3` is still `true`, so the same line will update the same box again.",
        pc: 5, codeLive: true,
        stack: [frame([box("count", 1)])],
      },
      {
        narr: "Second pass: the box is not replaced.\nThe value inside `count` changes from `1` to `2`.",
        pc: 6, codeLive: true,
        stack: [frame([box("count", 2, true)])],
      },
      {
        narr: "Third pass: the loop uses the same box again.\n`count` changes from `2` to `3`.",
        pc: 6, codeLive: true,
        stack: [frame([box("count", 3, true)])],
      },
      {
        narr: "Now the condition is `false`: `count < 3` is no longer true.\nThe loop stops, and the program moves on to the next line.",
        pc: 5, codeLive: true,
        stack: [frame([box("count", 3)])],
      },
      {
        narr: "The final line reads the value that is in the box now - `3`.\nA loop repeats steps, but it can keep reusing one variable as the value changes.",
        pc: 7, codeLive: true,
        stack: [frame([box("count", 3)])],
      },
    ],
  };
})();
