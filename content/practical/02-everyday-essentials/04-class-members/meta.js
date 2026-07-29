window.LESSON_META = {
  id: "class-members",
  key: "class_members_awarded",
  total: 4,
  docTitle: "Static, const, and readonly",
  eyebrow: "Part two · Everyday essentials",
  title: "Static, const, and readonly",
  intro: [
    "Not every value belongs to a single object. Some behaviour lives on the type itself, some values are fixed the moment you write them, and some are set once when an object is built and then never change. You write each kind and run it."
  ],
  blurb: "Some behaviour and data belong to the type itself, and some values are fixed for good - write a static helper, a constant, a set-once field, and a shared counter.",
  links: [{ href: "index.html", label: "Back to the course" }],
  pill: "steady",
  time: "20 min",
  archetype: "build",
  engine: "build",
  concepts: {
    "introduces": [
      {
        "id": "pr-static",
        "term": "static",
        "def": "Behaviour or data that belongs to the type itself rather than to any one object, so it is shared and needs no instance."
      },
      {
        "id": "pr-const",
        "term": "const",
        "def": "A named value fixed where you write it and never changed, so a bare number gets a clear name."
      },
      {
        "id": "pr-readonly",
        "term": "readonly",
        "def": "A field that can be set once - at its declaration or in the constructor - and never reassigned."
      },
      {
        "id": "pr-field",
        "term": "Field",
        "def": "A variable that belongs to an object and holds part of its state."
      }
    ],
    "revisits": [
      {
        "id": "pr-constructor"
      }
    ],
    "uses": [
      {
        "id": "pr-method"
      },
      {
        "id": "pr-object"
      },
      {
        "id": "pr-arithmetic"
      },
      {
        "id": "pr-class"
      }
    ]
  },
};
