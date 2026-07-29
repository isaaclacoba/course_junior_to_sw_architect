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
  concepts: {
    "introduces": [
      {
        "id": "th-process",
        "term": "Process",
        "def": "A running program, loaded into its own separate patch of memory."
      },
      {
        "id": "th-core",
        "term": "Core",
        "def": "One worker inside the CPU; a single core does one instruction at a time."
      },
      {
        "id": "th-time-sharing",
        "term": "Time-sharing",
        "def": "Giving one core to several processes in turn, switching thousands of times a second so they seem to run at once."
      },
      {
        "id": "th-scheduler",
        "term": "Scheduler",
        "def": "The part of the operating system that decides which process gets the core next."
      },
      {
        "id": "th-parallelism",
        "term": "Parallelism",
        "def": "Running things at the very same instant on more than one core."
      },
      {
        "id": "th-isolation",
        "term": "Isolation",
        "def": "Walling each process off in its own memory so one cannot read or wreck another's, which keeps a crash contained."
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
