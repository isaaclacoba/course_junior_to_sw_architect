// test/check-literals.test.js - tools/check-literals.mjs, the i18n literal linter.
// CommonJS (no root "type":"module") to match the repo's other .test.js files;
// the tool is ESM, so it is pulled in with a dynamic import().
//
// The point of these tests is the SIGNAL/NOISE boundary. A linter that flags
// correct code gets switched off, so the false-positive cases below matter at
// least as much as the true positives.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const TOOL = path.join(path.dirname(__dirname), "tools", "check-literals.mjs");
const load = () => import(TOOL);

const values = (findings) => findings.map((f) => f.value).sort();

// --- true positives ---------------------------------------------------------
test("flags a literal assigned straight to textContent", async () => {
  const { scanJs } = await load();
  const f = scanJs('el.textContent = "Answer revealed";');
  assert.deepEqual(values(f), ["Answer revealed"]);
  assert.equal(f[0].sink, "textContent");
  assert.equal(f[0].line, 1);
});

test("flags every user-visible property sink", async () => {
  const { scanJs } = await load();
  for (const sink of ["textContent", "innerHTML", "innerText", "placeholder", "title", "ariaLabel", "alt", "label"]) {
    const f = scanJs(`el.${sink} = "Some visible words";`);
    assert.equal(f.length, 1, `${sink} should be a sink`);
    assert.equal(f[0].sink, sink);
  }
});

test("flags a literal inside setAttribute for a visible attribute", async () => {
  const { scanJs } = await load();
  const f = scanJs('b.setAttribute("aria-label", "Back to top");');
  assert.deepEqual(values(f), ["Back to top"]);
  assert.equal(f[0].sink, "setAttribute(aria-label)");
});

test("flags prose concatenated around a translated call", async () => {
  const { scanJs } = await load();
  const f = scanJs('el.textContent = tr("a.b", "Hi") + "Hint: " + x;');
  assert.deepEqual(values(f), ["Hint: "]);
});

test("flags prose inside a template literal chunk", async () => {
  const { scanJs } = await load();
  const f = scanJs("el.textContent = `Blank ${n} of ${total}`;");
  assert.ok(f.some((x) => x.value.includes("Blank ")));
});

test("reports the real line number", async () => {
  const { scanJs } = await load();
  const f = scanJs('var a = 1;\n\nel.textContent = "Not quite.";');
  assert.equal(f[0].line, 3);
});

// --- false positives: the correct patterns must stay silent ------------------
test("does NOT flag the English fallback of a translator call", async () => {
  const { scanJs } = await load();
  for (const fn of ["t", "tr", "tHtml", "tAttr", "tSlot"]) {
    assert.deepEqual(scanJs(`el.textContent = ${fn}("result.passed", "Passed");`), [],
      `${fn}() fallback must not be flagged`);
  }
});

test("does NOT flag a nested translator call", async () => {
  const { scanJs } = await load();
  assert.deepEqual(scanJs('el.innerHTML = "<b>" + tr("a.b", "Run") + "</b>";'), []);
});

test("does NOT flag selectors, markup, keys or identifiers", async () => {
  const { looksTranslatable } = await load();
  for (const v of [".c-lead", "#trackSwitch", "<span class=\"x\">", " &middot; <a href=\"g.html\">",
                   "landing.title", "glossary.html", "theory", "camelCaseFlag", "px", "  ", "12 34"]) {
    assert.equal(looksTranslatable(v), false, `${JSON.stringify(v)} should not look translatable`);
  }
});

test("does still consider real prose translatable", async () => {
  const { looksTranslatable } = await load();
  for (const v of ["Close", "Back to top", "Definition not found.", "Hint: ", "Fill in the blanks"]) {
    assert.equal(looksTranslatable(v), true, `${JSON.stringify(v)} should be translatable`);
  }
});

test("does NOT flag a non-visible property or attribute", async () => {
  const { scanJs } = await load();
  assert.deepEqual(scanJs('el.dataset.track = "Some visible words";'), []);
  assert.deepEqual(scanJs('el.setAttribute("data-track", "Some visible words");'), []);
});

// --- the escape hatch -------------------------------------------------------
test("a trailing i18n-ignore pragma excuses its own line", async () => {
  const { scanJs } = await load();
  assert.deepEqual(scanJs('el.textContent = "English"; // i18n-ignore: language switcher'), []);
});

test("a standalone i18n-ignore pragma excuses the NEXT line", async () => {
  const { scanJs } = await load();
  assert.deepEqual(scanJs('// i18n-ignore: language switcher\nel.textContent = "English";'), []);
});

test("an i18n-ignore without a reason does NOT excuse anything", async () => {
  const { scanJs } = await load();
  assert.equal(scanJs('el.textContent = "Answer revealed"; // i18n-ignore:').length, 1);
});

// --- HTML -------------------------------------------------------------------
test("flags a hardcoded visible attribute in HTML", async () => {
  const { scanHtml } = await load();
  const f = scanHtml('<button aria-label="Back to top"></button>');
  assert.deepEqual(values(f), ["Back to top"]);
});

test("does NOT flag an HTML attribute on a tag carrying a data-t marker", async () => {
  const { scanHtml } = await load();
  assert.deepEqual(scanHtml('<button data-t="a.b" aria-label="Back to top"></button>'), []);
});

test("does NOT flag an element the page script re-labels at runtime", async () => {
  const { scanHtml, localizedSelectors } = await load();
  const sels = localizedSelectors('setAria("#cTotop", "landing.backToTop");');
  assert.ok(sels.has("#cTotop"));
  assert.deepEqual(scanHtml('<button id="cTotop" aria-label="Back to top"></button>', "x.html", sels), []);
});

test("localizedSelectors ignores a call without a catalog key", async () => {
  const { localizedSelectors } = await load();
  assert.equal(localizedSelectors('document.querySelector("#cTotop");').has("#cTotop"), false);
});

// --- contract ---------------------------------------------------------------
test("the excluded list explains itself", async () => {
  const { EXCLUDED } = await load();
  for (const [file, reason] of Object.entries(EXCLUDED)) {
    assert.ok(reason && reason.length > 10, `${file} needs a real reason, not a bare exclusion`);
  }
});

// An exclusion for a file that no longer exists is worse than useless: it is a
// silent no-op that still suppresses anything sharing that basename. This bit -
// the drill-engine.js entry outlived the file when the lesson engine deleted it,
// and nothing noticed.
test("every excluded file actually exists", async () => {
  const { EXCLUDED } = await load();
  const fs = require("node:fs");
  const repo = path.dirname(__dirname);
  for (const file of Object.keys(EXCLUDED)) {
    assert.ok(
      fs.existsSync(path.join(repo, file)),
      `EXCLUDED names "${file}", which no longer exists - drop the entry instead of leaving a dead exclusion`
    );
  }
});

test("a parse error is reported, not swallowed", async () => {
  const { scanJs } = await load();
  assert.throws(() => scanJs("function ( {", "bad.js"), /parse error/);
});
