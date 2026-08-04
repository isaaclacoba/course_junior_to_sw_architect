// Visual for theory-2 "How a program runs" - data-only, decoupled from theory-2.js.
// Machine scene: the board plus the Code and Global regions. Shows load, the
// fetch-execute loop, the program counter, a jump, and data living in memory.
(function () {
  "use strict";

  const CODE = [
    "set x = 0",
    "add x = x + 1",
    "if x < 3 goto 2",
    "print x",
  ];
  const x = (v) => [{ id: "x", k: "x", v: String(v) }];

  window.LESSON_CONFIG = {
    scene: { board: true, regions: ["code", "global"], zoomTab: true },
    chipName: "RAM",
    chipAddr: "the instructions and the data they work on",
    code: CODE,
    steps: [
      { narr: "Before it can run, the program is copied from the hard drive - long-term storage - into **RAM**.\nThe CPU only ever runs code that is in memory.", pc: -1, instr: "load", ram: true, load: true, codeLive: true, highlight: "ufs", globals: [] },
      { narr: "Then the CPU repeats one loop: fetch the next instruction from memory, carry it out, repeat.\nThis is the **fetch-execute loop**.", pc: 0, instr: "fetch", ram: true, codeLive: true, core: 0, highlight: "soc", packets: [{ path: "trRam", reverse: true }], globals: x(0) },
      { narr: "The CPU keeps its place with a **program counter**.\nBy default it just moves to the next instruction: line 1, then line 2.", pc: 1, instr: "add x", ram: true, codeLive: true, core: 0, packets: [{ path: "trRam" }], globals: x(1) },
      { narr: "Some instructions are **jumps** - they change the program counter to a different line instead of the next one.\nHere, while `x < 3`, it jumps back to line 2 - a loop.", pc: 1, instr: "jump -> 2", ram: true, codeLive: true, core: 1, packets: [{ path: "trRam", reverse: true }], globals: x(2) },
      { narr: "The **data** lives in memory too. `x` is a value in a slot.\nThe instructions read it and write it as the loop runs, until `x` reaches 3 and the jump stops.", pc: 3, instr: "print x", ram: true, codeLive: true, core: 0, packets: [{ path: "trRam" }], globals: x(3) },
    ],
  };
})();
