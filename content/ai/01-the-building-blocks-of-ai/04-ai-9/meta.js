window.LESSON_META = {
  id: "ai-9",
  key: "ai_9_awarded",
  total: 1,
  docTitle: "System and user messages",
  eyebrow: "Theory · Part five · The building blocks of AI",
  title: "System and user messages",
  intro: [
    "When you chat with an assistant, you write one message - but the model is usually handed two. There is your message, and there is a hidden one the app adds first that tells the model who to be and how to behave. Same question, different hidden message, and you get a very different answer. Here you'll see that lever in action."
  ],
  blurb: "Every prompt really has two parts: your message, and a hidden system message that sets the model's role and rules. Change the system message and the tone changes.",
  links: [{ href: "index.html", label: "Back to the course" }],
  pill: "gentle",
  time: "15 min",
  archetype: "viz",
  engine: null,
  concepts: {
    "introduces": [
      {
        "id": "ai-system-message",
        "term": "System message",
        "def": "A hidden message placed before your turn that sets the model's role and rules - the simplest lever for steering how it answers."
      },
      {
        "id": "ai-user-message",
        "term": "User message",
        "def": "The message you type - your actual question or request, saying what to answer rather than how."
      }
    ],
    "revisits": [],
    "uses": [
      {
        "id": "ai-prompt"
      }
    ]
  },
};
