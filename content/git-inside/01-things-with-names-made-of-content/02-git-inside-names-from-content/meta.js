window.LESSON_META = {
  id: "git-inside-names-from-content",
  key: "git_inside_names_from_content_awarded",
  total: 1,
  docTitle: "Why does git name things by their contents?",
  eyebrow: "Inside git · Part one · Things with names made of content",
  title: "Why does git name things by their contents?",
  intro: [
    "The moment you save something, a file appears inside `.git/objects/` with a name you did not choose: forty characters of hex. It is not random, and it is not a counter. Git worked it out from the bytes you saved - the same bytes always give the same forty characters, on any machine, forever. That one rule is what the rest of git is built on, and you can check it yourself in a terminal."
  ],
  blurb: "Forty characters of hex, worked out from the bytes themselves. See where that name comes from, why two identical files are one object, and what happens to the name when you change a single letter.",
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
        "id": "gt-content-address"
      }
    ],
    "revisits": [
      {
        "id": "gt-git-folder"
      }
    ],
    "uses": []
  },
};
