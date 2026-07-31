window.LESSON_META = {
  id: "test-doubles",
  key: "test_doubles_awarded",
  total: 3,
  docTitle: "Test doubles",
  eyebrow: "Part five · Prove it works",
  title: "Test doubles",
  intro: [
    "How do you test code that depends on a clock, a random number, or the network - things that change every run or reach outside your program? You hand it a stand-in you control. This is what dependency injection was building towards: because a class receives its dependencies instead of creating them, a test can pass in a fake, a stub, or a spy."
  ],
  blurb: "Test code that leans on a clock, a random number, or the network by handing it a stand-in you control: a fake, a stub, and a spy.",
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
        "id": "pr-test-double"
      },
      {
        "id": "pr-stub"
      },
      {
        "id": "pr-spy"
      }
    ],
    "revisits": [
      {
        "id": "pr-dependency-injection"
      }
    ],
    "uses": [
      {
        "id": "pr-interface"
      },
      {
        "id": "pr-unit-test"
      }
    ]
  },
};
