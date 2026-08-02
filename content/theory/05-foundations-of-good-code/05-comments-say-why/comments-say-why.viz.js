// Visual for "Comments say why" - data-only. Board + Code panel (theory-17
// style). A comment that repeats the code is noise that goes stale; a good name
// removes the need for most comments; a comment that explains a non-obvious
// reason is the kind worth keeping. codeMark points at the comment in question.
(function () {
  "use strict";

  const NOISE = [
    "i = i + 1;  // add one to i",
  ];
  const NAMED = [
    "retries = retries + 1;",
  ];
  const WHY = [
    "// the API rejects more than 100 items per call",
    "batchSize = 100;",
  ];

  window.LESSON_VIZ = {
    scene: { board: true, regions: ["code"], zoomTab: false },
    chipName: "source",
    chipAddr: "say why, not what",
    code: WHY,
    steps: [
      {
        narr: "A **comment** is a note for humans, written right in the code; the computer skips over it.\nUsed well it is worth a lot. The trick is knowing which comments earn their place.",
        code: NOISE, pc: 0, instr: "a comment", highlight: "soc", codeLive: true,
        codeMark: { line: 0, text: "// add one to i", kind: "op" },
      },
      {
        narr: "This one just repeats what the code already says: `i = i + 1` with a note saying *add one to i*.\nIt adds no information - and worse, if the line changes and the note does not, the comment now lies. Repeating the code is a comment that rots.",
        code: NOISE, pc: 0, instr: "noise", highlight: "soc", codeLive: true,
        codeMark: { line: 0, text: "// add one to i", kind: "op" },
      },
      {
        narr: "Often the best fix for a comment is a better name. Rename `i` to `retries` and the line explains itself: `retries = retries + 1`.\nNo comment needed - the code says *what* on its own.",
        code: NAMED, pc: 0, instr: "self-explaining", highlight: "soc", codeLive: true,
      },
      {
        narr: "So what is left for comments? The one thing code cannot show: **why**.\nHere the code says `batchSize = 100`. The comment explains the reason you would never guess from the line - the API refuses more than 100 per call.",
        code: WHY, pc: 1, instr: "why", highlight: "soc", codeLive: true,
        codeMark: { line: 0, text: "// the API rejects more than 100 items per call", kind: "expr" },
      },
      {
        narr: "So let the code say *what*, and save comments for *why*.\nComment the surprising reason, the constraint, the thing you learned the hard way - not the obvious, which a good name already tells the reader.",
        code: WHY, pc: -1, instr: "done", highlight: "soc", codeLive: true,
      },
    ],
  };
})();
