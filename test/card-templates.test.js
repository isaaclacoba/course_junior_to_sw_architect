"use strict";

// Unit tests for kernel/page-shell/card-templates.js - the two archetype card
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

test("both archetypes emit a single live-region card root", () => {
  for (const html of [cards.buildCard("bp"), cards.drillCard("cf")]) {
    assert.equal(html.match(/<section class="card" aria-live="polite">/g).length, 1);
  }
});
