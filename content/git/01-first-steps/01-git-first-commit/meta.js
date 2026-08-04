window.LESSON_META = {
  id: "git-first-commit",
  key: "git_first_commit_awarded",
  total: 3,
  docTitle: "Your first commit",
  eyebrow: "Git · Part one · First steps",
  title: "Your first commit",
  intro: [
    "Your folder works right now. How do you keep this version? Most people copy the whole folder and call it `backup-final-2` - which holds up until about the third copy. Git does that job from inside the folder: you choose what to keep, save it with a short note, and every save stays. Here you make your first ones."
  ],
  blurb: "Hand a folder to git and save your first versions of it. Three short exercises in a real terminal: start the repository, choose which files go in, and save them - the graph draws itself as you type.",
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
        "id": "gt-repository"
      },
      {
        "id": "gt-working-tree"
      },
      {
        "id": "gt-staging-area"
      },
      {
        "id": "gt-commit"
      }
    ],
    "revisits": [],
    "uses": []
  },
};
