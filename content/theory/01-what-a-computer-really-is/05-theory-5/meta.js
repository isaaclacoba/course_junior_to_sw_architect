window.LESSON_META = {
  id: "theory-5",
  key: "theory_5_awarded",
  total: 1,
  docTitle: "How computers store everything as numbers",
  eyebrow: "Theory · Part one · What a computer really is",
  title: "How computers store everything as numbers",
  intro: [
    "Text, photos, music - underneath, a computer stores all of it as numbers, and those numbers are built from the simplest thing of all: an on-or-off bit. Step through the visual to watch a byte flip a single bit, count upward in binary, and come together as eight bits - bits, two states, binary, and the byte."
  ],
  blurb: "Text, photos, music - all of it is numbers underneath. Bits, why computers use just two states, counting in binary, and the byte.",
  links: [{ href: "index.html", label: "Back to the course" }],
  pill: "gentle",
  time: "20 min",
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
        "id": "th-bit",
        "term": "Bit",
        "def": "The smallest piece of information - a single value that is either 0 (off) or 1 (on)."
      },
      {
        "id": "th-binary",
        "term": "Binary",
        "def": "Counting with only 0s and 1s; every number is a pattern of on and off bits."
      },
      {
        "id": "th-byte",
        "term": "Byte",
        "def": "A group of eight bits, enough for 256 different values - the unit memory and file sizes are measured in."
      }
    ],
    "revisits": [],
    "uses": [
      {
        "id": "th-ram"
      },
      {
        "id": "th-data"
      }
    ]
  },
};
