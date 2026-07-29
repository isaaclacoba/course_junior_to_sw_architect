// Visual for theory-4 "Running many programs at once" - data-only, decoupled
// from the lesson. It uses the memory widget to represent the processes INSIDE
// the RAM: two programs loaded as separate, isolated blocks of memory. The CPU
// cores are colour-tied to the processes so the picture makes the scheduling
// story visible: one lit core = time-sharing (take turns), two lit cores tinted
// to each process = real parallelism, which opens up other scheduling choices.
(function () {
  "use strict";

  const BROWSER = "#3b82f6";
  const MUSIC = "#f59e0b";

  const aData = [
    { id: "a1", addr: "0x2000", k: "tabs", v: "12" },
    { id: "a2", addr: "0x2001", k: "page", v: '"news"' },
  ];
  const bData = [
    { id: "b1", addr: "0x9000", k: "track", v: "3" },
    { id: "b2", addr: "0x9001", k: "volume", v: "70" },
  ];
  const procA = () => ({ id: "pA", name: "Process A · browser", vars: aData, accent: BROWSER });
  const procB = () => ({ id: "pB", name: "Process B · music", vars: bData, accent: MUSIC });
  const both = () => [procA(), procB()];

  window.LESSON_VIZ = {
    scene: { board: true, regions: ["stack"], zoomTab: true },
    regionTags: { stack: "PROCESSES <span>· each isolated in its own RAM</span>" },
    chipName: "RAM",
    chipAddr: "two programs loaded side by side",
    steps: [
      {
        narr: "A running program is a **process**.\nTwo programs at once - a browser and a music player - are two processes, each loaded into its own separate patch of RAM. The colours track who is who.",
        ram: true, highlight: "ram", stack: both(), heap: [],
      },
      {
        narr: "Here is the puzzle: one CPU **core** does just one instruction at a time.\nSo how do both processes seem to run at the very same moment?",
        ram: true, cores: [{ i: 0 }], highlight: "soc", instr: "1 core", stack: both(), heap: [],
      },
      {
        narr: "With one core they take turns.\nThe core runs a slice of the browser, then a slice of the music player, then back - thousands of times a second. That fast turn-taking is **time-sharing**.",
        ram: true, cores: [{ i: 0, color: BROWSER }], instr: "run A", stack: both(), heap: [],
      },
      {
        narr: "Same one core, next turn: now it runs the music player.\nOnly one process holds the core at any instant - 'at once' is really rapid switching. The part of the OS that picks whose turn is next is the **scheduler**.",
        ram: true, cores: [{ i: 0, color: MUSIC }], highlight: "soc", instr: "run B", stack: both(), heap: [],
      },
      {
        narr: "Now give the chip two cores.\nCore 0 runs the browser and core 1 runs the music player at the very same instant - real **parallelism**, not just fast switching. Each core takes its process's colour.",
        ram: true, cores: [{ i: 0, color: BROWSER }, { i: 1, color: MUSIC }], highlight: "soc", instr: "A ∥ B", stack: both(), heap: [],
      },
      {
        narr: "With as many cores as processes the **scheduler** has real choices:\n- run them truly in parallel\n- keep a core free for the next program\n- spread one heavy job across several cores\nOne core forces turn-taking; more cores open up these strategies.",
        ram: true, cores: [{ i: 0, color: BROWSER }, { i: 1, color: MUSIC }], stack: both(), heap: [],
      },
      {
        narr: "Whichever way they are scheduled, each process is walled off in its own memory.\nOne cannot read or scribble on another's - that is **isolation**, so a crash in one does not drag the others down.",
        ram: true, highlight: "ram", instr: "isolated", stack: both(), heap: [],
      },
    ],
  };
})();
