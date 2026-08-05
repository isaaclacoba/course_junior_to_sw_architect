/**
 * tools/derive-goals.mjs - propose `goals[]` for tasks that have none.
 *
 * WHY THIS EXISTS
 * The live goal tracker turns a task's goal bullets into a checklist that ticks
 * as the learner types. 166 practical tasks; seven have it. The other 159 each
 * need a `goals[]` array: one entry per goal line, index-aligned with the
 * localized prose, each entry naming the type and the members the solution adds.
 *
 * That is mostly mechanical - the solution already SAYS which members it adds -
 * so this tool does the mechanical part and is honest about the rest.
 *
 * WHAT IT WILL NOT DO
 * It does not guess. Three things are genuinely semantic and are reported for a
 * human instead of invented:
 *
 *   - a goal line that names TWO types ("write a `Cat` class and a `Dog` class")
 *     cannot become one box. The prose needs splitting, which means editing every
 *     language bundle, so the tool flags it and moves on.
 *   - a task whose `Main` is rewired between starter and solution needs step rows
 *     ({ row, writes }) describing each move. Statements declare no symbol, so
 *     there is nothing to derive them from.
 *   - a goal line about OUTPUT ("prints two lines") is behaviour, not shape. It
 *     gets `{ gate: null }`, which is correct, not a fallback.
 *
 * Every proposed box lists EVERY member the solution adds over the starter,
 * because tools/lib/lesson-validators.mjs fails a box that hides work - so the
 * output satisfies the granularity rule by construction rather than by luck.
 *
 * USAGE
 *   node tools/derive-goals.mjs                    # every practical lesson, dry run
 *   node tools/derive-goals.mjs <lesson-dir>...    # just these
 *   node tools/derive-goals.mjs --write            # insert the clean ones into data.js
 *   node tools/derive-goals.mjs --all --verbose    # show skipped tasks and why
 *
 * A dry run is the default on purpose: these are CANDIDATES. Read them.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { loadBrowserGlobal } from "./lib.mjs";
import { loadCodeLab } from "./lib/codelab-sandbox.mjs";
import { createValidators } from "./lib/lesson-validators.mjs";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const structure = createRequire(import.meta.url)("../kernel/grading/structure-match.js");

const readJson = (p) => { try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return null; } };

function lessonDirs() {
  const out = [];
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!e.isDirectory()) continue;
      const full = path.join(dir, e.name);
      if (fs.existsSync(path.join(full, "data.js"))) out.push(full);
      else walk(full);
    }
  };
  walk(path.join(root, "content"));
  return out;
}

// The goal prose is localized, so it is NOT in data.js - it lives in the English
// bundle under task.<n>.goal.<i>. That bundle is also what fixes how many goals
// entries a task may have, since the two are index-aligned.
function metaOf(dir) {
  try { return loadBrowserGlobal(path.join(dir, "meta.js"), "LESSON_META"); } catch { return null; }
}

function goalLines(dir, taskIndex) {
  const meta = metaOf(dir);
  const res = (meta && meta.resources) || {};
  const base = res.base || "res/strings";
  const lang = res.lang || "en";
  const bundle = readJson(path.join(dir, base, "default", lang + ".json")) || {};
  const out = [];
  for (let i = 0; ; i++) {
    const v = bundle[`task.${taskIndex + 1}.goal.${i}`];
    if (typeof v !== "string") break;
    out.push(v);
  }
  return out;
}

// A goal line points at a type when it NAMES it. The prose backticks its code
// words (`Cat`, `Speak()`), which is the course's own convention, so that is the
// signal used rather than a loose word match that would hit ordinary prose.
function typesNamedIn(line, typeNames) {
  const ticked = [...line.matchAll(/`([^`]+)`/g)].map((m) => m[1]);
  const hits = new Set();
  for (const t of typeNames) {
    for (const tick of ticked) {
      const bare = tick.replace(/\(.*\)$/, "").trim();
      if (bare === t || bare.startsWith(t + ".")) hits.add(t);
    }
  }
  return [...hits];
}

function headerFor(type) {
  const kind = type.kind || "class";
  const bases = type.bases || [];
  return bases.length ? `${type.name} : ${bases.join(", ")}` : `${kind} ${type.name}`;
}

// Members the SOLUTION adds over the STARTER. A member the starter already
// provides is not work, and a row for it would tick before the learner types.
function addedMembers(solType, starterTypes) {
  const starterType = starterTypes.find((x) => x.name === solType.name);
  const already = new Set(((starterType && starterType.members) || []).map((m) => m.name));
  return (solType.members || []).filter((m) => !already.has(m.name));
}

// The DOMINANT shape in this course is not "add a class", it is "fill in a body
// the starter already declares". `Critter.Label` exists in the starter with a
// TODO and `return "";` inside it, and the solution replaces those statements.
// Nothing is ADDED, so a member row would tick before the learner types a
// character - the mirror image of a row that never ticks, and just as much of a
// lie. What such a task needs is a STEP row watching for what the body must
// contain, which is what `writes` is for.
//
// The statements the solution has and the starter does not are derivable. Which
// of them is the ESSENTIAL idea is not - see the warning attached below.
function bodyWork(task, solTypes, starterTypes) {
  const out = [];
  if (!task.starter || !task.solution) return out;
  for (const solType of solTypes) {
    const starterType = starterTypes.find((x) => x.name === solType.name);
    if (!starterType) continue;
    if (addedMembers(solType, starterTypes).length) continue;
    let before, after;
    try {
      before = structure.stripComments(structure.typeBody(structure.stripComments(task.starter), solType.name));
      after = structure.stripComments(structure.typeBody(structure.stripComments(task.solution), solType.name));
    } catch { continue; }
    if (!before || !after || structure.squeeze(before) === structure.squeeze(after)) continue;

    // Compare LINE by line, not on the squeezed text. Squeezing first and
    // splitting on `;` swallowed the method signature into the diff and produced
    // `publicstringLabel(stringname,intlegs){return$"..."` - unreadable, and
    // pinned to a signature the starter already had. Membership is still tested
    // squeezed, because that is how the gate will compare it.
    const flat = structure.squeeze(before);
    const stmts = after.split("\n")
      .map((x) => x.trim().replace(/[{};]+$/, "").trim())
      .filter((x) => x && !/^[{}]$/.test(x))
      // A line the starter already contains is not work.
      .filter((x) => flat.indexOf(structure.squeeze(x)) === -1)
      // A declaration line is the shape, not the body; the member row covers it.
      .filter((x) => !/^(public|private|protected|internal|static)\b[^=]*\)$/.test(x));
    if (!stmts.length) continue;
    out.push({ type: solType, member: (solType.members || [])[0], writes: stmts });
  }
  return out;
}

function mainRewired(task, solTypes) {
  const holder = solTypes.find((x) => (x.members || []).some((m) => m.name === "Main"));
  if (!holder || !task.starter || !task.solution) return null;
  const bodyOf = (src) => structure.squeeze(
    structure.stripComments(structure.typeBody(structure.stripComments(src), holder.name)));
  try {
    const before = bodyOf(task.starter);
    const after = bodyOf(task.solution);
    if (!before || !after || before === after) return null;
  } catch { return null; }
  return holder.name;
}

function deriveTask(task, lines, scan) {
  const notes = [];
  if (!task.solution) return { notes: ["no solution to derive from"], goals: null };
  if (!lines.length) return { notes: ["no localized goal lines (task.N.goal.i) to align with"], goals: null };

  let solTypes, starterTypes;
  try {
    solTypes = (scan(task.solution) || {}).types || [];
    starterTypes = (scan(task.starter || "") || {}).types || [];
  } catch (e) { return { notes: [`solution could not be scanned: ${e.message}`], goals: null }; }

  // Only types that ADD something are trackable; a type the starter already
  // completes has no work in it.
  const trackable = solTypes
    .map((t) => ({ type: t, added: addedMembers(t, starterTypes) }))
    .filter((x) => x.added.length);
  const names = trackable.map((x) => x.type.name);

  const rewired = mainRewired(task, solTypes);
  if (rewired) {
    notes.push(`\`${rewired}.Main\` is rewired between starter and solution - that box needs step rows ({ row, writes }) written by hand`);
  }

  // Nothing outside `Main` changes, so there is no shape to watch. Say so and
  // stop. Proposing an all-null goals array here would be a NET LOSS: the build
  // card hides the worked example the moment `goals` is non-empty, so the task
  // would trade a finished pattern for a row that only ticks after a run.
  const filling = bodyWork(task, solTypes, starterTypes);
  if (!trackable.length && !filling.length) {
    return {
      notes: [rewired
        ? `all the work is inside \`${rewired}.Main\` - needs step rows ({ row, writes }) written by hand, one per move`
        : "the solution adds no type or member over the starter, and no body differs - there is no shape to track"],
      goals: null,
      nothingToTrack: true,
    };
  }

  // A fill-the-body task: the member exists already, so the row has to watch the
  // body, not the declaration.
  if (!trackable.length) {
    const boxes = filling.map((f) => ({
      code: [headerFor(f.type), { row: "TODO: name the step in the learner's words", writes: f.writes[0] }],
      gate: { type: f.type.name, member: f.member ? f.member.name : undefined, writes: f.writes[0] },
    }));
    const notes = [
      `the starter already declares ${filling.map((f) => `\`${f.type.name}\``).join(", ")} - the work is in the BODY, so a member row would tick before the learner types; these are step rows instead`,
      "CHECK EVERY `writes` BY HAND: it is the author's exact phrasing, and a learner who writes a correct variant must still tick. Loosen it to the essential idea (`$\"` rather than a whole interpolated string), then let the validator prove it still lights up.",
    ];
    if (rewired) notes.push(`\`${rewired}.Main\` is also rewired - that box needs its own step rows`);
    const goals = lines.map((line, i) => boxes[i] && typesNamedIn(line, [boxes[i].gate.type]).length ? boxes[i] : { gate: null });
    return { notes, goals, filling: true };
  }

  const used = new Set();
  const split = new Set();
  const goals = lines.map((line) => {
    const named = typesNamedIn(line, names).filter((n) => !used.has(n));
    if (named.length > 1) {
      named.forEach((n) => split.add(n));
      notes.push(`goal line "${trunc(line)}" names ${named.length} types (${named.join(", ")}) - one line cannot be one box; split the prose in EVERY language bundle first`);
      return { gate: null, _unresolved: true };
    }
    if (!named.length) return { gate: null };

    const name = named[0];
    used.add(name);
    const entry = trackable.find((x) => x.type.name === name);
    const code = [headerFor(entry.type), ...entry.added.map((m) => m.detail || m.name)];
    const gate = { type: name, member: entry.added[0].name };
    if (entry.type.kind && entry.type.kind !== "class") gate.kind = entry.type.kind;
    return { code, gate };
  });

  const untracked = names.filter((n) => !used.has(n) && !split.has(n));
  if (untracked.length) {
    notes.push(`no goal line names ${untracked.map((n) => `\`${n}\``).join(", ")}, so ${untracked.length === 1 ? "it stays" : "they stay"} untracked - add a goal line, or leave it`);
  }

  return { notes, goals, clean: !notes.length && goals.some((g) => g.code) };
}

const trunc = (s, n = 48) => (s.length > n ? s.slice(0, n - 1) + "\u2026" : s);

// A candidate the validator would reject is worthless - it would be pasted in,
// fail the build, and cost more time than writing it by hand. So every proposal
// is run through the SAME check that guards the repo before it is printed. This
// is the tool holding itself to the gate it exists to feed.
function wouldPass(task, goals, scan) {
  const problems = [];
  const validators = createValidators({
    report: { ok: () => {}, bad: (m) => problems.push(m), skip: () => {}, note: () => {} },
    codeLab: () => ({ scanCSharp: scan }),
    dotnet: { available: () => false, compileRun: () => ({ built: false, output: "", errors: "" }) },
    grading: { matches: () => true, buildProbe: () => "" },
  });
  validators.tracker({ config: { tasks: [{ ...task, goals }] } });
  return problems;
}

// Printed so it can be pasted straight into data.js next to the task's solution.
function render(goals) {
  const body = goals.map((g) => {
    if (!g.code) return "        { gate: null }";
    const rows = g.code.map((c) => {
      if (c && typeof c === "object") {
        const parts = Object.entries(c).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join(", ");
        return `            { ${parts} }`;
      }
      return `            ${JSON.stringify(c)}`;
    }).join(",\n");
    const gate = Object.entries(g.gate)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join(", ");
    return `        {\n          code: [\n${rows}\n          ],\n          gate: { ${gate} }\n        }`;
  }).join(",\n");
  return `      goals: [\n${body}\n      ],`;
}

function main() {
  const argv = process.argv.slice(2);
  const write = argv.includes("--write");
  const verbose = argv.includes("--verbose");
  const targets = argv.filter((a) => !a.startsWith("--"));
  const dirs = (targets.length ? targets.map((t) => path.resolve(root, t)) : lessonDirs())
    .filter((d) => fs.existsSync(path.join(d, "data.js")));

  const CL = loadCodeLab();
  if (typeof CL.scanCSharp !== "function") {
    console.error("ERROR no scanCSharp in vendor/code-lab/code-lab.global.js - re-vendor first");
    process.exit(1);
  }

  let proposed = 0, needsHand = 0, already = 0, skipped = 0, nothing = 0, filling = 0;
  for (const dir of dirs) {
    // Only the archetypes whose solution IS C#. A git lesson's solution is a
    // command sequence, so scanning it for types finds nothing and would report
    // 60-odd tasks as "nothing to track" - a true statement about the wrong
    // question, and enough noise to bury the tasks that really are ready.
    const meta = metaOf(dir);
    const archetype = meta && meta.archetype;
    if (archetype !== "build" && archetype !== "drill") continue;

    let cfg;
    try { cfg = loadBrowserGlobal(path.join(dir, "data.js"), "LESSON_CONFIG"); } catch { continue; }
    if (!cfg || !Array.isArray(cfg.tasks)) continue;
    const rel = path.relative(root, dir);
    const chunks = [];

    cfg.tasks.forEach((task, i) => {
      if (task.summary) return;
      if ((task.goals || []).length) { already++; return; }
      const lines = goalLines(dir, i);
      const res = deriveTask(task, lines, CL.scanCSharp);
      const { notes, goals, clean, nothingToTrack } = res;
      if (nothingToTrack) {
        nothing++;
        chunks.push(`  task ${i + 1}: NOTHING TO TRACK\n    - ${notes.join("\n    - ")}\n    - leave \`goals\` off entirely; an all-null array would hide this task's worked example and give back only a run-gated tick`);
        return;
      }
      if (!goals) { skipped++; if (verbose) chunks.push(`  task ${i + 1}: SKIP - ${notes.join("; ")}`); return; }

      const rejected = wouldPass(task, goals, CL.scanCSharp);
      const all = [...notes, ...rejected.map((r) => `REJECTED BY THE VALIDATOR: ${r.replace(/^task \d+ /, "")}`)];
      let head;
      if (rejected.length) { needsHand++; head = `  task ${i + 1}: NEEDS A HUMAN`; }
      else if (res.filling) { filling++; head = `  task ${i + 1}: BODY WORK - step rows, read them`; }
      else if (clean) { proposed++; head = `  task ${i + 1}: READY`; }
      else { needsHand++; head = `  task ${i + 1}: NEEDS A HUMAN`; }
      chunks.push([head, ...all.map((n) => `    - ${n}`), render(goals)].join("\n"));
    });

    if (chunks.length) console.log(`\n${rel}\n${chunks.join("\n")}`);
  }

  console.log(`\n${proposed} ready, ${needsHand} need a human, ${filling} are body work (step rows), ${nothing} have nothing to track, ${already} already have goals, ${skipped} skipped.`);
  if (write) console.log("NOTE --write is not implemented yet: every candidate here still wants reading before it lands.");
}

main();
