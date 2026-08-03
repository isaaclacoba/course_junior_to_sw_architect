// test/journal.test.js - tools/journal.mjs (decision log / activity archive)
// Spawns the CLI against an isolated temp JOURNAL_DIR so nothing touches the repo.
// CommonJS (no root "type":"module") to match the repo's other .test.js files.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const { mkdtempSync, writeFileSync, mkdirSync } = require("node:fs");
const { tmpdir } = require("node:os");
const { join, dirname } = require("node:path");

const ROOT = dirname(__dirname);
const CLI = join(ROOT, "tools", "journal.mjs");

function makeJournal() {
  const dir = mkdtempSync(join(tmpdir(), "journal-test-"));
  return dir;
}
function run(journalDir, args, extraEnv = {}) {
  const r = spawnSync("node", [CLI, ...args], {
    encoding: "utf8",
    env: { ...process.env, JOURNAL_DIR: journalDir, JOURNAL_NO_STORE: "1", ...extraEnv },
  });
  return { code: r.status, out: r.stdout || "", err: r.stderr || "" };
}

test("feature + decision + supersession + record + show", () => {
  const J = makeJournal();
  assert.equal(run(J, ["feature", "--slug", "demo", "--title", "Demo", "--status", "building", "--goal", "prove it"]).code, 0);

  const d1 = run(J, ["decision", "--feature", "demo", "--question", "Format?", "--options", "json|parquet", "--chosen", "parquet", "--why", "queryable and small"]);
  assert.equal(d1.code, 0);
  assert.match(d1.out, /D-demo-1 recorded/);

  const d2 = run(J, ["decision", "--feature", "demo", "--question", "Runtime?", "--options", "python|node", "--chosen", "node", "--why", "pure node", "--supersedes", "D-demo-1"]);
  assert.equal(d2.code, 0);
  assert.match(d2.out, /D-demo-2 recorded \(supersedes D-demo-1\)/);

  const rec = run(J, ["record", "--kind", "poc", "--feature", "demo", "--title", "compression", "--body", "20MB -> 3.3MB at 6x"]);
  assert.equal(rec.code, 0);

  const show = run(J, ["show", "demo"]);
  assert.equal(show.code, 0);
  assert.match(show.out, /status: building/);
  assert.match(show.out, /D-demo-1 \[superseded\]/); // superseded after the supersede
  assert.match(show.out, /D-demo-2 \[active\]/);
  assert.match(show.out, /outputs \(1\)/);
  assert.match(show.out, /compression/);
});

test("search finds decisions and outputs", () => {
  const J = makeJournal();
  run(J, ["decision", "--feature", "demo", "--question", "Storage?", "--options", "lfs|plain", "--chosen", "lfs", "--why", "avoid git bloat with binary parquet"]);
  run(J, ["record", "--kind", "audit", "--feature", "demo", "--title", "gate", "--body", "the pre-push gate blocks leaks"]);
  const s = run(J, ["search", "parquet"]);
  assert.equal(s.code, 0);
  assert.match(s.out, /D-demo-1/);
  const s2 = run(J, ["search", "pre-push"]);
  assert.match(s2.out, /\[output\].*audit/);
});

test("etl is incremental (watermark) and idempotent", () => {
  const J = makeJournal();
  const tdir = join(J, "transcripts");
  mkdirSync(tdir, { recursive: true });
  const sid = "11111111-1111-1111-1111-111111111111";
  const lines = [
    { type: "session.start", timestamp: "2026-08-03T10:00:00.000Z", data: { sessionId: sid, producer: "copilot-agent" } },
    { type: "user.message", timestamp: "2026-08-03T10:00:01.000Z", data: { content: "please add a widget" } },
    { type: "assistant.message", timestamp: "2026-08-03T10:00:02.000Z", data: { content: "reasoning that should be dropped from body" } },
    { type: "tool.execution_start", timestamp: "2026-08-03T10:00:03.000Z", data: { toolCallId: "t1", toolName: "grep_search", arguments: { query: "widget" } } },
    { type: "tool.execution_complete", timestamp: "2026-08-03T10:00:04.000Z", data: { toolCallId: "t1", success: true } },
  ];
  writeFileSync(join(tdir, `${sid}.jsonl`), lines.map((l) => JSON.stringify(l)).join("\n"));

  const first = run(J, ["etl", "--transcripts", tdir]);
  assert.equal(first.code, 0);
  assert.match(first.out, /\+5 rows/); // 5 records -> 5 activity rows
  assert.match(first.out, /etl done: \+5 activity rows/);

  const second = run(J, ["etl", "--transcripts", tdir]);
  assert.equal(second.code, 0);
  assert.match(second.out, /etl done: \+0 activity rows/); // watermark -> no dupes

  // tool args are kept as body -> searchable
  const sArgs = run(J, ["search", "widget"]);
  assert.match(sArgs.out, /\[activity\]/);
});

test("bad args exit non-zero", () => {
  const J = makeJournal();
  assert.notEqual(run(J, ["feature"]).code, 0); // missing --slug
  assert.notEqual(run(J, ["decision", "--feature", "x"]).code, 0); // missing question/chosen/why
  assert.notEqual(run(J, ["bogus"]).code, 0);
});

test("etl survives malformed / missing-timestamp lines", () => {
  const J = makeJournal();
  const tdir = join(J, "transcripts");
  mkdirSync(tdir, { recursive: true });
  const sid = "22222222-2222-2222-2222-222222222222";
  const good = { type: "user.message", timestamp: "2026-08-03T10:00:01.000Z", data: { content: "a widget request" } };
  const noTs = { type: "user.message", data: { content: "line with no timestamp" } }; // missing ts -> must not crash
  const garbage = "{not valid json";
  writeFileSync(join(tdir, `${sid}.jsonl`), [JSON.stringify(good), JSON.stringify(noTs), garbage].join("\n"));
  const r = run(J, ["etl", "--transcripts", tdir]);
  assert.equal(r.code, 0); // one bad line must not poison the batch
  assert.match(r.out, /\+2 rows/); // 2 valid records ingested, garbage skipped
  assert.match(run(J, ["search", "no timestamp"]).out, /\[activity\]/); // the null-ts row still landed
});

test("search --kind filters outputs, not just activity", () => {
  const J = makeJournal();
  run(J, ["record", "--kind", "poc", "--feature", "demo", "--title", "alpha widget", "--body", "shared token zzz"]);
  run(J, ["record", "--kind", "note", "--feature", "demo", "--title", "alpha gadget", "--body", "shared token zzz"]);
  const s = run(J, ["search", "zzz", "--kind", "poc"]);
  assert.equal(s.code, 0);
  assert.match(s.out, /widget/); // the poc output is kept
  assert.doesNotMatch(s.out, /gadget/); // the note output is filtered out
});

test("superseding a nonexistent decision fails", () => {
  const J = makeJournal();
  const r = run(J, ["decision", "--feature", "demo", "--question", "Q?", "--options", "a|b", "--chosen", "a", "--why", "w", "--supersedes", "D-demo-99"]);
  assert.notEqual(r.code, 0);
});

test("show / search on an empty journal do not crash", () => {
  const J = makeJournal();
  const show = run(J, ["show", "nope"]);
  assert.equal(show.code, 0);
  assert.match(show.out, /no feature row/);
  const s = run(J, ["search", "anything"]);
  assert.equal(s.code, 0);
  assert.match(s.out, /activity 0, outputs 0, decisions 0/);
});
