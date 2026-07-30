window.LESSON_META = {
  id: "access-properties",
  key: "access_properties_awarded",
  total: 4,
  docTitle: "Access and properties",
  eyebrow: "Part two · Everyday essentials",
  title: "Access and properties",
  intro: [
    "A type gets to decide what the outside world can see, and how its state is reached. You keep some parts private, expose others, and hand out values through a property - a controlled get and set - instead of a raw field. You write each shape and run it."
  ],
  blurb: "Keep some parts of a type private, expose others, and hand out state through properties - a controlled get and set - instead of raw fields.",
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
        "id": "pr-access-modifier",
        "term": "Access modifier",
        "def": "A type deciding which of its parts the outside can see, marking them public or private."
      },
      {
        "id": "pr-property",
        "term": "Property",
        "def": "A controlled way to read and change state through a get and set, instead of exposing a raw field."
      },
      {
        "id": "pr-computed-property",
        "term": "Computed property",
        "def": "A property that works its value out each time it is read, with =>, storing nothing of its own."
      }
    ],
    "revisits": [
      {
        "id": "pr-object"
      },
      {
        "id": "pr-readonly"
      }
    ],
    "uses": [
      {
        "id": "pr-method"
      },
      {
        "id": "pr-field"
      }
    ]
  },
};
