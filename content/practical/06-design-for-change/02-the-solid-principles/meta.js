window.LESSON_META = {
  id: "the-solid-principles",
  key: "level2_awarded",
  total: 5,
  docTitle: "The SOLID Principles",
  eyebrow: "Part six · Design for change",
  title: "The SOLID Principles",
  intro: [
    "\"Why do we need to follow these overengineering principles?\" It is a fair pushback. The honest answer: none of them are there for their own sake - each one saves you a real headache the day you have to change code that wasn't built to change. Here you meet each rule as a trap first - a shape that looks fine until you have to change it - then you write the fix and run it.",
    {
      "html": "<strong>SOLID</strong> is five habits - S, O, L, I, D - for writing classes that are easy to change without breaking other code. You will not sprinkle them everywhere up front; you learn when each one earns its keep.",
      "class": "subtitle solid-intro"
    }
  ],
  blurb: "Five habits that keep code easy to change. Spot each problem in a real test-automation project, then fix it the right way. The ideas lean on everything before this part.",
  links: [{ href: "index.html", label: "Back to the course" }],
  pill: "challenging",
  time: "35 min",
  archetype: "build",
  engine: "build",
  concepts: {
    "introduces": [
      {
        "id": "pr-open-closed",
        "term": "Open/Closed",
        "def": "Code that is open to new behaviour by adding a type, and closed to editing what already works."
      },
      {
        "id": "pr-liskov-substitution",
        "term": "Liskov Substitution",
        "def": "A subtype must be usable anywhere its base is expected, without breaking the caller's assumptions."
      },
      {
        "id": "pr-interface-segregation",
        "term": "Interface Segregation",
        "def": "Keeping interfaces small and focused, so a type is not forced to implement methods it does not need."
      },
      {
        "id": "pr-dependency-inversion",
        "term": "Dependency Inversion",
        "def": "High-level code depending on an abstraction rather than a concrete detail, so the detail can change freely."
      }
    ],
    "revisits": [
      {
        "id": "pr-single-responsibility"
      },
      {
        "id": "pr-interface"
      },
      {
        "id": "pr-polymorphism"
      },
      {
        "id": "pr-inheritance"
      },
      {
        "id": "pr-dependency-injection"
      }
    ],
    "uses": [
      {
        "id": "pr-composition"
      },
      {
        "id": "pr-object"
      }
    ]
  },
};
