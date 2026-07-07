// Visual for theory-12 "Decisions and repetition" - data-only, decoupled from
// theory-12.js. Memory scene with a board: Code and Stack regions, showing one
// variable drive an if/else branch, and a loop jump back to re-check a condition.
(function () {
  "use strict";

  const CODE = [
    "int temp = 12",
    "if (temp > 10)",
    '  print "warm"',
    "else",
    '  print "cold"',
  ];
  const frame = (vars) => ({ id: "f", name: "your program", vars });
  const temp = (v, hot) => ({ id: "temp", addr: "0x7000", k: "temp", v: String(v), ...(hot ? { hot: true } : {}) });

  window.LESSON_VIZ = {
    scene: { board: true, regions: ["code", "stack"], zoomTab: false },
    chipName: "RAM",
    chipAddr: "one variable drives the choice",
    code: CODE,
    steps: [
      { narr: "A program does not always march straight down the list - it can **choose** what to do next.\nHere one variable, `temp`, holds `12` and drives the choice.", pc: 0, codeLive: true, codeMark: { text: "12", kind: "expr" }, stack: [frame([temp(12, true)])] },
      { narr: "A **condition** is a yes/no question the program asks.\n`temp > 10` reads `temp` (`12`) and works out to `true`.", pc: 1, codeLive: true, codeMark: { text: "temp > 10", kind: "expr" }, instr: "12 > 10 -> true", stack: [frame([temp(12, true)])] },
      { narr: "Because the condition was `true`, it runs the **`if` branch** and prints `\"warm\"`.\nThe `else` is skipped entirely.", pc: 2, codeLive: true, codeMark: { text: '  print "warm"', kind: "stmt" }, stack: [frame([temp(12)])] },
      { narr: "Had `temp` been `5` instead, the same question would answer `false`.\nWatch the slot: `temp` now holds `5`.", pc: 1, codeLive: true, codeMark: { text: "temp > 10", kind: "expr" }, instr: "5 > 10 -> false", stack: [frame([temp(5, true)])] },
      { narr: "On `false`, the `if` branch is skipped and the **`else` branch** runs instead - `print \"cold\"`.\nOne condition, two possible paths.", pc: 4, codeLive: true, codeMark: { text: '  print "cold"', kind: "stmt" }, stack: [frame([temp(5)])] },
      { narr: "A **loop** is the other move.\nInstead of carrying on, it jumps back to check the condition again, repeating the steps while it stays `true` - so you write them once, not a hundred times.", pc: 1, codeLive: true, codeMark: { text: "temp > 10", kind: "expr" }, instr: "check again -> repeat", stack: [frame([temp(12, true)])] },
    ],
  };
})();
