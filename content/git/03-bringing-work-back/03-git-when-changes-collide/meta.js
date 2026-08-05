window.LESSON_META = {
  id: "git-when-changes-collide",
  key: "git_when_changes_collide_awarded",
  total: 1,
  docTitle: "When two changes collide",
  eyebrow: "Git · Part three · Bringing work back",
  title: "When two changes collide",
  intro: [
    "The first time git says `CONFLICT` it looks like an accident - as if the merge failed and your work is in pieces somewhere. Nothing failed, and git is not confused about which files you touched. It is reading the lines. Two branches can rewrite the same file all afternoon and git will merge it without asking you anything; what stops it is two edits landing on top of each other. Here you watch both, on one file, so you can see the one difference that decides it."
  ],
  blurb: "Two branches edit one file and git merges it without asking. Move one of those edits onto the other's line and the same merge stops - watch both, and read what git leaves behind in the file.",
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
      { "id": "gt-conflict" }
    ],
    "revisits": [
      { "id": "gt-merge" },
      { "id": "gt-merge-commit" }
    ],
    "uses": [
      { "id": "gt-branch" },
      { "id": "gt-commit" },
      { "id": "gt-parent" }
    ]
  },
};
