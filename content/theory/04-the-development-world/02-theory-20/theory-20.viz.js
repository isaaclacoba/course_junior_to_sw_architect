// Visual for theory-20 "How code is shared" - data-only. No board: the stack
// region is reused as the commit HISTORY, each commit a saved snapshot (a frame)
// whose slots are the files it changed. Newest commit sits on top. The later
// steps extend the story: a branch splits off, a merge brings it back, and a
// remote shares the whole history across a team.
(function () {
  "use strict";

  const file = (id, name, v) => ({ id, k: name, v });
  const commit = (id, name, vars) => ({ id, name, vars });

  const c1 = () => commit("c1", "a1b2 \u00b7 first version", [file("c1a", "Program.cs", "new")]);
  const c2 = () => commit("c2", "c3d4 \u00b7 add login", [file("c2a", "Login.cs", "new"), file("c2b", "Program.cs", "changed")]);
  const c3 = () => commit("c3", "e5f6 \u00b7 Ana: fix typo", [file("c3a", "Login.cs", "changed")]);
  const c4 = () => commit("c4", "7a8b \u00b7 [branch retries] try it", [file("c4a", "Login.cs", "changed")]);
  const c5 = () => commit("c5", "9c0d \u00b7 merge retries into main", [file("c5a", "Login.cs", "merged")]);

  window.LESSON_CONFIG = {
    scene: { board: false, regions: ["stack"], zoomTab: false },
    regionTags: { stack: "HISTORY <span>\u00b7 newest commit on top</span>" },
    chipName: "history",
    chipAddr: "each commit is a saved snapshot",
    steps: [
      { narr: "Code is never really finished; you change it constantly.\nA **version control** tool tracks every change you make, so you never lose work and can always see what changed, and when.", stack: [] },
      { narr: "When you reach a point worth keeping, you make a **commit**.\nThat is a saved snapshot of your code at that moment, with a short message saying what changed.", stack: [c1()] },
      { narr: "All your commits together form a **history** - a timeline of how the code grew, snapshot by snapshot.\nYou can look back at any point and even undo a change that turned out wrong.", stack: [c1(), c2()] },
      { narr: "Version control also lets people **work together**.\nEveryone keeps their own copy and makes commits; here Ana's commit joins yours, so the whole team's work comes together without anyone overwriting anyone else.", stack: [c1(), c2(), c3()] },
      { narr: "Sometimes you want to try a change without risking the version that works.\nSo you open a **branch** - your own line of commits that splits off from the main one. You experiment freely there, and the main line stays untouched.", stack: [c1(), c2(), c3(), c4()] },
      { narr: "When the change is ready and works, you **merge** the branch back.\nIts commits join the main line, and the two histories become one again - now everyone's copy has the finished work.", stack: [c1(), c2(), c3(), c4(), c5()] },
      { narr: "So far the whole history lives on your own machine. A **remote** is a shared copy of it on a server, so you and your teammates all push your commits to one agreed place and pull down each other's.\nA platform like GitHub hosts that remote and adds a home for the project - a place for issues, reviews, and browsing the history.", stack: [c1(), c2(), c3(), c4(), c5()] },
      { narr: "So version control does far more than save snapshots.\nYou **branch** to try things safely, **merge** to bring them back, and share one history through a **remote** - which is how real projects are built by a whole team, one commit at a time.", stack: [c1(), c2(), c3(), c4(), c5()] },
    ],
  };
})();
