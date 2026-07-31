// check-i18n.mjs - static i18n coverage check. For every lesson that declares
// target languages (meta.resources.langs), verify each non-base language bundle
// carries every localizable key the engine will look up - so a half-translated
// lesson (some keys present, others rendering English) fails here, with no
// rendering needed.
//
// It is NOT hardcoded to a language or a lesson list: languages come from each
// lesson's meta.resources.langs; the expected key set is DERIVED from the engine
// structure (the default bundle + the archetype's inline keys + the shared viz
// scene spec in tools/lib/viz-scene-spec.mjs); coverage follows the resolver's
// fallback (resource/resolver.js): a key counts as translated for lang L only if
// it is in a same-lang bundle (voice/L or default/L) - an en-only key resolves to
// English, i.e. untranslated.
//
// Usage: node tools/check-i18n.mjs [--track <t>] [--lang <l>] [--json] [lessonDir ...]
//   exit 1 if any lesson is missing keys for a declared language.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { extractSceneEntries, loadWindowGlobal } from "./lib/viz-scene-spec.mjs";

const REGISTRY = "course-registry.js";
const MAX_LIST = 8; // cap keys shown per finding

function loadMeta(dir) {
  const file = path.join(dir, "meta.js");
  if (!fs.existsSync(file)) return null;
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(file, "utf8"), sandbox, { filename: file });
  return sandbox.window.LESSON_META || null;
}

function readJson(file) {
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

// Lessons from the registry: [{ track, path }]. One row per line.
function lessonsFromRegistry() {
  const src = fs.readFileSync(REGISTRY, "utf8");
  const out = [];
  for (const line of src.split("\n")) {
    const p = line.match(/path:\s*"([^"]+)"/);
    if (!p) continue;
    const t = line.match(/track:\s*"([^"]+)"/);
    out.push({ track: t ? t[1] : "", path: p[1] });
  }
  return out;
}

// The English source value + expected key set for a lesson. englishSource holds
// the authoritative English for each key (bundle value if present, else the
// inline value from meta/viz); ref is the set of keys that MUST be translated.
function referenceFor(dir, meta) {
  const res = meta.resources || {};
  const base = res.base || "res/strings";
  const baseLang = res.lang || "en";
  const enBundle = readJson(path.join(dir, base, "default", baseLang + ".json")) || {};

  const englishSource = { ...enBundle };
  const ref = new Set(Object.keys(enBundle));
  const add = (key, value) => {
    ref.add(key);
    if (!(key in englishSource) && typeof value === "string") englishSource[key] = value;
  };

  // Hero + intro come from meta (inline for viz; also in the bundle for build).
  if (typeof meta.title === "string") add("hero.title", meta.title);
  if (typeof meta.eyebrow === "string") add("hero.eyebrow", meta.eyebrow);
  if (Array.isArray(meta.intro)) {
    meta.intro.forEach((v, i) => { if (typeof v === "string") add("intro." + i, v); });
  }
  // Concept term/def keys for every introduced concept.
  const introduces = (meta.concepts && meta.concepts.introduces) || [];
  for (const c of introduces) {
    if (c && c.id) { add("concept." + c.id + ".term"); add("concept." + c.id + ".def"); }
  }
  // Viz lessons carry legend labels, per-step narration, and scene prose inline.
  if (meta.archetype === "viz") {
    const vizFile = fs.readdirSync(dir).find((f) => f.endsWith(".viz.js"));
    if (vizFile) {
      const viz = loadWindowGlobal(path.join(dir, vizFile));
      (viz.legend || []).forEach((item, i) => { if (item && typeof item.label === "string") add("legend." + i, item.label); });
      (viz.steps || []).forEach((step, i) => { if (step && typeof step.narr === "string") add("step." + i + ".narr", step.narr); });
      for (const [key, eng] of extractSceneEntries(viz)) add(key, eng);
    }
  }
  return { englishSource, ref, base, baseLang };
}

function checkLesson(dir) {
  const meta = loadMeta(dir);
  if (!meta || !meta.resources) return null;
  const res = meta.resources;
  const langs = res.langs || [];
  const voices = res.voices || ["default"];
  const { englishSource, ref, base, baseLang } = referenceFor(dir, meta);
  const targetLangs = langs.filter((l) => l !== baseLang);
  if (targetLangs.length === 0 || ref.size === 0) return null;

  const bundle = (voice, lang) => readJson(path.join(dir, base, voice, lang + ".json")) || {};
  const findings = [];
  for (const lang of targetLangs) {
    const defLang = bundle("default", lang);
    for (const voice of voices) {
      const vLang = voice === "default" ? defLang : bundle(voice, lang);
      // A key is translated for this lang if present in voice/lang or default/lang
      // (the resolver falls back to en only as English = untranslated).
      const has = (k) => Object.prototype.hasOwnProperty.call(vLang, k) || Object.prototype.hasOwnProperty.call(defLang, k);
      const valueOf = (k) => (Object.prototype.hasOwnProperty.call(vLang, k) ? vLang[k] : defLang[k]);
      const missingReq = [];
      const missingTerm = [];
      const identical = [];
      const isTerm = (k) => /^concept\..*\.term$/.test(k);
      const looksProse = (v) => typeof v === "string" && /\p{L}/u.test(v) && v.length >= 4;
      for (const k of ref) {
        if (!has(k)) (isTerm(k) ? missingTerm : missingReq).push(k);
        // A concept term is a controlled label; present == complete, even when a
        // kept tech term (token, LINQ, RAM) legitimately equals English.
        else if (!isTerm(k) && valueOf(k) === englishSource[k] && looksProse(englishSource[k])) identical.push(k);
      }
      if (missingReq.length || missingTerm.length || identical.length) {
        findings.push({ voice, lang, missingReq, missingTerm, identical });
      }
    }
  }
  return { dir, refSize: ref.size, findings };
}

// --- CLI ---
const args = process.argv.slice(2);
const flag = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null; };
const trackFilter = flag("--track");
const langFilter = flag("--lang");
const asJson = args.includes("--json");
const explicit = args.filter((a) => !a.startsWith("--") && a !== trackFilter && a !== langFilter);

let lessons = explicit.length
  ? explicit.map((p) => ({ track: "", path: p }))
  : lessonsFromRegistry();
if (trackFilter) lessons = lessons.filter((l) => l.track === trackFilter);

let checked = 0;
let failLessons = 0;
let warnLessons = 0;
const report = [];
for (const { path: dir } of lessons) {
  const r = checkLesson(dir);
  if (!r) continue;
  let reqHere = 0;
  let advisoryHere = 0;
  const shown = [];
  for (const f of r.findings) {
    if (langFilter && f.lang !== langFilter) continue;
    reqHere += f.missingReq.length;
    advisoryHere += f.missingTerm.length + f.identical.length;
    shown.push(f);
  }
  if (shown.length === 0) { checked += 1; continue; }
  checked += 1;
  if (reqHere) failLessons += 1;
  else if (advisoryHere) warnLessons += 1;
  report.push({ dir: r.dir, refSize: r.refSize, findings: shown });
}

if (asJson) {
  console.log(JSON.stringify({ checked, failLessons, warnLessons, report }, null, 2));
} else {
  const fmt = (arr) => arr.slice(0, MAX_LIST).join(", ") + (arr.length > MAX_LIST ? ", ..." : "");
  for (const r of report) {
    for (const f of r.findings) {
      if (f.missingReq.length) {
        console.log(`FAIL  ${r.dir}  [${f.voice}/${f.lang}]  missing ${f.missingReq.length}/${r.refSize} keys: ${fmt(f.missingReq)}`);
      }
      if (f.missingTerm.length) {
        console.log(`WARN  ${r.dir}  [${f.voice}/${f.lang}]  ${f.missingTerm.length} concept term(s) fall back to English: ${fmt(f.missingTerm)}`);
      }
      if (f.identical.length) {
        console.log(`WARN  ${r.dir}  [${f.voice}/${f.lang}]  ${f.identical.length} value(s) identical to English (maybe untranslated): ${fmt(f.identical)}`);
      }
    }
  }
  console.log(`\n${checked} lesson(s) checked; ${failLessons} with MISSING keys, ${warnLessons} with identical-value warnings.`);
  console.log(failLessons ? "RESULT: FAIL (missing keys render English)" : "RESULT: PASS");
}

process.exit(failLessons ? 1 : 0);
