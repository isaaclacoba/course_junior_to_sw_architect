// seed-viz-scene.mjs - extract a viz lesson's SCENE prose (the text drawn inside
// the MemoryViz widget: transcript messages/captions/notes, agent/agentLoop/
// toolRack/memoryShelf/retrieval prose) and seed it into the lesson's es.json so
// it can be translated. The key scheme MIRRORS resource/bind-viz.js sceneLeaves
// exactly, so extraction and runtime binding round-trip. Code identifiers
// (tool/param names, the emitted call) and structural fields are excluded.
//
// Usage: node tools/seed-viz-scene.mjs [--write] [lessonDir ...]
//   no dirs  -> all content/ai lessons
//   --write  -> merge English scene keys into each es.json (idempotent: never
//               overwrites an existing key); without it, dry-run prints counts.
import fs from "node:fs";
import path from "node:path";
import { extractSceneEntries, loadWindowGlobal } from "./lib/viz-scene-spec.mjs";

// Merge scene keys into es.json before the concept.* keys, keeping existing keys
// and values untouched. Returns the count of keys added.
function seedEsJson(esPath, entries) {
  const es = JSON.parse(fs.readFileSync(esPath, "utf8"));
  const nonConcept = {};
  const concept = {};
  for (const [k, v] of Object.entries(es)) {
    if (k.startsWith("concept.")) concept[k] = v;
    else nonConcept[k] = v;
  }
  let added = 0;
  const scene = {};
  for (const [k, eng] of entries) {
    if (!(k in es)) {
      scene[k] = eng;
      added += 1;
    }
  }
  if (added === 0) return 0;
  const out = { ...nonConcept, ...scene, ...concept };
  fs.writeFileSync(esPath, JSON.stringify(out, null, 2) + "\n");
  return added;
}

function findVizFiles(root) {
  const out = [];
  const walk = (dir) => {
    for (const name of fs.readdirSync(dir)) {
      const full = path.join(dir, name);
      const st = fs.statSync(full);
      if (st.isDirectory()) walk(full);
      else if (name.endsWith(".viz.js")) out.push(full);
    }
  };
  walk(root);
  return out.sort();
}

const args = process.argv.slice(2);
const write = args.includes("--write");
const dirs = args.filter((a) => !a.startsWith("--"));
const vizFiles =
  dirs.length > 0
    ? dirs.map((d) => {
        const found = fs.readdirSync(d).find((f) => f.endsWith(".viz.js"));
        return found ? path.join(d, found) : null;
      }).filter(Boolean)
    : findVizFiles("content/ai");

let totalAdded = 0;
for (const vizFile of vizFiles) {
  const dir = path.dirname(vizFile);
  const esPath = path.join(dir, "res/strings/default/es.json");
  if (!fs.existsSync(esPath)) {
    console.log(`SKIP (no es.json): ${dir}`);
    continue;
  }
  const viz = loadWindowGlobal(vizFile);
  const entries = extractSceneEntries(viz);
  if (write) {
    const added = seedEsJson(esPath, entries);
    totalAdded += added;
    console.log(`${path.basename(dir)}: ${entries.length} scene strings, +${added} new keys`);
  } else {
    console.log(`${path.basename(dir)}: ${entries.length} scene strings`);
  }
}
if (write) console.log(`TOTAL new keys seeded: ${totalAdded}`);
