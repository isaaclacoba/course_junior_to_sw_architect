window.LESSON_META = {
  id: "git-fix-the-last-commit",
  key: "git_fix_the_last_commit_awarded",
  total: 2,
  docTitle: "Fix the last commit",
  eyebrow: "Git · Part four · Fixing mistakes",
  title: "Fix the last commit",
  intro: [
    "You hit Enter and spot the typo a second later. The instinct is to stack another commit on top - `fix typo`, then `oops`, then `fix the fix` - and now whoever reads the history has to work out which one is the real change. Git can replace the last commit instead. Here you correct a message, and fold in a file that should have gone in with it."
  ],
  blurb: "Correct the commit you just made instead of piling an `oops` on top. Fix a bad message, fold in a file you left out, and keep the history the same length.",
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
        "id": "gt-amend"
      }
    ],
    "revisits": [
      {
        "id": "gt-commit"
      }
    ],
    "uses": [
      {
        "id": "gt-head"
      }
    ]
  },
};
