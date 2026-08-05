// Git · Part two - "Make a branch and work on it". Two cards, and neither can be
// solved without reading the repository first. Card 1 names its commit by MESSAGE
// only, so `git log --oneline` is what turns it into a revision; it also does not
// move the learner, so naming and standing stay two different things. Card 2 puts
// `HEAD` on `docs` rather than `main`, so a learner who types `git switch -c`
// straight away branches from the wrong place - `git branch` is what tells them.
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
        "A branch is a name pointing at a commit. `git branch feature` makes that name where you are standing.\n\nIt can also point further back. `HEAD~1` is the commit before `HEAD` and `HEAD~3` is three before it, so `git branch old HEAD~3` names a commit you are not on. `git log --oneline` tells you which one that is.",
      goal: [
        "Run `git log --oneline` and find the commit whose message is `add dog`.",
        "Make a branch called `feature` at that commit. On its own, `git branch feature` would put it at `HEAD`.",
        "Stay on `main` - run `git branch` and check the `*` is still there."
      ],
      files: [
        { path: "cat.txt", text: "Mia, tabby, 4 years old." },
        { path: "dog.txt", text: "Rex, collie, 2 years old." },
        { path: "bird.txt", text: "Pip, budgie, loud at 6am." },
        { path: "feeder.txt", text: "Feeder: 8am and 6pm.\nThe timer ran an hour late - corrected." }
      ],
      goals: [
        { code: ["git log --oneline"], gate: { ran: "git log --oneline" } },
        { code: ["git branch feature HEAD~2", { row: "feature -> add dog", branch: "feature", at: "add dog" }],
          gate: { branch: "feature", at: "add dog" } },
        { code: ["git branch", { row: "HEAD -> main", head: "main" }],
          gate: { ran: "git branch", head: "main", branch: "feature", at: "add dog" } }
      ],
      start: [
        "git add cat.txt",
        "git commit -m \"add cat\"",
        "git add dog.txt",
        "git commit -m \"add dog\"",
        "git add bird.txt",
        "git commit -m \"add bird\"",
        "git add feeder.txt",
        "git commit -m \"fix the feeder\""
      ],
      target: [
        "git add cat.txt",
        "git commit -m \"add cat\"",
        "git add dog.txt",
        "git commit -m \"add dog\"",
        "git add bird.txt",
        "git commit -m \"add bird\"",
        "git add feeder.txt",
        "git commit -m \"fix the feeder\"",
        "git branch feature HEAD~2"
      ],
      solution: [
        "git log --oneline",
        "git branch feature HEAD~2",
        "git branch"
      ]
    },
    {
      title: "Step onto it and commit there",
      concept: "git switch -c",
      context:
        "`git switch feature` moves `HEAD` onto that branch, so your next commit lands there. `git switch -c feature` does both jobs at once: make the name, then step onto it.\n\nThe new branch starts where you are standing, so check where that is first - `git branch` marks the current one with a `*`.",
      goal: [
        "Run `git branch` - it marks the branch you are on with a `*`.",
        "The dog's work belongs on a new branch called `feature`, growing from `main`.",
        "Make `feature` and step onto it with `git switch -c feature` - it starts where you are standing, so be standing in the right place.",
        "Stage `dog.txt` and save it with `git commit -m \"add dog\"`."
      ],
      files: [
        { path: "cat.txt", text: "Mia, tabby, 4 years old." },
        { path: "readme.md", text: "# Pet notes\n\nOne file per animal." },
        { path: "dog.txt", text: "Rex, collie, 2 years old." }
      ],
      goals: [
        { code: ["git branch", { row: "HEAD -> docs", head: "docs" }],
          gate: { ran: "git branch", head: "docs" } },
        { code: ["git switch main", { row: "HEAD -> main", head: "main" }],
          gate: { ran: "git switch main", head: "main" } },
        { code: ["git switch -c feature", { row: "HEAD -> feature", head: "feature" }, { row: "feature -> add cat", branch: "feature", at: "add cat" }],
          gate: { ran: "git switch -c feature", branch: "feature", head: "feature" } },
        { code: ["git add dog.txt", 'git commit -m "add dog"', { row: "feature -> add dog", branch: "feature", at: "add dog" }, { row: "holds: dog.txt", commit: "add dog", paths: ["dog.txt"], on: "feature" }],
          gate: { commit: "add dog", on: "feature" } }
      ],
      start: [
        "git add cat.txt",
        "git commit -m \"add cat\"",
        "git switch -c docs",
        "git add readme.md",
        "git commit -m \"add readme\""
      ],
      target: [
        "git add cat.txt",
        "git commit -m \"add cat\"",
        "git switch -c docs",
        "git add readme.md",
        "git commit -m \"add readme\"",
        "git switch main",
        "git switch -c feature",
        "git add dog.txt",
        "git commit -m \"add dog\""
      ],
      solution: [
        "git branch",
        "git switch main",
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
          text: "makes the name where you are standing, or further back with `HEAD~2`, and leaves you where you were."
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
