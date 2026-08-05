// Visual for git-the-three-areas - a DATA-ONLY file, `repo` panel.
//
// The lesson answers one question: why is there a middle step between editing a
// file and saving it? Prose can assert that staging holds a copy of what you
// picked; it cannot make a learner believe it. The file panel can, because the
// model carries file CONTENTS: the same `notes.md` ends up holding three
// different texts at the same moment - one in the folder, one in staging, one in
// the last commit - and the commit that follows saves the staged one.
//
// The three versions are built by `echo`, the one command that changes what is
// INSIDE a file. Each version adds a line, so the panel's diff is a single `+`
// row and the learner can read the difference without hunting for it.
//
// States are replayed through the git runtime the practical lessons type into,
// so this picture and the board in `git-first-commit` cannot drift apart.
(function () {
  "use strict";

  var FILES = [{ path: "notes.md", text: "07:00 Mia" }];

  var STAGED = ['git add notes.md'];
  var SAVED = STAGED.concat(['git commit -m "start the feeding notes"']);
  var EDITED = SAVED.concat(['echo -e "07:00 Mia\\n08:00 Rex" > notes.md']);
  var RESTAGED = EDITED.concat(['git add notes.md']);
  var EDITED_AGAIN = RESTAGED.concat(['echo -e "07:00 Mia\\n08:00 Rex\\n09:00 Pip" > notes.md']);
  var COMMITTED = EDITED_AGAIN.concat(['git commit -m "add the dog"']);

  window.LESSON_CONFIG = {
    legend: [
      { sw: "#f59e0b", label: "working tree - the file as it is right now" },
      { sw: "#22c55e", label: "staging - the copy you picked for the next commit" },
      { sw: "#94a3b8", label: "repository - the snapshots already saved" },
    ],
    layout: {
      visual: [{ type: "repo" }],
      aside: [{ type: "narration" }, { type: "controls" }],
    },
    steps: [
      {
        narr: "One file in a folder that git is watching. The board has three columns because git holds your work in three places. Right now `notes.md` sits in the first one - the working tree, your files exactly as they are this second.",
        repo: { files: FILES, commands: [], note: "Nothing is saved yet. The file is only in the folder." },
      },
      {
        narr: "`git add notes.md` puts a copy of the file into staging. That copy is what your next commit will save, and it waits there until you make one.",
        repo: { files: FILES, commands: STAGED, note: "Staging holds the copy you picked." },
      },
      {
        narr: "`git commit` writes what staging held into the repository, where saved snapshots stay. Two commands to save one file. Why not one?",
        repo: { files: FILES, commands: SAVED, note: "Saved. The repository holds the first version." },
      },
      {
        narr: "Now edit the file - the dog gets a feeding time. In the panel under the board, switch between `Working tree` and `Last commit`: two lines in the folder, one in the commit you just made.",
        repo: { files: FILES, commands: EDITED, note: "Two copies of one file, and they do not match." },
      },
      {
        narr: "`git add` again, and staging takes the two-line version. The commit still holds the one-line version, and it will hold it until you make another. A dot on a button in the panel marks a copy that differs from the one behind it.",
        repo: { files: FILES, commands: RESTAGED, note: "Staging: two lines. Last commit: one." },
      },
      {
        narr: "Now edit again, and this time do not stage it. Click through the three buttons and count the lines: three in the folder, two in staging, one in the commit. The same file, three different versions, at the same moment.",
        repo: { files: FILES, commands: EDITED_AGAIN, note: "One file. Three versions at once." },
      },
      {
        narr: "`git commit` saves what staging held - the last commit in the panel now shows two lines, while the folder still has three. The bird line was never added, so it was never saved. `git add` is where you choose, and git keeps that choice while you carry on editing.",
        repo: { files: FILES, commands: COMMITTED, note: "The commit holds the staged version. The bird is still waiting." },
      },
    ],
    xpKey: "course_global_xp",
    awardedKey: "git_the_three_areas_awarded",
  };
})();
