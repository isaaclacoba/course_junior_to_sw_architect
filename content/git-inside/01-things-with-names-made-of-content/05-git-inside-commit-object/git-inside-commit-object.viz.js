// Visual for git-inside-commit-object - a DATA-ONLY file driving the `objects`
// panel.
//
// THEORY VOICE: every sentence describes git. The reader performs nothing.
// One card, one new idea, and every card changes the picture.
//
// Grounded against real git 2.34.1 with this exact author, email and date; our
// store reproduces all of it byte for byte:
//   blob   3b18e512dba79e4c8300dd08aeb37f8e728b8dad
//   tree   55f6b9cfc432d40ed27933041d16dcf4d816a630
//   commit 089528ab9685d519f68fcfc73b52c17237b1990f
//   the commit's stored header is `commit 180`, and its body is 180 bytes:
//     tree 55f6b9cfc432d40ed27933041d16dcf4d816a630
//     author A Learner <learner@example.com> 1700000000 +0000
//     committer A Learner <learner@example.com> 1700000000 +0000
//     <blank>
//     save the greeting
(function () {
  "use strict";

  var WRITE = { act: "write", path: "notes.md", text: "hello world\n" };
  var STORE = { act: "store", path: "notes.md" };
  var LIST = { act: "list" };
  var SAVE = { act: "save", message: "save the greeting" };
  var NAME = { act: "name", ref: "refs/heads/main" };
  var EDIT = { act: "write", path: "notes.md", text: "hello world\ngoodbye\n" };
  var SAVE2 = { act: "save", message: "add a goodbye" };

  var WORK = [WRITE, STORE, LIST];
  var SAVED = [WRITE, STORE, LIST, SAVE];
  var NAMED = [WRITE, STORE, LIST, SAVE, NAME];
  var TWICE = [WRITE, STORE, LIST, SAVE, NAME, EDIT, STORE, LIST, SAVE2, NAME];

  window.LESSON_CONFIG = {
    code: [],
    legend: [
      { sw: "#1d2130", label: "the .git folder, as it sits on disk" },
      { sw: "#f0b429", label: "a name pointing at one object", round: true },
      { sw: "#55c86a", label: "stored just now" }
    ],
    layout: {
      visual: [{ type: "objects" }],
      aside: [{ type: "narration" }, { type: "controls" }]
    },
    steps: [
      {
        narr: "A blob holds bytes and a tree holds names, and between them the work is fully described. What is missing is everything a person would want to know about it: who did this, when, and why. No object so far has a place to put any of that.",
        objects: { lens: "chain", acts: WORK, fresh: 0, note: "the work, and no account of it" }
      },
      {
        narr: "The commit object is where it goes, and the whole thing is **five lines of text**. The first line is a tree id, which is worth pausing on: a commit contains no files. It holds the id of the list that leads to them.",
        objects: { lens: "chain", acts: SAVED, fresh: 1, open: "commit", note: "five lines, and the first one is a tree id" }
      },
      {
        narr: "Two of those lines name people, because git allows two roles. The **author** wrote the change; the **committer** is whoever put it into this repository. They differ when a patch travels - someone writes it, someone else applies it - and each line carries its own timestamp, which is where a commit's date lives.",
        objects: { lens: "chain", acts: NAMED, fresh: 1, open: "commit", note: "author wrote it, committer placed it here" }
      },
      {
        narr: "Nothing about naming changes for this object either. The same header goes in front - `commit 180` for a body of 180 bytes - and SHA-1 over the lot gives **089528ab9685d519f68fcfc73b52c17237b1990f**. That id therefore covers the message, the timestamps, the tree, and through the tree every byte of every file.",
        objects: { lens: "chain", acts: NAMED, fresh: 0, open: "commit", openRaw: true, focus: ["commit"], note: "the same header rule, applied to a commit" }
      },
      {
        narr: "A second save writes a commit with one line the first could not have: **`parent`**, holding the id of the save before it. Each commit naming the one before turns a heap of saves into a chain that can be followed backwards, and nothing else in git is needed to make history exist.",
        objects: { lens: "chain", acts: TWICE, fresh: 4, open: "commit", note: "parent - one line, and there is a history" }
      },
      {
        narr: "Three kinds of object so far: bytes in a blob, names in a tree, and a commit tying a tree to a parent and to a person. A fourth exists, and part two meets it. Everything else in git is names pointing at these - which is where part two starts, with the one that has been sitting in `refs/heads/` all along.",
        objects: { lens: "both", acts: TWICE, fresh: 0, note: "three kinds of object, and a fourth still to come" }
      }
    ]
  };
})();
