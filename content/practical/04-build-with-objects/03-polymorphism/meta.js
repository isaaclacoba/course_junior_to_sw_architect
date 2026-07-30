window.LESSON_META = {
  id: "polymorphism",
  key: "polymorphism_awarded",
  total: 5,
  docTitle: "Why many versions?",
  eyebrow: "Part four · Build with objects",
  title: "Why many versions?",
  intro: [
    "Why write several small classes that do the same kind of job, instead of one method with a branch for each case? The one big method feels tidier - until it grows again every time something new shows up. Here you'll see how letting each type carry its own version keeps that from happening."
  ],
  blurb: "Why several implementations of the same logic instead of one method full of branches? One call the object resolves, one loop over many kinds, and new behaviour by adding a class.",
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
        "id": "pr-runtime-dispatch",
        "term": "Runtime selection",
        "def": "The real object deciding at run time which version of a method runs, so you add a new type instead of another branch."
      }
    ],
    "revisits": [
      {
        "id": "pr-polymorphism"
      },
      {
        "id": "pr-override"
      },
      {
        "id": "pr-inheritance"
      }
    ],
    "uses": [
      {
        "id": "pr-conditional"
      },
      {
        "id": "pr-list"
      }
    ]
  },
};
