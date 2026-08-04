// Visual for git-what-reset-moves - a DATA-ONLY file, `repo` panel.
//
// The argument is a controlled comparison: steps 1-3 replay the SAME three
// commits and the SAME step back, changing one word. The branch name lands on
// the same commit every time, so the only thing the learner can see moving is
// where the undone commit's files come to rest - staging, the working tree, or
// nowhere. Prose could assert that; three pictures from one engine show it.
//
// States are replayed through the git runtime the practical lessons use, so this
// picture and the one the learner types into in the next lesson come from one
// engine and cannot drift apart.
(function () {
  "use strict";

  var FILES = ["cat.txt", "dog.txt", "draft.txt"];

  var THREE = [
    'git add cat.txt', 'git commit -m "add cat"',
    'git add dog.txt', 'git commit -m "add dog"',
    'git add draft.txt', 'git commit -m "oops"',
  ];
  var SOFT = THREE.concat(['git reset --soft HEAD~1']);
  var MIXED = THREE.concat(['git reset --mixed HEAD~1']);
  var HARD = THREE.concat(['git reset --hard HEAD~1']);
  var REDONE = SOFT.concat(['git commit -m "add draft"']);

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
        narr: "Three commits, and `main` on the newest. That last one is the mistake: it saved `draft.txt` before the file was ready, under the message `oops`. Staging and the working tree are empty, because everything is committed.",
        repo: { files: FILES, commands: THREE, note: "`main` sits on the commit you wish you had not made." },
      },
      {
        narr: "`git reset --soft HEAD~1` moves `main` back one commit, so `oops` is off the line. Now look at staging: `draft.txt` is sitting there, still picked for the next commit. **The snapshot went; the work did not.**",
        repo: { files: FILES, commands: SOFT, note: "`--soft` - the name moved back, the file stayed staged." },
      },
      {
        narr: "Run it again with `--mixed` and `main` lands on **exactly the same commit**. One zone is different: `draft.txt` is back in the folder, picked for nothing. You get to choose again what goes into the next commit.",
        repo: { files: FILES, commands: MIXED, note: "`--mixed` - same move, the file waits in the working tree." },
      },
      {
        narr: "`--hard` makes the same move once more, and this time it puts `draft.txt` nowhere. Staging empty, folder empty - what that commit was holding is gone. This is the one to read twice before you run it.",
        repo: { files: FILES, commands: HARD, note: "`--hard` - same move, the file is thrown away." },
      },
      {
        narr: "So the branch step is identical in all three, and what you are really choosing is where the files land. That is what makes `--soft` handy: your work is still staged, so one more `git commit` puts it back under the message you meant.",
        repo: { files: FILES, commands: REDONE, note: "Reset moves a name. The mode decides where your files go." },
      },
    ],
    xpKey: "course_global_xp",
    awardedKey: "git_what_reset_moves_awarded",
  };
})();
