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
import vm from "node:vm";

const SCENE_PROPS = ["transcript", "agent", "agentLoop", "toolRack", "memoryShelf", "retrieval", "plan"];

function sceneLeaves(type, sc) {
  const out = [];
  const push = (suffix, p) => out.push([suffix, p]);
  if (type === "transcript") {
    push("caption", ["caption"]);
    (sc.messages || []).forEach((m, j) => {
      push(`msg.${j}.text`, ["messages", j, "text"]);
      push(`msg.${j}.note`, ["messages", j, "note"]);
    });
  } else if (type === "agent") {
    push("stripCaption", ["stripCaption"]);
    push("coreSub", ["core", "sub"]);
  } else if (type === "agentLoop") {
    push("goal", ["goal"]);
    push("think", ["think"]);
    (sc.ctx || []).forEach((_, j) => push(`ctx.${j}`, ["ctx", j]));
    (sc.chips || []).forEach((_, j) => push(`chip.${j}`, ["chips", j]));
  } else if (type === "toolRack") {
    push("caption", ["caption"]);
    push("banner", ["banner"]);
    (sc.tools || []).forEach((_, j) => push(`tool.${j}.desc`, ["tools", j, "desc"]));
  } else if (type === "memoryShelf") {
    push("caption", ["caption"]);
    push("workingCaption", ["workingCaption"]);
    (sc.working || []).forEach((_, j) => push(`work.${j}`, ["working", j, "text"]));
    const stores = sc.stores || {};
    Object.keys(stores).forEach((k) => {
      (stores[k] || []).forEach((_, j) => push(`store.${k}.${j}`, ["stores", k, j, "text"]));
    });
  } else if (type === "retrieval") {
    push("caption", ["caption"]);
    push("query", ["query"]);
    (sc.docs || []).forEach((_, j) => push(`doc.${j}`, ["docs", j, "text"]));
  } else if (type === "plan") {
    push("caption", ["caption"]);
    push("goal", ["goal"]);
    (sc.steps || []).forEach((_, j) => {
      push(`pstep.${j}.text`, ["steps", j, "text"]);
      push(`pstep.${j}.note`, ["steps", j, "note"]);
    });
  }
  return out;
}

function getPath(obj, p) {
  let cur = obj;
  for (const k of p) {
    if (cur == null) return undefined;
    cur = cur[k];
  }
  return cur;
}

// Load a viz.js file and return its window.LESSON_VIZ.
function loadViz(vizFile) {
  const src = fs.readFileSync(vizFile, "utf8");
  const sandbox = { window: {} };
  vm.runInNewContext(src, sandbox, { filename: vizFile });
  return sandbox.window.LESSON_VIZ;
}

// Extract [key, english] scene entries for a lesson's viz.
function extractScene(viz) {
  const entries = [];
  const steps = (viz && viz.steps) || [];
  steps.forEach((step, i) => {
    if (!step) return;
    for (const type of SCENE_PROPS) {
      const sc = step[type];
      if (!sc) continue;
      for (const [suffix, p] of sceneLeaves(type, sc)) {
        const v = getPath(sc, p);
        if (typeof v === "string" && v.trim() !== "") entries.push([`step.${i}.${suffix}`, v]);
      }
      break; // one scene per step
    }
  });
  return entries;
}

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
  const viz = loadViz(vizFile);
  const entries = extractScene(viz);
  if (write) {
    const added = seedEsJson(esPath, entries);
    totalAdded += added;
    console.log(`${path.basename(dir)}: ${entries.length} scene strings, +${added} new keys`);
  } else {
    console.log(`${path.basename(dir)}: ${entries.length} scene strings`);
  }
}
if (write) console.log(`TOTAL new keys seeded: ${totalAdded}`);
