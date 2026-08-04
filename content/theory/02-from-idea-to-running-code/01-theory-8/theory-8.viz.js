// Visual for theory-8 "What a programming language is" - data-only, decoupled
// from theory-8.js. Machine scene: the board plus the Code region. Shows why we
// don't write CPU instructions by hand, that a language is human-friendly rules,
// that one high-level line becomes many machine ops, and that many languages
// target the same one machine.
(function () {
  "use strict";

  const CODE = [
    "total = price + tax",
    "print(total)",
  ];

  window.LESSON_CONFIG = {
    scene: { board: true, regions: ["code"], zoomTab: false },
    chipName: "SoC",
    chipAddr: "the CPU only speaks machine code",
    code: CODE,
    steps: [
      { narr: "Deep down, the CPU runs only tiny numeric instructions - patterns of ones and zeros.\nThat is its **machine code**, the only language it truly understands.", pc: -1, instr: "10110000 01100001", highlight: "soc", codeLive: false },
      { narr: "Writing programs directly in those patterns is painful and easy to get wrong.\nNobody wants to hand-write ones and zeros all day.", pc: -1, instr: "10110000 01100001", highlight: "soc", codeLive: false },
      { narr: "So we write in a **programming language** instead - human-friendly words and rules for saying what we want.\nThis line reads almost like plain English.", pc: 0, instr: "read source", codeLive: true },
      { narr: "A tool **translates** that one friendly line into the many tiny instructions the CPU needs.\nOne high-level line - a whole burst of machine ops.", pc: 0, instr: "-> 7 machine ops", highlight: "soc", codeLive: true },
      { narr: "There are many **languages** - C#, Python, JavaScript - each with its own style.\nWhichever you pick, the code ends up as instructions for the same one machine.", pc: 1, instr: "same CPU", highlight: "soc", codeLive: true },
    ],
  };
})();
