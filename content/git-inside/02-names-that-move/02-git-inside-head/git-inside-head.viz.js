// Visual for git-inside-head - a DATA-ONLY file driving the `objects` panel.
//
// THEORY VOICE: every sentence describes git. The reader performs nothing.
// One card, one new idea; the picture moves on almost every card.
//
// Every number was measured against real git 2.34.1:
//   .git/HEAD symbolic ........... 23 bytes   ref: refs/heads/main\n
//   .git/HEAD detached ........... 41 bytes   87ab8c928838d4dc85624d40fb10d44577510534\n
//   reflog sample (HEAD@{0}) ..... f72f3c5 HEAD@{0}: commit (amend): first, reworded
(function () {
  "use strict";

  var WRITE = { act: "write", path: "notes.md", text: "hello world\n" };
  var STORE = { act: "store", path: "notes.md" };
  var LIST = { act: "list" };
  var SAVE = { act: "save", message: "first" };
  var NAME = { act: "name", ref: "refs/heads/main" };
  var SWITCH_FEATURE = { act: "switch", ref: "refs/heads/feature" };
  var SWITCH_MASTER = { act: "switch", ref: "refs/heads/main" };
  var DETACH = { act: "detach", at: "first" };

  var SETUP = [WRITE, STORE, LIST, SAVE, NAME];
  var BRANCH_FEATURE = [{ act: "name", ref: "refs/heads/feature" }];

  window.LESSON_CONFIG = {
    code: [],
    legend: [
      { sw: "#1f6f5f", label: "an object, and everything inside it" },
      { sw: "#55c86a", label: "stored just now" },
      { sw: "#dda94b", label: "a ref - a human-chosen name" }
    ],
    layout: {
      visual: [{ type: "objects" }],
      aside: [{ type: "narration" }, { type: "controls" }]
    },
    steps: [
      {
        narr: "A commit knows nothing about which branch it belongs to. The link runs one way: a ref points at a commit, and the commit holds no record of any ref. Yet when a new commit is made, git knows which ref to update. The file **`.git/HEAD`** is what keeps track.",
        objects: { lens: "chain", acts: SETUP, fresh: 1, focus: ["main", "commit"], note: "one commit, one ref" }
      },
      {
        narr: "In its usual state, `HEAD` holds the **path to a ref file**. Opened as text, it reads `ref: refs/heads/main` followed by one newline, 23 bytes total. The file does not repeat any part of the commit - no id, no message, no tree. It names the ref, and the ref names the commit.",
        objects: { lens: "folder", acts: SETUP, fresh: 0, focus: ["HEAD", "main"], note: "HEAD points at a ref" }
      },
      {
        narr: "This state is called **symbolic** - `HEAD` leads to a commit through a name that can move. Switching to a different branch changes what `HEAD` points at, leaving the refs themselves untouched. The content of `HEAD` is rewritten, and the 23-byte size changes with it - a longer branch name occupies more bytes.",
        objects: { lens: "folder", acts: SETUP.concat(BRANCH_FEATURE, SWITCH_FEATURE), fresh: 0, focus: ["HEAD", "feature"], note: "switched to feature" }
      },
      {
        narr: "Switching back rewrites `HEAD` again - this time to point at `main`. The refs have not moved; the only thing that changed is which one `HEAD` names. That indirection is what lets git update the right ref when a commit is saved.",
        objects: { lens: "folder", acts: SETUP.concat(BRANCH_FEATURE, SWITCH_FEATURE, SWITCH_MASTER), fresh: 0, focus: ["HEAD", "main"], note: "switched back to master" }
      },
      {
        narr: "The second state is called **detached** - `HEAD` holds a commit id directly, with no ref in between. In this mode, `HEAD` contains exactly what a ref file contains: one 40-character SHA-1 followed by a newline, 41 bytes. The symbolic pointer is gone; `HEAD` points straight at the commit, just as `main` does.",
        objects: { lens: "folder", acts: SETUP.concat(DETACH), fresh: 0, focus: ["HEAD"], note: "detached HEAD, 41 bytes" }
      },
      {
        narr: "Whether symbolic or detached, `HEAD` is the name git reads to know where the next commit belongs. The difference is what moves: in symbolic mode, the ref moves and `HEAD` stays the same. In detached mode, `HEAD` itself moves and no ref updates, so a commit made there has nothing naming it. The next lesson opens the file that decides which blob ids a commit will lead to.",
        objects: { lens: "folder", acts: SETUP.concat(DETACH), fresh: 0, focus: ["HEAD"], note: "one name, two modes" }
      },
      {
        narr: "Every time `HEAD` moves - every commit, every switch, every checkout - git writes one line to a log. That log is the **reflog**, a record of where `HEAD` has been and when. It lives at `.git/logs/HEAD`, and it is what lets you undo a checkout or recover a commit you thought was lost. The reflog is another kind of name: it reaches a commit by when it happened.",
        objects: { lens: "chain", acts: SETUP.concat(SWITCH_FEATURE, SWITCH_MASTER), fresh: 0, note: "HEAD has a log of its moves" }
      }
    ]
  };
})();
