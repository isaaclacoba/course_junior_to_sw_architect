// Visual for theory-10 "Types" - data-only, decoupled from theory-10.js.
// Memory scene, no board: just the Stack region, showing named slots whose
// values carry a type, and the type staying with the slot for its whole life.
(function () {
  "use strict";

  const frame = (vars) => ({ id: "f", name: "your program", vars });
  const age = (extra) => ({ id: "age", addr: "0x7000", k: "age", v: "30", ...(extra || {}) });
  const name = (extra) => ({ id: "name", addr: "0x7008", k: "name", v: '"Rex"', ...(extra || {}) });
  const ready = (extra) => ({ id: "ready", addr: "0x7010", k: "ready", v: "true", ...(extra || {}) });
  const price = (extra) => ({ id: "price", addr: "0x7018", k: "price", v: "3.5", ...(extra || {}) });

  window.LESSON_VIZ = {
    scene: { board: false, regions: ["stack"], zoomTab: false },
    chipName: "RAM",
    chipAddr: "each slot has a type",
    steps: [
      { narr: "Every value has a **type** - a kind.\n`age` holds `30`, a whole number (an `int`). `name` holds `\"Rex\"`, some text (a `string`). `ready` holds `true`, a yes/no answer (a `bool`).", stack: [frame([age(), name(), ready()])] },
      { narr: "The **type** decides what you can do with a value.\nYou can add two `int`s - `age + 1` makes sense. Adding a `bool` to a word does not, so the compiler stops you before the program runs.", stack: [frame([age({ v: "31" }), name(), ready()])] },
      { narr: "A few **types** come up constantly:\n- `int` for whole numbers\n- `double` for decimals like `3.5`\n- `string` for text\n- `bool` for `true`/`false`", stack: [frame([age(), price(), name(), ready()])] },
      { narr: "The type **travels with the variable**.\n`age` is a number slot; it holds numbers, not text. You do not suddenly drop `\"Rex\"` into it.", stack: [frame([age(), name(), ready()])] },
      { narr: "That type stays **fixed for the slot's whole life**.\nA number box holds numbers from start to finish - which is exactly what lets the compiler catch a misuse early.", stack: [frame([age(), name(), ready()])] },
    ],
  };
})();
