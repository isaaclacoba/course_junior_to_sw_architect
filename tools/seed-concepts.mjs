/**
 * tools/seed-concepts.mjs - re-seed migrated lessons' meta.js `concepts` from the
 * drafts in docs/concepts/<track>.concepts.json.
 *
 * `new-lesson.mjs` seeds concepts once, at migration time. When the drafts change
 * (e.g. after a vocabulary audit), the already-migrated lessons are stale - the
 * generator reads them, so it will not pick the change up on its own. Run this to
 * push the current drafts down: the GRAPH (ids + relationships) into each meta.js,
 * and the TEXT (term/def) into that lesson's res/strings/default/en.json as
 * `concept.<id>.term/.def`. Then re-run `node tools/generate.mjs`.
 *
 * `concepts` is the last property metaFileText writes, so this replaces the tail
 * of each meta.js from `\n  concepts:` onward. Only Node built-ins.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadBrowserGlobal, conceptsLiteral } from "./lib.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

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
  // Text (term/def) is a resource: seed it into res/strings/default/en.json.
  const intro = (draft && draft.introduces) || [];
  if (intro.length) {
    const enDir = path.join(root, l.path, "res", "strings", "default");
    const enPath = path.join(enDir, "en.json");
    let en = {};
    if (fs.existsSync(enPath)) en = JSON.parse(fs.readFileSync(enPath, "utf8"));
    else fs.mkdirSync(enDir, { recursive: true });
    for (const x of intro) {
      if (x.term != null) en["concept." + x.id + ".term"] = x.term;
      if (x.def != null) en["concept." + x.id + ".def"] = x.def;
    }
    fs.writeFileSync(enPath, JSON.stringify(en, null, 2) + "\n");
  }
  // Graph (ids + relationships) is metadata: seed the stripped block into meta.js.
  const stripped = draft
    ? { introduces: intro.map((x) => ({ id: x.id })), revisits: draft.revisits || [], uses: draft.uses || [] }
    : null;
  const next = txt.slice(0, idx) + "\n  concepts: " + conceptsLiteral(stripped) + ",\n};\n";
  fs.writeFileSync(metaPath, next);
  patched++;
  console.log("reseeded " + l.id + " (" + ((draft && draft.introduces) || []).length + " introduces)");
}
console.log("PATCHED=" + patched + " SKIPPED=" + skipped);
