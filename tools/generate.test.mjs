/**
 * tools/generate.test.mjs - invariants for the generated course data.
 *
 * Loads course-registry.js (CourseRegistry - the source of the course path) and
 * generated/course-data.js (CourseData - the built facade) in vm sandboxes and
 * asserts the two agree on order, ids, and per-lesson fields. No
 * manifest. Run: node --test tools/generate.test.mjs
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function loadGlobal(file, name) {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(file, "utf8"), sandbox, { filename: file });
  const value = sandbox.window[name];
  if (!value) throw new Error(`Expected window.${name} after running ${file}`);
  return value;
}
function loadMeta(relPath) {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(root, relPath, "meta.js"), "utf8"), sandbox);
  return sandbox.window.LESSON_META;
}

const Registry = loadGlobal(path.join(root, "course-registry.js"), "CourseRegistry");
const CourseData = loadGlobal(path.join(root, "generated", "course-data.js"), "CourseData");

function dataLessons() {
  const out = [];
  CourseData.tracks().forEach(function (t) {
    t.parts.forEach(function (p) { p.lessons.forEach(function (l) { out.push(l); }); });
  });
  return out;
}

test("CourseData href order per track matches the registry order", () => {
  Registry.tracks.forEach(function (t) {
    const regHrefs = Registry.lessons.filter(function (l) { return l.track === t.id; }).map(function (l) { return l.href; });
    assert.deepEqual([...CourseData.order(t.id)], [...regHrefs], `order mismatch for ${t.id}`);
  });
});

test("CourseData id order per track matches the registry", () => {
  Registry.tracks.forEach(function (t) {
    const regIds = Registry.lessons.filter(function (l) { return l.track === t.id; }).map(function (l) { return l.id; });
    const dataIds = CourseData.tracks().find(function (x) { return x.id === t.id; })
      .parts.reduce(function (acc, p) { return acc.concat(p.lessons.map(function (l) { return l.id; })); }, []);
    assert.deepEqual([...dataIds], [...regIds], `id order mismatch for ${t.id}`);
  });
});

test("lesson count equals the registry length (75)", () => {
  assert.equal(dataLessons().length, Registry.lessons.length);
  assert.equal(Registry.lessons.length, 75, "expected 75 registry lessons");
});

test("part kickers derive from partPrefix + position", () => {
  assert.equal(CourseData.track("practical").parts[0].kicker, "Part one");
  assert.equal(CourseData.track("theory").parts[0].kicker, "Theory \u00b7 Part one");
  assert.equal(CourseData.track("ai").parts[3].kicker, "AI \u00b7 Part four");
});

test("each migrated lesson's card fields come from its meta.js", () => {
  const byId = {};
  dataLessons().forEach(function (l) { byId[l.id] = l; });
  Registry.lessons.forEach(function (line) {
    if (!line.path) return; // skip any line without a content path
    const meta = loadMeta(line.path);
    const card = byId[line.id];
    ["title", "blurb", "pill", "time", "key", "total"].forEach(function (f) {
      assert.deepEqual(card[f], meta[f], `field ${f} mismatch for ${line.id}`);
    });
    assert.equal(card.href, line.href, `href mismatch for ${line.id}`);
    assert.equal(card.kind, "lesson", `kind mismatch for ${line.id}`);
  });
});

test("every lesson id is unique + non-empty; locateById agrees with locate", () => {
  const ids = new Set();
  dataLessons().forEach(function (l) {
    assert.equal(typeof l.id, "string", `id not a string for ${l.href}`);
    assert.ok(l.id.length > 0, `empty id for ${l.href}`);
    assert.ok(!ids.has(l.id), `duplicate id ${l.id}`);
    ids.add(l.id);
    const byHref = CourseData.locate(l.href);
    const byId = CourseData.locateById(l.id);
    assert.ok(byHref && byId, `locate/locateById null for ${l.id}`);
    assert.equal(byId.track, byHref.track, `track mismatch for ${l.id}`);
    assert.equal(byId.index, byHref.index, `index mismatch for ${l.id}`);
  });
});
