window.LESSON_META = {
  id: "theory-17",
  key: "theory_17_awarded",
  total: 1,
  docTitle: "The build-and-run cycle",
  eyebrow: "Theory · Part three · How software runs and connects",
  title: "The build-and-run cycle",
  intro: [
    "How the text you write becomes a running program: source code, the compiler, the .NET runtime, and the two kinds of error. Step through the visual to watch a build turn into a run."
  ],
  blurb: "How your written code becomes a running program: the compiler, the .NET runtime, compile-time versus run-time errors, and the write-build-run loop.",
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
        "id": "th-compile-time",
        "term": "Compile time",
        "def": "The phase before a program runs, when the compiler translates the source and checks the rules."
      },
      {
        "id": "th-run-time",
        "term": "Run time",
        "def": "The phase when the built program actually executes, one instruction at a time."
      },
      {
        "id": "th-build-error",
        "term": "Build error",
        "def": "A rule-breaking mistake the compiler catches at compile time, before anything runs."
      },
      {
        "id": "th-runtime-platform",
        "term": ".NET runtime",
        "def": "A platform that finishes and runs a portable build on each machine, like .NET."
      },
      {
        "id": "th-cross-compile",
        "term": "Cross-compile",
        "def": "Building on one machine but aiming the compiler at a different target - another CPU or operating system."
      }
    ],
    "revisits": [
      {
        "id": "th-compiler"
      },
      {
        "id": "th-machine-code"
      }
    ],
    "uses": [
      {
        "id": "th-syntax"
      },
      {
        "id": "th-ram"
      }
    ]
  },
};
