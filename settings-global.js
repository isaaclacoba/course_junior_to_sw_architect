/*
 * settings-global.js - mount the shared Settings popover (the gear button,
 * bottom-right) on NON-lesson top-level pages (the landing, the glossary), so the
 * same control lessons get is global. Lessons mount it via kernel-controller; this
 * is the lighter mounter for pages that have no lesson engine. It reuses the same
 * building blocks - SiteSettings + ThemeSection + LangSection - which must be
 * loaded before this file.
 *
 * The language preference is created with no onChange, so choosing a language
 * persists and reloads; the page then renders in the chosen language on the next
 * load (matching how the standalone landing controls behaved). The page is marked
 * `res-lesson` so the standalone theme button and the separate language toggle
 * hide - their options now live in this one popover.
 */
(function () {
  "use strict";
  var g = window;

  // Runs in <head>: set the flag before the standalone controls paint (no flash).
  try { document.documentElement.classList.add("res-lesson"); } catch (e) {}

  // A minimal LessonCommon.t for pages that do not load page-shell, so the popover
  // section labels localize from window.ChromeText (English fallback when absent).
  if (!g.LessonCommon) {
    g.LessonCommon = { t: function (key, fb) { var C = g.ChromeText; return (C && C[key]) || fb; } };
  }

  function mount() {
    if (!g.SiteSettings) return;
    var old = document.querySelector(".c-settings");
    if (old) old.remove(); // re-mountable (e.g. on course:localechange)

    var sections = [];
    var theme = g.ThemeSection && g.ThemeSection.create();
    if (theme) sections.push(theme);
    if (g.ResourcePreference && g.LangSection) {
      var langPref = g.ResourcePreference.create({
        storageKey: "course_lesson_lang",
        values: ["en", "es"],
        defaultValue: "en"
      });
      var language = g.LangSection.create(langPref);
      if (language) sections.push(language);
    }
    if (sections.length) g.SiteSettings.create({ sections: sections }).mount();
  }

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }
  ready(mount);
  // Re-mount once a non-default language finishes loading, so the popover's own
  // labels come out localized too.
  g.addEventListener("course:localechange", mount);
})();
