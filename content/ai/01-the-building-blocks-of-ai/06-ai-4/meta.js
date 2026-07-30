window.LESSON_META = {
  id: "ai-4",
  key: "ai_4_awarded",
  total: 1,
  docTitle: "Context",
  eyebrow: "Theory · Part five · The building blocks of AI",
  title: "Context",
  intro: [
    "A model only knows what it can read right now. Ask it about something you never told it and it just guesses. Give it a couple of facts first and the same question becomes easy. That readable text - your question plus anything you place before it - is its context. Here you'll see how adding context turns a shaky guess into a clear answer."
  ],
  blurb: "Everything the model can see right now - the prompt, the conversation, any facts you add. Watch a flat guess become a confident answer once the context is there.",
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
        "id": "ai-context",
        "term": "Context",
        "def": "Everything the model can read at this moment - the prompt, the conversation so far, and any facts you add - and the only thing it has to go on."
      }
    ],
    "revisits": [],
    "uses": [
      {
        "id": "ai-prompt"
      },
      {
        "id": "ai-token"
      },
      {
        "id": "ai-llm"
      }
    ]
  },
};
