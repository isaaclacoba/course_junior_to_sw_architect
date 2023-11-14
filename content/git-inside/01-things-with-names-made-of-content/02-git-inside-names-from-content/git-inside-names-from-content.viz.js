// Visual for git-inside-names-from-content - a DATA-ONLY file driving the
// `objects` panel's `folder` lens.
//
// Every id quoted in the prose is real and was cross-checked against
// `git hash-object --stdin` on git 2.34:
//   "hello world\n"   3b18e512dba79e4c8300dd08aeb37f8e728b8dad
//   "hello world!\n"  a0423896973644771497bdc03eb99d5281615b51
// The store computes them the same way, so what the learner reads and what the
// picture draws cannot drift - and a learner who types the command gets the
// same forty characters back.
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
        narr: "`notes.md` holds one line: `hello world`. Run `git add notes.md` and the first object appears in `objects/`. Nobody typed that name. Git worked it out.",
        objects: { lens: "folder", acts: [WRITE, STORE], fresh: 1, note: "one object, one name nobody chose" }
      },
      {
        narr: "The full name is **3b18e512dba79e4c8300dd08aeb37f8e728b8dad** - forty characters of hex. Git took the bytes of your file, put a short header in front of them - `blob 12` then a zero byte - and ran the lot through **SHA-1**. Same bytes in, same forty characters out. On any machine, in any year.",
        objects: { lens: "folder", acts: [WRITE, STORE], fresh: 0, note: "the name is a fingerprint of the bytes" }
      },
      {
        narr: "You can check it right now, without this course: `echo \"hello world\" | git hash-object --stdin` prints the same forty characters. That is worth doing once - it is the difference between believing this and knowing it.",
        objects: { lens: "folder", acts: [WRITE, STORE], fresh: 0, note: "the same forty characters in your own terminal" }
      },
      {
        narr: "The listing splits that name in two: a folder called `3b`, and a file called the remaining thirty-eight. That is only filing - some filesystems slow down with a hundred thousand files in one folder, so git spreads them over 256 small ones.",
        objects: { lens: "folder", acts: [WRITE, STORE], fresh: 0, note: "3b/18e512... is one name, filed in two parts" }
      },
      {
        narr: "Now copy the line into a second file, `copy.md`, and add that too. **No new object.** Same bytes, same name - and the object with that name is already there, so there is nothing to write. Two files of yours, one object of git's.",
        objects: { lens: "folder", acts: [WRITE, STORE, COPY, STORE_COPY], fresh: 2, note: "two files, still one object" }
      },
      {
        narr: "Change one character - `hello world!` - and add it. The new name is **a0423896973644771497bdc03eb99d5281615b51**. Every character of it is different. A one-letter edit changes the whole name, and that is what makes it useful for spotting whether two things are the same.",
        objects: { lens: "folder", acts: [WRITE, STORE, COPY, STORE_COPY, SHOUT, STORE_SHOUT], fresh: 2, note: "one letter changed, forty characters changed" }
      },
      {
        narr: "An object's name is a fingerprint of what is inside it. Nothing else about the file went into it - and that should bother you slightly, because the name `notes.md` is nowhere in that object. The next lesson opens one up and shows you exactly what git kept.",
        objects: { lens: "folder", acts: [WRITE, STORE, COPY, STORE_COPY, SHOUT, STORE_SHOUT], fresh: 0, note: "two objects, three files, and no file names anywhere" }
      }
    ]
  };
})();
