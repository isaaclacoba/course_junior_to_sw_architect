# Decision log / activity archive
Status: CLI built + tested + seeded - remaining: git-lfs, pre-push wiring  -  Design: [docs/architecture/decision-log.md](../architecture/decision-log.md)

## Goal
A searchable, in-repo archive of agent activity and design decisions - so any agent
or the owner can reconstruct *what was decided and why*, across sessions, for
postmortem. It is also the evidence the WoW-enforcement hook checks.

## Approach
Parquet + DuckDB (`@duckdb/node-api`), three capture paths: an incremental ETL of
the transcript + session-store (ambient firehose, mirrored self-contained), a live
`record` the orchestrator calls on each subagent return / audit / PoC (to keep the
outputs that are otherwise ephemeral), and curated Feature -> Decision entities with
supersession. Layer B committed plainly; the bulky parquet via git-lfs.

## Plan
1. [~] `@duckdb/node-api` dep added (1.5.5-r.3); git-lfs track for `activity/` BLOCKED - git-lfs not installed - verify: `npm ls` ok; lfs pending.
2. [x] `tools/journal.mjs` skeleton + arg parsing for `etl|record|decision|feature|search|show` - verify: `--help` lists all six; bad args exit non-zero.
3. [x] Layer B: `feature` + `decision` writers with supersession (append, latest-wins) - verify: test - active-only excludes superseded; latest-per-slug.
4. [x] `etl`: transcript -> activity parquet, incremental via watermark, session-store join - verify: test - re-run adds zero rows; real run 27,584 rows.
5. [x] `record`: append one outputs row - verify: test - row lands with kind/feature/body.
6. [x] `search` + `show` - verify: `show <feature>` prints decision chain; real search 0.30s.
7. [x] Back-fill this session's decisions as the journal's first Layer B rows - verify: `show decision-log` / `show wow-enforcement`.
8. [ ] Wire `etl` into pre-push - verify: hook runs it, archive not stale after a push.

## Progress
- 2026-08-03 Design accepted after two ratification rounds + a grounding correction (tool outputs are ephemeral -> added the live `record` path).
- 2026-08-03 CLI built (`tools/journal.mjs`, 6 commands) + 4-test suite green; real ETL 27,584 rows/1.18s; seeded 9 real decisions + 2 outputs across two features.

## Open
- git-lfs track globs (step 1) and the exact `search` filter set (step 6) - decided at build time.
