// Visual for git-when-changes-collide - a DATA-ONLY file, `repo` panel.
//
// The lesson kills one wrong reading: that `CONFLICT` means the merge broke.
// The argument is made by what the graph does NOT do - the merge step adds no
// commit at all, and the next step adds one only after a decision. Prose alone
// cannot show "nothing happened"; a still frame can.
//
// SETUP NOTE. In this teaching model a path leaves the folder once it is
// committed, so the same file cannot simply be committed twice. To get one file
// changed on BOTH sides of a split, the fork is built as: commit `cat.txt`, park
// that commit under the name `fix`, step `main` back with `git reset --mixed`
// (which puts `cat.txt` back in the folder), then commit it again on `main`. The
// commands are replayed, never shown, so the learner only ever sees the result:
// two branches whose newest commits both touched `cat.txt`.
//
// States are replayed through the git runtime the practical lessons type into,
// so this picture and the next lesson's exercise cannot drift apart.
(function () {
  "use strict";

  var FILES = ["dog.txt", "cat.txt"];

  var BASE = ['git add dog.txt', 'git commit -m "add dog"'];

  var FORK = BASE.concat([
    'git add cat.txt', 'git commit -m "cat sleeps in the sun"',
    'git branch fix',
    'git reset --mixed HEAD~1',
    'git add cat.txt', 'git commit -m "cat is hungry"',
  ]);

  var STOPPED = FORK.concat(['git merge fix']);
  var JOINED = STOPPED.concat(['git add cat.txt', 'git commit -m "merge fix"']);

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
        narr: "One commit, `add dog`, and one name on it. Everything that follows grows out of this single point. Nothing here can collide yet - there is only one version of anything.",
        repo: { files: FILES, commands: BASE, note: "One shared starting point." },
      },
      {
        narr: "Two lines now. On `fix` somebody saved `cat sleeps in the sun`, and back on `main` you saved `cat is hungry`. Read what each commit touched: **both of them changed `cat.txt`**.",
        repo: { files: FILES, commands: FORK, note: "Both sides changed `cat.txt`." },
      },
      {
        narr: "That last part is the whole difference. Two commits touching different files can both be kept - git just takes one of each. Two commits touching the same file leave a question git has no way to answer: which version of `cat.txt` should the joined line have?",
        repo: { files: FILES, commands: FORK, note: "Two versions of one file, and no rule to pick between them." },
      },
      {
        narr: "So run `git merge fix` and watch the graph carefully: **nothing was added**. No commit, no name moved. Git compared the two sides, found `cat.txt` on both, and stopped right there. That stop is a conflict - git refusing to guess, not git failing.",
        repo: { files: FILES, commands: STOPPED, note: "Git stopped. No commit was saved." },
      },
      {
        narr: "The merge is only paused, and it is waiting on you. You say what `cat.txt` should end up as, tell git that file is settled, and commit. Now the merge commit appears, pointing back at both lines - the same shape a merge always ends in.",
        repo: { files: FILES, commands: JOINED, note: "You decided; git saved the result." },
      },
      {
        narr: "So nothing was ever damaged. Git did every part it could work out alone, stopped at the one question it could not, and waited. A conflict is that question - and until you answer it, no commit is made.",
        repo: { files: FILES, commands: JOINED, note: "A conflict is a question, not a failure." },
      },
    ],
    xpKey: "course_global_xp",
    awardedKey: "git_when_changes_collide_awarded",
  };
})();
