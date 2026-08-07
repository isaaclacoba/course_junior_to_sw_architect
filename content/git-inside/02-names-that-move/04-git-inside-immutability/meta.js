window.LESSON_META = {
  id: "git-inside-immutability",
  key: "git_inside_immutability_awarded",
  total: 1,
  docTitle: "Does editing a line change anything git kept?",
  eyebrow: "Inside git · Part two · Names that move",
  title: "Does editing a line change anything git kept?",
  intro: [
    "A commit's name comes from hashing its bytes - the tree, the parent, the message, the author and the timestamp. Editing the message would change the hash, which means the id would no longer name the commit. The lesson on blobs established that changing bytes writes a new object; commits work the same way. What looks like editing a commit is writing a new one and moving a name, and the original stays exactly where it was."
  ],
  blurb: "Amend a commit and watch what happens to the original. It sits in the store untouched, and the only thing that changed is what names it.",
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
        id: "gt-immutability"
      }
    ],
    revisits: [
      {
        id: "gt-commit"
      },
      {
        id: "gt-ref"
      }
    ],
    uses: [
      {
        id: "gt-reflog"
      }
    ]
  },
};
