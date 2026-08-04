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

// --- goal tracker granularity ----------------------------------------------
// A blueprint box that lists only its class header passes every "does it light
// up" check while showing the learner nothing and ticking in a single jump. The
// gate below is what forces a box to name each field, constructor and method
// the learner has to add, so the tracker reads as subtasks rather than a lamp.

// A tiny stand-in for the real scanner: enough shape for the granularity rule
// without dragging the vendored bundle into a unit test.
function fakeScanner(byName) {
  return {
    scanCSharp: (src) => ({ types: byName[String(src).trim()] || [] }),
  };
}
const CAT_SOLUTION = "SOLUTION";
const CAT_STARTER = "STARTER";
function catScanner(starterMembers = []) {
  return fakeScanner({
    [CAT_SOLUTION]: [{
      name: "Cat", kind: "class", bases: [], members: [
        { name: "_hoursSinceMeal", kind: "field", detail: "int _hoursSinceMeal" },
        { name: "Cat", kind: "constructor", detail: "Cat(int hoursSinceMeal)" },
        { name: "IsHungry", kind: "method", detail: "bool IsHungry()" },
      ],
    }],
    [CAT_STARTER]: starterMembers.length
      ? [{ name: "Cat", kind: "class", bases: [], members: starterMembers }] : [],
  });
}
function runBuild(codeRows, scanner) {
  const { lines, deps } = recorder({
    codeLab: () => scanner,
    dotnet: { available: () => true, compileRun: () => ({ built: true, output: "", errors: "" }) },
    grading: { matches: () => true, buildProbe: () => "" },
  });
  const config = { tasks: [{
    title: "Cat", solution: CAT_SOLUTION, starter: CAT_STARTER,
    goal: ["one"], goals: [{ code: codeRows, gate: null }],
  }] };
  return { lines, deps, config };
}

test("a blueprint box that hides the learner's work FAILS the tracker gate", async () => {
  const { createValidators } = await load();
  const { lines, deps, config } = runBuild(["class Cat"], catScanner());
  const v = createValidators(deps).get("build");
  const passed = v.verify({ config, opts: {} });
  assert.equal(passed, false, "a header-only box must not pass");
  const msg = lines.bad.join("\n");
  assert.match(msg, /hides work the learner must do/);
  assert.match(msg, /field int _hoursSinceMeal/, "must name the missing field");
  assert.match(msg, /constructor Cat\(int hoursSinceMeal\)/, "must name the missing constructor");
  assert.match(msg, /method bool IsHungry\(\)/, "must name the missing method");
});

test("a box naming every added member PASSES", async () => {
  const { createValidators } = await load();
  const { lines, deps, config } = runBuild(
    ["class Cat", "int _hoursSinceMeal", "Cat(int hoursSinceMeal)", "bool IsHungry()"],
    catScanner());
  const v = createValidators(deps).get("build");
  assert.equal(v.verify({ config, opts: {} }), true, lines.bad.join("\n"));
});

test("a member the STARTER already provides needs no row", async () => {
  // Cards where the learner only fills a body must not be forced to list
  // machinery that was handed to them - that would be noise, not a subtask.
  const { createValidators } = await load();
  const starter = [
    { name: "_hoursSinceMeal", kind: "field", detail: "int _hoursSinceMeal" },
    { name: "Cat", kind: "constructor", detail: "Cat(int hoursSinceMeal)" },
  ];
  const { lines, deps, config } = runBuild(["class Cat", "bool IsHungry()"], catScanner(starter));
  const v = createValidators(deps).get("build");
  assert.equal(v.verify({ config, opts: {} }), true, lines.bad.join("\n"));
});

// --- the tracker summary must not contradict the failures above it ---------
// The "lights up fully" line used to print unconditionally, so a run could show
// four rows that can never tick and then announce success directly underneath.
// verify() returned false either way, but a human reading the log saw a green
// line and stopped looking.

test("a tracker with a failing row does NOT also claim it lights up fully", async () => {
  const { createValidators } = await load();
  // The box names a member the solution does not have, so its row cannot tick.
  const { lines, deps, config } = runBuild(
    ["class Cat", "int _hoursSinceMeal", "Cat(int hoursSinceMeal)", "bool IsHungry()", "void Nope()"],
    catScanner(),
  );
  const v = createValidators(deps).get("build");
  assert.equal(v.verify({ config, opts: {} }), false);
  assert.match(lines.bad.join("\n"), /could never tick/);
  assert.equal(
    lines.ok.some((m) => /lights up fully/.test(m)),
    false,
    "the summary line must be silent when the tracker failed",
  );
});

test("a tracker with nothing wrong still says it lights up fully", async () => {
  const { createValidators } = await load();
  const { lines, deps, config } = runBuild(
    ["class Cat", "int _hoursSinceMeal", "Cat(int hoursSinceMeal)", "bool IsHungry()"],
    catScanner(),
  );
  const v = createValidators(deps).get("build");
  assert.equal(v.verify({ config, opts: {} }), true);
  assert.equal(lines.ok.some((m) => /lights up fully/.test(m)), true);
});

test("a starter the scanner cannot read FAILS instead of skipping granularity", async () => {
  const { createValidators } = await load();
  // The granularity check used to `catch { return; }`, abandoning itself with no
  // signal - the exact "check that goes quiet" this validator exists to catch.
  const exploding = {
    scanCSharp: (src) => {
      if (String(src).trim() === CAT_STARTER) throw new Error("scanner blew up");
      return { types: catScanner().scanCSharp(src).types };
    },
  };
  const { lines, deps, config } = runBuild(["class Cat"], exploding);
  const v = createValidators(deps).get("build");
  assert.equal(v.verify({ config, opts: {} }), false, "an unreadable starter must fail");
  assert.match(lines.bad.join("\n"), /granularity was not checked/);
  assert.match(lines.bad.join("\n"), /scanner blew up/, "must say WHY");
});

// --- the tracker check must not ride inside the dotnet path -----------------
//
// REGRESSION. checkTracker used to be called from inside the compile loop, so
// `--no-dotnet` - and every machine with no dotnet on PATH, which includes CI
// for a docs-only change - skipped every goal-tracker assertion in the repo and
// still printed PASS. The tracker is a pure static check on the solution's
// shape; it needs no compiler and must always run.
const TRACKER_TASK = {
  title: "shape",
  starter: "public class Cat { }",
  solution: "public class Cat { public bool IsHungry() { return true; } }",
  goals: [{ code: ["class Cat", "bool IsHungry()"], gate: { type: "Cat", member: "IsHungry" } }],
};

function trackerDeps(scan) {
  return recorder({ codeLab: () => ({ scanCSharp: scan }) });
}

const REAL_SCAN = (src) => {
  const types = [];
  for (const m of src.matchAll(/class\s+(\w+)\s*\{([\s\S]*?)\}\s*$/g)) {
    types.push({
      name: m[1], kind: "class", bases: [],
      members: [...m[2].matchAll(/(\w+)\s*\(/g)].map((x) => ({ name: x[1], kind: "method" })),
    });
  }
  return { types };
};

for (const archetype of ["build", "drill"]) {
  test(`${archetype}: the goal tracker is checked even with --no-dotnet`, async () => {
    const { createValidators } = await load();
    const { lines, deps } = trackerDeps(REAL_SCAN);
    const v = createValidators(deps).get(archetype);
    const passed = v.verify({ config: { tasks: [TRACKER_TASK] }, opts: { noDotnet: true } });
    assert.equal(passed, true);
    assert.ok(lines.ok.some((m) => /goal tracker lights up/.test(m)),
      `tracker was never checked without dotnet: ${JSON.stringify(lines)}`);
  });

  test(`${archetype}: a dead gate FAILS without dotnet instead of going quiet`, async () => {
    const { createValidators } = await load();
    const { lines, deps } = trackerDeps(REAL_SCAN);
    const dead = { ...TRACKER_TASK, goals: [{ gate: { type: "Cat", member: "Ghost" } }] };
    const v = createValidators(deps).get(archetype);
    const passed = v.verify({ config: { tasks: [dead] }, opts: { noDotnet: true } });
    assert.equal(passed, false, "a gate the solution can never meet must fail the run");
    assert.ok(lines.bad.some((m) => /could never tick/.test(m)), JSON.stringify(lines.bad));
  });
}

test("a step row whose source probe is absent from the solution fails validation", async () => {
  const { createValidators } = await load();
  const { lines, deps } = trackerDeps(REAL_SCAN);
  const task = {
    ...TRACKER_TASK,
    goals: [{
      code: ["class Cat", { row: "builds the list", writes: "new List<Cat>" }],
      gate: { type: "Cat", member: "IsHungry" },
    }],
  };
  const v = createValidators(deps).get("build");
  assert.equal(v.verify({ config: { tasks: [task] }, opts: { noDotnet: true } }), false);
  assert.ok(lines.bad.some((m) => /step row watching for/.test(m)), JSON.stringify(lines.bad));
});
