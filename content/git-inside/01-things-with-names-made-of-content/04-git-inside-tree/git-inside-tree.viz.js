// Visual for git-inside-tree - a DATA-ONLY file driving the `objects` panel.
//
// Every id here came out of real git 2.34.1 and our store reproduces all four:
//   blob notes.md      3b18e512dba79e4c8300dd08aeb37f8e728b8dad
//   blob docs/guide.md d9b401251bb36c51ca5c56c2ffc8a24a78ff20ae
//   tree docs/         af5e9eaee94e434a05e5e461f8d102b42da42834
//   tree top           6e5cb5bf4fb518d4d56f1639d9dfca12ad228aed
// One card, one new thing. No card restates the one before it.
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
        narr: "Two files, two blobs, and no file names anywhere. `git add` writes one more object to fix that - a **tree**. Each row of it pairs a name with the id of the bytes that go under that name.",
        objects: { lens: "chain", acts: FLAT, fresh: 1, open: "tree", note: "the tree, exactly as `git cat-file -p` prints it" }
      },
      {
        narr: "The number in front is a **file mode**, borrowed from Unix. Read `100644` as two halves: `100` means an ordinary file, `644` means readable by everyone and writable by you. Git accepts only five values - `100644` a file, `100755` an executable file, `120000` a symlink, `040000` a directory, `160000` another repository.",
        objects: { lens: "chain", acts: FLAT, fresh: 0, open: "tree", note: "the only permissions git keeps: executable, or not" }
      },
      {
        narr: "That listing is a pretty-printed view. What sits in the object is tighter: the mode loses its leading zero, there is no type word, and each id is **twenty raw bytes** rather than forty characters of hex. `git cat-file -p` is doing the decoding for you.",
        objects: { lens: "chain", acts: FLAT, fresh: 0, open: "tree", openRaw: true, note: "what is really stored, entry by entry" }
      },
      {
        narr: "Now put a file in a folder. A second tree object appears, because git writes **one tree per directory** - and the top one now has a row whose id is not a blob but that other tree. An object that contains objects of its own kind: that is why it is called a tree.",
        objects: { lens: "chain", acts: NESTED, fresh: 2, open: "tree", note: "two directories on disk, two tree objects" }
      },
      {
        narr: "Edit that buried file and watch how far the damage travels. Its blob gets a new id, so the `docs` tree row changes, so `docs` gets a new id, so the top row changes, so the top tree gets a new id. **Three objects renamed by one edit** - which is exactly what makes the next object, the commit, able to stand for your whole project with a single id.",
        objects: { lens: "chain", acts: NESTED_EDITED, fresh: 3, note: "one edit at the bottom, three new ids up the chain" }
      }
    ]
  };
})();
