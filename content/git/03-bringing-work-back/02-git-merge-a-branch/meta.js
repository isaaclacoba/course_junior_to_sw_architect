window.LESSON_META = {
  id: "git-merge-a-branch",
  key: "git_merge_a_branch_awarded",
  total: 2,
  docTitle: "Merge a branch back",
  eyebrow: "Git · Part three · Bringing work back",
  title: "Merge a branch back",
  intro: [
    "Your branch works, and now it has to become part of `main`. That is the step people hesitate over - it feels like where things get broken. It is one command, and it behaves in two different ways. Which way you get depends on nothing you type: only on whether `main` moved while you were away. Here you run it both ways and watch the graph answer for you."
  ],
  blurb: "One command brings a branch home - and it does two different things. Run `git merge` when `main` stayed put, then again when it did not.",
  links: [{ href: "index.html", label: "Back to the course" }],
  pill: "gentle",
  time: "15 min",
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
      { "id": "gt-merge" },
      { "id": "gt-fast-forward" },
      { "id": "gt-merge-commit" }
    ],
    "revisits": [],
    "uses": [
      { "id": "gt-branch" },
      { "id": "gt-head" },
      { "id": "gt-commit" }
    ]
  },
};
