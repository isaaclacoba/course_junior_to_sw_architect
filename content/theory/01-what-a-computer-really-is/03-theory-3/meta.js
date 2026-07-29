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
  concepts: {
    "introduces": [
      {
        "id": "th-operating-system",
        "term": "Operating system",
        "def": "The program in charge of the machine - it launches your program and manages it while it runs."
      },
      {
        "id": "th-loader",
        "term": "Loader",
        "def": "The part of the operating system that copies a program from storage into memory so it can run."
      },
      {
        "id": "th-entry-point",
        "term": "Entry point",
        "def": "The place where a program starts running - the first instruction the operating system hands to the CPU."
      },
      {
        "id": "th-main",
        "term": "Main",
        "def": "The routine a program starts from, usually named Main."
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
