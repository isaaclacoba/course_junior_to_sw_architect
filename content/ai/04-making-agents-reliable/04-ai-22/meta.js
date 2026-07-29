window.LESSON_META = {
  id: "ai-22",
  key: "ai_22_awarded",
  total: 1,
  docTitle: "Hallucination and grounding",
  eyebrow: "Theory · Part eight · Making agents reliable",
  title: "Hallucination and grounding",
  intro: [
    "Ask a model something it does not know and it will often answer anyway - fluently, confidently, and wrong. This is a hallucination: invented detail that reads just like fact. It happens because the model's job is to produce plausible text, not to check whether it is true. The cure is grounding: give it real sources to answer from, and ask it to point to them. You'll watch a confident made-up answer, then the same question grounded in a real document."
  ],
  blurb: "A model answers confidently even when it doesn't know - it predicts plausible text, not verified truth. Grounding fixes it: pull in the real source, answer from it, cite it, and allow \"I don't know\".",
  links: [{ href: "index.html", label: "Back to the course" }],
  pill: "steady",
  time: "16 min",
  archetype: "viz",
  engine: null,
  concepts: {
    "introduces": [
      {
        "id": "ai-hallucination",
        "term": "Hallucination",
        "def": "A confident answer that is invented, because the model predicts plausible text rather than verified truth and fills any gap with something that reads right."
      },
      {
        "id": "ai-grounding",
        "term": "Grounding",
        "def": "Pulling the real source into the context and answering from it - citing it, and allowing \"I don't know\" - so the answer rests on a checkable fact instead of a guess."
      },
      {
        "id": "ai-citation",
        "term": "Citation",
        "def": "Pointing at the exact source a grounded answer came from, so the claim can be traced back and checked."
      }
    ],
    "revisits": [
      {
        "id": "ai-retrieval"
      }
    ],
    "uses": [
      {
        "id": "ai-context"
      },
      {
        "id": "ai-tool"
      }
    ]
  },
};
