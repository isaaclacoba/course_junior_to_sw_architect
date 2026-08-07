window.LESSON_META = {
  id: "reuse-without-regret",
  key: "reuse_without_regret_awarded",
  total: 4,
  docTitle: "Reuse without regret",
  eyebrow: "Part one · Understand the ideas",
  title: "Reuse without regret",
  intro: [
    "Can't you just inherit everything - one class borrowing from another, and that one borrowing again? It often feels like the natural way to reuse code, and sometimes it is. But inheritance is a strong promise, and forcing it where it does not fit tends to make code harder to change later.",
    "Here you build both ways yourself - a type that borrows from a parent, and a type made of smaller parts it holds - meet the reason C# lets a class have only one parent, and see the shared payoff both unlock. So you can pick the right one each time."
  ],
  blurb: "Build the two ways to reuse code yourself - inherit from a parent, or hold smaller parts - meet the diamond problem, and see why we lean on composition.",
  links: [{ href: "index.html", label: "Back to the course" }],
  pill: "gentle",
  time: "25 min",
  archetype: "build",
  engine: "build",
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
        "id": "pr-inheritance"
      },
      {
        "id": "pr-composition"
      },
      {
        "id": "pr-polymorphism"
      },
      {
        "id": "pr-favour-composition"
      }
    ],
    "revisits": [
      {
        "id": "pr-delegation"
      }
    ],
    "uses": [
      {
        "id": "pr-object"
      },
      {
        "id": "pr-method"
      }
    ]
  },
};
