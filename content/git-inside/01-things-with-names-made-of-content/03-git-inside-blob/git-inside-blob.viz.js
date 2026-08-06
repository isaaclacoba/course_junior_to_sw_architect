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
        narr: "Now read what is **not** there. No `notes.md`. No date, no author, no folder, no permissions. Everything you would call information *about* the file is missing. Only the file's own bytes survived.",
        objects: { lens: "chain", acts: [WRITE, STORE], fresh: 0, open: "blob", note: "the content, and nothing about it" }
      },
      {
        narr: "But hash those bytes yourself and you get the wrong answer. `printf 'hello world\\n' | sha1sum` prints **22596363b3de40b06f981fb85d82312e8c0ed511**, and the blob is called `3b18e51`. Something else went into the hash.",
        objects: { lens: "chain", acts: [WRITE, STORE], fresh: 0, open: "blob", note: "hashing this text does NOT give 3b18e51" }
      },
      {
        narr: "This is what git really hashed. It puts a **header** in front of your content first: the word `blob`, a space, the size in bytes, then a zero byte. `printf 'blob 12\\0hello world\\n' | sha1sum` prints `3b18e51` exactly. The header is part of the object - it is just never shown to you.",
        objects: { lens: "chain", acts: [WRITE, STORE], fresh: 0, open: "blob", openRaw: true, note: "blob + size + a zero byte + your content" }
      },
      {
        narr: "The header earns its two parts. `12` is the byte count, so a reader knows where the content ends without scanning for a terminator. The word `blob` means a blob and a commit that happened to hold identical text still get different names - the type is hashed, so the kinds can never collide.",
        objects: { lens: "chain", acts: [WRITE, STORE], fresh: 0, open: "blob", openRaw: true, note: "a 3-byte file would read `blob 3\\0`" }
      },
      {
        narr: "Now change the file and store it again. Git does not write down what changed - it writes a **second, complete blob**. Try it on a 100KB file: append one character and `.git/objects` gains a second object of 104,736 bytes. Git keeps whole versions, never differences.",
        objects: { lens: "chain", acts: [WRITE, STORE, EDIT, STORE], fresh: 1, note: "one edit, two entire copies" }
      },
      {
        narr: "The opposite case is just as strict. Make two more files with that same first line and store them: **no new object appears**. Same bytes, same header, same name, so there is nothing to write. Change the file permissions on one of them - mark it executable - and still nothing appears. A blob has no permissions to change.",
        objects: { lens: "chain", acts: [WRITE, STORE, COPY1, STORE1, COPY2, STORE2], fresh: 0, note: "three files, and still one blob for that text" }
      },
      {
        narr: "So a blob answers only one question: what were the bytes? Which file they belonged to, and whether it was executable, are facts git records - `git checkout` restores both - but it records them somewhere else. The next lesson opens that somewhere.",
        objects: { lens: "both", acts: [WRITE, STORE, COPY1, STORE1, COPY2, STORE2], fresh: 0, note: "the file name and the mode live outside the blob" }
      }
    ]
  };
})();
