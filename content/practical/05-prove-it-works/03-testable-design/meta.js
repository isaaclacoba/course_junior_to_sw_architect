window.LESSON_META = {
  id: "testable-design",
  key: "testable_design_awarded",
  total: 3,
  docTitle: "Testable by design",
  eyebrow: "Part five · Prove it works",
  title: "Testable by design",
  intro: [
    "Some code fights every test you write; other code is a pleasure to check. The difference is not luck - it is design. Code that receives its dependencies, does one job, and hides no state is easy to test. And it turns out those exact habits are what the next part - the SOLID principles - make deliberate. Testing is where 'design for change' stops being an idea and starts being a feeling."
  ],
  blurb: "Some code fights every test; other code is a pleasure to check. The habits that make code testable - inject, one job, no hidden state - are the habits behind SOLID.",
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
        "id": "pr-testability",
        "term": "Testable design",
        "def": "Shaping code so it is easy to check - injected dependencies, one job each, and no hidden state."
      },
      {
        "id": "pr-pure-function",
        "term": "Pure and predictable",
        "def": "Code that depends only on its inputs and keeps no hidden state, so the same call always gives the same result."
      }
    ],
    "revisits": [
      {
        "id": "pr-dependency-injection"
      },
      {
        "id": "pr-single-responsibility"
      }
    ],
    "uses": [
      {
        "id": "pr-unit-test"
      },
      {
        "id": "pr-test-double"
      }
    ]
  },
};
