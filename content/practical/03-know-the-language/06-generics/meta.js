window.LESSON_META = {
  id: "generics",
  key: "generics_awarded",
  total: 4,
  docTitle: "Generics",
  eyebrow: "Part three · Know the language",
  title: "Generics",
  intro: [
    "You have used List<T> - a type that works with any kind of value. Now write your own. Four small programs you build from scratch and run: a Box<T>, a generic method, a Pair<A, B>, and a generic method that returns a generic type. Write the type, run it, match the output."
  ],
  blurb: "You have used List&lt;T&gt; - now write your own. Build a Box&lt;T&gt;, a generic method, and a Pair&lt;A, B&gt; that work with any kind of value.",
  links: [{ href: "index.html", label: "Back to the course" }],
  pill: "steady",
  time: "25 min",
  archetype: "build",
  engine: "build",
  concepts: {
    "introduces": [
      {
        "id": "pr-generics",
        "term": "Generics",
        "def": "Writing a type with a placeholder like Box<T> so it works with any kind of value, decided by the caller."
      },
      {
        "id": "pr-generic-method",
        "term": "Generic method",
        "def": "A single method with a type parameter that works on any type it is given."
      }
    ],
    "revisits": [
      {
        "id": "pr-list"
      }
    ],
    "uses": [
      {
        "id": "pr-array"
      },
      {
        "id": "pr-object"
      },
      {
        "id": "pr-method"
      },
      {
        "id": "pr-class"
      }
    ]
  },
};
