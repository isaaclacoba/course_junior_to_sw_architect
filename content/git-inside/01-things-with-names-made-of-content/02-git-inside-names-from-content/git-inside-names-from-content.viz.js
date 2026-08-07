// Visual for git-inside-names-from-content - a DATA-ONLY file driving the
// `objects` panel's `folder` lens.
//
// THEORY VOICE: describes git, never instructs the reader.
//
// The header (`blob 12\0`) is DELIBERATELY not mentioned here. Lesson 3 opens
// with "hash those bytes yourself and you get the wrong answer", and that only
// lands if this lesson has not already given it away.
//
// Ids cross-checked against `git hash-object --stdin` on git 2.34:
//   "hello world\n"   3b18e512dba79e4c8300dd08aeb37f8e728b8dad
//   "hello world!\n"  a0423896973644771497bdc03eb99d5281615b51
//
// Acts are never translated: the id IS the bytes, so a translated file text
// would give the Spanish learner different characters from the English one.
(function () {
  "use strict";

  var GREETING = "hello world\n";
  var WRITE = { act: "write", path: "notes.md", text: GREETING };
  var STORE = { act: "store", path: "notes.md" };
  // Same bytes under a second name - deliberately, to show it costs nothing.
  var COPY = { act: "write", path: "copy.md", text: GREETING };
  var STORE_COPY = { act: "store", path: "copy.md" };
  // One character different. Not "similar" - a completely different name.
  var SHOUT = { act: "write", path: "loud.md", text: "hello world!\n" };
  var STORE_SHOUT = { act: "store", path: "loud.md" };

  window.LESSON_CONFIG = {
    code: [],
    legend: [
      { sw: "#1d2130", label: "the .git folder, as it sits on disk" },
      { sw: "#55c86a", label: "stored just now" },
      { sw: "#8b98a5", label: "greyed out - your own files, not git's" }
    ],
    layout: {
      visual: [{ type: "objects" }],
      aside: [{ type: "narration" }, { type: "controls" }]
    },
    steps: [
      {
        narr: "`notes.md` holds one line: `hello world`. Handing it to git with `git add` puts the first object into `objects/` - and it arrives already named. Nobody chose that name, and nothing was asked.",
        objects: { lens: "folder", acts: [WRITE, STORE], fresh: 1, focus: ["blob"], note: "one object, one name nobody chose" }
      },
      {
        narr: "The name in full is **3b18e512dba79e4c8300dd08aeb37f8e728b8dad**, forty characters of hex. It comes out of **SHA-1**, a calculation that reads content and returns a fixed-length answer. The same content always produces the same answer - on any machine, in any year, with no shared list to look it up in.",
        objects: { lens: "folder", acts: [WRITE, STORE], fresh: 0, focus: ["blob"], note: "the name is calculated from the contents" }
      },
      {
        narr: "That has a consequence git leans on constantly. A second file holding those same bytes needs no new object: the calculation returns the same forty characters, and an object with that name is already there. Two files of the reader's, one object of git's.",
        objects: { lens: "folder", acts: [WRITE, STORE, COPY, STORE_COPY], fresh: 2, focus: ["notes.md", "copy.md"], note: "two files, still one object" }
      },
      {
        narr: "The reverse is just as sharp. `hello world!` differs by one character, and its name is **a0423896973644771497bdc03eb99d5281615b51**. A single edited character relocates the whole name rather than nudging it, and names that jump like that make comparison trivial: equal names mean equal bytes.",
        objects: { lens: "folder", acts: [WRITE, STORE, COPY, STORE_COPY, SHOUT, STORE_SHOUT], fresh: 2, focus: ["a042389"], note: "one letter changed, forty characters changed" }
      },
      {
        narr: "The listing splits each name in two, a folder `3b` and a file named by the remaining thirty-eight characters. The split is only filing - some filesystems slow down with a hundred thousand entries in one directory, so git spreads them across 256. A name is a fingerprint of contents, and `notes.md` is nowhere inside it.",
        objects: { lens: "folder", acts: [WRITE, STORE, COPY, STORE_COPY, SHOUT, STORE_SHOUT], fresh: 0, focus: ["3b18e51"], note: "3b/18e512... is one name, filed in two parts" }
      }
    ]
  };
})();
