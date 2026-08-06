// Visual for git-inside-hidden-folder - a DATA-ONLY file. It drives
// CodeLab.MemoryViz through the `objects` panel's `folder` lens: the .git folder
// as it sits on disk, beside the learner's own files.
//
// Every step replays from an empty repository, so each one stands on its own.
// No step stores anything - the whole lesson lives BEFORE the first save, which
// is why `objects/` reads empty in all six pictures. That is the point: the
// learner watches themselves type a whole file and watches nothing cross into
// git's side of the folder.
//
// The acts are never translated. An object's name is computed from its bytes, so
// a Spanish `notes.md` would carry different forty characters from the English
// one - see resource/bind-viz.js for the same rule stated at the binder.
(function () {
  "use strict";

  var NOTES = { act: "write", path: "notes.md", text: "hello world\n" };
  var TODO = { act: "write", path: "todo.md", text: "feed the cat\n" };

  window.LESSON_CONFIG = {
    code: [],
    legend: [
      { sw: "#1d2130", label: "the .git folder, as it sits on disk" },
      { sw: "#8b98a5", label: "greyed out - nothing kept here yet" },
      { sw: "#55c86a", label: "new since the step before" }
    ],
    layout: {
      visual: [{ type: "objects" }],
      aside: [{ type: "narration" }, { type: "controls" }]
    },
    steps: [
      {
        narr: "Ask git to start looking after a folder and it makes <strong>one new folder</strong> beside your work, called `.git`. What you see here is all of it. Nothing is running, and nothing of yours has moved.",
        objects: { lens: "folder", acts: [], fresh: 0, note: "the whole repository" }
      },
      {
        narr: "Start with `objects/`. <strong>Everything git ever keeps</strong> ends up in there, one file per thing. Right now it is empty, and it stays empty for the rest of this lesson.",
        objects: { lens: "folder", acts: [], fresh: 0, note: "objects/ - empty" }
      },
      {
        narr: "Now write a file. `notes.md` appears at the bottom, under your own folder - that half is yours, not git's. Look at `objects/` again: still empty. Writing a file does not hand it to git.",
        objects: { lens: "folder", acts: [NOTES], fresh: 1, note: "your file. objects/ unchanged" }
      },
      {
        narr: "A second file changes nothing either. Git is not watching you type, and nothing crosses into `objects/` on its own. You will have to ask, and asking is the next lesson.",
        objects: { lens: "folder", acts: [NOTES, TODO], fresh: 1, note: "two files of yours, none of git's" }
      },
      {
        narr: "The other two lines are just as empty. `refs/heads/` is where <strong>names</strong> live, and you have none yet. `HEAD` is the one file already written, and it holds the name `refs/heads/main` - a name that does not exist yet. That is where your first save will land.",
        objects: { lens: "folder", acts: [NOTES, TODO], fresh: 0, note: "no names yet. HEAD already written" }
      },
      {
        narr: "That is a repository: a folder for things, a folder for names, and one file saying which name you are on. All three are nearly empty because nothing has been saved. The moment something is, a file appears in `objects/` under a name you did not choose - and where that name comes from is the strangest and best idea in git.",
        objects: { lens: "folder", acts: [NOTES, TODO], fresh: 0, note: "a repository before its first save" }
      }
    ]
  };
})();
