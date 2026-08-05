// Git · Part four - "Fix the last commit". Two cards, one command, and a read
// in front of each that decides what the learner types.
//
// Card one seeds TWO misspelt messages. Only the one on top can be amended, so
// `git log --oneline` is what tells the learner which correction to make;
// amending the older one is graded off-plan.
//
// Card two seeds two uncommitted files and names neither in the goal, so
// `git status` is what tells the learner which one belongs with the feeder.
// Staging both fails on commit paths (kernel/grading/state-match.js).
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
      title: "Fix the typo you can still reach",
      concept: "git commit --amend",
      context:
        "Two of these commits have a misspelled message. `git commit --amend` replaces the commit you are standing on with a corrected one and moves `main` onto it, so it reaches exactly one of the two.\n\nRun `git log --oneline` before you type anything. It lists the newest commit at the top, and that is the only one amend can touch.",
      goal: [
        "Read `git log --oneline` - two of these messages are misspelled.",
        "Amend the one on top so the animal is spelled properly.",
        "Leave the other typo alone; the history stays two commits long."
      ],
      files: ["cat.txt", "dog.txt"],
      start: [
        "git add cat.txt",
        "git commit -m \"add ct\"",
        "git add dog.txt",
        "git commit -m \"add dgo\""
      ],
      target: [
        "git add cat.txt",
        "git commit -m \"add ct\"",
        "git add dog.txt",
        "git commit -m \"add dog\""
      ],
      solution: [
        "git log --oneline",
        "git commit --amend -m \"add dog\"",
        "git log --oneline"
      ]
    },
    {
      title: "Fold in the file that belongs",
      concept: "git add + --amend",
      context:
        "The last commit saved the feeder on its own. Amend rebuilds the commit from whatever is staged right now, so a file you stage first joins the commit you already made.\n\nMore than one file never made it in, and only one of them belongs with the feeder. Run `git status` to see what is waiting.",
      goal: [
        "Run `git status` to see what did not make it into the last commit.",
        "Stage only the file that belongs with the feeder.",
        "Amend the commit with the message `set up the feeder`, and leave the other file untracked."
      ],
      files: ["cat.txt", "feeder.txt", "bowl.txt", "notes.txt"],
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
        "git commit -m \"set up the feeder\""
      ],
      solution: [
        "git status",
        "git add bowl.txt",
        "git commit --amend -m \"set up the feeder\""
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
