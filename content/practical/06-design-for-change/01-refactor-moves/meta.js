window.LESSON_META = {
  id: "refactor-moves",
  key: "refactor_moves_awarded",
  total: 5,
  docTitle: "Refactor moves",
  eyebrow: "Part six · Design for change",
  title: "Refactor moves",
  intro: [
    "When code already works, why change it? Because the next person to read it - often you, a month later - still has to understand it. Reshaping code without changing what it does is called refactoring. Here you make one small improvement to each of five programs. The output never changes - only the shape does."
  ],
  blurb: "Change the shape of working code without changing what it does. Five small refactors - move behaviour to its data, depend on an interface, inject a dependency, replace a branch, split a class - each one a habit SOLID is about to name.",
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
        "id": "pr-refactoring"
      }
    ],
    "revisits": [
      {
        "id": "pr-encapsulation"
      },
      {
        "id": "pr-program-to-interface"
      },
      {
        "id": "pr-dependency-injection"
      },
      {
        "id": "pr-polymorphism"
      },
      {
        "id": "pr-single-responsibility"
      }
    ],
    "uses": []
  },
};
