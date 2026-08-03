// Shared page shell.
//
// Every level/lesson page repeats the same hero block and, for the drill and
// build tracks, the same card scaffold. This script renders those shared parts
// from a small `window.PAGE` config so each page is just its content, not a
// copy of the template.
//
// window.PAGE = {
//   hero: {
//     eyebrow: string,
//     title: string,
//     intro: Array<string | { html: string, class?: string }>,
//     links: Array<{ href: string, label: string }>,
//   },
//   archetype?: "drill" | "build",   // omit for pages with a bespoke body
//   prefix?: string,                 // id prefix used by the matching engine
// }
//
// The hero is rendered into <section class="hero" id="pageHero">. For the drill
// and build archetypes the matching card scaffold is inserted right after it,
// so drill-engine.js / build-engine.js find their prefixed element ids.
