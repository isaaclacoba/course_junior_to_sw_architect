// Visual for git-inside-hidden-folder - a DATA-ONLY file, driving the `objects`
// panel's `folder` lens: the .git folder as it sits on disk.
//
// THEORY VOICE (see the theory-lesson-authoring skill): every sentence describes
// git. The reader runs nothing here.
//
// Step 1 uses `detail: "full"` so the listing is everything `git init` really
// creates, checked against real git 2.34. A learner who opens a real .git after
// this lesson should find nothing that was hidden from them. Step 2 drops to the
// three parts the track is about, so the picture visibly shrinks.
//
// The acts are never translated: an object's name is computed from its bytes, so
// a Spanish `notes.md` would carry different forty characters from the English
// one. Same rule bind-viz.js states at the binder.
(function () {
  "use strict";

  var NOTES = { act: "write", path: "notes.md", text: "hello world\n" };
  var TODO = { act: "write", path: "todo.md", text: "feed the cat\n" };

  window.LESSON_CONFIG = {
    code: [],
    legend: [
      { sw: "#1d2130", label: "the .git folder, as it sits on disk" },
      { sw: "#8b98a5", label: "greyed out - settings, or empty" },
      { sw: "#55c86a", label: "new since the step before" }
    ],
    layout: {
      visual: [{ type: "objects" }],
      aside: [{ type: "narration" }, { type: "controls" }]
    },
    steps: [
      {
        narr: "`git init` turns an ordinary folder into a repository, and this is everything it makes: **one hidden folder** called `.git`, beside the work. Nothing starts running, and no existing file moves.",
        objects: { lens: "folder", acts: [], fresh: 0, detail: "full", note: "everything git init creates" }
      },
      {
        narr: "Most of that can be set aside. `config` holds settings for this one repository, `description` is used by a single old web viewer, and `hooks/` is a dozen sample scripts, all switched off. **Three things** carry the whole idea: `objects/`, `refs/heads/` and `HEAD`.",
        objects: { lens: "folder", acts: [], fresh: 0, note: "the three parts the rest of this track is about" }
      },
      {
        narr: "Only one of the three has anything in it. `HEAD` is a text file holding **a single line** - `ref: refs/heads/main`. It carries no work of its own; it names a file in `refs/heads/`, and that file does not exist yet. A branch, before its first save, is a name git is expecting rather than a thing git has.",
        objects: { lens: "folder", acts: [], fresh: 0, note: "HEAD names a file that is not there yet" }
      },
      {
        narr: "`objects/` is where everything git keeps ends up, one file per thing, and it stays empty while the work does not. New files appear in the folder alongside `.git` and nowhere inside it. Git watches nothing; something has to hand a file over before git holds a copy.",
        objects: { lens: "folder", acts: [NOTES, TODO], fresh: 2, note: "two files here, and nothing yet in objects/" }
      },
      {
        narr: "A repository, then, is three parts: a place for things, a place for names, and one line saying which name is current. At this point two are empty and one is expecting. What fills `objects/` first, and where its name comes from, is the next lesson.",
        objects: { lens: "folder", acts: [NOTES, TODO], fresh: 0, note: "a repository, before its first save" }
      }
    ]
  };
})();
