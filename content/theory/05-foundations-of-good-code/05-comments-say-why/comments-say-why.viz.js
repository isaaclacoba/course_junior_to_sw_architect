// Visual for "Comments say why" - data-only. LEVEL-0 debugger scene (theory-9 /
// write-for-readers style): the code with a moving current line plus a flat
// Name | Value table. A comment that repeats the code is noise that goes stale;
// a better name removes the need for most comments; a comment that explains a
// non-obvious reason is the kind worth keeping. codeMark points at the comment.
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

  // One box in the variable table. `hot` marks the box that changed THIS step.
  const box = (k, v, hot) => (v == null ? { id: k, k, empty: true } : { id: k, k, v: String(v), hot });
  const frame = (vars) => ({ id: "prog", name: "your program", vars });

  window.LESSON_CONFIG = {
    code: WHY,
    layout: {
      visual: [{ type: "code" }, { type: "vartable" }],
      aside: [{ type: "narration" }, { type: "controls" }],
    },
    legend: [{ sw: "#f59e0b", label: "changed this step" }],
    steps: [
      {
        narr: "A **comment** is a note for humans, written right in the code; the computer skips over it.\nUsed well it is worth a lot. The trick is knowing which comments earn their place.",
        code: NOISE, pc: 0, codeLive: true,
        codeMark: { text: "// add one to i", kind: "op" },
        stack: [frame([box("i", 4)])],
      },
      {
        narr: "This one just repeats what the code already says: `i = i + 1` with a note saying *add one to i*.\nIt adds no information - and worse, if the line changes and the note does not, the comment now lies. Repeating the code is a comment that rots.",
        code: NOISE, pc: 0, codeLive: true,
        codeMark: { text: "// add one to i", kind: "op" },
        stack: [frame([box("i", 5, true)])],
      },
      {
        narr: "Often the best fix for a comment is a better name. Rename `i` to `retries` and the line explains itself: `retries = retries + 1`.\nNo comment needed - the code says *what* on its own.",
        code: NAMED, pc: 0, codeLive: true,
        stack: [frame([box("retries", 5, true)])],
      },
      {
        narr: "So what is left for comments? The one thing code cannot show: **why**.\nHere the code says `batchSize = 100`. The comment explains the reason you would never guess from the line - the API refuses more than 100 per call.",
        code: WHY, pc: 1, codeLive: true,
        codeMark: { text: "// the API rejects more than 100 items per call", kind: "expr", line: 0 },
        stack: [frame([box("batchSize", 100, true)])],
      },
      {
        narr: "So let the code say *what*, and save comments for *why*.\nComment the surprising reason, the constraint, the thing you learned the hard way - not the obvious, which a good name already tells the reader.",
        code: WHY, pc: -1, codeLive: true,
        stack: [frame([box("batchSize", 100)])],
      },
    ],
  };
})();
