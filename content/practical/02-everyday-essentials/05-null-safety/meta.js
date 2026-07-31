window.LESSON_META = {
  id: "null-safety",
  key: "null_safety_awarded",
  total: 4,
  docTitle: "Null-safety",
  eyebrow: "Part two · Everyday essentials",
  title: "Null-safety",
  intro: [
    "Sooner or later a value is not there - a name nobody filled in, an object that was never built. Ask an absent value to do something and the program crashes. The fix is to plan for the empty case: hand back a default, skip safely, or say plainly that you do not know. You write each move and run it."
  ],
  blurb: "Sooner or later a value is not there - hand back a default, reach through safely, and say \"unknown\" instead of crashing.",
  links: [{ href: "index.html", label: "Back to the course" }],
  pill: "steady",
  time: "20 min",
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
        "id": "pr-null-coalescing"
      },
      {
        "id": "pr-null-conditional"
      },
      {
        "id": "pr-nullable-value-type"
      }
    ],
    "revisits": [
      {
        "id": "pr-null"
      }
    ],
    "uses": [
      {
        "id": "pr-method"
      },
      {
        "id": "pr-object"
      },
      {
        "id": "pr-conditional"
      }
    ]
  },
};
