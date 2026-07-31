window.LESSON_META = {
  id: "theory-14",
  key: "theory_14_awarded",
  total: 1,
  docTitle: "Bugs: why programs go wrong",
  eyebrow: "Theory · Part two · From idea to running code",
  title: "Bugs: why programs go wrong",
  intro: [
    "Programs go wrong, and that is normal. This lesson covers what a bug is, syntax errors versus logic errors, what debugging means, and why finding and fixing bugs is most of the job. It closes Part two. Step through the visual to watch a syntax error stop the build and a logic error leave a wrong value behind."
  ],
  blurb: "What a bug is, syntax versus logic errors, and what debugging really is. Closes Part two; Part three goes on to how software runs and connects.",
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
        "id": "th-bug",
        "term": "Bug",
        "def": "A mistake in the code - the computer did what you wrote, not what you meant."
      },
      {
        "id": "th-syntax-error",
        "term": "Syntax error",
        "def": "Code that breaks the language's rules, which the compiler catches before the program runs."
      },
      {
        "id": "th-logic-error",
        "term": "Logic error",
        "def": "Valid code that runs but does the wrong thing, like using minus where you meant plus."
      },
      {
        "id": "th-debugging",
        "term": "Debugging",
        "def": "Stepping through code line by line, watching the values, to find where it goes wrong."
      }
    ],
    "revisits": [
      {
        "id": "th-syntax"
      },
      {
        "id": "th-compiler"
      }
    ],
    "uses": [
      {
        "id": "th-program"
      }
    ]
  },
};
