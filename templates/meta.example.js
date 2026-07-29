/*
 * templates/meta.example.js - DORMANT Phase-0 scaffolding. This is a SAMPLE, not
 * a live file. It documents the per-lesson metadata schema so future authors and
 * tooling agree on one shape. Nothing loads it; it has zero runtime impact.
 *
 * A real lesson would ship its own meta.js next to its generated index.html, at
 * content/<track>/<NN-part>/<NN-lesson>/meta.js, setting window.LESSON_META.
 *
 * CONCEPT OWNERSHIP RULE (course-wide invariant):
 *   - A concept is INTRODUCED by exactly one lesson course-wide. That lesson OWNS
 *     the concept's canonical `def` (its one authoritative definition).
 *   - Every other lesson that touches the concept lists it under `revisits` (it
 *     was taught earlier and is being reinforced) or `uses` (it is relied on but
 *     not the focus), referencing it by `id` only - never re-defining it.
 *   - So `introduces[].def` is the single source of truth for a term; `revisits`
 *     and `uses` are id-only pointers back to the owning lesson.
 *
 * The values below are a realistic, faithful EXAMPLE built from the actual
 * "type-conversion" lesson (a "build" archetype). Treat concept ids/defs as
 * illustrative - the real concept ledger is authored separately.
 */
window.LESSON_META = {
  // Stable identity: the flat basename (href minus ".html"). This does NOT change
  // when the lesson later moves into content/<track>/<NN-part>/<NN-lesson>/.
  id: "type-conversion",

  // The localStorage key the engines write when this lesson's XP is earned.
  // Matches the manifest's `key` for this lesson.
  key: "type_conversion_awarded",

  // Number of XP-awarding cards. Matches the manifest's `total`. Excludes any
  // non-graded recap/summary card.
  total: 4,

  // Text for the document <title>.
  docTitle: "Type conversion & parsing",

  // Hero eyebrow line (track / part context).
  eyebrow: "Part two \u00b7 Everyday essentials",

  // Hero title.
  title: "Type conversion & parsing",

  // Hero intro. An array whose items are either a plain string (a paragraph) or
  // an object { html, class } for a paragraph that needs inline markup and/or a
  // CSS class. Mirrors the shape page-shell already renders from window.PAGE.
  intro: [
    "Data rarely arrives in the type you need - text has to become a number, a number has to become text, a decimal has to lose its fraction. These are the conversions you reach for every day. You write each one and run it.",
    // Example of the object form (optional):
    // { html: "Parsing that can fail uses <code>TryParse</code>.", class: "note" },
  ],

  // Short one/two-sentence card blurb (as used on the index card).
  blurb: "Turn text into numbers and back, drop the decimals off a value, and parse safely without crashing - the conversions you reach for every day.",

  // Navigation links shown in the hero. Default is a single "back" link.
  links: [{ href: "index.html", label: "Back to the course" }],

  // Difficulty pill: "gentle" | "steady" | "challenging".
  pill: "gentle",

  // Estimated time, as shown on the card.
  time: "20 min",

  // Which template variant renders this lesson:
  // "build" | "drill" | "viz" | "checkpoint" | "external".
  archetype: "build",

  // Which engine drives it: "build" | "drill" | null (viz/checkpoint/external
  // have no write-and-run or fill-blank engine).
  engine: "build",

  // Concept graph for this lesson. See the ownership rule at the top of the file.
  concepts: {
    // Concepts this lesson OWNS. Each carries the canonical `def`. A term appears
    // in exactly one lesson's `introduces` across the whole course.
    introduces: [
      { id: "type-conversion", term: "Type conversion", def: "Producing a value of one type from a value of another, e.g. turning text into a number or a number into text." },
      { id: "parsing", term: "Parsing", def: "Reading a value out of text - e.g. int.Parse turns \"42\" into the number 42, throwing if the text is not a valid number." },
      { id: "try-parse", term: "TryParse", def: "The safe parse: it returns true/false for success and writes the result through an out parameter instead of throwing on bad input." },
      { id: "truncation", term: "Truncation", def: "Dropping the fractional part of a number when converting to an integer, rather than rounding." },
    ],

    // Concepts taught in an EARLIER lesson and reinforced here. Id-only pointers.
    revisits: [
      { id: "variable" },
      { id: "datatype" },
    ],

    // Concepts relied on but not the focus. Id-only pointers.
    uses: [
      { id: "string" },
      { id: "int" },
      { id: "console-write" },
    ],
  },
};
