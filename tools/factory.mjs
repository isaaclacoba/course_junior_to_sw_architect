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
//   selftest                                              asserts the rules + widths

import { readFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
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
async function journalEvidence(slug) {
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
  const cited = new Set();
  let none = false;
  for (const r of outputs) {
    const text = `${r.title ?? ""}\n${r.body ?? ""}`;
    for (const m of text.matchAll(/\bD-[a-z0-9][a-z0-9-]*-\d+\b/gi)) if (decisionIds.has(m[0])) cited.add(m[0]);
    if (/^\s*recall:\s*none\s*$/im.test(text)) none = true;
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
  const rungs = deriveRungs({ ...ev, brief });
  const state = stateFromRungs(rungs);
  return { slug, brief, briefs, paths, attr, rungs, state, cls: classify(paths), ...ev };
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
  if (!s.slug) {
    return [
      clip("factory: no feature claimed - state `recall`"),
      clip("next: journal search the topic, then record what you found"),
    ];
  }
  const rung = s.rungs.find((r) => r.state === s.state);
  const lane = s.cls.fastPath ? "fast-path" : "full ladder";
  const at = STATES.indexOf(s.state) + 1;
  const l1 = `factory: ${s.slug} in \`${s.state}\` (rung ${at} of 6) - ${lane}`;
  const l2 = `next: ${rung ? rung.fix : "npm run gate"}`;
  return [clip(l1), clip("  " + l2)];
}

export function renderLadder(s) {
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

// A misstep is derived, never asserted. Warn-only: this returns text, not an exit code.
export function missteps(s) {
  const out = [];
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

  // --- recall evidence must RESOLVE, not merely be written
  const ids = new Set(["D-sw-factory-11"]);
  t("recall: resolving id counts", recallCitations([{ body: "cites D-sw-factory-11" }], ids).cited.length === 1);
  t("recall: ok-invented id does not count", recallCitations([{ body: "cites D-made-up-99" }], ids).cited.length === 0);
  t("recall: ok-prose alone does not count", recallCitations([{ body: "I recalled everything, honest" }], ids).cited.length === 0);
  t("recall: explicit none counts", recallCitations([{ body: "recall: none" }], ids).none);

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
  t("state: owner gate is on deciding->specifying only",
    noBrief.filter((r) => r.ownerGate).length === 1 && noBrief.find((r) => r.ownerGate).state === "deciding");

  // --- widths, measured (the ladder's 83-column wrap was found exactly this way)
  const s = await computeState({});
  const rail = renderRail(s);
  const ladder = renderLadder(s);
  const gate = renderGate(s, missteps(s));
  const widest = (ls) => Math.max(0, ...ls.map((l) => l.length));
  t("rail: 2 lines", rail.length === 2, `${rail.length}`);
  t("rail: <=80 cols", widest(rail) <= 80, `${widest(rail)}`);
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
const CMDS = new Set(["state", "classify", "attribute", "rail", "gate", "ladder", "selftest"]);

async function main(argv) {
  const cmd = argv[0];
  const o = parseArgs(argv.slice(1));
  if (!cmd || !CMDS.has(cmd)) {
    console.log("factory - the way-of-working FSM (warn-only)");
    console.log("  state | classify | attribute | rail | gate | ladder | selftest");
    console.log("see docs/architecture/sw-factory.md");
    process.exitCode = cmd ? 2 : 0;
    return;
  }
  if (cmd === "selftest") return selftest();

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
          { feature: s.slug, state: s.state, ownerGate: OWNER_GATE, fastPath: s.cls.fastPath, rungs: s.rungs.map((r) => ({ state: r.state, ok: r.ok, evidence: r.evidence })), unclaimed: s.attr.unclaimed, conflicts: s.attr.conflicts },
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
