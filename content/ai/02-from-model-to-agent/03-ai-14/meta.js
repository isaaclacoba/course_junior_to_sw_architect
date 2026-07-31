window.LESSON_META = {
  id: "ai-14",
  key: "ai_14_awarded",
  total: 1,
  docTitle: "Retrieval",
  eyebrow: "Theory · Part six · From model to agent",
  title: "Retrieval",
  intro: [
    "The model only knows what it saw in training - it has never read your company's docs, and it cannot recall a page it skimmed once. So how does it answer questions about text it was never trained on? You hand it the text to read at the moment of the question - but a whole library will not fit in the context. Retrieval is the trick: turn the question into a search, pull back just the few passages that fit, and let the model answer from those. You'll watch a question become a vector, find its closest chunks, and ground an answer in real text instead of a guess."
  ],
  blurb: "A model's knowledge is frozen at training time and its window is small. Retrieval turns a question into a vector, finds the closest chunks of your own documents, and answers grounded in them - the idea behind RAG.",
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
        "id": "ai-retrieval"
      },
      {
        "id": "ai-chunk"
      },
      {
        "id": "ai-embedding"
      },
      {
        "id": "ai-vector"
      },
      {
        "id": "ai-similarity-search"
      },
      {
        "id": "ai-rag"
      }
    ],
    "revisits": [
      {
        "id": "ai-semantic-memory"
      }
    ],
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
