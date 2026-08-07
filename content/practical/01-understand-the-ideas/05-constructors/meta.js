window.LESSON_META = {
  id: "constructors",
  key: "constructors_awarded",
  total: 5,
  docTitle: "Constructors",
  eyebrow: "Part one · Understand the ideas",
  title: "Constructors",
  intro: [
    "You have written methods that take a value and hand one back. An object needs the same thing at the moment it is born: someone has to say which cat this is. That job belongs to a constructor - the code that runs once, when the object is made, to set up what it starts with. Here you write a few, and watch where the values you pass in actually end up."
  ],
  blurb: "An object has to start somewhere. Write the code that runs when it is made, hand it the values it needs, and see where each one ends up.",
  links: [{ href: "index.html", label: "Back to the course" }],
  pill: "gentle",
  time: "25 min",
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
        "id": "pr-constructor",
        "term": "Constructor",
        "def": "The code that runs once when an object is made, to set up what it starts with. It carries the class's own name and hands nothing back."
      }
    ],
    "revisits": [
      {
        "id": "pr-field"
      },
      {
        "id": "pr-parameter"
      },
      {
        "id": "pr-argument"
      }
    ],
    "uses": [
      {
        "id": "pr-class"
      },
      {
        "id": "pr-object"
      },
      {
        "id": "pr-method"
      },
      {
        "id": "pr-conditional"
      }
    ]
  }
};
