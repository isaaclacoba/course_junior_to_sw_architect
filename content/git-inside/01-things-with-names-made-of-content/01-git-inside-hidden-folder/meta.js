window.LESSON_META = {
  id: "git-inside-hidden-folder",
  key: "git_inside_hidden_folder_awarded",
  total: 1,
  docTitle: "What is in that hidden folder?",
  eyebrow: "Inside git · Part one · Things with names made of content",
  title: "What is in that hidden folder?",
  intro: [
    "Git keeps every version of your work, and it keeps them all in one place: a hidden folder called `.git`, sitting right beside your own files. There is no server involved and nothing running in the background. What is inside that folder is ordinary - files and folders you could open in any text editor. Before you have saved anything it is nearly empty, which makes now the easiest time to learn what each part is for."
  ],
  blurb: "The hidden folder git keeps, read line by line before you have saved anything. It holds almost nothing yet, and that is exactly why it is the place to start.",
  links: [{ href: "index.html", label: "Back to the course" }],
  pill: "gentle",
  time: "15 min",
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
      {
        "id": "gt-git-folder"
      }
    ],
    "revisits": [],
    "uses": []
  },
};
