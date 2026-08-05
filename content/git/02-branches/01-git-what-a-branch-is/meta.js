window.LESSON_META = {
  id: "git-what-a-branch-is",
  key: "git_what_a_branch_is_awarded",
  total: 1,
  docTitle: "What a branch really is",
  eyebrow: "Git · Part two · Branches",
  title: "What a branch really is",
  intro: [
    "Most people picture a branch as a copy of the project - a second folder, duplicated somewhere. A branch is a name pointing at a commit, and almost nothing else. Which raises a fair question: if it is only a name, what happens to the files on my disk when I switch? Here you save different text on two branches and flip between them, and the file in your folder changes under you."
  ],
  blurb: "A branch is a name pointing at a commit. Save different text on two branches, flip between them, and watch the same file change in your folder.",
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
      { "id": "gt-branch" },
      { "id": "gt-head" }
    ],
    "revisits": [
      { "id": "gt-commit" },
      { "id": "gt-history" }
    ],
    "uses": [
      { "id": "gt-repository" }
    ]
  },
};
