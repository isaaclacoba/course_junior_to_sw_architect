window.LESSON_META = {
  id: "type-conversion",
  key: "type_conversion_awarded",
  total: 4,
  docTitle: "Type conversion & parsing",
  eyebrow: "Part two · Everyday essentials",
  title: "Type conversion &amp; parsing",
  intro: [
    "Data rarely arrives in the type you need - text has to become a number, a number has to become text, a decimal has to lose its fraction. These are the conversions you reach for every day. You write each one and run it."
  ],
  blurb: "Turn text into numbers and back, drop the decimals off a value, and parse safely without crashing - the conversions you reach for every day.",
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
        "id": "pr-parse",
        "term": "Parsing",
        "def": "Reading a value out of text - int.Parse(\"3\") turns the text into the number 3."
      },
      {
        "id": "pr-to-string",
        "term": "ToString",
        "def": "Turning a value into its text form, so a number can be joined into a label or code."
      },
      {
        "id": "pr-cast",
        "term": "Cast and truncation",
        "def": "Converting a value to another type with (int) - casting a double to int drops the fraction rather than rounding."
      },
      {
        "id": "pr-try-parse",
        "term": "TryParse",
        "def": "The safe parse: it returns a bool for success and writes the number through an out parameter instead of crashing on bad text."
      }
    ],
    "revisits": [
      {
        "id": "pr-datatype"
      }
    ],
    "uses": [
      {
        "id": "pr-method"
      },
      {
        "id": "pr-string-concatenation"
      },
      {
        "id": "pr-object"
      }
    ]
  },
};
