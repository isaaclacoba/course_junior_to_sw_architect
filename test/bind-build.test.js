"use strict";

// Unit tests for resource/bind-build.js - the single home of the BUILD lesson
// key schema (intro.N, task.N.title/concept/context/goal.i, and the recap's
// summary* fields). Both the reload bootstrap and the kernel controller depend on
// this mapping, so it is worth locking. Dependency-free: `node --test test/`.

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function loadBindBuild() {
  const sandbox = { window: {}, WeakMap };
  const ctx = vm.createContext(sandbox);
  const origin = fs.readFileSync(path.join(__dirname, "..", "resource", "bind-origin.js"), "utf8");
  vm.runInContext(origin, ctx);
  const src = fs.readFileSync(path.join(__dirname, "..", "resource", "bind-build.js"), "utf8");
  vm.runInContext(src, ctx);
  return sandbox.window.ResourceBindBuild;
}

// A fake resolver: get(key) returns the mapped value, or undefined for a gap.
function fakeR(map) {
  return {
    get(k) {
      return Object.prototype.hasOwnProperty.call(map, k) ? map[k] : undefined;
    },
  };
}

// bind-build runs in a vm realm, so its arrays/objects have a different
// Array/Object prototype than this test realm; normalise before a strict compare.
const plain = (v) => JSON.parse(JSON.stringify(v));

test("apply maps task prose (title/concept/context/goal) onto BUILD_CONFIG.tasks", () => {
  const bind = loadBindBuild();
  const R = fakeR({
    "task.1.title": "T1", "task.1.concept": "C1", "task.1.context": "X1",
    "task.1.goal.0": "g1a", "task.1.goal.1": "g1b",
    "task.2.title": "T2", "task.2.concept": "C2", "task.2.context": "X2",
    "task.2.goal.0": "g2a",
  });
  const config = { tasks: [{ starter: "a" }, { starter: "b" }] };
  bind.apply(R, { page: {}, config });
  assert.equal(config.tasks[0].title, "T1");
  assert.equal(config.tasks[0].concept, "C1");
  assert.equal(config.tasks[0].context, "X1");
  assert.deepEqual(plain(config.tasks[0].goal), ["g1a", "g1b"]);
  assert.equal(config.tasks[1].title, "T2");
  assert.deepEqual(plain(config.tasks[1].goal), ["g2a"]);
});

test("apply coerces missing task fields to empty string, never undefined", () => {
  const bind = loadBindBuild();
  const config = { tasks: [{ starter: "a" }] };
  bind.apply(fakeR({}), { page: {}, config });
  assert.equal(config.tasks[0].title, "");
  assert.equal(config.tasks[0].concept, "");
  assert.equal(config.tasks[0].context, "");
  assert.deepEqual(plain(config.tasks[0].goal), []);
});

test("apply maps summary prose only for a summary task", () => {
  const bind = loadBindBuild();
  const R = fakeR({
    "task.1.summaryIntro": "SI", "task.1.summaryClose": "SC",
    "task.1.summaryItems.0.title": "it0t", "task.1.summaryItems.0.text": "it0x",
    "task.1.summaryItems.1.title": "it1t", "task.1.summaryItems.1.text": "it1x",
  });
  const config = { tasks: [{ summary: true }] };
  bind.apply(R, { page: {}, config });
  assert.equal(config.tasks[0].summaryIntro, "SI");
  assert.equal(config.tasks[0].summaryClose, "SC");
  assert.deepEqual(plain(config.tasks[0].summaryItems), [
    { title: "it0t", text: "it0x" },
    { title: "it1t", text: "it1x" },
  ]);
});

test("apply overrides hero.intro only when a voice supplies intro.N", () => {
  const bind = loadBindBuild();
  const kept = { hero: { intro: ["inlined"] } };
  bind.apply(fakeR({}), { page: kept, config: { tasks: [] } });
  assert.deepEqual(plain(kept.hero.intro), ["inlined"]);

  const voiced = { hero: { intro: ["inlined"] } };
  bind.apply(fakeR({ "intro.0": "voiced a", "intro.1": "voiced b" }), { page: voiced, config: { tasks: [] } });
  assert.deepEqual(plain(voiced.hero.intro), ["voiced a", "voiced b"]);
});

test("apply is a no-op with a missing resolver or ctx", () => {
  const bind = loadBindBuild();
  assert.doesNotThrow(() => bind.apply(null, { page: {}, config: { tasks: [] } }));
  assert.doesNotThrow(() => bind.apply(fakeR({}), null));
});
