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
 *      data.js QUIZ_CONFIG) must resolve to an introduced concept (ERROR); an
 *      untagged question is a WARN.
 *   5b. In-prose mentions - a [[concept:id|label]] marker in a migrated data.js
 *      must reference an introduced concept id (ERROR); a typo would otherwise
 *      render as a dead "Definition not found" chip with no build signal.
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
import { loadBrowserGlobal, idFromHref } from "./lib.mjs";

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
//   plannedIds: ids the drafts intend to introduce (whose lesson may not be
//   migrated yet); a reference to one of those is fine mid-migration.
export function checkConceptGraph(metas, report, plannedIds = new Set()) {
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

  // Every revisits/uses id must be introduced somewhere - by a migrated lesson
  // or, during migration, by a lesson the drafts plan to introduce it.
  const referencedIds = new Set();
  for (const ref of referenced) {
    referencedIds.add(ref.id);
    if (!introducedBy.has(ref.id) && !plannedIds.has(ref.id)) {
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

// Check 5: checkpoint concept tags. Every question in a checkpoint's QUIZ_CONFIG
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
// `intro.N` is a valid schema key a non-default voice may supply even though the
// default bundle omits it, so it is never treated as an orphan.
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

    // (b) + (c) every present bundle vs the default key set
    for (const b of bundles) {
      const keys = b.keys instanceof Set ? b.keys : new Set(b.keys);
      for (const k of keys) {
        if (defKeys.has(k)) continue;
        if (/^intro\.\d+$/.test(k)) continue; // intro is a valid non-default key
        report.error(`Resource: "${lessonId}" bundle ${b.voice}/${b.lang} has unknown key "${k}" (not in default/${lang})`);
      }
      const isDefaultBase = b.voice === "default" && b.lang === lang;
      if (!isDefaultBase) {
        let missing = 0;
        for (const k of defKeys) if (!keys.has(k)) missing++;
        if (missing) {
          report.warn(`Resource: "${lessonId}" bundle ${b.voice}/${b.lang} omits ${missing} key(s) (default fallback covers them)`);
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

// Load window.QUIZ_CONFIG.questions for every migrated checkpoint lesson.
export function loadCheckpointQuizzes(migrated, rootDir) {
  const out = [];
  for (const m of migrated) {
    if (m.meta.archetype !== "checkpoint") continue;
    const dataPath = path.join(rootDir, m.path, "data.js");
    if (!fs.existsSync(dataPath)) continue;
    let cfg;
    try {
      cfg = loadBrowserGlobal(dataPath, "QUIZ_CONFIG");
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

// Load the resource-arity inputs for every migrated build lesson that has a
// resource layer (meta.resources): BUILD_CONFIG.tasks (the schema arity) and the
// key set of every res/strings/<voice>/<lang>.json bundle.
export function loadResourceBundles(migrated, rootDir) {
  const out = [];
  for (const m of migrated) {
    if (m.meta.archetype !== "build" || !m.meta.resources) continue;
    const dataPath = path.join(rootDir, m.path, "data.js");
    if (!fs.existsSync(dataPath)) continue;
    let cfg;
    try {
      cfg = loadBrowserGlobal(dataPath, "BUILD_CONFIG");
    } catch {
      continue; // a broken data.js is reported by other checks
    }
    const tasks = (cfg && cfg.tasks) || [];
    const base = m.meta.resources.base || "res/strings";
    const baseLang = m.meta.resources.lang || "en";
    const baseDir = path.join(rootDir, m.path, base);

    const bundles = [];
    if (fs.existsSync(baseDir)) {
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
    }
    out.push({ lessonId: m.registryId, tasks, baseLang, bundles });
  }
  return out;
}

// Every concept id introduced by a migrated lesson, unioned with the draft-
// planned ids (so a checkpoint may tag a concept whose introducer is another
// track/part). This is the resolvable-concept set the checkpoint tags check against.
export function knownConceptIds(migrated, plannedIds) {
  const set = new Set(plannedIds);
  for (const m of migrated)
    for (const it of (m.meta.concepts && m.meta.concepts.introduces) || [])
      set.add(it.id);
  return set;
}

// Union of every concept id the drafts (docs/concepts/*.concepts.json) intend to
// introduce. Used to tolerate references to not-yet-migrated introducers.
export function loadPlannedConceptIds(rootDir) {
  const set = new Set();
  const dir = path.join(rootDir, "docs", "concepts");
  if (!fs.existsSync(dir)) return set;
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith(".concepts.json")) continue;
    try {
      const d = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
      for (const l of Object.values(d))
        for (const it of (l.introduces || [])) set.add(it.id);
    } catch { /* a malformed draft is a research artifact, not a gate */ }
  }
  return set;
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
  const plannedIds = loadPlannedConceptIds(root);
  const knownIds = knownConceptIds(migrated, plannedIds);
  checkConceptGraph(migrated.map((m) => ({ lessonId: m.registryId, meta: m.meta })), report, plannedIds);
  checkCoherence(migrated, report);
  checkCheckpointConcepts(loadCheckpointQuizzes(migrated, root), knownIds, report);
  checkProseMentions(loadProseMentions(migrated, root), knownIds, report);
  checkResourceArity(loadResourceBundles(migrated, root), report);

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
