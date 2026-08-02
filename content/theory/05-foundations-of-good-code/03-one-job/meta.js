window.LESSON_META = {
  id: "one-job",
  key: "one_job_awarded",
  total: 1,
  docTitle: "One function, one job",
  eyebrow: "Theory · Part five · Foundations of good code",
  title: "One function, one job",
  intro: [
    "When a function tries to do three things at once, its name has to go vague and you can never reuse just one part. Step through a function that loads, checks and saves all at once, then watch it split into three small pieces that each do one clear job."
  ],
  blurb: "Why a function that does one thing is easy to name, test and reuse - the everyday seed of the single-responsibility idea.",
  links: [{ href: "index.html", label: "Back to the course" }],
  pill: "gentle",
  time: "12 min",
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
      { "id": "th-single-purpose" }
    ],
    "revisits": [
      { "id": "th-function" },
      { "id": "th-good-name" }
    ],
    "uses": []
  },
};
