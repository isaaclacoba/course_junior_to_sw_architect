/**
 * tools/lib/git-validate.mjs - "is this git exercise actually solvable?", pure.
 *
 * A git task authors its repo as ARRAYS OF GIT COMMANDS (see
 * kernel/engine/plugins/git-plugin.js): `start` is replayed when the card
 * renders, `target` is the shape the learner must reach, `solution` is printed
 * for the learner to type but is NEVER run by the page. Nothing therefore ever
 * proves the authored solution reaches the authored target - the exact
 * silent-pass hole this verifier exists to close (tools/lib.mjs, "drift
 * detectors are silent on the empty set").
 *
 * So the check is a REPLAY: start -> run the solution -> grade against target.
 * Grading is delegated to kernel/engine/git-progress.js, the same module the
 * page grades with; no comparison is re-implemented here.
 *
 * Pure and injectable: the git runtime arrives as `{ init(), run(line, state) }`,
 * so this module needs no browser, no dotnet, and no file system. That is what
 * makes it unit-testable on plain command arrays.
 */
import KernelGitProgress from "../../kernel/engine/git-progress.js";

// A RepoState, not a command list. The plugin accepts one as-is, so the
// verifier and the tests may pass one too.
function isRepoState(s) {
  return !!(s && s.commits && s.commits.get && s.refs && s.refs.forEach && s.head);
}

function isCommandList(v) {
  return Array.isArray(v) && v.every((c) => typeof c === "string" && c.trim());
}

// The plugin's own accessors, so authoring aliases stay in one truth.
export function startOf(task) { return task && (task.start || task.commands); }
export function targetOf(task) { return task && (task.target || task.targetCommands); }
export function solutionOf(task) {
  const s = task && task.solution;
  if (Array.isArray(s)) return s;
  return s ? [s] : [];
}

// Wrap a loaded CodeLab bundle as the runtime this module takes. Returns null
// when the bundle cannot run git at all (a stale re-vendor), so the caller can
// fail loudly instead of verifying nothing.
export function gitRuntimeFrom(CodeLab) {
  if (!CodeLab || typeof CodeLab.gitInit !== "function" || typeof CodeLab.gitRun !== "function") return null;
  return {
    init: () => CodeLab.gitInit(),
    run: (line, state) => CodeLab.gitRun(line, state),
  };
}

// Run a command list through the runtime. A command that errors is an authoring
// bug (the page only console.warns about it), so it is surfaced, not swallowed.
export function replay(git, commands, state) {
  let s = state || git.init();
  for (const line of commands) {
    let res;
    try { res = git.run(line, s); }
    catch (err) { return { state: s, failed: { line, output: (err && err.message) || String(err) } }; }
    if (res && res.state) s = res.state;
    if (res && res.error) return { state: s, failed: { line, output: res.output || String(res.error) } };
  }
  return { state: s, failed: null };
}

function toState(git, spec) {
  if (isRepoState(spec)) return { state: spec, failed: null };
  if (Array.isArray(spec)) return replay(git, spec);
  return { state: git.init(), failed: null };
}

function fail(code, reason) { return { ok: false, code, reason }; }

/**
 * The decision function. Pure: (task, runtime) -> verdict.
 *
 *   { ok: true,  code: "solved", reason, commands }
 *   { ok: false, code, reason }
 *
 * `code` is stable so callers and tests can branch on it:
 *   malformed | start-failed | target-failed | trivial | solution-failed |
 *   off-plan | not-solved
 */
export function checkGitTask(task, git, progress = KernelGitProgress.progress) {
  if (!task || typeof task !== "object") return fail("malformed", "task is not an object");
  if (!git || typeof git.init !== "function" || typeof git.run !== "function") {
    return fail("malformed", "no git runtime - the vendored code-lab bundle exports no gitInit/gitRun");
  }

  const start = startOf(task);
  const target = targetOf(task);
  const solution = solutionOf(task);

  if (start !== undefined && start !== null && !isCommandList(start) && !isRepoState(start)) {
    return fail("malformed", "`start` must be an array of git command strings (or a RepoState)");
  }
  if (!isCommandList(target) && !isRepoState(target)) {
    return fail("malformed", "`target` must be a non-empty array of git command strings (or a RepoState)");
  }
  if (!solution.length || !isCommandList(solution)) {
    return fail("malformed", "`solution` must be a non-empty array of git command strings");
  }

  const s0 = toState(git, start);
  if (s0.failed) return fail("start-failed", `start command failed - '${s0.failed.line}': ${s0.failed.output}`);
  const t = toState(git, target);
  if (t.failed) return fail("target-failed", `target command failed - '${t.failed.line}': ${t.failed.output}`);

  // A card whose start ALREADY matches its target passes without the learner
  // typing anything - an exercise with no exercise in it. Same failure class as
  // an empty lesson body, so it fails here rather than shipping.
  const before = progress({ actual: s0.state, target: t.state });
  if (before.solved) return fail("trivial", "the start state already reaches the target - this card asks the learner to do nothing");

  const done = replay(git, solution, s0.state);
  if (done.failed) return fail("solution-failed", `solution command failed - '${done.failed.line}': ${done.failed.output}`);

  const after = progress({ actual: done.state, target: t.state });
  if (after.diverged.length) {
    return fail("off-plan", `the solution leaves ${after.diverged.length} commit(s) the target does not contain - the card can never pass`);
  }
  if (!after.solved) {
    return fail("not-solved", `the solution does not reach the target - ${after.reason}`);
  }
  return { ok: true, code: "solved", reason: "the solution reaches the target", commands: solution.length };
}
