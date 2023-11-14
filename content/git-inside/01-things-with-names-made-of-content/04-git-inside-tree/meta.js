window.LESSON_META = {
  id: "git-inside-tree",
  key: "git_inside_tree_awarded",
  total: 1,
  docTitle: "What remembers it was called notes.md?",
  eyebrow: "Inside git · Part one · Things with names made of content",
  title: "What remembers it was called notes.md?",
  intro: [
    "A blob holds your bytes and forgets your file name. Yet git puts your files back with the right names every time, so the name is written down somewhere. It is in a second kind of object, one whose entire job is to say which name goes with which bytes."
  ],
  blurb: "A blob has no file name, so something else must hold it. Meet the second kind of object - a plain list of name-and-id pairs - and see that it is named by its own contents, exactly like everything else.",
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
