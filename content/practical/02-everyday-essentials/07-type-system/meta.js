window.LESSON_META = {
  id: "type-system",
  key: "type_system_awarded",
  total: 5,
  docTitle: "Abstract types and overriding",
  eyebrow: "Part two · Everyday essentials",
  title: "Abstract types and overriding",
  intro: [
    "A type does not have to be a plain bag of data. It can describe a shape it refuses to build itself, replace a behaviour it inherited, answer to one name for different inputs, choose how it prints, and clean up after itself at a known point. You write each of these and run it."
  ],
  blurb: "An abstract base you cannot create, replacing behaviour with override, one name for different inputs, a type's own text form, and cleaning up at a known point.",
  links: [{ href: "index.html", label: "Back to the course" }],
  pill: "challenging",
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
        "id": "pr-abstract-type"
      },
      {
        "id": "pr-override"
      },
      {
        "id": "pr-overloading"
      },
      {
        "id": "pr-tostring-override"
      },
      {
        "id": "pr-idisposable"
      }
    ],
    "revisits": [
      {
        "id": "pr-inheritance"
      },
      {
        "id": "pr-polymorphism"
      }
    ],
    "uses": [
      {
        "id": "pr-object"
      },
      {
        "id": "pr-method"
      },
      {
        "id": "pr-class"
      }
    ]
  },
};
