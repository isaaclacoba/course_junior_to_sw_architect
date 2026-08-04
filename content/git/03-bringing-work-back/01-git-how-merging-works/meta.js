window.LESSON_META = {
  id: "git-how-merging-works",
  key: "git_how_merging_works_awarded",
  total: 1,
  docTitle: "How merging works",
  eyebrow: "Git · Part three · Bringing work back",
  title: "How merging works",
  intro: [
    "Bringing a branch back sounds like the big step - the one where git stitches two histories together and something gets broken. Often it does almost nothing: it slides a name forward and stops. Other times it saves one new snapshot that points back at both lines. Which one you get is not a setting you chose; it depends only on where the two names are sitting. Here you watch both happen, so you can tell them apart on sight."
  ],
  blurb: "Merging is not always the same move. Watch git slide a name forward without saving anything new, then watch it make the one commit that points back at two parents.",
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
      { "id": "gt-merge" },
      { "id": "gt-fast-forward" },
      { "id": "gt-merge-commit" }
    ],
    "revisits": [
      { "id": "gt-branch" },
      { "id": "gt-head" }
    ],
    "uses": [
      { "id": "gt-commit" },
      { "id": "gt-parent" }
    ]
  },
};
