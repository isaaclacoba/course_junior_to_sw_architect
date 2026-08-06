window.LESSON_META = {
  id: "git-inside-commit-object",
  key: "git_inside_commit_object_awarded",
  total: 1,
  docTitle: "What is a save actually made of?",
  eyebrow: "Inside git · Part one · Things with names made of content",
  title: "What is a save actually made of?",
  intro: [
    "You have a blob holding your bytes and a tree holding your file name. Neither one says who saved this, or when, or what the work looked like before. A third kind of object carries all of that, and it is smaller than you would guess - five short lines of text. Opened up, those five lines carry the whole shape of git history."
  ],
  blurb: "The commit object, opened and read line by line. Five lines of plain text - a tree, an author, a time, a message - and one of them is what turns separate saves into a history.",
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
        "id": "gt-commit-object"
      }
    ],
    "revisits": [
      {
        "id": "gt-tree"
      },
      {
        "id": "gt-content-address"
      }
    ],
    "uses": []
  },
};
