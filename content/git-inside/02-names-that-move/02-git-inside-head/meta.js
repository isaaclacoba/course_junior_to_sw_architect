window.LESSON_META = {
  id: "git-inside-head",
  key: "git_inside_head_awarded",
  total: 1,
  docTitle: "How does git know where you are?",
  eyebrow: "Inside git · Part two · Names that move",
  title: "How does git know where you are?",
  intro: [
    "A commit holds no parent field, no branch name, nothing that says where it came from. Commits can lead to one another, but they do not point backward - the link exists only because one commit names another in its tree. Yet when a commit is made, git knows exactly which ref to move forward. Something must be keeping track of where you are, and that something is a file the earlier lessons never opened."
  ],
  blurb: "Open HEAD and see how git knows which branch to update. In its usual state it names a ref, and when detached it holds a commit id directly.",
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
    introduces: [],
    revisits: [
      {
        id: "gt-head"
      },
      {
        id: "gt-reflog"
      }
    ],
    uses: [
      {
        id: "gt-ref"
      },
      {
        id: "gt-commit"
      }
    ]
  },
};
