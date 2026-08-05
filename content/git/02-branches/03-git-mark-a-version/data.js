// Git · Part two - "Mark a version with a tag". Both cards end in new refs, and
// neither can be answered without reading first: card 1 hides the version NUMBER
// in the tag list, card 2 hides WHICH commit is the release in the log. A card
// answerable by typing the obvious line would teach nothing about tags, because
// the whole point of a tag is naming a commit you picked on purpose.
(function () {
  "use strict";

  const tasks = [
    {
      title: "Name the version you are standing on",
      concept: "git tag",
      context:
        "A tag is a name pinned to one commit, and it does not move when new commits appear.\n\nThis project has shipped before, so some version names are already taken. `git tag` on its own lists them. Find out which numbers are gone, then put the next one on the commit you are on.",
      goal: [
        "Run `git tag` to see which version names already exist.",
        "Run `git log --oneline` to see where the last one was pinned.",
        "Pin the next version number to the commit you are standing on.",
        "Move nothing else - stay on the same branch and commit."
      ],
      files: [
        { path: "cat.txt", text: "Mia, tabby, 4 years old." },
        { path: "feeder.txt", text: "Feeder v1: two meals a day, 8am and 6pm." },
        { path: "bowl.txt", text: "The water bowl leaked when full.\nFixed - fill only to the line." },
        { path: "timer.txt", text: "Timer, new in v2.\nSkips the evening meal at weekends." }
      ],
      start: [
        "git add cat.txt",
        "git commit -m \"add cat\"",
        "git add feeder.txt",
        "git commit -m \"release: feeder v1\"",
        "git tag v1",
        "git add bowl.txt",
        "git commit -m \"fix the water bowl\"",
        "git add timer.txt",
        "git commit -m \"release: feeder v2\""
      ],
      target: [
        "git add cat.txt",
        "git commit -m \"add cat\"",
        "git add feeder.txt",
        "git commit -m \"release: feeder v1\"",
        "git tag v1",
        "git add bowl.txt",
        "git commit -m \"fix the water bowl\"",
        "git add timer.txt",
        "git commit -m \"release: feeder v2\"",
        "git tag v2"
      ],
      solution: [
        "git tag",
        "git log --oneline",
        "git tag v2"
      ]
    },
    {
      title: "Name a commit you are not standing on",
      concept: "git tag <name> <revision>",
      context:
        "`HEAD~1` means one commit before where you stand, `HEAD~2` two before, and so on. That is how you name a commit without moving to it.\n\nFour commits sit on `main` and none of them is tagged. One of them is the release - its message says so. The log is the only thing here that tells you which.",
      goal: [
        "Run `git log --oneline` and read the four messages.",
        "Pin `v1` to the commit whose message calls it a release.",
        "Pin `v0` to the very first commit, at the bottom of the log.",
        "Do not move `HEAD` and do not move any branch."
      ],
      files: [
        { path: "cat.txt", text: "Mia, tabby, 4 years old." },
        { path: "dog.txt", text: "Rex, collie, 2 years old." },
        { path: "feeder.txt", text: "Feeder v1: two meals a day, 8am and 6pm." },
        { path: "bowl.txt", text: "# Water bowl\n\nTODO: nothing built yet." }
      ],
      start: [
        "git add cat.txt",
        "git commit -m \"add cat\"",
        "git add dog.txt",
        "git commit -m \"add dog\"",
        "git add feeder.txt",
        "git commit -m \"release: feeder v1\"",
        "git add bowl.txt",
        "git commit -m \"start the water bowl\""
      ],
      target: [
        "git add cat.txt",
        "git commit -m \"add cat\"",
        "git add dog.txt",
        "git commit -m \"add dog\"",
        "git add feeder.txt",
        "git commit -m \"release: feeder v1\"",
        "git add bowl.txt",
        "git commit -m \"start the water bowl\"",
        "git tag v1 HEAD~1",
        "git tag v0 HEAD~3"
      ],
      solution: [
        "git log --oneline",
        "git tag v1 HEAD~1",
        "git tag v0 HEAD~3"
      ]
    },
    {
      summary: true,
      title: "Mark a version with a tag - recap",
      concept: "Recap",
      context: "A tag is fixed; a branch keeps moving.",
      summaryIntro:
        "A tag is a stable label on one commit. It helps you return to that exact point later, even after many new commits. The log is where you work out which commit deserves the label.",
      summaryItems: [
        {
          title: "Tag - ",
          text: "a name pinned to one commit that does not move with later work."
        },
        {
          title: "`git tag` - ",
          text: "with nothing after it, lists the names already taken, so you know which one is free."
        },
        {
          title: "`git tag v2` - ",
          text: "marks the commit you are on now, with no checkout and no branch movement."
        },
        {
          title: "`git tag v1 HEAD~1` - ",
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
