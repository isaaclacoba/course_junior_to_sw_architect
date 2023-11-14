// Visual for git-inside-hidden-folder - a DATA-ONLY file, driving the `objects`
// panel's `folder` lens: the .git folder as it sits on disk.
//
// Step 1 uses `detail: "full"` so the listing is everything `git init` really
// creates, checked against real git 2.34. A learner who opens a real .git after
// this lesson should find nothing that was hidden from them. Every later step
// drops back to the three parts the track is actually about.
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
        narr: "`git init` is the command that turns an ordinary folder into a repository, and this is everything it makes: **one hidden folder** called `.git`, beside your work. Nothing is running. None of your files moved.",
        objects: { lens: "folder", acts: [], fresh: 0, detail: "full", note: "everything git init creates" }
      },
      {
        narr: "Most of it you can ignore today. `config` holds settings for this one repository, `description` is used by one old web viewer, and `hooks/` is a dozen sample scripts, all switched off. **Three things** carry the whole idea: `objects/`, `refs/heads/` and `HEAD`.",
        objects: { lens: "folder", acts: [], fresh: 0, detail: "full", note: "settings, samples, and the three that matter" }
      },
      {
        narr: "Start with the one that is not empty. `HEAD` is a text file with **a single line in it**, and the line is right there: `ref: refs/heads/main`. It does not hold your work. It holds the name of a name - and that name does not exist yet.",
        objects: { lens: "folder", acts: [], fresh: 0, note: "HEAD - one line of text" }
      },
      {
        narr: "That name would live in `refs/heads/`, one small file per branch. Yours is empty, so `main` is a branch git is expecting rather than one you have. It appears the moment you first save something.",
        objects: { lens: "folder", acts: [], fresh: 0, note: "refs/heads/ - no names yet" }
      },
      {
        narr: "And `objects/` is where **everything git keeps** goes, one file per thing. Write a file of your own and it shows up under your folder - not in `objects/`. Write a second one, same story. Git is not watching you type: `git add` is the command that carries a file across, and until you run it, `objects/` stays empty.",
        objects: { lens: "folder", acts: [NOTES, TODO], fresh: 2, note: "two files of yours, none of git's" }
      },
      {
        narr: "So a repository is three parts: a place for things, a place for names, and one line saying which name you are on. Two are empty and one is expecting. The next lesson fills `objects/` - and the name that file gets is chosen by nobody.",
        objects: { lens: "folder", acts: [NOTES, TODO], fresh: 0, note: "a repository, before its first save" }
      }
    ]
  };
})();
