window.LESSON_META = {
  id: "ai-7",
  key: "ai_7_awarded",
  total: 1,
  docTitle: "Tools",
  eyebrow: "Theory · Part six · From model to agent",
  title: "Tools",
  intro: [
    "A model can write about the weather, but it cannot actually check it - its knowledge froze when training ended, and it has no way to reach outside its own text. Tools change that: the model asks to run a function, something else does the real work, and the answer comes back into its context. You'll watch a question it cannot answer alone become one it can - then see what real tool use adds: reading a tool's schema, choosing the right one from several, and recovering when a call comes back wrong."
  ],
  blurb: "A model can only produce text. Tools let it ask to run a function and read the result back - then reach for the right one of several, call it in the shape its schema asks for, and recover when a call comes back wrong.",
  links: [{ href: "index.html", label: "Back to the course" }],
  pill: "steady",
  time: "18 min",
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
        "id": "ai-tool",
        "term": "Tool",
        "def": "A function the model is allowed to call so it can do something text alone cannot - like check the weather or send a message - and read the result back."
      },
      {
        "id": "ai-tool-schema",
        "term": "Tool schema",
        "def": "The description of a tool - its name and typed parameters - that the model reads to know which tool fits and how to call it."
      },
      {
        "id": "ai-tool-call",
        "term": "Tool call",
        "def": "The structured request the model emits to run a tool: the tool's name plus the arguments it needs, in the shape its schema asks for."
      }
    ],
    "revisits": [],
    "uses": [
      {
        "id": "ai-llm"
      },
      {
        "id": "ai-context"
      }
    ]
  },
};
