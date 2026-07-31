/*
 * resource/concept-i18n.js - pure, DOM-free adapter that resolves a concept's
 * term/def for the active voice+language.
 *
 * Fallback per field, resolved independently (see docs/architecture/concept-i18n.md
 * sections 3 and 4.3):
 *   overlays[voice][id].field -> overlays["default"][id].field -> base[id].field -> terminal
 * where terminal is the id for `term` and "" for `def`. `term` and `def` fall back
 * on their own, so a kept-English term (overlay omits `.term`) resolves to the base
 * term while its translated `.def` is used.
 *
 * No kernel, LESSON_META, DOM, or fetch dependency: it runs on the bare glossary
 * page and inside lessons alike. When `overlays` is empty (the English path) every
 * value comes from `base`, byte-identical to reading `base` directly.
 */
(function (global) {
  "use strict";

  function create(opts) {
    var o = opts || {};
    var overlays = o.overlays || {};
    var base = o.base || {};
    var selection = o.selection || {};
    var voice = selection.voice || "default";

    // The first defined `field` walking voice overlay -> default overlay -> base.
    function pick(id, field) {
      var vo = overlays[voice];
      if (vo && vo[id] && vo[id][field] != null) return vo[id][field];
      var db = overlays["default"];
      if (db && db[id] && db[id][field] != null) return db[id][field];
      var b = base[id];
      if (b && b[field] != null) return b[field];
      return undefined;
    }

    function term(id) {
      var t = pick(id, "term");
      return t != null ? t : id;
    }

    function def(id) {
      var d = pick(id, "def");
      return d != null ? d : "";
    }

    function ids() {
      return Object.keys(base);
    }

    function search(id) {
      return (term(id) + " " + def(id) + " " + id).toLowerCase();
    }

    return { term: term, def: def, ids: ids, search: search };
  }

  global.ConceptI18n = { create: create };
})(typeof window !== "undefined" ? window : this);
