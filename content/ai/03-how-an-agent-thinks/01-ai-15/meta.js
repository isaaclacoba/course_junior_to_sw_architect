window.LESSON_META = {
  id: "ai-15",
  key: "ai_15_awarded",
  total: 1,
  docTitle: "Reasoning",
  eyebrow: "Theory · Part seven · How an agent thinks",
  title: "Reasoning",
  intro: [
    "Ask a model a question that needs a few steps of thought - a little arithmetic, a small logic puzzle - and if it blurts the first thing that comes out, it often gets it wrong. The fix is almost funny: tell it to think step by step, and its accuracy jumps. Not because it got smarter, but because writing the steps gives it room to work - each token it writes becomes part of what it reads next. You'll see the same question fail as a snap answer and then succeed when the model reasons out loud first."
  ],
  blurb: "Ask for the answer and a model guesses; ask it to think step by step and it works the problem out. See why writing the reasoning down is the computation, not decoration - chain-of-thought.",
  links: [{ href: "index.html", label: "Back to the course" }],
  pill: "gentle",
  time: "15 min",
  archetype: "viz",
  engine: null,
  concepts: {
    "introduces": [
      {
        "id": "ai-chain-of-thought",
        "term": "Chain of thought",
        "def": "Asking the model to write its reasoning out step by step before answering - the working is the computation, not decoration, because each token it writes lands back in the context it reads next."
      }
    ],
    "revisits": [],
    "uses": [
      {
        "id": "ai-transcript"
      },
      {
        "id": "ai-context"
      },
      {
        "id": "ai-next-token-prediction"
      }
    ]
  },
};
