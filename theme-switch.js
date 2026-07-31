/*
 * theme-switch.js - applies the saved theme and renders the picker.
 *
 * Runs in <head> so the theme is set on <html data-theme> before first paint
 * (no flash of the default palette). Depends on window.Themes (theme-registry.js).
 * Presentation for each theme lives in styles.css under [data-theme="<id>"];
 * this module only toggles the attribute, loads the theme font on demand,
 * persists the choice, and builds a small floating control.
 */
(function () {
  "use strict";

  var KEY = "course_theme";
  var registry = window.Themes;
  if (!registry) return;

  // Read a localized chrome string, falling back to the English default when
  // the catalog is not loaded yet (this file runs in <head>, before the
  // page's loader fetches window.ChromeText).
  function t(key, fallback) {
    var C = window.ChromeText;
    return (C && C[key]) || fallback;
  }

  // Maps a theme id to its catalog keys. The clean look has id "default".
  // Ids not listed here fall back to the registry's own label/note.
  var LABEL_KEYS = {
    default: { label: "settings.themeClean", note: "settings.themeCleanNote" },
    critters: {
      label: "settings.themeCritters",
      note: "settings.themeCrittersNote"
    },
    dark: { label: "settings.themeDark", note: "settings.themeDarkNote" }
  };

  function read() {
    try {
      return window.localStorage.getItem(KEY);
    } catch (e) {
      return null;
    }
  }
  function write(id) {
    try {
      window.localStorage.setItem(KEY, id);
    } catch (e) {
      /* private mode - keep the in-memory choice only */
    }
  }

  function resolve(id) {
    return registry.has(id) ? id : registry.defaultId;
  }

  function prefersDark() {
    try {
      return (
        !!window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      );
    } catch (e) {
      return false;
    }
  }

  // The theme when the visitor has not chosen one: honor a valid saved choice,
  // otherwise follow the OS color scheme (falling back to the clean default).
  function initial() {
    var saved = read();
    if (saved && registry.has(saved)) return saved;
    if (registry.schemeDefault && prefersDark()) {
      return registry.schemeDefault("dark");
    }
    return registry.defaultId;
  }

  var current = initial();

  function ensureFont(id) {
    var theme = registry.get(id);
    var link = document.getElementById("theme-font");
    if (theme && theme.font) {
      if (!link) {
        link = document.createElement("link");
        link.id = "theme-font";
        link.rel = "stylesheet";
        document.head.appendChild(link);
      }
      if (link.href !== theme.font) link.href = theme.font;
    } else if (link) {
      link.parentNode.removeChild(link);
    }
  }

  function applyAttr(id) {
    var root = document.documentElement;
    if (id === registry.defaultId) root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", id);
    ensureFont(id);
  }

  // Early apply (this file loads in <head>, before the body paints).
  applyAttr(current);

  function select(id) {
    current = resolve(id);
    applyAttr(current);
    write(current);
    render();
  }

  // Re-apply the button label + aria and re-render the panel from the catalog.
  // Hoisted so it can be referenced in CourseTheme before its definition below.
  function relabel() {
    if (root) {
      var btn = root.querySelector(".c-theme-btn");
      if (btn) {
        btn.setAttribute("aria-label", t("settings.themeAria", "Choose a theme"));
        var label = btn.querySelector("span");
        if (label) label.textContent = t("settings.theme", "Theme");
      }
    }
    render();
  }

  window.CourseTheme = Object.freeze({
    set: select,
    get: function () {
      return current;
    },
    relabel: relabel
  });

  // Follow OS light/dark changes until the visitor makes an explicit choice.
  (function watchScheme() {
    var mql;
    try {
      mql = window.matchMedia
        ? window.matchMedia("(prefers-color-scheme: dark)")
        : null;
    } catch (e) {
      mql = null;
    }
    if (!mql) return;
    function onChange() {
      if (read()) return; // an explicit choice overrides the OS preference
      current = initial();
      applyAttr(current);
      render();
    }
    if (mql.addEventListener) mql.addEventListener("change", onChange);
    else if (mql.addListener) mql.addListener(onChange);
  })();

  // --- picker control ---------------------------------------------------

  var root = null;
  var panel = null;
  var open = false;

  function swatch(theme) {
    var wrap = document.createElement("span");
    wrap.className = "c-theme-sw";
    theme.swatch.forEach(function (c) {
      var dot = document.createElement("span");
      dot.className = "c-theme-dot";
      dot.style.background = c;
      wrap.appendChild(dot);
    });
    return wrap;
  }

  function setOpen(next) {
    open = next;
    if (!root) return;
    root.classList.toggle("is-open", open);
    var btn = root.querySelector(".c-theme-btn");
    if (btn) btn.setAttribute("aria-expanded", open ? "true" : "false");
    if (panel) panel.hidden = !open;
  }

  function render() {
    if (!panel) return;
    panel.innerHTML = "";
    registry.list().forEach(function (theme) {
      var item = document.createElement("button");
      item.type = "button";
      item.className = "c-theme-item";
      item.setAttribute("role", "menuitemradio");
      var active = theme.id === current;
      item.setAttribute("aria-checked", active ? "true" : "false");
      if (active) item.classList.add("is-active");
      item.appendChild(swatch(theme));
      var keys = LABEL_KEYS[theme.id];
      var text = document.createElement("span");
      text.className = "c-theme-text";
      var name = document.createElement("span");
      name.className = "c-theme-name";
      name.textContent = keys ? t(keys.label, theme.label) : theme.label;
      var note = document.createElement("span");
      note.className = "c-theme-note";
      note.textContent = keys
        ? t(keys.note, theme.note || "")
        : theme.note || "";
      text.appendChild(name);
      text.appendChild(note);
      item.appendChild(text);
      item.addEventListener("click", function () {
        select(theme.id);
        setOpen(false);
      });
      panel.appendChild(item);
    });
  }

  function build() {
    if (document.getElementById("themeControl")) return;

    root = document.createElement("div");
    root.className = "c-theme";
    root.id = "themeControl";

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "c-theme-btn";
    btn.setAttribute("aria-haspopup", "true");
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-label", t("settings.themeAria", "Choose a theme"));
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">' +
      '<path fill="currentColor" d="M12 3a9 9 0 0 0 0 18 2.4 2.4 0 0 0 2.4-2.4c0-.63-.25-1.2-.64-1.63a1 1 0 0 1 .74-1.67H16a5 5 0 0 0 5-5c0-3.87-4.03-7.3-9-7.3Zm-5 9a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6Zm2.6-3.6A1.3 1.3 0 1 1 9.6 5.8a1.3 1.3 0 0 1 0 2.6Zm4.8 0a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6Zm2.6 3.6a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6Z"/>' +
      "</svg><span>" + t("settings.theme", "Theme") + "</span>";
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      setOpen(!open);
    });

    panel = document.createElement("div");
    panel.className = "c-theme-panel";
    panel.setAttribute("role", "menu");
    panel.hidden = true;

    root.appendChild(btn);
    root.appendChild(panel);
    document.body.appendChild(root);

    document.addEventListener("click", function (e) {
      if (open && root && !root.contains(e.target)) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && open) setOpen(false);
    });
  }

  function ready() {
    build();
    // Defensive: if the catalog was already present at build time, this is a
    // no-op re-render; otherwise course:localechange below picks it up.
    relabel();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready);
  } else {
    ready();
  }

  // The page loader dispatches this once the chrome catalog is loaded.
  window.addEventListener("course:localechange", relabel);
})();
