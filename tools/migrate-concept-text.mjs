/**
 * tools/migrate-concept-text.mjs - one-shot migration.
 *
 * Concept text is a resource, not metadata. This moves each concept's `term`/
 * `def` OUT of the lesson's meta.js `concepts.introduces[]` INTO that lesson's
 * `res/strings/default/en.json` as `concept.<id>.term` / `concept.<id>.def`,
 * then strips `introduces[]` down to `{ id }` (leaving the graph in meta.js).
 *
 * It reads the CURRENT meta.js (not the drafts) so the English text is copied
 * verbatim - `generate.mjs` must then emit a byte-identical concept-index.js.
 * Idempotent: a lesson whose `introduces[]` already carry no term/def is skipped.
 * Only Node built-ins. Run once, then `node tools/generate.mjs`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadBrowserGlobal, conceptsLiteral } from "./lib.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const reg = loadBrowserGlobal(path.join(root, "course-registry.js"), "CourseRegistry");

let patched = 0, skipped = 0, enCreated = 0;
for (const l of reg.lessons) {
  if (!l.path) continue; // external card - no meta.js
  const metaPath = path.join(root, l.path, "meta.js");
  if (!fs.existsSync(metaPath)) { console.log("skip (no meta.js): " + l.id); skipped++; continue; }

  const meta = loadBrowserGlobal(metaPath, "LESSON_META");
  const c = (meta && meta.concepts) || {};
  const introduces = c.introduces || [];
  if (!introduces.length) { skipped++; continue; }
  if (!introduces.some((x) => x.term != null || x.def != null)) { skipped++; continue; } // already stripped

  // 1. Text -> res/strings/default/en.json (merge into existing prose keys).
  const enDir = path.join(root, l.path, "res", "strings", "default");
  const enPath = path.join(enDir, "en.json");
  let en = {};
  if (fs.existsSync(enPath)) {
    en = JSON.parse(fs.readFileSync(enPath, "utf8"));
  } else {
    fs.mkdirSync(enDir, { recursive: true });
    enCreated++;
  }
  for (const x of introduces) {
    if (x.term != null) en["concept." + x.id + ".term"] = x.term;
    if (x.def != null) en["concept." + x.id + ".def"] = x.def;
  }
  fs.writeFileSync(enPath, JSON.stringify(en, null, 2) + "\n");

  // 2. Strip meta.js introduces[] to { id }; keep revisits/uses; reuse the same
  //    serializer + positional rewrite seed-concepts.mjs uses.
  const stripped = {
    introduces: introduces.map((x) => ({ id: x.id })),
    revisits: c.revisits || [],
    uses: c.uses || []
  };
  const txt = fs.readFileSync(metaPath, "utf8");
  const idx = txt.indexOf("\n  concepts:");
  if (idx < 0 || idx !== txt.lastIndexOf("\n  concepts:") || !/\n\};\s*$/.test(txt)) {
    console.log("SKIP meta rewrite (unexpected shape): " + l.id); skipped++; continue;
  }
  fs.writeFileSync(metaPath, txt.slice(0, idx) + "\n  concepts: " + conceptsLiteral(stripped) + ",\n};\n");
  patched++;
}
console.log(`PATCHED=${patched} SKIPPED=${skipped} EN_CREATED=${enCreated}`);
