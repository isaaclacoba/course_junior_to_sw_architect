window.LESSON_META = {
  id: "interfaces",
  key: "interfaces_awarded",
  total: 5,
  docTitle: "Why abstract?",
  eyebrow: "Part four · Build with objects",
  title: "Why abstract?",
  intro: [
    "Why hide logic behind an interface, instead of just using the class you already have? At first the extra step looks like a waste. But the moment you need a second kind of thing, code tied to one class gets in the way. Here you'll see how a shared promise lets one piece of code work with many types - even ones you write later."
  ],
  blurb: "Why pull logic behind an interface? Watch a keeper get stuck on one animal, then an interface free it - one method greets every animal, and a new one walks in for free.",
  links: [{ href: "index.html", label: "Back to the course" }],
  pill: "steady",
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
        "id": "pr-interface"
      },
      {
        "id": "pr-program-to-interface"
      }
    ],
    "revisits": [
      {
        "id": "pr-inheritance"
      },
      {
        "id": "pr-abstract-type"
      }
    ],
    "uses": [
      {
        "id": "pr-object"
      },
      {
        "id": "pr-polymorphism"
      },
      {
        "id": "pr-class"
      }
    ]
  },
};
