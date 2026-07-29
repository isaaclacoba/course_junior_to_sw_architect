// Visual for theory-13 "Functions" - data-only, decoupled from theory-13.js.
// Memory scene, no board: the Code and Stack regions, showing calls push frames,
// arguments arrive as slots, a return value comes back, and functions nest.
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
  const mainFrame = (vars) => ({ id: "main", name: "main()", vars });
  const addFrame = (vars) => ({ id: "add", name: "add(a, b)", vars });

  window.LESSON_VIZ = {
    scene: { board: true, regions: ["code", "stack"], zoomTab: true },
    chipName: "RAM",
    chipAddr: "the code and the call stack",
    code: CODE,
    steps: [
      { narr: "A **function** is a named bundle of steps, and those steps live in the `code` area of memory - here `add`, which takes two numbers.\nThe CPU can jump to them whenever they are called.", pc: 0, codeLive: true, ram: true, highlight: "ram", codeMark: { text: "int add(int a, int b) {", kind: "stmt" }, stack: [mainFrame([])] },
      { narr: "Write the steps once, then **reuse** them.\nCall `add` wherever you need it, as many times as you like, without rewriting the body.", pc: 3, codeLive: true, ram: true, codeMark: { text: "main()", kind: "stmt" }, stack: [mainFrame([])] },
      { narr: "Calling `add(3, 5)` makes the CPU jump into `add`'s code and pushes a new **frame** - the function's own local memory.\nThe arguments become local variables inside that frame: `a = 3` and `b = 5`.", pc: 4, codeLive: true, ram: true, highlight: "soc", instr: "call add \u2192 jump", codeMark: { text: "add(3, 5)", kind: "expr" }, stack: [mainFrame([{ id: "main.r", k: "r", empty: true }]), addFrame([{ id: "add.a", k: "a", v: "3", hot: true }, { id: "add.b", k: "b", v: "5", hot: true }])] },
      { narr: "Now the CPU runs `add`'s body: it reads `a` and `b` from the frame and works out `a + b` - `8`.\n**Local** variables like `a` and `b` only exist while this frame is on the stack.", pc: 1, codeLive: true, ram: true, highlight: "soc", instr: "a + b = 8", codeMark: { text: "a + b", kind: "expr" }, stack: [mainFrame([{ id: "main.r", k: "r", empty: true }]), addFrame([{ id: "add.a", k: "a", v: "3" }, { id: "add.b", k: "b", v: "5" }])] },
      { narr: "`add` hands the result back and its frame is **popped** off the stack - that memory is reclaimed at once.\nThe program counter returns to `main`, and `8` lands in `r`.", pc: 4, codeLive: true, ram: true, instr: "return 8 \u2192 pop", stack: [mainFrame([{ id: "main.r", k: "r", v: "8", hot: true }])] },
      { narr: "Programs are built from **many functions** calling each other.\n`main` is just the one the program starts in - the rest are called from there.", pc: 5, codeLive: true, ram: true, codeMark: { text: "print r", kind: "stmt" }, stack: [mainFrame([{ id: "main.r", k: "r", v: "8" }])] },
    ],
  };
})();
