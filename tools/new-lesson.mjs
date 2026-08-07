/**
 * tools/new-lesson.mjs - scaffold a new lesson into the generated, per-directory
 * layout content/<track>/<PP-part>/<LL-lesson>/.
 *
 *   node tools/new-lesson.mjs --new --track <t> --part <p> --id <id>
 *                             --archetype <build|drill|viz|checkpoint|lab> --title "..."
 *     Scaffold a brand-new empty lesson dir + stub meta.js/data.js and append a
 *     registry line in order. The track/part must already exist in
 *     course-registry.js `tracks[]`.
 *
 * (The `--from` migration mode was retired once every flat lesson was moved into
 * content/ and course-manifest.js was deleted.)
 *
 * Only Node built-ins.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadBrowserGlobal, conceptsLiteral } from "./lib.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
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

function engineFor(archetype) {
  if (archetype === "build") return "build";
  if (archetype === "drill") return "drill";
  return null;
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
    fs.writeFileSync(path.join(dir, id + ".viz.js"), "(function () {\n  \"use strict\";\n  window.LESSON_CONFIG = { steps: [] };\n})();\n");
  } else if (archetype === "build") {
    fs.writeFileSync(path.join(dir, "data.js"), "(function () {\n  \"use strict\";\n  window.LESSON_CONFIG = { prefix: \"" + id.replace(/-/g, "") + "\", tasks: [] };\n})();\n");
  } else if (archetype === "drill") {
    fs.writeFileSync(path.join(dir, "data.js"), "(function () {\n  \"use strict\";\n  window.LESSON_CONFIG = { prefix: \"" + id.replace(/-/g, "") + "\", drills: [] };\n})();\n");
  } else if (archetype === "lab") {
    fs.writeFileSync(path.join(dir, "data.js"), "(function () {\n  \"use strict\";\n  window.LESSON_CONFIG = { prefix: \"" + id.replace(/-/g, "") + "\", tasks: [] };\n})();\n");
  } else {
    fs.writeFileSync(path.join(dir, "data.js"), "(function () {\n  \"use strict\";\n  window.LESSON_CONFIG = { questions: [] };\n})();\n");
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
    // No sibling (a brand-new part): insert before the closing "];" of the
    // lessons array. Anchor to "var lessons = [" first so we do not stop at the
    // earlier "];" that closes the tracks array.
    let start = 0;
    for (let i = 0; i < lines.length; i++) {
      if (/var\s+lessons\s*=\s*\[/.test(lines[i])) { start = i; break; }
    }
    for (let i = start; i < lines.length; i++) {
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
  if (args.new) {
    scaffoldNew(args);
  } else if (args.from) {
    console.error("--from is retired: the flat lessons were all migrated and course-manifest.js is gone. Use --new.");
    process.exit(1);
  } else {
    console.error("Usage:");
    console.error("  node tools/new-lesson.mjs --new --track <t> --part <p> --id <id> --archetype <build|drill|viz|checkpoint|lab> --title \"...\"");
    process.exit(1);
  }
}

main();
