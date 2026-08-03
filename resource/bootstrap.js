/*
 * resource/bootstrap.js - the composition root for a resource lesson page.
 *
 * It only wires collaborators together; the real work lives in the modules it
 * composes. Reads config from this script tag's data-* attributes, builds the
 * store + manager (generic engine) and the voice preference + theme/voice sections
 * (course adapter), loads the selected voice's strings, binds them onto the lesson
 * globals via the build binder, then injects the UNCHANGED page-shell.js and engine
 * last - so the resource layer is a pre-step, not an engine change.
 */
(function (global) {
  "use strict";

  // Mark the page so the standalone theme button (built by theme-switch.js) is
  // hidden by CSS; its options move into the shared Settings popover below.
  try { document.documentElement.classList.add("res-lesson"); } catch (e) {}

  var self = document.currentScript;
  function attr(name, dflt) {
    var v = self && self.getAttribute(name);
    return v == null || v === "" ? dflt : v;
  }

  var pageShellSrc = attr("data-page-shell", "../../../../page-shell.js");
  var engineSrc = attr("data-engine", "../../../../build-engine.js");
  var base = attr("data-res-base", "res/strings");
  // data-res-lang is the BASE/default language; data-res-langs is the list of
  // available languages (defaulting to just the base) - the second axis of the
  // resolver's (voice, lang) fallback chain.
  var defaultLang = attr("data-res-lang", "en");
  var langs = attr("data-res-langs", defaultLang)
    .split(",")
    .map(function (s) { return s.trim(); })
    .filter(Boolean);
  var voices = attr("data-res-voices", "default")
    .split(",")
    .map(function (s) { return s.trim(); })
    .filter(Boolean);

  function injectScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.body.appendChild(s);
    });
  }

  // The shared snapshot/restore module sits next to this controller. Loading it
  // before the first bind means a generated page needs no regeneration to pick it
  // up (it is not one of the page's own <script> tags).
  var bindOriginSrc = attr("data-bind-origin", (self && self.src || "").replace(/[^/]*$/, "bind-origin.js"));
  function ensureOrigin() {
    if (global.ResourceOrigin) return Promise.resolve();
    return injectScript(bindOriginSrc);
  }

  var defaultVoice = voices.indexOf("default") >= 0 ? "default" : voices[0];
  var voicePref = global.ResourcePreference.create({
    storageKey: "course_lesson_voice",
    values: voices,
    defaultValue: defaultVoice
  });
  var langPref = global.ResourcePreference.create({
    storageKey: "course_lesson_lang",
    values: langs,
    defaultValue: defaultLang
  });
  function snapshot() {
    return {
      voice: voicePref.get(),
      lang: langPref.get(),
      defaultVoice: defaultVoice,
      defaultLang: defaultLang
    };
  }

  var store = global.ResourceStore.create({ base: base });
  var manager = global.ResourceManager.create({
    store: store,
    resolver: global.ResourceResolver,
    selection: snapshot
  });

  // The one Settings popover: theme section (if theme-switch is present) + the
  // lesson's reading-voice section.
  function mountSettings() {
    if (!global.SiteSettings) return;
    var sections = [];
    var theme = global.ThemeSection && global.ThemeSection.create();
    if (theme) sections.push(theme);
    var voice = global.VoiceSection && global.VoiceSection.create(voicePref);
    if (voice) sections.push(voice);
    var language = global.LangSection && global.LangSection.create(langPref);
    if (language) sections.push(language);
    global.SiteSettings.create({ sections: sections }).mount();
  }

  // page-shell renders the hero + card scaffold; the engine fills the tasks. Both
  // are injected here (after binding), so they stay the same files the flat pages
  // load and the resource layer never edits them.
  function render() {
    var gradingSrc = engineSrc.replace(/build-engine\.js$/, "kernel/grading/output-match.js");
    return injectScript(pageShellSrc)
      .then(function () {
        mountSettings();
        return injectScript(gradingSrc);
      })
      .then(function () {
        return injectScript(engineSrc);
      });
  }

  ensureOrigin()
    .then(function () { return manager.init(); })
    .then(function (R) {
      if (global.ResourceBindBuild) {
        global.ResourceBindBuild.apply(R, { page: global.PAGE, config: global.BUILD_CONFIG });
      }
      return render();
    })
    .catch(function (err) {
      // Defensive only: store.load swallows fetch errors to {}, so init does not
      // reject in practice. If it ever did, still inject page-shell + the engine so
      // the hero renders (its intro is inlined in PAGE); task prose would be blank.
      if (global.console) global.console.error("resource bootstrap failed", err);
      render();
    });
})(typeof window !== "undefined" ? window : this);
