// Visual for theory-3 "What starts a program" - data-only, decoupled from
// theory-3.js. Machine scene: the board plus the Code region. Shows the OS
// loader copying the program into RAM, the entry point, Main, and the lifecycle.
(function () {
  "use strict";

  const CODE = [
    "Main() {",
    "  greet()",
    "  print done",
    "}",
  ];

  window.LESSON_VIZ = {
    scene: { board: true, regions: ["code"], zoomTab: true },
    chipName: "RAM",
    chipAddr: "the program, loaded and started",
    code: CODE,
    steps: [
      { narr: "Nothing starts itself.\nThe **operating system** is the program in charge - it decides to launch your program and manages it while it runs.", pc: -1, instr: "idle", ram: false, codeLive: false },
      { narr: "The OS uses a **loader** to copy the program from storage into RAM.\nOnly once it is in memory can the CPU run it.", pc: -1, instr: "load", ram: true, load: true, codeLive: true, highlight: "ram" },
      { narr: "Running always begins at one agreed place, the **entry point**.\nThe CPU needs to know exactly where to start.", pc: 0, instr: "entry", ram: true, codeLive: true, core: 0, highlight: "soc", packets: [{ path: "trRam", reverse: true }] },
      { narr: "By convention that entry point is simply called `Main`.\nYour code starts running from its first line.", pc: 1, instr: "call Main", ram: true, codeLive: true, core: 0, packets: [{ path: "trRam" }] },
      { narr: "The program runs from `Main` to the end.\nWhen it finishes, the OS **frees its memory** and the program is gone - until it is launched again.", pc: 3, instr: "exit", ram: true, codeLive: true, core: 0 },
    ],
  };
})();
