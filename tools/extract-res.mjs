/**
 * tools/extract-res.mjs - lift a BUILD lesson's teaching prose out of its inline
 * data.js into per-voice res/strings bundles, leaving data.js as mechanics only.
 *
 * Contract:
 *   node tools/extract-res.mjs <lessonDir> [--lang en] [--voices default,child,academic] [--write]
 *
 * For a build lesson (meta.archetype === "build") it:
 *   - emits res/strings/default/<lang>.json holding the VERBATIM current prose,
 *     keyed in the exact resource/bind-build.js schema order (task.N.title,
 *     .concept, .context, .goal.i and, for the recap task, .summaryIntro,
 *     .summaryItems.i.title|text, .summaryClose). The DEFAULT bundle carries NO
 *     intro.* keys - the default voice keeps its inline meta intro; only a
 *     non-default voice supplies an intro. So the default bundle is task.* only.
 *   - rewrites data.js to mechanics only: each task keeps example/expected/
 *     requireSource/verify/starter/solution and the `summary: true` flag; the
 *     voiced fields (title, concept, context, goal, summaryIntro, summaryItems,
 *     summaryClose) are removed. The window.BUILD_CONFIG wrapper and the file
 *     header comment are preserved.
 *   - adds meta.resources = { base, lang, voices } to meta.js if absent.
 *   - for each non-default voice, writes an empty stub bundle {} (falls back to
 *     default until authored).
 *
 * DRY-RUN by default (prints what it WOULD write); mutates only with --write.
 * The extracted default bundle values are byte-identical to the original inline
 * strings, so the rendered default page is unchanged.
 *
 * Only Node built-ins. Style mirrors tools/generate.mjs.
 */
import fs from "node:fs";
import path from "node:path";
import { loadWindowBag } from "./lib.mjs";

// The voiced fields lifted out of every task into the string bundles.
const VOICED = new Set([
  "title", "concept", "context", "goal",
  "summaryIntro", "summaryItems", "summaryClose",
]);

// ---------------------------------------------------------------------------
// Arg parsing
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const out = { lessonDir: null, lang: "en", voices: ["default"], write: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--write") out.write = true;
    else if (a === "--lang") out.lang = argv[++i];
    else if (a === "--voices") out.voices = String(argv[++i]).split(",").map((s) => s.trim()).filter(Boolean);
    else if (!a.startsWith("--") && out.lessonDir === null) out.lessonDir = a;
  }
  if (!out.voices.includes("default")) out.voices.unshift("default");
  return out;
}

// ---------------------------------------------------------------------------
// JS literal serializer (mechanics data.js) - handles the value shapes a build
// task uses: strings, numbers, booleans, RegExp (requireSource patterns), plain
// objects and arrays. Deterministic, insertion-ordered.
// ---------------------------------------------------------------------------

function isRegExp(v) { return Object.prototype.toString.call(v) === "[object RegExp]"; }
function isIdent(k) { return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k); }
function keyStr(k) { return isIdent(k) ? k : JSON.stringify(k); }

function serializeJs(v, indent) {
  const pad = "  ".repeat(indent);
  const padIn = "  ".repeat(indent + 1);
  if (v === null) return "null";
  const t = typeof v;
  if (t === "string") return JSON.stringify(v);
  if (t === "number" || t === "boolean") return String(v);
  if (isRegExp(v)) return v.toString();
  if (Array.isArray(v)) {
    if (v.length === 0) return "[]";
    const items = v.map((x) => padIn + serializeJs(x, indent + 1));
    return "[\n" + items.join(",\n") + "\n" + pad + "]";
  }
  if (t === "object") {
    const keys = Object.keys(v);
    if (keys.length === 0) return "{}";
    const items = keys.map((k) => padIn + keyStr(k) + ": " + serializeJs(v[k], indent + 1));
    return "{\n" + items.join(",\n") + "\n" + pad + "}";
  }
  return "undefined";
}

// ---------------------------------------------------------------------------
// Extraction
// ---------------------------------------------------------------------------

// Build the default string bundle in exact bind-build schema order, verbatim.
export function buildDefaultBundle(tasks) {
  const out = {};
  tasks.forEach((t, i) => {
    const n = i + 1;
    if (t.title !== undefined) out[`task.${n}.title`] = t.title;
    if (t.concept !== undefined) out[`task.${n}.concept`] = t.concept;
    if (t.context !== undefined) out[`task.${n}.context`] = t.context;
    if (Array.isArray(t.goal)) t.goal.forEach((g, gi) => { out[`task.${n}.goal.${gi}`] = g; });
    if (t.summary) {
      if (t.summaryIntro !== undefined) out[`task.${n}.summaryIntro`] = t.summaryIntro;
      if (Array.isArray(t.summaryItems)) {
        t.summaryItems.forEach((it, ii) => {
          if (it && it.title !== undefined) out[`task.${n}.summaryItems.${ii}.title`] = it.title;
          if (it && it.text !== undefined) out[`task.${n}.summaryItems.${ii}.text`] = it.text;
        });
      }
      if (t.summaryClose !== undefined) out[`task.${n}.summaryClose`] = t.summaryClose;
    }
  });
  return out;
}

// A task with every voiced field removed (mechanics + the summary flag remain).
function stripTask(t) {
  const out = {};
  for (const k of Object.keys(t)) {
    if (VOICED.has(k)) continue;
    out[k] = t[k];
  }
  return out;
}

// Reconstruct data.js: preserved header comment + IIFE wrapper + stripped tasks +
// the BUILD_CONFIG wrapper (tasks referenced by the const, other keys verbatim).
export function buildMechanicsDataJs(rawDataJs, config, strippedTasks) {
  const iifeIdx = rawDataJs.indexOf("(function");
  const header = iifeIdx > 0 ? rawDataJs.slice(0, iifeIdx).replace(/\s+$/, "") : "";

  const tasksLiteral = serializeJs(strippedTasks, 1);

  const cfgLines = [];
  for (const k of Object.keys(config)) {
    if (k === "tasks") { cfgLines.push("    tasks,"); continue; }
    cfgLines.push("    " + keyStr(k) + ": " + serializeJs(config[k], 2) + ",");
  }

  return (
    (header ? header + "\n" : "") +
    "(function () {\n" +
    '  "use strict";\n\n' +
    "  const tasks = " + tasksLiteral + ";\n\n" +
    "  window.BUILD_CONFIG = {\n" +
    cfgLines.join("\n") + "\n" +
    "  };\n" +
    "})();\n"
  );
}

// Insert a resources block into a meta.js source if it has none. Placed before
// the `concepts:` key (matching the pilot), else before the closing `};`.
export function insertResources(rawMeta, lang, voices) {
  const block =
    "  resources: {\n" +
    '    base: "res/strings",\n' +
    "    lang: " + JSON.stringify(lang) + ",\n" +
    "    voices: [" + voices.map((v) => JSON.stringify(v)).join(", ") + "],\n" +
    "  },\n";

  const conceptsIdx = rawMeta.indexOf("\n  concepts:");
  if (conceptsIdx >= 0) {
    return rawMeta.slice(0, conceptsIdx + 1) + block + rawMeta.slice(conceptsIdx + 1);
  }
  const closeIdx = rawMeta.lastIndexOf("\n};");
  if (closeIdx >= 0) {
    return rawMeta.slice(0, closeIdx + 1) + block + rawMeta.slice(closeIdx + 1);
  }
  throw new Error("insertResources: could not find a concepts: anchor or closing }; in meta.js");
}

function jsonBundle(obj) {
  return JSON.stringify(obj, null, 2) + "\n";
}

// Plan the full set of writes for a lesson dir (pure; no disk mutation).
export function planExtraction(lessonDir, opts) {
  const metaPath = path.join(lessonDir, "meta.js");
  const dataPath = path.join(lessonDir, "data.js");

  const meta = loadWindowBag(metaPath).LESSON_META;
  if (!meta) throw new Error(`meta.js in ${lessonDir} did not set window.LESSON_META`);
  if (meta.archetype !== "build") {
    throw new Error(`extract-res only handles build lessons; ${lessonDir} archetype is ${JSON.stringify(meta.archetype)}`);
  }

  const config = loadWindowBag(dataPath).BUILD_CONFIG;
  if (!config || !Array.isArray(config.tasks)) {
    throw new Error(`data.js in ${lessonDir} has no window.BUILD_CONFIG.tasks`);
  }

  const rawData = fs.readFileSync(dataPath, "utf8");
  const rawMeta = fs.readFileSync(metaPath, "utf8");

  const defaultBundle = buildDefaultBundle(config.tasks);
  const strippedTasks = config.tasks.map(stripTask);
  const dataJs = buildMechanicsDataJs(rawData, config, strippedTasks);

  const writes = [];
  writes.push({
    path: path.join(lessonDir, "res", "strings", "default", `${opts.lang}.json`),
    content: jsonBundle(defaultBundle),
    label: "default bundle",
  });
  writes.push({ path: dataPath, content: dataJs, label: "mechanics data.js" });

  const metaHasResources = meta.resources !== undefined;
  if (!metaHasResources) {
    writes.push({
      path: metaPath,
      content: insertResources(rawMeta, opts.lang, opts.voices),
      label: "meta.js (+resources)",
    });
  }

  for (const voice of opts.voices) {
    if (voice === "default") continue;
    writes.push({
      path: path.join(lessonDir, "res", "strings", voice, `${opts.lang}.json`),
      content: "{}\n",
      label: `stub bundle (${voice})`,
    });
  }

  return {
    meta,
    config,
    defaultBundle,
    strippedTasks,
    metaHadResources: metaHasResources,
    writes,
  };
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (!opts.lessonDir) {
    console.error("usage: node tools/extract-res.mjs <lessonDir> [--lang en] [--voices default,child,academic] [--write]");
    process.exit(2);
  }
  const lessonDir = path.resolve(opts.lessonDir);

  const plan = planExtraction(lessonDir, opts);
  const keyCount = Object.keys(plan.defaultBundle).length;

  console.log(`Lesson : ${lessonDir}`);
  console.log(`Tasks  : ${plan.config.tasks.length} (default bundle keys: ${keyCount})`);
  console.log(`Lang   : ${opts.lang}   Voices: ${opts.voices.join(", ")}`);
  console.log(`Meta   : ${plan.metaHadResources ? "already had resources (unchanged)" : "adding resources block"}`);
  console.log(opts.write ? "Writing:" : "Would write (dry-run; pass --write to apply):");
  for (const w of plan.writes) {
    console.log(`  - ${path.relative(lessonDir, w.path)}  [${w.label}]`);
  }

  if (opts.write) {
    for (const w of plan.writes) {
      fs.mkdirSync(path.dirname(w.path), { recursive: true });
      fs.writeFileSync(w.path, w.content);
    }
    console.log(`Wrote ${plan.writes.length} file(s).`);
  }
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname);
if (isMain) main();
