window.LESSON_META = {
  id: "dependency-injection",
  key: "dependency_injection_awarded",
  total: 5,
  docTitle: "Why inject?",
  eyebrow: "Part four · Build with objects",
  title: "Why inject?",
  intro: [
    "Why hand a class the things it needs, instead of letting it build them itself? Building them on the spot is the obvious move, and it works at first. But it ties the class to those exact choices and makes it hard to test on its own. Here you'll see how handing dependencies in keeps a class flexible - and easy to try out with a stand-in."
  ],
  blurb: "Why hand dependencies in instead of newing them everywhere? Feel the moment a hardwired animal bites, then inject one - and hand in a toy stand-in to rehearse with no real animal.",
  links: [{ href: "index.html", label: "Back to the course" }],
  pill: "steady",
  time: "30 min",
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
        "id": "pr-dependency-injection",
        "term": "Dependency injection",
        "def": "Handing a class the collaborators it needs from outside, usually through its constructor, instead of building them itself."
      }
    ],
    "revisits": [
      {
        "id": "pr-program-to-interface"
      },
      {
        "id": "pr-composition"
      },
      {
        "id": "pr-constructor"
      }
    ],
    "uses": [
      {
        "id": "pr-object"
      },
      {
        "id": "pr-interface"
      }
    ]
  },
};
