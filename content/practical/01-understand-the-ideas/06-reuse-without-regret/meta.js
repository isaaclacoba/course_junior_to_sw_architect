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
        "id": "pr-inheritance",
        "term": "Inheritance",
        "def": "Reuse by claiming kinship - a child class is-a kind of its parent and gets the parent's members for free."
      },
      {
        "id": "pr-composition",
        "term": "Composition",
        "def": "Reuse by holding parts - a class has-a smaller object as a field and asks it to do the work."
      },
      {
        "id": "pr-polymorphism",
        "term": "Polymorphism",
        "def": "One call that adapts to the real object behind it, so the same method name gives many behaviours."
      },
      {
        "id": "pr-favour-composition",
        "term": "Favour composition",
        "def": "Preferring has-a parts over deep inheritance, since inheritance can force a bad fit and multiple parents clash."
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
