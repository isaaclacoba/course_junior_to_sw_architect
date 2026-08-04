// Visual for "Write for the reader" - data-only. LEVEL-0 execution scene (theory-9
// style): the code with a moving current line plus a flat Name | Value table. We
// first run a clever one-liner - the answer just appears, with no way to watch the
// branch fire - then run the same logic written plainly and step through it one
// branch at a time, so the reader can follow exactly what happens.
(function () {
  "use strict";

  const CLEVER = [
    "size = herd > 100 ? \"big\" : herd > 10 ? \"mid\" : \"small\";",
  ];
  const CLEAR = [
    "string size;",
    "if (herd > 100)  size = \"big\";",
    "else if (herd > 10)  size = \"mid\";",
    "else  size = \"small\";",
  ];

  // One box in the variable table. `hot` marks the box that changed THIS step;
  // omit a value to show it as "unassigned".
  const box = (k, v, hot) => (v == null ? { id: k, k, empty: true } : { id: k, k, v: String(v), hot });
  const frame = (vars) => ({ id: "prog", name: "your program", vars });

  window.LESSON_CONFIG = {
    code: CLEAR,
    layout: {
      visual: [{ type: "code" }, { type: "vartable" }],
      aside: [{ type: "narration" }, { type: "controls" }],
    },
    legend: [{ sw: "#f59e0b", label: "changed this step" }],
    steps: [
      {
        narr: "Code is read far more often than it is written - by teammates, and by you months from now.\nSo the person you are really writing for is the **reader**, not the compiler. The compiler is happy either way.",
        code: CLEVER, pc: -1, codeLive: true,
        stack: [frame([box("herd", 40), box("size", null)])],
      },
      {
        narr: "Here is a clever one-liner. It works, and it is fewer characters.\nBut to follow it you have to untangle the nested `?:` in your head. The machine jumps straight to the answer - the reader cannot, and pays that tax every time.",
        code: CLEVER, pc: 0, codeLive: true,
        codeMark: { text: "herd > 100 ? \"big\" : herd > 10 ? \"mid\" : \"small\"", kind: "op" },
        stack: [frame([box("herd", 40), box("size", "\"mid\"", true)])],
      },
      {
        narr: "Now the same logic, written plainly: one branch per line, in the order they are checked.\nIt is a few lines longer - and it reads top to bottom like a sentence, with nothing to untangle.",
        code: CLEAR, pc: 0, codeLive: true,
        stack: [frame([box("herd", 40), box("size", null)])],
      },
      {
        narr: "Walk it as the reader would. `herd` is `40`, so the first branch - `herd > 100` - is false and gets skipped.\nThe check and its answer sit together on one line, in plain sight.",
        code: CLEAR, pc: 1, codeLive: true,
        codeMark: { text: "herd > 100", kind: "op" },
        stack: [frame([box("herd", 40), box("size", null)])],
      },
      {
        narr: "The next branch asks `herd > 10`. `40` clears it, so `size` becomes `\"mid\"`.\nYou can see exactly which branch fired, because each one has its own line.",
        code: CLEAR, pc: 2, codeLive: true,
        codeMark: { text: "herd > 10", kind: "op" },
        stack: [frame([box("herd", 40), box("size", "\"mid\"", true)])],
      },
      {
        narr: "Both versions land on the same answer - `\"mid\"`. The difference is not the result; it is how long the next person stares before they trust it.\nSo write for the reader: prize **readability** over cleverness. When two versions do the same thing, pick the one a tired teammate follows fastest - almost always the plainer one.",
        code: CLEAR, pc: -1, codeLive: true,
        stack: [frame([box("herd", 40), box("size", "\"mid\"")])],
      },
    ],
  };
})();
