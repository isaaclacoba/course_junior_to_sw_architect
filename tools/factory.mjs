#!/usr/bin/env node
// tools/factory.mjs - the software factory FSM (see docs/architecture/sw-factory.md)
//
// Derives WHICH PHASE a piece of work is in from artifacts that already exist, so
// an agent cannot advance by claiming to have advanced. Six states:
//
//   recall -> grounding -> deciding -> specifying -> building -> verifying
//
// The current state is the FIRST rung whose exit evidence is missing. Evidence is
// read, never asserted: journal rows (and a cited decision id must actually
// resolve), the brief + design-of-record on disk, and the brief's own checkboxes.
//
// WARN-ONLY (D-sw-factory-1). Every command exits 0 whatever the verdict; only a
// usage error or `selftest` can exit non-zero. Nothing here touches git history, a
// commit, a push or CI - the single git call is a read, with --no-optional-locks
// so it cannot even take the index lock a parallel session might be holding.
//
// Commands (node tools/factory.mjs <cmd> ...):
//   state     [--feature SLUG] [--paths a,b,c] [--json]   the derived phase
//   classify  [--paths a,b,c] [--json]                    fast-path or full ladder (D-7)
//   attribute [--paths a,b,c] [--json]                    path -> feature (D-8)
//   rail      [--feature SLUG] [--paths a,b,c]            2 lines, session start (D-5)
//   gate      [--feature SLUG] [--paths a,b,c]            6 lines, only on a misstep
//   ladder    [--feature SLUG] [--paths a,b,c]            8 lines, on demand
//   sweep     [--commits N] [--json] [--verbose]           replay real history (step 15)
//   selftest                                              asserts the rules + widths

import { readFile, readdir, writeFile, mkdir, rm } from "node:fs/promises";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { randomBytes } from "node:crypto";
import { execFileSync } from "node:child_process";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const PLANS = join(ROOT, "docs", "plans");
const ARCH = join(ROOT, "docs", "architecture");
const JOURNAL = process.env.JOURNAL_DIR || join(ROOT, "docs", "journal");

export const STATES = ["recall", "grounding", "deciding", "specifying", "building", "verifying"];
// Only this edge needs a human (D-sw-factory-9): an agent judging its own
// ambiguity judges it near-zero too early.
export const OWNER_GATE = "deciding->specifying";
// A change under any of these never fast-paths - WoW files and shared machinery.
export const GUARDED_DIRS = [".github/", "kernel/", "code-lab/", "tools/"];
export const FASTPATH_MAX_FILES = 3;

// Features that predate the FSM (D-18/D-19). The tool claims NOTHING about
// them - it does not mark their rungs satisfied, because that would assert they
// passed a bar they never faced. An explicit committed list, never derived and
// never self-extended; a listed feature with no brief is reported, so the list
// cannot rot in silence.
const CONFIG = join(ROOT, "docs", "journal", "factory-config.json");
export function loadFactoryConfig() {
  try {
    const c = JSON.parse(readFileSync(CONFIG, "utf8"));
    return {
      untracked: new Set(c.untracked ?? []),
      reason: c.untrackedReason ?? "predates the FSM",
    };
  } catch {
    return { untracked: new Set(), reason: "predates the FSM" };
  }
}

const COLS = 80;
const clip = (s, n = COLS) => (s.length <= n ? s : s.slice(0, n - 3) + "...");
const uniq = (a) => [...new Set(a)];

// ---- args -------------------------------------------------------------------
function parseArgs(argv) {
  const o = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const eq = a.indexOf("=");
      if (eq > -1) o[a.slice(2, eq)] = a.slice(eq + 1);
      else if (argv[i + 1] && !argv[i + 1].startsWith("--")) o[a.slice(2)] = argv[++i];
      else o[a.slice(2)] = true;
    } else o._.push(a);
  }
  return o;
}

// ---- changed paths (read-only) ----------------------------------------------
// --no-optional-locks: never refresh or lock the index. Two sessions share this
// tree; this call must not contend with the other one's git.
export function changedPaths() {
  let out;
  try {
    out = execFileSync("git", ["--no-optional-locks", "status", "--porcelain", "--untracked-files=all"], {
      cwd: ROOT,
      encoding: "utf8",
      maxBuffer: 8 << 20,
    });
  } catch {
    return [];
  }
  const files = [];
  for (const line of out.split("\n")) {
    if (line.length < 4) continue;
    const xy = line.slice(0, 2);
    let path = line.slice(3);
    const arrow = path.indexOf(" -> ");
    if (arrow > -1) path = path.slice(arrow + 4); // rename: attribute the destination
    path = path.replace(/^"(.*)"$/, "$1");
    files.push({ path, isNew: xy === "??" || xy.includes("A") });
  }
  return files;
}

// Replay real commits through the same classifier and attribution the live gate
// uses (step 15). Read-only: `git log` never writes, and --no-optional-locks keeps
// it off the index a parallel session may hold.
export function commitsFromLog(n) {
  let out;
  try {
    out = execFileSync(
      "git",
      ["--no-optional-locks", "log", "-n", String(n), "--no-merges", "--name-status", "--format=%x01%H%x09%s"],
      { cwd: ROOT, encoding: "utf8", maxBuffer: 64 << 20 }
    );
  } catch {
    return [];
  }
  const commits = [];
  for (const chunk of out.split("\u0001").slice(1)) {
    const [head, ...rest] = chunk.split("\n");
    const [sha, subject] = head.split("\t");
    const paths = [];
    for (const line of rest) {
      if (!line.trim()) continue;
      const parts = line.split("\t");
      const status = parts[0][0];
      if (status === "D") continue; // a deletion owns nothing to attribute
      const path = parts[parts.length - 1];
      paths.push({ path, isNew: status === "A" });
    }
    if (paths.length) commits.push({ sha: (sha || "").slice(0, 7), subject: subject ?? "", paths });
  }
  return commits;
}

export function sweep(commits, briefs) {
  const rows = commits.map((c) => {
    const cls = classify(c.paths);
    const attr = attribute(c.paths, briefs);
    return {
      sha: c.sha,
      subject: c.subject,
      files: cls.files,
      lane: cls.fastPath ? "fast" : "full",
      features: Object.keys(attr.byFeature),
      unclaimed: attr.unclaimed.length,
      conflicts: attr.conflicts.length,
    };
  });
  const n = rows.length || 1;
  const claiming = briefs.filter((b) => b.declaredOwns.length > 0).length;
  return {
    rows,
    total: rows.length,
    briefs: briefs.length,
    briefsDeclaringOwns: claiming,
    fastPath: rows.filter((r) => r.lane === "fast").length,
    fastPathPct: Math.round((rows.filter((r) => r.lane === "fast").length / n) * 100),
    fullyUnclaimed: rows.filter((r) => r.features.length === 0).length,
    anyUnclaimed: rows.filter((r) => r.unclaimed > 0).length,
    withConflicts: rows.filter((r) => r.conflicts > 0).length,
    multiFeature: rows.filter((r) => r.features.length > 1).length,
  };
}

// A --paths list has no git status behind it, so nothing is known to be new.
function pathsFromFlag(v) {
  return String(v)
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((p) => ({ path: p, isNew: !existsSync(join(ROOT, p)) }));
}
function resolvePaths(o) {
  return o.paths ? pathsFromFlag(o.paths) : changedPaths();
}

// ---- attribution (D-sw-factory-8) -------------------------------------------
// `?` is escaped rather than supported: `## Owns` globs use * and ** only.
export function globToRe(pattern) {
  let p = pattern.trim().replace(/^\.\//, "");
  if (p.endsWith("/")) p += "**";
  const esc = p.replace(/[.+^${}()|[\]\\?]/g, "\\$&");
  const body = esc
    .replace(/\*\*\//g, "\u0000")
    .replace(/\*\*/g, "\u0001")
    .replace(/\*/g, "[^/]*")
    .replace(/\u0000/g, "(?:.*/)?")
    .replace(/\u0001/g, ".*");
  return new RegExp(`^${body}$`);
}
export function matchesGlob(pattern, path) {
  return globToRe(pattern).test(path);
}

// Pull `## Owns` bullet lines. Backticked items win; a bare bullet is accepted so
// a brief written without backticks still attributes.
export function parseOwns(md) {
  const lines = md.split("\n");
  const start = lines.findIndex((l) => /^##\s+Owns\s*$/i.test(l));
  if (start === -1) return [];
  const owns = [];
  for (let i = start + 1; i < lines.length; i++) {
    const l = lines[i];
    if (/^##\s/.test(l)) break;
    if (!/^\s*[-*]\s/.test(l)) continue;
    const ticks = [...l.matchAll(/`([^`]+)`/g)].map((m) => m[1].trim());
    if (ticks.length) owns.push(...ticks);
    else owns.push(l.replace(/^\s*[-*]\s+/, "").trim());
  }
  return uniq(owns.filter(Boolean));
}

// Every brief's plan checkboxes: `1. [x] ...` or `- [ ] ...`.
export function parseSteps(md) {
  const lines = md.split("\n");
  const start = lines.findIndex((l) => /^##\s+Plan\s*$/i.test(l));
  const from = start === -1 ? 0 : start + 1;
  const steps = [];
  for (let i = from; i < lines.length; i++) {
    if (start !== -1 && /^##\s/.test(lines[i])) break;
    const m = lines[i].match(/^\s*(?:\d+\.|[-*])\s+\[([ xX])\]\s*(.*)$/);
    if (m) steps.push({ done: m[1].toLowerCase() === "x", text: m[2].trim() });
  }
  return steps;
}

export async function loadBriefs() {
  let names = [];
  try {
    names = (await readdir(PLANS)).filter((f) => f.endsWith(".md"));
  } catch {
    return [];
  }
  const briefs = [];
  for (const f of names) {
    const slug = f.replace(/\.md$/, "");
    const md = await readFile(join(PLANS, f), "utf8");
    briefs.push({
      slug,
      briefPath: `docs/plans/${f}`,
      designPath: `docs/architecture/${slug}.md`,
      hasDesign: existsSync(join(ARCH, `${slug}.md`)),
      // The early phases self-attribute: both docs carry the slug in the filename,
      // so a feature is attributable before it ever writes `## Owns`.
      owns: uniq([`docs/plans/${f}`, `docs/architecture/${slug}.md`, ...parseOwns(md)]),
      declaredOwns: parseOwns(md),
      steps: parseSteps(md),
    });
  }
  return briefs;
}

export function attributePath(path, briefs) {
  return briefs.filter((b) => b.owns.some((g) => matchesGlob(g, path))).map((b) => b.slug);
}

export function attribute(paths, briefs) {
  const rows = paths.map((p) => ({ path: p.path, isNew: p.isNew, features: attributePath(p.path, briefs) }));
  return {
    rows,
    unclaimed: rows.filter((r) => r.features.length === 0).map((r) => r.path),
    conflicts: rows.filter((r) => r.features.length > 1).map((r) => ({ path: r.path, features: r.features })),
    byFeature: rows.reduce((acc, r) => {
      for (const f of r.features) (acc[f] ||= []).push(r.path);
      return acc;
    }, {}),
  };
}

// ---- fast-path classifier (D-sw-factory-7) ----------------------------------
// Classification is continuous, never a declaration: it is recomputed from the
// live changeset on every call, so a task that grows past a threshold escalates
// by itself.
export function classify(paths) {
  const files = uniq(paths.map((p) => p.path));
  const created = paths.filter((p) => p.isNew).map((p) => p.path);
  const guarded = files.filter((f) => GUARDED_DIRS.some((d) => f.startsWith(d)));
  const reasons = [];
  if (created.length) reasons.push(`creates ${created.length} new file(s)`);
  if (files.length > FASTPATH_MAX_FILES) reasons.push(`touches ${files.length} files (max ${FASTPATH_MAX_FILES})`);
  if (guarded.length) reasons.push(`touches guarded ${uniq(guarded.map((f) => GUARDED_DIRS.find((d) => f.startsWith(d)))).join(", ")}`);
  return { fastPath: reasons.length === 0, files: files.length, created, guarded, reasons };
}

// ---- journal evidence -------------------------------------------------------
export async function journalEvidence(slug) {
  const empty = { outputs: [], decisions: [], decisionIds: new Set() };
  const dirs = { outputs: join(JOURNAL, "outputs"), decisions: join(JOURNAL, "decisions") };
  const files = {};
  for (const [k, d] of Object.entries(dirs)) {
    try {
      files[k] = (await readdir(d)).filter((f) => f.endsWith(".parquet")).map((f) => join(d, f));
    } catch {
      files[k] = [];
    }
  }
  if (!files.outputs.length && !files.decisions.length) return empty;
  let con;
  try {
    const { DuckDBInstance } = await import("@duckdb/node-api");
    con = await (await DuckDBInstance.create(":memory:")).connect();
  } catch {
    return empty; // no reader available - report no evidence rather than crash
  }
  const list = (fs) => fs.map((f) => `'${f.replace(/'/g, "''")}'`).join(", ");
  const read = async (sql, params = []) => (await con.runAndReadAll(sql, params)).getRowObjects();
  const outputs = files.outputs.length
    ? await read(
        `SELECT feature, kind, title, body, ts FROM read_parquet([${list(files.outputs)}], union_by_name=true) WHERE feature = ?`,
        [slug]
      )
    : [];
  const decisionIds = new Set();
  let decisions = [];
  if (files.decisions.length) {
    const latest =
      `(SELECT * EXCLUDE (rn) FROM (SELECT *, row_number() OVER (PARTITION BY id ORDER BY ts DESC) rn ` +
      `FROM read_parquet([${list(files.decisions)}], union_by_name=true)) WHERE rn=1)`;
    for (const r of await read(`SELECT id, feature, status FROM ${latest}`)) {
      decisionIds.add(r.id);
      if (r.feature === slug) decisions.push(r);
    }
  }
  return { outputs, decisions, decisionIds };
}

// A recall row is not "a row that says recall". It must name a decision id that
// ACTUALLY RESOLVES in the journal, or declare `recall: none` - so the evidence
// is a fact about the archive, not the agent's prose (D-11, and the design's
// "a gate that greps for a word is trivially gamed").
export function recallCitations(outputs, decisionIds) {
  // Resolve case-insensitively: the matcher already is, and a Set lookup that is
  // not would silently refuse a valid citation written `d-sw-factory-11`.
  const canon = new Map([...decisionIds].map((id) => [String(id).toLowerCase(), String(id)]));
  const cited = new Set();
  let none = false;
  for (const r of outputs) {
    const text = `${r.title ?? ""}\n${r.body ?? ""}`;
    for (const m of text.matchAll(/\bD-[a-z0-9][a-z0-9-]*-\d+\b/gi)) {
      const hit = canon.get(m[0].toLowerCase());
      if (hit) cited.add(hit);
    }
    // "none" must be declared literally, but may carry an explanation after it -
    // refusing an honest `recall: none - nothing prior` would punish the good case.
    if (/^\s*recall:\s*none\b/im.test(text)) none = true;
  }
  return { cited: [...cited], none };
}

// ---- state derivation (step 7) ----------------------------------------------
export function deriveRungs({ outputs, decisions, decisionIds, brief }) {
  const recall = recallCitations(outputs, decisionIds);
  const grounding = outputs.filter((r) => ["audit", "subagent", "poc"].includes(r.kind));
  const active = decisions.filter((d) => d.status !== "superseded");
  const steps = brief?.steps ?? [];
  const doneSteps = steps.filter((s) => s.done).length;
  const hasBrief = Boolean(brief);
  const hasDesign = Boolean(brief?.hasDesign);
  return [
    {
      state: "recall",
      ok: recall.cited.length > 0 || recall.none,
      evidence: recall.none ? "declared `none`" : `${recall.cited.length} decision(s) cited`,
      missing: "a journal row citing a decision id that resolves",
      fix: "journal.mjs record --kind audit --feature <slug>",
    },
    {
      state: "grounding",
      ok: grounding.length > 0,
      evidence: `${grounding.length} grounding row(s)`,
      missing: "an audit / subagent / poc journal row for this feature",
      fix: "audit the real code or run a PoC, then record it",
    },
    {
      state: "deciding",
      ok: active.length > 0,
      evidence: `${active.length} decision(s), active`,
      missing: "D-<feature>-N decision rows",
      fix: "journal.mjs decision --feature <slug> --question ...",
      ownerGate: true,
    },
    {
      state: "specifying",
      ok: hasBrief && hasDesign,
      evidence: hasBrief && hasDesign ? "brief + design-of-record" : hasBrief ? "brief only" : "neither",
      missing: hasBrief ? `docs/architecture/${brief.slug}.md` : "docs/plans/<slug>.md + docs/architecture/<slug>.md",
      fix: "owner signs off, then write the brief + design doc",
    },
    {
      state: "building",
      ok: steps.length > 0 && doneSteps === steps.length,
      evidence: steps.length ? `${doneSteps}/${steps.length} plan steps` : "no plan steps",
      missing: steps.length ? `${steps.length - doneSteps} unticked plan step(s)` : "a Plan section with checkboxes",
      fix: hasBrief ? `tick every Plan step in ${brief.briefPath}` : "write the brief first",
    },
  ];
}

export function stateFromRungs(rungs) {
  const first = rungs.find((r) => !r.ok);
  return first ? first.state : "verifying";
}

async function computeState(o) {
  const briefs = await loadBriefs();
  const paths = resolvePaths(o);
  const attr = attribute(paths, briefs);
  const slug = pickFeature(o, attr, briefs);
  const brief = briefs.find((b) => b.slug === slug) ?? null;
  const ev = slug ? await journalEvidence(slug) : { outputs: [], decisions: [], decisionIds: new Set() };
  const cfg = loadFactoryConfig();
  const untracked = Boolean(slug) && cfg.untracked.has(slug);
  const rungs = deriveRungs({ ...ev, brief });
  // `untracked` is not a rung and never appears in STATES - it means the machine
  // declines to judge, which is different from judging the feature to be early.
  const state = untracked ? "untracked" : stateFromRungs(rungs);
  return {
    slug, brief, briefs, paths, attr, rungs, state,
    cls: classify(paths),
    untracked,
    untrackedReason: cfg.reason,
    staleUntracked: staleUntracked(briefs, cfg),
    ...ev,
  };
}

// Feature choice: an explicit flag, else the changeset's single clear owner, else
// the brief with the most touched paths. Never guessed from prose.
function pickFeature(o, attr, briefs) {
  if (o.feature) return String(o.feature);
  const counts = Object.entries(attr.byFeature).sort((a, b) => b[1].length - a[1].length);
  if (counts.length) return counts[0][0];
  return briefs.length ? null : null;
}

// ---- renderers (D-sw-factory-5) ---------------------------------------------
// Every renderer is width-budgeted; `selftest` asserts the measured widths, which
// is how the ladder's 83-column wrap was caught in the mockup.
export function renderRail(s) {
  // Untracked: say nothing. Claiming a phase here would assert the feature
  // passed rungs it never faced (D-18).
  if (s.untracked) return [];
  if (!s.slug) {
    return [
      clip("factory: no feature claimed - state `recall` (rung 1 of 6)"),
      clip("  next: journal search the topic, then record what you found"),
      clip("  run this state with the `recall` agent; `factory ladder` for all 6"),
    ];
  }
  const rung = s.rungs.find((r) => r.state === s.state);
  const lane = s.cls.fastPath ? "fast-path" : "full ladder";
  const at = STATES.indexOf(s.state) + 1;
  const l1 = `factory: ${s.slug} in \`${s.state}\` (rung ${at} of 6) - ${lane}`;
  const l2 = `next: ${rung ? rung.fix : "npm run gate"}`;
  const l3 = `run this state with the \`${s.state}\` agent; \`factory ladder\` for all 6`;
  return [clip(l1), clip("  " + l2), clip("  " + l3)];
}

export function renderLadder(s) {
  if (s.untracked) {
    return [
      clip(`${s.slug} - not tracked (${s.untrackedReason})`),
      clip("  the FSM claims nothing about this feature - no phase, no advice"),
      clip(`  to measure it, delete its line from ${relative(ROOT, CONFIG)}`),
    ];
  }
  const head = s.slug ? `${s.slug} - full ladder (warn-only)` : "no feature claimed - full ladder (warn-only)";
  const rungs = [...s.rungs, { state: "verifying", ok: false, evidence: "npm run gate", fix: "npm run gate" }];
  const lines = [clip(head)];
  for (const r of rungs) {
    const here = r.state === s.state;
    const mark = r.ok ? "x" : here ? ">" : " ";
    const note = here ? "  <- you are here" : r.ownerGate ? "  <- owner closes this" : "";
    const row = `  [${mark}] ${r.state.padEnd(10)} ${clip(r.evidence, 26).padEnd(26)}${note}`;
    lines.push(clip(row.replace(/\s+$/, "")));
  }
  const cur = rungs.find((r) => r.state === s.state);
  lines.push(clip(`  next: ${cur ? cur.fix : "npm run gate"}`));
  return lines;
}

// Six lines, and only worth printing when `missteps()` returns something.
// Fit a path list into one gate line: names while they fit, then "+N more".
function summarise(list, budget) {
  if (!list.length) return "(none)";
  for (let n = list.length; n >= 1; n--) {
    const rest = list.length - n;
    const text = list.slice(0, n).join(", ") + (rest ? `, +${rest} more` : "");
    if (text.length <= budget) return text;
  }
  return `${list.length} path(s)`;
}

export function renderGate(s, problems) {
  if (s.untracked) return [];
  const touched = uniq(s.paths.map((p) => p.path));
  const lines = [
    clip(`factory: WARN-ONLY. ${problems[0] ?? "phase mismatch"}`, 66),
    clip(`  feature   ${s.slug ?? "(none)"} -> \`${s.state}\``, 66),
    clip(`  missing   ${s.rungs.find((r) => !r.ok)?.missing ?? "nothing - run the gate"}`, 66),
    (() => {
      const head = `  touched   ${touched.length} file(s): `;
      return clip(head + summarise(touched, 66 - head.length), 66);
    })(),
    clip(`  unclaimed ${summarise(s.attr.unclaimed, 54)}`, 66),
    clip(`  fix       ${s.rungs.find((r) => !r.ok)?.fix ?? "npm run gate"}`, 66),
  ];
  return lines;
}

// ---- agent hooks (D-16, D-20) -----------------------------------------------
// Warn-only, so there is no PreToolUse and nothing can ever be denied - only
// PreToolUse can block, and not wiring it removes that risk entirely. Every path
// here prints JSON and exits 0; a thrown error prints `{}` so a bug in this file
// can never disturb a session (its own or anyone else's).
//
// The contract, taken from a shipping repo-level example rather than docs:
//   stdin   the event as JSON (tool_name, cwd, session_id, stop_hook_active)
//   stdout  {} for silence, or { hookSpecificOutput: { hookEventName, ... } }
//   speak   additionalContext to inform, decision "warn" + reason to nudge
const HOOK_EVENTS = new Set(["SessionStart", "PostToolUse", "Stop", "SubagentStop"]);
const READ_ONLY_TOOLS = new Set([
  "view", "read", "read_file", "readFile", "grep", "glob", "search", "search_files",
  "list", "list_dir", "listDirectory", "fetch", "web_fetch", "webFetch", "sql",
  "ask_user", "list_bash", "read_bash", "list_agents", "read_agent", "think",
]);

const speak = (event, extra) => ({ hookSpecificOutput: { hookEventName: event, ...extra } });
const context = (event, text) => speak(event, { additionalContext: text });
const warn = (event, reason) => speak(event, { decision: "warn", reason });

// PostToolUse fires on every tool call, so it must stay journal-free and must
// only speak when the lane actually FLIPS - a line on every call is noise.
function laneFile(sessionId) {
  return join(tmpdir(), `factory-lane-${String(sessionId || "anon").replace(/[^\w.-]/g, "_")}.txt`);
}
export function laneFlipped(sessionId, lane) {
  const f = laneFile(sessionId);
  let prev = null;
  try {
    prev = readFileSync(f, "utf8").trim();
  } catch {}
  if (prev === lane) return false;
  try {
    writeFileSync(f, lane);
  } catch {}
  return prev !== null && prev !== lane;
}

// D-20: checkbox rot is why the `building` rung cannot be trusted. It cannot be
// repaired backwards, only stopped going forward - so say something at the one
// moment the session still has the context to tick the box.
// Count ticked steps as HEAD has them, so "did a step get ticked in this working
// tree" is a real comparison rather than "was the brief file touched at all".
export function ticksAtHead(briefPath) {
  try {
    const md = execFileSync("git", ["--no-optional-locks", "show", `HEAD:${briefPath}`], {
      cwd: ROOT,
      encoding: "utf8",
      maxBuffer: 8 << 20,
      stdio: ["ignore", "pipe", "ignore"],
    });
    return parseSteps(md).filter((x) => x.done).length;
  } catch {
    return 0; // a brief that does not exist at HEAD is new; every tick is new too
  }
}

export function untickedWork(paths, briefs, cfg = loadFactoryConfig(), ticksAt = ticksAtHead) {
  const touched = new Set(paths.map((p) => p.path));
  const out = [];
  for (const b of briefs) {
    if (cfg.untracked.has(b.slug)) continue;
    if (!b.declaredOwns?.length) continue;
    const ownsTouched = [...touched].filter((p) => p !== b.briefPath && b.owns.some((g) => matchesGlob(p, g)));
    if (!ownsTouched.length) continue;
    const now = b.steps.filter((x) => x.done).length;
    if (now > ticksAt(b.briefPath)) continue; // a step really was ticked
    out.push({ slug: b.slug, files: ownsTouched.length, brief: b.briefPath, ticked: now });
  }
  return out;
}

export async function runHook(event, input) {
  if (!HOOK_EVENTS.has(event)) return {};
  if (input?.stop_hook_active) return {};

  if (event === "PostToolUse") {
    // This fires on EVERY tool call, in every session in the repo, so the cheap
    // exit comes first. A SKIP list rather than an allow list on purpose: tool
    // names differ between agents, and an allow list that matches nothing would
    // fail silently while looking like it worked. `bash` is not skipped - it writes.
    if (READ_ONLY_TOOLS.has(String(input?.tool_name ?? ""))) return {};
    const paths = changedPaths();
    if (!paths.length) return {};
    const lane = classify(paths).fastPath ? "fast-path" : "full ladder";
    if (lane !== "full ladder" || !laneFlipped(input?.session_id, lane)) return {};
    return context(
      event,
      "factory: this edit moved the change off the fast path (new file, >3 files, " +
        "or a guarded dir). Run `node tools/factory.mjs ladder` before going further."
    );
  }

  if (event === "SessionStart") {
    const s = await computeState({});
    const lines = renderRail(s);
    if (!lines.length) return {};
    return context(event, lines.join("\n"));
  }

  if (event === "Stop" || event === "SubagentStop") {
    const briefs = await loadBriefs();
    const paths = changedPaths();
    const unticked = untickedWork(paths, briefs);
    if (event === "Stop") {
      try {
        await recordHealth(await measureHealth({}), "stop");
      } catch {}
    }
    if (unticked.length) {
      const list = unticked.map((u) => `${u.slug} (${u.files} file(s), ${u.brief})`).join("; ");
      return warn(
        event,
        `factory: you changed files owned by ${list} but ticked no step in the brief. ` +
          "Tick the step you finished, or add one for what you actually did - an untickable " +
          "brief is why the machine cannot tell what is built."
      );
    }
    const s = await computeState({}); // re-reads the working tree itself
    const problems = missteps(s);
    if (!problems.length) return {};
    return warn(event, `factory (warn-only): ${renderGate(s, problems).join(" | ")}`);
  }
  return {};
}

async function readStdin() {
  if (process.stdin.isTTY) return {};
  const chunks = [];
  for await (const c of process.stdin) chunks.push(c);
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
  } catch {
    return {};
  }
}

// ---- audit history (D-17) ---------------------------------------------------
// Warn-only means nothing is ever blocked, so the only way to tell whether the
// way of working is improving is to measure the same numbers repeatedly. Each
// row is one observation; `history` shows the trend. Written on Stop and on
// demand via `sweep --record`.
const HISTORY = join(ROOT, "docs", "journal", "factory");
const HISTORY_CAST = [
  "CAST(ts AS TIMESTAMP) ts",
  "CAST(commits AS INTEGER) commits",
  "CAST(fastpath AS INTEGER) fastpath",
  "CAST(unclaimed AS INTEGER) unclaimed",
  "CAST(multi AS INTEGER) multi",
  "CAST(briefs AS INTEGER) briefs",
  "CAST(owns AS INTEGER) owns",
  "CAST(untracked AS INTEGER) untracked",
  "CAST(stalled AS INTEGER) stalled",
  "CAST(\"source\" AS VARCHAR) AS \"source\"",
].join(", ");

// Measure everything a health round would want to watch improve.
export async function measureHealth({ commits = 40 } = {}) {
  const briefs = await loadBriefs();
  const cfg = loadFactoryConfig();
  const sw = sweep(commitsFromLog(commits), briefs);
  const journalRungs = ["recall", "grounding", "deciding"];
  let stalled = 0;
  for (const b of briefs) {
    if (cfg.untracked.has(b.slug)) continue;
    const st = stateFromRungs(deriveRungs({ ...(await journalEvidence(b.slug)), brief: b }));
    if (journalRungs.includes(st)) stalled++;
  }
  return {
    commits: sw.total,
    fastpath: sw.fastPath,
    unclaimed: sw.fullyUnclaimed,
    multi: sw.multiFeature,
    briefs: briefs.length,
    owns: briefs.filter((b) => b.declaredOwns?.length).length,
    untracked: [...cfg.untracked].filter((f) => briefs.some((b) => b.slug === f)).length,
    stalled,
  };
}

export async function recordHealth(row, source = "manual") {
  const { DuckDBInstance } = await import("@duckdb/node-api");
  const con = await (await DuckDBInstance.create(":memory:")).connect();
  await mkdir(HISTORY, { recursive: true });
  const tmp = join(tmpdir(), `factory-${Date.now()}-${randomBytes(4).toString("hex")}.jsonl`);
  const out = join(HISTORY, `${Date.now()}-${randomBytes(4).toString("hex")}.parquet`);
  const ts = new Date().toISOString().replace("Z", "").replace("T", " ");
  await writeFile(tmp, JSON.stringify({ ts, ...row, source }));
  try {
    await con.run(
      `COPY (SELECT ${HISTORY_CAST} FROM read_json('${tmp.replace(/'/g, "''")}', ` +
        `format='newline_delimited', union_by_name=true)) TO '${out.replace(/'/g, "''")}' ` +
        `(FORMAT PARQUET, COMPRESSION ZSTD)`
    );
  } finally {
    await rm(tmp, { force: true });
  }
  return out;
}

export async function readHealth(limit = 20) {
  if (!existsSync(HISTORY)) return [];
  const files = readdirSync(HISTORY).filter((f) => f.endsWith(".parquet")).map((f) => join(HISTORY, f));
  if (!files.length) return [];
  const { DuckDBInstance } = await import("@duckdb/node-api");
  const con = await (await DuckDBInstance.create(":memory:")).connect();
  const list = files.map((f) => `'${f.replace(/'/g, "''")}'`).join(", ");
  const reader = await con.runAndReadAll(
    `SELECT * FROM read_parquet([${list}], union_by_name=true) ORDER BY ts DESC LIMIT ${Number(limit)}`
  );
  return reader.getRowObjects();
}

// A rising number is not automatically bad, so the trend is shown, never graded.
export function renderHealth(rows) {
  if (!rows.length) return ["factory history: no observations yet - run `factory sweep --record`"];
  const lines = [clip(`factory history: ${rows.length} observation(s), newest first`)];
  lines.push(clip("  when              stalled  unclaimed  owns/briefs  untracked"));
  for (const r of rows) {
    const when = String(r.ts).slice(0, 16);
    lines.push(
      clip(
        `  ${when.padEnd(17)} ${String(r.stalled).padStart(7)}  ${String(r.unclaimed).padStart(9)}  ` +
          `${`${r.owns}/${r.briefs}`.padStart(11)}  ${String(r.untracked).padStart(9)}`
      )
    );
  }
  return lines;
}

// A misstep is derived, never asserted. Warn-only: this returns text, not an exit code.
// A listed feature with no brief means the list has rotted. Reported, not
// silently corrected - the list is the owner's, and the tool never edits it.
export function staleUntracked(briefs, cfg = loadFactoryConfig()) {
  const slugs = new Set(briefs.map((b) => b.slug));
  return [...cfg.untracked].filter((f) => !slugs.has(f));
}

export function missteps(s) {
  const out = [];
  if (s.untracked) return [];
  if (s.staleUntracked?.length) out.push(`untracked list names ${s.staleUntracked.length} missing brief(s)`);
  const editing = s.paths.length > 0;
  const idx = STATES.indexOf(s.state);
  if (editing && idx < STATES.indexOf("building") && !s.cls.fastPath) {
    out.push(`editing while \`${s.state}\` is unfinished`);
  }
  if (s.attr.unclaimed.length) out.push(`${s.attr.unclaimed.length} path(s) no brief claims`);
  for (const c of s.attr.conflicts) out.push(`${c.path} claimed by ${c.features.join(" + ")}`);
  if (!s.cls.fastPath && s.cls.reasons.length && s.state === "building") {
    // not a misstep on its own - only reported when something else already fired
  }
  return out;
}

// ---- selftest ---------------------------------------------------------------
// Controls matter as much as the positives: a checker proved only loud is not
// proved quiet. Each `ok-` case below is a shape that must NOT warn.
async function selftest() {
  const fails = [];
  const t = (name, cond, detail = "") => {
    if (!cond) fails.push(`${name}${detail ? " - " + detail : ""}`);
  };
  const P = (path, isNew = false) => ({ path, isNew });

  // --- glob
  t("glob: exact", matchesGlob("tools/factory.mjs", "tools/factory.mjs"));
  t("glob: star stays in segment", matchesGlob(".github/hooks/*.json", ".github/hooks/a.json"));
  t("glob: ok-star does not cross /", !matchesGlob(".github/hooks/*.json", ".github/hooks/x/a.json"));
  t("glob: globstar", matchesGlob("content/**/meta.js", "content/git/01-a/02-b/meta.js"));
  t("glob: dir suffix", matchesGlob("kernel/", "kernel/engine/lesson-engine.js"));
  t("glob: ok-dot is literal", !matchesGlob("a.js", "aXjs"));

  // --- classifier (D-7): the three predicates, then escalation
  t("classify: 3 plain files fast-path", classify([P("a.md"), P("b.md"), P("c.md")]).fastPath);
  t("classify: 4 files escalate", !classify([P("a.md"), P("b.md"), P("c.md"), P("d.md")]).fastPath);
  t("classify: a new file escalates", !classify([P("a.md", true)]).fastPath);
  for (const d of GUARDED_DIRS) t(`classify: ${d} escalates`, !classify([P(`${d}x.js`)]).fastPath);
  t("classify: ok-lesson content fast-paths", classify([P("content/git/01-a/02-b/data.js")]).fastPath);
  // continuous re-measure: the SAME task, one file bigger, flips by itself
  const grow = [P("a.md"), P("b.md"), P("c.md")];
  t("classify: auto-escalation is continuous", classify(grow).fastPath && !classify([...grow, P("d.md")]).fastPath);
  t("classify: escalation names the reason", /touches 4 files/.test(classify([...grow, P("d.md")]).reasons.join(" ")));

  // --- attribution (D-8): the real shared tree, sw-factory vs git-inside-track
  const briefs = await loadBriefs();
  t("attr: briefs loaded", briefs.length > 5, `${briefs.length}`);
  const swf = briefs.find((b) => b.slug === "sw-factory");
  t("attr: sw-factory declares ## Owns", swf && swf.declaredOwns.length >= 3);
  const a = attribute(
    [
      P("tools/factory.mjs"),
      P("docs/plans/sw-factory.md"),
      P("docs/architecture/git-inside-track.md"),
      P("docs/plans/git-inside-track.md"),
      P("tools/derive-goals.mjs"),
    ],
    briefs
  );
  const f = a.byFeature;
  t("attr: factory.mjs -> sw-factory", (f["sw-factory"] || []).includes("tools/factory.mjs"));
  t("attr: sw-factory does not claim git-inside-track", !(f["sw-factory"] || []).some((p) => p.includes("git-inside-track")));
  t("attr: git-inside-track claims both its docs", (f["git-inside-track"] || []).length === 2);
  t("attr: git-inside-track does not claim factory.mjs", !(f["git-inside-track"] || []).includes("tools/factory.mjs"));
  t("attr: unclaimed path is the warning", a.unclaimed.includes("tools/derive-goals.mjs"));
  t("attr: ok-no false conflict", a.conflicts.length === 0, JSON.stringify(a.conflicts));

  // --- recall evidence must RESOLVE, not merely be written (step 14)
  const ids = new Set(["D-sw-factory-11", "D-wow-enforcement-6"]);
  const rc = (body) => recallCitations([{ body }], ids);
  const satisfies = (body) => rc(body).cited.length > 0 || rc(body).none;
  t("recall: resolving id counts", rc("cites D-sw-factory-11").cited.length === 1);
  t("recall: a cross-feature id counts", rc("D-wow-enforcement-6 ruled this out").cited.length === 1);
  t("recall: case-insensitive resolve", rc("see d-sw-factory-11").cited[0] === "D-sw-factory-11");
  t("recall: explicit none counts", rc("recall: none").none);
  t("recall: none may carry an explanation", rc("recall: none - nothing prior").none);
  // gaming attempts - each of these must REFUSE
  t("recall: ok-invented id refused", !satisfies("cites D-made-up-99"));
  t("recall: ok-prose alone refused", !satisfies("I recalled everything, honest"));
  t("recall: ok-near-miss id refused", !satisfies("see D-sw-factory-110"));
  t("recall: ok-id with no number refused", !satisfies("see D-sw-factory"));
  t("recall: ok-the bare word refused", !satisfies("recall"));
  t("recall: ok-none inside a sentence refused", !satisfies("there were none to recall"));

  // --- state derivation (step 7 verify)
  const rows = (kinds) => kinds.map((k) => ({ kind: k, title: "", body: "cites D-x-1" }));
  const dids = new Set(["D-x-1"]);
  const noBrief = deriveRungs({ outputs: rows(["audit"]), decisions: [], decisionIds: dids, brief: null });
  t("state: rows but no decisions -> deciding", stateFromRungs(noBrief) === "deciding", stateFromRungs(noBrief));
  const specing = deriveRungs({
    outputs: rows(["audit"]),
    decisions: [{ id: "D-x-1", status: "active" }],
    decisionIds: dids,
    brief: null,
  });
  t("state: decided but no brief -> specifying", stateFromRungs(specing) === "specifying", stateFromRungs(specing));
  const built = deriveRungs({
    outputs: rows(["audit"]),
    decisions: [{ id: "D-x-1", status: "active" }],
    decisionIds: dids,
    brief: { slug: "x", hasDesign: true, briefPath: "docs/plans/x.md", steps: [{ done: true }, { done: false }] },
  });
  t("state: rows + brief -> building", stateFromRungs(built) === "building", stateFromRungs(built));
  const allDone = deriveRungs({
    outputs: rows(["audit"]),
    decisions: [{ id: "D-x-1", status: "active" }],
    decisionIds: dids,
    brief: { slug: "x", hasDesign: true, briefPath: "docs/plans/x.md", steps: [{ done: true }] },
  });
  t("state: everything ticked -> verifying", stateFromRungs(allDone) === "verifying", stateFromRungs(allDone));
  t("state: superseded decisions do not count", stateFromRungs(deriveRungs({
    outputs: rows(["audit"]),
    decisions: [{ id: "D-x-1", status: "superseded" }],
    decisionIds: dids,
    brief: null,
  })) === "deciding");
  // step 14: recall is state 1 - every LATER rung satisfied must NOT let it advance
  const recallHeld = deriveRungs({
    outputs: [{ kind: "audit", title: "", body: "no decision ids at all" }],
    decisions: [{ id: "D-x-1", status: "active" }],
    decisionIds: dids,
    brief: { slug: "x", hasDesign: true, briefPath: "docs/plans/x.md", steps: [{ done: true }] },
  });
  t("state: recall holds even when all later rungs pass",
    stateFromRungs(recallHeld) === "recall", stateFromRungs(recallHeld));
  t("state: ok-satisfied recall does advance",
    stateFromRungs(deriveRungs({
      outputs: [{ kind: "audit", title: "", body: "cites D-x-1" }],
      decisions: [{ id: "D-x-1", status: "active" }],
      decisionIds: dids,
      brief: { slug: "x", hasDesign: true, briefPath: "docs/plans/x.md", steps: [{ done: true }] },
    })) === "verifying");
  t("state: owner gate is on deciding->specifying only",
    noBrief.filter((r) => r.ownerGate).length === 1 && noBrief.find((r) => r.ownerGate).state === "deciding");

  // --- untracked: pre-FSM features (D-18/D-19). The machine must claim NOTHING.
  const cfg = loadFactoryConfig();
  t("untracked: list loads", cfg.untracked.size > 0, `${cfg.untracked.size}`);
  t("untracked: list names no missing brief", staleUntracked(briefs, cfg).length === 0, staleUntracked(briefs, cfg).join(","));
  t("untracked: reason is honest, not a pass", !/\b(ok|done|passed|satisfied)\b/i.test(cfg.reason), cfg.reason);
  // controls: work that must stay measured
  for (const live of ["sw-factory", "git-inside-content"])
    t(`untracked: ok-${live} is NOT untracked`, !cfg.untracked.has(live));
  t("untracked: a brand-new feature is not untracked", !cfg.untracked.has("some-feature-invented-today"));
  // the machine declines to judge rather than judging early
  const utd = { untracked: true, untrackedReason: cfg.reason, slug: "old", state: "untracked", rungs: [], paths: [], attr: { unclaimed: [], conflicts: [] }, cls: { fastPath: false } };
  t("untracked: rail says nothing", renderRail(utd).length === 0);
  t("untracked: gate says nothing", renderGate(utd, ["x"]).length === 0);
  t("untracked: no misstep is raised", missteps(utd).length === 0);
  const utl = renderLadder(utd);
  t("untracked: ladder is 3 lines", utl.length === 3, `${utl.length}`);
  t("untracked: ladder ticks no rung", !utl.some((l) => l.includes("[x]")), utl.join("|"));
  t("untracked: ladder gives no next step", !utl.some((l) => l.startsWith("  next:")));
  t("untracked: ladder says how to opt back in", utl.some((l) => l.includes("factory-config.json")));
  t("untracked: ladder fits 80 cols", Math.max(...utl.map((l) => l.length)) <= COLS, `${Math.max(...utl.map((l) => l.length))}`);
  // deriveRungs itself stays pure - no waiver knob to accidentally set
  const bare = { outputs: [{ kind: "audit", body: "no ids" }], decisions: [{ id: "D-x-1", status: "active" }], decisionIds: dids,
    brief: { slug: "x", hasDesign: true, briefPath: "p", steps: [{ done: true }, { done: false }] } };
  t("untracked: deriveRungs never waives a rung", stateFromRungs(deriveRungs(bare)) === "recall");
  t("untracked: `untracked` is not one of the six states", !STATES.includes("untracked"));

  // --- agent hooks (D-16, D-20). Warn-only: nothing may ever be denied.
  t("hook: PreToolUse is NOT wired - only it can deny", !HOOK_EVENTS.has("PreToolUse"));
  t("hook: unknown event says nothing", Object.keys(await runHook("Whatever", {})).length === 0);
  t("hook: honours stop_hook_active", Object.keys(await runHook("Stop", { stop_hook_active: true })).length === 0);
  // a fresh id per run: the lane file lives in tmp and would otherwise carry
  // the previous run's lane into this one
  t("hook: a read-only tool costs nothing", Object.keys(await runHook("PostToolUse", { tool_name: "view" })).length === 0);
  t("hook: `bash` is never skipped - it writes", !READ_ONLY_TOOLS.has("bash"));
  for (const w of ["edit", "create", "str_replace", "editFiles", "createFile"])
    t(`hook: ok-${w} is not skipped`, !READ_ONLY_TOOLS.has(w));
  const sid = `sel-${randomBytes(4).toString("hex")}`;
  const lanes = [laneFlipped(sid, "fast-path"), laneFlipped(sid, "fast-path"), laneFlipped(sid, "full ladder")];
  t("hook: first observation is not a flip", lanes[0] === false);
  t("hook: an unchanged lane is not a flip", lanes[1] === false);
  t("hook: a changed lane IS a flip", lanes[2] === true);
  t("hook: a flip is reported once, not repeatedly", laneFlipped(sid, "full ladder") === false);
  // D-20 tick reminder, on fixtures so the real tree cannot affect the result
  const ownCfg = { untracked: new Set(["old-thing"]) };
  const mkBrief = (slug, done) => ({ slug, briefPath: `docs/plans/${slug}.md`, declaredOwns: ["src/x.js"],
    owns: [`docs/plans/${slug}.md`, "src/x.js"], steps: [{ done: true }, { done }] });
  const touchedX = [{ path: "src/x.js" }];
  t("tick: warns when owned files changed and no step ticked",
    untickedWork(touchedX, [mkBrief("live", false)], ownCfg, () => 1).length === 1);
  t("tick: ok-silent once a step really was ticked",
    untickedWork(touchedX, [mkBrief("live", true)], ownCfg, () => 1).length === 0);
  t("tick: ok-silent when nothing owned was touched",
    untickedWork([{ path: "unrelated/y.js" }], [mkBrief("live", false)], ownCfg, () => 1).length === 0);
  t("tick: ok-silent for an untracked feature",
    untickedWork(touchedX, [mkBrief("old-thing", false)], ownCfg, () => 1).length === 0);
  t("tick: ok-silent for a brief with no declared ## Owns",
    untickedWork(touchedX, [{ ...mkBrief("live", false), declaredOwns: [] }], ownCfg, () => 1).length === 0);
  t("tick: editing only the brief is not owned work",
    untickedWork([{ path: "docs/plans/live.md" }], [mkBrief("live", false)], ownCfg, () => 1).length === 0);
  t("tick: a brief absent at HEAD counts every tick as new", ticksAtHead("docs/plans/does-not-exist.md") === 0);

  // --- audit history (D-17): the only way to see warn-only improving
  const health = await measureHealth({ commits: 10 });
  for (const k of ["commits", "fastpath", "unclaimed", "multi", "briefs", "owns", "untracked", "stalled"])
    t(`history: measures ${k}`, Number.isInteger(health[k]) && health[k] >= 0, `${health[k]}`);
  t("history: owns counts DECLARED sections, not defaults", health.owns < health.briefs, `${health.owns}/${health.briefs}`);
  t("history: untracked never exceeds briefs", health.untracked <= health.briefs);
  t("history: empty render tells you how to start", renderHealth([]).length === 1 && renderHealth([])[0].includes("--record"));
  const hrows = await readHealth(5);
  const hr = renderHealth(hrows);
  t("history: render fits 80 cols", Math.max(...hr.map((l) => l.length)) <= COLS, `${Math.max(...hr.map((l) => l.length))}`);
  t("history: reads back what it wrote", hrows.length === 0 || Number(hrows[0].briefs) === health.briefs, `${hrows[0]?.briefs}`);

  // --- sweep (step 15) reads real history and never blocks
  const swept = sweep(commitsFromLog(5), briefs);
  t("sweep: reads real commits", swept.total > 0, `${swept.total}`);
  t("sweep: every row classified", swept.rows.every((r) => r.lane === "fast" || r.lane === "full"));
  t("sweep: ok-deletions do not attribute", commitsFromLog(40).every((c) => c.paths.every((p) => p.path)));
  const synth = sweep([{ sha: "0000000", subject: "s", paths: [P("docs/plans/sw-factory.md")] }], briefs);
  t("sweep: attributes a known path", synth.rows[0].features.includes("sw-factory"));
  t("sweep: ok-a claimed commit is not counted unclaimed", synth.fullyUnclaimed === 0);
  t("sweep: reports Owns adoption", synth.briefs > 0 && synth.briefsDeclaringOwns >= 1, `${synth.briefsDeclaringOwns}/${synth.briefs}`);

  // --- widths, measured (the ladder's 83-column wrap was found exactly this way)
  const s = await computeState({});
  const rail = renderRail(s);
  const ladder = renderLadder(s);
  const gate = renderGate(s, missteps(s));
  const widest = (ls) => Math.max(0, ...ls.map((l) => l.length));
  t("rail: 3 lines", rail.length === 3, `${rail.length}`);
  t("rail: <=80 cols", widest(rail) <= 80, `${widest(rail)}`);
  // the rail is the ONLY thing a fresh session sees, so it must be self-sufficient:
  // name the state, what to do next, and which agent runs it (D-22).
  t("rail: names the agent for the state", rail[2].includes(`\`${s.state}\` agent`), rail[2]);
  t("rail: points at the ladder", rail[2].includes("factory ladder"), rail[2]);
  // ok- control: the agent named must be a real state, never an invented one
  t("ok-rail: agent name is one of the 6 states",
    STATES.some((st) => rail[2].includes(`\`${st}\` agent`)), rail[2]);
  // ok- control: the unclaimed-feature rail is self-sufficient too
  const unclaimedRail = renderRail({ ...s, slug: null });
  t("ok-rail: unclaimed rail also names an agent and fits",
    unclaimedRail.length === 3 && unclaimedRail[2].includes("`recall` agent") && widest(unclaimedRail) <= 80,
    `${unclaimedRail.length}/${widest(unclaimedRail)}`);
  t("gate: 6 lines", gate.length === 6, `${gate.length}`);
  t("gate: <=80 cols", widest(gate) <= 80, `${widest(gate)}`);
  t("ladder: 8 lines", ladder.length === 8, `${ladder.length}`);
  // no gate line may truncate mid-word: every rung's copy must fit its column
  for (const r of s.rungs) {
    t(`gate copy: ${r.state} missing fits`, `  missing   ${r.missing}`.length <= 66, `${r.missing.length}`);
    t(`gate copy: ${r.state} fix fits`, `  fix       ${r.fix}`.length <= 66, `${r.fix.length}`);
  }
  t("gate: no line truncated", !gate.some((l) => l.endsWith("...")), gate.find((l) => l.endsWith("...")) ?? "");
  t("ladder: <=80 cols (mockup measured 83)", widest(ladder) <= 80, `${widest(ladder)}`);

  console.log(`factory selftest: ${fails.length ? "FAIL" : "PASS"}`);
  console.log(`  rail ${rail.length} lines / ${widest(rail)} cols   gate ${gate.length}/${widest(gate)}   ladder ${ladder.length}/${widest(ladder)}`);
  for (const f2 of fails) console.log(`  FAIL ${f2}`);
  if (fails.length) process.exitCode = 1;
}

// ---- main -------------------------------------------------------------------
const CMDS = new Set(["state", "classify", "attribute", "rail", "gate", "ladder", "sweep", "history", "hook", "selftest"]);

async function main(argv) {
  const cmd = argv[0];
  const o = parseArgs(argv.slice(1));
  if (!cmd || !CMDS.has(cmd)) {
    console.log("factory - the way-of-working FSM (warn-only)");
    console.log("  state | classify | attribute | rail | gate | ladder");
    console.log("  sweep [--record] | history | hook <Event> | selftest");
    console.log("see docs/architecture/sw-factory.md");
    process.exitCode = cmd ? 2 : 0;
    return;
  }
  if (cmd === "selftest") return selftest();

  if (cmd === "hook") {
    // Fail-safe: never let this file disturb a session. Any throw prints `{}`.
    let res = {};
    try {
      res = await runHook(o.event ?? argv[1] ?? "", await readStdin());
    } catch {
      res = {};
    }
    process.stdout.write(JSON.stringify(res));
    return;
  }
  if (cmd === "history") {
    return renderHealth(await readHealth(Number(o.limit ?? 20))).forEach((l) => console.log(l));
  }
  if (cmd === "sweep") {
    const briefs = await loadBriefs();
    const n = Number(o.commits ?? 40);
    const r = sweep(commitsFromLog(n), briefs);
    if (o.json) return console.log(JSON.stringify(r, null, 2));
    if (o.verbose)
      for (const row of r.rows)
        console.log(`  ${row.sha} ${row.lane} ${String(row.files).padStart(3)}f  ${(row.features.join("+") || "(unclaimed)").padEnd(22)} ${row.subject.slice(0, 30)}`);
    console.log(`factory sweep: ${r.total} commit(s), warn-only, nothing blocked`);
    console.log(`  fast-path         ${r.fastPath} (${r.fastPathPct}%)`);
    console.log(`  no brief claims   ${r.fullyUnclaimed} commit(s) wholly, ${r.anyUnclaimed} partly`);
    console.log(`  two briefs claim  ${r.withConflicts} commit(s)`);
    console.log(`  spans >1 feature  ${r.multiFeature} commit(s)`);
    // Attribution is judged by TODAY's claims, so a replay is anachronistic: a
    // path claimed now attributes past commits that predate the feature. Say so
    // here rather than letting the unclaimed count read as pure drift.
    console.log(`  note: ${r.briefsDeclaringOwns} of ${r.briefs} briefs declare \`## Owns\`; claims apply retroactively`);
    if (o.record) {
      const file = await recordHealth(await measureHealth({ commits: n }), "manual");
      console.log(`  recorded  ${relative(ROOT, file)}`);
    }
    return;
  }

  if (cmd === "classify" || cmd === "attribute") {
    const paths = resolvePaths(o);
    if (cmd === "classify") {
      const c = classify(paths);
      if (o.json) return console.log(JSON.stringify(c, null, 2));
      console.log(`factory: ${c.fastPath ? "fast-path" : "full ladder"} (${c.files} file(s))`);
      for (const r of c.reasons) console.log(`  - ${r}`);
      return;
    }
    const briefs = await loadBriefs();
    const a = attribute(paths, briefs);
    if (o.json) return console.log(JSON.stringify(a, null, 2));
    for (const r of a.rows) console.log(`  ${r.features.join(" + ") || "(unclaimed)"}\t${r.path}`);
    if (a.conflicts.length) for (const c of a.conflicts) console.log(`  warn: ${c.path} claimed by ${c.features.join(" + ")}`);
    return;
  }

  const s = await computeState(o);
  if (cmd === "state") {
    if (o.json)
      return console.log(
        JSON.stringify(
          s.untracked
            ? { feature: s.slug, state: "untracked", reason: s.untrackedReason, tracked: false }
            : { feature: s.slug, state: s.state, ownerGate: OWNER_GATE, fastPath: s.cls.fastPath, rungs: s.rungs.map((r) => ({ state: r.state, ok: r.ok, evidence: r.evidence })), unclaimed: s.attr.unclaimed, conflicts: s.attr.conflicts },
          null,
          2
        )
      );
    return console.log(s.state);
  }
  if (cmd === "rail") return renderRail(s).forEach((l) => console.log(l));
  if (cmd === "ladder") return renderLadder(s).forEach((l) => console.log(l));
  if (cmd === "gate") {
    const problems = missteps(s);
    if (!problems.length) return console.log("factory: no misstep.");
    return renderGate(s, problems).forEach((l) => console.log(l));
  }
}

const invokedDirectly = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (invokedDirectly) await main(process.argv.slice(2));
