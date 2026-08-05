window.LESSON_META = {
  id: "git-reflog",
  key: "git_reflog_awarded",
  total: 2,
  docTitle: "Find a lost commit",
  eyebrow: "Git · Part four · Fixing mistakes",
  title: "Find a lost commit",
  intro: [
    "You amend a commit and the one you had a second ago is not in `git log` any more. It looks gone. Usually it is not: git keeps a second list of every place you have stood, and the old commit is still in there with its hash. Here you lose a commit on purpose and then get it back."
  ],
  blurb: "`git log` shows what a branch can still reach. `git reflog` shows every place `HEAD` has been, so a commit you thought you had thrown away is still findable by its hash.",
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
        "id": "gt-reflog"
      }
    ],
    "revisits": [
      {
        "id": "gt-amend"
      },
      {
        "id": "gt-detached-head"
      },
      {
        "id": "gt-hash"
      }
    ],
    "uses": [
      {
        "id": "gt-branch"
      },
      {
        "id": "gt-head"
      },
      {
        "id": "gt-history"
      }
    ]
  },
};
