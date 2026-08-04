window.LESSON_META = {
  id: "git-settle-a-conflict",
  key: "git_settle_a_conflict_awarded",
  total: 2,
  docTitle: "Settle a conflict",
  eyebrow: "Git · Part three · Bringing work back",
  title: "Settle a conflict",
  intro: [
    "A stopped merge feels like a hole you have fallen into, so the instinct is to close the terminal and hope it goes away. That is how half-finished merges end up committed by accident. There are only two ways out of one, and both are short: finish it by saying which file is settled, or call the whole thing off and stand exactly where you were before. Here you do both, on the same pair of branches."
  ],
  blurb: "Two branches changed `cat.txt`, so the merge stopped. Finish it by marking the file settled and committing - then call one off and leave no trace.",
  links: [{ href: "index.html", label: "Back to the course" }],
  pill: "gentle",
  time: "20 min",
  archetype: "git",
  engine: null,
  runtime: "kernel",
  resources: {
    base: "res/strings",
    lang: "en",
    langs: ["en", "es"],
    voices: ["default"],
  },
  concepts: {
    "introduces": [
      { "id": "gt-abort" }
    ],
    "revisits": [
      { "id": "gt-conflict" }
    ],
    "uses": [
      { "id": "gt-merge" },
      { "id": "gt-branch" },
      { "id": "gt-merge-commit" },
      { "id": "gt-tag" }
    ]
  },
};
