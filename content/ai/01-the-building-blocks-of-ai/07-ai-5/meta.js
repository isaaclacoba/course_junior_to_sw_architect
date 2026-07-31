window.LESSON_META = {
  id: "ai-5",
  key: "ai_5_awarded",
  total: 1,
  docTitle: "The context window",
  eyebrow: "Theory · Part five · The building blocks of AI",
  title: "The context window",
  intro: [
    "The context a model can read has a hard limit, measured in tokens. When a conversation grows past that budget, the oldest tokens fall off the start and the model can no longer see them. That is why a long chat seems to forget how it began - and why memory has to be added on top."
  ],
  blurb: "That context is finite, measured in tokens. When it fills, the oldest tokens fall off the start - which is why a long chat seems to forget how it began.",
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
        "id": "ai-context-window"
      }
    ],
    "revisits": [],
    "uses": [
      {
        "id": "ai-context"
      },
      {
        "id": "ai-token"
      }
    ]
  },
};
