/* Course structure + order - the single source of the course path. */
/*
 * course-registry.js - the source of the course path. Two things live here:
 *
 *   tracks[]  - the track + part CHROME (name, kicker, blurb, partPrefix, part
 *               titles), in display order. The generator derives each part's
 *               "Part one/two/..." kicker from partPrefix + its 1-based position.
 *               Translations live inline in an `i18n: { <lang>: {...} }` block on
 *               each track (name/kicker/blurb/partPrefix) and part (title) - the
 *               generator emits generated/landing-i18n.<lang>.json from them, so a
 *               new Part is translated here, next to its English, not in a separate
 *               root file.
 *   lessons[] - every lesson in reading order. Order = array order. Add a lesson =
 *               one line; remove = delete one line.
 *
 * Per-lesson presentational data (title, blurb, pill, time, total, key) lives in
 * each lesson's content/.../meta.js.
 *
 * `id`   - stable identity: href minus a trailing ".html", or a trailing "/"
 *          dropped ("foo/" -> "foo").
 * `href` - the served path (content/.../ for a migrated lesson).
 * `kind` - always "lesson".
 * `path` - the content/... directory.
 *
 * Frozen window.CourseRegistry = { tracks, lessons, byId }.
 */
(function (global) {
  var tracks = [
    { id: "practical", name: "Practical", kicker: "Hands on", partPrefix: "Part ", blurb: "Learn C# by writing and running real code, one small win at a time - all the way to SOLID design.", i18n: { es: { name: "Práctico", kicker: "Manos a la obra", partPrefix: "Parte ", blurb: "Aprende C# escribiendo y ejecutando código de verdad, victoria a victoria, hasta el diseño SOLID." } }, parts: [
      { id: "understand-the-ideas", title: "Understand the ideas", i18n: { es: { title: "Comprende las ideas" } } },
      { id: "everyday-essentials", title: "Everyday essentials", i18n: { es: { title: "Fundamentos del día a día" } } },
      { id: "know-the-language", title: "Know the language", i18n: { es: { title: "Conoce el lenguaje" } } },
      { id: "build-with-objects", title: "Build with objects", i18n: { es: { title: "Construye con objetos" } } },
      { id: "prove-it-works", title: "Prove it works", i18n: { es: { title: "Demuestra que funciona" } } },
      { id: "design-for-change", title: "Design for change", i18n: { es: { title: "Diseña para el cambio" } } }
    ] },
    { id: "theory", name: "Theory", kicker: "From zero", partPrefix: "Theory · Part ", blurb: "No background needed. Understand what software is and how a computer actually runs it, from the ground up.", i18n: { es: { name: "Teoría", kicker: "Desde cero", partPrefix: "Teoría · Parte ", blurb: "No necesitas base previa. Entiende qué es el software y cómo lo ejecuta de verdad un ordenador, desde cero." } }, parts: [
      { id: "what-a-computer-really-is", title: "What a computer really is", i18n: { es: { title: "Qué es de verdad un ordenador" } } },
      { id: "from-idea-to-running-code", title: "From idea to running code", i18n: { es: { title: "De la idea al código en marcha" } } },
      { id: "how-software-runs-and-connects", title: "How software runs and connects", i18n: { es: { title: "Cómo se ejecuta y se conecta el software" } } },
      { id: "the-development-world", title: "The development world", i18n: { es: { title: "El mundo del desarrollo" } } },
      { id: "foundations-of-good-code", title: "Foundations of good code", i18n: { es: { title: "Fundamentos del buen código" } } }
    ] },
    { id: "ai", name: "AI", kicker: "Agents from scratch", partPrefix: "AI · Part ", blurb: "A first look at how large language models and AI agents really work - tokens, context, memory, tools, planning, and keeping an agent reliable.", i18n: { es: { name: "IA", kicker: "Agentes desde cero", partPrefix: "IA · Parte ", blurb: "Un primer vistazo a cómo funcionan de verdad los LLM y los agentes de IA - tokens, contexto, memoria, herramientas, planificación y cómo mantener un agente de fiar." } }, parts: [
      { id: "the-building-blocks-of-ai", title: "The building blocks of AI", i18n: { es: { title: "Los pilares de la IA" } } },
      { id: "from-model-to-agent", title: "From model to agent", i18n: { es: { title: "Del modelo al agente" } } },
      { id: "how-an-agent-thinks", title: "How an agent thinks", i18n: { es: { title: "Cómo piensa un agente" } } },
      { id: "making-agents-reliable", title: "Making agents reliable", i18n: { es: { title: "Hacer agentes de fiar" } } }
    ] },
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
    { track: "theory", part: "how-software-runs-and-connects", id: "keeping-data-safe", href: "content/theory/03-how-software-runs-and-connects/06-keeping-data-safe/", kind: "lesson", path: "content/theory/03-how-software-runs-and-connects/06-keeping-data-safe" },
    { track: "theory", part: "how-software-runs-and-connects", id: "theory-check-3", href: "content/theory/03-how-software-runs-and-connects/07-theory-check-3/", kind: "lesson", path: "content/theory/03-how-software-runs-and-connects/07-theory-check-3" },

    // ---- theory / the-development-world ----
    { track: "theory", part: "the-development-world", id: "theory-21", href: "content/theory/04-the-development-world/01-theory-21/", kind: "lesson", path: "content/theory/04-the-development-world/01-theory-21" },
    { track: "theory", part: "the-development-world", id: "theory-20", href: "content/theory/04-the-development-world/02-theory-20/", kind: "lesson", path: "content/theory/04-the-development-world/02-theory-20" },
    { track: "theory", part: "the-development-world", id: "theory-check-4", href: "content/theory/04-the-development-world/03-theory-check-4/", kind: "lesson", path: "content/theory/04-the-development-world/03-theory-check-4" },

    // ---- theory / foundations-of-good-code ----
    { track: "theory", part: "foundations-of-good-code", id: "good-names", href: "content/theory/05-foundations-of-good-code/01-good-names/", kind: "lesson", path: "content/theory/05-foundations-of-good-code/01-good-names" },
    { track: "theory", part: "foundations-of-good-code", id: "no-repeats", href: "content/theory/05-foundations-of-good-code/02-no-repeats/", kind: "lesson", path: "content/theory/05-foundations-of-good-code/02-no-repeats" },
    { track: "theory", part: "foundations-of-good-code", id: "one-job", href: "content/theory/05-foundations-of-good-code/03-one-job/", kind: "lesson", path: "content/theory/05-foundations-of-good-code/03-one-job" },
    { track: "theory", part: "foundations-of-good-code", id: "write-for-readers", href: "content/theory/05-foundations-of-good-code/04-write-for-readers/", kind: "lesson", path: "content/theory/05-foundations-of-good-code/04-write-for-readers" },
    { track: "theory", part: "foundations-of-good-code", id: "comments-say-why", href: "content/theory/05-foundations-of-good-code/05-comments-say-why/", kind: "lesson", path: "content/theory/05-foundations-of-good-code/05-comments-say-why" },
    { track: "theory", part: "foundations-of-good-code", id: "good-code-check", href: "content/theory/05-foundations-of-good-code/06-good-code-check/", kind: "lesson", path: "content/theory/05-foundations-of-good-code/06-good-code-check" },

    // ---- ai / the-building-blocks-of-ai ----
    { track: "ai", part: "the-building-blocks-of-ai", id: "ai-1", href: "content/ai/01-the-building-blocks-of-ai/01-ai-1/", kind: "lesson", path: "content/ai/01-the-building-blocks-of-ai/01-ai-1" },
    { track: "ai", part: "the-building-blocks-of-ai", id: "ai-2", href: "content/ai/01-the-building-blocks-of-ai/02-ai-2/", kind: "lesson", path: "content/ai/01-the-building-blocks-of-ai/02-ai-2" },
    { track: "ai", part: "the-building-blocks-of-ai", id: "ai-3", href: "content/ai/01-the-building-blocks-of-ai/03-ai-3/", kind: "lesson", path: "content/ai/01-the-building-blocks-of-ai/03-ai-3" },
    { track: "ai", part: "the-building-blocks-of-ai", id: "ai-9", href: "content/ai/01-the-building-blocks-of-ai/04-ai-9/", kind: "lesson", path: "content/ai/01-the-building-blocks-of-ai/04-ai-9" },
    { track: "ai", part: "the-building-blocks-of-ai", id: "ai-10", href: "content/ai/01-the-building-blocks-of-ai/05-ai-10/", kind: "lesson", path: "content/ai/01-the-building-blocks-of-ai/05-ai-10" },
    { track: "ai", part: "the-building-blocks-of-ai", id: "ai-4", href: "content/ai/01-the-building-blocks-of-ai/06-ai-4/", kind: "lesson", path: "content/ai/01-the-building-blocks-of-ai/06-ai-4" },
    { track: "ai", part: "the-building-blocks-of-ai", id: "ai-5", href: "content/ai/01-the-building-blocks-of-ai/07-ai-5/", kind: "lesson", path: "content/ai/01-the-building-blocks-of-ai/07-ai-5" },
    { track: "ai", part: "the-building-blocks-of-ai", id: "ai-24", href: "content/ai/01-the-building-blocks-of-ai/08-ai-24/", kind: "lesson", path: "content/ai/01-the-building-blocks-of-ai/08-ai-24" },

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
