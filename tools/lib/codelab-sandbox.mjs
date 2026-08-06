/**
 * tools/lib/codelab-sandbox.mjs - run browser-shaped course code under Node.
 *
 * Two jobs, both extracted verbatim from tools/verify-lesson.mjs so the verifier
 * and its unit tests load the SAME runtime instead of each growing a sandbox:
 *
 *   loadInWindow(file) - run a lesson data/meta IIFE and hand back the window bag.
 *   loadCodeLab()      - run the VENDORED code-lab IIFE once and hand back
 *                        window.CodeLab (the viz scene resolvers, and the git
 *                        model + CLI the git validator replays commands through).
 *
 * The vendored bundle is deliberately the source of the git runtime rather than
 * the TypeScript in the code-lab submodule: it is the exact artefact the browser
 * ships, it needs no extra toolchain (tsx exists only inside
 * code-lab/node_modules), and verifying against it also catches a stale
 * re-vendor - a bundle whose git ops are missing fails the gate instead of
 * silently skipping it.
 *
 * Node built-ins only.
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const repoRoot = path.resolve(__dirname, "..", "..");

// A bare window with just enough DOM to let a browser IIFE finish evaluating.
export function makeWindow() {
  const noop = () => {};
  const elFactory = () => ({
    style: {}, dataset: {}, classList: { add: noop, remove: noop, toggle: noop, contains: () => false },
    appendChild: noop, setAttribute: noop, addEventListener: noop, remove: noop,
    querySelector: () => null, querySelectorAll: () => [], insertAdjacentHTML: noop,
    getContext: () => ({}), children: [], set innerHTML(_) {}, get innerHTML() { return ""; },
  });
  const win = {
    console, setTimeout: noop, clearTimeout: noop, setInterval: noop, clearInterval: noop,
    requestAnimationFrame: noop, cancelAnimationFrame: noop, matchMedia: () => ({ matches: false, addEventListener: noop }),
    navigator: { userAgent: "node", language: "en" }, location: { search: "", href: "" },
    localStorage: { getItem: () => null, setItem: noop, removeItem: noop },
    // Standard in every browser and in Node. Absent from a bare vm context, and
    // a bundle that touches one at load time then throws and hands back an EMPTY
    // CodeLab - which reads as "the runtime is missing" rather than "this global
    // is". Cheaper to provide them than to debug that twice.
    TextEncoder, TextDecoder,
    document: {
      createElement: elFactory, createElementNS: elFactory, createTextNode: () => ({}),
      getElementById: () => null, querySelector: () => null, querySelectorAll: () => [],
      addEventListener: noop, body: elFactory(), head: elFactory(), documentElement: elFactory(),
    },
    addEventListener: noop,
  };
  win.window = win; win.self = win; win.globalThis = win; win.top = win;
  return win;
}

export function loadInWindow(file) {
  const src = fs.readFileSync(file, "utf8");
  const win = makeWindow();
  // A generated page loads the vendored bundle BEFORE the lesson data file, so a
  // data file may use CodeLab - a git viz builds each step by replaying real
  // commands through CodeLab.gitRun, which is what stops the theory picture and
  // the practical board drifting apart. Without this the checker would reject
  // such a lesson for a difference between itself and the browser. Lazy, so a
  // file that never touches it pays nothing.
  Object.defineProperty(win, "CodeLab", {
    configurable: true,
    get() { return loadCodeLab(); },
  });
  vm.createContext(win);
  vm.runInContext(src, win, { filename: file, timeout: 10000 });
  return win;
}

let _codelab = null;
export function loadCodeLab(bundle = path.join(repoRoot, "vendor", "code-lab", "code-lab.global.js")) {
  if (_codelab) return _codelab;
  const win = makeWindow();
  vm.createContext(win);
  try { vm.runInContext(fs.readFileSync(bundle, "utf8"), win, { filename: bundle, timeout: 15000 }); }
  catch (e) { /* the bundle touches browser APIs after defining exports; ignore */ }
  _codelab = win.CodeLab || (win.window && win.window.CodeLab) || {};
  return _codelab;
}
