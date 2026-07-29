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
  concepts: {
    "introduces": [
      {
        "id": "pr-abstract-type",
        "term": "Abstract type",
        "def": "A base that describes a shape its subtypes must fill in and cannot itself be created with new."
      },
      {
        "id": "pr-override",
        "term": "Override",
        "def": "Replacing a base type's virtual behaviour in a subtype, while code holding the base still calls the real object's version."
      },
      {
        "id": "pr-overloading",
        "term": "Overloading",
        "def": "Giving two methods the same name but different parameters, so the compiler picks the right one from the arguments."
      },
      {
        "id": "pr-tostring-override",
        "term": "Custom text form",
        "def": "Overriding ToString so a type decides how it prints, instead of showing its type name."
      },
      {
        "id": "pr-idisposable",
        "term": "Deterministic cleanup",
        "def": "Implementing IDisposable so a using block runs Dispose at a known point, even if something inside fails."
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
