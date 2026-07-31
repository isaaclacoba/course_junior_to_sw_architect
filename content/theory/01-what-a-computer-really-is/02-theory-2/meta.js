window.LESSON_META = {
  id: "theory-2",
  key: "theory_2_awarded",
  total: 1,
  docTitle: "How a program runs",
  eyebrow: "Theory · Part one · What a computer really is",
  title: "How a program runs",
  intro: [
    "A program sitting in storage does nothing - it is just a file waiting. Running it is a separate act: the machine copies it into memory, then works through it one instruction at a time, keeping its place as it goes. Step through the run below and watch that happen."
  ],
  blurb: "What happens when you run a program: it is loaded into memory, the CPU repeats the fetch-and-execute loop, keeps its place, and sometimes jumps elsewhere.",
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
        "id": "th-ram"
      },
      {
        "id": "th-fetch-execute"
      },
      {
        "id": "th-program-counter"
      },
      {
        "id": "th-jump"
      }
    ],
    "revisits": [
      {
        "id": "th-program"
      },
      {
        "id": "th-cpu"
      }
    ],
    "uses": [
      {
        "id": "th-data"
      },
      {
        "id": "th-instruction"
      }
    ]
  },
};
