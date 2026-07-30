window.LESSON_META = {
  id: "linq",
  key: "linq_awarded",
  total: 7,
  docTitle: "LINQ",
  eyebrow: "Part three · Know the language",
  title: "LINQ",
  intro: [
    "In the Collections lesson you built lists and looped over them by hand to count or find things. LINQ gives you ready-made tools to ask a question about a list - keep only some items, count them, pull out one field, sort them - in one short line instead of a foreach. Each operator takes a lambda - the short `x => ...` rule you wrote in the Lambdas lesson - so you pick the operator and write the rule. Here you write each query yourself and run it: one operator per task - Where, Count, Any, All, Select, FirstOrDefault and OrderBy."
  ],
  blurb: "Query a collection without writing a loop. Write each query yourself and run it - Where, Count, Any, All, Select, FirstOrDefault and OrderBy, one operator per task.",
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
        "id": "pr-linq",
        "term": "LINQ",
        "def": "Querying a collection without writing a loop, with operators like Where, Any, All, Count and OrderBy."
      },
      {
        "id": "pr-projection",
        "term": "Projection",
        "def": "Turning each item into something else with Select, producing a new sequence of results."
      }
    ],
    "revisits": [
      {
        "id": "pr-lambda"
      }
    ],
    "uses": [
      {
        "id": "pr-list"
      },
      {
        "id": "pr-comparison"
      }
    ]
  },
};
