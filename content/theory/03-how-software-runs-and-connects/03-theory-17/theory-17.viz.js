// Visual for theory-17 "The build-and-run cycle" - data-only. Board + Code.
// Language-agnostic: the two phases are COMPILE TIME (a compiler translates the
// source and checks the rules - errors caught here) and RUN TIME (the built
// program executes). We show a real build error and its fix, then the general
// landscape: compiling to machine code for a target vs to a portable form a
// runtime finishes, and cross-compilation for a different target.
(function () {
  "use strict";

  const GOOD = [
    "int a = 5;",
    "int b = 7;",
    "print(a + b);",
  ];
  const BAD = [
    "int a = 5;",
    "int b = 7",
    "print(a + b);",
  ];

  window.LESSON_VIZ = {
    scene: { board: true, regions: ["code"], zoomTab: false },
    chipName: "RAM",
    chipAddr: "source is translated, then run",
    code: GOOD,
    steps: [
      {
        narr: "The code you write is just **text** in a file - letters and symbols saved on disk.\nThe CPU cannot run text; it only runs machine instructions, so something has to translate it first.",
        code: GOOD, pc: -1, instr: "source", highlight: "ufs", codeLive: true,
      },
      {
        narr: "That happens at **compile time**, before the program runs. The **compiler** reads your source top to bottom and, as it goes, checks the rules.\nBreak one and it stops.",
        code: GOOD, pc: 2, instr: "compiling...", highlight: "soc", codeLive: true, packets: [{ path: "trUfs" }],
      },
      {
        narr: "Here line 2 is missing its `;`, so the compiler refuses to build.\nThis is a **build error** - caught at compile time, before a single line runs.",
        code: BAD, pc: 1, instr: "build error", highlight: "soc", codeLive: true,
        codeMark: { line: 1, text: "int b = 7", kind: "op" },
      },
      {
        narr: "Fix the `;` and the rules pass, so the **build** succeeds.\nThe finished program is loaded into memory, ready to execute - building it was not the same as running it.",
        code: GOOD, pc: 1, instr: "build ok", ram: true, load: true, highlight: "ram", codeLive: true, codeMark: { line: 1, text: "int b = 7;", kind: "expr" },
      },
      {
        narr: "Now **run time**: the built program executes one instruction at a time. `a + b` is worked out and `12` is printed.\nThe program is finally doing its job.",
        code: GOOD, pc: 2, instr: "output: 12", ram: true, highlight: "ram", codeLive: true, codeMark: { line: 2, text: "a + b", kind: "expr" },
      },
      {
        narr: "What a compiler builds *to* depends on the language:\n- some compile straight to **machine code** for one **target** - a specific CPU and operating system\n- others compile to a portable in-between form that a **runtime** finishes on each machine, so one build runs in many places",
        code: GOOD, pc: -1, instr: "targets", highlight: "soc", codeLive: true,
      },
      {
        narr: "When a language compiles straight to machine code, the build only runs on the target it was made for.\nTo run it elsewhere you **cross-compile**: build on your laptop but aim the compiler at another target - say a phone's chip, or a server running a different operating system.",
        code: GOOD, pc: -1, instr: "cross-compile", highlight: "ufs", codeLive: true,
      },
      {
        narr: "So keep the two phases straight:\n- **compile time** - translate the source and check the rules; mistakes are caught here\n- **run time** - execute the built program\nAnd remember machine code is always for some target - which is why the same source can be built for many different machines.",
        code: GOOD, pc: -1, instr: "done", ram: true, highlight: "ram", codeLive: true,
      },
    ],
  };
})();
