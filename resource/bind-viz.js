/*
 * resource/bind-viz.js - bind resolved strings onto a VIZ lesson's globals.
 *
 * The viz counterpart of resource/bind-build.js. It knows the viz key schema
 * (intro.N, hero.title/eyebrow, legend.i, step.i.narr) and writes the resolved
 * strings onto window.PAGE (hero) and window.LESSON_VIZ (legend labels + step
 * narrations) before page-shell.js mounts the MemoryViz visual.
 *
 * Apply-if-present: a key is only overridden when the resolved bundle supplies
 * it, so a default (English) page with no bundle keys keeps its inlined viz.js
 * text unchanged. Only a non-default lang/voice bundle (e.g. es) carries the
 * translated narrations, so the visual swaps language without touching data.
 */
(function (global) {
  "use strict";

  // Snapshot/restore (bindLeaf), indexed-run collection and the hero mapping live
  // in resource/bind-origin.js (window.ResourceOrigin), which the controllers load
  // before the first bind. bindLeaf here just forwards to it (resolved lazily, as
  // the shared module is injected after this script tag parses).
  function bindLeaf(obj, key, resolved) {
    global.ResourceOrigin.bind(obj, key, resolved);
  }

  // The scene panel a step carries (exactly one). Its human-readable prose lives
  // in the step's scene object and is NOT part of the narration - so it needs its
  // own localization pass. Code identifiers (tool/param names, the emitted call)
  // and structural fields (role, state, score) are deliberately excluded.
  var SCENE_PROPS = ["transcript", "agent", "agentLoop", "toolRack", "memoryShelf", "retrieval", "plan"];

  // For a scene of `type`, list [keySuffix, path] pairs: the res key is
  // "step.<i>.<keySuffix>" and `path` locates the string inside the scene.
  function sceneLeaves(type, sc) {
    var out = [];
    function push(suffix, path) { out.push([suffix, path]); }
    if (type === "transcript") {
      push("caption", ["caption"]);
      (sc.messages || []).forEach(function (m, j) {
        push("msg." + j + ".text", ["messages", j, "text"]);
        push("msg." + j + ".note", ["messages", j, "note"]);
      });
    } else if (type === "agent") {
      push("stripCaption", ["stripCaption"]);
      push("coreSub", ["core", "sub"]);
    } else if (type === "agentLoop") {
      push("goal", ["goal"]);
      push("think", ["think"]);
      (sc.ctx || []).forEach(function (_, j) { push("ctx." + j, ["ctx", j]); });
      (sc.chips || []).forEach(function (_, j) { push("chip." + j, ["chips", j]); });
    } else if (type === "toolRack") {
      push("caption", ["caption"]);
      push("banner", ["banner"]);
      (sc.tools || []).forEach(function (_, j) { push("tool." + j + ".desc", ["tools", j, "desc"]); });
    } else if (type === "memoryShelf") {
      push("caption", ["caption"]);
      push("workingCaption", ["workingCaption"]);
      (sc.working || []).forEach(function (_, j) { push("work." + j, ["working", j, "text"]); });
      var stores = sc.stores || {};
      Object.keys(stores).forEach(function (k) {
        (stores[k] || []).forEach(function (_, j) { push("store." + k + "." + j, ["stores", k, j, "text"]); });
      });
    } else if (type === "retrieval") {
      push("caption", ["caption"]);
      push("query", ["query"]);
      (sc.docs || []).forEach(function (_, j) { push("doc." + j, ["docs", j, "text"]); });
    } else if (type === "plan") {
      push("caption", ["caption"]);
      push("goal", ["goal"]);
      (sc.steps || []).forEach(function (_, j) {
        push("pstep." + j + ".text", ["steps", j, "text"]);
        push("pstep." + j + ".note", ["steps", j, "note"]);
      });
    }
    return out;
  }

  function getPath(obj, path) {
    var cur = obj;
    for (var i = 0; i < path.length; i++) {
      if (cur == null) return undefined;
      cur = cur[path[i]];
    }
    return cur;
  }

  // Bind a step's scene prose: resolved string when present, else the inline
  // original (bindLeaf snapshots it once, so a language round-trip restores it). A
  // leaf whose container is absent is skipped.
  function applySceneText(step, i, R) {
    for (var p = 0; p < SCENE_PROPS.length; p++) {
      var sc = step[SCENE_PROPS[p]];
      if (!sc) continue;
      sceneLeaves(SCENE_PROPS[p], sc).forEach(function (pair) {
        var path = pair[1];
        var container = getPath(sc, path.slice(0, path.length - 1));
        bindLeaf(container, path[path.length - 1], R.get("step." + i + "." + pair[0]));
      });
      return; // one scene per step
    }
  }

  function applyViz(viz, R) {
    if (!viz) return;
    if (Array.isArray(viz.legend)) {
      viz.legend.forEach(function (item, i) {
        if (item) bindLeaf(item, "label", R.get("legend." + i));
      });
    }
    if (Array.isArray(viz.steps)) {
      viz.steps.forEach(function (step, i) {
        if (!step) return;
        bindLeaf(step, "narr", R.get("step." + i + ".narr"));
        applySceneText(step, i, R);
      });
    }
  }

  // R: the resolver/manager (has get). ctx: { page, viz } lesson globals.
  function apply(R, ctx) {
    if (!R || !ctx) return;
    global.ResourceOrigin.hero(ctx.page && ctx.page.hero, R);
    applyViz(ctx.viz, R);
  }

  global.ResourceBindViz = { apply: apply };
})(typeof window !== "undefined" ? window : this);
