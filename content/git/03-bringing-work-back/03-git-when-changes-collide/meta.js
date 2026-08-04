window.LESSON_META = {
  id: "git-when-changes-collide",
  key: "git_when_changes_collide_awarded",
  total: 1,
  docTitle: "When two changes collide",
  eyebrow: "Git · Part three · Bringing work back",
  title: "When two changes collide",
  intro: [
    "The first time git says `CONFLICT` it reads like an accident - as if the merge failed and your work is somewhere in pieces. That reading is the expensive one: it is what makes people undo things at random and lose work they still had. Nothing failed. Git combined every file it could, reached one it cannot decide for you, and stopped there on purpose. Here you watch that moment happen, so you can tell a stopped merge from a broken one."
  ],
  blurb: "Git joins two lines on its own until both sides changed the same file. Watch the merge stop with nothing saved, and see what it is waiting for.",
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
