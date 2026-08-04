// Git · Part three - "Merge a branch back". The same command on two cards, and
// the only difference between them is the start state: card 1 leaves `main`
// where the split happened, card 2 gives it a commit of its own. So the learner
// types the identical line twice and gets two different graphs - which is the
// point that prose cannot make on its own.
//
// Grading is state-based: card 1 ends with both names on one commit and no new
// one, card 2 ends with a commit the runtime builds with two parents.
// Data only: the git plugin reads window.LESSON_CONFIG. The prose here is
// mirrored in res/strings/default/en.json, which the resource layer binds back on.
(function () {
  "use strict";

  const SPLIT = [
    "git add cat.txt",
    "git commit -m \"add cat\"",
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
      title: "Bring it back when `main` stayed put",
      concept: "git merge",
      context:
        "You made `fix`, committed `add dog` there, and switched back. `main` has not moved since the split, so `fix` is simply ahead of it.\n\n`git merge fix` brings that branch's commits into the one you are on. Here there is nothing to combine, so git takes the cheap route.",
      goal: [
        "Standing on `main`, run `git merge fix`.",
        "Both names should end up on the same commit, `add dog`.",
        "Nothing new is saved - that is a fast-forward."
      ],
      files: ["cat.txt", "dog.txt"],
      start: SPLIT,
      target: SPLIT.concat(["git merge fix"]),
      solution: [
        "git merge fix"
      ]
    },
    {
      title: "Bring it back when both sides moved",
      concept: "git merge (two parents)",
      context:
        "Same branch, one difference: after switching back you also committed `feed the cat` on `main`. Each side now holds a commit the other has never seen.\n\nSliding a name forward would leave one of them off the line, so `git merge fix` has to do the other thing.",
      goal: [
        "From `main`, run `git merge fix` again.",
        "A commit appears that neither branch had before.",
        "It has two parents - one line running back to each side."
      ],
      files: ["cat.txt", "dog.txt", "feeder.txt"],
      start: BOTH_MOVED,
      target: BOTH_MOVED.concat(["git merge fix"]),
      solution: [
        "git merge fix"
      ]
    },
    {
      summary: true,
      title: "Merge a branch back - recap",
      concept: "Recap",
      context: "One command, two shapes - decided by where the names were sitting.",
      summaryIntro:
        "Merging is not one fixed move. Git looks at whether the branch you are standing on has added anything since the split, and then picks the smallest thing that works.",
      summaryItems: [
        {
          title: "Merge - ",
          text: "bringing another branch's commits into the one you are on, so two lines become one."
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
