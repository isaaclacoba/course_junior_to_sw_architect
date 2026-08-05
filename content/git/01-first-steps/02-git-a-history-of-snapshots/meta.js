window.LESSON_META = {
  id: "git-a-history-of-snapshots",
  key: "git_a_history_of_snapshots_awarded",
  total: 1,
  docTitle: "A history of snapshots",
  eyebrow: "Git · Part one · First steps",
  title: "A history of snapshots",
  intro: [
    "Ask what a commit stores and most people say: the change I made. It is a fair guess - the message you type describes a change, and every tool hands you a list of them. What git actually writes down is a copy of every file it was tracking at that moment. Here you change one line, save it, and step back to the commit before to watch the whole folder come back."
  ],
  blurb: "A commit holds a copy of the whole folder, every file at once. Change one line, save it, then step back a commit and watch the older version come back.",
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
