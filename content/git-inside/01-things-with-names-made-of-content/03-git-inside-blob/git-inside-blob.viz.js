// Visual for git-inside-blob - a DATA-ONLY file driving the `objects` panel.
//
// The `chain` lens is the right one here even though nothing points at anything
// yet: it is the only lens that shows what is INSIDE an object, and a blob's
// whole lesson is its contents. The rows read "(unnamed)" on purpose - at this
// point in the track no name reaches them, which is exactly the gap lesson 4
// fills.
//
// Ids are real: "hello world\n" is 3b18e512..., checked against git hash-object.
(function () {
  "use strict";

  var GREETING = "hello world\n";
  var WRITE = { act: "write", path: "notes.md", text: GREETING };
  var STORE = { act: "store", path: "notes.md" };
  var RENAMED = { act: "write", path: "diary.md", text: GREETING };
  var STORE_RENAMED = { act: "store", path: "diary.md" };

  window.LESSON_CONFIG = {
    code: [],
    legend: [
      { sw: "#1f6f5f", label: "an object, and everything inside it" },
      { sw: "#55c86a", label: "stored just now" },
      { sw: "#8b98a5", label: "dashed - no name reaches it yet" }
    ],
    layout: {
      visual: [{ type: "objects" }],
      aside: [{ type: "narration" }, { type: "controls" }]
    },
    steps: [
      {
        narr: "Here is the object from last lesson, opened up. Its name is `3b18e51` and its contents are `hello world` - the exact bytes of your file. Git calls this kind of object a **blob**.",
        objects: { lens: "chain", acts: [WRITE, STORE], fresh: 1, note: "a blob: a name, and the bytes it was made from" }
      },
      {
        narr: "Now read what is **not** there. No `notes.md`. No date, no author, no folder, no file permissions. A blob is the content and nothing else - git threw the rest away before it even worked out the name.",
        objects: { lens: "chain", acts: [WRITE, STORE], fresh: 0, note: "no name, no date, no author - just bytes" }
      },
      {
        narr: "That explains something from last lesson. Two files with the same text gave one object, because from the blob's point of view there was nothing to tell them apart. The name was never part of the thing being named.",
        objects: { lens: "chain", acts: [WRITE, STORE], fresh: 0, note: "nothing in here could distinguish two files" }
      },
      {
        narr: "And it explains renaming. Call the file `diary.md` instead and add it: the bytes have not changed, so the name has not changed, so **no new object is written**. Renaming a file costs git nothing, because the rename never touched the content.",
        objects: { lens: "chain", acts: [WRITE, STORE, RENAMED, STORE_RENAMED], fresh: 2, note: "renamed, and still exactly one object" }
      },
      {
        narr: "The row says `(unnamed)` for a reason. Nothing in the repository points at this blob yet - not a branch, not a save. The blob is stored and unreachable at the same time. Part three comes back to that pair.",
        objects: { lens: "chain", acts: [WRITE, STORE, RENAMED, STORE_RENAMED], fresh: 0, note: "stored, and reached by nothing" }
      },
      {
        narr: "Git kept your bytes and lost your file name. That cannot be the whole story - `git checkout` puts files back with the right names, so the name is written down somewhere. The next lesson finds where.",
        objects: { lens: "chain", acts: [WRITE, STORE, RENAMED, STORE_RENAMED], fresh: 0, note: "the name has to live somewhere else" }
      }
    ]
  };
})();
