"use strict";

// Unit tests for the shared lesson helpers - kernel/page-shell/lesson-common.js,
// exposed as window.LessonCommon in the browser. Dependency-free: run with
// `node --test test/`.
//
// The module is a UMD, so under Node it exports itself and these tests require()
// the unit under test directly rather than loading the whole generated page
// shell. The two browser globals it reads - location.hash and window.CodeLab -
// are read lazily inside the helpers, so a test can stand one up for the length
// of a single assertion.

const test = require("node:test");
const assert = require("node:assert/strict");

const LessonCommon = require("../kernel/page-shell/lesson-common.js");

// Stand up a browser global for one synchronous test body, then put the
// environment back exactly as it was - including "was not defined at all".
function withGlobal(name, value, fn) {
  const had = Object.prototype.hasOwnProperty.call(globalThis, name);
  const previous = globalThis[name];
  globalThis[name] = value;
  try {
    return fn();
  } finally {
    if (had) globalThis[name] = previous;
    else delete globalThis[name];
  }
}

function fakeEl() {
  const classes = new Set();
  return {
    hidden: true,
    textContent: "",
    classList: {
      toggle(cls, on) {
        if (on) classes.add(cls);
        else classes.delete(cls);
      },
      has(cls) {
        return classes.has(cls);
      },
    },
  };
}

test("the module loads with no browser globals and exposes the helpers", () => {
  assert.equal(typeof LessonCommon.escapeHtml, "function");
  assert.equal(typeof LessonCommon.renderInline, "function");
  assert.equal(typeof LessonCommon.cardFromHash, "function");
  assert.equal(typeof LessonCommon.t, "function");
});

test("escapeHtml escapes &, < and >", () => {
  assert.equal(LessonCommon.escapeHtml("a & b < c > d"), "a &amp; b &lt; c &gt; d");
});

test("escapeHtml coerces non-string input", () => {
  assert.equal(LessonCommon.escapeHtml(42), "42");
  assert.equal(LessonCommon.escapeHtml(null), "null");
});

test("renderInline wraps `backticks` in <code> and escapes inside", () => {
  assert.equal(LessonCommon.renderInline("use `a < b` here"), "use <code>a &lt; b</code> here");
});

test("renderInline wraps **bold** in <strong>", () => {
  assert.equal(LessonCommon.renderInline("this is **important** ok"), "this is <strong>important</strong> ok");
});

test("renderInline escapes plain text with no markup", () => {
  assert.equal(LessonCommon.renderInline("a < b & c"), "a &lt; b &amp; c");
});

test("renderInline handles empty and undefined input", () => {
  assert.equal(LessonCommon.renderInline(""), "");
  assert.equal(LessonCommon.renderInline(undefined), "");
});

test("cardFromHash returns 0 when the hash is absent", () => {
  withGlobal("location", { hash: "" }, () => {
    assert.equal(LessonCommon.cardFromHash(5), 0);
  });
});

test("cardFromHash maps #3 to zero-based index 2", () => {
  withGlobal("location", { hash: "#3" }, () => {
    assert.equal(LessonCommon.cardFromHash(5), 2);
  });
});

test("cardFromHash clamps above-range values to the last card", () => {
  withGlobal("location", { hash: "#99" }, () => {
    assert.equal(LessonCommon.cardFromHash(5), 4);
  });
});

test("cardFromHash clamps #0 to the first card", () => {
  withGlobal("location", { hash: "#0" }, () => {
    assert.equal(LessonCommon.cardFromHash(5), 0);
  });
});

test("memoryStorage stores, reads, and removes", () => {
  const s = LessonCommon.memoryStorage();
  assert.equal(s.getItem("k"), null);
  s.setItem("k", "v");
  assert.equal(s.getItem("k"), "v");
  s.removeItem("k");
  assert.equal(s.getItem("k"), null);
});

test("createProgress starts XP at 0 and accumulates through the store", () => {
  const store = LessonCommon.memoryStorage();
  const p = LessonCommon.createProgress({ storage: store, xpKey: "xp", awardedKey: "aw" });
  assert.equal(p.xp(), 0);
  assert.equal(p.addXP(25), 25);
  assert.equal(p.addXP(10), 35);
  assert.equal(store.getItem("xp"), "35");
});

test("createProgress tracks awarded cards and persists them", () => {
  const store = LessonCommon.memoryStorage();
  const p = LessonCommon.createProgress({ storage: store, xpKey: "xp", awardedKey: "aw" });
  assert.equal(p.isAwarded(0), false);
  p.markAwarded(0);
  assert.equal(p.isAwarded(0), true);
  assert.equal(p.isAwarded(1), false);
  assert.deepEqual(JSON.parse(store.getItem("aw")), { 0: true });
});

test("createProgress reads back existing state from the store", () => {
  const store = LessonCommon.memoryStorage();
  store.setItem("xp", "40");
  store.setItem("aw", JSON.stringify({ 2: true }));
  const p = LessonCommon.createProgress({ storage: store, xpKey: "xp", awardedKey: "aw" });
  assert.equal(p.xp(), 40);
  assert.equal(p.isAwarded(2), true);
});

test("createProgress uses the injected storage, leaving the default untouched", () => {
  const store = LessonCommon.memoryStorage();
  const p = LessonCommon.createProgress({ storage: store, xpKey: "xp", awardedKey: "aw" });
  p.addXP(5);
  assert.equal(store.getItem("xp"), "5");
  assert.equal(LessonCommon.storage.getItem("xp"), null);
});

test("LessonCommon.storage defaults to a working store", () => {
  assert.equal(typeof LessonCommon.storage.getItem, "function");
  assert.equal(typeof LessonCommon.storage.setItem, "function");
});

test("t returns the English fallback when no catalog is active", () => {
  assert.equal(LessonCommon.t("nav.run", "Run"), "Run");
});

test("t returns the localized string when the catalog has the key", () => {
  withGlobal("window", { ChromeText: { "nav.run": "Ejecutar" } }, () => {
    assert.equal(LessonCommon.t("nav.run", "Run"), "Ejecutar");
  });
});

test("t falls back per key, not per catalog", () => {
  withGlobal("window", { ChromeText: { "nav.run": "Ejecutar" } }, () => {
    assert.equal(LessonCommon.t("nav.next", "Next"), "Next");
  });
});

test("t ignores inherited Object keys rather than leaking them", () => {
  withGlobal("window", { ChromeText: {} }, () => {
    assert.equal(LessonCommon.t("toString", "Label"), "Label");
  });
});

test("createOutputPanel showOutput and hideOutput toggle the element", () => {
  const output = fakeEl();
  const panel = LessonCommon.createOutputPanel({ output, errors: null });
  panel.showOutput("hi", false);
  assert.equal(output.hidden, false);
  assert.equal(output.textContent, "hi");
  assert.equal(output.classList.has("is-error"), false);
  panel.showOutput("boom", true);
  assert.equal(output.classList.has("is-error"), true);
  panel.hideOutput();
  assert.equal(output.hidden, true);
  assert.equal(output.textContent, "");
});

test("createOutputPanel falls back to text output when code-lab is absent", () => {
  const output = fakeEl();
  const panel = LessonCommon.createOutputPanel({ output, errors: fakeEl() });
  const handled = panel.showErrors([{ friendly: "boom" }, { raw: "bang" }]);
  assert.equal(output.hidden, false);
  assert.equal(output.textContent, "boom\nbang");
  assert.equal(output.classList.has("is-error"), true);
  assert.equal(handled, true);
});

test("createOutputPanel uses the code-lab error panel when available", () => {
  const seen = [];
  const win = {
    CodeLab: {
      showErrorPanel: (el, list) => {
        seen.push(list);
        return list.length > 0;
      },
    },
  };
  withGlobal("window", win, () => {
    const output = fakeEl();
    const panel = LessonCommon.createOutputPanel({ output, errors: fakeEl() });
    const handled = panel.showErrors([{ friendly: "boom" }]);
    assert.equal(output.hidden, true);
    assert.equal(seen.length, 1);
    assert.equal(handled, true);
    panel.clearErrors();
    assert.equal(seen[1].length, 0);
  });
});

test("createOutputPanel tolerates a missing output element", () => {
  const panel = LessonCommon.createOutputPanel({});
  assert.doesNotThrow(() => panel.showOutput("x", false));
  assert.doesNotThrow(() => panel.hideOutput());
  assert.doesNotThrow(() => panel.clearErrors());
});
