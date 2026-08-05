/**
 * tools/validate.mjs - Phase-0 concept-index pipeline validator.
 *
 * Loads the browser IIFE `course-registry.js` (window.CourseRegistry) in a Node
 * `vm` sandbox - the same technique tools/generate.mjs uses - then runs a set of
 * integrity checks and exits non-zero on any ERROR. WARN lines are printed but
 * never fail the build.
 *
 * Node built-ins only, no deps.
 *
 * Checks:
 *   1. Registry integrity - ids unique; every non-external line is migrated with
 *      its dir + meta.js present.
 *   3. Concept graph - scans migrated content/**\/meta.js (window.LESSON_META):
 *      unknown revisits/uses id (ERROR), concept introduced by >1 lesson (ERROR),
 *      introduced-but-unused orphan (WARN), fully untagged migrated lesson (WARN).
 *   4. Migrated-lesson coherence - meta.id == dir lesson id == registry id (ERROR);
 *      meta.total is a number on a build/drill lesson (ERROR).
 *   5. Checkpoint concept tags - each theory-check-* question's conceptId (in its
 *      data.js LESSON_CONFIG) must resolve to an introduced concept (ERROR); an
 *      untagged question is a WARN.
 *   5b. In-prose mentions - a [[concept:id|label]] marker in a migrated data.js
 *      must reference an introduced concept id (ERROR); a typo would otherwise
 *      render as a dead "Definition not found" chip with no build signal.
 *   5c. Concept-text coverage (Phase-A i18n gate) - concept.<id>.def/.term keys
 *      in a lesson's res bundles must reference an introduced id (ERROR), only in
 *      the OWNER lesson (ERROR), and once a (voice,lang) bundle declares any
 *      concept text it must define every introduced concept (missing .def ERROR).
 *      Inert until concepts are migrated into the bundles.
 *   6. Drift guard - shells `node tools/generate.mjs --out <tmp>` and diffs the
 *      result (course-data.js, concept-index.js AND every migrated index.html)
 *      against what is committed (ERROR). Opt-in via VALIDATE_DRIFT=1; skipped by
 *      default (a sibling agent may be editing generate.mjs).
 *
 * The check functions are pure and exported so a harness can drive them on
 * synthetic fixtures without touching the live repo.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { loadBrowserGlobal, idFromHref, loadWindowBag, lessonBody } from "./lib.mjs";

const structure = createRequire(import.meta.url)("../kernel/grading/structure-match.js");
import { loadCodeLab } from "./lib/codelab-sandbox.mjs";
import { createValidators } from "./lib/lesson-validators.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const registryPath = path.join(root, "course-registry.js");
const generatedDir = path.join(root, "generated");
const generatePath = path.join(root, "tools", "generate.mjs");

// ---------------------------------------------------------------------------
// Loading helpers (shared with the other tools via tools/lib.mjs)
// ---------------------------------------------------------------------------

// Re-exported so a test harness can keep importing them from validate.mjs.
export { loadBrowserGlobal, idFromHref };

// The lesson id encoded by a migrated dir: last path segment minus its "NN-"
// ordering prefix. content/practical/02-everyday/07-type-conversion -> type-conversion.
export function dirLessonId(lessonPath) {
  const base = lessonPath.replace(/[/\\]+$/, "").split(/[/\\]/).pop() || "";
  return base.replace(/^\d+-/, "");
}

// ---------------------------------------------------------------------------
// Report collector
// ---------------------------------------------------------------------------

export function makeReport() {
  const errors = [];
  const warns = [];
  return {
    errors,
    warns,
    error(msg) { errors.push(msg); },
    warn(msg) { warns.push(msg); },
  };
}

// ---------------------------------------------------------------------------
// Pure checks (inject predicates so fixtures need no real filesystem)
// ---------------------------------------------------------------------------

// Check 1: ids unique; each non-external line resolvable.
//   deps: { dirExists(fsPath)->bool, fileExists(fsPath)->bool, rootDir }
export function checkRegistry(lessons, deps, report) {
  const { dirExists, fileExists, rootDir } = deps;
  const seen = new Set();
  for (const l of lessons) {
    if (seen.has(l.id)) report.error(`Registry: duplicate id "${l.id}"`);
    seen.add(l.id);

    if (l.kind === "external") continue; // exempt from dir/meta checks

    if (l.path == null) {
      // Post-manifest: a non-external lesson must be migrated (have a path).
      report.error(`Registry: lesson "${l.id}" has no path and is not external`);
    } else {
      // migrated - dir + meta.js must exist
      const dir = path.join(rootDir, l.path);
      const meta = path.join(dir, "meta.js");
      if (!dirExists(dir)) {
        report.error(`Registry: migrated lesson "${l.id}" dir missing: ${l.path}/`);
      } else if (!fileExists(meta)) {
        report.error(`Registry: migrated lesson "${l.id}" meta.js missing: ${l.path}/meta.js`);
      }
    }
  }
}

// Check 3: concept graph over migrated lessons.
//   metas: [{ lessonId, meta }]
export function checkConceptGraph(metas, report) {
  const introducedBy = new Map(); // conceptId -> [lessonId, ...]
  const referenced = [];          // { id, from, via }

  for (const { lessonId, meta } of metas) {
    const c = (meta && meta.concepts) || {};
    const intro = c.introduces || [];
    const revisits = c.revisits || [];
    const uses = c.uses || [];

    for (const it of intro) {
      if (!introducedBy.has(it.id)) introducedBy.set(it.id, []);
      introducedBy.get(it.id).push(lessonId);
    }
    for (const r of revisits) referenced.push({ id: r.id, from: lessonId, via: "revisits" });
    for (const u of uses) referenced.push({ id: u.id, from: lessonId, via: "uses" });

    if (intro.length === 0 && revisits.length === 0 && uses.length === 0) {
      report.warn(`Concept: migrated lesson "${lessonId}" is untagged (empty introduces/revisits/uses)`);
    }
  }

  // A concept is introduced by exactly one lesson course-wide.
  for (const [cid, owners] of introducedBy) {
    if (owners.length > 1) {
      report.error(`Concept: "${cid}" introduced by >1 lesson: ${owners.join(", ")}`);
    }
  }

  // Every revisits/uses id must be introduced by some migrated lesson.
  const referencedIds = new Set();
  for (const ref of referenced) {
    referencedIds.add(ref.id);
    if (!introducedBy.has(ref.id)) {
      report.error(`Concept: "${ref.from}" ${ref.via} unknown concept id "${ref.id}" (introduced by no lesson)`);
    }
  }

  // Introduced but never revisited/used = orphan.
  for (const [cid, owners] of introducedBy) {
    if (!referencedIds.has(cid)) {
      report.warn(`Concept: "${cid}" introduced by "${owners[0]}" but never revisited/used (orphan)`);
    }
  }
}

// Check 4: migrated-lesson coherence.
//   migrated: [{ registryId, path, meta }]
export function checkCoherence(migrated, report) {
  for (const m of migrated) {
    const dirId = dirLessonId(m.path);
    if (m.meta.id !== dirId) {
      report.error(`Coherence: "${m.registryId}" meta.id "${m.meta.id}" != dir lesson id "${dirId}" (${m.path})`);
    }
    if (m.meta.id !== m.registryId) {
      report.error(`Coherence: "${m.registryId}" meta.id "${m.meta.id}" != registry id "${m.registryId}"`);
    }
    const engine = m.meta.engine;
    const archetype = m.meta.archetype;
    const needsTotal =
      engine === "build" || engine === "drill" ||
      archetype === "build" || archetype === "drill";
    if (needsTotal && typeof m.meta.total !== "number") {
      report.error(`Coherence: "${m.registryId}" is a ${archetype || engine} lesson but meta.total is not a number (got ${JSON.stringify(m.meta.total)})`);
    }
  }
}

// Check 4b: every migrated lesson actually HAS a body.
// The other checks all validate the CONTENT of a config they managed to load, and
// each of them quietly `continue`s past a lesson whose config is missing - so a
// lesson with no body at all is the one thing that passes every check by having
// nothing to check. That is exactly the failure mode of a config-global rename
// (measured 2026-08-03: renaming window.BUILD_CONFIG left validate at 0 errors),
// so it gets its own check instead of riding on the others.
//
// lessonBody() accepts both the current per-archetype globals and the unified
// window.LESSON_CONFIG, so this check follows the lesson engine's migration
// forward rather than blocking it - what it will NOT accept is a lesson that
// resolves to neither, i.e. a half-migrated one.
export function checkLessonBodies(migrated, rootDir, report) {
  for (const m of migrated) {
    const arch = m.meta.archetype;
    if (!arch || arch === "unknown") continue;
    const dir = path.join(rootDir, m.path);
    if (!fs.existsSync(dir)) continue;
    const dataFile = fs.readdirSync(dir).find((f) => f.endsWith(".viz.js")) || "data.js";
    const dataPath = path.join(dir, dataFile);
    if (!fs.existsSync(dataPath)) continue;
    let win;
    try { win = loadWindowBag(dataPath); }
    catch (e) { report.error(`Body: "${m.registryId}" ${dataFile} did not run (${e.message})`); continue; }
    const body = lessonBody(win, arch);
    if (!body.ok) report.error(`Body: "${m.registryId}" (${arch}) has no body - ${body.reason}`);
  }
}

// Check 5: checkpoint concept tags. Every question in a checkpoint's LESSON_CONFIG
// should carry a conceptId that resolves to an introduced concept, so the
// evaluation features (Phase 4) can score per concept.
//   quizzes: [{ lessonId, questions: [{ conceptId }] }]
//   knownIds: Set of every concept id introduced somewhere in the graph.
export function checkCheckpointConcepts(quizzes, knownIds, report) {
  for (const { lessonId, questions } of quizzes) {
    questions.forEach((q, i) => {
      const cid = q && q.conceptId;
      if (!cid) {
        report.warn(`Checkpoint: "${lessonId}" question ${i + 1} has no conceptId`);
        return;
      }
      if (!knownIds.has(cid)) {
        report.error(`Checkpoint: "${lessonId}" question ${i + 1} conceptId "${cid}" is not an introduced concept`);
      }
    });
  }
}

// Check 5b: in-prose [[concept:id|label]] mention ids must resolve to a real
// concept, so a typo'd marker fails the build instead of rendering a dead chip.
//   mentions: [{ lessonId, ids: [conceptId, ...] }]
export function checkProseMentions(mentions, knownIds, report) {
  for (const { lessonId, ids } of mentions) {
    for (const id of ids) {
      if (!knownIds.has(id)) {
        report.error(`Mention: "${lessonId}" prose has [[concept:${id}|...]] but "${id}" is not an introduced concept`);
      }
    }
  }
}

// The keys a COMPLETE default bundle must carry for a build lesson's tasks:
// every non-summary task needs title/concept/context + at least goal.0; the
// recap (summary:true) task needs its summary keys (intro, one item, close).
export function requiredDefaultKeys(tasks) {
  const req = [];
  (tasks || []).forEach((t, i) => {
    const n = i + 1;
    if (t && t.summary) {
      req.push(
        `task.${n}.summaryIntro`,
        `task.${n}.summaryItems.0.title`,
        `task.${n}.summaryItems.0.text`,
        `task.${n}.summaryClose`
      );
    } else {
      req.push(`task.${n}.title`, `task.${n}.concept`, `task.${n}.context`, `task.${n}.goal.0`);
    }
  });
  return req;
}

// Check (resource arity): for each build lesson with a resource layer, the
// default/<baseLang> bundle must be COMPLETE for the build schema, and every
// present bundle (any voice/lang) must be a SUBSET of that default key set.
//   lessons: [{ lessonId, tasks, baseLang,
//               bundles: [{ voice, lang, keys: Set<string> }] }]
// Policy:
//   (a) missing a required default key            -> ERROR (incomplete default)
//   (b) an unknown/orphan key in any bundle        -> ERROR (typo'd/out-of-range)
//   (c) a non-default bundle missing some keys      -> WARN  (fallback covers it)
// `intro.N` and the lesson-owned card text (`card.title`/`card.blurb`, whose English
// source is meta.title/meta.blurb) are valid keys a non-default bundle may supply
// even though the default bundle omits them, so they are never treated as orphans.
export function checkResourceArity(lessons, report) {
  for (const { lessonId, tasks, baseLang, bundles } of lessons) {
    const lang = baseLang || "en";
    const def = (bundles || []).find((b) => b.voice === "default" && b.lang === lang);
    if (!def) {
      report.error(`Resource: "${lessonId}" has no default/${lang} bundle`);
      continue;
    }
    const defKeys = def.keys instanceof Set ? def.keys : new Set(def.keys);

    // (a) default completeness
    for (const k of requiredDefaultKeys(tasks)) {
      if (!defKeys.has(k)) {
        report.error(`Resource: "${lessonId}" default/${lang} bundle is missing required key "${k}"`);
      }
    }

    // (b) + (c) every present bundle vs the default key set. The concept.*
    // namespace is governed solely by checkConceptCoverage, so it is excluded
    // from this PROSE subset/arity comparison (not an orphan, not a missing key).
    for (const b of bundles) {
      const keys = b.keys instanceof Set ? b.keys : new Set(b.keys);
      for (const k of keys) {
        if (defKeys.has(k)) continue;
        if (/^intro\.\d+$/.test(k)) continue; // intro is a valid non-default key
        if (/^card\.(title|blurb)$/.test(k)) continue; // card text; English source is meta.title/blurb, not the en bundle
        if (/^concept\./.test(k)) continue;   // concept text governed by checkConceptCoverage
        report.error(`Resource: "${lessonId}" bundle ${b.voice}/${b.lang} has unknown key "${k}" (not in default/${lang})`);
      }
      const isDefaultBase = b.voice === "default" && b.lang === lang;
      if (!isDefaultBase) {
        let missing = 0;
        for (const k of defKeys) if (!/^concept\./.test(k) && !keys.has(k)) missing++;
        if (missing) {
          report.warn(`Resource: "${lessonId}" bundle ${b.voice}/${b.lang} omits ${missing} key(s) (default fallback covers them)`);
        }
      }
    }
  }
}

// Check (concept coverage): the Phase-A i18n gate. Concept text lives as
// `concept.<id>.def` / `concept.<id>.term` keys in the OWNER lesson's bundles.
//   lessons: [{ lessonId, bundles: [{ voice, lang, keys: Set<string> }] }]
//   deps: { introducedIds: Set<id>, ownerByConcept: Map<id, lessonId> }
// Rules (all ERROR):
//   1. unknown id  - a concept.<id>.* key whose <id> is introduced by no lesson.
//   2. ownership   - a concept.<id>.* key in a lesson that does not introduce <id>.
//   3. coverage    - if a (voice,lang) bundle carries ANY concept.* key it must
//      carry concept.<id>.def for EVERY concept that lesson introduces (`term`
//      optional). A bundle with NO concept keys is untranslated and skipped, so
//      the gate is inert until concepts are migrated, then enforces 100%.
export function checkConceptCoverage(lessons, deps, report) {
  const introducedIds = deps.introducedIds instanceof Set
    ? deps.introducedIds : new Set(deps.introducedIds || []);
  const ownerByConcept = deps.ownerByConcept instanceof Map
    ? deps.ownerByConcept : new Map(Object.entries(deps.ownerByConcept || {}));

  // Invert the owner map once: lessonId -> Set of concept ids it introduces.
  const ownedByLesson = new Map();
  for (const [cid, owner] of ownerByConcept) {
    if (!ownedByLesson.has(owner)) ownedByLesson.set(owner, new Set());
    ownedByLesson.get(owner).add(cid);
  }

  const KEY = /^concept\.(.+)\.(def|term)$/;

  for (const { lessonId, bundles } of lessons) {
    const owned = ownedByLesson.get(lessonId) || new Set();
    for (const b of bundles || []) {
      const keys = b.keys instanceof Set ? b.keys : new Set(b.keys);
      const defsPresent = new Set(); // owned ids that have a .def in this bundle
      let hasConceptKey = false;
      for (const k of keys) {
        const mm = KEY.exec(k);
        if (!mm) continue;
        hasConceptKey = true;
        const id = mm[1];
        if (!introducedIds.has(id)) {
          report.error(`Concept text: "${lessonId}" bundle ${b.voice}/${b.lang} has "${k}" but "${id}" is not an introduced concept`);
          continue;
        }
        if (ownerByConcept.get(id) !== lessonId) {
          report.error(`Concept text: "${lessonId}" bundle ${b.voice}/${b.lang} defines "${k}" but "${id}" is introduced by "${ownerByConcept.get(id)}", not this lesson`);
          continue;
        }
        if (mm[2] === "def") defsPresent.add(id);
      }
      // The English base (default/en) must carry every owned def unconditionally
      // (the locked "English base = 100%" rule); a translation bundle is gated on
      // declaring any concept key, so an untranslated bundle stays inert.
      const isBase = b.voice === "default" && b.lang === "en";
      if (!hasConceptKey && !(isBase && owned.size)) continue;
      for (const id of owned) {
        if (!defsPresent.has(id)) {
          report.error(`Concept text: "${lessonId}" bundle ${b.voice}/${b.lang} declares concept text but is missing "concept.${id}.def" (100% coverage required)`);
        }
      }
    }
  }
}

// Check 5: drift guard. Shells the generator into a temp dir and diffs against
// the committed generated/ data files AND every migrated content/**/index.html.
// `run` is injectable for testing.
//   deps: { genScript, committedDir, outDir, rootDir, lessonPaths[], files, run }
export function driftGuard(deps, report) {
  const {
    genScript,
    committedDir,
    outDir,
    rootDir,
    lessonPaths = [],
    files = ["course-data.js", "concept-index.js"],
    run = (cmd, args) => spawnSync(cmd, args, { encoding: "utf8" }),
  } = deps;

  fs.mkdirSync(outDir, { recursive: true });
  const res = run("node", [genScript, "--out", outDir]);
  if (res && res.status !== 0) {
    report.error(`Drift: generator exited ${res.status}${res.stderr ? " - " + String(res.stderr).trim() : ""}`);
    return;
  }

  // A fresh file must exist and byte-match the committed one.
  function diff(label, committedFile, freshFile) {
    if (!fs.existsSync(freshFile)) {
      report.error(`Drift: generator did not emit ${label}`);
      return;
    }
    const committed = fs.existsSync(committedFile) ? fs.readFileSync(committedFile, "utf8") : null;
    const fresh = fs.readFileSync(freshFile, "utf8");
    if (committed !== fresh) {
      report.error(`Drift: ${label} is stale - re-run tools/generate.mjs and commit`);
    }
  }

  // The two generated data files: <outDir>/<f> vs committed generated/<f>.
  for (const f of files) {
    diff(`generated/${f}`, path.join(committedDir, f), path.join(outDir, f));
  }
  // Each migrated lesson page: <outDir>/<relPath>/index.html vs the committed one.
  for (const rel of lessonPaths) {
    diff(`${rel}/index.html`, path.join(rootDir, rel, "index.html"), path.join(outDir, rel, "index.html"));
  }
}

// ---------------------------------------------------------------------------
// Disk wiring
// ---------------------------------------------------------------------------

// Load window.LESSON_META for every migrated (path set, non-external) line whose
// meta.js exists. Missing dirs/metas are reported by checkRegistry, not here.
export function loadMigrated(registry, rootDir) {
  const out = [];
  for (const l of registry.lessons) {
    if (l.kind === "external" || l.path == null) continue;
    const metaPath = path.join(rootDir, l.path, "meta.js");
    if (!fs.existsSync(metaPath)) continue;
    let meta;
    try {
      meta = loadBrowserGlobal(metaPath, "LESSON_META");
    } catch {
      continue; // unreadable meta already implied by a missing-file/registry error
    }
    out.push({ registryId: l.id, path: l.path, meta });
  }
  return out;
}

// Load window.LESSON_CONFIG.questions for every migrated checkpoint lesson.
export function loadCheckpointQuizzes(migrated, rootDir) {
  const out = [];
  for (const m of migrated) {
    if (m.meta.archetype !== "checkpoint") continue;
    const dataPath = path.join(rootDir, m.path, "data.js");
    if (!fs.existsSync(dataPath)) continue;
    let cfg;
    try {
      cfg = loadBrowserGlobal(dataPath, "LESSON_CONFIG");
    } catch {
      continue;
    }
    out.push({ lessonId: m.registryId, questions: (cfg && cfg.questions) || [] });
  }
  return out;
}

// Scan every migrated lesson's prose for [[concept:id|label]] markers and collect
// their ids (a raw-text scan, so it catches markers in any prose field). Prose
// lives in the lesson's data.js and, for lessons with an extracted resource
// layer, in its res/strings/<voice>/<lang>.json bundles - both are scanned.
export function loadProseMentions(migrated, rootDir) {
  const re = /\[\[concept:([^\]|]+)\|/g;
  const out = [];
  for (const m of migrated) {
    const texts = [];
    const dataPath = path.join(rootDir, m.path, "data.js");
    if (fs.existsSync(dataPath)) texts.push(fs.readFileSync(dataPath, "utf8"));
    for (const f of listJsonFiles(path.join(rootDir, m.path, "res", "strings"))) {
      texts.push(fs.readFileSync(f, "utf8"));
    }
    const ids = [];
    for (const text of texts) {
      let mm;
      re.lastIndex = 0;
      while ((mm = re.exec(text))) ids.push(mm[1]);
    }
    if (ids.length) out.push({ lessonId: m.registryId, ids });
  }
  return out;
}

// Recursively list *.json files under dir (a lesson's voice/lang resource bundles).
function listJsonFiles(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) out.push(...listJsonFiles(p));
    else if (name.endsWith(".json")) out.push(p);
  }
  return out;
}

// Scan a lesson's res/strings base dir into [{ voice, lang, keys: Set<string> }]
// - one entry per res/strings/<voice>/<lang>.json bundle. A malformed bundle
// surfaces as an empty key set (reported by whichever check needs its keys).
export function scanResourceBundles(baseDir) {
  const bundles = [];
  if (!fs.existsSync(baseDir)) return bundles;
  for (const voice of fs.readdirSync(baseDir)) {
    const voiceDir = path.join(baseDir, voice);
    if (!fs.statSync(voiceDir).isDirectory()) continue;
    for (const file of fs.readdirSync(voiceDir)) {
      if (!file.endsWith(".json")) continue;
      const lang = file.slice(0, -".json".length);
      let obj = null;
      try {
        obj = JSON.parse(fs.readFileSync(path.join(voiceDir, file), "utf8"));
      } catch {
        obj = null; // a malformed bundle surfaces as an empty key set
      }
      const keys = obj && typeof obj === "object" ? new Set(Object.keys(obj)) : new Set();
      bundles.push({ voice, lang, keys });
    }
  }
  return bundles;
}

// Load the resource-arity inputs for every migrated build lesson that has a
// resource layer (meta.resources): LESSON_CONFIG.tasks (the schema arity) and the
// key set of every res/strings/<voice>/<lang>.json bundle.
export function loadResourceBundles(migrated, rootDir) {
  const out = [];
  for (const m of migrated) {
    if (m.meta.archetype !== "build" || !m.meta.resources) continue;
    const dataPath = path.join(rootDir, m.path, "data.js");
    if (!fs.existsSync(dataPath)) continue;
    let cfg;
    try {
      cfg = loadBrowserGlobal(dataPath, "LESSON_CONFIG");
    } catch {
      continue; // a broken data.js is reported by other checks
    }
    const tasks = (cfg && cfg.tasks) || [];
    const base = m.meta.resources.base || "res/strings";
    const baseLang = m.meta.resources.lang || "en";
    const baseDir = path.join(rootDir, m.path, base);
    out.push({ lessonId: m.registryId, tasks, baseLang, bundles: scanResourceBundles(baseDir) });
  }
  return out;
}

// Load concept-text bundles for every migrated lesson that has a res/strings
// dir, regardless of archetype - concept text (concept.<id>.def/.term) can be
// introduced by any lesson kind. Returns [{ lessonId, bundles }] for
// checkConceptCoverage. Lessons with no res/strings dir are omitted.
export function loadConceptBundles(migrated, rootDir) {
  const out = [];
  for (const m of migrated) {
    const base = (m.meta.resources && m.meta.resources.base) || "res/strings";
    const baseDir = path.join(rootDir, m.path, base);
    if (!fs.existsSync(baseDir)) continue;
    out.push({ lessonId: m.registryId, bundles: scanResourceBundles(baseDir) });
  }
  return out;
}

// The set of concept ids introduced by a migrated lesson, and the owner map
// (concept id -> the lessonId that introduces it). >1-introducer conflicts are
// reported by checkConceptGraph; the owner map keeps the first seen introducer.
export function introducedConceptIds(migrated) {
  const set = new Set();
  for (const m of migrated)
    for (const it of (m.meta.concepts && m.meta.concepts.introduces) || [])
      set.add(it.id);
  return set;
}

export function conceptOwners(migrated) {
  const map = new Map();
  for (const m of migrated)
    for (const it of (m.meta.concepts && m.meta.concepts.introduces) || [])
      if (!map.has(it.id)) map.set(it.id, m.registryId);
  return map;
}

// Every concept id introduced by a migrated lesson. This is the resolvable-concept
// set the checkpoint tags and prose mentions check against.
export function knownConceptIds(migrated) {
  const set = new Set();
  for (const m of migrated)
    for (const it of (m.meta.concepts && m.meta.concepts.introduces) || [])
      set.add(it.id);
  return set;
}

// Check (context verbosity): a task.<n>.context much over ~75 words is worth a
// second look - but this is a QUESTION, not an instruction to cut.
//
// An agent once read this warning as a target and rewrote all seven SOLID cards
// into note form, losing the argument each card was making (198 words -> 64 on
// the card whose whole job is to show what the bad shape COSTS). Prose that
// motivates or tells a story is allowed to run long. Only restatement of the
// goal list or the code should ever be cut, and never at the price of the voice
// rules in AGENTS.md.
const CONTEXT_WORD_CAP = 75;

export function checkContextVerbosity(migrated, rootDir, report) {
  const CTX = /^task\.\d+\.context$/;
  for (const m of migrated) {
    if (m.meta.archetype !== "build") continue;
    const base = (m.meta.resources && m.meta.resources.base) || "res/strings";
    const enPath = path.join(rootDir, m.path, base, "default", "en.json");
    if (!fs.existsSync(enPath)) continue;
    let obj;
    try { obj = JSON.parse(fs.readFileSync(enPath, "utf8")); } catch { continue; }
    for (const [k, v] of Object.entries(obj)) {
      if (!CTX.test(k) || typeof v !== "string") continue;
      const wc = v.split(/\s+/).filter(Boolean).length;
      if (wc > CONTEXT_WORD_CAP) {
        report.warn(`Verbosity: "${m.registryId}" ${k} is ${wc} words (over ${CONTEXT_WORD_CAP}) - check for restatement of the goals or code; do NOT compress prose into note form`);
      }
    }
  }
}

// Check (exemplary code): every C# line a lesson ships is a worked example of
// the standard this course teaches, so the lesson's own code must not break the
// rules its prose is selling. The full standard is judgement (see the
// lesson-authoring skill); these are the two halves a machine can see:
//
//   - single-letter locals (`int n`, `foreach (int h in ...)`)
//   - a meaningful number repeated in comparisons, which is the duplicated rule
//     the SOLID Part exists to remove
//
// WARN, not error: 20 existing lessons predate the rule. New content should
// treat any hit as a blocker.
const CODE_FIELDS = ["starter", "solution", "example"];

export function checkExemplaryCode(migrated, rootDir, report) {
  // `foreach (int h in hours)` and `int n = 0;` - a declared local of one char.
  const SHORT = /\b(?:int|var|string|bool|double|long|float|decimal|char)\s+([a-z])\s*[=;)]|foreach\s*\(\s*[\w<>,\[\]]+\s+([a-z])\s+in\b/g;
  // A literal used in a COMPARISON carries a rule. 0 and 1 are loop seeds and
  // identity values, not policy.
  const MAGIC = /[<>]=?\s*(\d+)|==\s*(\d+)/g;
  // Comments are scanned for NAMES - they often show a line of code, and a
  // learner reads it the same as any other. They are NOT scanned for repeated
  // literals: a comment explaining `score >= 50` restates the rule, it does not
  // duplicate it, and counting it reported a rule that was only written once.
  const stripComments = structure.stripComments;

  for (const m of migrated) {
    const dataPath = path.join(rootDir, m.path, "data.js");
    if (!fs.existsSync(dataPath)) continue;
    let cfg;
    try { cfg = loadBrowserGlobal(dataPath, "LESSON_CONFIG"); } catch { continue; }
    if (!cfg) continue;

    const bodies = [...(cfg.tasks || []), ...(cfg.drills || [])];
    bodies.forEach((t, i) => {
      const sources = [];
      for (const f of CODE_FIELDS) if (typeof t[f] === "string") sources.push([f, t[f]]);
      if (t.verify && typeof t.verify.main === "string") sources.push(["verify.main", t.verify.main]);
      (t.runnablePrograms || []).forEach((p, k) => { if (typeof p === "string") sources.push([`runnablePrograms[${k}]`, p]); });

      for (const [field, src] of sources) {
        const names = new Set();
        let hit;
        SHORT.lastIndex = 0;
        while ((hit = SHORT.exec(src))) names.add(hit[1] || hit[2]);
        if (names.size) {
          report.warn(`Exemplary code: "${m.registryId}" task ${i + 1} ${field} uses single-letter name(s) ${[...names].map((n) => `\`${n}\``).join(", ")} - name what the value IS`);
        }
        const counts = new Map();
        const code = stripComments(src);
        MAGIC.lastIndex = 0;
        while ((hit = MAGIC.exec(code))) {
          const v = hit[1] || hit[2];
          if (v === "0" || v === "1") continue;
          counts.set(v, (counts.get(v) || 0) + 1);
        }
        for (const [v, n] of counts) {
          if (n > 1) {
            report.warn(`Exemplary code: "${m.registryId}" task ${i + 1} ${field} compares against ${v} in ${n} places - that is a duplicated rule; name it (const)`);
          }
        }
      }
    });
  }
}

// ---------------------------------------------------------------------------
// Goal gates must be able to light up
// ---------------------------------------------------------------------------
//
// The live tracker ticks a goal row when its `gate` matches the learner's code.
// A gate with a typo in it - `Bird` for `Sparrow`, `Speak` for `Talk` - does not
// throw and does not warn. The row simply stays grey FOREVER, and the learner
// reads that as "I have not done it yet" while staring at a finished solution.
// A tracker that can never tick is worse than no tracker.
//
// The assertion itself already exists, and is thorough: `verifyTracker` in
// tools/lib/lesson-validators.mjs runs every gate and every member row against
// the task's OWN authored solution. What it lacked was REACH - it was only
// callable through tools/verify-lesson.mjs, a per-lesson tool somebody has to
// remember to point at a directory. CI and the push gate run THIS file, so this
// is where the course-wide sweep belongs. It is a call, not a copy: two
// implementations of "is this gate dead" would drift apart, and the one that
// drifts is the one that quietly stops catching anything.

export function checkGoalGates(migrated, rootDir, scanCSharp, report) {
  if (typeof scanCSharp !== "function") {
    report.error("Goal gates: no C# scanner in vendor/code-lab/code-lab.global.js - every goal gate went unchecked");
    return;
  }

  let currentLesson = "";
  const validators = createValidators({
    report: {
      ok: () => {},
      // The shared checker speaks in `task N "title"`; prefix the lesson so a
      // course-wide sweep says WHICH lesson.
      bad: (msg) => report.error(`Goal gates: ${currentLesson} ${msg}`),
      skip: () => {},
      note: () => {},
    },
    codeLab: () => ({ scanCSharp }),
    // Never reached: verifyTracker is static by construction. Present because
    // createValidators builds every archetype's validator up front.
    dotnet: { available: () => false, compileRun: () => ({ built: false, output: "", errors: "" }) },
    grading: { matches: () => true, buildProbe: () => "" },
  });

  for (const m of migrated) {
    const dataPath = path.join(rootDir, m.path, "data.js");
    if (!fs.existsSync(dataPath)) continue;
    let cfg;
    try { cfg = loadBrowserGlobal(dataPath, "LESSON_CONFIG"); } catch { continue; }
    if (!cfg || !(cfg.tasks || []).some((t) => (t.goals || []).length)) continue;
    currentLesson = `"${m.registryId}"`;
    validators.tracker({ config: cfg });
  }
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

function main() {
  const report = makeReport();

  const registry = loadBrowserGlobal(registryPath, "CourseRegistry");

  checkRegistry(
    registry.lessons,
    {
      dirExists: (p) => fs.existsSync(p) && fs.statSync(p).isDirectory(),
      fileExists: (p) => fs.existsSync(p),
      rootDir: root,
    },
    report
  );

  const migrated = loadMigrated(registry, root);
  const knownIds = knownConceptIds(migrated);
  checkConceptGraph(migrated.map((m) => ({ lessonId: m.registryId, meta: m.meta })), report);
  checkCoherence(migrated, report);
  checkLessonBodies(migrated, root, report);
  checkCheckpointConcepts(loadCheckpointQuizzes(migrated, root), knownIds, report);
  checkProseMentions(loadProseMentions(migrated, root), knownIds, report);
  checkResourceArity(loadResourceBundles(migrated, root), report);
  checkContextVerbosity(migrated, root, report);
  checkExemplaryCode(migrated, root, report);
  checkGoalGates(migrated, root, loadCodeLab().scanCSharp, report);
  checkConceptCoverage(
    loadConceptBundles(migrated, root),
    { introducedIds: introducedConceptIds(migrated), ownerByConcept: conceptOwners(migrated) },
    report
  );

  if (process.env.VALIDATE_DRIFT === "1") {
    const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "concept-drift-"));
    try {
      const lessonPaths = registry.lessons
        .filter((l) => l.path && l.kind !== "external")
        .map((l) => l.path);
      driftGuard(
        { genScript: generatePath, committedDir: generatedDir, outDir, rootDir: root, lessonPaths },
        report
      );
    } finally {
      fs.rmSync(outDir, { recursive: true, force: true });
    }
  } else {
    console.log("NOTE  drift guard skipped (set VALIDATE_DRIFT=1 to enable)");
  }

  for (const w of report.warns) console.log("WARN  " + w);
  for (const e of report.errors) console.error("ERROR " + e);
  console.log(`\n${report.errors.length} error(s), ${report.warns.length} warning(s)`);
  process.exit(report.errors.length ? 1 : 0);
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) main();
