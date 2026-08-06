// Visual for git-inside-commit-object - a DATA-ONLY file driving the `objects`
// panel. It is the first lesson to use `open`, because a commit's five lines ARE
// the content: paraphrasing them in narration would describe the thing instead
// of showing it.
//
// Every id quoted in the prose was produced by real git with this exact author,
// email and date, and our store reproduces all three:
//   blob   3b18e512dba79e4c8300dd08aeb37f8e728b8dad   ("hello world\n")
//   tree   55f6b9cfc432d40ed27933041d16dcf4d816a630   (notes.md -> that blob)
//   commit 089528ab9685d519f68fcfc73b52c17237b1990f   (that tree, "save the greeting")
// The acts are never translated - an id is computed from the bytes.
(function () {
  "use strict";

  var WRITE = { act: "write", path: "notes.md", text: "hello world\n" };
  var STORE = { act: "store", path: "notes.md" };
  var LIST = { act: "list" };
  var SAVE = { act: "save", message: "save the greeting" };
  var NAME = { act: "name", ref: "refs/heads/main" };
  var EDIT = { act: "write", path: "notes.md", text: "hello world\ngoodbye\n" };
  var SAVE2 = { act: "save", message: "add a goodbye" };

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
        narr: "Where the last lesson left off: a blob holding your bytes, and a tree saying that those bytes are called `notes.md`. Between them they hold your work. Neither of them holds **anything about you** - no name, no time, no note about why.",
        objects: { lens: "chain", acts: [WRITE, STORE, LIST], fresh: 0, note: "your work, and nothing about you" }
      },
      {
        narr: "`git commit` writes a third object, and it is the smallest of the three. Where a tree hides raw bytes inside itself, a commit is plain text from end to end - the only object a person could read straight off the disk, if git did not compress it there.",
        objects: { lens: "both", acts: [WRITE, STORE, LIST, SAVE], fresh: 1, note: "a third object, and the smallest" }
      },
      {
        narr: "Here it is, opened. **Five lines.** The first names the tree - so the commit does not contain your files, it contains the id of the list that leads to them. The next two lines say who. Then a blank line, then your message.",
        objects: { lens: "chain", acts: [WRITE, STORE, LIST, SAVE], fresh: 0, open: "commit", note: "the whole commit, byte for byte" }
      },
      {
        narr: "Two lines for two people, because they can differ: the **author** wrote the change, the **committer** put it in this repository. On your own work they are the same person and the same second, and that is what you see here.",
        objects: { lens: "chain", acts: [WRITE, STORE, LIST, SAVE], fresh: 0, open: "commit", note: "author wrote it, committer saved it" }
      },
      {
        narr: "That text is the whole object, so the usual rule applies to it too: SHA-1 over those bytes gives **089528ab9685d519f68fcfc73b52c17237b1990f**. The message, the timestamp and every byte of every file underneath all feed into it, which is why one id can stand for an entire project at one moment.",
        objects: { lens: "chain", acts: [WRITE, STORE, LIST, SAVE, NAME], fresh: 1, open: "commit", note: "the commit's own name, from its own bytes" }
      },
      {
        narr: "A second save carries a line the first one could not: **`parent`**, holding the id of the save before it. One line per commit is all it takes to turn a heap of saves into a chain that can be walked backwards.",
        objects: { lens: "chain", acts: [WRITE, STORE, LIST, SAVE, NAME, EDIT, STORE, LIST, SAVE2, NAME], fresh: 4, open: "commit", note: "parent - the line that makes a history" }
      },
      {
        narr: "That is the whole object model: bytes in a blob, names in a tree, and a commit holding a tree, a parent and a note about you. Everything after this is names pointing at these objects - which is the next part, starting with the one you have been seeing all along, `main`.",
        objects: { lens: "both", acts: [WRITE, STORE, LIST, SAVE, NAME, EDIT, STORE, LIST, SAVE2, NAME], fresh: 0, note: "three kinds of object, and that is all" }
      }
    ]
  };
})();
