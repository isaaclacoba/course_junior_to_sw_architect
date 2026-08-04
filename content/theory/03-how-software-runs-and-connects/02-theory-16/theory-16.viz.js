// Visual for theory-16 "References vs values" - data-only. LEVEL-2 execution
// scene: the code with a moving current line, the running frame's variables on
// the left, and the objects that live on the heap as cards on the right, joined
// by a reference arrow. No board, no addresses. The one picture teaches the
// split: a value type holds its data in the box; a reference type holds a
// reference - an arrow - to an object that lives somewhere else. Copying follows
// the same split: copy a value and you duplicate the data; copy a reference and
// you duplicate the arrow, so both names point to the one object. And a
// reference can point to nothing at all - that is null.
(function () {
  "use strict";

  const CODE = [
    "int count = 5;",
    'Dog pet = new Dog("Rex");',
    "int b = count;",
    "b = 9;",
    "Dog friend = pet;",
    "Dog stray = null;",
  ];

  // The one Dog object on the heap. `hotFields` spotlights a field that just
  // changed; here the Dog never changes, so it stays quiet.
  const DOG = { id: "d1", type: "Dog", fields: [["Name", '"Rex"']] };

  // A variable box. A value box holds its data (`count : 5`); a reference box
  // holds `ref` - an arrow to a heap object; `v: "null"` is an explicit null.
  const val = (id, v, hot) => ({ id, k: id, v: String(v), ...(hot ? { hot: true } : {}) });
  const ref = (id, to, hot) => ({ id, k: id, ref: to, ...(hot ? { hot: true } : {}) });
  const nul = (id, hot) => ({ id, k: id, v: "null", ...(hot ? { hot: true } : {}) });
  const frame = (vars) => ({ id: "prog", name: "your program", vars });

  window.LESSON_CONFIG = {
    code: CODE,
    layout: {
      visual: [{ type: "code" }, { type: "heapcards" }],
      aside: [{ type: "narration" }, { type: "controls" }],
    },
    legend: [
      { sw: "#2563eb", label: "a reference - an arrow to an object", round: true },
      { sw: "#f59e0b", label: "changed this step" },
      { sw: "#c0392b", label: "null - points to nothing" },
    ],
    steps: [
      {
        narr: "A **value type** keeps its data right in the box. `int count = 5` puts the number `5` into `count` itself - the box *is* the value.\nNothing on the heap yet.",
        pc: 0, codeLive: true, codeMark: { text: "5", kind: "expr" },
        stack: [frame([val("count", 5, true)])],
        heap: [],
      },
      {
        narr: "A **reference type** is different. `new Dog(\"Rex\")` builds a `Dog` object - it lives on the **heap**, the area for things whose lifetime is not tied to one line.\n`pet` does not hold that Dog. It holds a **reference** to it: the arrow.",
        pc: 1, codeLive: true, codeMark: { text: 'new Dog("Rex")', kind: "expr" },
        stack: [frame([val("count", 5), ref("pet", "d1", true)])],
        heap: [{ ...DOG }],
      },
      {
        narr: "So the box `count` holds a number, and the box `pet` holds an arrow. Follow the arrow and you reach the real `Dog`.\nThe object is one thing; the reference is a small note that says where to find it.",
        pc: 1, codeLive: true, glow: "d1",
        stack: [frame([val("count", 5), ref("pet", "d1")])],
        heap: [{ ...DOG }],
      },
      {
        narr: "Copying splits the same way. Copy a value - `int b = count` - and the *data* is duplicated. `b` gets its own `5`, in its own box.",
        pc: 2, codeLive: true, codeMark: { text: "count", kind: "expr" },
        stack: [frame([val("count", 5), ref("pet", "d1"), val("b", 5, true)])],
        heap: [{ ...DOG }],
      },
      {
        narr: "Because `b` has its own copy, changing `b` to `9` leaves `count` at `5`.\nTwo separate boxes, two separate numbers - they were never linked.",
        pc: 3, codeLive: true, codeMark: { text: "9", kind: "expr" },
        stack: [frame([val("count", 5), ref("pet", "d1"), val("b", 9, true)])],
        heap: [{ ...DOG }],
      },
      {
        narr: "Copy a reference - `Dog friend = pet` - and it is the **arrow** that is duplicated, not the Dog. `pet` and `friend` now point to the *same* object.\nChange the Dog through either name and the other sees it, because there is still only one Dog.",
        pc: 4, codeLive: true, glow: "d1", codeMark: { text: "pet", kind: "expr" },
        stack: [frame([val("count", 5), ref("pet", "d1"), val("b", 9), ref("friend", "d1", true)])],
        heap: [{ ...DOG }],
      },
      {
        narr: "A reference can also point to **nothing**. `Dog stray = null` gives `stray` a box with no arrow at all - `null` means \"no object\".\nAsk a null reference to do something and the program stops with an error, so null is worth watching for.",
        pc: 5, codeLive: true, codeMark: { text: "null", kind: "expr" },
        stack: [frame([val("count", 5), ref("pet", "d1"), val("b", 9), ref("friend", "d1"), nul("stray", true)])],
        heap: [{ ...DOG }],
      },
      {
        narr: "The whole split in one picture:\n- **value type** (`int`) - the box holds the data; copying duplicates the data.\n- **reference type** (`Dog`) - the box holds an arrow to a heap object; copying duplicates the arrow, so names can share one object.\n- **null** - a reference to no object.\n\nWhich you get is decided by the **type**, not by how big the value is.",
        pc: -1, codeLive: true,
        stack: [frame([val("count", 5), ref("pet", "d1"), val("b", 9), ref("friend", "d1"), nul("stray")])],
        heap: [{ ...DOG }],
      },
    ],
  };
})();
