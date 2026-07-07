// Visual for theory-14 "Bugs: why programs go wrong" - data-only, decoupled from
// theory-14.js. Memory scene with a board: Code and Stack regions, stepping
// through a small routine to see a syntax error stop the build, a logic error
// leave a wrong value in a slot, and debugging find the line that goes wrong.
(function () {
  "use strict";

  const CODE = [
    "int a = 10",
    "int b = 5",
    "int total = a - b",
    "print total",
  ];
  const frame = (vars) => ({ id: "f", name: "your program", vars });
  const a = (v) => ({ id: "a", addr: "0x7000", k: "a", v: String(v) });
  const b = (v) => ({ id: "b", addr: "0x7004", k: "b", v: String(v) });
  const total = (v) => (v == null ? { id: "total", addr: "0x7008", k: "total", empty: true } : { id: "total", addr: "0x7008", k: "total", v: String(v) });

  window.LESSON_VIZ = {
    scene: { board: true, regions: ["code", "stack"], zoomTab: false },
    chipName: "RAM",
    chipAddr: "stepping through to find the bug",
    code: CODE,
    steps: [
      { narr: "A **bug** is a mistake in the instructions.\nThe computer did exactly what you wrote, not what you meant - so when a program misbehaves, the fault is almost always in the code.", pc: 0, codeLive: true, stack: [frame([a(10), b(5), total(null)])] },
      { narr: "One kind breaks the language's rules - a **syntax error**, like a missing symbol.\nThe compiler catches it before anything runs and refuses to build until you fix it.", pc: 2, codeLive: true, highlight: "soc", instr: "build error", stack: [frame([a(10), b(5), total(null)])] },
      { narr: "The other kind is sneakier. This code builds and runs fine, but it used `-` where it meant `+`, so `total` comes out `5` - when adding `10` and `5` should give `15`.\nThat is a **logic error**: valid code doing the wrong thing.", pc: 2, codeLive: true, instr: "got 5, expected 15", stack: [frame([a(10), b(5), total(5)])] },
      { narr: "**Debugging** means stepping through line by line, watching each slot fill.\nFirst line: `a` gets `10`.", pc: 0, codeLive: true, stack: [frame([a(10), b(5), total(null)])] },
      { narr: "Next line: `b` gets `5`.\nSo far the slots hold what you expect.", pc: 1, codeLive: true, stack: [frame([a(10), b(5), total(null)])] },
      { narr: "At this line the value goes wrong - `total` becomes `5`, not `15`. You have **found the bug**: the `-` should be a `+`.\nFix that one line, run again, and `total` reads `15`.", pc: 2, codeLive: true, instr: "fixed: 10 + 5 -> 15", stack: [frame([a(10), b(5), total(15)])] },
    ],
  };
})();
