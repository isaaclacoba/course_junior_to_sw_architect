window.LESSON_META = {
  id: "git-first-commit",
  key: "git_first_commit_awarded",
  total: 3,
  docTitle: "Your first commit",
  eyebrow: "Git · Part one · First steps",
  title: "Your first commit",
  intro: [
    "You have a folder of files, and the version in it works right now. How do you keep it? Copying the whole folder and calling it `backup-final-2` is where most people start, and it holds up for about a week - by the third copy nobody remembers which one was good. Git does the same job from inside the folder: you choose what to keep, save it with a short note about what changed, and every save stays there for you to go back to. Here you will hand a folder to git and make your first saves, watching each one appear on the graph as you type."
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
