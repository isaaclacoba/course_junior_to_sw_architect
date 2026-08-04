// Visual for git-what-a-branch-is - a DATA-ONLY file, `repo` panel.
//
// The lesson kills one wrong picture: that a branch is a copy of the project.
// Every step is the SAME repository with the same commits - only the labels
// move. That is the argument, made visually rather than asserted in prose.
//
// States are replayed through the git runtime the practical lessons use, so this
// picture and the one the learner types into in the next lesson come from one
// engine and cannot drift apart.
(function () {
  "use strict";

  var FILES = ["cat.txt", "dog.txt", "bird.txt"];

  var TWO = [
    'git add cat.txt', 'git commit -m "add cat"',
    'git add dog.txt', 'git commit -m "add dog"',
  ];
  var BRANCHED = TWO.concat(['git branch feature']);
  var SWITCHED = BRANCHED.concat(['git switch feature']);
  var COMMITTED = SWITCHED.concat(['git add bird.txt', 'git commit -m "add bird"']);
  var BACK = COMMITTED.concat(['git switch main']);

  window.LESSON_CONFIG = {
    legend: [
      { sw: "#2563eb", label: "a commit - one saved snapshot", round: true },
      { sw: "#6366f1", label: "a branch name" },
      { sw: "#111827", label: "HEAD - where you are" },
    ],
    layout: {
      visual: [{ type: "repo" }],
      aside: [{ type: "narration" }, { type: "controls" }],
    },
    steps: [
      {
        narr: "Two commits, and one name: `main`. Notice where the name sits - on the newest commit, not on the whole line. A branch name marks one commit, and that is all it stores.",
        repo: { files: FILES, commands: TWO, note: "`main` points at the newest commit." },
      },
      {
        narr: "Now make a second name: `git branch feature`. Look carefully - **nothing was copied**. There is no second set of commits, no second folder. There is one more label, sitting on the same commit `main` is on.",
        repo: { files: FILES, commands: BRANCHED, note: "Two names, one commit. Nothing was duplicated." },
      },
      {
        narr: "So if both names point at the same commit, which one does your next commit belong to? That is what `HEAD` answers. `HEAD` is the marker for **where you are**, and right now it says `main`.",
        repo: { files: FILES, commands: BRANCHED, note: "`HEAD` decides which name moves next." },
      },
      {
        narr: "`git switch feature` moves `HEAD` onto the other name. Still nothing copied - the commits have not changed at all. You have only said which name you are standing on.",
        repo: { files: FILES, commands: SWITCHED, note: "`HEAD` moved. The commits did not." },
      },
      {
        narr: "Now commit. The new snapshot is built on the one you were standing on, and **`feature` moves forward to it**. `main` stays exactly where it was - it was not the branch you were on.",
        repo: { files: FILES, commands: COMMITTED, note: "The name you are on moves. The other does not." },
      },
      {
        narr: "Switch back to `main` and the history is still whole - both lines are there, sharing everything up to the split. That is the whole idea: a branch is a name that moves forward as you commit, and `HEAD` says which name that is.",
        repo: { files: FILES, commands: BACK, note: "Two lines, one shared history." },
      },
    ],
    xpKey: "course_global_xp",
    awardedKey: "git_what_a_branch_is_awarded",
  };
})();
