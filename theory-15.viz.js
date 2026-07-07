// Visual for theory-15 "Where data lives" - data-only, decoupled from theory-15.js.
// Full machine scene: the board plus the accurate process memory regions in
// low-to-high address order (code/text, rodata, data, BSS, heap, stack). The
// region types and their labels live in the widget engine; the lesson only
// picks which regions to show and supplies their contents.
(function () {
  "use strict";

  const CODE = [
    "int greeted = 0",
    "run() {",
    "  int score = 7",
    '  dog = new Dog("Rex")',
    "  greet(dog)",
    "  return",
    "}",
  ];
  const G = [{ id: "greeted", k: "greeted", v: "0" }];
  const CONSTS = [{ id: "pi", k: "PI", v: "3.14159" }];
  const DOG = { id: "d1", type: "Dog", fields: [["Name", '"Rex"']] };
  const runFrame = (vars) => ({ id: "run", name: "run()", vars });

  window.LESSON_VIZ = {
    scene: { board: true, regions: ["code", "rodata", "data", "bss", "stack", "heap"], zoomTab: true },
    chipName: "LPDDR5 RAM",
    chipAddr: "where the running program keeps its data",
    code: CODE,
    steps: [
      { narr: "While a program runs, its data lives in memory - **RAM**. But the program itself starts on the `UFS` storage chip: non-volatile flash that keeps it with the power off.\nThe CPU cannot run it from there, and RAM is still empty.", pc: -1, instr: "idle", ram: false, codeLive: false, highlight: "ufs", rodata: [], data: [], bss: [], stack: [], heap: [] },
      { narr: "Power on. The program is copied from `UFS` into RAM - the computer's fast working space, where its data lives while it runs.\nRAM is **volatile**: quick to reach, but wiped the moment power drops.", pc: -1, instr: "boot", ram: true, load: true, codeLive: true, highlight: "ram", rodata: [], data: [], bss: [], stack: [], heap: [] },
      { narr: "Inside RAM, memory is one long row of numbered slots.\nEach slot's number is its **address**, so the program can always find that exact slot again - like a wall of numbered lockers.", pc: -1, instr: "addressing", ram: true, codeLive: true, highlight: "ram", rodata: [], data: [], bss: [], stack: [], heap: [] },
      { narr: "That row is not one blob - it is split into **regions**, each with a job.\nYou will lean on three the most (`stack`, `heap` and globals - `data` and `BSS`), but these are all the areas a running program keeps.", pc: -1, instr: "regions", ram: true, codeLive: true, highlight: ["ram", "stack", "heap", "data", "bss"], rodata: [], data: [], bss: [], stack: [], heap: [] },
      { narr: "The instructions sit in the **code** (or text) segment, kept read-only so a bug cannot rewrite the program.\nRight beside it, `rodata` holds fixed constants - values that never change, like `PI`.", pc: 1, instr: "read code", ram: true, codeLive: true, core: 0, highlight: ["soc", "code", "rodata"], packets: [{ path: "trRam", reverse: true }], rodata: CONSTS, data: [], bss: [], stack: [], heap: [] },
      { narr: "Values that last the whole run - **globals** and statics - split by how they start.\n`greeted = 0` starts at zero, so it lives in `BSS`; a global given a real value up front would sit in `DATA` instead.", pc: 0, instr: "int greeted", ram: true, codeLive: true, core: 0, highlight: "bss", rodata: CONSTS, data: [], bss: G, stack: [], heap: [] },
      { narr: "A variable is a labelled slot. The values a function is using right now go on the **stack**: each time a function is called, its values are placed on top.\n`int score = 7` lands in `run()`'s frame.", pc: 2, instr: "score = 7", ram: true, codeLive: true, core: 0, highlight: "stack", packets: [{ path: "trRam" }], rodata: CONSTS, data: [], bss: G, stack: [runFrame([{ id: "run.score", k: "score", v: "7" }])], heap: [] },
      { narr: "The `Dog` is created with `new`, so it is an object on the **heap** - not tucked inside `run()`'s frame. Why there? Its lifetime is not tied to this one call: it may need to outlive `run()`, and the heap keeps things until nothing refers to them.\nThe slot `dog` just holds its address - a note of where to find it.", pc: 3, instr: "new Dog", ram: true, codeLive: true, core: 1, highlight: "heap", packets: [{ path: "trRam" }], rodata: CONSTS, data: [], bss: G, stack: [runFrame([{ id: "run.score", k: "score", v: "7" }, { id: "run.dog", k: "dog", ref: "d1" }])], heap: [{ ...DOG }] },
      { narr: "Calling `greet()` places its own values on top - a fresh **frame**.\nEach call gets its own slots, stacked above the caller's.", pc: 4, instr: "call greet", ram: true, codeLive: true, core: 1, highlight: "stack", packets: [{ path: "trRam", reverse: true }], rodata: CONSTS, data: [], bss: G, stack: [runFrame([{ id: "run.score", k: "score", v: "7" }, { id: "run.dog", k: "dog", ref: "d1" }]), { id: "greet", name: "greet(pet)", vars: [{ id: "greet.pet", k: "pet", ref: "d1" }] }], heap: [{ ...DOG }] },
      { narr: "When `greet()` finishes, its values are taken straight back off the stack - **automatically**, with no clean-up code.\nThe `Dog` on the heap is untouched; `run()` still uses it.", pc: 5, instr: "return", ram: true, codeLive: true, highlight: "stack", rodata: CONSTS, data: [], bss: G, stack: [runFrame([{ id: "run.score", k: "score", v: "7" }, { id: "run.dog", k: "dog", ref: "d1" }])], heap: [{ ...DOG }] },
      { narr: "`run()` ends and its frame comes off too. The global `greeted` lived the whole run; the stack is empty now, and nothing points to the `Dog`.\nSo later the **garbage collector** reclaims the heap space it used.", pc: 6, instr: "halt", ram: true, codeLive: true, highlight: "heap", rodata: CONSTS, data: [], bss: G, stack: [], heap: [{ ...DOG }] },
      { narr: "So the full picture, low address to high:\n- `code` / `text` - the read-only instructions\n- `rodata` - fixed constants\n- `data` and `bss` - globals (set, and zero-set)\n- `heap` - long-lived objects, grows one way\n- `stack` - one frame per call, grows the other\n\nShared libraries load into mapped regions too, but these are the ones your code touches.", pc: -1, instr: "recap", ram: true, codeLive: true, highlight: "ram", rodata: CONSTS, data: [], bss: G, stack: [], heap: [{ ...DOG }] },
    ],
  };
})();
