window.LESSON_META = {
  id: "ai-13",
  key: "ai_13_awarded",
  total: 1,
  docTitle: "What a run really is: the transcript",
  eyebrow: "Theory · Part six · From model to agent",
  title: "What a run really is: the transcript",
  intro: [
    "Memory, tools, the loop - by now an agent can feel like a mind at work. This lesson pulls the curtain back. Under all of it, a run is one growing list of messages, each tagged with a role and with who actually wrote it. You'll watch that list grow through a real turn and see three things that surprise most people: the model only ever writes text, a tool result is written by your own code, and \"memory\" is just this list being sent again. Once you can see the list, prompts, memory and tools stop being separate tricks - they are all ways of managing it."
  ],
  blurb: "Pull the curtain back. A whole agent run is one growing list of messages - and the model only writes text, your code writes the tool results, and \"memory\" is just re-sending the list.",
  links: [{ href: "index.html", label: "Back to the course" }],
  pill: "steady",
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
        "id": "ai-transcript"
      },
      {
        "id": "ai-message-role"
      }
    ],
    "revisits": [
      {
        "id": "ai-system-message"
      },
      {
        "id": "ai-user-message"
      },
      {
        "id": "ai-tool"
      },
      {
        "id": "ai-memory"
      }
    ],
    "uses": [
      {
        "id": "ai-tool-call"
      },
      {
        "id": "ai-context"
      }
    ]
  },
};
