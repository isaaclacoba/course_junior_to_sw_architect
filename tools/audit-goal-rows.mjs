/**
 * tools/audit-goal-rows.mjs - "does this tracker row show the learner what to TYPE?"
 *
 * A goal-tracker row is a subtask the learner ticks off while writing code. The
 * caption beside it already states the goal in prose, so a row that repeats the
 * goal in different prose - "start the if chain", "count the pieces" - spends a
 * line of the panel telling the learner something they just read, and leaves them
 * no wiser about what to put in the editor.
 *
 * A row EARNS its place by showing the shape of the code:
 *
 *   bad   { row: "start the if chain",          writes: "if" }
 *   good  { row: "if (errors >= 10)",           writes: "errors >= 10" }
 *
 *   bad   { row: "split csv and count pieces",  writes: ".Split(" }
 *   good  { row: "csv.Split(',')",              writes: ".Split(" }
 *   good  { row: ".Length",                     writes: ".Length" }
 *
 * This is a REPORT, not a gate - it makes a judgement about prose, and a false
 * positive must never block a commit. Run it when authoring or reviewing goals.
 *
 *   node tools/audit-goal-rows.mjs                 # whole course
 *   node tools/audit-goal-rows.mjs <lesson-dir>...  # just these
 *   node tools/audit-goal-rows.mjs --track practical
 */
import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const REPO = path.dirname(ROOT);

// Code punctuation, or a member access like `.Split`.
const PUNCT = /[(){}\[\];=<>+*/%&|!"']|\.\w/;
// A declaration is real code with no punctuation at all: `IClock _clock`,
// `int _treats`, `string Name`.
const DECL = /^(?:[A-Z]\w*|int|string|bool|double|decimal|float|long|char|byte|object|var)(?:<[^>]+>)?(?:\[\])?\s+_?[A-Za-z]\w*$/;
// A bare identifier is a member or enum name the header gives context to
// (`enum Mood` -> `Sleepy`), so it reads as code, not prose.
const IDENT = /^[A-Za-z_]\w*$/;
const KEYWORD = /^\s*(?:return|class|interface|enum|record|struct|case|default|break|continue|throw|try|catch|finally|using|public|private|protected|static|readonly|const|override|virtual|abstract|new|var|if|else|for|foreach|while|switch|do)\b/;

// The git track types commands, not C#, so "shows code" means something else
// there: a real command (`git add cat.txt`), or a repository fact written in
// git's own notation (`main -> add dog`, `HEAD -> main`, `parents: 2`). What
// stays banned is the same thing - a row that restates in prose the goal the
// caption beside it already gives.
const GIT_CMD = /^git\s+\w/;
const GIT_FACT = /(->|\bHEAD\b|\bparents:|\bholds:|\bstaged:|\btag\b|\bbranch\b)/;

export function showsCode(label) {
  const s = String(label || "").trim();
  if (!s) return true;
  if (GIT_CMD.test(s) || GIT_FACT.test(s)) return true;
  return PUNCT.test(s) || DECL.test(s) || IDENT.test(s) || KEYWORD.test(s);
}

function lessonDirs() {
  const src = fs.readFileSync(path.join(REPO, "course-registry.js"), "utf8");
  return [...new Set((src.match(/content\/[^"']+/g) || []).map((d) => d.replace(/\/$/, "")))];
}

function readConfig(dir) {
  const file = path.join(REPO, dir, "data.js");
  if (!fs.existsSync(file)) return null;
  const win = {};
  try {
    vm.runInNewContext(fs.readFileSync(file, "utf8"), { window: win, document: { querySelector: () => null } });
  } catch { return null; }
  return win.LESSON_CONFIG || null;
}

export function auditLesson(dir) {
  const config = readConfig(dir);
  if (!config || !Array.isArray(config.tasks)) return [];
  // On the git track the header IS the command the learner types, so it is held to
  // the same bar. In C# the header names the type the members hang off, so it is not.
  const isGit = dir.startsWith("content/git/");
  const found = [];
  config.tasks.filter((t) => !t.summary).forEach((task, ti) => {
    (task.goals || []).forEach((goal, gi) => {
      const code = goal && goal.code;
      if (!code) return;
      (Array.isArray(code) ? code : [code]).forEach((row, ri) => {
        if (ri === 0 && !isGit) return;
        const label = typeof row === "string" ? row : (row && row.row) || "";
        if (label && !showsCode(label)) found.push({ task: ti + 1, goal: gi, row: ri, label });
      });
    });
  });
  return found;
}

const args = process.argv.slice(2);
const trackAt = args.indexOf("--track");
const track = trackAt >= 0 ? args[trackAt + 1] : null;
let targets = args.filter((a) => a.startsWith("content/"));
if (!targets.length) targets = lessonDirs();
if (track) targets = targets.filter((d) => d.startsWith(`content/${track}/`));

let total = 0;
let lessons = 0;
for (const dir of targets) {
  const rows = auditLesson(dir);
  if (!rows.length) continue;
  lessons++;
  total += rows.length;
  console.log(`\n${dir}  (${rows.length})`);
  for (const r of rows) console.log(`   task ${r.task}  goals[${r.goal}].code[${r.row}]  "${r.label}"`);
}
console.log(total
  ? `\n${total} prose row(s) across ${lessons} lesson(s) - each one should show the code the learner types.`
  : "\nEvery tracker row shows code.");
