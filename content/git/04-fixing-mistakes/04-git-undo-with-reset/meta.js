window.LESSON_META = {
  id: "git-undo-with-reset",
  key: "git_undo_with_reset_awarded",
  total: 3,
  docTitle: "Undo with reset",
  eyebrow: "Git · Part four · Fixing mistakes",
  title: "Undo with reset",
  intro: [
    "The commit is made and it should not have been. Deleting the file and starting over is the tempting move, and it usually throws away more than the mistake. `reset` moves your branch's name back instead, and hands you the real decision: keep those files staged, drop them back in the folder, or let them go. Here you run all three on the same mistake and watch the zones answer."
  ],
  blurb: "Move your branch back one commit and say where its files should land. Run `--soft`, `--mixed` and `--hard` on the same mistake and watch the three zones answer differently.",
  links: [{ href: "index.html", label: "Back to the course" }],
  pill: "gentle",
  time: "20 min",
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
        "id": "gt-reset"
      }
    ],
    "revisits": [
      {
        "id": "gt-staging-area"
      },
      {
        "id": "gt-working-tree"
      }
    ],
    "uses": [
      {
        "id": "gt-head"
      },
      {
        "id": "gt-reflog"
      }
    ]
  },
};
