/*
 * resource/resolver.js - pure, DOM-free fallback resolver for localized strings.
 *
 * The fallback POLICY lives here in one place: `chain(selection)` is the ordered,
 * de-duplicated list of [voice, lang] bundles to try -
 *   (voice, lang) -> (default, lang) -> (voice, defaultLang) -> (default, defaultLang)
 * The loader (manager) asks `chain` which bundles a selection can reach, and the
 * resolver walks that same order to resolve a key, so there is a single source of
 * truth for the fallback. `get` returns undefined for an unknown key, so a caller
 * can leave the existing value in place.
 */
(function (global) {
  "use strict";

  // The ordered, de-duplicated [voice, lang] pairs a selection falls back through.
  function chain(selection) {
    var sel = selection || {};
    var voice = sel.voice || "default";
    var lang = sel.lang || "en";
    var dVoice = sel.defaultVoice || "default";
    var dLang = sel.defaultLang || "en";
    var pairs = [];
    function add(v, l) {
      for (var i = 0; i < pairs.length; i++) {
        if (pairs[i][0] === v && pairs[i][1] === l) return;
      }
      pairs.push([v, l]);
    }
    add(voice, lang);
    add(dVoice, lang);
    add(voice, dLang);
    add(dVoice, dLang);
    return pairs;
  }

  function create(bundles, selection) {
    var order = chain(selection).map(function (p) { return p[0] + "/" + p[1]; });

    function get(key) {
      for (var i = 0; i < order.length; i++) {
        var b = bundles[order[i]];
        if (b && Object.prototype.hasOwnProperty.call(b, key)) return b[key];
      }
      return undefined;
    }
    function has(key) {
      return get(key) !== undefined;
    }

    return { get: get, has: has, chain: order };
  }

  global.ResourceResolver = { create: create, chain: chain };
})(typeof window !== "undefined" ? window : this);
