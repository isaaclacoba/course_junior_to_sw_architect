/* Course structure + order - the single source of the course path. */
/*
 * course-registry.js - the source of the course path. Two things live here:
 *
 *   tracks[]  - the track + part CHROME (name, kicker, blurb, partPrefix, part
 *               titles), in display order. The generator derives each part's
 *               "Part one/two/..." kicker from partPrefix + its 1-based position.
 *   lessons[] - every lesson in reading order. Order = array order. Add a lesson =
 *               one line; remove = delete one line.
 *
 * Per-lesson presentational data (title, blurb, pill, time, total, key) lives in
 * each lesson's content/.../meta.js. The one exception is the external capstone
 * (no meta.js): its card fields are inlined on its lessons[] line.
 *
 * `id`   - stable identity: href minus a trailing ".html", or a trailing "/"
 *          dropped ("level3-app/" -> "level3-app").
 * `href` - the served path (content/.../ for a migrated lesson, level3-app/ for
 *          the capstone).
 * `kind` - "lesson", or "external" (the capstone app). The emitted card kind is
 *          "final" when `final` is set, else "lesson".
 * `path` - the content/... directory, or null for the external capstone.
 *
 * Frozen window.CourseRegistry = { tracks, lessons, byId }.
 */
(function (global) {
  var tracks = [
    { id: "practical", name: "Practical", kicker: "Hands on", partPrefix: "Part ", blurb: "Learn C# by writing and running real code, one small win at a time - up to a SOLID capstone.", parts: [
      { id: "understand-the-ideas", title: "Understand the ideas" },
      { id: "everyday-essentials", title: "Everyday essentials" },
      { id: "know-the-language", title: "Know the language" },
      { id: "build-with-objects", title: "Build with objects" },
      { id: "prove-it-works", title: "Prove it works" },
      { id: "design-for-change", title: "Design for change" }
    ] },
    { id: "theory", name: "Theory", kicker: "From zero", partPrefix: "Theory · Part ", blurb: "No background needed. Understand what software is and how a computer actually runs it, from the ground up.", parts: [
      { id: "what-a-computer-really-is", title: "What a computer really is" },
      { id: "from-idea-to-running-code", title: "From idea to running code" },
      { id: "how-software-runs-and-connects", title: "How software runs and connects" },
      { id: "the-development-world", title: "The development world" }
    ] },
    { id: "ai", name: "AI", kicker: "Agents from scratch", partPrefix: "AI · Part ", blurb: "A first look at how large language models and AI agents really work - tokens, context, memory, tools, planning, and keeping an agent reliable.", parts: [
      { id: "the-building-blocks-of-ai", title: "The building blocks of AI" },
      { id: "from-model-to-agent", title: "From model to agent" },
      { id: "how-an-agent-thinks", title: "How an agent thinks" },
      { id: "making-agents-reliable", title: "Making agents reliable" }
    ] }
  ];

  var lessons = [
    // ---- practical / understand-the-ideas ----
    { track: "practical", part: "understand-the-ideas", id: "foundations", href: "content/practical/01-understand-the-ideas/01-foundations/", kind: "lesson", path: "content/practical/01-understand-the-ideas/01-foundations" },
    { track: "practical", part: "understand-the-ideas", id: "practice-the-basics", href: "content/practical/01-understand-the-ideas/02-practice-the-basics/", kind: "lesson", path: "content/practical/01-understand-the-ideas/02-practice-the-basics" },
    { track: "practical", part: "understand-the-ideas", id: "control-flow", href: "content/practical/01-understand-the-ideas/03-control-flow/", kind: "lesson", path: "content/practical/01-understand-the-ideas/03-control-flow" },
    { track: "practical", part: "understand-the-ideas", id: "writing-methods", href: "content/practical/01-understand-the-ideas/04-writing-methods/", kind: "lesson", path: "content/practical/01-understand-the-ideas/04-writing-methods" },
    { track: "practical", part: "understand-the-ideas", id: "reading-objects", href: "content/practical/01-understand-the-ideas/05-reading-objects/", kind: "lesson", path: "content/practical/01-understand-the-ideas/05-reading-objects" },
    { track: "practical", part: "understand-the-ideas", id: "reuse-without-regret", href: "content/practical/01-understand-the-ideas/06-reuse-without-regret/", kind: "lesson", path: "content/practical/01-understand-the-ideas/06-reuse-without-regret" },

    // ---- practical / everyday-essentials ----
    { track: "practical", part: "everyday-essentials", id: "type-conversion", href: "content/practical/02-everyday-essentials/01-type-conversion/", kind: "lesson", path: "content/practical/02-everyday-essentials/01-type-conversion" },
    { track: "practical", part: "everyday-essentials", id: "strings", href: "content/practical/02-everyday-essentials/02-strings/", kind: "lesson", path: "content/practical/02-everyday-essentials/02-strings" },
    { track: "practical", part: "everyday-essentials", id: "arrays", href: "content/practical/02-everyday-essentials/03-arrays/", kind: "lesson", path: "content/practical/02-everyday-essentials/03-arrays" },
    { track: "practical", part: "everyday-essentials", id: "class-members", href: "content/practical/02-everyday-essentials/04-class-members/", kind: "lesson", path: "content/practical/02-everyday-essentials/04-class-members" },
    { track: "practical", part: "everyday-essentials", id: "null-safety", href: "content/practical/02-everyday-essentials/05-null-safety/", kind: "lesson", path: "content/practical/02-everyday-essentials/05-null-safety" },
    { track: "practical", part: "everyday-essentials", id: "access-properties", href: "content/practical/02-everyday-essentials/06-access-properties/", kind: "lesson", path: "content/practical/02-everyday-essentials/06-access-properties" },
    { track: "practical", part: "everyday-essentials", id: "type-system", href: "content/practical/02-everyday-essentials/07-type-system/", kind: "lesson", path: "content/practical/02-everyday-essentials/07-type-system" },

    // ---- practical / know-the-language ----
    { track: "practical", part: "know-the-language", id: "collections", href: "content/practical/03-know-the-language/01-collections/", kind: "lesson", path: "content/practical/03-know-the-language/01-collections" },
    { track: "practical", part: "know-the-language", id: "data-shapes", href: "content/practical/03-know-the-language/02-data-shapes/", kind: "lesson", path: "content/practical/03-know-the-language/02-data-shapes" },
    { track: "practical", part: "know-the-language", id: "lambdas", href: "content/practical/03-know-the-language/03-lambdas/", kind: "lesson", path: "content/practical/03-know-the-language/03-lambdas" },
    { track: "practical", part: "know-the-language", id: "linq", href: "content/practical/03-know-the-language/04-linq/", kind: "lesson", path: "content/practical/03-know-the-language/04-linq" },
    { track: "practical", part: "know-the-language", id: "errors-null", href: "content/practical/03-know-the-language/05-errors-null/", kind: "lesson", path: "content/practical/03-know-the-language/05-errors-null" },
    { track: "practical", part: "know-the-language", id: "generics", href: "content/practical/03-know-the-language/06-generics/", kind: "lesson", path: "content/practical/03-know-the-language/06-generics" },

    // ---- practical / build-with-objects ----
    { track: "practical", part: "build-with-objects", id: "encapsulation", href: "content/practical/04-build-with-objects/01-encapsulation/", kind: "lesson", path: "content/practical/04-build-with-objects/01-encapsulation" },
    { track: "practical", part: "build-with-objects", id: "interfaces", href: "content/practical/04-build-with-objects/02-interfaces/", kind: "lesson", path: "content/practical/04-build-with-objects/02-interfaces" },
    { track: "practical", part: "build-with-objects", id: "polymorphism", href: "content/practical/04-build-with-objects/03-polymorphism/", kind: "lesson", path: "content/practical/04-build-with-objects/03-polymorphism" },
    { track: "practical", part: "build-with-objects", id: "composition", href: "content/practical/04-build-with-objects/04-composition/", kind: "lesson", path: "content/practical/04-build-with-objects/04-composition" },
    { track: "practical", part: "build-with-objects", id: "dependency-injection", href: "content/practical/04-build-with-objects/05-dependency-injection/", kind: "lesson", path: "content/practical/04-build-with-objects/05-dependency-injection" },

    // ---- practical / prove-it-works ----
    { track: "practical", part: "prove-it-works", id: "testing-basics", href: "content/practical/05-prove-it-works/01-testing-basics/", kind: "lesson", path: "content/practical/05-prove-it-works/01-testing-basics" },
    { track: "practical", part: "prove-it-works", id: "test-doubles", href: "content/practical/05-prove-it-works/02-test-doubles/", kind: "lesson", path: "content/practical/05-prove-it-works/02-test-doubles" },
    { track: "practical", part: "prove-it-works", id: "testable-design", href: "content/practical/05-prove-it-works/03-testable-design/", kind: "lesson", path: "content/practical/05-prove-it-works/03-testable-design" },

    // ---- practical / design-for-change ----
    { track: "practical", part: "design-for-change", id: "refactor-moves", href: "content/practical/06-design-for-change/01-refactor-moves/", kind: "lesson", path: "content/practical/06-design-for-change/01-refactor-moves" },
    { track: "practical", part: "design-for-change", id: "the-solid-principles", href: "content/practical/06-design-for-change/02-the-solid-principles/", kind: "lesson", path: "content/practical/06-design-for-change/02-the-solid-principles" },
    { track: "practical", part: "design-for-change", id: "level3-app", href: "level3-app/", kind: "external", path: null, title: "Capstone: SOLID in Practice", blurb: "Put it all together. Refactor a real, broken program one step at a time. Your C# compiles and runs, with friendly errors, optional hints, and a worked solution if you get stuck.", pill: "challenging", time: "60 min", final: true },

    // ---- theory / what-a-computer-really-is ----
    { track: "theory", part: "what-a-computer-really-is", id: "theory-1", href: "content/theory/01-what-a-computer-really-is/01-theory-1/", kind: "lesson", path: "content/theory/01-what-a-computer-really-is/01-theory-1" },
    { track: "theory", part: "what-a-computer-really-is", id: "theory-2", href: "content/theory/01-what-a-computer-really-is/02-theory-2/", kind: "lesson", path: "content/theory/01-what-a-computer-really-is/02-theory-2" },
    { track: "theory", part: "what-a-computer-really-is", id: "theory-3", href: "content/theory/01-what-a-computer-really-is/03-theory-3/", kind: "lesson", path: "content/theory/01-what-a-computer-really-is/03-theory-3" },
    { track: "theory", part: "what-a-computer-really-is", id: "theory-4", href: "content/theory/01-what-a-computer-really-is/04-theory-4/", kind: "lesson", path: "content/theory/01-what-a-computer-really-is/04-theory-4" },
    { track: "theory", part: "what-a-computer-really-is", id: "theory-5", href: "content/theory/01-what-a-computer-really-is/05-theory-5/", kind: "lesson", path: "content/theory/01-what-a-computer-really-is/05-theory-5" },
    { track: "theory", part: "what-a-computer-really-is", id: "theory-6", href: "content/theory/01-what-a-computer-really-is/06-theory-6/", kind: "lesson", path: "content/theory/01-what-a-computer-really-is/06-theory-6" },
    { track: "theory", part: "what-a-computer-really-is", id: "theory-7", href: "content/theory/01-what-a-computer-really-is/07-theory-7/", kind: "lesson", path: "content/theory/01-what-a-computer-really-is/07-theory-7" },
    { track: "theory", part: "what-a-computer-really-is", id: "theory-check-1", href: "content/theory/01-what-a-computer-really-is/08-theory-check-1/", kind: "lesson", path: "content/theory/01-what-a-computer-really-is/08-theory-check-1" },

    // ---- theory / from-idea-to-running-code ----
    { track: "theory", part: "from-idea-to-running-code", id: "theory-8", href: "content/theory/02-from-idea-to-running-code/01-theory-8/", kind: "lesson", path: "content/theory/02-from-idea-to-running-code/01-theory-8" },
    { track: "theory", part: "from-idea-to-running-code", id: "theory-9", href: "content/theory/02-from-idea-to-running-code/02-theory-9/", kind: "lesson", path: "content/theory/02-from-idea-to-running-code/02-theory-9" },
    { track: "theory", part: "from-idea-to-running-code", id: "theory-10", href: "content/theory/02-from-idea-to-running-code/03-theory-10/", kind: "lesson", path: "content/theory/02-from-idea-to-running-code/03-theory-10" },
    { track: "theory", part: "from-idea-to-running-code", id: "theory-11", href: "content/theory/02-from-idea-to-running-code/04-theory-11/", kind: "lesson", path: "content/theory/02-from-idea-to-running-code/04-theory-11" },
    { track: "theory", part: "from-idea-to-running-code", id: "theory-12", href: "content/theory/02-from-idea-to-running-code/05-theory-12/", kind: "lesson", path: "content/theory/02-from-idea-to-running-code/05-theory-12" },
    { track: "theory", part: "from-idea-to-running-code", id: "theory-13", href: "content/theory/02-from-idea-to-running-code/06-theory-13/", kind: "lesson", path: "content/theory/02-from-idea-to-running-code/06-theory-13" },
    { track: "theory", part: "from-idea-to-running-code", id: "theory-14", href: "content/theory/02-from-idea-to-running-code/07-theory-14/", kind: "lesson", path: "content/theory/02-from-idea-to-running-code/07-theory-14" },
    { track: "theory", part: "from-idea-to-running-code", id: "theory-check-2", href: "content/theory/02-from-idea-to-running-code/08-theory-check-2/", kind: "lesson", path: "content/theory/02-from-idea-to-running-code/08-theory-check-2" },

    // ---- theory / how-software-runs-and-connects ----
    { track: "theory", part: "how-software-runs-and-connects", id: "theory-15", href: "content/theory/03-how-software-runs-and-connects/01-theory-15/", kind: "lesson", path: "content/theory/03-how-software-runs-and-connects/01-theory-15" },
    { track: "theory", part: "how-software-runs-and-connects", id: "theory-16", href: "content/theory/03-how-software-runs-and-connects/02-theory-16/", kind: "lesson", path: "content/theory/03-how-software-runs-and-connects/02-theory-16" },
    { track: "theory", part: "how-software-runs-and-connects", id: "theory-17", href: "content/theory/03-how-software-runs-and-connects/03-theory-17/", kind: "lesson", path: "content/theory/03-how-software-runs-and-connects/03-theory-17" },
    { track: "theory", part: "how-software-runs-and-connects", id: "theory-18", href: "content/theory/03-how-software-runs-and-connects/04-theory-18/", kind: "lesson", path: "content/theory/03-how-software-runs-and-connects/04-theory-18" },
    { track: "theory", part: "how-software-runs-and-connects", id: "theory-19", href: "content/theory/03-how-software-runs-and-connects/05-theory-19/", kind: "lesson", path: "content/theory/03-how-software-runs-and-connects/05-theory-19" },
    { track: "theory", part: "how-software-runs-and-connects", id: "theory-check-3", href: "content/theory/03-how-software-runs-and-connects/06-theory-check-3/", kind: "lesson", path: "content/theory/03-how-software-runs-and-connects/06-theory-check-3" },

    // ---- theory / the-development-world ----
    { track: "theory", part: "the-development-world", id: "theory-21", href: "content/theory/04-the-development-world/01-theory-21/", kind: "lesson", path: "content/theory/04-the-development-world/01-theory-21" },
    { track: "theory", part: "the-development-world", id: "theory-20", href: "content/theory/04-the-development-world/02-theory-20/", kind: "lesson", path: "content/theory/04-the-development-world/02-theory-20" },
    { track: "theory", part: "the-development-world", id: "theory-check-4", href: "content/theory/04-the-development-world/03-theory-check-4/", kind: "lesson", path: "content/theory/04-the-development-world/03-theory-check-4" },

    // ---- ai / the-building-blocks-of-ai ----
    { track: "ai", part: "the-building-blocks-of-ai", id: "ai-1", href: "content/ai/01-the-building-blocks-of-ai/01-ai-1/", kind: "lesson", path: "content/ai/01-the-building-blocks-of-ai/01-ai-1" },
    { track: "ai", part: "the-building-blocks-of-ai", id: "ai-2", href: "content/ai/01-the-building-blocks-of-ai/02-ai-2/", kind: "lesson", path: "content/ai/01-the-building-blocks-of-ai/02-ai-2" },
    { track: "ai", part: "the-building-blocks-of-ai", id: "ai-3", href: "content/ai/01-the-building-blocks-of-ai/03-ai-3/", kind: "lesson", path: "content/ai/01-the-building-blocks-of-ai/03-ai-3" },
    { track: "ai", part: "the-building-blocks-of-ai", id: "ai-9", href: "content/ai/01-the-building-blocks-of-ai/04-ai-9/", kind: "lesson", path: "content/ai/01-the-building-blocks-of-ai/04-ai-9" },
    { track: "ai", part: "the-building-blocks-of-ai", id: "ai-10", href: "content/ai/01-the-building-blocks-of-ai/05-ai-10/", kind: "lesson", path: "content/ai/01-the-building-blocks-of-ai/05-ai-10" },
    { track: "ai", part: "the-building-blocks-of-ai", id: "ai-4", href: "content/ai/01-the-building-blocks-of-ai/06-ai-4/", kind: "lesson", path: "content/ai/01-the-building-blocks-of-ai/06-ai-4" },
    { track: "ai", part: "the-building-blocks-of-ai", id: "ai-5", href: "content/ai/01-the-building-blocks-of-ai/07-ai-5/", kind: "lesson", path: "content/ai/01-the-building-blocks-of-ai/07-ai-5" },

    // ---- ai / from-model-to-agent ----
    { track: "ai", part: "from-model-to-agent", id: "ai-6", href: "content/ai/02-from-model-to-agent/01-ai-6/", kind: "lesson", path: "content/ai/02-from-model-to-agent/01-ai-6" },
    { track: "ai", part: "from-model-to-agent", id: "ai-7", href: "content/ai/02-from-model-to-agent/02-ai-7/", kind: "lesson", path: "content/ai/02-from-model-to-agent/02-ai-7" },
    { track: "ai", part: "from-model-to-agent", id: "ai-14", href: "content/ai/02-from-model-to-agent/03-ai-14/", kind: "lesson", path: "content/ai/02-from-model-to-agent/03-ai-14" },
    { track: "ai", part: "from-model-to-agent", id: "ai-8", href: "content/ai/02-from-model-to-agent/04-ai-8/", kind: "lesson", path: "content/ai/02-from-model-to-agent/04-ai-8" },
    { track: "ai", part: "from-model-to-agent", id: "ai-13", href: "content/ai/02-from-model-to-agent/05-ai-13/", kind: "lesson", path: "content/ai/02-from-model-to-agent/05-ai-13" },

    // ---- ai / how-an-agent-thinks ----
    { track: "ai", part: "how-an-agent-thinks", id: "ai-15", href: "content/ai/03-how-an-agent-thinks/01-ai-15/", kind: "lesson", path: "content/ai/03-how-an-agent-thinks/01-ai-15" },
    { track: "ai", part: "how-an-agent-thinks", id: "ai-16", href: "content/ai/03-how-an-agent-thinks/02-ai-16/", kind: "lesson", path: "content/ai/03-how-an-agent-thinks/02-ai-16" },
    { track: "ai", part: "how-an-agent-thinks", id: "ai-17", href: "content/ai/03-how-an-agent-thinks/03-ai-17/", kind: "lesson", path: "content/ai/03-how-an-agent-thinks/03-ai-17" },
    { track: "ai", part: "how-an-agent-thinks", id: "ai-18", href: "content/ai/03-how-an-agent-thinks/04-ai-18/", kind: "lesson", path: "content/ai/03-how-an-agent-thinks/04-ai-18" },

    // ---- ai / making-agents-reliable ----
    { track: "ai", part: "making-agents-reliable", id: "ai-19", href: "content/ai/04-making-agents-reliable/01-ai-19/", kind: "lesson", path: "content/ai/04-making-agents-reliable/01-ai-19" },
    { track: "ai", part: "making-agents-reliable", id: "ai-20", href: "content/ai/04-making-agents-reliable/02-ai-20/", kind: "lesson", path: "content/ai/04-making-agents-reliable/02-ai-20" },
    { track: "ai", part: "making-agents-reliable", id: "ai-21", href: "content/ai/04-making-agents-reliable/03-ai-21/", kind: "lesson", path: "content/ai/04-making-agents-reliable/03-ai-21" },
    { track: "ai", part: "making-agents-reliable", id: "ai-22", href: "content/ai/04-making-agents-reliable/04-ai-22/", kind: "lesson", path: "content/ai/04-making-agents-reliable/04-ai-22" },
    { track: "ai", part: "making-agents-reliable", id: "ai-23", href: "content/ai/04-making-agents-reliable/05-ai-23/", kind: "lesson", path: "content/ai/04-making-agents-reliable/05-ai-23" }
  ];

  var byIdIndex = {};
  lessons.forEach(function (l) { byIdIndex[l.id] = l; });

  global.CourseRegistry = Object.freeze({
    tracks: Object.freeze(tracks.map(function (t) { return Object.freeze(t); })),
    lessons: Object.freeze(lessons.map(function (l) { return Object.freeze(l); })),
    byId: function (id) { return byIdIndex[id] || null; }
  });
})(typeof window !== "undefined" ? window : this);
