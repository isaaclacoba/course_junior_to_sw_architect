window.LESSON_META = {
  id: "git-inside-index",
  key: "git_inside_index_awarded",
  total: 1,
  docTitle: "What is the staging area, as a file?",
  eyebrow: "Inside git · Part two · Names that move",
  title: "What is the staging area, as a file?",
  intro: [
    "Part two has been about names. A ref names a commit, and `HEAD` names the ref that moves when a commit is saved. None of that says what the commit will actually contain. One more file decides that - and it is the only file in `.git` you cannot read as text."
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
