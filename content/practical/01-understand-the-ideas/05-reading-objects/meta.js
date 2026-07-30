window.LESSON_META = {
  id: "reading-objects",
  key: "reading_objects_awarded",
  total: 6,
  docTitle: "Reading Objects",
  eyebrow: "Part one · Understand the ideas",
  title: "Reading Objects",
  intro: [
    "A gentle step up from single-token drills. Write a few small objects that work together - one asks another for what it needs, one job lives in one place, and a class uses what is handed to it. No new theory - just the habits the SOLID drills will lean on."
  ],
  blurb: "Write a few small objects that work together - one asks another for data, one job lives in one place, and a class uses what is handed to it.",
  links: [{ href: "index.html", label: "Back to the course" }],
  pill: "gentle",
  time: "25 min",
  archetype: "build",
  engine: "build",
  resources: {
    base: "res/strings",
    lang: "en",
    langs: ["en", "es"],
    voices: ["default", "child", "academic"],
  },
  concepts: {
    "introduces": [
      {
        "id": "pr-collaboration",
        "term": "Object collaboration",
        "def": "One object getting work done by asking another and acting on the answer."
      },
      {
        "id": "pr-delegation",
        "term": "Delegation",
        "def": "Forwarding a job to a held object instead of doing it yourself."
      },
      {
        "id": "pr-single-responsibility",
        "term": "One job",
        "def": "A method or class doing exactly one thing, so it has a single reason to change."
      },
      {
        "id": "pr-constructor",
        "term": "Constructor",
        "def": "The special method that runs when an object is created, used to set up its starting state."
      }
    ],
    "revisits": [
      {
        "id": "pr-method"
      },
      {
        "id": "pr-object"
      }
    ],
    "uses": [
      {
        "id": "pr-conditional"
      },
      {
        "id": "pr-parameter"
      }
    ]
  },
};
