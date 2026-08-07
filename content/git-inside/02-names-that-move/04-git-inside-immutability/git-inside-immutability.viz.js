// Visual for git-inside-immutability - a DATA-ONLY file driving the `objects` panel.
//
// THEORY VOICE: every sentence describes git. The reader performs nothing.
// One card, one new idea; the picture moves on almost every card.
//
// Every number was measured against real git 2.34.1:
//   commit before amend .......... 87ab8c928838d4dc85624d40fb10d44577510534
//   commit after amend ........... f72f3c519ce1d6ff558d843dd194026823f0d962  (different id)
//   old commit still there? ...... yes (`git cat-file -t 87ab8c9` -> commit)
//   branches reaching it? ........ 0
//   fsck reports unreachable? .... no - reflog names it 3 times
//   after reflog expire? ......... yes - 1 unreachable commit
//
// A commit id covers its author and timestamps, so the two ids above are the
// ones THAT run produced and nobody else's - not this scene's. The prose must
// quote what the panel actually draws, which the fixed author and message make
// deterministic: d299640 before the amend, 20fe774 after it. Quoting a measured
// id here put five cards' worth of ids on screen that the learner never saw.
(function () {
  "use strict";

  var WRITE = { act: "write", path: "notes.md", text: "hello world\n" };
  var STORE = { act: "store", path: "notes.md" };
  var LIST = { act: "list" };
  var SAVE = { act: "save", message: "first" };
  var NAME = { act: "name", ref: "refs/heads/main" };
  var AMEND = { act: "amend", message: "first, reworded" };
  
  var WRITE2 = { act: "write", path: "notes.md", text: "hello world\nsecond line\n" };
  var STORE2 = { act: "store", path: "notes.md" };
  var SAVE2 = { act: "save", message: "second" };
  var NAME2 = { act: "name", ref: "refs/heads/main" };
  var RESET = { act: "reset", ref: "refs/heads/main", to: "first" };

  var SETUP = [WRITE, STORE, LIST, SAVE, NAME];
  var TWO_COMMITS = [WRITE, STORE, LIST, SAVE, NAME, WRITE2, STORE2, LIST, SAVE2, NAME2];

  window.LESSON_CONFIG = {
    code: [],
    legend: [
      { sw: "#1f6f5f", label: "an object, and everything inside it" },
      { sw: "#55c86a", label: "stored just now" },
      { sw: "#dda94b", label: "a ref - a human-chosen name" },
      { sw: "#999", label: "unreachable - no name leads here" }
    ],
    layout: {
      visual: [{ type: "objects" }],
      aside: [{ type: "narration" }, { type: "controls" }]
    },
    steps: [
      {
        narr: "A commit named `d299640` contains one tree, one parent field, one message - a fixed set of bytes. Hashing those bytes produces that id, which means the commit's **name comes from its contents**. Editing the message would produce different bytes, and different bytes hash to a different id. A commit cannot be edited - its name prevents it.",
        objects: { lens: "chain", acts: SETUP, fresh: 1, focus: ["d299640"], note: "one commit, one id" }
      },
      {
        narr: "Amending a commit writes a **new** commit with a new id - `20fe774` - and moves the ref to point at it. The original commit `d299640` is not touched. Its bytes are unchanged, its id is unchanged, and it still sits in the object store exactly as it was written. The only thing that changed is that `main` no longer points at it.",
        objects: { lens: "chain", acts: SETUP.concat(AMEND), fresh: 1, focus: ["20fe774", "d299640"], note: "new commit, ref moved" }
      },
      {
        narr: "The old commit has become **unreachable** - no ref names it, and no reachable commit names it as a parent. It is greyed out because nothing leads to it, but it is still there. The id `d299640` still resolves to a commit object, and the tree and blob it pointed at are also untouched. Amending did not delete anything; it wrote one new commit and updated one ref.",
        objects: { lens: "chain", acts: SETUP.concat(AMEND), fresh: 0, focus: ["d299640"], note: "original commit orphaned" }
      },
      {
        narr: "Resetting a ref backward has the same effect - it writes nothing new, but it moves a name to point at an older commit. The commit that was at the tip becomes unreachable. The bytes are still in the store; the difference is that no ref reaches them.",
        objects: { lens: "chain", acts: TWO_COMMITS.concat(RESET), fresh: 1, note: "reset moved the ref back" }
      },
      {
        narr: "An unreachable commit does not disappear immediately. The reflog still names it - `HEAD@{1}` points at the commit `main` used to reach - so from git\u2019s side something does reach it, and it is not treated as garbage. Only when the reflog expires does the commit become truly unreachable, and even then it stays in the store until garbage collection runs.",
        objects: { lens: "chain", acts: SETUP.concat(AMEND), fresh: 0, focus: ["d299640"], note: "reflog keeps it reachable" }
      },
      {
        narr: "The lesson the object store teaches is that **objects are immutable**. A blob cannot be edited, a tree cannot be edited, and a commit cannot be edited. What looks like editing is writing a new object and moving a name. The name can change; the bytes cannot. That design is what makes every id trustworthy - if the id matches, the contents must match, because the contents cannot have changed.",
        objects: { lens: "chain", acts: SETUP.concat(AMEND), fresh: 0, note: "names move; objects do not" }
      },
      {
        narr: "Garbage collection is the process that removes unreachable objects. It happens automatically from time to time, or it can be run manually. Before an object is collected, it sits in the store taking up space - one reason a repository can grow larger than the current set of reachable commits would suggest. The cost of immutability is that deleted things stay around until collection proves they are gone.",
        objects: { lens: "chain", acts: SETUP.concat(AMEND), fresh: 0, focus: ["d299640"], note: "gc removes what nothing reaches" }
      }
    ]
  };
})();
