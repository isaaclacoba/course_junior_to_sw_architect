"use strict";

// Round-trip tests for the resource binders. The bug they lock: the default
// (English) prose lives INLINE in the data file, not in a bundle, so switching to
// a translated language overwrites it - and switching BACK must restore the inline
// original rather than leave the last translation in place. Each binder snapshots
// the inline value on first bind (bindLeaf) to make the round-trip work.
// Dependency-free: `node --test test/`.

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function loadBinder(file, globalName) {
  const sandbox = { window: {}, WeakMap };
  const ctx = vm.createContext(sandbox);
  // The binders delegate snapshot/restore + collect/hero to window.ResourceOrigin
  // (resource/bind-origin.js), which the controllers load before the first bind.
  const origin = fs.readFileSync(path.join(__dirname, "..", "resource", "bind-origin.js"), "utf8");
  vm.runInContext(origin, ctx);
  const src = fs.readFileSync(path.join(__dirname, "..", "resource", file), "utf8");
  vm.runInContext(src, ctx);
  return sandbox.window[globalName];
}

// A fake resolver: get(key) returns the mapped value, or undefined for a gap.
function fakeR(map) {
  return { get: (k) => (Object.prototype.hasOwnProperty.call(map, k) ? map[k] : undefined) };
}

const plain = (v) => JSON.parse(JSON.stringify(v));

test("bind-viz: en -> es -> en restores the inline English scene prose", () => {
  const bind = loadBinder("bind-viz.js", "ResourceBindViz");
  const page = { hero: { title: "English title", intro: ["English intro"] } };
  const viz = {
    legend: [{ label: "English label" }],
    steps: [{
      narr: "English narration",
      transcript: { caption: "English caption", messages: [{ text: "English message" }] },
    }],
  };
  const ctx = { page, viz };

  const es = fakeR({
    "hero.title": "Titulo espanol",
    "intro.0": "Intro espanol",
    "legend.0": "Etiqueta espanol",
    "step.0.narr": "Narracion espanol",
    "step.0.caption": "Titulo espanol",
    "step.0.msg.0.text": "Mensaje espanol",
  });
  const en = fakeR({}); // the default language has no bundle keys - text is inline

  // First load in English: inline text is kept untouched.
  bind.apply(en, ctx);
  assert.equal(page.hero.title, "English title");
  assert.equal(viz.steps[0].narr, "English narration");
  assert.equal(viz.steps[0].transcript.messages[0].text, "English message");

  // Switch to Spanish: every leaf is translated.
  bind.apply(es, ctx);
  assert.equal(page.hero.title, "Titulo espanol");
  assert.deepEqual(plain(page.hero.intro), ["Intro espanol"]);
  assert.equal(viz.legend[0].label, "Etiqueta espanol");
  assert.equal(viz.steps[0].narr, "Narracion espanol");
  assert.equal(viz.steps[0].transcript.caption, "Titulo espanol");
  assert.equal(viz.steps[0].transcript.messages[0].text, "Mensaje espanol");

  // Switch back to English: the inline originals are restored (the bug fix).
  bind.apply(en, ctx);
  assert.equal(page.hero.title, "English title");
  assert.deepEqual(plain(page.hero.intro), ["English intro"]);
  assert.equal(viz.legend[0].label, "English label");
  assert.equal(viz.steps[0].narr, "English narration");
  assert.equal(viz.steps[0].transcript.caption, "English caption");
  assert.equal(viz.steps[0].transcript.messages[0].text, "English message");
});

test("bind-checkpoint: en -> es -> en restores the inline English quiz prose", () => {
  const bind = loadBinder("bind-checkpoint.js", "ResourceBindCheckpoint");
  const page = { hero: { title: "English title" } };
  const quiz = {
    title: "English quiz",
    questions: [{ stem: "English stem", options: ["English A", "English B"] }],
  };
  const ctx = { page, quiz };

  const es = fakeR({
    "hero.title": "Titulo espanol",
    "quiz.title": "Cuestionario espanol",
    "question.1.stem": "Enunciado espanol",
    "question.1.option.0": "Opcion A espanol",
    "question.1.option.1": "Opcion B espanol",
  });
  const en = fakeR({});

  bind.apply(es, ctx);
  assert.equal(quiz.title, "Cuestionario espanol");
  assert.equal(quiz.questions[0].stem, "Enunciado espanol");
  assert.deepEqual(plain(quiz.questions[0].options), ["Opcion A espanol", "Opcion B espanol"]);

  bind.apply(en, ctx);
  assert.equal(page.hero.title, "English title");
  assert.equal(quiz.title, "English quiz");
  assert.equal(quiz.questions[0].stem, "English stem");
  assert.deepEqual(plain(quiz.questions[0].options), ["English A", "English B"]);
});

test("bind-build: en -> es -> en restores the inline English hero", () => {
  const bind = loadBinder("bind-build.js", "ResourceBindBuild");
  const page = { hero: { title: "English title", intro: ["English intro"] } };
  const config = { tasks: [] };
  const ctx = { page, config };

  bind.apply(fakeR({ "hero.title": "Titulo espanol", "intro.0": "Intro espanol" }), ctx);
  assert.equal(page.hero.title, "Titulo espanol");
  assert.deepEqual(plain(page.hero.intro), ["Intro espanol"]);

  bind.apply(fakeR({}), ctx);
  assert.equal(page.hero.title, "English title");
  assert.deepEqual(plain(page.hero.intro), ["English intro"]);
});
