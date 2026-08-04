// test/lesson-validators.test.js - the archetype validator REGISTRY that
// tools/verify-lesson.mjs dispatches through.
//
// WHY THIS EXISTS
// The verifier used to branch on archetype in two places (which body check to
// run, and which DOM marker proves the body painted). An archetype with no
// branch - `git` - was reported as verified while nothing about it was checked.
// Dispatch is now data, so the thing worth testing is that the data is complete
// and that a validator with no entry FAILS instead of falling through.
//
// Everything a validator needs is injected, so these tests need no bundle, no
// dotnet and no browser: the reporters are recording fakes.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const TOOLS = path.join(path.dirname(__dirname), "tools");
const load = () => import(path.join(TOOLS, "lib", "lesson-validators.mjs"));

function recorder(extra = {}) {
  const lines = { ok: [], bad: [], skip: [], note: [] };
  const deps = {
    report: {
      ok: (m) => lines.ok.push(m), bad: (m) => lines.bad.push(m),
      skip: (m) => lines.skip.push(m), note: (m) => lines.note.push(m),
    },
    dotnet: { available: () => false, compileRun: () => { throw new Error("dotnet must not be reached"); } },
    grading: { matches: () => true, buildProbe: () => "" },
    codeLab: () => ({}),
    ...extra,
  };
  return { lines, deps };
}

const ARCHETYPES = ["build", "drill", "viz", "checkpoint", "git"];

test("every archetype the course ships has a validator", async () => {
  const { createValidators } = await load();
  const { deps } = recorder();
  const v = createValidators(deps);
  assert.deepEqual(v.archetypes().sort(), [...ARCHETYPES].sort());
  for (const a of ARCHETYPES) {
    const val = v.get(a);
    assert.equal(val.archetype, a);
    assert.equal(typeof val.bodyField, "string");
    assert.equal(typeof val.verify, "function");
    assert.equal(typeof val.rendered, "function");
  }
});

test("an archetype with no validator resolves to null, never to a default", async () => {
  const { createValidators } = await load();
  const v = createValidators(recorder().deps);
  assert.equal(v.get("gitviz"), null);
  assert.equal(v.get(undefined), null);
});

// --- the body a lesson must HAVE --------------------------------------------
test("resolveBody accepts git under the unified LESSON_CONFIG", async () => {
  const { createValidators, resolveBody } = await load();
  const git = createValidators(recorder().deps).get("git");
  const r = resolveBody({ LESSON_CONFIG: { tasks: [1, 2] } }, "git", git);
  assert.equal(r.ok, true);
  assert.equal(r.count, 2);
  assert.equal(r.global, "LESSON_CONFIG");
});

test("resolveBody rejects an empty or missing git body", async () => {
  const { createValidators, resolveBody } = await load();
  const git = createValidators(recorder().deps).get("git");
  assert.equal(resolveBody({ LESSON_CONFIG: { tasks: [] } }, "git", git).ok, false);
  assert.match(resolveBody({ LESSON_CONFIG: {} }, "git", git).reason, /missing/);
  assert.match(resolveBody({}, "git", git).reason, /LESSON_CONFIG/);
});

test("resolveBody refuses an archetype nobody knows", async () => {
  const { resolveBody } = await load();
  const r = resolveBody({ LESSON_CONFIG: { tasks: [1] } }, "gitviz", null);
  assert.equal(r.ok, false);
  assert.match(r.reason, /unknown archetype/);
});

// --- the git validator reports through the INJECTED reporters ---------------
test("the git validator passes a solvable lesson and reports one line per task", async () => {
  const { createValidators } = await load();
  const { loadCodeLab } = await import(path.join(TOOLS, "lib", "codelab-sandbox.mjs"));
  const { lines, deps } = recorder({ codeLab: loadCodeLab });
  const start = ['git add a.txt', 'git commit -m "init"'];
  const config = {
    tasks: [
      { title: "branch it", start, target: start.concat(["git branch fix"]), solution: ["git branch fix"] },
      { title: "tag it", start, target: start.concat(["git tag v1"]), solution: ["git tag v1"] },
      { title: "recap", summary: true },
    ],
  };
  const passed = createValidators(deps).get("git").verify({ config, opts: {} });
  assert.equal(passed, true, lines.bad.join("\n"));
  assert.equal(lines.ok.length, 2, "summary cards are not graded");
  assert.equal(lines.bad.length, 0);
});

test("the git validator FAILS a lesson whose solution misses the target", async () => {
  const { createValidators } = await load();
  const { loadCodeLab } = await import(path.join(TOOLS, "lib", "codelab-sandbox.mjs"));
  const { lines, deps } = recorder({ codeLab: loadCodeLab });
  const start = ['git add a.txt', 'git commit -m "init"'];
  const config = { tasks: [{ title: "branch it", start, target: start.concat(["git branch fix"]), solution: ["git status"] }] };
  const passed = createValidators(deps).get("git").verify({ config, opts: {} });
  assert.equal(passed, false);
  assert.equal(lines.bad.length, 1);
  assert.match(lines.bad[0], /task 1 "branch it"/);
  assert.match(lines.bad[0], /\[not-solved\]/);
});

test("a code-lab bundle with no git ops FAILS the lesson, it does not skip it", async () => {
  const { createValidators } = await load();
  const { lines, deps } = recorder(); // codeLab: () => ({})
  const config = { tasks: [{ title: "branch it", target: ["git add a.txt"], solution: ["git add a.txt"] }] };
  const passed = createValidators(deps).get("git").verify({ config, opts: {} });
  assert.equal(passed, false);
  assert.match(lines.bad[0], /re-vendor/);
});

// --- the render discriminators ----------------------------------------------
test("each validator's rendered() distinguishes a real body from page furniture", async () => {
  const { createValidators } = await load();
  const v = createValidators(recorder().deps);
  const furniture = '<h1 class="hero">Lesson</h1><p id="cfTitle"></p>';
  assert.equal(v.get("build").rendered(furniture), false);
  assert.equal(v.get("build").rendered('<p id="cfTitle">Write a class</p>'), true);
  assert.equal(v.get("viz").rendered(furniture), false);
  assert.equal(v.get("viz").rendered('<div class="cl-tx"></div>'), true);
  assert.equal(v.get("checkpoint").rendered(furniture), false);
  assert.equal(v.get("checkpoint").rendered('<div class="cl-quiz"></div>'), true);
  // a git body is the terminal the learner types into AND the graph it grades on
  assert.equal(v.get("git").rendered(furniture), false);
  assert.equal(v.get("git").rendered('<div class="cl-term"></div>'), false);
  assert.equal(v.get("git").rendered('<div class="cl-term"></div><div class="cl-git"></div>'), true);
});

// --- the compiled archetypes still honour their flags -----------------------
test("build/drill skip compiling under --no-dotnet and when dotnet is absent", async () => {
  const { createValidators } = await load();
  for (const arch of ["build", "drill"]) {
    const withFlag = recorder();
    assert.equal(createValidators(withFlag.deps).get(arch).verify({ config: { tasks: [{}] }, opts: { noDotnet: true } }), true);
    assert.match(withFlag.lines.skip[0], /--no-dotnet/);

    const noDotnet = recorder();
    assert.equal(createValidators(noDotnet.deps).get(arch).verify({ config: { tasks: [{}] }, opts: {} }), true);
    assert.match(noDotnet.lines.skip[0], /no dotnet on PATH/);
  }
});

test("viz skips resolvers under --no-viz", async () => {
  const { createValidators } = await load();
  const { lines, deps } = recorder();
  assert.equal(createValidators(deps).get("viz").verify({ config: { steps: [{}] }, opts: { noViz: true } }), true);
  assert.match(lines.skip[0], /--no-viz/);
});
