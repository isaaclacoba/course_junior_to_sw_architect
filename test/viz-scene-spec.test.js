"use strict";

// Unit test for tools/lib/viz-scene-spec.mjs - the shared scene key/path spec that
// resource/bind-viz.js mirrors and that both the seed tool and check-i18n depend
// on for a correct extract/bind round-trip. Drives extractSceneEntries on a
// synthetic viz covering every scene type; asserts the step-scoped keys/values and
// that code identifiers (tool names, the model core label) are excluded.
// Dependency-free: `node --test test/viz-scene-spec.test.js`.

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

let extractSceneEntries, SCENE_PROPS;

test.before(async () => {
  const mod = await import(pathToFileURL(path.join(__dirname, "..", "tools", "lib", "viz-scene-spec.mjs")));
  extractSceneEntries = mod.extractSceneEntries;
  SCENE_PROPS = mod.SCENE_PROPS;
});

function sampleViz() {
  return {
    steps: [
      { transcript: { caption: "Cap0", messages: [{ text: "T0", note: "N0" }, { text: "T1" }] } },
      { agent: { stripCaption: "SC", core: { label: "LLM", sub: "SUB" } } },
      { agentLoop: { goal: "G", think: "TH", ctx: ["c0", "c1"], chips: ["ch0"] } },
      { toolRack: { caption: "TRC", banner: "B", tools: [{ name: "getWeather", desc: "D0" }] } },
      { memoryShelf: { workingCaption: "WC", working: [{ text: "w0" }], stores: { semantic: [{ text: "s0" }] } } },
      { retrieval: { caption: "RC", query: "Q", docs: [{ text: "d0" }] } },
      { plan: { caption: "PC", goal: "PG", steps: [{ text: "p0", note: "pn0" }] } },
    ],
  };
}

test("SCENE_PROPS lists the seven AI scene types", () => {
  assert.deepEqual(
    [...SCENE_PROPS].sort(),
    ["agent", "agentLoop", "memoryShelf", "plan", "retrieval", "toolRack", "transcript"]
  );
});

test("extractSceneEntries pulls prose from every scene type with step-scoped keys", () => {
  const m = new Map(extractSceneEntries(sampleViz()));
  // transcript: caption + per-message text/note
  assert.equal(m.get("step.0.caption"), "Cap0");
  assert.equal(m.get("step.0.msg.0.text"), "T0");
  assert.equal(m.get("step.0.msg.0.note"), "N0");
  assert.equal(m.get("step.0.msg.1.text"), "T1");
  assert.ok(!m.has("step.0.msg.1.note"), "a message without a note yields no note key");
  // agent: core.sub yes
  assert.equal(m.get("step.1.stripCaption"), "SC");
  assert.equal(m.get("step.1.coreSub"), "SUB");
  // agentLoop: scalars + arrays
  assert.equal(m.get("step.2.goal"), "G");
  assert.equal(m.get("step.2.ctx.1"), "c1");
  assert.equal(m.get("step.2.chip.0"), "ch0");
  // toolRack: desc + banner
  assert.equal(m.get("step.3.tool.0.desc"), "D0");
  assert.equal(m.get("step.3.banner"), "B");
  // memoryShelf: working + store keyed by store name
  assert.equal(m.get("step.4.work.0"), "w0");
  assert.equal(m.get("step.4.store.semantic.0"), "s0");
  // retrieval + plan
  assert.equal(m.get("step.5.query"), "Q");
  assert.equal(m.get("step.6.pstep.0.note"), "pn0");
});

test("code identifiers are never extracted", () => {
  const values = extractSceneEntries(sampleViz()).map(([, v]) => v);
  assert.ok(!values.includes("getWeather"), "tool name (code identifier) is excluded");
  assert.ok(!values.includes("LLM"), "model core label is excluded");
});
