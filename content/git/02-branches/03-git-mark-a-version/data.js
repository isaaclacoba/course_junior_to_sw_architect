// Git · Part two - "Mark a version with a tag". Both cards end in a state
// change through refs: a new tag at HEAD, then a new tag at HEAD~1.
(function () {
  "use strict";

  const tasks = [
    {
      title: "Mark the commit you are on",
      concept: "git tag",
      context:
        "A tag is a name pinned to one commit, and it does not move when new commits appear. Use it to mark a version you want to find again.\n\nYou already have three commits on `main`. Put the name `v1` on the commit you are standing on now.",
      goal: [
        "Pin the tag `v1` to the current commit with `git tag v1`.",
        "Move nothing else - stay on the same branch and commit."
      ],
      files: [],
      start: [
        "git add cat.txt",
        "git commit -m \"add cat\"",
        "git add dog.txt",
        "git commit -m \"add dog\"",
        "git add bird.txt",
        "git commit -m \"add bird\""
      ],
      target: [
        "git add cat.txt",
        "git commit -m \"add cat\"",
        "git add dog.txt",
        "git commit -m \"add dog\"",
        "git add bird.txt",
        "git commit -m \"add bird\"",
        "git tag v1"
      ],
      solution: [
        "git tag v1"
      ]
    },
    {
      title: "Mark an older commit",
      concept: "git tag <name> <revision>",
      context:
        "You can also tag a commit that is not the current one by naming a revision. `HEAD~1` means one commit before where you stand.\n\nKeep standing where you are, and pin `v0` to the commit before the latest one.",
      goal: [
        "Tag the commit before last with `git tag v0 HEAD~1`.",
        "Do not move `HEAD` and do not move any branch."
      ],
      files: [],
      start: [
        "git add cat.txt",
        "git commit -m \"add cat\"",
        "git add dog.txt",
        "git commit -m \"add dog\"",
        "git add bird.txt",
        "git commit -m \"add bird\""
      ],
      target: [
        "git add cat.txt",
        "git commit -m \"add cat\"",
        "git add dog.txt",
        "git commit -m \"add dog\"",
        "git add bird.txt",
        "git commit -m \"add bird\"",
        "git tag v0 HEAD~1"
      ],
      solution: [
        "git tag v0 HEAD~1"
      ]
    },
    {
      summary: true,
      title: "Mark a version with a tag - recap",
      concept: "Recap",
      context: "A tag is fixed; a branch keeps moving.",
      summaryIntro:
        "A tag is a stable label on one commit. It helps you return to that exact point later, even after many new commits.",
      summaryItems: [
        {
          title: "Tag - ",
          text: "a name pinned to one commit that does not move with later work."
        },
        {
          title: "`git tag v1` - ",
          text: "marks the commit you are on now, with no checkout and no branch movement."
        },
        {
          title: "`git tag v0 HEAD~1` - ",
          text: "marks an older commit by revision, while you stay where you are."
        },
        {
          title: "Branch vs tag - ",
          text: "branches move as you commit; tags stay pinned at one version."
        }
      ],
      summaryClose: "Next: merge a branch back into `main` and read what kind of merge happened."
    }
  ];

  window.LESSON_CONFIG = {
    prefix: "gmv",
    metaLabel: "Branches · Mark a version with a tag",
    progressNoun: "Exercise",
    tasks,
    xpKey: "course_global_xp",
    awardedKey: "git_mark_a_version_awarded",
    awardAmount: 20,
  };
})();