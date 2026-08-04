// Git · Part two - "Make a branch and work on it". Two cards: the first makes a
// branch and deliberately does NOT move onto it, so the learner sees that naming
// and standing are two different things; the second does both and commits, so the
// graph forks while `main` stays put.
//
// Grading is state-based, so both cards end in a new ref: card 1 in a branch
// name, card 2 in a branch plus a commit only that branch can see.
// Data only: the git plugin reads window.LESSON_CONFIG. The prose here is
// mirrored in res/strings/default/en.json, which the resource layer binds back on.
(function () {
  "use strict";

  const tasks = [
    {
      title: "Name a second line of work",
      concept: "git branch",
      context:
        "A branch is a name pointing at a commit. `git branch feature` makes that name at the commit you are standing on.\n\nIt does not move you. `HEAD` still says `main`, so your next commit would still land on `main`.",
      goal: [
        "Make the branch with `git branch feature`.",
        "Stay on `main` - do not step onto `feature` yet.",
        "Run `git branch` to list both names; the `*` shows where you are."
      ],
      files: [],
      start: [
        "git add cat.txt",
        "git commit -m \"add cat\""
      ],
      target: [
        "git add cat.txt",
        "git commit -m \"add cat\"",
        "git branch feature"
      ],
      solution: [
        "git branch feature",
        "git branch"
      ]
    },
    {
      title: "Step onto it and commit there",
      concept: "git switch -c",
      context:
        "`git switch feature` moves `HEAD` onto that branch, so your next commit lands there. `git switch -c feature` does both jobs at once: make the name, then step onto it.\n\nThe folder holds `dog.txt`. Commit it on `feature` and the graph forks - `main` does not follow you.",
      goal: [
        "Make `feature` and step onto it in one command: `git switch -c feature`.",
        "Stage `dog.txt` and save it with `git commit -m \"add dog\"`.",
        "Leave `main` where it is - it should still point at `add bird`."
      ],
      files: [],
      start: [
        "git add cat.txt",
        "git commit -m \"add cat\"",
        "git add bird.txt",
        "git commit -m \"add bird\""
      ],
      target: [
        "git add cat.txt",
        "git commit -m \"add cat\"",
        "git add bird.txt",
        "git commit -m \"add bird\"",
        "git switch -c feature",
        "git add dog.txt",
        "git commit -m \"add dog\""
      ],
      solution: [
        "git switch -c feature",
        "git add dog.txt",
        "git commit -m \"add dog\""
      ]
    },
    {
      summary: true,
      title: "Make a branch and work on it - recap",
      concept: "Recap",
      context: "A name, and the marker that says which name you are on.",
      summaryIntro:
        "Branching costs nothing, because there is nothing to copy. You add a name, you decide whether to stand on it, and from then on your commits go where you are standing.",
      summaryItems: [
        {
          title: "Branch - ",
          text: "a name pointing at a commit, moving forward with you as you commit on it."
        },
        {
          title: "`HEAD` - ",
          text: "the marker for where you are, so it decides which branch your next commit lands on."
        },
        {
          title: "`git branch feature` - ",
          text: "makes the name at the commit you are on, and leaves you standing where you were."
        },
        {
          title: "`git switch -c feature` - ",
          text: "makes it and steps onto it, so the work that follows grows on the new line."
        }
      ],
      summaryClose: "Next: tags - a name that pins one commit and never moves again."
    }
  ];

  window.LESSON_CONFIG = {
    prefix: "gmb",
    metaLabel: "Branches · Make a branch and work on it",
    progressNoun: "Exercise",
    tasks,
    xpKey: "course_global_xp",
    awardedKey: "git_make_a_branch_awarded",
    awardAmount: 20,
  };
})();
