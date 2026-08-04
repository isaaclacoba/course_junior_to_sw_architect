// test/generate-variants.test.js - the generator's ARCHETYPE registry and the
// template-variant lookup.
//
// WHY THIS EXISTS
// The lookup used to be positional: `blocks[0..3]` from a regex sweep of
// templates/lesson.html.tmpl, guarded by `blocks.length < 4`. Reordering the
// template - or appending a fifth variant anywhere but the end - silently
// rendered every lesson from the WRONG archetype's block, and the guard could
// not see it. These tests pin the two properties that replaced it: variants are
// keyed by the NAME in their marker comment, and the set of archetypes the
// generator knows is one declarative map.
//
// generate.mjs is a CLI; it only runs main() when invoked directly, so importing
// it here writes nothing.

"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.dirname(__dirname);
const TEMPLATE = path.join(ROOT, "templates", "lesson.html.tmpl");
const load = () => import(path.join(ROOT, "tools", "generate.mjs"));

const ARCHETYPES = ["build", "drill", "viz", "checkpoint", "git"];

// A minimal but structurally real stand-in for the template.
function fakeTemplate(names) {
  return names
    .map((n) => `<!-- @variant ${n} -->\n<!doctype html>\n<html><body>${n}</body></html>\n`)
    .join("\n");
}

// --- the variant map -------------------------------------------------------

test("the real template yields exactly the five archetype variants", async () => {
  const { parseTemplateVariants } = await load();
  const variants = parseTemplateVariants(fs.readFileSync(TEMPLATE, "utf8"));
  assert.deepEqual(Object.keys(variants).sort(), ARCHETYPES.slice().sort());
});

test("each variant is the block that FOLLOWS its own marker, not the nth block", async () => {
  const { parseTemplateVariants } = await load();
  const variants = parseTemplateVariants(fakeTemplate(["git", "checkpoint", "build", "viz", "drill"]));
  ARCHETYPES.forEach((n) => {
    assert.match(variants[n], new RegExp("<body>" + n + "</body>"),
      n + " must map to its own block regardless of position");
  });
});

test("a variant's markup carries the archetype it claims", async () => {
  const { parseTemplateVariants } = await load();
  const variants = parseTemplateVariants(fs.readFileSync(TEMPLATE, "utf8"));
  // build, drill and git declare window.PAGE.archetype; viz and checkpoint do not.
  ["build", "drill", "git"].forEach((n) => {
    assert.match(variants[n], new RegExp('archetype: "' + n + '",'),
      n + " variant must set window.PAGE.archetype to " + n);
  });
  assert.doesNotMatch(variants.viz, /archetype: "/);
  assert.doesNotMatch(variants.checkpoint, /archetype: "/);
});

test("an unmarked or malformed template fails loudly", async () => {
  const { parseTemplateVariants } = await load();
  assert.throws(() => parseTemplateVariants("<!doctype html>\n<html></html>"),
    /no '@variant <name>' marker/);
  assert.throws(() => parseTemplateVariants("<!-- @variant build -->\nno document here"),
    /variant 'build' has no <!doctype html>/);
  assert.throws(() => parseTemplateVariants(fakeTemplate(["build", "build"])),
    /duplicate variant 'build'/);
});

test("a variant with no block does not swallow the next variant's", async () => {
  const { parseTemplateVariants } = await load();
  const tmpl = "<!-- @variant build -->\n<!-- @variant drill -->\n<!doctype html>\n<html><body>drill</body></html>";
  assert.throws(() => parseTemplateVariants(tmpl), /variant 'build' has no/);
});

// --- the archetype registry ------------------------------------------------

test("ARCHETYPE_RENDER and the template describe the same archetypes", async () => {
  const { ARCHETYPE_RENDER, parseTemplateVariants } = await load();
  const variants = parseTemplateVariants(fs.readFileSync(TEMPLATE, "utf8"));
  assert.deepEqual(Object.keys(ARCHETYPE_RENDER).sort(), Object.keys(variants).sort());
});

test("only the data.js card archetypes ask for an element-id prefix", async () => {
  const { ARCHETYPE_RENDER } = await load();
  const wantsPrefix = Object.keys(ARCHETYPE_RENDER).filter((k) => ARCHETYPE_RENDER[k].prefix);
  assert.deepEqual(wantsPrefix.sort(), ["build", "drill", "git"]);
});

test("git takes the same resource tail as build and drill", async () => {
  const { ARCHETYPE_RENDER } = await load();
  const tailOf = (k) => ARCHETYPE_RENDER[k].resourceTail;
  assert.equal(tailOf("git"), tailOf("build"));
  assert.equal(tailOf("git"), tailOf("drill"));
  assert.notEqual(tailOf("git"), tailOf("viz"));
  assert.notEqual(tailOf("viz"), tailOf("checkpoint"));
  Object.keys(ARCHETYPE_RENDER).forEach((k) => {
    assert.equal(typeof tailOf(k), "function", k + " must declare a resource tail");
  });
});

// --- the git variant's script tail -----------------------------------------

test("the git variant loads code-lab, the course data, meta, page-shell and data.js", async () => {
  const { parseTemplateVariants } = await load();
  const git = parseTemplateVariants(fs.readFileSync(TEMPLATE, "utf8")).git;
  const srcs = [...git.matchAll(/<script[^>]*src="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(srcs, [
    "../../../../theme-registry.js",
    "../../../../theme-switch.js",
    "../../../../vendor/code-lab/code-lab.global.js",
    "../../../../generated/course-data.js",
    "../../../../generated/concept-index.js",
    "{{META_SRC}}",
    "../../../../page-shell.js",
    "{{DATA_SRC}}",
  ]);
});

test("the git variant carries no Prism and no Monaco loader", async () => {
  const { parseTemplateVariants } = await load();
  const git = parseTemplateVariants(fs.readFileSync(TEMPLATE, "utf8")).git;
  assert.doesNotMatch(git, /prism/i);
  assert.doesNotMatch(git, /monaco/i);
});

test("the git variant ends with data.js so the resource tail can rewrite it", async () => {
  const { parseTemplateVariants } = await load();
  const git = parseTemplateVariants(fs.readFileSync(TEMPLATE, "utf8")).git;
  // applyResourceTail matches this exact two-line static tail (after {{DATA_SRC}}
  // is substituted). If the git variant ever reorders those tags, a voiced git
  // lesson would fail to generate.
  const staticTail =
    '    <script src="../../../../page-shell.js"></script>\n' +
    '    <script src="data.js"></script>';
  assert.ok(
    git.replace("{{DATA_SRC}}", "data.js").includes(staticTail),
    "git variant must keep the build-shaped page-shell + data tail"
  );
});
