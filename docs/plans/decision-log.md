# Decision log / activity archive
Status: DONE - CLI built + tested + seeded; storage finalized (firehose local)  -  Design: [docs/architecture/decision-log.md](../architecture/decision-log.md)

## Goal
A searchable, in-repo archive of agent activity and design decisions - so any agent
or the owner can reconstruct *what was decided and why*, across sessions, for
postmortem. (The WoW-enforcement hook was dropped after a red-team; the journal
stands on its own as the searchable archive.)

## Approach
Parquet + DuckDB (`@duckdb/node-api`), three capture paths: an incremental ETL of
the transcript + session-store (ambient firehose, mirrored self-contained), a live
`record` the orchestrator calls on each subagent return / audit / PoC (to keep the
outputs that are otherwise ephemeral), and curated Feature -> Decision entities with
supersession. Layer B (features/decisions/outputs) committed plainly as the public
archive; the bulky `activity/` firehose stays local (public repo), git-lfs-ready.

## Plan
1. [x] `@duckdb/node-api` dep (1.5.5-r.3); git-lfs installed + `.gitattributes` tracks `activity/` (ready for a private mirror; firehose stays gitignored on the public repo) - verify: `git lfs track` shows the rule.
2. [x] `tools/journal.mjs` skeleton + arg parsing for `etl|record|decision|feature|search|show` - verify: `--help` lists all six; bad args exit non-zero.
3. [x] Layer B: `feature` + `decision` writers with supersession (append, latest-wins) - verify: test - active-only excludes superseded; latest-per-slug.
4. [x] `etl`: transcript -> activity parquet, incremental via watermark, session-store join - verify: test - re-run adds zero rows; real run 27,584 rows.
5. [x] `record`: append one outputs row - verify: test - row lands with kind/feature/body.
6. [x] `search` + `show` - verify: `show <feature>` prints decision chain; real search 0.30s.
7. [x] Back-fill this session's decisions as the journal's first Layer B rows - verify: `show decision-log` / `show wow-enforcement`.
8. [x] Expose `etl` as `npm run journal:etl` (was briefly wired into pre-push; that hook was removed because it re-validated an already-checked tree on every push). Run it on demand - it only touches the local gitignored `activity/`.

## Progress
- 2026-08-03 Design accepted after two ratification rounds + a grounding correction (tool outputs are ephemeral -> added the live `record` path).
- 2026-08-03 CLI built (`tools/journal.mjs`, 6 commands) + 4-test suite green; real ETL 27,584 rows/1.18s; seeded 9 real decisions + 2 outputs across two features.

## Open
- The `search` filter set (step 6) - refined at build time. Storage resolved: firehose local, lfs-ready.
