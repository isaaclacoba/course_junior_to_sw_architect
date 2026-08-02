window.LESSON_META = {
  id: "keeping-data-safe",
  key: "keeping_data_safe_awarded",
  total: 1,
  docTitle: "Keeping data safe",
  eyebrow: "Theory · Part three · How software runs and connects",
  title: "Keeping data safe",
  intro: [
    "Once a program stores data and talks to other programs, some of that data matters more than the rest - and some of it is secret. Step through three elementary habits that keep it safe: keep secrets secret, check who is allowed to do what, and never trust input from outside."
  ],
  blurb: "Three elementary security habits for a junior: keep secrets out of code and logs, use permissions to control who reads or changes data, and validate input you did not write.",
  links: [{ href: "index.html", label: "Back to the course" }],
  pill: "gentle",
  time: "12 min",
  archetype: "viz",
  engine: null,
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
        "id": "th-secret"
      },
      {
        "id": "th-validation"
      }
    ],
    "revisits": [
      {
        "id": "th-permissions"
      }
    ],
    "uses": [
      {
        "id": "th-file"
      },
      {
        "id": "th-server"
      }
    ]
  },
};
