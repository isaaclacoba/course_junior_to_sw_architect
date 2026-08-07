// Visual for git-inside-ref-file - a DATA-ONLY file driving the `objects` panel.
//
// THEORY VOICE: every sentence describes git. The reader performs nothing.
// One card, one new idea; the picture moves on every card.
//
// SCENE CONTRACT (code-lab/src/core/objects-scene.ts) - ONLY these fields exist:
//   lens: "folder" | "chain" | "both"   acts: ObjectAct[]   fresh: number
//   detail: "core" | "full"   open: "blob" | "tree" | "commit"   openRaw: boolean
//   note: string   author: string
// Acts: write, store, pick, list, save, name{ref,at}, switch, detach, amend, reset.
// There is NO way to open a ref file's raw bytes - the `folder` lens draws the
// ref as a line under refs/heads/, and that is what these cards use.
//
// Every number measured against real git 2.34.1:
//   .git/refs/heads/main ......... 41 bytes
//   content ........................ 40 hex characters + one newline
//   a long branch name ............. still 41 bytes (the name is the filename)
(function () {
  "use strict";

  var WRITE = { act: "write", path: "notes.md", text: "hello world\n" };
  var STORE = { act: "store", path: "notes.md" };
  var LIST = { act: "list" };
  var SAVE = { act: "save", message: "first" };
  var NAME = { act: "name", ref: "refs/heads/main" };

  var ONE = [WRITE, STORE, LIST, SAVE, NAME];

  // A second commit, then master re-pointed at it. The file's contents change;
  // the word `main` does not.
  var MOVED = ONE.concat(
    { act: "write", path: "notes.md", text: "hello world!\n" },
    { act: "store", path: "notes.md" },
    { act: "list" },
    { act: "save", message: "second" },
    { act: "name", ref: "refs/heads/main" }
  );

  // A second name, pointing back at the FIRST commit.
  var TWO_NAMES = MOVED.concat({ act: "name", ref: "refs/heads/fix", at: "first" });

  window.LESSON_CONFIG = {
    code: [],
    legend: [
      { sw: "#1f6f5f", label: "an object, named by its contents" },
      { sw: "#55c86a", label: "written just now" },
      { sw: "#dda94b", label: "a ref - a name a person chose" }
    ],
    layout: {
      visual: [{ type: "objects" }],
      aside: [{ type: "narration" }, { type: "controls" }]
    },
    steps: [
      {
        narr: "Every name so far has come from bytes. A blob, a tree and a commit are each named by the SHA-1 of what is inside them, so nobody picks those names - the contents decide. That leaves git with no word a person can say out loud. A **ref** is that word.",
        objects: { lens: "folder", acts: ONE, fresh: 1, focus: ["main"], note: "one commit, and one name for it" }
      },
      {
        narr: "A ref is a file. **`.git/refs/heads/main`** sits in the hidden `.git` folder, and the word `main` is its filename - chosen by a person, typed by hand, with no SHA-1 anywhere in it.",
        objects: { lens: "folder", acts: ONE, fresh: 0, focus: ["main", "refs/heads/"], note: "refs/heads/main - a file with a chosen name" }
      },
      {
        narr: "Inside that file is one commit id and nothing else. No message, no date, no tree, no list of earlier commits. All of that lives in the commit itself; the ref only says which commit.",
        objects: { lens: "folder", acts: ONE, fresh: 0, open: "commit", focus: ["main", "commit"], note: "all of this is in the commit, not the ref" }
      },
      {
        narr: "The file is **41 bytes**: forty hexadecimal characters, then one newline. A SHA-1 is always 160 bits, so that size never varies - and the branch's name is the filename rather than part of the contents, so a branch called `fix` and one called `release-candidate-2026` both store exactly 41 bytes.",
        objects: { lens: "both", acts: ONE, fresh: 0, focus: ["main"], note: "41 bytes, whatever the branch is called" }
      },
      {
        narr: "A second commit arrives, and `main` is rewritten to hold the new id. The filename never changed - the 41 bytes inside it did. That rewrite is the whole of what people call moving a branch.",
        objects: { lens: "folder", acts: MOVED, fresh: 3, focus: ["main"], note: "same filename, different 41 bytes" }
      },
      {
        narr: "Nothing stops a second file naming an older commit. `fix` holds the first commit's id while `main` holds the second, and both commits sit untouched in the store. Which commits a repository can still reach is decided entirely by these small files - and the next lesson opens the one that decides which of them git writes to next.",
        objects: { lens: "folder", acts: TWO_NAMES, fresh: 1, focus: ["main", "fix"], note: "two names, two commits, one store" }
      }
    ]
  };
})();
