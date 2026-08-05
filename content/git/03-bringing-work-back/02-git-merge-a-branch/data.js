// Git · Part three - "Merge a branch back". The learner types `git merge fix` on
// both cards, but neither card says `fix`. Two branches sit beside `main` and
// only one of them holds work `main` has not got, so the branch name has to be
// read out of the repository first. The two cards then differ only in their
// start state - card 1 leaves `main` at the split, card 2 gives it a commit of
// its own - so the same line produces two different graphs.
//
// Grading is state-based: card 1 ends with two names on one commit and no new
// one, card 2 ends with a commit the runtime builds with two parents.
// Data only: the git plugin reads window.LESSON_CONFIG. The prose here is
// mirrored in res/strings/default/en.json, which the resource layer binds back on.
(function () {
  "use strict";

  const SPLIT = [
    "git add cat.txt",
    "git commit -m \"add cat\"",
    "git branch docs",
    "git add notes.md",
    "git commit -m \"write notes\"",
    "git switch -c fix",
    "git add dog.txt",
    "git commit -m \"add dog\"",
    "git switch main"
  ];

  const BOTH_MOVED = SPLIT.concat([
    "git add feeder.txt",
    "git commit -m \"feed the cat\""
  ]);

  const tasks = [
    {
      title: "Bring back the branch that is ahead",
      concept: "git merge",
      context:
        "Two branches sit beside `main` here, `docs` and `fix`. Only one of them holds a commit `main` has not got.\n\n`git log --oneline` lists what `main` can already reach, and names every branch sitting on those commits. A branch missing from that list is the one still holding something.",
      goal: [
        "Run `git branch` to see which branches exist.",
        "Run `git log --oneline` to see which of them `main` already contains.",
        "Standing on `main`, merge the one that is missing from the log.",
        "Nothing new is saved and two names end up on one commit - that is a fast-forward."
      ],
      files: [
        { path: "cat.txt", text: "Mia, tabby, 4 years old." },
        {
          path: "notes.md",
          text: "# Pet notes\n\nMia is written up.\nRex is still waiting on a branch."
        },
        { path: "dog.txt", text: "Rex, collie, 2 years old." }
      ],
      start: SPLIT,
      target: SPLIT.concat(["git merge fix"]),
      solution: [
        "git branch",
        "git log --oneline",
        "git merge fix"
      ]
    },
    {
      title: "Bring it back when both sides moved",
      concept: "git merge (two parents)",
      context:
        "Same two branches, and `main` has committed since the split.\n\nOne log is not enough now. Read what `main` holds, then stand on the branch that was missing from it and read that too. When each side holds a commit the other has never seen, sliding a name forward would leave one of them off the line.",
      goal: [
        "Read `git log --oneline` on `main`, then switch to the branch it does not contain and read its log too.",
        "Come back to `main` and merge that branch.",
        "A commit appears that neither branch had before.",
        "It has two parents - one line running back to each side."
      ],
      files: [
        { path: "cat.txt", text: "Mia, tabby, 4 years old." },
        {
          path: "notes.md",
          text: "# Pet notes\n\nMia is written up.\nRex is still waiting on a branch."
        },
        { path: "dog.txt", text: "Rex, collie, 2 years old." },
        { path: "feeder.txt", text: "Feeder filled at 7am and 6pm." }
      ],
      start: BOTH_MOVED,
      target: BOTH_MOVED.concat(["git merge fix"]),
      solution: [
        "git log --oneline",
        "git switch fix",
        "git log --oneline",
        "git switch main",
        "git merge fix"
      ]
    },
    {
      summary: true,
      title: "Merge a branch back - recap",
      concept: "Recap",
      context: "One command, two shapes - decided by where the names were sitting.",
      summaryIntro:
        "Merging is not one fixed move. Git looks at whether the branch you are standing on has added anything since the split, and then picks the smallest thing that works. Which branch to name is your call, and the log is where you settle it.",
      summaryItems: [
        {
          title: "Merge - ",
          text: "bringing another branch's commits into the one you are on, so two lines become one."
        },
        {
          title: "`git log --oneline` - ",
          text: "lists what your branch already reaches, and names the branches sitting on those commits."
        },
        {
          title: "Fast-forward - ",
          text: "what you get when your branch added nothing; git slides its name forward and saves no commit."
        },
        {
          title: "Merge commit - ",
          text: "what you get when both sides moved; it is the one commit with two parents."
        },
        {
          title: "`git merge fix` - ",
          text: "the same line either way, so read the graph to see which one you got."
        }
      ],
      summaryClose: "Next: what happens when both sides changed the same file, and git stops to ask you."
    }
  ];

  window.LESSON_CONFIG = {
    prefix: "gmr",
    metaLabel: "Bringing work back · Merge a branch back",
    progressNoun: "Exercise",
    tasks,
    xpKey: "course_global_xp",
    awardedKey: "git_merge_a_branch_awarded",
    awardAmount: 20,
  };
})();
