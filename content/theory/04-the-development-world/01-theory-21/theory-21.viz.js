// Visual for theory-21 "Standing on other code" - data-only, decoupled from
// theory-21.js. Board scene with the code region: a few lines that call into a
// library, showing that your program is your code plus code you did not write -
// the standard library, plus packages a package manager fetches from outside.
(function () {
  "use strict";

  const CODE = [
    "using Json;",
    'var text = Read("prices.json");',
    "var data = Json.Parse(text);",
    "print data.Count;",
  ];

  window.LESSON_CONFIG = {
    scene: { board: true, regions: ["code"], zoomTab: false },
    chipName: "RAM",
    chipAddr: "your code plus code you did not write",
    code: CODE,
    steps: [
      { narr: "Most of what you build reuses code that already exists.\nA **library** is ready-made code someone else wrote and shared, so you call it instead of writing it yourself - like `Json.Parse` here.", pc: 0, instr: "reuse", codeLive: true, highlight: "ram" },
      { narr: "You do not have to hunt for every tool. Every language ships with a big set of built-in tools - its **standard library**.\nIn `.NET` that is the Base Class Library: text, dates, lists, files, ready the moment you start.", pc: 2, instr: "std library", codeLive: true, highlight: "ram" },
      { narr: "When the built-in tools do not cover it, you reach for a **package** - a bundle of code someone published for others to reuse.\nIt is fetched from outside and added to your project.", pc: 0, instr: "restoring packages", codeLive: true, highlight: "ufs", packets: [{ path: "trUfs", color: "#ffd479" }] },
      { narr: "You do not chase packages by hand. A **package manager** fetches the ones you ask for, installs the right version, and pulls in their dependencies too - the packages they in turn rely on.\nIn `.NET` that tool is `NuGet`.", pc: 2, instr: "resolve deps", codeLive: true, highlight: "ufs", packets: [{ path: "trUfs", color: "#7ee787" }] },
      { narr: "Your finished program runs as **one thing** - your code plus all that pulled-in code, loaded together in memory.\nBefore building something, you look for what already exists.", pc: 3, instr: "one program", codeLive: true, highlight: "ram" },
    ],
  };
})();
