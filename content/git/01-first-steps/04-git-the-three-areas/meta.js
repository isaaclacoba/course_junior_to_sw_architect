window.LESSON_META = {
  id: "git-the-three-areas",
  key: "git_the_three_areas_awarded",
  total: 1,
  docTitle: "The three areas",
  eyebrow: "Git · Part one · First steps",
  title: "The three areas",
  intro: [
    "Saving one file takes two commands, and the first one - `git add` - can look like paperwork you could skip. Skipping it is how people end up committing things they never meant to save. That middle step is git taking a copy of what you picked, and it holds that copy while you carry on editing the file. Here you watch one file end up with three different versions at once, and see which one a commit saves."
  ],
  blurb: "Why is there a middle step between editing a file and saving it? Watch one file end up with three different versions at the same time, one in each of git's three areas, and see which one `git commit` writes down.",
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
      { "id": "gt-working-tree" },
      { "id": "gt-staging-area" }
    ],
    "revisits": [
      { "id": "gt-repository" },
      { "id": "gt-commit" }
    ],
    "uses": []
  },
};
