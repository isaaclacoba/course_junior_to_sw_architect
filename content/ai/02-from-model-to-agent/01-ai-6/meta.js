window.LESSON_META = {
  id: "ai-6",
  key: "ai_6_awarded",
  total: 1,
  docTitle: "Memory",
  eyebrow: "Theory · Part six · From model to agent",
  title: "Memory",
  intro: [
    "Start a new chat and the model remembers nothing - each call begins fresh, reading only the context in front of it. So how does an assistant seem to remember you across a long conversation? It saves what matters to a store that outlives the turn, and recalls it when it counts. And that store is not one box: real memory splits into kinds - what happened, what stays true, and how to do things. Here you'll watch a fact get saved, sorted into the right kind, and pulled back just when it's needed."
  ],
  blurb: "The window forgets, so how does an assistant remember? It saves what matters to a store outside the window, recalls it when needed - and sorts it into kinds: what happened, what stays true, and how to do things.",
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
        "id": "ai-memory",
        "term": "Memory",
        "def": "Saving what matters to a store outside the context window and recalling it when needed, so an assistant can remember across turns even though each model call starts fresh."
      },
      {
        "id": "ai-working-memory",
        "term": "Working memory",
        "def": "The context the model reads right now - the scratchpad for the task in hand, and the first thing to vanish as the chat rolls on."
      },
      {
        "id": "ai-episodic-memory",
        "term": "Episodic memory",
        "def": "The store of what happened before - past turns and events, each tied to a time, like the assistant's diary."
      },
      {
        "id": "ai-semantic-memory",
        "term": "Semantic memory",
        "def": "The store of what stays true with no date attached - facts about the world or about you."
      },
      {
        "id": "ai-procedural-memory",
        "term": "Procedural memory",
        "def": "The store of how to do things - the routines and steps the assistant follows to act."
      }
    ],
    "revisits": [],
    "uses": [
      {
        "id": "ai-context"
      },
      {
        "id": "ai-context-window"
      }
    ]
  },
};
