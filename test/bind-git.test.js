"use strict";

// Unit tests for resource/bind-git.js - the GIT lesson key schema (intro.N,
// task.N.title/concept/context/goal.i and the recap's summary* fields).
//
// The load-bearing test is the mechanics one: a git task's `start`, `target` and
// `solution` are real git command lists that get replayed to build the graded
// RepoStates. If a binder ever writes them, the exercise breaks silently, so this
// file locks that they come out of apply() byte-identical.
//
// Dependency-free: `node --test test/`.

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function loadBindGit() {
  const sandbox = { window: {}, WeakMap };
  const ctx = vm.createContext(sandbox);
  const origin = fs.readFileSync(path.join(__dirname, "..", "resource", "bind-origin.js"), "utf8");
  vm.runInContext(origin, ctx);
  const src = fs.readFileSync(path.join(__dirname, "..", "resource", "bind-git.js"), "utf8");
  vm.runInContext(src, ctx);
  return sandbox.window.ResourceBindGit;
}

// A fake resolver: get(key) returns the mapped value, or undefined for a gap.
function fakeR(map) {
  return {
    get(k) {
      return Object.prototype.hasOwnProperty.call(map, k) ? map[k] : undefined;
    },
  };
}

// bind-git runs in a vm realm, so its arrays/objects have a different
// Array/Object prototype than this test realm; normalise before a strict compare.
const plain = (v) => JSON.parse(JSON.stringify(v));

// A realistic git task: prose plus the three mechanical command lists.
function gitTask(over) {
  return Object.assign({
    title: "inlined title",
    concept: "inlined concept",
    context: "inlined context",
    goal: ["inlined goal"],
    start: ['git commit -m "init"'],
    target: ['git commit -m "init"', "git branch fix"],
    solution: ["git branch fix"],
  }, over);
}

test("apply maps task prose (title/concept/context/goal) onto LESSON_CONFIG.tasks", () => {
  const bind = loadBindGit();
  const R = fakeR({
    "task.1.title": "T1", "task.1.concept": "C1", "task.1.context": "X1",
    "task.1.goal.0": "g1a", "task.1.goal.1": "g1b",
    "task.2.title": "T2", "task.2.concept": "C2", "task.2.context": "X2",
    "task.2.goal.0": "g2a",
  });
  const config = { tasks: [gitTask(), gitTask()] };
  bind.apply(R, { page: {}, config });
  assert.equal(config.tasks[0].title, "T1");
  assert.equal(config.tasks[0].concept, "C1");
  assert.equal(config.tasks[0].context, "X1");
  assert.deepEqual(plain(config.tasks[0].goal), ["g1a", "g1b"]);
  assert.equal(config.tasks[1].title, "T2");
  assert.deepEqual(plain(config.tasks[1].goal), ["g2a"]);
});

test("apply leaves the git mechanics (start/target/solution) untouched", () => {
  const bind = loadBindGit();
  // A resolver that would happily answer a mechanics key, if one were ever asked
  // for. Nothing may pick these up.
  const R = fakeR({
    "task.1.title": "T1",
    "task.1.start.0": "git checkout -b TRANSLATED",
    "task.1.target.0": "git commit -m TRANSLATED",
    "task.1.solution.0": "git branch TRANSLATED",
    "task.1.commands.0": "TRANSLATED",
    "task.1.targetCommands.0": "TRANSLATED",
    "prefix": "TRANSLATED",
  });
  const config = { prefix: "gp", tasks: [gitTask()] };
  const before = plain({
    start: config.tasks[0].start,
    target: config.tasks[0].target,
    solution: config.tasks[0].solution,
    prefix: config.prefix,
  });

  bind.apply(R, { page: {}, config });

  assert.deepEqual(plain(config.tasks[0].start), before.start);
  assert.deepEqual(plain(config.tasks[0].target), before.target);
  assert.deepEqual(plain(config.tasks[0].solution), before.solution);
  assert.equal(config.prefix, before.prefix);
  // and the prose it DOES own still moved, so the test is not vacuous
  assert.equal(config.tasks[0].title, "T1");
});

test("apply writes no field outside the prose schema", () => {
  const bind = loadBindGit();
  const config = { tasks: [gitTask({ summary: false })] };
  bind.apply(fakeR({}), { page: {}, config });
  const written = ["title", "concept", "context", "goal"];
  const mechanics = ["start", "target", "solution"];
  assert.deepEqual(
    Object.keys(config.tasks[0]).sort(),
    written.concat(mechanics, ["summary"]).sort(),
    "apply must not invent keys on a task"
  );
});

test("apply coerces missing task fields to empty string, never undefined", () => {
  const bind = loadBindGit();
  const config = { tasks: [gitTask()] };
  bind.apply(fakeR({}), { page: {}, config });
  assert.equal(config.tasks[0].title, "");
  assert.equal(config.tasks[0].concept, "");
  assert.equal(config.tasks[0].context, "");
  assert.deepEqual(plain(config.tasks[0].goal), []);
});

test("apply maps summary prose only for a summary task", () => {
  const bind = loadBindGit();
  const R = fakeR({
    "task.1.summaryIntro": "SI", "task.1.summaryClose": "SC",
    "task.1.summaryItems.0.title": "it0t", "task.1.summaryItems.0.text": "it0x",
    "task.1.summaryItems.1.title": "it1t", "task.1.summaryItems.1.text": "it1x",
    "task.2.summaryIntro": "nope",
  });
  const config = { tasks: [{ summary: true }, gitTask()] };
  bind.apply(R, { page: {}, config });
  assert.equal(config.tasks[0].summaryIntro, "SI");
  assert.equal(config.tasks[0].summaryClose, "SC");
  assert.deepEqual(plain(config.tasks[0].summaryItems), [
    { title: "it0t", text: "it0x" },
    { title: "it1t", text: "it1x" },
  ]);
  assert.equal(config.tasks[1].summaryIntro, undefined, "a practice card gets no recap prose");
});

test("apply overrides hero.intro only when a voice supplies intro.N", () => {
  const bind = loadBindGit();
  const kept = { hero: { intro: ["inlined"] } };
  bind.apply(fakeR({}), { page: kept, config: { tasks: [] } });
  assert.deepEqual(plain(kept.hero.intro), ["inlined"]);

  const voiced = { hero: { intro: ["inlined"] } };
  bind.apply(fakeR({ "intro.0": "voiced a", "intro.1": "voiced b" }), { page: voiced, config: { tasks: [] } });
  assert.deepEqual(plain(voiced.hero.intro), ["voiced a", "voiced b"]);
});

test("apply restores the inlined hero when a later selection has no intro keys", () => {
  const bind = loadBindGit();
  const page = { hero: { intro: ["inlined"] } };
  bind.apply(fakeR({ "intro.0": "voiced" }), { page, config: { tasks: [] } });
  assert.deepEqual(plain(page.hero.intro), ["voiced"]);
  bind.apply(fakeR({}), { page, config: { tasks: [] } });
  assert.deepEqual(plain(page.hero.intro), ["inlined"], "switching back must not stick");
});

test("apply is a no-op with a missing resolver, ctx or tasks array", () => {
  const bind = loadBindGit();
  assert.doesNotThrow(() => bind.apply(null, { page: {}, config: { tasks: [] } }));
  assert.doesNotThrow(() => bind.apply(fakeR({}), null));
  assert.doesNotThrow(() => bind.apply(fakeR({}), { page: {}, config: {} }));
});

test("the kernel controller dispatches the git archetype to ResourceBindGit", () => {
  const src = fs.readFileSync(
    path.join(__dirname, "..", "resource", "kernel-controller.js"), "utf8"
  );
  assert.match(src, /arch === "git" && global\.ResourceBindGit/);
  assert.match(src, /global\.ResourceBindGit\.apply\(R, \{ page: global\.PAGE, config: cfg \}\)/);
});

test("the generator loads bind-git on a git page and leaves the other tails alone", async () => {
  const { ARCHETYPE_RENDER } = await import(
    path.join(__dirname, "..", "tools", "generate.mjs")
  );
  // The tail rewrite is reachable through the registry, so this drives the real
  // code path the renderer uses - not just the declaration.
  const staticTail =
    '    <script src="../../../../page-shell.js"></script>\n' +
    '    <script src="data.js"></script>';
  const render = (key) =>
    ARCHETYPE_RENDER[key].resourceTail(
      staticTail, { langs: ["en", "es"] }, "fake-" + key,
      "kernel-controller", ARCHETYPE_RENDER[key].binder
    );

  const git = render("git");
  assert.match(git, /resource\/bind-git\.js/);
  assert.doesNotMatch(git, /resource\/bind-build\.js/, "a git page must not load the build binder");

  // build and drill share the same tail function; they must keep taking its
  // bind-build default, or every existing generated page would drift.
  ["build", "drill"].forEach((k) => {
    const out = render(k);
    assert.match(out, /resource\/bind-build\.js/, k + " keeps bind-build");
    assert.doesNotMatch(out, /resource\/bind-git\.js/, k + " must not load bind-git");
  });
});

test("a file's contents localize, but its path does not", () => {
  const bind = loadBindGit();
  const cfg = {
    tasks: [gitTask({
      files: [{ path: "cat.txt", text: "Mia, tabby, 4 years old." }, "bare.txt"],
    })],
  };
  bind.apply(fakeR({ "task.1.files.0.text": "Mia, atigrada, 4 anos." }), { config: cfg });

  assert.equal(plain(cfg.tasks[0].files[0]).path, "cat.txt", "a path is a git argument - never translated");
  assert.equal(plain(cfg.tasks[0].files[0]).text, "Mia, atigrada, 4 anos.");
  assert.equal(cfg.tasks[0].files[1], "bare.txt", "a bare path entry is left alone");
});

test("a file with no text key keeps what the data file inlined", () => {
  const bind = loadBindGit();
  const cfg = { tasks: [gitTask({ files: [{ path: "cat.txt", text: "the original" }] })] };
  bind.apply(fakeR({}), { config: cfg });
  assert.equal(plain(cfg.tasks[0].files[0]).text, "the original", "apply-if-present, not overwrite-with-empty");
});

test("localizing contents never touches the command lists", () => {
  const bind = loadBindGit();
  const cfg = { tasks: [gitTask({ files: [{ path: "cat.txt", text: "before" }] })] };
  bind.apply(fakeR({ "task.1.files.0.text": "despues" }), { config: cfg });
  assert.deepEqual(plain(cfg.tasks[0].solution), ["git branch fix"], "solution stays English");
  assert.deepEqual(plain(cfg.tasks[0].target), ['git commit -m "init"', "git branch fix"]);
});
