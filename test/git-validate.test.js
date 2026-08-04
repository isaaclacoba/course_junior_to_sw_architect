// test/git-validate.test.js - the git archetype's decision function.
//
// WHY THIS EXISTS
// A git task authors `start` / `target` / `solution` as arrays of git commands,
// and the PAGE never runs `solution` - it prints it for the learner to type. So
// nothing checks that the authored solution reaches the authored target. Until
// this check existed, a git lesson passed tools/verify-lesson.mjs with zero of
// its exercises exercised: the same empty-set silent pass test/lesson-body.test.js
// exists to prevent, one archetype further along.
//
// checkGitTask is pure - (task, {init,run}) -> verdict - so every case below runs
// with no browser and no dotnet. The real git runtime comes from the vendored
// code-lab bundle in a vm sandbox (the artefact the browser actually ships); one
// test drives a scripted fake instead, to prove the runtime is injected and not
// reached for.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const TOOLS = path.join(path.dirname(__dirname), "tools");
const loadGit = () => import(path.join(TOOLS, "lib", "git-validate.mjs"));
const loadSandbox = () => import(path.join(TOOLS, "lib", "codelab-sandbox.mjs"));

async function runtime() {
  const { loadCodeLab } = await loadSandbox();
  const { gitRuntimeFrom } = await loadGit();
  const git = gitRuntimeFrom(loadCodeLab());
  assert.ok(git, "the vendored code-lab bundle must export gitInit/gitRun");
  return git;
}

const START = ['git add a.txt', 'git commit -m "init"'];
const TARGET = ['git add a.txt', 'git commit -m "init"', "git branch fix"];

// --- the happy path ---------------------------------------------------------
test("a solvable task passes", async () => {
  const { checkGitTask } = await loadGit();
  const r = checkGitTask({ start: START, target: TARGET, solution: ["git branch fix"] }, await runtime());
  assert.equal(r.ok, true, r.reason);
  assert.equal(r.code, "solved");
  assert.equal(r.commands, 1);
});

test("a task starting from an empty repo passes (no `start` is legal)", async () => {
  const { checkGitTask } = await loadGit();
  const r = checkGitTask({ target: TARGET, solution: TARGET }, await runtime());
  assert.equal(r.ok, true, r.reason);
});

test("the authoring aliases the plugin accepts are honoured", async () => {
  const { checkGitTask } = await loadGit();
  const r = checkGitTask(
    { commands: START, targetCommands: TARGET, solution: "git branch fix" },
    await runtime()
  );
  assert.equal(r.ok, true, r.reason);
});

// --- the failures that matter ----------------------------------------------
test("a solution that does not reach the target FAILS", async () => {
  const { checkGitTask } = await loadGit();
  const r = checkGitTask({ start: START, target: TARGET, solution: ["git status"] }, await runtime());
  assert.equal(r.ok, false);
  assert.equal(r.code, "not-solved");
  // the message has to name what is still missing, or a failing gate is undiagnosable
  assert.match(r.reason, /does not reach the target/);
});

test("a solution that makes an off-plan commit FAILS", async () => {
  const { checkGitTask } = await loadGit();
  const r = checkGitTask(
    { start: START, target: TARGET, solution: ["git branch fix", "git add b.txt", 'git commit -m "oops"'] },
    await runtime()
  );
  assert.equal(r.ok, false);
  assert.equal(r.code, "off-plan");
  assert.match(r.reason, /the target does not contain/);
});

test("a solution command the git model rejects FAILS", async () => {
  const { checkGitTask } = await loadGit();
  const r = checkGitTask({ start: START, target: TARGET, solution: ["git bogus"] }, await runtime());
  assert.equal(r.ok, false);
  assert.equal(r.code, "solution-failed");
  assert.match(r.reason, /git bogus/);
});

test("a start state that already solves the target FAILS - the card asks for nothing", async () => {
  const { checkGitTask } = await loadGit();
  const r = checkGitTask({ start: TARGET, target: TARGET, solution: ["git status"] }, await runtime());
  assert.equal(r.ok, false);
  assert.equal(r.code, "trivial");
});

test("a broken start replay FAILS as an authoring bug, not a learner mistake", async () => {
  const { checkGitTask } = await loadGit();
  const r = checkGitTask({ start: ["git bogus"], target: TARGET, solution: ["git branch fix"] }, await runtime());
  assert.equal(r.ok, false);
  assert.equal(r.code, "start-failed");
});

test("a malformed task FAILS clearly", async () => {
  const { checkGitTask } = await loadGit();
  const git = await runtime();
  const cases = [
    [null, /not an object/],
    [{ start: START, solution: ["git branch fix"] }, /`target`/],
    [{ start: START, target: TARGET }, /`solution`/],
    [{ start: START, target: TARGET, solution: [] }, /`solution`/],
    [{ start: START, target: TARGET, solution: [42] }, /`solution`/],
    [{ start: "git branch fix", target: TARGET, solution: ["git branch fix"] }, /`start`/],
    [{ start: START, target: "nope", solution: ["git branch fix"] }, /`target`/],
  ];
  for (const [task, re] of cases) {
    const r = checkGitTask(task, git);
    assert.equal(r.ok, false, `should reject ${JSON.stringify(task)}`);
    assert.equal(r.code, "malformed");
    assert.match(r.reason, re);
  }
});

test("no git runtime is a FAILURE, never a silent pass", async () => {
  const { checkGitTask, gitRuntimeFrom } = await loadGit();
  assert.equal(gitRuntimeFrom({}), null, "a bundle without git ops yields no runtime");
  assert.equal(gitRuntimeFrom({ gitInit: () => ({}) }), null, "half a runtime is no runtime");
  const r = checkGitTask({ start: START, target: TARGET, solution: ["git branch fix"] }, null);
  assert.equal(r.ok, false);
  assert.equal(r.code, "malformed");
});

// --- the runtime is injected, not reached for --------------------------------
test("works against a scripted runtime with no bundle at all", async () => {
  const { checkGitTask } = await loadGit();
  // A toy runtime: state is a list of typed lines; "boom" is its only error.
  const fake = {
    init: () => ({ lines: [] }),
    run: (line, state) =>
      line === "boom"
        ? { state, output: "boom failed", error: true }
        : { state: { lines: state.lines.concat(line) } },
  };
  // ...and a toy grader, so no real DAG is involved either.
  const grade = ({ actual, target }) => {
    const a = actual.lines.join("|"), t = target.lines.join("|");
    return { solved: a === t, diverged: a.length > t.length ? [1] : [], reason: "not equal" };
  };
  const task = { start: ["a"], target: ["a", "b"], solution: ["b"] };
  assert.equal(checkGitTask(task, fake, grade).ok, true);
  assert.equal(checkGitTask({ ...task, solution: ["c"] }, fake, grade).code, "not-solved");
  assert.equal(checkGitTask({ ...task, solution: ["boom"] }, fake, grade).code, "solution-failed");
});

// --- what the folder holds -------------------------------------------------
// The git model refuses to add a file that is not there, so every card needs a
// folder. Making authors list it by hand would be busywork AND a silent trap, so
// it is inferred from the card's own commands; `files` only covers what the card
// shows but never adds.
test("a card's files are inferred from the paths its own commands add", async () => {
  const task = {
    start: ["git add cat.txt", 'git commit -m "one"'],
    target: ["git add dog.txt"],
    solution: ["git add bird.txt"],
  };
  const { filesOf } = await loadGit();
  assert.deepEqual(filesOf(task).sort(), ["bird.txt", "cat.txt", "dog.txt"]);
});

test("declared files are added to the inferred ones, without duplicates", async () => {
  const { filesOf } = await loadGit();
  const task = { files: ["notes.md", "cat.txt"], target: ["git add cat.txt"] };
  assert.deepEqual(filesOf(task).sort(), ["cat.txt", "notes.md"]);
});

test("flags and whole-folder pathspecs are not filenames", async () => {
  const { filesOf } = await loadGit();
  const task = { target: ["git add .", "git add -A", "git add cat.txt"] };
  assert.deepEqual(filesOf(task), ["cat.txt"]);
});

test("a card with no commands and no files declares an empty folder", async () => {
  const { filesOf } = await loadGit();
  assert.deepEqual(filesOf({}), []);
  assert.deepEqual(filesOf(null), []);
});
