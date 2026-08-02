/*
 * resource/bind-origin.js - the single home of the snapshot/restore pattern the
 * resource binders and page-shell's breadcrumb repaint share.
 *
 * The default (English) prose lives INLINE in a lesson's data file, not in a
 * bundle. Overwriting a leaf with a translation and later switching back would
 * find no bundle key to restore from, leaving the last translation stuck. `bind`
 * snapshots a leaf's inline value once (keyed by its container object), then
 * writes `resolved` when the bundle supplies it, else restores the snapshot. A
 * leaf with neither a translation nor an inline original is left untouched
 * (never created). This lived duplicated in each binder (and page-shell) and is
 * now here once, so the recurring "language switch gets stuck" bug has one home.
 *
 * The controllers (kernel-controller.js / bootstrap.js) inject this BEFORE the
 * first bind, so a generated page picks it up with no regeneration.
 */
(function (global) {
  "use strict";

  var origin = new WeakMap();

  // Snapshot obj[key] on first sight, then write `resolved` when defined, else
  // restore the snapshot. Never creates a key that had neither value.
  function bind(obj, key, resolved) {
    if (obj == null) return;
    var m = origin.get(obj);
    if (!m) { m = {}; origin.set(obj, m); }
    if (!(key in m)) m[key] = obj[key];
    if (resolved !== undefined) obj[key] = resolved;
    else if (m[key] !== undefined) obj[key] = m[key];
  }

  // Collect an indexed run "<prefix>0", "<prefix>1", ... until a gap.
  function collect(R, prefix) {
    var out = [];
    for (var i = 0; ; i++) {
      var v = R.get(prefix + i);
      if (v === undefined) break;
      out.push(v);
    }
    return out;
  }

  // The shared hero mapping: intro run + title + eyebrow. Apply-if-present, so a
  // default page with no hero.* keys keeps its inlined text and a round-trip back
  // to the default restores it.
  function hero(h, R) {
    if (!h) return;
    var intro = collect(R, "intro.");
    bind(h, "intro", intro.length ? intro : undefined);
    bind(h, "title", R.get("hero.title"));
    bind(h, "eyebrow", R.get("hero.eyebrow"));
  }

  global.ResourceOrigin = { bind: bind, collect: collect, hero: hero };
})(typeof window !== "undefined" ? window : this);
