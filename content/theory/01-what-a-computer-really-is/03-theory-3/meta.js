window.LESSON_META = {
  id: "theory-3",
  key: "theory_3_awarded",
  total: 1,
  docTitle: "What starts a program",
  eyebrow: "Theory · Part one · What a computer really is",
  title: "What starts a program",
  intro: [
    "A program runs one instruction at a time - but who presses go? Nothing starts itself. Before your code can run, something has to load it into memory and decide where the very first instruction is. Step through below to see what gets a program off the ground."
  ],
  blurb: "What gets a program going: the operating system loads it into memory and starts it at its entry point - usually a function called Main - where your instructions begin.",
  links: [{ href: "index.html", label: "Back to the course" }],
  pill: "gentle",
  time: "20 min",
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
        "id": "th-operating-system"
      },
      {
        "id": "th-loader"
      },
      {
        "id": "th-entry-point"
      },
      {
        "id": "th-main"
      }
    ],
    "revisits": [
      {
        "id": "th-ram"
      }
    ],
    "uses": [
      {
        "id": "th-program"
      },
      {
        "id": "th-cpu"
      }
    ]
  },
};
