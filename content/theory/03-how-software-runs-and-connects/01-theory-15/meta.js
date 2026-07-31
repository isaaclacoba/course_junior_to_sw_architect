window.LESSON_META = {
  id: "theory-15",
  key: "theory_15_awarded",
  total: 1,
  docTitle: "Where data lives",
  eyebrow: "Theory · Part three · How software runs and connects",
  title: "Where data lives",
  intro: [
    "Every value your program touches while it runs has to sit somewhere, and that somewhere is memory. But memory is not one undivided space - it is a few areas, each suited to a different job. Step through below to see where a number, a variable, and an object each end up, and why."
  ],
  blurb: "Where a running program keeps its data: memory as numbered slots, a variable as a slot, and the two areas it uses - the stack and the heap.",
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
        "id": "th-address",
        "term": "Address",
        "def": "The number of a memory slot, which lets the program find that exact slot again."
      },
      {
        "id": "th-stack",
        "term": "Stack",
        "def": "The memory region for the values a function is using right now, where each call adds a frame on top that is removed automatically when the call ends."
      },
      {
        "id": "th-heap",
        "term": "Heap",
        "def": "The memory region for objects that must outlive the call that made them, kept until nothing refers to them."
      },
      {
        "id": "th-garbage-collector",
        "term": "Garbage collector",
        "def": "The part that reclaims heap memory once nothing points to an object any more."
      },
      {
        "id": "th-volatile",
        "term": "Volatile",
        "def": "A property of RAM: it is fast to reach but wiped the moment power drops."
      }
    ],
    "revisits": [
      {
        "id": "th-ram"
      }
    ],
    "uses": [
      {
        "id": "th-variable"
      },
      {
        "id": "th-function"
      }
    ]
  },
};
