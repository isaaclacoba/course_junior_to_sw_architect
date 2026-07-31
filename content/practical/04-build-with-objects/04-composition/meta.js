window.LESSON_META = {
  id: "composition",
  key: "composition_awarded",
  total: 5,
  docTitle: "Inherit or compose?",
  eyebrow: "Part four · Build with objects",
  title: "Inherit or compose?",
  intro: [
    "Can't we just inherit everything - even from three classes at once? It feels like the natural way to reuse code, and often it is. But it does not fit every case, and forcing it tends to make code harder to change later. Here you'll see when inheritance is the right tool, and the other way to build one thing out of smaller pieces - so you can pick the right one each time."
  ],
  blurb: "Can't we just inherit everything - even from three classes at once? Meet the is-a lie, C#'s one-parent limit, and composing parts you can swap without disturbing the rest.",
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
        "id": "pr-single-inheritance"
      }
    ],
    "revisits": [
      {
        "id": "pr-composition"
      },
      {
        "id": "pr-inheritance"
      },
      {
        "id": "pr-favour-composition"
      },
      {
        "id": "pr-delegation"
      }
    ],
    "uses": [
      {
        "id": "pr-object"
      },
      {
        "id": "pr-field"
      }
    ]
  },
};
