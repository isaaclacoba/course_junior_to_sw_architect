/**
 * tools/new-lesson.mjs - scaffold or migrate a lesson into the generated,
 * per-directory layout content/<track>/<PP-part>/<LL-lesson>/.
 *
 * Two modes:
 *
 *   node tools/new-lesson.mjs --from <basename> [--move]
 *     Migrate an existing FLAT lesson (<basename>.html + <basename>.js, and an
 *     optional <basename>.viz.js). Reads the manifest for structure/order and the
 *     flat page for the hero, writes meta.js + data.js (+ <basename>.viz.js) into
 *     the content dir, and sets that lesson's registry line `path`/`href`. Does
 *     NOT write index.html (generate.mjs owns that). Copies by default; --move
 *     also deletes the flat files.
 *
 *   node tools/new-lesson.mjs --new --track <t> --part <p> --id <id>
 *                             --archetype <build|drill|viz|checkpoint> --title "..."
 *     Scaffold a brand-new empty lesson dir + stub meta.js/data.js and append a
 *     registry line in order.
 *
 * Only Node built-ins.
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { loadBrowserGlobal, loadWindowBag, conceptsLiteral } from "./lib.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const manifestPath = path.join(root, "course-manifest.js");
const registryPath = path.join(root, "course-registry.js");

// ---- small helpers ----

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith("--")) {
        args[key] = true;
      } else {
        args[key] = next;
        i++;
      }
    } else {
      args._.push(a);
    }
  }
  return args;
}

function pad2(n) {
  return n < 10 ? "0" + n : String(n);
}

function escRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Locate a manifest lesson by href, returning the lesson plus its 1-based part
// index within the track and 1-based lesson index within the part.
function locateInManifest(Course, href) {
  const tracks = Course.tracks();
  for (let ti = 0; ti < tracks.length; ti++) {
    const t = tracks[ti];
    for (let pi = 0; pi < t.parts.length; pi++) {
      const p = t.parts[pi];
      for (let li = 0; li < p.lessons.length; li++) {
        if (p.lessons[li].href === href) {
          return {
            lesson: p.lessons[li],
            track: t.id,
            part: p.id,
            partIndex: pi + 1,
            lessonIndex: li + 1,
          };
        }
      }
    }
  }
  return null;
}

// Pull window.PAGE out of a flat page's inline <script> block (the one that
// assigns window.PAGE), by running just that block in a sandbox.
function readPageHero(htmlFile) {
  const html = fs.readFileSync(htmlFile, "utf8");
  const blocks = html.match(/<script>([\s\S]*?)<\/script>/gi) || [];
  for (const block of blocks) {
    const body = block.replace(/^<script>/i, "").replace(/<\/script>$/i, "");
    if (!/window\.PAGE/.test(body)) continue;
    const sandbox = { window: {} };
    try {
      vm.createContext(sandbox);
      vm.runInContext(body, sandbox, { filename: htmlFile });
    } catch (e) {
      continue;
    }
    if (sandbox.window.PAGE) return sandbox.window.PAGE;
  }
  throw new Error("Could not read window.PAGE from " + htmlFile);
}

// Decide the archetype from what the flat page loads and what the data file sets.
function detectArchetype(htmlFile, dataFile, basename) {
  const html = fs.readFileSync(htmlFile, "utf8");
  const loads = (name) => html.includes(name);
  let archetype = null;
  if (loads("build-engine.js")) archetype = "build";
  else if (loads("drill-engine.js")) archetype = "drill";
  else if (loads(basename + ".viz.js")) archetype = "viz";

  // Cross-check / fill in from the data file's config global.
  let dataGlobal = null;
  if (fs.existsSync(dataFile)) {
    const bag = loadWindowBag(dataFile);
    if (bag.BUILD_CONFIG) dataGlobal = "build";
    else if (bag.DRILL_CONFIG) dataGlobal = "drill";
    else if (bag.QUIZ_CONFIG) dataGlobal = "checkpoint";
  }
  if (!archetype) archetype = dataGlobal;
  if (!archetype) {
    throw new Error(
      "Cannot detect an archetype for '" + basename + "' - it loads no build/drill/viz engine and " +
      "sets no BUILD/DRILL/QUIZ config. It is not a standard lesson; migrate it by hand."
    );
  }
  return archetype;
}

function engineFor(archetype) {
  if (archetype === "build") return "build";
  if (archetype === "drill") return "drill";
  return null;
}

// Load a lesson's drafted concept graph from docs/concepts/<track>.concepts.json,
// so a migration seeds meta.js with real concepts instead of an empty stub.
function loadConceptDraft(track, id) {
  try {
    const p = path.join(root, "docs", "concepts", track + ".concepts.json");
    if (!fs.existsSync(p)) return null;
    const d = JSON.parse(fs.readFileSync(p, "utf8"));
    return d[id] || null;
  } catch (e) { return null; }
}

// Serialize the LESSON_META object as a readable classic script.
function metaFileText(meta) {
  const j = (v) => JSON.stringify(v);
  const intro = JSON.stringify(meta.intro || [], null, 2)
    .split("\n")
    .map((line, i) => (i === 0 ? line : "  " + line))
    .join("\n");
  return `window.LESSON_META = {
  id: ${j(meta.id)},
  key: ${j(meta.key)},
  total: ${meta.total},
  docTitle: ${j(meta.docTitle)},
  eyebrow: ${j(meta.eyebrow)},
  title: ${j(meta.title)},
  intro: ${intro},
  blurb: ${j(meta.blurb)},
  links: [{ href: "index.html", label: "Back to the course" }],
  pill: ${j(meta.pill)},
  time: ${j(meta.time)},
  archetype: ${j(meta.archetype)},
  engine: ${meta.engine === null ? "null" : j(meta.engine)},
  concepts: ${conceptsLiteral(meta.concepts)},
};
`;
}

// Strip any literal nextHref/nextLabel property lines from a flat data file.
function stripNav(dataText) {
  return dataText.replace(/^[ \t]*next(?:Href|Label)\s*:[^\n]*\n/gm, "");
}

// Rewrite root-relative asset paths in a moved data file so they resolve from
// the lesson's content/ directory (which sits `prefix` dirs below the root).
// The only such path today is BUILD_CONFIG/DRILL_CONFIG.runnerUrl; skip ones
// that are already relative/absolute/remote so the transform is idempotent.
function fixAssetPaths(dataText, prefix) {
  // The one root-relative asset a data file carries today is the runner URL;
  // handle either quote style and skip anything already relative/absolute/remote.
  const out = dataText.replace(
    /(runnerUrl:\s*["'])(?!\.\.\/|\/|https?:)([^"']*)(["'])/g,
    (_m, a, p, z) => a + prefix + p + z
  );
  if (/runnerUrl:\s*["'](?!\.\.\/|\/|https?:)/.test(out)) {
    console.warn("WARN: a runnerUrl is still root-relative after path-fixing");
  }
  return out;
}

// Throw BEFORE writing anything if the registry has no flat line for this id
// (missing, or already migrated) - avoids leaving a half-written content dir.
function assertRegistryHasFlat(id) {
  const text = fs.readFileSync(registryPath, "utf8");
  const re = new RegExp('id: "' + escRe(id) + '", href: "[^"]*", kind: "[^"]*", path: null');
  if (!re.test(text)) {
    throw new Error("Registry has no flat line for '" + id + "' (missing or already migrated); nothing written.");
  }
}

// Set the registry line for `id` to point at the migrated content dir.
function updateRegistry(id, relPath) {
  const href = relPath + "/";
  const text = fs.readFileSync(registryPath, "utf8");
  const re = new RegExp('(id: "' + escRe(id) + '", href: )"[^"]*"(, kind: "[^"]*", path: )null');
  if (!re.test(text)) throw new Error("Registry line for id '" + id + "' not found (or already migrated)");
  const next = text.replace(re, `$1"${href}"$2"${relPath}"`);
  fs.writeFileSync(registryPath, next);
}

// ---- migration mode: --from <basename> ----

function migrateFrom(basename, opts) {
  if (!fs.existsSync(manifestPath)) {
    throw new Error("--from is retired: course-manifest.js has been removed and every lesson is migrated. Author new lessons with --new.");
  }
  const Course = loadBrowserGlobal(manifestPath, "Course");
  const href = basename + ".html";
  const loc = locateInManifest(Course, href);
  if (!loc) throw new Error("No manifest lesson with href '" + href + "'");
  assertRegistryHasFlat(basename);

  const htmlFile = path.join(root, basename + ".html");
  const dataFile = path.join(root, basename + ".js");
  const vizFile = path.join(root, basename + ".viz.js");
  if (!fs.existsSync(htmlFile)) throw new Error("Missing " + htmlFile);

  const page = readPageHero(htmlFile);
  const hero = (page && page.hero) || {};
  const archetype = detectArchetype(htmlFile, dataFile, basename);
  const l = loc.lesson;

  const relPath = ["content", loc.track, pad2(loc.partIndex) + "-" + loc.part, pad2(loc.lessonIndex) + "-" + basename].join("/");
  const dir = path.join(root, relPath);
  const rootPrefix = "../".repeat(relPath.split("/").length);

  const meta = {
    id: basename,
    key: l.key,
    total: l.total,
    docTitle: hero.title,
    eyebrow: hero.eyebrow,
    title: l.title,
    intro: hero.intro || [],
    blurb: l.blurb,
    pill: l.pill,
    time: l.time,
    archetype: archetype,
    engine: engineFor(archetype),
    concepts: loadConceptDraft(loc.track, basename),
  };

  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "meta.js"), metaFileText(meta));

  // data.js exists for build/drill/checkpoint; viz lessons carry <name>.viz.js.
  if (fs.existsSync(dataFile)) {
    fs.writeFileSync(path.join(dir, "data.js"), fixAssetPaths(stripNav(fs.readFileSync(dataFile, "utf8")), rootPrefix));
  }
  if (fs.existsSync(vizFile)) {
    fs.writeFileSync(path.join(dir, basename + ".viz.js"), stripNav(fs.readFileSync(vizFile, "utf8")));
  }

  updateRegistry(basename, relPath);

  if (opts.move) {
    [htmlFile, dataFile, vizFile].forEach(function (f) {
      if (fs.existsSync(f)) fs.rmSync(f);
    });
  }

  console.log("Migrated " + basename + " -> " + relPath + " (archetype: " + archetype + ", move: " + Boolean(opts.move) + ")");
  console.log("Run: node tools/generate.mjs  (emits " + relPath + "/index.html and regenerates generated/)");
}

// ---- scaffold mode: --new ... ----

function scaffoldNew(args) {
  const track = args.track, part = args.part, id = args.id;
  const archetype = args.archetype, title = args.title;
  if (!track || !part || !id || !archetype || !title) {
    throw new Error("--new requires --track --part --id --archetype --title");
  }

  const registry = loadBrowserGlobal(registryPath, "CourseRegistry");
  const t = registry.tracks.find(function (x) { return x.id === track; });
  if (!t) throw new Error("Unknown track '" + track + "'");
  const partIndex = t.parts.findIndex(function (p) { return p.id === part; }) + 1;
  if (partIndex === 0) throw new Error("Unknown part '" + part + "' in track '" + track + "'");

  // Lesson index = one past the last already-registered lesson for this part.
  const inPart = registry.lessons.filter(function (x) { return x.track === track && x.part === part; });
  const lessonIndex = inPart.length + 1;

  const relPath = ["content", track, pad2(partIndex) + "-" + part, pad2(lessonIndex) + "-" + id].join("/");
  const dir = path.join(root, relPath);
  fs.mkdirSync(dir, { recursive: true });

  const meta = {
    id: id, key: id.replace(/-/g, "_") + "_awarded", total: 1,
    docTitle: title, eyebrow: "", title: title, intro: [],
    blurb: "", pill: "gentle", time: "20 min",
    archetype: archetype, engine: engineFor(archetype),
  };
  fs.writeFileSync(path.join(dir, "meta.js"), metaFileText(meta));

  if (archetype === "viz") {
    fs.writeFileSync(path.join(dir, id + ".viz.js"), "(function () {\n  \"use strict\";\n  window.LESSON_VIZ = { steps: [] };\n})();\n");
  } else if (archetype === "build") {
    fs.writeFileSync(path.join(dir, "data.js"), "(function () {\n  \"use strict\";\n  window.BUILD_CONFIG = { prefix: \"" + id.replace(/-/g, "") + "\", tasks: [] };\n})();\n");
  } else if (archetype === "drill") {
    fs.writeFileSync(path.join(dir, "data.js"), "(function () {\n  \"use strict\";\n  window.DRILL_CONFIG = { prefix: \"" + id.replace(/-/g, "") + "\", drills: [] };\n})();\n");
  } else {
    fs.writeFileSync(path.join(dir, "data.js"), "(function () {\n  \"use strict\";\n  window.QUIZ_CONFIG = { questions: [] };\n})();\n");
  }

  appendRegistryLine({ track: track, part: part, id: id, relPath: relPath });
  console.log("Scaffolded " + id + " -> " + relPath + " (archetype: " + archetype + ")");
}

// Insert a registry line after the last line of the same track+part, else before
// the array close. path/href already point at the content dir.
function appendRegistryLine(o) {
  const href = o.relPath + "/";
  const line = `    { track: "${o.track}", part: "${o.part}", id: "${o.id}", href: "${href}", kind: "lesson", path: "${o.relPath}" },`;
  const text = fs.readFileSync(registryPath, "utf8");
  const lines = text.split("\n");
  let lastIdx = -1;
  const partRe = new RegExp('part: "' + escRe(o.part) + '"');
  const trackRe = new RegExp('track: "' + escRe(o.track) + '"');
  for (let i = 0; i < lines.length; i++) {
    if (trackRe.test(lines[i]) && partRe.test(lines[i])) lastIdx = i;
  }
  if (lastIdx === -1) {
    // No sibling: insert before the closing "];" of the lessons array.
    for (let i = 0; i < lines.length; i++) {
      if (/^\s*\];\s*$/.test(lines[i])) { lastIdx = i - 1; break; }
    }
  }
  // Ensure the preceding line ends with a comma.
  if (lastIdx >= 0 && !/,\s*$/.test(lines[lastIdx])) lines[lastIdx] = lines[lastIdx].replace(/\s*$/, ",");
  lines.splice(lastIdx + 1, 0, line);
  fs.writeFileSync(registryPath, lines.join("\n"));
}

// ---- entry ----

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.from && typeof args.from === "string") {
    migrateFrom(args.from, { move: Boolean(args.move) });
  } else if (args.new) {
    scaffoldNew(args);
  } else {
    console.error("Usage:");
    console.error("  node tools/new-lesson.mjs --from <basename> [--move]");
    console.error("  node tools/new-lesson.mjs --new --track <t> --part <p> --id <id> --archetype <build|drill|viz|checkpoint> --title \"...\"");
    process.exit(1);
  }
}

main();
