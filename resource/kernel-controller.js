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
  // The repo-root base for the engine assets is derived from this controller's own
  // URL (it lives at <root>/resource/kernel-controller.js), so no page attr is needed.
  var repoBase = (self && self.src || "").replace(/resource\/kernel-controller\.js.*$/, "");
  var base = attr("data-res-base", "res/strings");
  var defaultLang = attr("data-res-lang", "en");
  var langs = attr("data-res-langs", defaultLang).split(",").map(trim).filter(Boolean);
  var voices = attr("data-res-voices", "default").split(",").map(trim).filter(Boolean);
  var chromeBase = attr("data-chrome-base", "../../../../res/chrome");
  var conceptsBase = attr("data-concepts-base", "../../../../generated");
  // The shared snapshot/restore module sits next to this controller. Loading it
  // before the first bind means a generated page needs no regeneration to pick it
  // up (it is not one of the page's own <script> tags).
  var bindOriginSrc = attr("data-bind-origin", (self && self.src || "").replace(/[^/]*$/, "bind-origin.js"));

  // Repo-root scripts an archetype's plugin needs loaded BEFORE it: its grader,
  // plus any shared engine module it delegates to. Declarative on purpose - a new
  // archetype is a row here, not another branch in the boot chain. Paths are
  // repo-root-relative and get the derived repoBase prefix. An archetype with no
  // row (drill, viz, checkpoint) simply has none.
  var ARCHETYPE_DEPS = {
    build: ["kernel/grading/output-match.js"],
    git: ["kernel/grading/dag-match.js", "kernel/engine/git-progress.js"]
  };

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

  function ensureOrigin() {
    if (global.ResourceOrigin) return Promise.resolve();
    return injectScript(bindOriginSrc);
  }

  var defaultVoice = voices.indexOf("default") >= 0 ? "default" : voices[0];

  // A generation token: each selection bumps it; a resolve that finishes after a
  // newer selection began is dropped, so a slow bundle never paints over a newer
  // choice (last write wins).
  var gen = 0;
  var settings = null;
  var surfaces = []; // the Localizable surfaces, in order: [hero, buildWidget].

  // Register a Localizable surface. Fails loudly if the object lacks setLocale -
  // a silent skip would leave part of the page in English with no diagnostic.
  // Non-fatal (console.error, not throw) because a thrown error would blank the
  // learner's page - loud but survivable is the right trade-off for a student.
  function registerSurface(name, surface) {
    if (!surface) return;
    if (typeof surface.setLocale !== "function") {
      console.error(
        "[kernel-controller] Localizable contract violated: surface \"" + name +
        "\" was registered but lacks a setLocale() method. The language swap will skip it."
      );
      return;
    }
    surfaces.push(surface);
  }

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

  // Bind the one unified lesson global (window.LESSON_CONFIG) with the archetype's
  // binder, dispatched by window.LESSON_META.archetype (one config per page).
  function bind(R) {
    var cfg = global.LESSON_CONFIG;
    var arch = global.LESSON_META && global.LESSON_META.archetype;
    if (!cfg || !arch) return;
    if (arch === "build" && global.ResourceBindBuild) {
      global.ResourceBindBuild.apply(R, { page: global.PAGE, config: cfg });
    } else if (arch === "viz" && global.ResourceBindViz) {
      global.ResourceBindViz.apply(R, { page: global.PAGE, viz: cfg });
    } else if (arch === "checkpoint" && global.ResourceBindCheckpoint) {
      global.ResourceBindCheckpoint.apply(R, { page: global.PAGE, quiz: cfg });
    }
  }

  // The chrome (shared UI) catalog is lang-only and site-wide. Load it into
  // global.ChromeText so LessonCommon.t() (and the engines) resolve UI strings; a
  // failed fetch degrades to {} (t() then returns its English fallbacks).
  function loadChrome(lang) {
    return fetch(chromeBase + "/" + lang + ".json")
      .then(function (r) { return r.ok ? r.json() : {}; })
      .then(function (map) {
        global.ChromeText = map || {};
        try { global.dispatchEvent(new Event("course:localechange")); } catch (e) {}
      })
      .catch(function () { global.ChromeText = global.ChromeText || {}; });
  }

  // Concept term/def overlays: build a ConceptI18n source (English graph = base)
  // for the current voice/lang and inject it into the concept panel + agenda. The
  // per-language overlay lives in generated/concept-i18n.<lang>.js; English needs
  // none. A missing overlay degrades to the English graph.
  var conceptDataLoaded = {};
  // Set the concept source for `lang`. English (default) => null, so page-shell
  // keeps its legacy graph path (byte-identical, preserves the "not found" panel
  // sentinel). A non-default lang gets a ConceptI18n over the loaded overlay.
  function buildConceptSource(lang) {
    if (!global.PageShellConcepts) return;
    if (lang === defaultLang || !global.ConceptI18n) {
      global.PageShellConcepts.setConceptSource(null);
      return;
    }
    global.PageShellConcepts.setConceptSource(global.ConceptI18n.create({
      base: (global.ConceptIndex && global.ConceptIndex.defs) || {},
      overlays: (global.ConceptI18nData && global.ConceptI18nData[lang]) || {},
      selection: { voice: voicePref.get(), lang: lang }
    }));
  }
  // Ensure the per-language overlay script is loaded (absent-safe). Does NOT set
  // the source - callers set it AFTER any generation-token guard (last write wins).
  function ensureConceptData(lang) {
    if (lang === defaultLang || conceptDataLoaded[lang]) return Promise.resolve();
    return new Promise(function (resolve) {
      var s = document.createElement("script");
      s.src = conceptsBase + "/concept-i18n." + lang + ".js";
      s.onload = function () { conceptDataLoaded[lang] = true; resolve(); };
      s.onerror = function () { resolve(); }; // absent = English fallback
      global.document.head.appendChild(s);
    });
  }

  // Re-resolve for the current selection and repaint prose in place, guarded by
  // the generation token. The Settings highlight follows the (already-updated)
  // preference synchronously; the prose repaints when the bundle resolves.
  function relocalize() {
    if (settings) settings.refresh();
    var myGen = ++gen;
    return Promise.all([manager.init(), loadChrome(langPref.get()), ensureConceptData(langPref.get())]).then(function (arr) {
      if (myGen !== gen) return; // superseded by a newer selection
      bind(arr[0]); // refresh PAGE.hero.intro + LESSON_CONFIG once, before the fan-out
      buildConceptSource(langPref.get()); // gen-guarded: never sets a stale source
      surfaces.forEach(function (s) {
        if (s && typeof s.setLocale === "function") {
          s.setLocale();
        } else {
          // Should never reach here if registerSurface is the only insertion path,
          // but guard against direct .push() regressions.
          console.error(
            "[kernel-controller] relocalize: surface in array lacks setLocale():",
            s
          );
        }
      });
    });
  }

  // First load: ensure the shared bind-origin module -> resolve -> bind -> inject
  // page-shell (renders hero + scaffold) -> mount Settings -> inject the engine in
  // manual mode -> boot it, holding the hero and the widget as the localizable
  // surfaces.
  ensureOrigin()
    .then(function () { return manager.init(); })
    .then(function (R) {
      bind(R);
      return loadChrome(langPref.get());
    })
    .then(function () {
      return injectScript(pageShellSrc);
    })
    .then(function () {
      mountSettings();
      registerSurface("PageShellHero", global.PageShellHero);
      registerSurface("PageShellChrome", global.PageShellChrome);
      // The concept panel + agenda are page-shell content; hold PageShellConcepts
      // as a Localizable surface so a language swap re-localizes them.
      registerSurface("PageShellConcepts", global.PageShellConcepts);

      // Every archetype now boots the ONE generic lesson engine + its plugin.
      // page-shell renders only the hero, the concept agenda, and - for the card
      // archetypes - the card scaffold; it no longer mounts the viz/checkpoint
      // widgets. Dispatch by LESSON_META.archetype: load whatever that archetype
      // declares in ARCHETYPE_DEPS, then the archetype-blind core (manual mode, so
      // its self-boot footer stands down) + the matching plugin, then create + boot
      // it. LessonEngine.create returns the { boot, setLocale } shape the
      // controller holds as a Localizable surface.
      var cfg = global.LESSON_CONFIG;
      var archetype = global.LESSON_META && global.LESSON_META.archetype;
      if (!cfg || !archetype) {
        console.error(
          "[kernel-controller] Cannot boot lesson widget: " +
          (!cfg ? "LESSON_CONFIG is missing" : "LESSON_META.archetype is missing") +
          ". The lesson body will not render."
        );
        return;
      }
      cfg.archetype = archetype;
      // The archetype's declared dependencies load first, in order (a grading
      // module, and for git the shared progress module the plugin delegates to),
      // then the core and the plugin.
      var chain = (ARCHETYPE_DEPS[archetype] || []).reduce(function (p, dep) {
        return p.then(function () { return injectScript(repoBase + dep); });
      }, Promise.resolve());
      return chain
        .then(function () { return injectScript(repoBase + "kernel/engine/lesson-engine.js", { "data-manual": "" }); })
        .then(function () { return injectScript(repoBase + "kernel/engine/plugins/" + archetype + "-plugin.js"); })
        .then(function () {
          if (global.LessonEngine) {
            var widget = global.LessonEngine.create(cfg);
            registerSurface("LessonEngine(" + archetype + ")", widget);
            return widget.boot();
          }
        });
    })
    .then(function () {
      return ensureConceptData(langPref.get());
    })
    .then(function () {
      buildConceptSource(langPref.get());
      // The hero, breadcrumb/title, and the concept agenda were rendered in the
      // default language (bind + the engine ran before the concept source was set).
      // On a non-default language, repaint them now from the injected source.
      if (langPref.get() !== defaultLang) {
        try { if (global.PageShellHero && global.PageShellHero.setLocale) global.PageShellHero.setLocale(); } catch (e) {}
        try { if (global.PageShellConcepts && global.PageShellConcepts.setLocale) global.PageShellConcepts.setLocale(); } catch (e) {}
      }
    })
    .catch(function (err) {
      // Defensive only: store.load swallows fetch errors to {}, so init does not
      // reject in practice. If it ever did, the hero still shows its inlined PAGE
      // intro; task prose would be blank.
      if (global.console) global.console.error("kernel controller failed", err);
    });
})(typeof window !== "undefined" ? window : this);
