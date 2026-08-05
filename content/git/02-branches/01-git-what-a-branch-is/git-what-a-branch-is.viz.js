// Visual for git-what-a-branch-is - a DATA-ONLY file, `repo` panel.
//
// The lesson answers one question the practical track cannot: if a branch is
// only a name, what happens to the files in my folder when I switch? Learners
// accept "a branch is a pointer" and still expect their work to be somewhere
// else afterwards, because until you see a file change under you, "a name"
// sounds like it cannot possibly move anything.
//
// It can be shown now because `git switch` rebuilds the working folder from the
// commit it lands on. `roster.txt` is committed with three names on `feature`
// and two on `main`, and the last two steps flip between them: the same path,
// in the same folder, reading different text - with no copy anywhere.
//
// One file on purpose, so the panel opens on it with no click, and its contents
// are just pet names: `bind-viz` does not localize `files` or `commands`, so
// English prose inside a file would stay English after a language switch.
//
// States are replayed through the git runtime the practical lessons type into,
// so this picture and the board in `git-make-a-branch` cannot drift apart.
(function () {
  "use strict";

  var FILES = [{ path: "roster.txt", text: "Mia\nRex" }];

  var SAVED = ['git add roster.txt', 'git commit -m "the walk roster"'];
  var BRANCHED = SAVED.concat(['git branch feature']);
  var SWITCHED = BRANCHED.concat(['git switch feature']);
  var COMMITTED = SWITCHED.concat([
    'echo -e "Mia\\nRex\\nPip" > roster.txt',
    'git add roster.txt',
    'git commit -m "Pip joins the walk"',
  ]);
  var ON_MAIN = COMMITTED.concat(['git switch main']);
  var ON_FEATURE = ON_MAIN.concat(['git switch feature']);

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
        narr: "One commit, and one name on it: `main`. The name marks a single commit and stores nothing else - no files, no folder of its own. The panel below shows what the commit saved: `roster.txt`, holding the two pets you walk.",
        repo: {
          files: FILES,
          commands: SAVED,
          ran: 2,
          note: "`main` is a name on one commit.",
        },
      },
      {
        narr: "`git branch feature` makes a second name. Nothing was copied. There is no second set of commits and no second folder - two labels now sit on the same dot, and `roster.txt` in your folder is untouched.",
        repo: {
          files: FILES,
          commands: BRANCHED,
          ran: 1,
          note: "Two names, one commit. Nothing was duplicated.",
        },
      },
      {
        narr: "Both names point at the same commit, so which one does your next commit belong to? `HEAD` answers that - it marks where you are. `git switch feature` moves `HEAD` onto the other name. `roster.txt` still reads two lines, because the commit under you did not change.",
        repo: {
          files: FILES,
          commands: SWITCHED,
          ran: 1,
          note: "`HEAD` moved onto `feature`. Same commit, same file.",
        },
      },
      {
        narr: "Add Pip and commit. The new snapshot is built on the commit you were standing on, and `feature` moves forward to it. `main` stays where it was. Read the panel: three names here on `feature`.",
        repo: {
          files: FILES,
          commands: COMMITTED,
          ran: 3,
          note: "The name you are on moves forward. The other stays.",
        },
      },
      {
        narr: "Now switch back to `main` and read `roster.txt`: two lines. Pip is gone from your folder. Nothing was deleted. `main` points at a commit that never had him, and switching rewrites the folder from whatever commit the name points at. That is what a branch does to your files.",
        repo: {
          files: FILES,
          commands: ON_MAIN,
          ran: 1,
          note: "`main`'s snapshot has two names in it. Pip is not one of them.",
        },
      },
      {
        narr: "Switch again and Pip comes back - three lines, read straight out of `feature`'s commit. Nothing was copied in either direction. The file in your folder is whatever the commit under `HEAD` holds, and the branch name is how you choose that commit.",
        repo: {
          files: FILES,
          commands: ON_FEATURE,
          ran: 1,
          note: "Back on `feature`. Three names again.",
        },
      },
    ],
    xpKey: "course_global_xp",
    awardedKey: "git_what_a_branch_is_awarded",
  };
})();
