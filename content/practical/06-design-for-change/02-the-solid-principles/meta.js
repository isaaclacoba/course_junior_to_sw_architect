window.LESSON_META = {
  id: "the-solid-principles",
  key: "solid_awarded",
  total: 7,
  docTitle: "The SOLID Principles",
  eyebrow: "Part six · Design for change",
  title: "The SOLID Principles",
  intro: [
    "\"Why do we need to follow these overengineering principles?\" It is a fair pushback, and you cannot answer it with a lecture - the cost SOLID avoids only shows up the second time the code has to change. So this lesson does not start with the fix. It starts with a small program that works, asks you to make one ordinary change to it, and lets you find out what that change costs. Then you make the same change again in a better shape, and count the difference.",
    {
      "html": "<strong>SOLID</strong> is five habits - S, O, L, I, D - for writing classes that are easy to change without breaking other code. You will not sprinkle them everywhere up front; you learn when each one earns its keep.",
      "class": "subtitle solid-intro"
    }
  ],
  blurb: "Five habits that keep code easy to change. You write the naive version first, feel what one ordinary change costs, then build the shape that makes it cheap. The ideas lean on everything before this part.",
  links: [{ href: "index.html", label: "Back to the course" }],
  pill: "challenging",
  time: "45 min",
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
        "id": "pr-open-closed"
      },
      {
        "id": "pr-liskov-substitution"
      },
      {
        "id": "pr-interface-segregation"
      },
      {
        "id": "pr-dependency-inversion"
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
