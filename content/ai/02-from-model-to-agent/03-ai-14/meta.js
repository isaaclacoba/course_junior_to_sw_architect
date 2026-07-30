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
        "id": "ai-retrieval",
        "term": "Retrieval",
        "def": "Turning a question into a vector and finding the closest stored chunks to it."
      },
      {
        "id": "ai-chunk",
        "term": "Chunk",
        "def": "A small piece a document is split into so it can be stored, searched, and pulled into the context a few at a time."
      },
      {
        "id": "ai-embedding",
        "term": "Embedding",
        "def": "Turning a piece of text into a list of numbers that captures its meaning - done ahead of time for every stored chunk, and again for each incoming question."
      },
      {
        "id": "ai-vector",
        "term": "Vector",
        "def": "The list of numbers an embedding produces - a point in space whose closeness to another vector reflects how close their meanings are."
      },
      {
        "id": "ai-similarity-search",
        "term": "Similarity search",
        "def": "Scoring stored chunks by how close their vectors sit to the question's vector, so matching is on meaning rather than exact words."
      },
      {
        "id": "ai-rag",
        "term": "Retrieval-augmented generation (RAG)",
        "def": "The whole pattern of retrieving the relevant chunks, putting them into the context, and answering from them, instead of relying on the model's frozen training."
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
