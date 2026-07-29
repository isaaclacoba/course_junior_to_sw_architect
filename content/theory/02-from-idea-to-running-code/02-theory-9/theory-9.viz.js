// Visual for theory-9 "Variables" - data-only, decoupled from theory-9.js.
// Memory scene, no board: just the Stack region, showing a single named slot
// being written, changed and read.
(function () {
  "use strict";

  const CODE = ["int score = 10", "score = 25", "print score"];
  const frame = (vars) => ({ id: "f", name: "your program", vars });
  const slot = (v, extra) => ({ id: "score", addr: "0x7000", k: "score", v: String(v), ...(extra || {}) });

  window.LESSON_VIZ = {
    scene: { board: false, regions: ["stack"], zoomTab: false },
    chipName: "RAM",
    chipAddr: "one variable, one slot",
    code: CODE,
    steps: [
      { narr: "A **variable** is a named slot in memory - the same working memory from Part 1 - that holds a value.\n`int score = 10` sets one up: the name `score`, holding `10`.", pc: 0, codeLive: true, stack: [frame([slot(10)])] },
      { narr: "The **name** - `score` - is there for people reading the code.\nBehind the scenes the machine uses the slot's address (`0x7000`); the name is a friendly label on it.", pc: 0, codeLive: true, stack: [frame([slot(10)])] },
      { narr: "The **value** can change as the program runs.\n`score = 25` writes a new value into the same slot.", pc: 1, codeLive: true, stack: [frame([slot(25)])] },
      { narr: "Two things you do with a slot: **write** (put a value in) and read (take the current value out).\n`print score` reads what is there now - `25`.", pc: 2, codeLive: true, stack: [frame([slot(25)])] },
      { narr: "A slot holds only **one value at a time**.\nEach new value replaces the old one - the `10` is gone the moment `25` is written.", pc: 1, codeLive: true, stack: [frame([slot(25)])] },
    ],
  };
})();
