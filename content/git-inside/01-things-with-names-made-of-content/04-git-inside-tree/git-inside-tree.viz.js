// Visual for git-inside-tree - a DATA-ONLY file driving the `objects` panel.
//
// Real ids, cross-checked against git 2.34:
//   blob "hello world\n"                          3b18e512dba79e4c8300dd08aeb37f8e728b8dad
//   tree with one entry 100644 notes.md -> blob   55f6b9cfc432d40ed27933041d16dcf4d816a630
// The second was checked with `git add notes.md && git write-tree`.
//
// Nesting (a tree naming a tree) is DEFERRED on purpose, not hidden: the acts
// here build flat trees, and the last step says so.
(function () {
  "use strict";

  var WRITE = { act: "write", path: "notes.md", text: "hello world\n" };
  var STORE = { act: "store", path: "notes.md" };
  var WRITE2 = { act: "write", path: "todo.md", text: "feed the cat\n" };
  var STORE2 = { act: "store", path: "todo.md" };
  var LIST = { act: "list" };

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
        narr: "Two files, two blobs. Bytes and nothing else, twice. If this were all git kept, restoring your work would give you two piles of text and no way to know which was `notes.md`.",
        objects: { lens: "chain", acts: [WRITE, STORE, WRITE2, STORE2], fresh: 2, note: "two blobs, and no file names in sight" }
      },
      {
        narr: "`git add` writes something else as well: a **tree**. A tree is a list, and each row of the list says a name and the id of the thing with that name.",
        objects: { lens: "chain", acts: [WRITE, STORE, WRITE2, STORE2, LIST], fresh: 1, note: "a tree: names on the left, ids on the right" }
      },
      {
        narr: "Read a row in full and there are three parts: `100644` - an ordinary, non-executable file - then the name `notes.md`, then the id of the blob. Mode, name, id. That is a tree entry, and there is nothing else in it.",
        objects: { lens: "chain", acts: [WRITE, STORE, WRITE2, STORE2, LIST], fresh: 0, note: "mode, name, id - the whole entry" }
      },
      {
        narr: "The tree has a name of its own, and it comes from the same rule as everything else: hash its bytes. With just `notes.md` in it, that name is **55f6b9cfc432d40ed27933041d16dcf4d816a630** - and `git add notes.md && git write-tree` prints exactly that in a real repository.",
        objects: { lens: "chain", acts: [WRITE, STORE, LIST], fresh: 0, note: "a tree is an object, named like any other" }
      },
      {
        narr: "Change any file and its blob gets a new id, so the tree row changes, so the **tree** gets a new id too. A change at the bottom renames everything above it.",
        objects: { lens: "chain", acts: [WRITE, STORE, WRITE2, STORE2, LIST], fresh: 0, note: "change a byte, rename the tree" }
      },
      {
        narr: "One thing this track will not go into: a folder inside your project is just a tree naming another tree, the same shape one level down. What is still missing is bigger - nothing here says who saved this, or when, or what came before it. The next lesson adds the object that does.",
        objects: { lens: "chain", acts: [WRITE, STORE, WRITE2, STORE2, LIST], fresh: 0, note: "names and bytes, but no story yet" }
      }
    ]
  };
})();
