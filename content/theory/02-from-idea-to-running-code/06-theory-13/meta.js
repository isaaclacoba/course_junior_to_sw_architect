window.LESSON_META = {
  id: "theory-13",
  key: "theory_13_awarded",
  total: 1,
  docTitle: "Functions",
  eyebrow: "Theory · Part two · From idea to running code",
  title: "Functions",
  intro: [
    "Copy-pasting the same few lines around a program feels fine until you have to change them in ten places at once. A function is the way out: write the steps once, give them a name, and call it whenever you need them. Step through below to see a call hand over its inputs and hand back a result."
  ],
  blurb: "Bundling steps under a name you can reuse, with inputs and an output - how programs stay organised as they grow.",
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
        "id": "th-function",
        "term": "Function",
        "def": "A named bundle of steps you can call and reuse, with inputs and an output."
      },
      {
        "id": "th-parameter",
        "term": "Parameter",
        "def": "A named input a function receives, which arrives as a local variable when the function is called."
      },
      {
        "id": "th-return-value",
        "term": "Return value",
        "def": "The result a function hands back to whatever called it."
      },
      {
        "id": "th-local-variable",
        "term": "Local variable",
        "def": "A variable that exists only while its function is running."
      }
    ],
    "revisits": [
      {
        "id": "th-variable"
      }
    ],
    "uses": [
      {
        "id": "th-jump"
      }
    ]
  },
};
