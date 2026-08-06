window.LESSON_META = {
  id: "git-inside-tree",
  key: "git_inside_tree_awarded",
  total: 1,
  docTitle: "The object that knows your folder",
  eyebrow: "Inside git · Part one · Things with names made of content",
  title: "The object that knows your folder",
  intro: [
    "A blob keeps bytes and forgets everything else. The object that remembers your file was called `notes.md` is the tree - and it also records one permission bit, nests one object per directory, and changes its own id whenever anything underneath it changes."
  ],
  blurb: "Read a real tree object: the mode in front of each name, the twenty raw bytes behind it, and what happens to every id above a file when you edit it.",
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
        "id": "gt-tree"
      }
    ],
    "revisits": [
      {
        "id": "gt-blob"
      }
    ],
    "uses": []
  },
};
