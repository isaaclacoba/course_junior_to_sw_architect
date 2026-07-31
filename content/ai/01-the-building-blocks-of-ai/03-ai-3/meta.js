window.LESSON_META = {
  id: "ai-3",
  key: "ai_3_awarded",
  total: 1,
  docTitle: "The prompt",
  eyebrow: "Theory · Part five · The building blocks of AI",
  title: "The prompt",
  intro: [
    "The model predicts the next token - but where does the first token come from? From you. The prompt is the text you hand the model to start from, and it simply continues it. That makes the prompt your main lever: change the start, change everything that follows."
  ],
  blurb: "The text you hand the model to start from. It simply continues it - so changing the prompt changes everything that follows.",
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
        "id": "ai-prompt"
      }
    ],
    "revisits": [],
    "uses": [
      {
        "id": "ai-llm"
      },
      {
        "id": "ai-next-token-prediction"
      },
      {
        "id": "ai-token"
      }
    ]
  },
};
