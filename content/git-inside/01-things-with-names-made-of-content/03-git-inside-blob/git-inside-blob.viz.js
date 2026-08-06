// Visual for git-inside-blob - a DATA-ONLY file driving the `objects` panel.
//
// Every number in this lesson was measured against real git 2.34.1, and the
// learner can re-measure all of them with the commands the prose names:
//   sha1 of the file's own bytes ... 22596363b3de40b06f981fb85d82312e8c0ed511
//   sha1 of "blob 12\0hello world\n" 3b18e512dba79e4c8300dd08aeb37f8e728b8dad  <- the blob id
//   sha1 of "blob 3\0hi\n" .......... 45b983be36b73c0788dc9cbcb76cbb80fc7bb057
//   100KB file + 1 char appended .... two objects, 104738 and 104736 bytes
//   marking a tracked file executable  0 new objects; the index reads 100755
//   two duplicate files added ....... 0 new objects
(function () {
  "use strict";

  var GREETING = "hello world\n";
  var WRITE = { act: "write", path: "notes.md", text: GREETING };
  var STORE = { act: "store", path: "notes.md" };
  var EDIT = { act: "write", path: "notes.md", text: "hello world\ngoodbye\n" };
  var COPY1 = { act: "write", path: "copy1.md", text: GREETING };
  var STORE1 = { act: "store", path: "copy1.md" };
  var COPY2 = { act: "write", path: "copy2.md", text: GREETING };
  var STORE2 = { act: "store", path: "copy2.md" };

  window.LESSON_CONFIG = {
    code: [],
    legend: [
      { sw: "#1f6f5f", label: "an object, and everything inside it" },
      { sw: "#55c86a", label: "stored just now" },
      { sw: "#8b98a5", label: "dashed - nothing points at it yet" }
    ],
    layout: {
      visual: [{ type: "objects" }],
      aside: [{ type: "narration" }, { type: "controls" }]
    },
    steps: [
      {
        narr: "Here is the object from last lesson, opened up. Its name is `3b18e51` and its contents are `hello world` - the exact bytes of your file. Git calls this kind of object a **blob**.",
        objects: { lens: "chain", acts: [WRITE, STORE], fresh: 1, open: "blob", note: "a blob: a name, and the bytes it was made from" }
      },
      {
        narr: "What is absent matters more. No `notes.md`, no date, no author, no folder, no permissions - everything anyone would call information *about* the file. Only the file's own bytes survived.",
        objects: { lens: "chain", acts: [WRITE, STORE], fresh: 0, open: "blob", note: "the content, and nothing about it" }
      },
      {
        narr: "But SHA-1 over exactly those bytes returns the wrong answer. `printf 'hello world\\n' | sha1sum` gives **22596363b3de40b06f981fb85d82312e8c0ed511**, while the blob is called `3b18e51`. Something more went into that hash.",
        objects: { lens: "chain", acts: [WRITE, STORE], fresh: 0, open: "blob", note: "hashing this text does NOT give 3b18e51" }
      },
      {
        narr: "This is what git really hashed. A **header** goes in front of the content first - the word `blob`, a space, the size in bytes, then a zero byte - and `printf 'blob 12\\0hello world\\n' | sha1sum` gives `3b18e51` exactly. Both halves of the header earn their place: the size tells a reader where the content ends, and the type word keeps a blob and a commit holding identical text from ever landing on the same name.",
        objects: { lens: "chain", acts: [WRITE, STORE], fresh: 0, open: "blob", openRaw: true, note: "blob + size + a zero byte + your content" }
      },
      {
        narr: "The header is part of the object and is never displayed, so every id in git is a fingerprint of slightly more than the thing it names. A three-byte file would carry `blob 3\\0` instead.",
        objects: { lens: "chain", acts: [WRITE, STORE], fresh: 0, open: "blob", openRaw: true, note: "a 3-byte file would read `blob 3\\0`" }
      },
      {
        narr: "Storage follows one blunt rule: a changed file becomes a **second, complete blob**, never a record of what changed. On a 100KB file, one extra character leaves `.git/objects` holding a second object of 104,736 bytes. Git keeps whole versions.",
        objects: { lens: "chain", acts: [WRITE, STORE, EDIT, STORE], fresh: 1, note: "one edit, two entire copies" }
      },
      {
        narr: "Sharing is just as blunt in the other direction. Further files holding that same first line add **no object at all** - same bytes, same header, same name, nothing to write. Changing one file's permissions to make it executable adds nothing either, because a blob has no permissions in it to change.",
        objects: { lens: "chain", acts: [WRITE, STORE, COPY1, STORE1, COPY2, STORE2], fresh: 0, note: "three files, and still one blob for that text" }
      },
      {
        narr: "A blob answers one question: what were the bytes? Which file they belonged to, and whether it was executable, are things git does record - `git checkout` restores both - but it records them somewhere else. The next lesson opens that somewhere.",
        objects: { lens: "both", acts: [WRITE, STORE, COPY1, STORE1, COPY2, STORE2], fresh: 0, note: "the file name and the mode live outside the blob" }
      }
    ]
  };
})();
