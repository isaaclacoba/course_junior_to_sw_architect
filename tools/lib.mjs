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
// (throws if it is absent). Used for course-manifest.js, course-registry.js,
// and a migrated lesson's meta.js.
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
// BUILD_CONFIG / DRILL_CONFIG / QUIZ_CONFIG / LESSON_META without knowing which.
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
