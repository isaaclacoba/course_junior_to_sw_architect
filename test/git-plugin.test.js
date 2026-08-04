"use strict";

// Unit tests for the "git" archetype PLUGIN - kernel/engine/plugins/git-plugin.js.
//
// These prove the plugin drives its archetype middle (a line terminal, a commit
// graph, the git runtime) and reports each verdict back through the generic core
// so the core's shared chrome (XP award, result panel) responds. Progress is the
// REAL kernel/engine/git-progress.js on top of the REAL kernel/grading/dag-match.js
// - no comparison is faked, so what is asserted here is the same achieved /
// missing / off-plan logic the browser runs.
//
// What IS faked: the browser (a hand-built fake DOM, the same approach as
// test/lesson-engine.test.js - there is no jsdom here) and CodeLab. The vendored
// git runtime is TypeScript inside the code-lab submodule and cannot be
// require()d from Node, so `gitRun` below is a scripted stand-in that models just
// enough of the teaching model for these cases: init, commit -m, branch, and
// checkout/switch. Its RepoState is the real shape (Maps + refs + head), which is
// all git-progress duck-types.

const test = require("node:test");
const assert = require("node:assert/strict");

const LessonCommon = require("../kernel/page-shell/lesson-common.js");
const KernelDagMatch = require("../kernel/grading/dag-match.js");
const KernelGitProgress = require("../kernel/engine/git-progress.js");
const LessonEngine = require("../kernel/engine/lesson-engine.js");
// Requiring the plugin registers it on the core it require()s (same cached module).
const GitPlugin = require("../kernel/engine/plugins/git-plugin.js");

// ---- minimal fake DOM ------------------------------------------------------
function makeEl(id) {
  const classes = new Set();
  const listeners = {};
  return {
    id,
    textContent: "",
    innerHTML: "",
    hidden: true,
    disabled: false,
    classList: {
      toggle(cls, on) { if (on) classes.add(cls); else classes.delete(cls); },
      add(cls) { classes.add(cls); },
      remove(cls) { classes.delete(cls); },
      contains(cls) { return classes.has(cls); },
    },
    appendChild(child) { (this.children = this.children || []).push(child); return child; },
    closest() { return null; },
    addEventListener(type, fn) { (listeners[type] = listeners[type] || []).push(fn); },
    click() { (listeners.click || []).forEach((fn) => fn({})); },
  };
}

function makeDom(prefix) {
  const ids = [
    // core chrome
    "Meta", "Title", "Context", "Concept", "Progress", "Goal",
    "Result", "ResultTitle", "ResultBody",
    "Summary", "SummaryIntro", "SummaryList", "SummaryClose",
    "Prev", "Next",
    // git host roles
    "Terminal", "Graph", "Actions", "Solution", "Reset",
  ].map((s) => prefix + s);
  const registry = {};
  ids.forEach((id) => { registry[id] = makeEl(id); });
  registry["courseXpLabel"] = makeEl("courseXpLabel");
  return {
    getElementById(id) { return registry[id] || null; },
    createElement(tag) { return makeEl("<" + tag + ">"); },
  };
}

// ---- a scripted stand-in for the vendored git runtime ----------------------
function emptyState() {
  return {
    commits: new Map(),
    refs: new Map(),
    head: { kind: "branch", name: "refs/heads/main" },
    index: new Map(),
    worktree: new Map(),
    seq: 0,
  };
}
function cloneState(s) {
  return {
    commits: new Map(s.commits),
    refs: new Map(s.refs),
    head: s.head,
    index: new Map(s.index),
    worktree: new Map(s.worktree),
    seq: s.seq,
  };
}
function headCommit(s) {
  if (s.head.kind === "detached") return s.head.commit;
  return s.refs.has(s.head.name) ? s.refs.get(s.head.name) : null;
}
function tokenize(line) {
  const out = [];
  const re = /"([^"]*)"|(\S+)/g;
  let m;
  while ((m = re.exec(line)) !== null) out.push(m[1] !== undefined ? m[1] : m[2]);
  return out;
}
function fail(state, message) {
  return { state, output: message, effect: { kind: "none" }, error: message };
}
function gitRun(line, state) {
  let tokens = tokenize(line);
  if (tokens.length && tokens[0] === "git") tokens = tokens.slice(1);
  if (!tokens.length) return { state, output: "", effect: { kind: "none" } };
  const sub = tokens[0];
  const args = tokens.slice(1);

  if (sub === "init") {
    return { state: emptyState(), output: "Initialized empty Git repository", effect: { kind: "none" } };
  }
  if (sub === "commit") {
    const mi = args.indexOf("-m");
    const message = mi >= 0 ? args[mi + 1] : "";
    if (!message) return fail(state, "Aborting commit due to empty commit message.");
    const s = cloneState(state);
    const head = headCommit(s);
    s.seq += 1;
    const id = "h" + s.seq;
    s.commits.set(id, { id, parents: head === null ? [] : [head], message, paths: [] });
    if (s.head.kind === "branch") s.refs.set(s.head.name, id);
    else s.head = { kind: "detached", commit: id };
    return { state: s, output: "[" + id + "] " + message, effect: { kind: "commit", id } };
  }
  if (sub === "branch") {
    const name = args[0];
    if (!name) return fail(state, "branch: a name is required");
    const ref = "refs/heads/" + name;
    if (state.refs.has(ref)) return fail(state, "fatal: branch '" + name + "' already exists");
    const at = headCommit(state);
    if (at === null) return fail(state, "fatal: cannot create a branch: HEAD is unborn");
    const s = cloneState(state);
    s.refs.set(ref, at);
    return { state: s, output: "", effect: { kind: "branch", ref, commit: at } };
  }
  if (sub === "switch" || sub === "checkout") {
    const name = args.filter((a) => !a.startsWith("-"))[0];
    const ref = "refs/heads/" + name;
    const s = cloneState(state);
    if (args.includes("-b") || args.includes("-c")) {
      const at = headCommit(s);
      if (at === null) return fail(state, "fatal: HEAD is unborn");
      s.refs.set(ref, at);
    } else if (!s.refs.has(ref)) {
      return fail(state, "error: pathspec '" + name + "' did not match any file(s) known to git");
    }
    s.head = { kind: "branch", name: ref };
    return { state: s, output: "Switched to branch '" + name + "'", effect: { kind: "none" } };
  }
  return fail(state, "git: '" + sub + "' is not a git command. See 'git --help'.");
}

// ---- a fake CodeLab whose widgets record what the plugin asked for ---------
function makeCodeLab() {
  const terminal = {
    host: null,
    onCommand: null,
    lines: [],
    clears: 0,
    focuses: 0,
    mount(host, opts) {
      this.host = host;
      this.prompt = opts.prompt;
      this.onCommand = opts.onCommand;
    },
    write(text, kind) { this.lines.push({ text, kind: kind || "out" }); },
    clear() { this.clears += 1; this.lines.length = 0; },
    focus() { this.focuses += 1; },
    destroy() {},
    // what the learner does
    type(line) { this.onCommand(line); },
    text() { return this.lines.map((l) => l.text).join("\n"); },
  };
  const graph = {
    mounts: [],
    setStates: [],
    mount(host, opts) { this.mounts.push({ host, opts }); },
    setState(state, opts) { this.setStates.push({ state, opts }); },
    destroy() {},
    last() { return this.setStates.length ? this.setStates[this.setStates.length - 1] : this.mounts[0]; },
    lastState() { const l = this.last(); return l.state || l.opts.state; },
    lastOverlay() { const l = this.last(); return l.opts; },
  };
  return {
    LineTerminal: function () { return terminal; },
    GitGraph: function () { return graph; },
    gitRun,
    gitInit: emptyState,
    _terminal: terminal,
    _graph: graph,
  };
}

// Install fake browser globals for the length of fn, then restore.
async function withDom(prefix, fn, opts) {
  const saved = {};
  ["document", "window", "history", "location", "LessonCommon", "KernelDagMatch", "KernelGitProgress", "CodeLab"].forEach((k) => {
    saved[k] = { had: Object.prototype.hasOwnProperty.call(globalThis, k), val: globalThis[k] };
  });
  const dom = makeDom(prefix);
  const codeLab = makeCodeLab();
  globalThis.document = dom;
  globalThis.location = { hash: "", href: "" };
  globalThis.history = { replaceState() {} };
  globalThis.window = { location: { href: "" }, addEventListener() {}, PAGE: { nextHref: "next-lesson.html" } };
  LessonCommon.storage = LessonCommon.memoryStorage();
  globalThis.LessonCommon = LessonCommon;
  globalThis.KernelDagMatch = KernelDagMatch; // the REAL signer
  globalThis.KernelGitProgress = KernelGitProgress; // the REAL progress model
  if (opts && opts.noCodeLab) delete globalThis.CodeLab;
  else globalThis.CodeLab = codeLab;
  try {
    return await fn(dom, codeLab);
  } finally {
    Object.keys(saved).forEach((k) => {
      if (saved[k].had) globalThis[k] = saved[k].val;
      else delete globalThis[k];
    });
  }
}

// A two-card git config. Both cards author start/target as COMMAND LISTS, which
// the plugin replays through the runtime at render time.
function gitConfig() {
  return {
    archetype: "git",
    prefix: "gt",
    xpKey: "xp",
    awardedKey: "aw",
    awardAmount: 20,
    metaLabel: "Git track",
    progressNoun: "Exercise",
    tasks: [
      {
        title: "Record a second commit",
        context: "A commit is a **snapshot**.",
        concept: "commit",
        goal: ["record the readme"],
        start: ['git commit -m "init"'],
        target: ['git commit -m "init"', 'git commit -m "add readme"'],
        solution: ['git commit -m "add readme"'],
      },
      {
        title: "Open a branch",
        context: "A branch is a moving name.",
        concept: "branch",
        goal: ["create fix"],
        start: ['git commit -m "init"'],
        target: ['git commit -m "init"', "git branch fix"],
        solution: ["git branch fix"],
      },
    ],
  };
}

const xpNow = () =>
  LessonCommon.createProgress({ storage: LessonCommon.storage, xpKey: "xp", awardedKey: "aw" }).xp();

// ---------------------------------------------------------------------------

test("the git plugin is registered under archetype 'git'", () => {
  assert.equal(GitPlugin.archetype, "git");
  assert.equal(LessonEngine.plugins.git, GitPlugin);
});

test("mount wires the terminal and mounts the graph with the card's start state", async () => {
  await withDom("gt", async (dom, codeLab) => {
    const controller = LessonEngine.create(gitConfig());
    await controller.boot();

    // terminal mounted on its host, with a command handler
    assert.equal(codeLab._terminal.host, dom.getElementById("gtTerminal"));
    assert.equal(typeof codeLab._terminal.onCommand, "function");

    // graph mounted once, on its host, with the START state of card 1
    assert.equal(codeLab._graph.mounts.length, 1);
    assert.equal(codeLab._graph.mounts[0].host, dom.getElementById("gtGraph"));
    const state = codeLab._graph.mounts[0].opts.state;
    const messages = [...state.commits.values()].map((c) => c.message);
    assert.deepEqual(messages, ["init", "add readme"], "the union carries the learner's commit plus the ghost");
    // only the NEXT missing commit is ghosted
    assert.equal(codeLab._graph.mounts[0].opts.ghost.length, 1);
    assert.equal(state.commits.get(codeLab._graph.mounts[0].opts.ghost[0]).message, "add readme");
    assert.deepEqual(codeLab._graph.mounts[0].opts.diverged, []);
  });
});

test("typing the solution drives the graph and reports a pass, so the core awards XP", async () => {
  await withDom("gt", async (dom, codeLab) => {
    const controller = LessonEngine.create(gitConfig());
    await controller.boot();

    codeLab._terminal.type('git commit -m "add readme"');

    // the graph was repainted, with nothing left ghosted or flagged
    assert.equal(codeLab._graph.setStates.length, 1);
    assert.equal(codeLab._graph.lastOverlay().animate, true);
    assert.deepEqual(codeLab._graph.lastOverlay().ghost, []);
    assert.deepEqual(codeLab._graph.lastOverlay().diverged, []);
    assert.equal(codeLab._graph.lastState().commits.size, 2);

    // the runtime's own output and an English status line reached the terminal
    assert.match(codeLab._terminal.text(), /add readme/);
    assert.equal(codeLab._terminal.lines[codeLab._terminal.lines.length - 1].kind, "good");

    // and the core did its half
    assert.equal(xpNow(), 20, "core awarded XP on pass");
    const result = dom.getElementById("gtResult");
    assert.equal(result.hidden, false);
    assert.equal(result.classList.contains("is-pass"), true);
  });
});

test("an off-plan commit blocks the pass and the message points at Reset", async () => {
  await withDom("gt", async (dom, codeLab) => {
    const controller = LessonEngine.create(gitConfig());
    await controller.boot();

    codeLab._terminal.type('git commit -m "oops"');

    assert.equal(xpNow(), 0, "an off-plan commit must not pass the card");
    const result = dom.getElementById("gtResult");
    assert.equal(result.classList.contains("is-fail"), true);
    const body = dom.getElementById("gtResultBody").textContent;
    assert.match(body, /not part of this exercise/);
    assert.match(body, /Reset/);
    // the graph flags it rather than ghosting it
    assert.equal(codeLab._graph.lastOverlay().diverged.length, 1);
  });
});

test("an unknown command reports the error without touching the repo", async () => {
  await withDom("gt", async (dom, codeLab) => {
    const controller = LessonEngine.create(gitConfig());
    await controller.boot();

    codeLab._terminal.type("git teleport");

    assert.equal(codeLab._terminal.lines[0].kind, "err");
    assert.match(codeLab._terminal.lines[0].text, /is not a git command/);
    assert.equal(codeLab._graph.lastState().commits.size, 2, "one commit plus its ghost, unchanged");
    assert.equal(xpNow(), 0);
  });
});

test("Reset restores the start state, clears the terminal and repaints", async () => {
  await withDom("gt", async (dom, codeLab) => {
    const controller = LessonEngine.create(gitConfig());
    await controller.boot();

    codeLab._terminal.type('git commit -m "oops"');
    const clearsBefore = codeLab._terminal.clears;
    const paintsBefore = codeLab._graph.setStates.length;

    dom.getElementById("gtReset").click();

    assert.equal(codeLab._terminal.clears, clearsBefore + 1, "scrollback wiped");
    assert.equal(codeLab._terminal.lines.length, 0);
    assert.equal(codeLab._graph.setStates.length, paintsBefore + 1, "graph repainted");
    assert.deepEqual(codeLab._graph.lastOverlay().diverged, [], "the off-plan commit is gone");
    const messages = [...codeLab._graph.lastState().commits.values()].map((c) => c.message);
    assert.deepEqual(messages, ["init", "add readme"], "back to the start state plus the next ghost");
    assert.equal(dom.getElementById("gtResult").hidden, true);
  });
});

test("Show solution writes the commands into the terminal and does not run them", async () => {
  await withDom("gt", async (dom, codeLab) => {
    const controller = LessonEngine.create(gitConfig());
    await controller.boot();
    const paintsBefore = codeLab._graph.setStates.length;

    dom.getElementById("gtSolution").click();

    assert.match(codeLab._terminal.text(), /git commit -m "add readme"/);
    assert.equal(codeLab._graph.setStates.length, paintsBefore, "nothing was run, so nothing repainted");
    assert.equal(xpNow(), 0, "no verdict is reported by showing the solution");
    assert.equal(dom.getElementById("gtResult").hidden, true);
  });
});

test("Show whole target ghosts every missing step, and toggles back", async () => {
  await withDom("gt", async (dom, codeLab) => {
    const cfg = gitConfig();
    // A two-step target, so "whole target" differs from "next step only".
    cfg.tasks[0].target = ['git commit -m "init"', 'git commit -m "add readme"', 'git commit -m "add tests"'];
    const controller = LessonEngine.create(cfg);
    await controller.boot();

    assert.equal(codeLab._graph.mounts[0].opts.ghost.length, 1, "next step only by default");

    // The plugin creates this button itself (no page-shell element owns it) and
    // appends it to the action row.
    const targetBtn = dom.getElementById("gtActions").children[0];
    assert.equal(targetBtn.id, "gtTarget");
    assert.equal(targetBtn.textContent, "Show whole target");

    targetBtn.click();
    assert.equal(codeLab._graph.lastOverlay().ghost.length, 2, "the whole target is ghosted");
    assert.equal(targetBtn.textContent, "Show next step only");

    targetBtn.click();
    assert.equal(codeLab._graph.lastOverlay().ghost.length, 1, "back to the next step only");
  });
});

test("moving to the next card re-initialises start state, target and terminal", async () => {
  await withDom("gt", async (dom, codeLab) => {
    const controller = LessonEngine.create(gitConfig());
    await controller.boot();

    codeLab._terminal.type('git commit -m "add readme"');
    const clearsBefore = codeLab._terminal.clears;

    dom.getElementById("gtNext").click();

    assert.equal(codeLab._terminal.clears, clearsBefore + 1, "the new card starts on an empty terminal");
    assert.equal(codeLab._terminal.lines.length, 0);
    // card 2 starts from ONE commit again, and its target adds a branch, not a commit
    const messages = [...codeLab._graph.lastState().commits.values()].map((c) => c.message);
    assert.deepEqual(messages, ["init"]);
    assert.deepEqual(codeLab._graph.lastOverlay().ghost, []);

    // and the new card grades against its OWN target
    codeLab._terminal.type("git branch fix");
    assert.equal(xpNow(), 40, "card 2 awarded on top of card 1");
  });
});

test("a missing CodeLab degrades with a console error instead of crashing", async () => {
  await withDom("gt", async (dom) => {
    const errors = [];
    const realError = console.error;
    console.error = (msg) => errors.push(String(msg));
    try {
      const controller = LessonEngine.create(gitConfig());
      await controller.boot();
      controller.setLocale();
    } finally {
      console.error = realError;
    }
    assert.ok(errors.some((e) => /git-plugin: needs CodeLab/.test(e)), "the missing collaborator is named");
    assert.equal(dom.getElementById("gtTitle").textContent, "Record a second commit", "core chrome still rendered");
  }, { noCodeLab: true });
});
