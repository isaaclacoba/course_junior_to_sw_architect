window.LESSON_META = {
  id: "git-inside-index",
  key: "git_inside_index_awarded",
  total: 1,
  docTitle: "What is the staging area, as a file?",
  eyebrow: "Inside git · Part two · Names that move",
  title: "What is the staging area, as a file?",
  intro: [
    "Lesson three established that adding a file writes a blob to the object store, and that the index is what reaches the blob so it does not show up as dangling. But the index itself was never opened - it existed only as the answer to why an added file does not disappear. Here it becomes the thing being examined, and the file it leads to is no longer a mystery."
  ],
  blurb: "Open the index and see what staging really writes. It is a binary file mapping paths to blob ids and file modes, nothing more.",
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
    introduces: [
      {
        id: "gt-index"
      }
    ],
    revisits: [],
    uses: [
      {
        id: "gt-blob"
      },
      {
        id: "gt-commit"
      }
    ]
  },
};
