window.LESSON_META = {
  id: "encapsulation",
  key: "encapsulation_awarded",
  total: 5,
  docTitle: "Why objects?",
  eyebrow: "Part four · Build with objects",
  title: "Why objects?",
  intro: [
    "Why bother with classes and methods at all - why not put everything in one big Main? It seems simpler at first. But as a program grows, loose data and scattered rules get hard to keep straight. Here you'll see what objects give you: data and the rules around it, kept in one place you can trust."
  ],
  blurb: "Why classes and methods at all, instead of one big Main? Group related data, put the behaviour next to it, hide the inside, guard a rule, then change that rule in one place.",
  links: [{ href: "index.html", label: "Back to the course" }],
  pill: "steady",
  time: "25 min",
  archetype: "build",
  engine: "build",
  concepts: {
    "introduces": [
      {
        "id": "pr-encapsulation",
        "term": "Encapsulation",
        "def": "Grouping related state with the behaviour that uses it and hiding the inside, so callers go through the object."
      },
      {
        "id": "pr-invariant",
        "term": "Invariant",
        "def": "A rule about an object's state that its own methods keep true, so nothing outside can break it."
      }
    ],
    "revisits": [
      {
        "id": "pr-access-modifier"
      },
      {
        "id": "pr-single-responsibility"
      }
    ],
    "uses": [
      {
        "id": "pr-object"
      },
      {
        "id": "pr-method"
      }
    ]
  },
};
