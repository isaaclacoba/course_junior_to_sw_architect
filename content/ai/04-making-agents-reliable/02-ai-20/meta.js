window.LESSON_META = {
  id: "ai-20",
  key: "ai_20_awarded",
  total: 1,
  docTitle: "Guardrails",
  eyebrow: "Theory · Part eight · Making agents reliable",
  title: "Guardrails",
  intro: [
    "An agent that can act in the world can also act badly - delete the wrong thing, spend real money, answer a question it should refuse. Guardrails are the checks you put around it: rules on what goes in, what comes out, and which actions need a human's nod before they happen. They are what make an agent safe enough to let loose. You'll watch a risky request get caught, and a costly action pause for a person to approve."
  ],
  blurb: "A model can be talked out of its own rules. Guardrails live in your code, outside the model: check what comes in, check what the agent tries to do, and keep a human on the risky calls.",
  links: [{ href: "index.html", label: "Back to the course" }],
  pill: "steady",
  time: "16 min",
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
        "id": "ai-guardrail"
      },
      {
        "id": "ai-prompt-injection"
      },
      {
        "id": "ai-human-in-the-loop"
      }
    ],
    "revisits": [
      {
        "id": "ai-agent"
      }
    ],
    "uses": [
      {
        "id": "ai-tool-call"
      },
      {
        "id": "ai-system-message"
      }
    ]
  },
};
