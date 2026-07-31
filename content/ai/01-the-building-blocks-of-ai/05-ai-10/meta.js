window.LESSON_META = {
  id: "ai-10",
  key: "ai_10_awarded",
  total: 1,
  docTitle: "Sampling and temperature",
  eyebrow: "Theory · Part five · The building blocks of AI",
  title: "Sampling and temperature",
  intro: [
    "Ask a model the same thing twice and you can get two different answers. That is not a bug - the model picks its next word from a spread of options, and a setting called temperature controls how adventurous that pick is. Low temperature keeps it steady and predictable; high temperature makes it wander. Here you'll see the same prompt land on different words."
  ],
  blurb: "Why the same prompt gives different answers. The model samples its next word from a spread, and temperature decides how boldly - low is steady, high is varied.",
  links: [{ href: "index.html", label: "Back to the course" }],
  pill: "gentle",
  time: "15 min",
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
        "id": "ai-sampling"
      },
      {
        "id": "ai-temperature"
      }
    ],
    "revisits": [],
    "uses": [
      {
        "id": "ai-next-token-prediction"
      },
      {
        "id": "ai-prompt"
      },
      {
        "id": "ai-token"
      }
    ]
  },
};
