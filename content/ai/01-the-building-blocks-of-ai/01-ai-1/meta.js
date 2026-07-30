window.LESSON_META = {
  id: "ai-1",
  key: "ai_1_awarded",
  total: 1,
  docTitle: "What is an LLM?",
  eyebrow: "Theory · Part five · The building blocks of AI",
  title: "What is an LLM?",
  intro: [
    "You have probably used one already - it writes, answers and explains in plain language. It can feel like it understands you. Underneath, though, it is doing something much simpler and stranger: reading the text so far and guessing the next small piece, over and over. Watch that one move below - it is the foundation everything else in this track is built on."
  ],
  blurb: "The one move at the heart of it all: a model that reads some text and predicts the next token, over and over. Watch it pick from the candidates and continue.",
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
        "id": "ai-llm",
        "term": "Large language model",
        "def": "A model that reads the text so far and predicts the next token, over and over."
      },
      {
        "id": "ai-next-token-prediction",
        "term": "Next-token prediction",
        "def": "For each next slot the model scores every possible token and usually picks the most likely one, then appends it and reads the whole text again."
      }
    ],
    "revisits": [],
    "uses": []
  },
};
