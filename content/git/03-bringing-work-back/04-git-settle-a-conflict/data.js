// Git · Part three - "Settle a conflict". The two ways out of a stopped merge,
// on one repository: card 1 finishes it, card 2 calls it off. Card 2 opens with
// the merge already stopped, so `--abort` is the first thing the learner types
// rather than something buried behind a re-run.
//
// SETUP NOTE. In this teaching model a path leaves the folder once it is
// committed, so the same file cannot simply be committed twice. To get `cat.txt`
// changed on BOTH sides of a split, COLLIDE commits it, parks that commit under
// the name `fix`, steps `main` back with `git reset --mixed` (which returns
// `cat.txt` to the folder), and commits it again on `main`. Replayed, never
// shown: the learner just finds two branches whose newest commits both touched
// `cat.txt`.
//
// Grading is state-based. Aborting leaves no trace of its own - that is the
// point of it - so card 2 pairs it with a tag, which is the checkable part.
// Data only: the git plugin reads window.LESSON_CONFIG. The prose here is
// mirrored in res/strings/default/en.json, which the resource layer binds back on.
(function () {
  "use strict";

  const CAT_BASE = "Mia, tabby, 4 years old.\nSleeps somewhere warm.\nFed at seven.";
  const CAT_MAIN = "Mia, tabby, 4 years old.\nSleeps in the sun.\nFed at seven.";
  const CAT_FIX = "Mia, tabby, 4 years old.\nSleeps on the keyboard.\nFed at seven.";

  // Both branches rewrite the SAME line of cat.txt, which is what a conflict
  // actually is - git compares the text, not the filename. The learner never
  // sees this replay; they arrive to find two branches that disagree.
  const COLLIDE = [
    "git add dog.txt",
    "git commit -m \"add dog\"",
    "git add cat.txt",
    "git commit -m \"add cat\"",
    "git branch fix",
    "echo -e \"" + CAT_MAIN + "\" > cat.txt",
    "git add cat.txt",
    "git commit -m \"cat sleeps in the sun\"",
    "git checkout fix",
    "echo -e \"" + CAT_FIX + "\" > cat.txt",
    "git add cat.txt",
    "git commit -m \"cat sleeps on the keyboard\"",
    "git checkout main"
  ];

  const STOPPED = COLLIDE.concat(["git merge fix"]);

  const tasks = [
    {
      title: "Finish the stopped merge",
      concept: "git add (mark it settled)",
      context:
        "Both branches rewrote the same line of `cat.txt`, so `git merge fix` stops and saves nothing. Git will not choose between them for you.\n\nIt writes both versions into the file, wrapped in markers, with the original line between them so you can see what it was. Your job is to leave the text you want and delete the rest. Then `git add cat.txt` says that file is settled, and `git commit` writes the merge commit that was waiting on you.",
      goal: [
        "Standing on `main`, run `git merge fix` and read what it prints.",
        "Read `cat.txt` in the panel, then keep the line you want and drop the markers: `echo -e \"Mia, tabby, 4 years old.\\nSleeps on the keyboard.\\nFed at seven.\" > cat.txt`.",
        "Say it is settled with `git add cat.txt`.",
        "Finish with `git commit -m \"merge fix\"` - it lands with two parents."
      ],
      goals: [
        { code: ["git merge fix", { row: "still on main", head: "main" }, { row: "cat.txt needs settling", worktree: ["cat.txt"] }],
          gate: { ran: "git merge fix" } },
        { code: ["rewrite cat.txt", "markers gone"], gate: { ran: "echo" } },
        { code: ["git add cat.txt"], gate: { ran: "git add cat.txt" } },
        { code: ["commit `merge fix`", "two parents"], gate: { commit: "merge fix", parents: 2 } }
      ],
      files: [
        { path: "dog.txt", text: "Rex, collie, 2 years old." },
        { path: "cat.txt", text: CAT_BASE }
      ],
      start: COLLIDE,
      target: COLLIDE.concat([
        "git merge fix",
        "echo -e \"" + CAT_FIX + "\" > cat.txt",
        "git add cat.txt",
        "git commit -m \"merge fix\""
      ]),
      solution: [
        "git merge fix",
        "echo -e \"" + CAT_FIX + "\" > cat.txt",
        "git add cat.txt",
        "git commit -m \"merge fix\""
      ]
    },
    {
      title: "Call one off instead",
      concept: "git merge --abort",
      context:
        "Same two branches, and this time the merge is already stopped - `git status` will show `cat.txt` unmerged.\n\nYou do not have to finish it. `git merge --abort` puts everything back to how it was before you started. Then pin a name on the commit you are left standing on, so this spot is easy to find again.",
      goal: [
        "Check where you are with `git status`.",
        "Call the merge off with `git merge --abort`.",
        "Pin the commit you are on with `git tag before-merge`."
      ],
      goals: [
        { code: ["git status", { row: "cat.txt is unmerged", worktree: ["cat.txt"] }], gate: { ran: "git status" } },
        { code: ["git merge --abort"], gate: { ran: "git merge --abort" } },
        { code: ["tag before-merge", { row: "points at HEAD", tag: "before-merge", at: "HEAD" }],
          gate: { tag: "before-merge" } }
      ],
      files: [
        { path: "dog.txt", text: "Rex, collie, 2 years old." },
        { path: "cat.txt", text: CAT_BASE }
      ],
      start: STOPPED,
      target: COLLIDE.concat(["git tag before-merge"]),
      solution: [
        "git status",
        "git merge --abort",
        "git tag before-merge"
      ]
    },
    {
      summary: true,
      title: "Settle a conflict - recap",
      concept: "Recap",
      context: "A stopped merge is a question. You answer it, or you withdraw it.",
      summaryIntro:
        "Git stops on the one thing it cannot work out alone, and until you say something it saves nothing at all. That is why a conflict is safe to sit with - the old commits are all still there while you think.",
      summaryItems: [
        {
          title: "Conflict - ",
          text: "git stopping because both branches changed the same file, with no commit made yet."
        },
        {
          title: "`git add cat.txt` - ",
          text: "mid-merge this stages nothing; it says that file is settled and git can move on."
        },
        {
          title: "`git commit -m \"merge fix\"` - ",
          text: "finishes the paused merge, saving the commit with two parents."
        },
        {
          title: "`git merge --abort` - ",
          text: "calls the whole merge off and leaves you exactly where you started it."
        }
      ],
      summaryClose: "Next: fixing the commit you just made, instead of piling an `oops` on top of it."
    }
  ];

  window.LESSON_CONFIG = {
    prefix: "gsc",
    metaLabel: "Bringing work back · Settle a conflict",
    progressNoun: "Exercise",
    tasks,
    xpKey: "course_global_xp",
    awardedKey: "git_settle_a_conflict_awarded",
    awardAmount: 20,
  };
})();
