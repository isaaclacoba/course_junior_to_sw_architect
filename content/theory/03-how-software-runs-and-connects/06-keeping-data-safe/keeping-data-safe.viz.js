// Visual for "Keeping data safe" - data-only. No board: the stack region is
// reused as labelled slots. Each slot pairs a label (k) with a short note (v).
// Three elementary security habits, one per step: keep secrets secret, check
// permissions, don't trust input. Test-automation flavour in the examples;
// plain voice in the narration.
(function () {
  "use strict";

  const slot = (id, k, v) => ({ id, k, v });

  const publicVsSecret = () => ({
    id: "data", name: "not all data is equal",
    vars: [
      slot("u", "username", "\"ada\" \u00b7 fine to show"),
      slot("p", "password", "a secret \u00b7 never show"),
    ],
  });
  const secretFrame = () => ({
    id: "secret", name: "a secret stays hidden",
    vars: [
      slot("p", "password", "stored safely, shown as \u2022\u2022\u2022\u2022\u2022\u2022"),
      slot("k", "apiKey", "kept out of code and logs"),
    ],
  });
  const permFrame = () => ({
    id: "perm", name: "permissions \u00b7 who may read or change what",
    vars: [
      slot("o", "owner", "read + change"),
      slot("g", "guest", "read only"),
    ],
  });
  const inputFrame = () => ({
    id: "input", name: "input from outside \u00b7 check before you use it",
    vars: [
      slot("ok", "\"25\"", "looks like an age \u2192 check, then use"),
      slot("bad", "\"; wipe all\"", "hostile \u2192 reject"),
    ],
  });

  window.LESSON_VIZ = {
    scene: { board: false, regions: ["stack"], zoomTab: false },
    regionTags: { stack: "KEEPING DATA SAFE <span>\u00b7 secrets, permissions, input</span>" },
    chipName: "safety",
    chipAddr: "protect what matters",
    steps: [
      {
        narr: "Once a program stores data and talks to other programs, some of that data matters more than the rest.\nA `username` can be public, but a `password` must never leak. Data you have to keep private is a **secret**.",
        stack: [publicVsSecret()],
      },
      {
        narr: "So handle a **secret** with care. Keep it out of your code and out of your logs, store it somewhere safe, and never print it back - show `\u2022\u2022\u2022\u2022\u2022\u2022`, not the real value.\nThe same goes for an `apiKey` or anything that would let someone act as your user.",
        stack: [secretFrame()],
      },
      {
        narr: "Even data that is not secret should not be changeable by just anyone. **Permissions** decide who is allowed to read or change what.\nHere the `owner` can read and change the record, while a `guest` can only read it - the same idea as file permissions, now guarding your data.",
        stack: [permFrame()],
      },
      {
        narr: "Data that arrives from outside - a form, another program, the network - can be wrong or even hostile. So **don't trust input**: check it is what you expect before you use it.\nA value like `\"25\"` might be a valid age, but `\"; wipe all\"` is an attack - accept the first, reject the second.",
        stack: [inputFrame()],
      },
      {
        narr: "So keeping data safe comes down to three habits you can start today.\nKeep **secrets** secret, check **permissions** before you let someone read or change data, and **don't trust input** - validate it first. None of this is advanced; it is the floor you build good software on.",
        stack: [secretFrame(), permFrame()],
      },
    ],
  };
})();
