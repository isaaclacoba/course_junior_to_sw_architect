window.LESSON_META = {
  id: "foundations",
  key: "foundations_awarded",
  total: 6,
  docTitle: "Foundations",
  eyebrow: "Part one · Understand the ideas",
  title: "Foundations",
  intro: [
    "Before objects and design, the basics you build everything from. In six short steps you write and run real C#: printing, variables, the common datatypes, changing a value, what null means, and finally what an object is - state and behaviour bundled together."
  ],
  blurb: "Start here. Write and run your first C#: printing, variables, the common datatypes, changing a value, what null means, and what an object is.",
  links: [{ href: "index.html", label: "Back to the course" }],
  pill: "gentle",
  time: "20 min",
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
        "id": "pr-printing",
        "term": "Printing",
        "def": "Showing output a line at a time with Console.WriteLine, so you can see what your program did."
      },
      {
        "id": "pr-variable",
        "term": "Variable",
        "def": "A named box that holds a value you can read back and change later."
      },
      {
        "id": "pr-datatype",
        "term": "Datatype",
        "def": "The kind of a value - int, double, bool, char, string and the like - which sets what you can do with it."
      },
      {
        "id": "pr-assignment",
        "term": "Assignment",
        "def": "Storing a value in a variable with =, read as \"store\" rather than \"equals\"."
      },
      {
        "id": "pr-null",
        "term": "null",
        "def": "A special value meaning \"nothing here yet\" - a type written with a ? is allowed to hold it."
      },
      {
        "id": "pr-object",
        "term": "Object",
        "def": "One thing built from a class with new that bundles state (what it knows) with behaviour (what it does)."
      },
      {
        "id": "pr-class",
        "term": "Class",
        "def": "The blueprint an object is made from - it names the object's data and what it can do."
      }
    ],
    "revisits": [],
    "uses": []
  },
};
