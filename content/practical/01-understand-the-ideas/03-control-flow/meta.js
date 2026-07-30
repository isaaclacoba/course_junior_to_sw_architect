window.LESSON_META = {
  id: "control-flow",
  key: "control_flow_awarded",
  total: 6,
  docTitle: "Control Flow",
  eyebrow: "Part one · Understand the ideas",
  title: "Control Flow",
  intro: [
    "How code decides and repeats. Each of these six builds takes one control-flow tool - if/else, boolean logic, while, for, foreach with break/continue, switch - and asks for a small working method. The pattern is shown above each card; you fill in the body and run it."
  ],
  blurb: "How code decides and repeats. Write a small working method for each tool: if/else, boolean logic, while, for, foreach with break/continue, and switch - then run it.",
  links: [{ href: "index.html", label: "Back to the course" }],
  pill: "steady",
  time: "30 min",
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
        "id": "pr-conditional",
        "term": "if / else",
        "def": "Choosing exactly one branch to run by testing conditions, top to bottom."
      },
      {
        "id": "pr-boolean-logic",
        "term": "Boolean logic",
        "def": "Combining yes/no answers with && (both), || (either), and ! (flip)."
      },
      {
        "id": "pr-loop",
        "term": "Loop",
        "def": "Repeating a block of code - with while, for, or foreach - and steering it with break and continue."
      },
      {
        "id": "pr-switch",
        "term": "switch",
        "def": "Mapping one value to many cases, each ending in break, with default catching the rest."
      }
    ],
    "revisits": [
      {
        "id": "pr-comparison"
      }
    ],
    "uses": [
      {
        "id": "pr-variable"
      },
      {
        "id": "pr-printing"
      }
    ]
  },
};
