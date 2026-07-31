/*
 * resource/theme-section.js - the "Theme" section for the Settings popover.
 *
 * Course adapter: data only. It reads theme-switch.js's public API (window.Themes
 * for the list, window.CourseTheme to read/apply the choice) and returns a section
 * descriptor the generic Settings popover renders. Choosing a theme applies it in
 * place (no reload), so onSelect refreshes the panel to re-mark the active row.
 */
(function (global) {
  "use strict";

  function tr(key, fallback) {
    var C = (typeof window !== "undefined") && window.LessonCommon;
    return (C && typeof C.t === "function") ? C.t(key, fallback) : fallback;
  }

  var LABEL_KEYS = {
    default: "settings.themeClean",
    critters: "settings.themeCritters",
    dark: "settings.themeDark"
  };
  var NOTE_KEYS = {
    default: "settings.themeCleanNote",
    critters: "settings.themeCrittersNote",
    dark: "settings.themeDarkNote"
  };

  function create() {
    var Themes = global.Themes;
    var CourseTheme = global.CourseTheme;
    if (!Themes || !CourseTheme) return null;

    return {
      id: "theme",
      title: tr("settings.theme", "Theme"),
      options: function () {
        var active = CourseTheme.get();
        return Themes.list().map(function (t) {
          var note = t.note || "";
          return {
            id: t.id,
            label: LABEL_KEYS[t.id] ? tr(LABEL_KEYS[t.id], t.label) : t.label,
            note: NOTE_KEYS[t.id] ? tr(NOTE_KEYS[t.id], note) : note,
            swatch: t.swatch || [],
            active: t.id === active
          };
        });
      },
      onSelect: function (id, ctx) {
        CourseTheme.set(id);
        if (ctx && ctx.refresh) ctx.refresh();
      }
    };
  }

  global.ThemeSection = { create: create };
})(typeof window !== "undefined" ? window : this);
