window.LESSON_META = {
  id: "theory-4",
  key: "theory_4_awarded",
  total: 1,
  docTitle: "Running many programs at once",
  eyebrow: "Theory · Part one · What a computer really is",
  title: "Running many programs at once",
  intro: [
    "A CPU core does one instruction at a time, yet you keep a browser, music, and a chat app running together. They are not quite running at once - the operating system switches between them faster than you notice, sharing the one core around. Step through below and watch two programs share a single computer."
  ],
  blurb: "One CPU core does one thing at a time - so how do dozens of apps run together? Processes, fast switching, the scheduler, cores, and why one crash stays contained.",
  links: [{ href: "index.html", label: "Back to the course" }],
  pill: "gentle",
  time: "20 min",
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
        "id": "th-process"
      },
      {
        "id": "th-core"
      },
      {
        "id": "th-time-sharing"
      },
      {
        "id": "th-scheduler"
      },
      {
        "id": "th-parallelism"
      },
      {
        "id": "th-isolation"
      }
    ],
    "revisits": [
      {
        "id": "th-cpu"
      },
      {
        "id": "th-operating-system"
      }
    ],
    "uses": [
      {
        "id": "th-ram"
      },
      {
        "id": "th-program"
      }
    ]
  },
};
