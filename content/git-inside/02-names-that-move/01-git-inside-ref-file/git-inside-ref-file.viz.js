// Visual for git-inside-ref-file - a DATA-ONLY file driving the `objects` panel.
//
// THEORY VOICE: every sentence describes git. The reader performs nothing.
// One card, one new idea; the picture moves on almost every card.
//
// Every number was measured against real git 2.34.1:
//   .git/refs/heads/master ......... 41 bytes
//   content ........................ 87ab8c928838d4dc85624d40fb10d44577510534\n
//                                    = 40 hex characters + one newline
//   the commit it names ............ the repo's only commit, from `git commit -m "first"`
(function () {
  "use strict";

  var WRITE = { act: "write", path: "notes.md", text: "hello world\n" };
  var STORE = { act: "store", path: "notes.md" };
  var SAVE = { act: "save", message: "first" };
  var NAME = { act: "name", ref: "refs/heads/master", commitId: "87ab8c9" };

  var ONE = [WRITE, STORE, SAVE, NAME];

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
        narr: "The first three lessons taught that an object's **name** is the SHA-1 of its contents. A commit named `87ab8c9` can only ever hold one set of bytes - change a character and the id changes with it. That design keeps the name tied to the thing it names, but it also means a human cannot choose the name. The name git calls a **ref** works the other way.",
        objects: { lens: "chain", acts: ONE, fresh: 1, note: "one commit, one tree, one blob" }
      },
      {
        narr: "The path **`.git/refs/heads/master`** is a file - an ordinary text file sitting in the hidden `.git` folder git keeps beside the working tree. Its name is not derived from its contents; a human chose the word `master`, and the file took that name.",
        objects: { lens: "chain", acts: ONE, fresh: 0, openRef: "refs/heads/master", note: "a ref, and the path to the file" }
      },
      {
        narr: "Inside, it holds one thing: **the id of a commit**. Nothing about that commit appears - no message, no date, no tree. The ref is not a container of commits, and it does not hold any of a commit's history. It is a **pointer**: a name that leads to something stored elsewhere.",
        objects: { lens: "chain", acts: ONE, fresh: 0, openRef: "refs/heads/master", note: "one commit id, and nothing else" }
      },
      {
        narr: "Opened raw, it is **41 bytes**: forty hexadecimal characters spelling out the commit id, followed by one newline. That size never changes - the shortest commit id in the world and the longest both occupy 41 bytes, because a SHA-1 is always 160 bits. Storing fifty branches pointing at fifty different commits writes 2,050 bytes of refs, no matter how many millions of objects those commits lead to.",
        objects: { lens: "chain", acts: ONE, fresh: 0, openRef: "refs/heads/master", openRefRaw: true, note: "40 hex characters + one newline" }
      },
      {
        narr: "Unlike an object, changing what the ref points at **does not change its name**. Rewriting those 41 bytes so the ref leads to a different commit moves `master` forward or backward without touching the word `master` itself - and that is what makes a branch move. The next lesson opens the file that decides which ref moves when a commit is made.",
        objects: { lens: "chain", acts: ONE, fresh: 0, openRef: "refs/heads/master", note: "the content can change; the name cannot" }
      }
    ]
  };
})();
