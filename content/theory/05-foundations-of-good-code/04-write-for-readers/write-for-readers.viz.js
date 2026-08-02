// Visual for "Write for the reader" - data-only. Board + Code panel (theory-17
// style): a dense, clever line versus a plain multi-line version that any reader
// can follow. Same result, less decoding. codeMark points at the hard-to-read
// spot; the clear version needs no mark.
(function () {
  "use strict";

  const CLEVER = [
    "d = (h > 100) ? \"big\" : (h > 10 ? \"mid\" : \"small\");",
  ];
  const CLEAR = [
    "string size;",
    "if (herd > 100) size = \"big\";",
    "else if (herd > 10) size = \"mid\";",
    "else size = \"small\";",
  ];

  window.LESSON_VIZ = {
    scene: { board: true, regions: ["code"], zoomTab: false },
    chipName: "source",
    chipAddr: "read more than written",
    code: CLEAR,
    steps: [
      {
        narr: "Code is read far more often than it is written - by teammates, and by you months from now.\nSo the person you are really writing for is the **reader**, not the compiler. The compiler is happy either way.",
        code: CLEVER, pc: -1, instr: "clever", highlight: "soc", codeLive: true,
        codeMark: { line: 0, text: "(h > 100) ? \"big\" : (h > 10 ? \"mid\"", kind: "op" },
      },
      {
        narr: "Here is a clever one-liner. It works, and it is fewer characters.\nBut to know what it does you have to untangle the nested `?:` and decode what `d` and `h` mean. That decoding is a tax the reader pays every single time.",
        code: CLEVER, pc: 0, instr: "decode it...", highlight: "soc", codeLive: true,
        codeMark: { line: 0, text: "d = (h > 100)", kind: "op" },
      },
      {
        narr: "Now the same logic written plainly: real names, one branch per line.\nIt is a few lines longer - and it reads top to bottom like a sentence, with nothing to untangle.",
        code: CLEAR, pc: -1, instr: "clear", highlight: "soc", codeLive: true,
      },
      {
        narr: "Both versions give the exact same answer. The difference is not the result - it is how long the next person stares before they understand.\nClever saved you a few seconds once; clear saves every reader minutes, every time.",
        code: CLEAR, pc: 1, instr: "same result", highlight: "soc", codeLive: true,
      },
      {
        narr: "So write for the reader: prize **readability** over cleverness.\nWhen two versions do the same thing, pick the one a tired teammate understands fastest - that is almost always the plainer one.",
        code: CLEAR, pc: -1, instr: "done", highlight: "soc", codeLive: true,
      },
    ],
  };
})();
