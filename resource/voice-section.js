/*
 * resource/voice-section.js - the "Reading voice" section for the Settings popover.
 *
 * Course adapter: data only. It pairs a generic preference (the persisted voice
 * choice) with the course's human labels and returns a section descriptor the
 * generic Settings popover renders. The labels are course copy and live here, not
 * in the reusable preference. Choosing a voice persists and reloads (via the
 * preference), so onSelect needs no panel refresh.
 */
(function (global) {
  "use strict";

  function t(key, fallback) {
    var C = (typeof window !== "undefined") && window.LessonCommon;
    return (C && typeof C.t === "function") ? C.t(key, fallback) : fallback;
  }

  var LABELS = {
    default: { key: "settings.voiceDefault", label: "Default", noteKey: "settings.voiceDefaultNote", note: "The standard course voice." },
    child: { key: "settings.voiceChild", label: "Young learners", noteKey: "settings.voiceChildNote", note: "Simple words, short sentences." },
    academic: { key: "settings.voiceAcademic", label: "Academic", noteKey: "settings.voiceAcademicNote", note: "Precise, formal wording." }
  };
  function labelFor(id) { return (LABELS[id] && t(LABELS[id].key, LABELS[id].label)) || id; }
  function noteFor(id) { return (LABELS[id] && t(LABELS[id].noteKey, LABELS[id].note)) || ""; }

  // Build the section from a preference; returns null when there is nothing to
  // choose (fewer than two voices), so the caller can omit it.
  function create(pref) {
    if (!pref || (pref.values || []).length < 2) return null;

    return {
      id: "voice",
      title: t("settings.voice", "Reading voice"),
      options: function () {
        var active = pref.get();
        return pref.values.map(function (id) {
          return { id: id, label: labelFor(id), note: noteFor(id), active: id === active };
        });
      },
      onSelect: function (id) { pref.set(id); }
    };
  }

  global.VoiceSection = { create: create };
})(typeof window !== "undefined" ? window : this);
