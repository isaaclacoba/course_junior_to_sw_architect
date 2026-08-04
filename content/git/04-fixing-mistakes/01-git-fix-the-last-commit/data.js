// Git · Part four - "Fix the last commit". Two cards, one command: the first
// amends only the message, the second stages a forgotten file first so the
// replacement commit carries it too.
//
// Card two deliberately changes the message as well as the file list. Grading
// identifies a commit by message plus parent shape (kernel/grading/dag-match.js),
// so an amend that keeps the SAME message produces a replacement indistinguishable
// from the commit it replaced - and the pre-amend commit, still in the object
// store, is the one the end-state grader compares against. Measured: that card
// can never pass. A new message keeps the two apart.
// Data only: the git plugin reads window.LESSON_CONFIG. The prose here is
// mirrored in res/strings/default/en.json, which the resource layer binds back on.
(function () {
  "use strict";

  const tasks = [
    {
      title: "Fix a message you got wrong",
      concept: "git commit --amend",
      context:
        "The last commit says `add dgo`. Nothing is broken, but the history now carries a typo.\n\n`git commit --amend` replaces that commit with a corrected one and moves `main` onto it. The old commit is left behind with nothing pointing at it, so the history stays two commits long.",
      goal: [
        "Fix the message with `git commit --amend -m \"add dog\"`.",
        "Do not add a commit - the history should stay two long.",
        "Check with `git log --oneline`; the typo should be gone."
      ],
      files: ["cat.txt", "dog.txt"],
      start: [
        "git add cat.txt",
        "git commit -m \"add cat\"",
        "git add dog.txt",
        "git commit -m \"add dgo\""
      ],
      target: [
        "git add cat.txt",
        "git commit -m \"add cat\"",
        "git add dog.txt",
        "git commit -m \"add dog\""
      ],
      solution: [
        "git commit --amend -m \"add dog\"",
        "git log --oneline"
      ]
    },
    {
      title: "Fold in the file you left out",
      concept: "git add + --amend",
      context:
        "`bowl.txt` belongs with the feeder, but it is still sitting in the working tree - the last commit went in without it.\n\nAmend does not only rewrite the message. It rebuilds the commit from what is staged now, so stage `bowl.txt` first and the replacement carries both files.",
      goal: [
        "Stage `bowl.txt` with `git add bowl.txt`.",
        "Replace the last commit: `git commit --amend -m \"add the feeder and bowl\"`.",
        "Still two commits when you are done, and nothing left in the working tree."
      ],
      files: ["cat.txt", "feeder.txt", "bowl.txt"],
      start: [
        "git add cat.txt",
        "git commit -m \"add cat\"",
        "git add feeder.txt",
        "git commit -m \"add the feeder\""
      ],
      target: [
        "git add cat.txt",
        "git commit -m \"add cat\"",
        "git add feeder.txt",
        "git add bowl.txt",
        "git commit -m \"add the feeder and bowl\""
      ],
      solution: [
        "git add bowl.txt",
        "git commit --amend -m \"add the feeder and bowl\""
      ]
    },
    {
      summary: true,
      title: "Fix the last commit - recap",
      concept: "Recap",
      context: "One command, and the last commit is a different commit.",
      summaryIntro:
        "Amending does not edit a commit. It makes a corrected one and moves your branch onto it, leaving the old one behind with nothing pointing at it. That is fine while the commit is still only yours.",
      summaryItems: [
        {
          title: "Amending - ",
          text: "replacing the commit you just made with a corrected one, so the mistake never becomes part of the history."
        },
        {
          title: "`git commit --amend -m \"...\"` - ",
          text: "gives the last commit a new message and keeps its parent, so the history does not grow."
        },
        {
          title: "What is staged goes in - ",
          text: "the replacement is rebuilt from the staging area, so a file you `git add` now joins the commit you already made."
        },
        {
          title: "The last one only - ",
          text: "amend reaches the commit `HEAD` is on, and no further back."
        }
      ],
      summaryClose: "Next: naming a commit without its hash, so you can point further back than the last one."
    }
  ];

  window.LESSON_CONFIG = {
    prefix: "gfl",
    metaLabel: "Fixing mistakes · Fix the last commit",
    progressNoun: "Exercise",
    tasks,
    xpKey: "course_global_xp",
    awardedKey: "git_fix_the_last_commit_awarded",
    awardAmount: 20,
  };
})();
