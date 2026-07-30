window.LESSON_META = {
  id: "strings",
  key: "strings_awarded",
  total: 4,
  docTitle: "Strings",
  eyebrow: "Part two · Everyday essentials",
  title: "Strings",
  intro: [
    "Text is a value, not just something you print. You can build it from other values, reshape it, ask it questions, and rewrite it - and each move hands back a new piece of text rather than changing the old one. You write each one and run it."
  ],
  blurb: "Build text from parts, change its case, search inside it, and rewrite pieces - the text moves you make every day.",
  links: [{ href: "index.html", label: "Back to the course" }],
  pill: "gentle",
  time: "20 min",
  archetype: "build",
  engine: "build",
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
        "id": "pr-string-interpolation",
        "term": "String interpolation",
        "def": "Dropping values straight into text with $\"...\", so {name} is replaced by that value."
      },
      {
        "id": "pr-string-methods",
        "term": "String operations",
        "def": "Reshaping, searching and transforming text - ToUpper, Contains, Replace - each returning new text and leaving the original unchanged."
      }
    ],
    "revisits": [
      {
        "id": "pr-string-concatenation"
      }
    ],
    "uses": [
      {
        "id": "pr-method"
      },
      {
        "id": "pr-object"
      }
    ]
  },
};
