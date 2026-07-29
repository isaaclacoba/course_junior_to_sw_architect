/**
 * tools/generate.test.mjs - parity + invariants for the generated course data.
 *
 * Loads course-manifest.js (Course) and generated/course-data.js (CourseData)
 * in separate vm sandboxes and asserts the two agree, plus the id invariants.
 * Run: node --test tools/generate.test.mjs
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function loadBrowserGlobal(file, name) {
  const code = fs.readFileSync(file, "utf8");
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: file });
  const value = sandbox.window[name];
  if (!value) throw new Error(`Expected window.${name} after running ${file}`);
  return value;
}

const Course = loadBrowserGlobal(path.join(root, "course-manifest.js"), "Course");
const CourseData = loadBrowserGlobal(path.join(root, "generated", "course-data.js"), "CourseData");

// Registry decides which lessons have migrated (path set -> served from content/).
function idFromHref(href) {
  if (href.endsWith(".html")) return href.slice(0, -".html".length);
  if (href.endsWith("/")) return href.slice(0, -1);
  return href;
}
const registryMap = new Map();
try {
  const reg = loadBrowserGlobal(path.join(root, "course-registry.js"), "CourseRegistry");
  reg.lessons.forEach(function (l) { registryMap.set(l.id, { path: l.path || null, href: l.href }); });
} catch (e) { /* no registry -> all flat */ }

// The href CourseData should expose for a manifest lesson: the registry href
// when migrated, else the manifest href unchanged.
function expectedHref(manifestHref) {
  const reg = registryMap.get(idFromHref(manifestHref));
  return reg && reg.path ? reg.href : manifestHref;
}
function isMigrated(manifestHref) {
  const reg = registryMap.get(idFromHref(manifestHref));
  return !!(reg && reg.path);
}

// Fields that must always match the manifest for FLAT lessons. (Migrated lessons
// take these from their own meta.js, so only href is asserted for them.)
const PROJECTED = ["key", "total", "title", "blurb", "pill", "time", "kind"];

function courseLessons() {
  const out = [];
  Course.tracks().forEach(function (t) {
    t.parts.forEach(function (p) {
      p.lessons.forEach(function (l) { out.push(l); });
    });
  });
  return out;
}

function courseDataLessons() {
  const out = [];
  CourseData.tracks().forEach(function (t) {
    t.parts.forEach(function (p) {
      p.lessons.forEach(function (l) { out.push(l); });
    });
  });
  return out;
}

test("order() matches the registry-adjusted manifest order per track", () => {
  Course.tracks().forEach(function (t) {
    const expected = [...Course.order(t.id)].map(expectedHref);
    // Arrays cross vm realms, so copy into this realm before deep-comparing.
    assert.deepEqual([...CourseData.order(t.id)], expected, `order mismatch for ${t.id}`);
  });
});

test("id order matches the manifest order per track (migration-invariant)", () => {
  Course.tracks().forEach(function (t) {
    const manifestIds = [...Course.order(t.id)].map(idFromHref);
    const dataIds = CourseData.tracks()
      .find(function (x) { return x.id === t.id; })
      .parts.reduce(function (acc, p) {
        return acc.concat(p.lessons.map(function (l) { return l.id; }));
      }, []);
    assert.deepEqual(dataIds, manifestIds, `id order mismatch for ${t.id}`);
  });
});

test("lesson counts agree and equal the register-entry count", () => {
  const fromCourse = courseLessons().length;
  const fromData = courseDataLessons().length;
  assert.equal(fromData, fromCourse, "CourseData vs Course lesson count");
  // register entries == number of lessons walked from Course (source of truth).
  assert.equal(fromCourse, 76, "expected 76 register entries");
});

test("flat lessons keep manifest fields; migrated lessons take the registry href", () => {
  const a = courseLessons();
  const b = courseDataLessons();
  assert.equal(a.length, b.length);
  for (let i = 0; i < a.length; i++) {
    assert.deepEqual(b[i].href, expectedHref(a[i].href), `href mismatch at lesson ${i} (${a[i].href})`);
    if (!isMigrated(a[i].href)) {
      PROJECTED.forEach(function (f) {
        assert.deepEqual(b[i][f], a[i][f], `field ${f} mismatch at flat lesson ${i} (${a[i].href})`);
      });
    }
  }
});

test("every lesson has a unique non-empty string id, and locateById agrees with locate", () => {
  const lessons = courseDataLessons();
  const ids = new Set();
  lessons.forEach(function (l) {
    assert.equal(typeof l.id, "string", `id not a string for ${l.href}`);
    assert.ok(l.id.length > 0, `empty id for ${l.href}`);
    assert.ok(!ids.has(l.id), `duplicate id ${l.id}`);
    ids.add(l.id);

    const byHref = CourseData.locate(l.href);
    const byId = CourseData.locateById(l.id);
    assert.ok(byHref, `locate returned null for ${l.href}`);
    assert.ok(byId, `locateById returned null for ${l.id}`);
    assert.equal(byId.track, byHref.track, `track mismatch for ${l.id}`);
    assert.equal(byId.index, byHref.index, `index mismatch for ${l.id}`);
  });
});

test("capstone has id 'level3-app' and kind 'final'", () => {
  const cap = courseDataLessons().find(function (l) { return l.href === "level3-app/"; });
  assert.ok(cap, "capstone lesson not found");
  assert.equal(cap.id, "level3-app");
  assert.equal(cap.kind, "final");
});
