// Visual for git-inside-tree - a DATA-ONLY file driving the `objects` panel.
//
// THEORY VOICE. The learner is not doing anything here - they are being shown
// how git works. No "now do X", no "watch", no "try it": those belong to the
// practical track. Every sentence describes git, not the reader.
//
// Ids from real git 2.34.1, reproduced by our store:
//   blob notes.md      3b18e512dba79e4c8300dd08aeb37f8e728b8dad
//   blob docs/guide.md d9b401251bb36c51ca5c56c2ffc8a24a78ff20ae
//   tree docs/         af5e9eaee94e434a05e5e461f8d102b42da42834
//   tree top           6e5cb5bf4fb518d4d56f1639d9dfca12ad228aed
(function () {
  "use strict";

  var WRITE = { act: "write", path: "notes.md", text: "hello world\n" };
  var STORE = { act: "store", path: "notes.md" };
  var WRITE2 = { act: "write", path: "todo.md", text: "feed the cat\n" };
  var STORE2 = { act: "store", path: "todo.md" };
  var LIST = { act: "list" };
  var DEEP = { act: "write", path: "docs/guide.md", text: "read me\n" };
  var STORE_DEEP = { act: "store", path: "docs/guide.md" };
  var EDIT_DEEP = { act: "write", path: "docs/guide.md", text: "read me first\n" };

  var BLOBS = [WRITE, STORE, WRITE2, STORE2];
  var FLAT = [WRITE, STORE, WRITE2, STORE2, LIST];
  var NESTED = [WRITE, STORE, DEEP, STORE_DEEP, LIST];
  var NESTED_EDITED = [WRITE, STORE, DEEP, STORE_DEEP, LIST, EDIT_DEEP, STORE_DEEP, LIST];

  window.LESSON_CONFIG = {
    code: [],
    legend: [
      { sw: "#1f6f5f", label: "an object, and everything inside it" },
      { sw: "#55c86a", label: "written just now" },
      { sw: "#8b98a5", label: "dashed - nothing points at it yet" }
    ],
    layout: {
      visual: [{ type: "objects" }],
      aside: [{ type: "narration" }, { type: "controls" }]
    },
    steps: [
      {
        narr: "Blobs carry bytes and no names, so on their own they cannot rebuild a folder. Git closes that gap with a second kind of object, the **tree**, whose rows pair a name with the id of the bytes that belong under it.",
        objects: { lens: "chain", acts: BLOBS, fresh: 0, note: "bytes, but nothing that says which file they are" }
      },
      {
        narr: "Here is one, holding both files. The whole object is those rows - a tree stores no dates, no sizes, no history. It answers a single question: which names does this folder have, and what is under each of them.",
        objects: { lens: "chain", acts: FLAT, fresh: 1, open: "tree", note: "one row per name, and nothing else" }
      },
      {
        narr: "Each row also begins with a number. Git keeps almost nothing about permissions - only whether a file is meant to be executable, plus what kind of thing the row leads to. Five values cover every case, and the odd-looking shape is inherited from Unix.",
        objects: { lens: "chain", acts: FLAT, fresh: 0, open: "tree", note: "100644 a file, 100755 executable, 040000 a folder" }
      },
      {
        narr: "A row can lead to another tree, and that is what a folder is. Git writes one tree object per directory, so a project with a `docs` folder in it has two of them - the top tree with a row for `docs`, and the tree that `docs` row leads to.",
        objects: { lens: "chain", acts: NESTED, fresh: 2, open: "tree", note: "a folder is a row that leads to another tree" }
      },
      {
        narr: "Because names come from contents, a change never stays where it happened. A different byte in `docs/guide.md` makes a different blob id, which changes a row in the `docs` tree, which changes that tree's id, which changes a row in the top tree. One edit, three renamed objects - and the top id now stands for every byte beneath it.",
        objects: { lens: "chain", acts: NESTED_EDITED, fresh: 3, note: "the top id summarises everything under it" }
      }
    ]
  };
})();
