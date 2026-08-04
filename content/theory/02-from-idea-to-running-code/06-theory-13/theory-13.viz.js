// Visual for theory-13 "Functions" - data-only, decoupled from theory-13.js.
// LEVEL-1 execution scene: code + call stack. We step through one function call
// to see Main start, a call pushes a new frame, arguments arrive as copied local
// variables, the return value comes back, and the callee frame pops.
(function () {
  "use strict";

  const CODE = [
    "int add(int a, int b) {",
    "  return a + b",
    "}",
    "main() {",
    "  int r = add(3, 5)",
    "  print r",
    "}",
  ];

  // One row inside one call-stack frame. `hot` marks the box that changed THIS step.
  const box = (k, v, hot) => (v == null ? { id: k, k, empty: true } : { id: k, k, v: String(v), hot });
  const frame = (id, name, vars) => ({ id, name, vars });

  window.LESSON_CONFIG = {
    code: CODE,
    layout: {
      visual: [{ type: "code" }, { type: "callstack" }],
      aside: [{ type: "narration" }, { type: "controls" }],
    },
    legend: [
      { sw: "#2563eb", label: "the call in progress" },
      { sw: "#f59e0b", label: "changed this step" },
    ],
    steps: [
      {
        narr: "A **function** is a named bundle of steps, and those steps live in the `code` area - here `add`, which takes two numbers.\nThe program starts in `main`, so the call stack has one frame.",
        pc: 0, codeLive: true,
        stack: [frame("main-call", "main()", [])],
      },
      {
        narr: "Write the steps once, then **reuse** them.\nCall `add` wherever you need it, as many times as you like, without rewriting the body.",
        pc: 3, codeLive: true,
        stack: [frame("main-call", "main()", [box("r", null)])],
      },
      {
        narr: "Calling `add(3, 5)` pushes a new **frame** on top of `main` - the function's own local memory.\nThe arguments arrive as copies in that frame: `a = 3` and `b = 5`.",
        pc: 4, codeLive: true,
        stack: [
          frame("main-call", "main()", [box("r", null)]),
          frame("add-call-1", "add(a, b)", [box("a", 3, true), box("b", 5, true)]),
        ],
      },
      {
        narr: "Now the CPU runs `add`'s body. It reads `a` and `b` from the top frame and works out `a + b` - `8`.\n**Local** variables like `a` and `b` only exist while this frame is on the stack.",
        pc: 1, codeLive: true,
        stack: [
          frame("main-call", "main()", [box("r", null)]),
          frame("add-call-1", "add(a, b)", [box("a", 3), box("b", 5), box("return value", 8, true)]),
        ],
      },
      {
        narr: "`add` hands the result back and its frame is **popped** off the stack - that local memory is gone.\nThe program counter returns to `main`, and `8` lands in `r`.",
        pc: 4, codeLive: true,
        stack: [frame("main-call", "main()", [box("r", 8, true)])],
      },
      {
        narr: "Programs are built from **many functions** calling each other.\n`main` is just the one the program starts in - the rest are called from there.",
        pc: 5, codeLive: true,
        stack: [frame("main-call", "main()", [box("r", 8)])],
      },
    ],
  };
})();
