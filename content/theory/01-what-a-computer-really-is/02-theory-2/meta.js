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
        "id": "th-ram",
        "term": "RAM",
        "def": "The computer's fast working memory, where a program and its data must be before the CPU can run them."
      },
      {
        "id": "th-fetch-execute",
        "term": "Fetch-execute loop",
        "def": "The loop the CPU repeats forever: fetch the next instruction from memory, carry it out, repeat."
      },
      {
        "id": "th-program-counter",
        "term": "Program counter",
        "def": "The CPU's bookmark - it remembers which instruction comes next."
      },
      {
        "id": "th-jump",
        "term": "Jump",
        "def": "An instruction that changes the program counter to a different line instead of the next one, which is how loops and choices work."
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
