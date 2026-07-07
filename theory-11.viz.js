// Visual for theory-11 "Statements and expressions" - data-only, decoupled from
// theory-11.js. Memory scene, no board: Code and Stack regions, showing the PC
// step through statements while an expression's value lands in a slot.
(function () {
  "use strict";

  const CODE = ["int total = 2 + 3", "total = total + 1", "print total"];
  const frame = (vars) => ({ id: "f", name: "your program", vars });
  const total = (v) => ({ id: "total", addr: "0x7000", k: "total", v: String(v) });

  window.LESSON_VIZ = {
    scene: { board: false, regions: ["code", "stack"], zoomTab: false },
    chipName: "RAM",
    chipAddr: "statements run; expressions produce values",
    code: CODE,
    steps: [
      { narr: "A **statement** is one complete instruction - a single step the program takes.\nThis whole line is one statement.", pc: 0, codeLive: true, codeMark: { text: "int total = 2 + 3", kind: "stmt" }, stack: [frame([])] },
      { narr: "An **expression** is a piece of code that produces a value - the kind of value the machine juggles in memory.\nHere `2 + 3` is an expression; it works out to `5`.", pc: 0, codeLive: true, codeMark: { text: "2 + 3", kind: "expr" }, stack: [frame([])] },
      { narr: "Statements use expressions to get values.\nThis statement takes the value of `2 + 3` and stores it.", pc: 0, codeLive: true, codeMark: { text: "2 + 3", kind: "expr" }, stack: [frame([total(5)])] },
      { narr: "**Assignment** is the storing part.\nThe `=` operator writes the computed value (`5`) into the slot named `total`.", pc: 0, codeLive: true, codeMark: { text: "=", kind: "op" }, stack: [frame([total(5)])] },
      { narr: "Statements run **in order**, top to bottom.\nNext line: `total = total + 1` - the `+` operator adds `1` to `5`, then the value is written back.", pc: 1, codeLive: true, codeMark: { text: "+", kind: "op" }, stack: [frame([total(6)])] },
      { narr: "The last statement reads `total` and prints it - `6`.\nOne step after another, in the **order** they are written.", pc: 2, codeLive: true, stack: [frame([total(6)])] },
    ],
  };
})();
