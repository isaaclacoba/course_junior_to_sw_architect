window.LESSON_META = {
  id: "git-point-at-a-commit",
  key: "git_point_at_a_commit_awarded",
  total: 2,
  docTitle: "Point at any commit",
  eyebrow: "Git · Part four · Fixing mistakes",
  title: "Point at any commit",
  intro: [
    "Every command so far has meant `where I am now`. To reach an older commit the obvious move is to copy its hash out of `git log` - seven characters to read carefully and retype without slipping. Git will count backwards for you instead: `HEAD~1` is one step back, `main~2` is two. Here you use those names to put a branch further back, and to stand on an older commit yourself."
  ],
  blurb: "Name a commit without its hash, and stand on one directly. Count backwards with `main~2` and `HEAD~1`, put a branch on an older commit, and see what a detached `HEAD` looks like.",
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
        "id": "gt-detached-head"
      }
    ],
    "revisits": [
      {
        "id": "gt-hash"
      },
      {
        "id": "gt-revision"
      }
    ],
    "uses": [
      {
        "id": "gt-branch"
      },
      {
        "id": "gt-head"
      }
    ]
  },
};
