window.LESSON_META = {
  id: "practice-the-basics",
  key: "level1_coding_awarded",
  total: 4,
  docTitle: "Practice the Basics",
  eyebrow: "Part one · Understand the ideas",
  title: "Practice the Basics",
  intro: [
    "Foundations gave you values, variables and objects. Here you put them to work: compute with numbers, join text, and - the step toward Control Flow - ask yes/no questions with comparisons that give back a bool. Write and run each one."
  ],
  blurb: "Put the Foundations to work: compute with numbers, join text, and ask yes/no questions with comparisons - the bridge into Control Flow. Write and run each one.",
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
        "id": "pr-arithmetic",
        "term": "Arithmetic",
        "def": "Computing a new value from existing ones with + - * /."
      },
      {
        "id": "pr-string-concatenation",
        "term": "String concatenation",
        "def": "Joining pieces of text (and numbers turned to text) end to end with +."
      },
      {
        "id": "pr-comparison",
        "term": "Comparison",
        "def": "Asking a yes/no question with == != > < >= <= and getting back a bool."
      }
    ],
    "revisits": [
      {
        "id": "pr-variable"
      },
      {
        "id": "pr-datatype"
      }
    ],
    "uses": [
      {
        "id": "pr-printing"
      },
      {
        "id": "pr-object"
      }
    ]
  },
};
