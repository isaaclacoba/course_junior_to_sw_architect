window.LESSON_META = {
  id: "git-what-reset-moves",
  key: "git_what_reset_moves_awarded",
  total: 1,
  docTitle: "What reset actually moves",
  eyebrow: "Git · Part four · Fixing mistakes",
  title: "What reset actually moves",
  intro: [
    "You commit something you did not mean to, and the word `reset` starts to sound like a command that deletes your work. It is calmer than that, and it is not one outcome but three. Every reset moves your branch's name back to a commit you name; what changes is where the files from the undone commit end up - still staged, back in the folder, or gone. Watch all three side by side, so you can pick the one you actually meant."
  ],
  blurb: "`--soft`, `--mixed` and `--hard` move your branch to exactly the same place. Watch where each one leaves the files the undone commit was holding.",
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
      { "id": "gt-reset" }
    ],
    "revisits": [
      { "id": "gt-staging-area" },
      { "id": "gt-working-tree" },
      { "id": "gt-head" }
    ],
    "uses": []
  },
};
