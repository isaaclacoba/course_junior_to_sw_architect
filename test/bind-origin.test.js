"use strict";

// Unit tests for resource/bind-origin.js - the single home of the snapshot/restore
// pattern (window.ResourceOrigin) the binders and page-shell share. It locks the
// three behaviours the "language switch gets stuck" fix depends on: snapshot the
// inline value once, write a resolved value, restore the snapshot on a gap, and
// never create a key that had neither. Dependency-free: `node --test test/`.

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function loadOrigin() {
  const sandbox = { window: {}, WeakMap };
  const ctx = vm.createContext(sandbox);
  const src = fs.readFileSync(path.join(__dirname, "..", "resource", "bind-origin.js"), "utf8");
  vm.runInContext(src, ctx);
  return sandbox.window.ResourceOrigin;
}

const fakeR = (map) => ({ get: (k) => (Object.prototype.hasOwnProperty.call(map, k) ? map[k] : undefined) });

// bind-origin runs in a vm realm, so its arrays have a different Array prototype
// than this test realm; normalise before a strict compare.
const plain = (v) => JSON.parse(JSON.stringify(v));

test("bind: resolved -> restore round-trips the inline value", () => {
  const O = loadOrigin();
  const obj = { title: "inline" };
  O.bind(obj, "title", "translated");
  assert.equal(obj.title, "translated");
  O.bind(obj, "title", undefined); // gap -> restore snapshot
  assert.equal(obj.title, "inline");
});

test("bind: snapshot is taken once, not overwritten by a later value", () => {
  const O = loadOrigin();
  const obj = { title: "inline" };
  O.bind(obj, "title", "es");
  O.bind(obj, "title", "fr"); // snapshot stays "inline", not "es"
  O.bind(obj, "title", undefined);
  assert.equal(obj.title, "inline");
});

test("bind: a key that had neither value is never created", () => {
  const O = loadOrigin();
  const obj = {};
  O.bind(obj, "missing", undefined);
  assert.equal("missing" in obj, false);
});

test("bind: a null container is a no-op", () => {
  const O = loadOrigin();
  assert.doesNotThrow(() => O.bind(null, "x", "y"));
});

test("collect: gathers an indexed run and stops at the first gap", () => {
  const O = loadOrigin();
  const R = fakeR({ "g.0": "a", "g.1": "b", "g.3": "d" });
  assert.deepEqual(plain(O.collect(R, "g.")), ["a", "b"]);
  assert.deepEqual(plain(O.collect(R, "none.")), []);
});

test("hero: binds title/eyebrow/intro and round-trips back to inline", () => {
  const O = loadOrigin();
  const h = { title: "English", eyebrow: "Eyebrow EN", intro: ["Intro EN"] };
  O.hero(h, fakeR({ "hero.title": "Titulo", "hero.eyebrow": "Ceja", "intro.0": "Intro ES" }));
  assert.equal(h.title, "Titulo");
  assert.equal(h.eyebrow, "Ceja");
  assert.deepEqual(plain(h.intro), ["Intro ES"]);
  O.hero(h, fakeR({})); // default language: no keys -> restore inline
  assert.equal(h.title, "English");
  assert.equal(h.eyebrow, "Eyebrow EN");
  assert.deepEqual(plain(h.intro), ["Intro EN"]);
});
