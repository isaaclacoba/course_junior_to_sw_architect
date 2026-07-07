// Visual for theory-20 "Version control" - data-only, decoupled from
// theory-20.js. No board: the stack region is reused as the commit HISTORY,
// each commit a saved snapshot (a frame) whose slots are the files it changed.
// Newest commit sits on top.
(function () {
  "use strict";

  const file = (id, name, v) => ({ id, k: name, v });
  const commit = (id, name, vars) => ({ id, name, vars });

  const c1 = () => commit("c1", "a1b2 \u00b7 first version", [file("c1a", "Program.cs", "new")]);
  const c2 = () => commit("c2", "c3d4 \u00b7 add login", [file("c2a", "Login.cs", "new"), file("c2b", "Program.cs", "changed")]);
  const c3 = () => commit("c3", "e5f6 \u00b7 Ana: fix typo", [file("c3a", "Login.cs", "changed")]);

  window.LESSON_VIZ = {
    scene: { board: false, regions: ["stack"], zoomTab: false },
    regionTags: { stack: "HISTORY <span>\u00b7 newest commit on top</span>" },
    chipName: "history",
    chipAddr: "each commit is a saved snapshot",
    steps: [
      { narr: "Code is never really finished; you change it constantly.\nA **version control** tool tracks every change you make, so you never lose work and can always see what changed, and when.", stack: [] },
      { narr: "When you reach a point worth keeping, you make a **commit**.\nThat is a saved snapshot of your code at that moment, with a short message saying what changed.", stack: [c1()] },
      { narr: "All your commits together form a **history** - a timeline of how the code grew, snapshot by snapshot.\nYou can look back at any point and even undo a change that turned out wrong.", stack: [c1(), c2()] },
      { narr: "Version control also lets people **work together**.\nEveryone keeps their own copy and makes commits; here Ana's commit joins yours, so the whole team's work comes together without anyone overwriting anyone else.", stack: [c1(), c2(), c3()] },
    ],
  };
})();
