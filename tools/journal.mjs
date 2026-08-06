#!/usr/bin/env node
// tools/journal.mjs - decision log / activity archive (see docs/architecture/decision-log.md)
//
// Parquet + DuckDB archive of agent activity and design decisions, so any agent or
// the owner can reconstruct what was decided and why, across sessions.
//
// Datasets (append-only, multi-file; latest-row-wins for entities):
//   docs/journal/activity/*.parquet   ambient firehose (ETL of transcript + session-store)
//   docs/journal/outputs/*.parquet    live-captured tool outputs (subagent/audit/poc)
//   docs/journal/features/*.parquet   Feature entities (latest per slug)
//   docs/journal/decisions/*.parquet  Decision entities (latest per id), with supersession
//   docs/journal/_watermark.json      per-session last-ingested line offset (ETL idempotency)
//
// Commands (node tools/journal.mjs <cmd> ...):
//   etl       [--transcripts DIR] [--session-store DB] [--session ID]
//   record    --kind subagent|audit|poc|search|note --feature SLUG [--title T] (--body TXT | --body-file F) [--session ID] [--agent A]
//   decision  --feature SLUG --question Q --options "a|b|c" --chosen C --why W [--supersedes ID] [--session ID] [--agent A]
//   feature   --slug S [--title T] [--status draft|in-design|building|shipped|dropped] [--goal G] [--dod-short..--dod-tests X] [--brief P] [--design P]
//   search    TEXT [--kind K] [--feature S] [--session ID] [--agent A] [--limit N]
//   show      SLUG
//
// Exit non-zero on any error (doubles as a CI/hook gate). No output goes through SQL
// string concatenation: reads use bound parameters, writes flow through a temp JSON
// file read by DuckDB read_json - arbitrary text (body/why/search) is never injected.

import { DuckDBInstance } from "@duckdb/node-api";
import { readFile, writeFile, readdir, mkdir, rm } from "node:fs/promises";
import { existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir, homedir } from "node:os";
import { randomBytes } from "node:crypto";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const JOURNAL = process.env.JOURNAL_DIR || join(ROOT, "docs", "journal");
const ETL_BATCH_ROWS = 20000;
const DIRS = {
  activity: join(JOURNAL, "activity"),
  outputs: join(JOURNAL, "outputs"),
  features: join(JOURNAL, "features"),
  decisions: join(JOURNAL, "decisions"),
};
const WATERMARK = join(JOURNAL, "_watermark.json");
const CONFIG = join(JOURNAL, "config.json");

const nowIso = () => new Date().toISOString().replace("Z", "").replace("T", " ");
const rid = () => randomBytes(4).toString("hex");
const sqlLit = (p) => p.replace(/'/g, "''"); // escape a path we control for a SQL literal
const preview = (s, n = 240) => (s == null ? null : String(s).replace(/\s+/g, " ").slice(0, n));

// ---- DuckDB helpers ---------------------------------------------------------
async function openDb() {
  const instance = await DuckDBInstance.create(":memory:");
  return instance.connect();
}
async function q(con, sql, values = []) {
  const reader = await con.runAndReadAll(sql, values);
  return reader.getRowObjects();
}
function parquetFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".parquet"))
    .map((f) => join(dir, f));
}
// Read a dataset with an optional WHERE; returns [] when the dataset has no files.
async function readDataset(con, dir, { where = "", params = [], select = "*", order = "", limit = 0 } = {}) {
  const files = parquetFiles(dir);
  if (files.length === 0) return [];
  const list = files.map((f) => `'${sqlLit(f)}'`).join(", ");
  let sql = `SELECT ${select} FROM read_parquet([${list}], union_by_name=true)`;
  if (where) sql += ` WHERE ${where}`;
  if (order) sql += ` ORDER BY ${order}`;
  if (limit) sql += ` LIMIT ${Number(limit)}`;
  return q(con, sql, params);
}
// Append rows (array of plain objects) to a dataset dir, typed by castSelect.
async function appendRows(con, dir, rows, castSelect) {
  if (rows.length === 0) return 0;
  await mkdir(dir, { recursive: true });
  const tmp = join(tmpdir(), `journal-${Date.now()}-${rid()}.jsonl`);
  await writeFile(tmp, rows.map((r) => JSON.stringify(r)).join("\n"));
  const out = join(dir, `${Date.now()}-${rid()}.parquet`);
  try {
    await con.run(
      `COPY (SELECT ${castSelect} FROM read_json('${sqlLit(tmp)}', ` +
        `format='newline_delimited', union_by_name=true, maximum_object_size=67108864)) ` +
        `TO '${sqlLit(out)}' (FORMAT PARQUET, COMPRESSION ZSTD)`
    );
  } finally {
    await rm(tmp, { force: true });
  }
  return rows.length;
}

// Typed projections per dataset (order-independent; missing keys -> NULL).
// TRY_CAST on timestamps so one malformed/missing ts yields NULL, not a failed batch.
const CAST = {
  activity:
    "CAST(session_id AS VARCHAR) session_id, TRY_CAST(ts AS TIMESTAMP) ts, CAST(agent AS VARCHAR) agent, " +
    "CAST(kind AS VARCHAR) kind, CAST(tool_name AS VARCHAR) tool_name, CAST(bytes AS INTEGER) bytes, " +
    "CAST(preview AS VARCHAR) preview, CAST(body AS VARCHAR) body",
  outputs:
    "CAST(session_id AS VARCHAR) session_id, TRY_CAST(ts AS TIMESTAMP) ts, CAST(agent AS VARCHAR) agent, " +
    "CAST(feature AS VARCHAR) feature, CAST(kind AS VARCHAR) kind, CAST(title AS VARCHAR) title, CAST(body AS VARCHAR) body",
  features:
    "CAST(slug AS VARCHAR) slug, CAST(title AS VARCHAR) title, CAST(status AS VARCHAR) status, CAST(goal AS VARCHAR) goal, " +
    "CAST(dod_short AS VARCHAR) dod_short, CAST(dod_ux AS VARCHAR) dod_ux, CAST(dod_ui AS VARCHAR) dod_ui, " +
    "CAST(dod_kpi AS VARCHAR) dod_kpi, CAST(dod_tests AS VARCHAR) dod_tests, CAST(brief_path AS VARCHAR) brief_path, " +
    "CAST(design_path AS VARCHAR) design_path, TRY_CAST(created_ts AS TIMESTAMP) created_ts, TRY_CAST(updated_ts AS TIMESTAMP) updated_ts",
  decisions:
    "CAST(id AS VARCHAR) id, CAST(feature AS VARCHAR) feature, TRY_CAST(ts AS TIMESTAMP) ts, CAST(session_id AS VARCHAR) session_id, " +
    "CAST(agent AS VARCHAR) agent, CAST(question AS VARCHAR) question, CAST(\"options\" AS VARCHAR) AS \"options\", " +
    "CAST(chosen AS VARCHAR) chosen, CAST(why AS VARCHAR) why, CAST(supersedes AS VARCHAR) supersedes, CAST(status AS VARCHAR) status",
};

// Latest-row-wins views (as subqueries) for entity datasets.
function latestFeatures() {
  const files = parquetFiles(DIRS.features);
  if (!files.length) return null;
  const list = files.map((f) => `'${sqlLit(f)}'`).join(", ");
  return `(SELECT * EXCLUDE (rn) FROM (SELECT *, row_number() OVER (PARTITION BY slug ORDER BY updated_ts DESC) rn ` +
    `FROM read_parquet([${list}], union_by_name=true)) WHERE rn=1)`;
}
function latestDecisions() {
  const files = parquetFiles(DIRS.decisions);
  if (!files.length) return null;
  const list = files.map((f) => `'${sqlLit(f)}'`).join(", ");
  return `(SELECT * EXCLUDE (rn) FROM (SELECT *, row_number() OVER (PARTITION BY id ORDER BY ts DESC) rn ` +
    `FROM read_parquet([${list}], union_by_name=true)) WHERE rn=1)`;
}

// ---- config / source resolution --------------------------------------------
async function loadConfig() {
  try {
    return JSON.parse(await readFile(CONFIG, "utf8"));
  } catch {
    return {};
  }
}
async function resolveTranscripts(flag) {
  const cfg = await loadConfig();
  const candidates = [
    flag,
    process.env.JOURNAL_TRANSCRIPTS,
    cfg.transcriptsDir,
    join(homedir(), ".copilot", "session-state"),
  ].filter(Boolean);
  return candidates.find((p) => existsSync(p)) || null;
}

// Transcripts sit in two layouts side by side: an older flat `<id>.jsonl` and a
// newer `<id>/events.jsonl`. Reading one layout silently drops most sessions.
async function transcriptSources(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const bySession = new Map();
  for (const e of entries) {
    if (e.isFile() && e.name.endsWith(".jsonl")) bySession.set(e.name.replace(/\.jsonl$/, ""), join(dir, e.name));
  }
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    const nested = join(dir, e.name, "events.jsonl");
    if (existsSync(nested)) bySession.set(e.name, nested);
  }
  return [...bySession]
    .map(([sessionId, path]) => ({ sessionId, path }))
    .sort((a, b) => (a.sessionId < b.sessionId ? -1 : 1));
}
async function resolveSessionStore(flag) {
  const cfg = await loadConfig();
  const candidates = [
    flag,
    process.env.JOURNAL_SESSION_STORE,
    cfg.sessionStore,
    join(homedir(), ".copilot", "session-store.db"),
  ].filter(Boolean);
  return candidates.find((p) => existsSync(p)) || null;
}

// ---- commands ---------------------------------------------------------------
async function cmdFeature(con, o) {
  if (!o.slug) throw new Error("feature: --slug is required");
  const existing = (await readDataset(con, DIRS.features, { where: "slug = ?", params: [o.slug] }))
    .sort((a, b) => String(a.updated_ts).localeCompare(String(b.updated_ts)));
  const prev = existing[existing.length - 1] || {};
  const ts = nowIso();
  const row = {
    slug: o.slug,
    title: o.title ?? prev.title ?? o.slug,
    status: o.status ?? prev.status ?? "draft",
    goal: o.goal ?? prev.goal ?? null,
    dod_short: o["dod-short"] ?? prev.dod_short ?? null,
    dod_ux: o["dod-ux"] ?? prev.dod_ux ?? null,
    dod_ui: o["dod-ui"] ?? prev.dod_ui ?? null,
    dod_kpi: o["dod-kpi"] ?? prev.dod_kpi ?? null,
    dod_tests: o["dod-tests"] ?? prev.dod_tests ?? null,
    brief_path: o.brief ?? prev.brief_path ?? `docs/plans/${o.slug}.md`,
    design_path: o.design ?? prev.design_path ?? `docs/architecture/${o.slug}.md`,
    created_ts: prev.created_ts ? String(prev.created_ts) : ts,
    updated_ts: ts,
  };
  await appendRows(con, DIRS.features, [row], CAST.features);
  console.log(`feature ${o.slug} -> status=${row.status}`);
}

async function cmdDecision(con, o) {
  for (const k of ["feature", "question", "chosen", "why"])
    if (!o[k]) throw new Error(`decision: --${k} is required`);
  const ts = nowIso();
  const existingIds = new Set(
    (await readDataset(con, DIRS.decisions, { where: "feature = ?", params: [o.feature], select: "DISTINCT id" })).map(
      (r) => r.id
    )
  );
  const id = `D-${o.feature}-${existingIds.size + 1}`;
  const rows = [
    {
      id,
      feature: o.feature,
      ts,
      session_id: o.session ?? null,
      agent: o.agent ?? "orchestrator",
      question: o.question,
      options: JSON.stringify((o.options ?? "").split("|").map((s) => s.trim()).filter(Boolean)),
      chosen: o.chosen,
      why: o.why,
      supersedes: o.supersedes ?? null,
      status: "active",
    },
  ];
  if (o.supersedes) {
    const [prev] = await readDataset(con, DIRS.decisions, {
      where: "id = ?",
      params: [o.supersedes],
      order: "ts DESC",
      limit: 1,
    });
    if (!prev) throw new Error(`decision: --supersedes ${o.supersedes} not found`);
    rows.push({ ...prev, options: prev.options == null ? null : String(prev.options), ts: nowIso(), status: "superseded" });
  }
  await appendRows(con, DIRS.decisions, rows, CAST.decisions);
  console.log(`${id} recorded${o.supersedes ? ` (supersedes ${o.supersedes})` : ""}`);
}

async function cmdRecord(con, o) {
  if (!o.kind) throw new Error("record: --kind is required");
  let body = o.body ?? null;
  if (o["body-file"]) body = await readFile(o["body-file"], "utf8");
  if (body == null) throw new Error("record: provide --body or --body-file");
  const row = {
    session_id: o.session ?? null,
    ts: nowIso(),
    agent: o.agent ?? "orchestrator",
    feature: o.feature ?? null,
    kind: o.kind,
    title: o.title ?? null,
    body,
  };
  await appendRows(con, DIRS.outputs, [row], CAST.outputs);
  console.log(`recorded ${o.kind}${o.feature ? ` for ${o.feature}` : ""} (${body.length} bytes)`);
}

async function cmdShow(con, o, positional) {
  const slug = o.slug ?? positional[0];
  if (!slug) throw new Error("show: pass a feature slug");
  const fv = latestFeatures();
  const feat = fv ? (await q(con, `SELECT * FROM ${fv} WHERE slug = ?`, [slug]))[0] : null;
  console.log(`# ${slug}`);
  if (feat) {
    console.log(`status: ${feat.status}   goal: ${feat.goal ?? "-"}`);
    console.log(`brief: ${feat.brief_path}   design: ${feat.design_path}\n`);
  } else console.log("(no feature row)\n");
  const dv = latestDecisions();
  const decs = dv ? await q(con, `SELECT * FROM ${dv} WHERE feature = ? ORDER BY id`, [slug]) : [];
  console.log(`## decisions (${decs.length})`);
  for (const d of decs)
    console.log(
      `  ${d.id} [${d.status}]${d.supersedes ? ` <-${d.supersedes}` : ""}  ${d.question}\n      -> ${d.chosen}  (${preview(d.why, 120)})`
    );
  const outs = await readDataset(con, DIRS.outputs, {
    where: "feature = ?",
    params: [slug],
    select: "ts, kind, title, length(body) AS len",
    order: "ts",
  });
  console.log(`\n## outputs (${outs.length})`);
  for (const r of outs) console.log(`  ${r.ts}  ${r.kind}  ${r.title ?? ""} (${r.len} bytes)`);
}

// Build optional equality filters for search, restricted to columns the dataset has.
function searchFilters(o, cols) {
  const w = [];
  const p = [];
  if (cols.has("kind") && o.kind) (w.push("kind = ?"), p.push(o.kind));
  if (cols.has("session_id") && o.session) (w.push("session_id = ?"), p.push(o.session));
  if (cols.has("agent") && o.agent) (w.push("agent = ?"), p.push(o.agent));
  if (cols.has("feature") && o.feature) (w.push("feature = ?"), p.push(o.feature));
  return { clause: w.length ? ` AND ${w.join(" AND ")}` : "", params: p };
}

async function cmdSearch(con, o, positional) {
  const text = o.text ?? positional[0];
  if (!text) throw new Error("search: pass search text");
  const like = `%${text}%`;
  const lim = Number.isFinite(Number(o.limit)) ? Number(o.limit) : 20;

  const af = searchFilters(o, new Set(["kind", "session_id", "agent"]));
  const act = await readDataset(con, DIRS.activity, {
    where: `(preview ILIKE ? OR body ILIKE ?)${af.clause}`,
    params: [like, like, ...af.params],
    select: "session_id, ts, agent, kind, coalesce(body, preview) AS text",
    order: "ts DESC",
    limit: lim,
  });
  const of = searchFilters(o, new Set(["kind", "session_id", "agent", "feature"]));
  const out = await readDataset(con, DIRS.outputs, {
    where: `(title ILIKE ? OR body ILIKE ?)${of.clause}`,
    params: [like, like, ...of.params],
    select: "session_id, ts, agent, kind, feature, title",
    order: "ts DESC",
    limit: lim,
  });
  const dv = latestDecisions();
  let dec = [];
  if (dv) {
    const df = searchFilters(o, new Set(["session_id", "agent", "feature"]));
    dec = await q(
      con,
      `SELECT id, feature, ts, question, chosen FROM ${dv} WHERE (question ILIKE ? OR why ILIKE ? OR chosen ILIKE ?)${df.clause} ORDER BY ts DESC LIMIT ${lim}`,
      [like, like, like, ...df.params]
    );
  }
  console.log(`# search "${text}"  (activity ${act.length}, outputs ${out.length}, decisions ${dec.length})`);
  for (const r of dec) console.log(`  [decision] ${r.id} ${r.feature}: ${r.question} -> ${r.chosen}`);
  for (const r of out) console.log(`  [output] ${r.ts} ${r.kind} ${r.feature ?? ""} ${r.title ?? ""}`);
  for (const r of act) console.log(`  [activity] ${r.ts} ${r.agent}/${r.kind}: ${preview(r.text, 100)}`);
}

// ---- ETL --------------------------------------------------------------------
function activityRowsFromLine(line, sessionId, agent) {
  let o;
  try {
    o = JSON.parse(line);
  } catch {
    return [];
  }
  const t = o.type;
  const d = o.data || {};
  const ts = o.timestamp ? o.timestamp.replace("T", " ").replace("Z", "") : null;
  const base = { session_id: sessionId, ts, agent, tool_name: null, bytes: line.length };
  if (t === "user.message") return [{ ...base, kind: "user", preview: preview(d.content), body: d.content ?? null }];
  if (t === "assistant.message")
    return [{ ...base, kind: "assistant", preview: preview(d.content), body: null }]; // raw reasoning dropped (retention)
  if (t === "tool.execution_start") {
    const args = JSON.stringify(d.arguments ?? {});
    return [{ ...base, kind: "tool_start", tool_name: d.toolName ?? null, preview: preview(args), body: args }];
  }
  if (t === "tool.execution_complete")
    return [{ ...base, kind: "tool_complete", preview: `success=${d.success}`, body: null }];
  if (t === "assistant.turn_start") return [{ ...base, kind: "turn_start", preview: `turn ${d.turnId}`, body: null }];
  if (t === "assistant.turn_end") return [{ ...base, kind: "turn_end", preview: `turn ${d.turnId}`, body: null }];
  if (t === "session.start") return [{ ...base, kind: "session_start", preview: preview(JSON.stringify(d)), body: null }];
  return [];
}

async function enrichFromStore(storePath, sessionId, agent) {
  // Fold session-store files/refs/summary into activity as extra rows. Best-effort.
  const con = await openDb();
  const rows = [];
  try {
    const p = sqlLit(storePath);
    await con.run(`INSTALL sqlite; LOAD sqlite;`);
    const meta = await q(con, `SELECT repository, branch, summary, agent_name FROM sqlite_scan('${p}','sessions') WHERE id = ?`, [sessionId]);
    const m = meta[0];
    if (m) rows.push({ session_id: sessionId, ts: nowIso(), agent: m.agent_name || agent, kind: "session", tool_name: null, bytes: 0, preview: preview(`${m.repository} ${m.branch}`), body: m.summary ?? null });
    const files = await q(con, `SELECT file_path, tool_name, first_seen_at FROM sqlite_scan('${p}','session_files') WHERE session_id = ?`, [sessionId]);
    for (const f of files) rows.push({ session_id: sessionId, ts: f.first_seen_at ? f.first_seen_at.replace("T", " ").replace("Z", "") : null, agent, kind: "file", tool_name: f.tool_name ?? null, bytes: 0, preview: f.file_path, body: f.file_path });
    const refs = await q(con, `SELECT ref_type, ref_value, created_at FROM sqlite_scan('${p}','session_refs') WHERE session_id = ?`, [sessionId]);
    for (const r of refs) rows.push({ session_id: sessionId, ts: r.created_at ? r.created_at.replace("T", " ").replace("Z", "") : null, agent, kind: "ref", tool_name: null, bytes: 0, preview: `${r.ref_type}:${r.ref_value}`, body: `${r.ref_type}:${r.ref_value}` });
  } catch (e) {
    console.warn(`  (session-store enrichment skipped: ${e.message})`);
  }
  return rows;
}

async function cmdEtl(con, o) {
  const tdir = await resolveTranscripts(o.transcripts);
  if (!tdir) throw new Error("etl: transcripts dir not found - pass --transcripts DIR, set JOURNAL_TRANSCRIPTS, or add transcriptsDir to docs/journal/config.json");
  const store = o["no-store"] || process.env.JOURNAL_NO_STORE ? null : await resolveSessionStore(o["session-store"]);
  if (store) console.log(`  (enriching from session-store: ${store})`);
  const wm = existsSync(WATERMARK) ? JSON.parse(await readFile(WATERMARK, "utf8")) : {};
  let sources = await transcriptSources(tdir);
  if (o.session) sources = sources.filter((s) => s.sessionId.startsWith(o.session));
  await mkdir(JOURNAL, { recursive: true });
  let total = 0;
  let batch = [];
  // One parquet file per session would leave hundreds of tiny files, so rows are
  // batched; the watermark is saved with each flush, so a crash cannot duplicate.
  const flush = async () => {
    if (!batch.length) return;
    total += await appendRows(con, DIRS.activity, batch, CAST.activity);
    batch = [];
    await writeFile(WATERMARK, JSON.stringify(wm, null, 2));
  };
  for (const { sessionId, path } of sources) {
    const text = await readFile(path, "utf8");
    const lines = text.split("\n").filter((l) => l.trim());
    const from = wm[sessionId] || 0;
    if (lines.length <= from) continue;
    // agent name: prefer session-store, else 'agent'
    let agent = "agent";
    const fresh = from === 0;
    const rows = [];
    for (let i = from; i < lines.length; i++) rows.push(...activityRowsFromLine(lines[i], sessionId, agent));
    if (fresh && store) rows.push(...(await enrichFromStore(store, sessionId, agent)));
    batch.push(...rows);
    wm[sessionId] = lines.length;
    console.log(`  ${sessionId}: +${rows.length} rows (lines ${from}..${lines.length})`);
    if (batch.length >= ETL_BATCH_ROWS) await flush();
  }
  await flush();
  await writeFile(WATERMARK, JSON.stringify(wm, null, 2));
  console.log(`etl done: +${total} activity rows from ${sources.length} transcript(s)`);
}

// ---- dispatch ---------------------------------------------------------------
const HELP = `journal - decision log / activity archive
  etl | record | decision | feature | search | show
see the header of tools/journal.mjs or docs/architecture/decision-log.md`;

// Minimal CLI parser: --key value -> string; --flag (no value) -> true; else positional.
function parseCli(args) {
  const values = {};
  const positionals = [];
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = args[i + 1];
      if (next !== undefined && !next.startsWith("--")) {
        values[key] = next;
        i++;
      } else values[key] = true;
    } else positionals.push(a);
  }
  return { values, positionals };
}

async function main(argv) {
  const cmd = argv[2];
  if (!cmd || cmd === "--help" || cmd === "-h") {
    console.log(HELP);
    return 0;
  }
  const { values, positionals } = parseCli(argv.slice(3));
  const con = await openDb();
  switch (cmd) {
    case "etl": await cmdEtl(con, values); break;
    case "record": await cmdRecord(con, values); break;
    case "decision": await cmdDecision(con, values); break;
    case "feature": await cmdFeature(con, values); break;
    case "search": await cmdSearch(con, values, positionals); break;
    case "show": await cmdShow(con, values, positionals); break;
    default:
      console.error(`unknown command: ${cmd}\n${HELP}`);
      return 2;
  }
  return 0;
}

main(process.argv)
  .then((code) => process.exit(code))
  .catch((e) => {
    console.error(`journal: ${e.message}`);
    process.exit(1);
  });
