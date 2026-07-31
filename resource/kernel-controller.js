/*
 * resource/kernel-controller.js - composition root for a KERNEL lesson page.
 *
 * The live-swap counterpart of resource/bootstrap.js. It wires prefs + store +
 * manager + the Settings popover, binds the selected voice/language strings onto
 * the lesson globals, and injects page-shell + the build engine. Unlike bootstrap
 * it drives the engine MANUALLY (the engine <script> carries data-manual, so its
 * self-boot footer stands down) and holds the widget controller, so a voice or
 * language change re-localizes IN PLACE - no page reload.
 *
 * The hero intro and the build widget are both Localizable ({ setLocale() }); the
 * controller fans setLocale() out over them under a generation token (last write
 * wins). Only the narrow Localizable role is required of a surface - the hero is a
 * content element with no logic, the widget is the engine controller.
 */
(function (global) {
  "use strict";

  // Hide the standalone theme button (its options move into the Settings popover).
  try { document.documentElement.classList.add("res-lesson"); } catch (e) {}

  var self = document.currentScript;
  function attr(name, dflt) {
    var v = self && self.getAttribute(name);
    return v == null || v === "" ? dflt : v;
  }
  function trim(s) { return s.trim(); }

  var pageShellSrc = attr("data-page-shell", "../../../../page-shell.js");
  var engineSrc = attr("data-engine", "../../../../build-engine.js");
  var base = attr("data-res-base", "res/strings");
  var defaultLang = attr("data-res-lang", "en");
  var langs = attr("data-res-langs", defaultLang).split(",").map(trim).filter(Boolean);
  var voices = attr("data-res-voices", "default").split(",").map(trim).filter(Boolean);
  var chromeBase = attr("data-chrome-base", "../../../../res/chrome");

  function injectScript(src, attrs) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = src;
      if (attrs) {
        Object.keys(attrs).forEach(function (k) { s.setAttribute(k, attrs[k]); });
      }
      s.onload = resolve;
      s.onerror = reject;
      document.body.appendChild(s);
    });
  }

  var defaultVoice = voices.indexOf("default") >= 0 ? "default" : voices[0];

  // A generation token: each selection bumps it; a resolve that finishes after a
  // newer selection began is dropped, so a slow bundle never paints over a newer
  // choice (last write wins).
  var gen = 0;
  var settings = null;
  var surfaces = []; // the Localizable surfaces, in order: [hero, buildWidget].

  var voicePref = global.ResourcePreference.create({
    storageKey: "course_lesson_voice", values: voices, defaultValue: defaultVoice,
    onChange: relocalize
  });
  var langPref = global.ResourcePreference.create({
    storageKey: "course_lesson_lang", values: langs, defaultValue: defaultLang,
    onChange: relocalize
  });
  function snapshot() {
    return {
      voice: voicePref.get(), lang: langPref.get(),
      defaultVoice: defaultVoice, defaultLang: defaultLang
    };
  }

  var store = global.ResourceStore.create({ base: base });
  var manager = global.ResourceManager.create({
    store: store, resolver: global.ResourceResolver, selection: snapshot
  });

  function mountSettings() {
    if (!global.SiteSettings) return;
    var sections = [];
    var theme = global.ThemeSection && global.ThemeSection.create();
    if (theme) sections.push(theme);
    var voice = global.VoiceSection && global.VoiceSection.create(voicePref);
    if (voice) sections.push(voice);
    var language = global.LangSection && global.LangSection.create(langPref);
    if (language) sections.push(language);
    settings = global.SiteSettings.create({ sections: sections });
    settings.mount();
  }

  // Bind by which lesson global is present: a build page sets BUILD_CONFIG, a
  // viz page sets LESSON_VIZ. Only one exists per page, so both guards are safe.
  function bind(R) {
    if (global.ResourceBindBuild && global.BUILD_CONFIG) {
      global.ResourceBindBuild.apply(R, { page: global.PAGE, config: global.BUILD_CONFIG });
    }
    if (global.ResourceBindViz && global.LESSON_VIZ) {
      global.ResourceBindViz.apply(R, { page: global.PAGE, viz: global.LESSON_VIZ });
    }
    if (global.ResourceBindCheckpoint && global.QUIZ_CONFIG) {
      global.ResourceBindCheckpoint.apply(R, { page: global.PAGE, quiz: global.QUIZ_CONFIG });
    }
  }

  // The chrome (shared UI) catalog is lang-only and site-wide. Load it into
  // global.ChromeText so LessonCommon.t() (and the engines) resolve UI strings; a
  // failed fetch degrades to {} (t() then returns its English fallbacks).
  function loadChrome(lang) {
    return fetch(chromeBase + "/" + lang + ".json")
      .then(function (r) { return r.ok ? r.json() : {}; })
      .then(function (map) { global.ChromeText = map || {}; })
      .catch(function () { global.ChromeText = global.ChromeText || {}; });
  }

  // Re-resolve for the current selection and repaint prose in place, guarded by
  // the generation token. The Settings highlight follows the (already-updated)
  // preference synchronously; the prose repaints when the bundle resolves.
  function relocalize() {
    if (settings) settings.refresh();
    var myGen = ++gen;
    return Promise.all([manager.init(), loadChrome(langPref.get())]).then(function (arr) {
      if (myGen !== gen) return; // superseded by a newer selection
      bind(arr[0]); // refresh PAGE.hero.intro + BUILD_CONFIG.tasks once, before the fan-out
      surfaces.forEach(function (s) {
        if (s && typeof s.setLocale === "function") s.setLocale();
      });
    });
  }

  // First load: resolve -> bind -> inject page-shell (renders hero + scaffold) ->
  // mount Settings -> inject the engine in manual mode -> boot it, holding the
  // hero and the widget as the localizable surfaces.
  manager.init()
    .then(function (R) {
      bind(R);
      return loadChrome(langPref.get());
    })
    .then(function () {
      return injectScript(pageShellSrc);
    })
    .then(function () {
      mountSettings();
      if (global.PageShellHero) surfaces.push(global.PageShellHero);
      if (global.PageShellChrome) surfaces.push(global.PageShellChrome);
      // A viz page's visual is mounted by page-shell during its injection; hold
      // it as a Localizable surface so a language swap re-renders the narrations.
      if (global.PageShellViz) surfaces.push(global.PageShellViz);
      // A checkpoint page's Quiz is mounted by page-shell during its injection;
      // hold it as a Localizable surface so a language swap re-creates the Quiz.
      if (global.PageShellCheckpoint) surfaces.push(global.PageShellCheckpoint);
      // A build lesson injects its engine (manual mode) and mounts the widget; a
      // viz or checkpoint lesson has no engine, so there is nothing more to inject.
      if (!global.BUILD_CONFIG) return;
      return injectScript(engineSrc, { "data-manual": "" }).then(function () {
        if (global.BuildEngine) {
          var widget = global.BuildEngine.create(global.BUILD_CONFIG);
          surfaces.push(widget);
          return widget.boot();
        }
      });
    })
    .then(function () {
      // The hero was rendered in the target language (bind ran before heroHTML),
      // but the breadcrumb + document title are set by the engine from the English
      // registry. On a non-default language, trigger one hero repaint (now that the
      // engine has set them) so PageShellHero localizes them too.
      if (langPref.get() !== defaultLang && global.PageShellHero && typeof global.PageShellHero.setLocale === "function") {
        try { global.PageShellHero.setLocale(); } catch (e) {}
      }
    })
    .catch(function (err) {
      // Defensive only: store.load swallows fetch errors to {}, so init does not
      // reject in practice. If it ever did, the hero still shows its inlined PAGE
      // intro; task prose would be blank.
      if (global.console) global.console.error("kernel controller failed", err);
    });
})(typeof window !== "undefined" ? window : this);
