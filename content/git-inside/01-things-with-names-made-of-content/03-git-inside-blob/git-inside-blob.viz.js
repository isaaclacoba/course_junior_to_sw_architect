// Visual for git-inside-blob - a DATA-ONLY file driving the `objects` panel.
//
// THEORY VOICE: every sentence describes git. The reader performs nothing.
// One card, one new idea; the picture moves on almost every card.
//
// Every number was measured against real git 2.34.1:
//   sha1 of the file's own bytes ... 22596363b3de40b06f981fb85d82312e8c0ed511
//   sha1 of "blob 12\0hello world\n" 3b18e512dba79e4c8300dd08aeb37f8e728b8dad  <- the blob id
//   sha1 of "blob 3\0hi\n" .......... 45b983be36b73c0788dc9cbcb76cbb80fc7bb057
//   100KB file + 1 char appended .... two objects, 104738 and 104736 bytes
//   marking a tracked file executable  0 new objects; the index reads 100755
//   two duplicate files added ....... 0 new objects
(function () {
  "use strict";

  var GREETING = "hello world\n";
  var WRITE = { act: "write", path: "notes.md", text: GREETING };
  var STORE = { act: "store", path: "notes.md" };
  var EDIT = { act: "write", path: "notes.md", text: "hello world\ngoodbye\n" };
  var COPY1 = { act: "write", path: "copy1.md", text: GREETING };
  var STORE1 = { act: "store", path: "copy1.md" };
  var COPY2 = { act: "write", path: "copy2.md", text: GREETING };
  var STORE2 = { act: "store", path: "copy2.md" };

  var ONE = [WRITE, STORE];
  var EDITED = [WRITE, STORE, EDIT, STORE];
  var COPIED = [WRITE, STORE, COPY1, STORE1, COPY2, STORE2];

  window.LESSON_CONFIG = {
    code: [],
    legend: [
      { sw: "#1f6f5f", label: "an object, and everything inside it" },
      { sw: "#55c86a", label: "stored just now" },
      { sw: "#8b98a5", label: "dashed - nothing points at it yet" }
    ],
    layout: {
      visual: [{ type: "objects" }],
      aside: [{ type: "narration" }, { type: "controls" }]
    },
    steps: [
      {
        narr: "The object from the last lesson has a kind, and git calls it a **blob**. One row, one id, one purpose: hold the contents of a single file.",
        objects: { lens: "chain", acts: ONE, fresh: 1, note: "a blob, and the id it was given" }
      },
      {
        narr: "Opened, it holds `hello world` and stops there. No `notes.md`, no date, no author, no folder, no permissions - everything anyone would call information *about* the file is absent. Only the file's own bytes survived.",
        objects: { lens: "chain", acts: ONE, fresh: 0, open: "blob", note: "the content, and nothing about it" }
      },
      {
        narr: "Which raises a problem. SHA-1 over exactly those bytes returns **22596363b3de40b06f981fb85d82312e8c0ed511**, and the blob is called `3b18e51`. If the object holds only the content, the id was not calculated from only the content.",
        objects: { lens: "chain", acts: ONE, fresh: 0, open: "blob", note: "hashing this text does NOT give 3b18e51" }
      },
      {
        narr: "A **header** goes in front before anything is hashed: the word `blob`, a space, the size in bytes, then a zero byte. SHA-1 over `blob 12\\0hello world\\n` gives `3b18e51` exactly. Both halves earn their place - the size says where the content ends, and the type word keeps a blob and a commit holding identical text from ever landing on the same id.",
        objects: { lens: "chain", acts: ONE, fresh: 0, open: "blob", openRaw: true, note: "blob + size + a zero byte + the content" }
      },
      {
        narr: "What git does with a changed file is blunter than most people expect. The edited version becomes a **second, complete blob**; there is no record anywhere of what changed between them. One extra character on a 100KB file leaves a second object of 104,736 bytes sitting beside the first.",
        objects: { lens: "chain", acts: EDITED, fresh: 1, note: "one edit, two entire copies" }
      },
      {
        narr: "The same bluntness pays off in reverse. Files holding identical bytes produce identical ids, so further copies write **no object at all**, and changing a file's permissions to make it executable writes nothing either - a blob has no permissions inside it. Which file the bytes belong to, and whether it runs, are things git records elsewhere. The next lesson opens that elsewhere.",
        objects: { lens: "chain", acts: COPIED, fresh: 0, note: "three files, and one blob between them" }
      }
    ]
  };
})();
