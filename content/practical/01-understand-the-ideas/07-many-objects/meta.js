window.LESSON_META = {
  id: "many-objects",
  key: "many_objects_awarded",
  total: 5,
  docTitle: "One class, many objects",
  eyebrow: "Understand the ideas",
  title: "One class, many objects",
  intro: [
    "You have written a class and made an object from it. So how many objects can one class make?",
    "It is easy to read a class as if it were the thing itself - one <code>Cat</code> class, one cat. That reading holds up until the day you need a second cat, and then everything you hardcoded inside the class turns out to be shared by every cat you make.",
    "Here you write the code and watch memory while it runs. Each <code>new</code> puts another object on screen, side by side, each with its own values - which is the difference between the blueprint and the things built from it.",
  ],
  blurb: "Make several objects from one class and watch them appear in memory, each with its own values.",
  links: [{ href: "index.html", label: "Back to the course" }],
  pill: "gentle",
  time: "20 min",
  resources: {
    base: "res/strings",
    lang: "en",
    langs: ["en", "es"],
    voices: ["default"],
  },
  archetype: "lab",
  engine: null,
  concepts: {
    introduces: [
      {
        id: "pr-instance",
        term: "Instance",
        def: "One object made from a class. Several instances of one class each hold their own values."
      }
    ],
    revisits: [
      { id: "pr-object" },
      { id: "pr-class" },
      { id: "pr-parameter" },
      { id: "pr-argument" }
    ],
    uses: [{ id: "pr-variable" }, { id: "pr-assignment" }, { id: "pr-printing" }]
  },
};
