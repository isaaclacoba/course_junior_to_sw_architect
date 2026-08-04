window.LESSON_META = {
  id: "git-where-am-i",
  key: "git_where_am_i_awarded",
  total: 2,
  docTitle: "Where am I?",
  eyebrow: "Git · Part one · First steps",
  title: "Where am I?",
  intro: [
    "You open a folder on Monday with no memory of how you left it. Did you save that change, or only start it? Git will tell you, but only if you ask - and asking is the habit that separates people who trust git from people who are a bit scared of it. Two questions cover most of it: what is going on right now, and what happened before. Here you learn to ask both, then commit with your eyes open."
  ],
  blurb: "Read your own repository before you change it. Ask git what is waiting to be saved and what you have saved already, then add the next commit knowing exactly where you stand.",
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
      {
        "id": "gt-hash"
      }
    ],
    "revisits": [
      {
        "id": "gt-commit"
      },
      {
        "id": "gt-repository"
      }
    ],
    "uses": [
      {
        "id": "gt-staging-area"
      },
      {
        "id": "gt-working-tree"
      }
    ]
  },
};
