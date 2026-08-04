window.LESSON_META = {
  id: "git-mark-a-version",
  key: "git_mark_a_version_awarded",
  total: 2,
  docTitle: "Mark a version with a tag",
  eyebrow: "Git · Part two · Branches",
  title: "Mark a version with a tag",
  intro: [
    "A branch moves as work continues. Sometimes you need a name that stays fixed, like a release marker. That is what a tag is: a label pinned to one commit. Here you mark the commit you are on, then mark an earlier one, without moving `HEAD` or changing any branch."
  ],
  blurb: "Pin a name to one commit so you can find that exact version again. Add one tag at `HEAD`, then one tag on an older commit.",
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
        "id": "gt-tag"
      }
    ],
    "revisits": [
      {
        "id": "gt-branch"
      }
    ],
    "uses": [
      {
        "id": "gt-commit"
      },
      {
        "id": "gt-head"
      },
      {
        "id": "gt-hash"
      }
    ]
  },
};