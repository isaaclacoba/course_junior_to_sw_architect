window.LESSON_META = {
  id: "theory-8",
  key: "theory_8_awarded",
  total: 1,
  docTitle: "What a programming language is",
  eyebrow: "Theory · Part two · From idea to running code",
  title: "What a programming language is",
  intro: [
    "Part one showed how computers run instructions. Now we start writing them. This lesson covers what a programming language is: why we don't write raw CPU instructions, what 'high-level' means, and that many languages target the same one machine. Step through the visual to see it happen."
  ],
  blurb: "Why we don't write raw CPU instructions, what 'high-level' means, the many languages that exist, and what syntax is.",
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
        "id": "th-machine-code",
        "term": "Machine code",
        "def": "The tiny numeric instructions a CPU runs directly - the only language it truly understands."
      },
      {
        "id": "th-programming-language",
        "term": "Programming language",
        "def": "Human-friendly words and rules for writing programs, which a tool then translates for the machine."
      },
      {
        "id": "th-high-level",
        "term": "High-level language",
        "def": "A language close to human ideas rather than raw machine instructions, so one line stands for many CPU steps."
      },
      {
        "id": "th-syntax",
        "term": "Syntax",
        "def": "The exact rules for how code must be written in a language."
      }
    ],
    "revisits": [
      {
        "id": "th-compiler"
      }
    ],
    "uses": [
      {
        "id": "th-cpu"
      }
    ]
  },
};
