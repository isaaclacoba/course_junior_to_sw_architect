# Decision log / activity archive - design of record

Status: design ACCEPTED + CLI built, tested, and seeded with real data
(2026-08-03). Remaining: git-lfs for `activity/`, pre-push ETL wiring.
Brief: [docs/plans/decision-log.md](../plans/decision-log.md)

## Context & trigger
The new way-of-working makes a design round mandatory for every new line of work.
Those rounds - plus audits, PoC results, subagent outputs, and the "why" behind a
choice - are today lost in per-session transcripts nobody re-reads. We need a
searchable, in-repo archive so any agent or the owner can reconstruct *what was
decided and why*, across sessions, for postmortem.

Downstream: the WoW-enforcement hook
([docs/architecture/wow-enforcement.md](wow-enforcement.md)) uses this journal's
`feature` + `decision` rows as the machine-checkable proof that a design round
happened - which is why the owner sequenced the journal first.

Grounding (PoC on the real 20.2 MB session transcript, DuckDB 1.5.5): parquet is
git-trackable, a full-scan query runs in ~32 ms, and a supersession chain is
queryable. Compression is a fidelity choice - 6x if raw agent reasoning is kept,
~500x if only structured columns are. 57% of the firehose is `assistant.message`
(chain-of-thought), 28% is tool-call args.

## Grounding - what is persisted (verified 2026-08-03)
The transcript JSONL stores user + assistant messages and tool *invocations*
(`arguments`: search queries, terminal commands, the full subagent prompt) - but
NOT tool *outputs*: `tool.execution_complete` is `{toolCallId, success}` only.
Search hits, terminal output, and subagent reports are ephemeral - never written
to disk. Subagents are not separate sessions (181 `runSubagent` calls -> 0 extra
transcripts). The session-store already holds turns (FTS-searchable), files, refs,
and checkpoints. Consequence: outputs can only be kept by capturing them LIVE,
while an agent still holds them in context.

## Three capture paths
- **A - ambient firehose (ETL).** Transcript + session-store -> parquet, mirrored
  self-contained. Automatic + retroactive. Messages, tool args, subagent prompts,
  metadata. No outputs (they are not on disk).
- **A-live - outputs.** `journal record`, called live by the orchestrator on each
  subagent return and at each audit / PoC result, persists the ephemeral outputs
  the ETL cannot recover.
- **B - curated entities.** Features -> decisions, with supersession. Small (KB),
  authored via the CLI.

## Decided (owner, 2026-08-03 - all ratified)
1. **Format** - parquet, queried with DuckDB via `@duckdb/node-api` (pure Node).
2. **Location** - parquet under `docs/journal/`; designs in `docs/architecture/`,
   briefs in `docs/plans/`, linked by path.
3. **Capture** - hybrid: ETL firehose (A) mirrored self-contained + live `record`
   (A-live) + curated B. Retention keeps raw user + tool-args; assistant
   chain-of-thought is kept as a 240-char preview only (raw dropped, per the
   compression grounding); no outputs exist to drop.
4. **Feature lifecycle** - `draft -> in-design -> building -> shipped` (+ `dropped`).
5. **DoD** - key facets as typed columns + full DoD in the linked brief/design md.
6. **CLI** - `tools/journal.mjs`: `etl`, `record`, `decision`, `feature`,
   `search`, `show`. On demand + pre-push; live `record` on subagent-return.
7. **Git storage** - `features/`, `decisions/`, `outputs/` committed plainly
   (small, non-regenerable); only the bulky, regenerable `activity/` firehose
   waits for git-lfs (not yet installed) and is gitignored meanwhile.
8. **Decision ids** - readable `D-<slug>-<n>`.
9. **session-store** - joined as an enrichment source now (files, refs, summaries).

## Schemas
Path A `docs/journal/activity/*.parquet` (append-only set, git-lfs):
`session_id, ts, agent, kind, tool_name, bytes, preview(<=240), body(raw|null)`.
Enriched from session-store per session (`repository, branch, summary, agent_name`);
`session_files` / `session_refs` folded in as `kind='file'|'ref'` rows.

Path A-live `docs/journal/outputs/*.parquet` (append, git-lfs):
`session_id, ts, agent, feature, kind(subagent|audit|poc|search|note), title,
body(raw)`.

Layer B `docs/journal/features.parquet` (append; latest row per `slug`):
`slug, title, status, goal, dod_short, dod_ux, dod_ui, dod_kpi, dod_tests,
brief_path, design_path, created_ts, updated_ts`.

Layer B `docs/journal/decisions.parquet` (append; latest row per `id`):
`id(D-<slug>-<n>), feature, ts, session_id, agent, question, options(json),
chosen, why, supersedes(id|null), status(active|superseded)`.

Supersession: a new decision with `supersedes:<old-id>` is appended and the old id
re-appended with `status=superseded`. Nothing is overwritten; "active" = latest row
per id where `status=active`. Same append-latest-wins for features.

## ETL & live capture
ETL is incremental: `docs/journal/_watermark.json` records the last-ingested line
offset per `session_id`; `etl` reads only transcripts past their watermark, so a
re-run adds no duplicate rows. It joins session-store (sessions/files/refs) by
`session_id`. Live `record` appends one row to `outputs/` immediately - each call
is a distinct event, no watermark needed.

## Success signal / KPI
- A postmortem question ("why parquet?", "what did the audit find?") is answered by
  one `journal show <feature>` or `journal search <text>` in under a second, with no
  transcript spelunking.
- A feature's full decision chain is reconstructable from `decisions.parquet` alone.
- Archive footprint stays a small fraction of raw transcript volume (hybrid #3).

## Unit tests (Node, no DOM)
- Layer B: append + supersession (active-only query excludes superseded);
  latest-per-slug feature resolution.
- Layer A: `etl` idempotent via watermark (re-run adds zero rows); retention policy
  keeps/drops the right kinds.
- CLI: arg parsing; `search` filters (`--session/--feature/--agent/--kind`).

## Deferred detail (decide at build time)
- Exact git-lfs track globs for `docs/journal/{activity,outputs}/`.
- `search` surface: fixed filters (`--text/--session/--feature/--agent/--kind`)
  over DuckDB `LIKE`, plus optional session-store FTS passthrough.
