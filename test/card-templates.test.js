"use strict";

// Unit tests for kernel/page-shell/card-templates.js - the archetype card
// scaffolds. Two things are worth pinning down: every element id is built from
// the caller's prefix (the whole engine addressing scheme depends on it), and
// with no catalog the markup carries no i18n markers at all, which is the
// byte-identical guarantee the non-i18n pages rely on.

const test = require("node:test");
const assert = require("node:assert/strict");

const cards = require("../kernel/page-shell/card-templates.js");

function withCatalog(catalog, fn) {
  const had = Object.prototype.hasOwnProperty.call(globalThis, "window");
  const previous = globalThis.window;
  globalThis.window = { ChromeText: catalog };
  try {
    return fn();
  } finally {
    if (had) globalThis.window = previous;
    else delete globalThis.window;
  }
}

// Every id the build engine addresses on a card.
const BUILD_IDS = [
  "Meta", "Title", "Context", "Concept", "Progress",
  "ExampleWrap", "Example", "Goal", "Expected", "Editor",
  "Run", "Solution", "Reset", "Errors", "Output",
  "Result", "ResultTitle", "ResultBody",
  "Summary", "SummaryIntro", "SummaryList", "SummaryClose",
  "Prev", "Next",
];

// Every id the drill engine addresses on a card.
const DRILL_IDS = [
  "Meta", "Title", "Context", "Concept", "Progress",
  "Pain", "Map", "Quiz", "Question", "Options", "QuizFeedback",
  "Code", "Run", "Errors", "Output", "Points", "Diagram", "Inputs",
  "Check", "Hint", "Show", "Reset",
  "Result", "ResultTitle", "ResultBody", "ResultList",
  "Summary", "SummaryIntro", "SummaryList", "SummaryClose",
  "Prev", "Next",
];

test("the module loads with no browser globals", () => {
  assert.equal(typeof cards.buildCard, "function");
  assert.equal(typeof cards.drillCard, "function");
  assert.equal(typeof cards.gitCard, "function");
});

test("buildCard emits every id the build engine addresses, prefixed", () => {
  const html = cards.buildCard("bp");
  for (const id of BUILD_IDS) {
    assert.ok(html.includes(`id="bp${id}"`), `missing id="bp${id}"`);
  }
});

test("drillCard emits every id the drill engine addresses, prefixed", () => {
  const html = cards.drillCard("cf");
  for (const id of DRILL_IDS) {
    assert.ok(html.includes(`id="cf${id}"`), `missing id="cf${id}"`);
  }
});

test("the prefix is applied to every id, with none left unprefixed", () => {
  const ids = [...cards.buildCard("bp").matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
  assert.ok(ids.length > 0);
  for (const id of ids) assert.ok(id.startsWith("bp"), `unprefixed id: ${id}`);
});

test("two prefixes produce disjoint id sets on the same archetype", () => {
  const a = [...cards.buildCard("aa").matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
  const b = new Set([...cards.buildCard("bb").matchAll(/id="([^"]+)"/g)].map((m) => m[1]));
  for (const id of a) assert.equal(b.has(id), false, `id collides across prefixes: ${id}`);
});

test("with no catalog buildCard carries no i18n markers", () => {
  const html = cards.buildCard("bp");
  assert.equal(html.includes("data-t="), false);
  assert.ok(html.includes(">Here's the pattern</h3>"));
  assert.ok(html.includes(">Goal</h3>"));
  assert.ok(html.includes("Expected output:"));
  assert.ok(html.includes(">Run</button>"));
});

test("with a catalog buildCard marks and localizes its chrome", () => {
  const html = withCatalog({ "card.goal": "Objetivo", "nav.run": "Ejecutar" }, () =>
    cards.buildCard("bp"),
  );
  assert.ok(html.includes('<h3 data-t="card.goal">Objetivo</h3>'));
  assert.ok(html.includes(">Ejecutar</button>"));
});

test("with a catalog an untranslated key keeps English but is still marked", () => {
  const html = withCatalog({ "card.goal": "Objetivo" }, () => cards.buildCard("bp"));
  assert.ok(html.includes('type="button" data-t="nav.prev">'));
  assert.ok(html.includes(">Previous</button>"));
});

// Run and Next are localized on render but deliberately NOT marked with data-t,
// because build-engine.js owns those two labels at runtime - it swaps Next to
// nav.nextLesson on the last card. A marker would let repaintChrome clobber
// "Next lesson" back to "Next" on a live language swap. Every other chrome
// element in the card must be marked.
test("Run and Next are left unmarked so the engine keeps ownership of them", () => {
  const html = withCatalog({ "nav.run": "Ejecutar", "nav.next": "Siguiente" }, () =>
    cards.buildCard("bp"),
  );
  assert.ok(html.includes('<button id="bpRun" class="btn primary" type="button">Ejecutar</button>'));
  assert.ok(html.includes('<button id="bpNext" class="btn primary" type="button">Siguiente</button>'));
});

test("every marked element in buildCard is also localizable by that key", () => {
  const html = withCatalog({}, () => cards.buildCard("bp"));
  const keys = [...html.matchAll(/data-t="([^"]+)"/g)].map((m) => m[1]);
  assert.ok(keys.length >= 6);
  for (const key of keys) assert.match(key, /^(card|nav)\./);
});

test("drillCard is dormant and unlocalized, catalog or not", () => {
  assert.equal(cards.drillCard("cf").includes("data-t="), false);
  const html = withCatalog({ "card.goal": "Objetivo" }, () => cards.drillCard("cf"));
  assert.equal(html.includes("data-t="), false);
});

// ---------------------------------------------------------------------------
// gitCard
// ---------------------------------------------------------------------------
// The git scaffold's id list is DERIVED, not transcribed: the roles come from
// git-plugin.js's own `hosts.<role>` reads, and each role's element suffix comes
// from the engine's HOST_ROLES map. A plugin that starts reading a new host, or
// a HOST_ROLES rename, therefore fails here instead of 404-ing in the browser.
const fs = require("node:fs");
const path = require("node:path");
const engine = require("../kernel/engine/lesson-engine.js");

const GIT_PLUGIN_SRC = fs
  .readFileSync(path.join(__dirname, "..", "kernel", "engine", "plugins", "git-plugin.js"), "utf8")
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/\/\/.*/g, "");

// Roles the git plugin actually reads off ctx.hosts.
const GIT_ROLES = [...new Set([...GIT_PLUGIN_SRC.matchAll(/\bhosts\.(\w+)/g)].map((m) => m[1]))];

// `check` is read only to HIDE a stale Check button left by an older shell; the
// ratified UX has none, so the scaffold must not emit it.
const GIT_HOST_ROLES = GIT_ROLES.filter((r) => r !== "check");

// Chrome the core paints on every practice card (lesson-engine.js el(...) calls).
const GIT_CORE_IDS = [
  "Meta", "Title", "Context", "Concept", "Progress", "Goal",
  "Result", "ResultTitle", "ResultBody",
  "Summary", "SummaryIntro", "SummaryList", "SummaryClose",
  "Prev", "Next",
];

test("the git plugin's host roles all resolve through the engine's HOST_ROLES map", () => {
  assert.ok(GIT_ROLES.length >= 5, `expected several host roles, got ${GIT_ROLES.join(", ")}`);
  assert.ok(GIT_ROLES.includes("check"), "git-plugin should still defend against a stale Check");
  for (const role of GIT_ROLES) {
    assert.ok(engine.hostRoles[role], `git-plugin reads hosts.${role} but HOST_ROLES has no such role`);
  }
});

test("gitCard emits every host the git plugin resolves, prefixed", () => {
  const html = cards.gitCard("gt");
  for (const role of GIT_HOST_ROLES) {
    const id = `gt${engine.hostRoles[role]}`;
    assert.ok(html.includes(`id="${id}"`), `missing host for role "${role}": id="${id}"`);
  }
});

test("gitCard emits every id the engine core addresses on a card, prefixed", () => {
  const html = cards.gitCard("gt");
  for (const id of GIT_CORE_IDS) {
    assert.ok(html.includes(`id="gt${id}"`), `missing id="gt${id}"`);
  }
});

// The ratified UX (docs/architecture/git-track.md, "Practical page UX"): Enter in
// the terminal runs the command AND re-checks the goal, so a Check button would
// be a dead control. There is no Run button either - nothing is compiled here.
test("gitCard emits no Check button and no Run button", () => {
  const html = cards.gitCard("gt");
  assert.equal(html.includes(`id="gt${engine.hostRoles.check}"`), false, "gitCard must not emit a Check button");
  assert.equal(html.includes('id="gtRun"'), false, "gitCard must not emit a Run button");
  assert.equal(/>\s*Check\s*</.test(html), false, "gitCard must not render a Check label");
});

// "Show whole target" is created by the plugin into the Actions host, because the
// plugin owns its toggled label across a language swap. The shell must not emit a
// second one.
test("gitCard leaves the Show-whole-target button to the plugin", () => {
  const html = cards.gitCard("gt");
  assert.equal(html.includes('id="gtTarget"'), false);
  assert.ok(html.includes('id="gtActions"'), "the plugin needs an Actions host to append into");
});

test("gitCard keeps the terminal after the graph, per the ratified layout", () => {
  const html = cards.gitCard("gt");
  assert.ok(html.indexOf('id="gtGraph"') < html.indexOf('id="gtTerminal"'),
    "the terminal sits UNDER the graph widget");
});

test("gitCard applies the prefix to every id, for more than one prefix", () => {
  for (const p of ["gt", "gitEx"]) {
    const ids = [...cards.gitCard(p).matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
    assert.ok(ids.length > 0);
    for (const id of ids) assert.ok(id.startsWith(p), `unprefixed id: ${id}`);
  }
  const a = [...cards.gitCard("aa").matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
  const b = new Set([...cards.gitCard("bb").matchAll(/id="([^"]+)"/g)].map((m) => m[1]));
  for (const id of a) assert.equal(b.has(id), false, `id collides across prefixes: ${id}`);
});

test("with no catalog gitCard carries no i18n markers", () => {
  const html = cards.gitCard("gt");
  assert.equal(html.includes("data-t="), false);
  assert.ok(html.includes(">Goal</h3>"));
  assert.ok(html.includes(">Reset</button>"));
  assert.ok(html.includes(">Show Solution</button>"));
});

test("with a catalog gitCard marks and localizes its chrome", () => {
  const html = withCatalog({ "card.goal": "Objetivo", "nav.reset": "Reiniciar" }, () =>
    cards.gitCard("gt"),
  );
  assert.ok(html.includes('<h3 data-t="card.goal">Objetivo</h3>'));
  assert.ok(html.includes(">Reiniciar</button>"));
  // Next stays unmarked: the engine swaps it to "Next lesson" on the last card.
  assert.equal(html.includes('id="gtNext" class="btn primary" type="button" data-t'), false);
});

test("every visible label in gitCard goes through a chrome key", () => {
  const html = withCatalog({}, () => cards.gitCard("gt"));
  const keys = [...html.matchAll(/data-t="([^"]+)"/g)].map((m) => m[1]);
  assert.ok(keys.length >= 4, `expected the card's chrome to be marked, got ${keys.join(", ")}`);
  for (const key of keys) assert.match(key, /^(card|nav)\./);
  // No text node in the markup may be a bare literal: every non-empty one comes
  // from tHtml/tSlot, so it is either inside a marked element or the Next label.
  const texts = [...html.matchAll(/>([^<>{}$]+)</g)]
    .map((m) => m[1].trim())
    .filter(Boolean);
  assert.deepEqual(texts.sort(), ["Goal", "Next", "Previous", "Reset", "Show Solution"]);
});

// ---------------------------------------------------------------- the lab card

const LAB_PLUGIN_SRC = fs
  .readFileSync(path.join(__dirname, "..", "kernel", "engine", "plugins", "lab-plugin.js"), "utf8")
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/\/\/.*/g, "");

const LAB_ROLES = [...new Set([...LAB_PLUGIN_SRC.matchAll(/\bhosts\.(\w+)/g)].map((m) => m[1]))];

// `surface` is only the FALLBACK the plugin mounts into when a page has no
// Editor host (`hosts.editor || hosts.surface`); the lab scaffold emits Editor,
// so the scaffold is not required to emit both.
const LAB_HOST_ROLES = LAB_ROLES.filter((r) => r !== "surface");

test("the lab plugin's host roles all resolve through the engine's HOST_ROLES map", () => {
  assert.ok(LAB_ROLES.length >= 3, `expected several host roles, got ${LAB_ROLES.join(", ")}`);
  for (const role of LAB_ROLES) {
    assert.ok(engine.hostRoles[role], `lab-plugin reads hosts.${role} but HOST_ROLES has no such role`);
  }
});

test("labCard emits every host the lab plugin resolves, prefixed", () => {
  const html = cards.labCard("lb");
  for (const role of LAB_HOST_ROLES) {
    const id = `lb${engine.hostRoles[role]}`;
    assert.ok(html.includes(`id="${id}"`), `missing host for role "${role}": id="${id}"`);
  }
});

test("labCard emits every id the engine core addresses on a card, prefixed", () => {
  const html = cards.labCard("lb");
  for (const id of GIT_CORE_IDS) {
    assert.ok(html.includes(`id="lb${id}"`), `missing id="lb${id}"`);
  }
});

// VizLab owns the Visualize button, and that press IS the run a lab card grades.
// A second Run button would be a control that cannot grade anything - lab-plugin's
// own grade() answers "press Visualize" precisely because there is nothing here.
test("labCard emits no Run button and no Check button", () => {
  const html = cards.labCard("lb");
  assert.equal(html.includes('id="lbRun"'), false, "labCard must not emit a Run button");
  assert.equal(html.includes(`id="lb${engine.hostRoles.check}"`), false, "labCard must not emit a Check button");
  assert.equal(/>\s*Run\s*</.test(html), false, "labCard must not render a Run label");
});

// A lab card is graded on what the trace DID, not on what it printed, so the
// build card's "Expected output:" line would be a promise this card never keeps.
test("labCard emits no expected-output line and no example box", () => {
  const html = cards.labCard("lb");
  assert.equal(html.includes('id="lbExpected"'), false);
  assert.equal(html.includes('id="lbExample"'), false);
  assert.equal(html.includes("Expected"), false);
});

// The ratified layout (docs/architecture/object-model-teaching.md, "Layout"):
// the goal box sits in the card HEADER, not under the widget where it lands off
// screen while the learner types.
test("labCard puts the goal list in the header, above the widget", () => {
  const html = cards.labCard("lb");
  const head = html.indexOf("</header>");
  assert.ok(head > 0, "labCard must have a header");
  assert.ok(html.indexOf('id="lbGoal"') < head, "the goal list belongs INSIDE the header");
  assert.ok(html.indexOf('id="lbEditor"') > head, "the widget belongs under the header");
});

// The grid that mirrors VizLab's own columns. Without this class the goal box
// still renders - just not over the memory panel that proves it - so it is
// pinned here rather than left to the eye.
test("labCard carries the two-column header grid and the full-width card", () => {
  const html = cards.labCard("lb");
  assert.ok(html.includes('class="lab-head-split"'), "the header grid class is what aligns the goal box");
  assert.ok(html.includes('class="card card--split"'), "the widget is 76rem wide and needs the wide card");
});

test("labCard applies the prefix to every id, for more than one prefix", () => {
  for (const p of ["lb", "labEx"]) {
    const ids = [...cards.labCard(p).matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
    assert.ok(ids.length > 0);
    for (const id of ids) assert.ok(id.startsWith(p), `unprefixed id: ${id}`);
  }
  const a = [...cards.labCard("aa").matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
  const b = new Set([...cards.labCard("bb").matchAll(/id="([^"]+)"/g)].map((m) => m[1]));
  for (const id of a) assert.equal(b.has(id), false, `id collides across prefixes: ${id}`);
});

test("with no catalog labCard carries no i18n markers", () => {
  const html = cards.labCard("lb");
  assert.equal(html.includes("data-t="), false);
  assert.ok(html.includes(">Goal</h3>"));
  assert.ok(html.includes(">Reset</button>"));
  assert.ok(html.includes(">Show Solution</button>"));
});

test("with a catalog labCard marks and localizes its chrome", () => {
  const html = withCatalog({ "card.goal": "Objetivo", "nav.reset": "Reiniciar" }, () =>
    cards.labCard("lb"),
  );
  assert.ok(html.includes('<h3 data-t="card.goal">Objetivo</h3>'));
  assert.ok(html.includes(">Reiniciar</button>"));
});

test("every visible label in labCard goes through a chrome key", () => {
  const html = withCatalog({}, () => cards.labCard("lb"));
  const keys = [...html.matchAll(/data-t="([^"]+)"/g)].map((m) => m[1]);
  assert.ok(keys.length >= 4, `expected the card's chrome to be marked, got ${keys.join(", ")}`);
  for (const key of keys) assert.match(key, /^(card|nav)\./);
  const texts = [...html.matchAll(/>([^<>{}$]+)</g)]
    .map((m) => m[1].trim())
    .filter(Boolean);
  assert.deepEqual(texts.sort(), ["Goal", "Next", "Previous", "Reset", "Show Solution"]);
});

test("every archetype emits a single live-region card root", () => {
  // Matched on the role rather than the exact class string: a card may carry a
  // layout modifier (buildCard adds `card--split`), and what matters here is that
  // there is exactly ONE live region per card, not how it is skinned.
  for (const html of [cards.buildCard("bp"), cards.drillCard("cf"), cards.gitCard("gt"), cards.labCard("lb")]) {
    const roots = html.match(/<section class="card(?: [^"]*)?" aria-live="polite">/g);
    assert.equal(roots.length, 1);
  }
});
