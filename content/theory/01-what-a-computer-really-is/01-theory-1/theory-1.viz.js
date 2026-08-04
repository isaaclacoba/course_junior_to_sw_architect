// Visual for theory-1 "What a program is" - a DATA-ONLY file, decoupled from the
// lesson text in theory-1.js. It drives CodeLab.MemoryViz (machine scene: the
// board plus the Code and Global regions of RAM). page-shell.js mounts it once,
// right under the hero.
(function () {
  "use strict";

  const PROGRAM = [
    "set a = 5",
    "set b = 3",
    "add sum = a + b",
    "print sum",
  ];

  const withData = (...ids) => {
    const all = { a: { id: "a", k: "a", v: "5" }, b: { id: "b", k: "b", v: "3" }, sum: { id: "sum", k: "sum", v: "8" } };
    return ids.map((i) => all[i]);
  };

  window.LESSON_CONFIG = {
    scene: { board: true, regions: ["code", "global"], zoomTab: true },
    chipName: "RAM",
    chipAddr: "the program and the data it works on",
    code: PROGRAM,
    steps: [
      {
        narr: "A computer follows a list of steps **exactly**, one after another.\nIt never guesses or improvises.",
        pc: 0, instr: "start", ram: true, codeLive: true, globals: [], stack: [], heap: [],
      },
      {
        narr: "Each line is one **instruction** - a single tiny, exact action.\nThat action might set a value, add two numbers, or print a result.",
        pc: 0, instr: "set a", ram: true, codeLive: true, core: 0, packets: [{ path: "trRam", reverse: true }],
        globals: withData("a"), stack: [], heap: [],
      },
      {
        narr: "A **program** is just that ordered list of instructions.\nChange the order and you change what the program does.",
        pc: 1, instr: "set b", ram: true, codeLive: true, core: 0, packets: [{ path: "trRam" }],
        globals: withData("a", "b"), stack: [], heap: [],
      },
      {
        narr: "Instructions work on **data** - the values held in memory.\nHere `a`, `b` and `sum` are the data this program uses.",
        pc: 2, instr: "add sum", ram: true, codeLive: true, core: 1, highlight: "ram", packets: [{ path: "trRam" }],
        globals: withData("a", "b", "sum"), stack: [], heap: [],
      },
      {
        narr: "The **CPU** is the part that runs the instructions.\nIt fetches each one from memory and carries it out, one at a time, billions of times a second.",
        pc: 3, instr: "print sum", ram: true, codeLive: true, core: 0, highlight: "soc", packets: [{ path: "trRam", reverse: true }],
        globals: withData("a", "b", "sum"), stack: [], heap: [],
      },
      {
        narr: "You do not write these tiny instructions by hand.\nYou write C#, and a **compiler** translates it into the instructions the CPU understands.",
        pc: -1, instr: "compiled", ram: true, codeLive: true,
        globals: withData("a", "b", "sum"), stack: [], heap: [],
      },
    ],
  };
})();
