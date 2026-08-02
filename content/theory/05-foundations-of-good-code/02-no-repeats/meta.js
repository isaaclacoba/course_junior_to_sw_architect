window.LESSON_META = {
  id: "no-repeats",
  key: "no_repeats_awarded",
  total: 1,
  docTitle: "Don't repeat yourself",
  eyebrow: "Theory · Part five · Foundations of good code",
  title: "Don't repeat yourself",
  intro: [
    "Copy-paste feels fast. The trouble comes later: the same logic now lives in two places, and one day you fix a bug in one copy and miss the other. Step through a small duplication and watch it collapse into a single named place that every caller shares."
  ],
  blurb: "Why copied logic is a maintenance trap, and how pulling it into one named function keeps a fix in a single place.",
  links: [{ href: "index.html", label: "Back to the course" }],
  pill: "gentle",
  time: "12 min",
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
      { "id": "th-duplication" }
    ],
    "revisits": [
      { "id": "th-function" },
      { "id": "th-good-name" }
    ],
    "uses": []
  },
};
