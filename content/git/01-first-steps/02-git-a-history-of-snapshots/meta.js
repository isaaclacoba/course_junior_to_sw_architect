window.LESSON_META = {
  id: "git-a-history-of-snapshots",
  key: "git_a_history_of_snapshots_awarded",
  total: 1,
  docTitle: "A history of snapshots",
  eyebrow: "Git · Part one · First steps",
  title: "A history of snapshots",
  intro: [
    "You made three commits and three dots appeared. But a row of dots is not yet a history - what makes it one is the line between them. Each commit remembers the one it was built on, and that single link is why git can show you what changed, when, and in what order. Watch the chain form, one commit at a time."
  ],
  blurb: "A row of dots is not a history - the links are. Watch each commit remember the one before it, and see why that chain is what makes git able to look back.",
  links: [{ href: "index.html", label: "Back to the course" }],
  pill: "gentle",
  time: "8 min",
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
      {
        "id": "gt-parent"
      },
      {
        "id": "gt-history"
      }
    ],
    "revisits": [
      {
        "id": "gt-commit"
      }
    ],
    "uses": [
      {
        "id": "gt-repository"
      }
    ]
  },
};
