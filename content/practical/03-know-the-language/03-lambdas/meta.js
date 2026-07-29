window.LESSON_META = {
  id: "lambdas",
  key: "lambdas_awarded",
  total: 4,
  docTitle: "Lambdas",
  eyebrow: "Part three · Know the language",
  title: "Lambdas",
  intro: [
    "A lambda is a tiny function with no name that you write right where you need it and keep in a variable. This is your first look at them: what they are, how they answer a yes/no question, and the one thing they do that a plain method can't - read the variables sitting around them. Next lesson you'll hand these to LINQ. Write each small program, run it, match the output."
  ],
  blurb: "Your first look at lambdas - tiny functions with no name that you keep in a variable. See what they are, how they answer yes/no, and the thing they do that a plain method can't: read the variables around them. The little functions LINQ runs on next.",
  links: [{ href: "index.html", label: "Back to the course" }],
  pill: "steady",
  time: "20 min",
  archetype: "build",
  engine: "build",
  concepts: {
    "introduces": [
      {
        "id": "pr-lambda",
        "term": "Lambda",
        "def": "A tiny function with no name that you can store in a variable and call later."
      },
      {
        "id": "pr-closure",
        "term": "Capture",
        "def": "A lambda reading the variables around it where it was written - something a plain method cannot do."
      }
    ],
    "revisits": [
      {
        "id": "pr-method"
      }
    ],
    "uses": [
      {
        "id": "pr-list"
      },
      {
        "id": "pr-boolean-logic"
      },
      {
        "id": "pr-comparison"
      }
    ]
  },
};
