window.LESSON_META = {
  id: "testing-basics",
  key: "testing_basics_awarded",
  total: 4,
  docTitle: "What a test is",
  eyebrow: "Part five · Prove it works",
  title: "What a test is",
  intro: [
    "You just handed a keeper a toy stand-in instead of a real animal. That is half of testing - now let's do the other half and actually check the result. A test is nothing fancy: it is ordinary code that runs your code and asks 'did it do the right thing?'. Here you'll write your first tests - arrange, act, assert - and see why they are the safety net that lets you change code without fear."
  ],
  blurb: "A test is just code that runs your code and checks the result. Write your first ones - arrange, act, assert - including one that expects a failure on purpose.",
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
        "id": "pr-unit-test",
        "term": "Unit test",
        "def": "Code that runs your code and checks the result, laid out as arrange, act, assert."
      },
      {
        "id": "pr-assertion",
        "term": "Assertion",
        "def": "A check that a real result matches what you expected, failing the test when it does not."
      },
      {
        "id": "pr-expected-exception",
        "term": "Expecting a failure",
        "def": "Writing a test that passes only when the code throws, to prove it fails on purpose."
      }
    ],
    "revisits": [
      {
        "id": "pr-method"
      }
    ],
    "uses": [
      {
        "id": "pr-exception-handling"
      },
      {
        "id": "pr-object"
      }
    ]
  },
};
