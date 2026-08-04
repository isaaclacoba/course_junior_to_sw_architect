window.LESSON_META = {
  id: "git-what-a-branch-is",
  key: "git_what_a_branch_is_awarded",
  total: 1,
  docTitle: "What a branch really is",
  eyebrow: "Git · Part two · Branches",
  title: "What a branch really is",
  intro: [
    "Most people picture a branch as a copy of the project - a second folder, duplicated somewhere. That picture makes branching feel expensive and a little scary, so people avoid it. It is also wrong. A branch is a name pointing at a commit, and almost nothing else. Once you see that, the rest of git gets easier: making one costs nothing, and switching is just moving a marker."
  ],
  blurb: "A branch is not a copy of anything - it is a name pointing at a commit. Watch the name move as you commit, and see what `HEAD` is really for.",
  links: [{ href: "index.html", label: "Back to the course" }],
  pill: "gentle",
  time: "10 min",
  archetype: "viz",
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
      { "id": "gt-branch" },
      { "id": "gt-head" }
    ],
    "revisits": [
      { "id": "gt-commit" },
      { "id": "gt-history" }
    ],
    "uses": [
      { "id": "gt-repository" }
    ]
  },
};
