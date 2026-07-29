/**
 * tools/seed-concepts.mjs - re-seed migrated lessons' meta.js `concepts` from the
 * drafts in docs/concepts/<track>.concepts.json.
 *
 * `new-lesson.mjs` seeds concepts once, at migration time. When the drafts change
 * (e.g. after a vocabulary audit), the already-migrated meta.js are stale - the
 * generator reads meta.js, so it will not pick the change up on its own. Run this
 * to push the current drafts into every migrated lesson's meta.js, then re-run
 * `node tools/generate.mjs`.
 *
 * `concepts` is the last property metaFileText writes, so this replaces the tail
 * of each meta.js from `\n  concepts:` onward. Only Node built-ins.
 */
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
  return sandbox.window[name];
}

// Same serialization new-lesson.mjs uses: an empty graph stays inline.
function conceptsLiteral(concepts) {
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

const drafts = {};
for (const t of ["practical", "theory", "ai"]) {
  const p = path.join(root, "docs", "concepts", t + ".concepts.json");
  if (fs.existsSync(p)) drafts[t] = JSON.parse(fs.readFileSync(p, "utf8"));
}

const reg = loadBrowserGlobal(path.join(root, "course-registry.js"), "CourseRegistry");

let patched = 0, skipped = 0;
for (const l of reg.lessons) {
  if (!l.path) continue; // flat or external - no meta.js yet
  const metaPath = path.join(root, l.path, "meta.js");
  if (!fs.existsSync(metaPath)) { console.log("skip (no meta.js): " + l.id); skipped++; continue; }
  const txt = fs.readFileSync(metaPath, "utf8");
  const idx = txt.indexOf("\n  concepts:");
  if (idx < 0) { console.log("skip (no concepts block): " + l.id); skipped++; continue; }
  // Guard the positional rewrite: the marker must be unique and `concepts` must
  // be the last property (file ends with `};`), or we could corrupt a meta.js.
  if (idx !== txt.lastIndexOf("\n  concepts:") || !/\n\};\s*$/.test(txt)) {
    console.log("skip (unexpected meta.js shape, not rewriting): " + l.id); skipped++; continue;
  }
  const draft = (drafts[l.track] || {})[l.id] || null;
  const next = txt.slice(0, idx) + "\n  concepts: " + conceptsLiteral(draft) + ",\n};\n";
  fs.writeFileSync(metaPath, next);
  patched++;
  console.log("reseeded " + l.id + " (" + ((draft && draft.introduces) || []).length + " introduces)");
}
console.log("PATCHED=" + patched + " SKIPPED=" + skipped);
