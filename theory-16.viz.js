// Visual for theory-16 "References vs values" - data-only. Same layout as
// lesson 15 (board + code + stack + heap): the CPU runs the lines while the
// slots change. The honest model: every slot holds some bits directly. For a
// value type those bits ARE the data; for a reference type those bits are an
// address - a reference that points to an object on the heap. What decides
// which you get is the TYPE, not the size.
(function () {
  "use strict";

  const CODE = [
    "int count = 5;",
    'Dog pet = new Dog("Rex");',
    "int b = count;",
    "b = 9;",
    "Dog friend = pet;",
  ];
  const DOG = { id: "d1", type: "Dog", fields: [["Name", '"Rex"']] };
  const frame = (vars) => ({ id: "f", name: "your program", vars });
  const count = (extra) => ({ id: "count", addr: "0x7000", k: "count", v: "5", ...(extra || {}) });
  const pet = (extra) => ({ id: "pet", addr: "0x7008", k: "pet", ref: "d1", ...(extra || {}) });

  window.LESSON_VIZ = {
    scene: { board: true, regions: ["code", "stack", "heap"], zoomTab: true },
    chipName: "LPDDR5 RAM",
    chipAddr: "what each slot really holds",
    code: CODE,
    steps: [
      {
        narr: "Every variable is a slot that holds some bits directly. For `count`, those bits are the number `5` itself - the data sits right there in the slot.\nThat makes `int` a value type: the slot holds the value.",
        pc: 0, codeLive: true, ram: true, core: 0, highlight: ["code", "stack"], codeMark: { text: "5", kind: "expr" },
        stack: [frame([count({ hot: true })])], heap: [],
      },
      {
        narr: "`pet` is different. `new Dog(\"Rex\")` builds a `Dog` object on the heap.\n`pet`'s slot does not hold that Dog - it holds the Dog's address. That makes `Dog` a reference type.",
        pc: 1, codeLive: true, ram: true, core: 1, highlight: ["code", "stack", "heap"], codeMark: { text: 'new Dog("Rex")', kind: "expr" },
        stack: [frame([count(), pet({ hot: true })])], heap: [{ ...DOG }],
      },
      {
        narr: "So a reference is just a variable that holds - by value - a memory address.\nThe bits in `count` are a number; the bits in `pet` are an address. Follow that address (the arrow) and you reach the real `Dog` on the heap.",
        pc: 1, codeLive: true, ram: true, highlight: ["stack", "heap"], glow: "d1",
        stack: [frame([count(), pet({ hot: true })])], heap: [{ ...DOG }],
      },
      {
        narr: "Copying now splits in two. Copy a value type - `int b = count` - and the bits themselves (the `5`) are duplicated into b's own slot.\n`b` gets its own separate `5`.",
        pc: 2, codeLive: true, ram: true, core: 0, highlight: ["code", "stack"], codeMark: { text: "count", kind: "expr" },
        stack: [frame([count(), pet(), { id: "b", addr: "0x7010", k: "b", v: "5", hot: true }])], heap: [{ ...DOG }],
      },
      {
        narr: "Because `b` holds its own copy, changing `b` to `9` leaves `count` at `5`.\nTwo separate slots, two separate numbers - they were never linked.",
        pc: 3, codeLive: true, ram: true, core: 0, highlight: "stack", codeMark: { text: "9", kind: "expr" },
        stack: [frame([count(), pet(), { id: "b", addr: "0x7010", k: "b", v: "9", hot: true }])], heap: [{ ...DOG }],
      },
      {
        narr: "Copy a reference type - `Dog friend = pet` - and it is the address that gets duplicated, not the Dog.\n`pet` and `friend` now hold the same address, so both point to the one `Dog`. Change it through either name and the other sees it - there is still only one object.",
        pc: 4, codeLive: true, ram: true, core: 1, highlight: ["code", "stack", "heap"], glow: "d1", codeMark: { text: "pet", kind: "expr" },
        stack: [frame([count(), pet(), { id: "b", addr: "0x7010", k: "b", v: "9" }, { id: "friend", addr: "0x7018", k: "friend", ref: "d1", hot: true }])], heap: [{ ...DOG }],
      },
    ],
  };
})();
