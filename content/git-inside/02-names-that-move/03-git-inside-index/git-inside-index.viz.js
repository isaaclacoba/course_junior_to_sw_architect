// Visual for git-inside-index - a DATA-ONLY file driving the `objects` panel.
//
// THEORY VOICE: every sentence describes git. The reader performs nothing.
// One card, one new idea; the picture moves on almost every card.
//
// Every number was measured against real git 2.34.1:
//   .git/index ................... 137 bytes for one file
//   first 4 bytes ................ DIRC (the signature)
//   git ls-files -s .............. 100644 3b18e512dba79e4c8300dd08aeb37f8e728b8dad 0  notes.md
//   fields (no stage) ............ mode, blob id, path
//   .git/config .................. 124 bytes, plain text, INI sections
//   config fields ................ repositoryformatversion, filemode, logallrefupdates, user.email
(function () {
  "use strict";

  var WRITE = { act: "write", path: "notes.md", text: "hello world\n" };
  var STORE = { act: "store", path: "notes.md" };
  var PICK = { act: "pick", path: "notes.md" };
  var LIST = { act: "list" };
  var SAVE = { act: "save", message: "first" };
  var NAME = { act: "name", ref: "refs/heads/main" };
  
  var WRITE2 = { act: "write", path: "plan.md", text: "next steps\n" };
  var STORE2 = { act: "store", path: "plan.md" };
  var PICK2 = { act: "pick", path: "plan.md" };

  var SETUP = [WRITE, STORE, PICK, LIST, SAVE, NAME];
  var TWO_FILES = [WRITE, STORE, PICK, WRITE2, STORE2, PICK2];

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
        narr: "`HEAD` names the ref that moves when a commit is saved. Nothing so far says what that commit will hold. The file at **`.git/index`** decides, and it is the one file in this lesson that is not readable text.",
        objects: { lens: "folder", acts: [WRITE, STORE, PICK], fresh: 2, note: "one file added, one index entry" }
      },
      {
        narr: "The path **`.git/index`** is a file - a binary file stored beside the object database and the refs. Opened in a hex editor, the first four bytes spell the letters `DIRC`, a signature that identifies the file format. Unlike the objects, which are hashed and immutable, the index is written in place every time a file is staged.",
        objects: { lens: "folder", acts: [WRITE, STORE, PICK], fresh: 0, note: "a binary file, starts with DIRC" }
      },
      {
        narr: "What the index holds is a list - one entry per staged path, and each entry maps the path to a **blob id** and a **file mode**. The mode is one bit: whether the file is executable. The id is the SHA-1 of the file's contents, the same id the object database uses. The index does not hold the file's text - it points at the blob that does.",
        objects: { lens: "folder", acts: [WRITE, STORE, PICK], fresh: 0, note: "path -> blob id + mode" }
      },
      {
        narr: "Adding a second file appends a second entry. The index grows to hold both, and the size on disk changes - for one file it occupies 137 bytes, for two it becomes larger. The entries are sorted by path, and the file is rewritten completely every time anything is staged.",
        objects: { lens: "folder", acts: TWO_FILES, fresh: 1, note: "two files, two entries" }
      },
      {
        narr: "When a commit is saved, git reads the index to know which blobs to reach. The commit does not reach the blobs directly - it points at a tree, and the tree holds the same path-to-id mapping the index carried. Committing freezes the index's current state as an immutable tree object, and the index itself stays behind, ready for the next change.",
        objects: { lens: "folder", acts: TWO_FILES.concat([LIST, SAVE, NAME]), fresh: 1, note: "index becomes a tree on commit" }
      },
      {
        narr: "The index is the middle layer - it stands between the working files and the object database, and it is what makes staging exist as a concept. A file joins the next commit when it is added, and adding writes the index; the commit comes later, built from it. That separation is what lets a commit hold the snapshot you chose.",
        objects: { lens: "folder", acts: TWO_FILES.concat([LIST, SAVE, NAME]), fresh: 0, note: "the layer between working tree and commit" }
      },
      {
        narr: "Not everything in `.git` is an object or a name. The file **`.git/config`** is plain text holding settings - INI-style sections and keys that decide how this repository behaves. One setting, `logallrefupdates`, is what controls whether git keeps a reflog at all. Config occupies 124 bytes in a fresh repository, and the file grows as settings are added.",
        objects: { lens: "folder", acts: SETUP, fresh: 0, detail: "full", note: "config holds settings, not objects" }
      }
    ]
  };
})();
