"use strict";

// Unit tests for kernel/page-shell/chrome-text.js - the tHtml/tAttr/tSlot markers
// a card template uses to emit localizable static chrome, plus repaintChrome.
//
// The contract worth pinning down is the two-mode behaviour. With NO catalog
// (every non-i18n page) the helpers must emit the plain English literal and no
// markers at all, so the generated markup stays byte-identical to what it was
// before i18n existed. With a catalog active they emit data-t markers so a live
// language swap can re-localize in place.

const test = require("node:test");
const assert = require("node:assert/strict");

const chrome = require("../kernel/page-shell/chrome-text.js");

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

function withCatalog(catalog, fn) {
  return withGlobal("window", { ChromeText: catalog }, fn);
}

// A fake document with just the one API repaintChrome uses.
function fakeDoc(nodes) {
  return {
    querySelectorAll(sel) {
      assert.equal(sel, "[data-t]");
      return nodes;
    },
  };
}

function fakeNode(key, text) {
  return {
    textContent: text,
    getAttribute(name) {
      return name === "data-t" ? key : null;
    },
  };
}

test("the module loads with no browser globals", () => {
  assert.equal(typeof chrome.tHtml, "function");
  assert.equal(typeof chrome.tAttr, "function");
  assert.equal(typeof chrome.tSlot, "function");
  assert.equal(typeof chrome.repaintChrome, "function");
});

test("with no catalog the helpers emit plain English and no markers", () => {
  assert.equal(chrome.tAttr("card.goal"), "");
  assert.equal(chrome.tHtml("card.goal", "Goal"), "Goal");
  assert.equal(chrome.tSlot("card.expected", "Expected output:"), "Expected output:");
});

test("an empty window with no ChromeText still counts as no catalog", () => {
  withGlobal("window", {}, () => {
    assert.equal(chrome.tAttr("card.goal"), "");
    assert.equal(chrome.tSlot("card.goal", "Goal"), "Goal");
  });
});

test("with a catalog tAttr emits the data-t marker", () => {
  withCatalog({ "card.goal": "Objetivo" }, () => {
    assert.equal(chrome.tAttr("card.goal"), ' data-t="card.goal"');
  });
});

test("with a catalog tAttr marks a key even when it is untranslated", () => {
  withCatalog({ "card.goal": "Objetivo" }, () => {
    assert.equal(chrome.tAttr("nav.next"), ' data-t="nav.next"');
  });
});

test("tHtml returns the localized string", () => {
  withCatalog({ "nav.run": "Ejecutar" }, () => {
    assert.equal(chrome.tHtml("nav.run", "Run"), "Ejecutar");
  });
});

test("tHtml escapes the English fallback", () => {
  assert.equal(chrome.tHtml("x", "a < b & c"), "a &lt; b &amp; c");
});

test("tHtml escapes a translation too, so a catalog cannot inject markup", () => {
  withCatalog({ "nav.run": '<img src=x onerror="boom">' }, () => {
    assert.equal(chrome.tHtml("nav.run", "Run"), '&lt;img src=x onerror="boom"&gt;');
  });
});

test("tSlot wraps in a marked span when a catalog is active", () => {
  withCatalog({ "card.expected": "Salida esperada:" }, () => {
    assert.equal(
      chrome.tSlot("card.expected", "Expected output:"),
      '<span data-t="card.expected">Salida esperada:</span>',
    );
  });
});

test("tSlot escapes the English literal when no catalog is active", () => {
  assert.equal(chrome.tSlot("x", "a < b"), "a &lt; b");
});

test("repaintChrome is a no-op when there is no document", () => {
  assert.doesNotThrow(() => chrome.repaintChrome());
});

test("repaintChrome rewrites every marked node from the catalog", () => {
  const nodes = [fakeNode("nav.run", "Run"), fakeNode("nav.next", "Next")];
  withCatalog({ "nav.run": "Ejecutar", "nav.next": "Siguiente" }, () => {
    withGlobal("document", fakeDoc(nodes), () => chrome.repaintChrome());
  });
  assert.equal(nodes[0].textContent, "Ejecutar");
  assert.equal(nodes[1].textContent, "Siguiente");
});

test("repaintChrome leaves a node untouched when the catalog lacks its key", () => {
  const nodes = [fakeNode("nav.run", "Run"), fakeNode("nav.next", "Next")];
  withCatalog({ "nav.run": "Ejecutar" }, () => {
    withGlobal("document", fakeDoc(nodes), () => chrome.repaintChrome());
  });
  assert.equal(nodes[0].textContent, "Ejecutar");
  assert.equal(nodes[1].textContent, "Next");
});

test("repaintChrome back to English restores the literals it finds in place", () => {
  const nodes = [fakeNode("nav.run", "Ejecutar")];
  withCatalog({ "nav.run": "Run" }, () => {
    withGlobal("document", fakeDoc(nodes), () => chrome.repaintChrome());
  });
  assert.equal(nodes[0].textContent, "Run");
});
