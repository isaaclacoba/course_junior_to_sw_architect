window.LESSON_META = {
  id: "git-inside-ref-file",
  key: "git_inside_ref_file_awarded",
  total: 1,
  docTitle: "The ref file",
  eyebrow: "Inside git · Part two · Names that move",
  title: "The ref file",
  intro: [
    "Making a new branch is instant, even in a repository with a million commits. You can have fifty branches pointing at the same commit, or delete a branch and bring it back a minute later, and the object store itself never changes. A branch is not a container of commits - it is something far simpler, and once you see what it really is, the instant speed stops being mysterious."
  ],
  blurb: "Open the refs folder and see what a branch is actually made of. It is a file holding one commit id, nothing more.",
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
        id: "gt-ref"
      }
    ],
    revisits: [],
    uses: [
      {
        id: "gt-commit"
      }
    ]
  },
};
