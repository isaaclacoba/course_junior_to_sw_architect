/**
 * tools/lib.mjs - shared, dependency-free helpers for the generate / new-lesson /
 * seed-concepts / validate tools. Pure functions only; importing this module runs
 * nothing. Keeping the browser-IIFE loaders and the concept serializer in one
 * place stops the four tools from drifting in how they read or write a meta.js.
 *
 * Only Node built-ins.
 */
import fs from "node:fs";
import vm from "node:vm";

// Run a course IIFE that assigns `window.<name>` and hand back that global
// (throws if it is absent). Used for course-registry.js and a migrated lesson's
// meta.js.
export function loadBrowserGlobal(file, name) {
  const code = fs.readFileSync(file, "utf8");
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: file });
  const value = sandbox.window[name];
  if (!value) throw new Error(`Expected window.${name} after running ${file}`);
  return value;
}

// Run a lesson data/meta IIFE (a pure script that assigns one or more window.*
// globals) and hand back the whole window bag, so a caller can probe for
// window.LESSON_CONFIG / LESSON_META without knowing which.
export function loadWindowBag(file) {
  const code = fs.readFileSync(file, "utf8");
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: file });
  return sandbox.window;
}

// id rule: strip a trailing ".html", else a trailing "/", else use href as-is.
export function idFromHref(href) {
  if (href.endsWith(".html")) return href.slice(0, -".html".length);
  if (href.endsWith("/")) return href.slice(0, -1);
  return href;
}

// Serialize a concept graph as a readable literal; an empty graph stays inline.
// Shared by new-lesson (seed at migration time) and seed-concepts (re-seed after
// a draft change) so the two never disagree on how meta.js `concepts` is written.
export function conceptsLiteral(concepts) {
  const c = concepts || {};
  const norm = { introduces: c.introduces || [], revisits: c.revisits || [], uses: c.uses || [] };
  if (!norm.introduces.length && !norm.revisits.length && !norm.uses.length) {
    return "{ introduces: [], revisits: [], uses: [] }";
  }
  return JSON.stringify(norm, null, 2)
    .split("\n")
    .map((line, i) => (i === 0 ? line : "  " + line))
    .join("\n");
}

// ---------------------------------------------------------------------------
// Non-emptiness: does a lesson actually HAVE a body?
// ---------------------------------------------------------------------------
// Every lesson gate compares a lesson against itself - the i18n round-trip
// snapshots the bound ctx before/after a locale swap, validate walks the config
// it finds, verify-lesson grades the tasks it finds. All three are DRIFT
// detectors, and drift detectors are silent on the empty set: a lesson whose
// config global is missing round-trips perfectly, has no invalid fields, and has
// no failing tasks. Measured 2026-08-03 - renaming window.BUILD_CONFIG in a live
// lesson left all three gates GREEN, with verify-lesson reporting "1 passed"
// having graded zero tasks.
//
// So emptiness has to be asserted, not inferred. Each gate calls lessonBody()
// and refuses to pass a lesson that yielded nothing.
//
// The lesson-engine migration is complete: every archetype sets ONE
// window.LESSON_CONFIG. The old per-archetype globals are gone, so this check now
// ENFORCES the unified name - a lesson that resolves to no config fails loudly.
export const CONFIG_GLOBALS = {
  build: ["LESSON_CONFIG"],
  drill: ["LESSON_CONFIG"],
  git: ["LESSON_CONFIG"],
  viz: ["LESSON_CONFIG"],
  checkpoint: ["LESSON_CONFIG"],
};

// The array that IS the lesson's body, per archetype.
export const BODY_FIELD = { build: "tasks", drill: "tasks", git: "tasks", viz: "steps", checkpoint: "questions" };

// -> { ok:true, global, config, field, count } | { ok:false, reason }
// `reason` is written for a human reading a failing gate, and names the globals
// it looked for so a rename is obvious from the message alone.
export function lessonBody(win, archetype) {
  const names = CONFIG_GLOBALS[archetype];
  const field = BODY_FIELD[archetype];
  if (!names || !field) return { ok: false, reason: `unknown archetype "${archetype}"` };

  const found = names.filter((n) => win && win[n]);
  if (found.length === 0) {
    return { ok: false, reason: `no lesson config - looked for window.${names.join(" / window.")}` };
  }
  if (found.length > 1) {
    return { ok: false, reason: `ambiguous config - both window.${found.join(" and window.")} are set` };
  }
  const global = found[0];
  const config = win[global];
  const body = config[field];
  if (!Array.isArray(body)) {
    return { ok: false, reason: `window.${global}.${field} is ${body === undefined ? "missing" : typeof body}, expected an array` };
  }
  if (body.length === 0) {
    return { ok: false, reason: `window.${global}.${field} is empty - the lesson has no body` };
  }
  return { ok: true, global, config, field, count: body.length };
}
