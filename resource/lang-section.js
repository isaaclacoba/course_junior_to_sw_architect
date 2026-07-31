/*
 * resource/lang-section.js - the "Language" section for the Settings popover.
 *
 * Course adapter: data only, mirroring voice-section.js. It pairs a generic
 * preference (the persisted language choice) with the course's human labels and
 * returns a section descriptor the generic Settings popover renders. The labels
 * are course copy and live here, not in the reusable preference. Choosing a
 * language persists and reloads (via the preference), so onSelect needs no panel
 * refresh.
 */
(function (global) {
  "use strict";

  function t(key, fallback) {
    var C = (typeof window !== "undefined") && window.LessonCommon;
    return (C && typeof C.t === "function") ? C.t(key, fallback) : fallback;
  }

  var LABELS = {
    en: { key: "settings.langEn", label: "English" },
    es: { key: "settings.langEs", label: "Espa\u00f1ol" }
  };
  function labelFor(id) { return (LABELS[id] && t(LABELS[id].key, LABELS[id].label)) || id; }

  // Build the section from a preference; returns null when there is nothing to
  // choose (fewer than two languages), so the caller can omit it.
  function create(pref) {
    if (!pref || (pref.values || []).length < 2) return null;

    return {
      id: "language",
      title: t("settings.language", "Language"),
      options: function () {
        var active = pref.get();
        return pref.values.map(function (id) {
          return { id: id, label: labelFor(id), active: id === active };
        });
      },
      onSelect: function (id) { pref.set(id); }
    };
  }

  global.LangSection = { create: create };
})(typeof window !== "undefined" ? window : this);
