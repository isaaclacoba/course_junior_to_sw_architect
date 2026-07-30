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

  var LABELS = {
    default: { label: "Default", note: "The standard course voice." },
    child: { label: "Young learners", note: "Simple words, short sentences." },
    academic: { label: "Academic", note: "Precise, formal wording." }
  };
  function labelFor(id) { return (LABELS[id] && LABELS[id].label) || id; }
  function noteFor(id) { return (LABELS[id] && LABELS[id].note) || ""; }

  // Build the section from a preference; returns null when there is nothing to
  // choose (fewer than two voices), so the caller can omit it.
  function create(pref) {
    if (!pref || (pref.values || []).length < 2) return null;

    return {
      id: "voice",
      title: "Reading voice",
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
