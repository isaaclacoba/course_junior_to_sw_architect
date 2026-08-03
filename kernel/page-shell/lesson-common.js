// Shared lesson helpers: the storage seam, escaping, inline markup, progress
// and the output panel. Used by both engines and by the page shell itself.
//
// A self-contained module: window.LessonCommon in the browser, module.exports in Node
// so a unit test can require() it without loading the whole page shell.
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.LessonCommon = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  // Shared lesson helpers used by both engines (build + drill), so the escaping
  // and inline-markup rules live in one place. Defined before any early return
  // below so the engines can rely on it regardless of this page's config.
  // A tiny storage seam so course progress does not hard-depend on localStorage.
  // Defaults to real localStorage; falls back to an in-memory store when it is
  // unavailable (tests, private mode). A page or test can replace
  // LessonCommon.storage before an engine runs to inject its own.
  function memoryStorage() {
    const map = new Map();
    return {
      getItem: (k) => (map.has(k) ? map.get(k) : null),
      setItem: (k, v) => {
        map.set(k, String(v));
      },
      removeItem: (k) => {
        map.delete(k);
      },
    };
  }
  let defaultStorage;
  try {
    defaultStorage = (typeof localStorage !== "undefined" && localStorage) || memoryStorage();
  } catch (e) {
    defaultStorage = memoryStorage();
  }

  const LessonCommon = {
    escapeHtml(s) {
      return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    },
    // Turn `backtick` spans into inline <code>, **bold** into <strong>, and
    // [[concept:id|label]] into a clickable concept mention (opens a panel).
    renderInline(text) {
      return (text || "")
        .split(/(\[\[concept:[^\]|]+\|[^\]]+\]\]|`[^`]+`|\*\*[^*]+\*\*)/)
        .map((seg) => {
          const cm = seg.match(/^\[\[concept:([^\]|]+)\|([^\]]+)\]\]$/);
          if (cm)
            return `<button type="button" class="concept-mention" data-concept-id="${LessonCommon.escapeHtml(cm[1])}">${LessonCommon.escapeHtml(cm[2])}</button>`;
          if (seg.length > 1 && seg.startsWith("`") && seg.endsWith("`"))
            return `<code>${LessonCommon.escapeHtml(seg.slice(1, -1))}</code>`;
          if (seg.length > 3 && seg.startsWith("**") && seg.endsWith("**"))
            return `<strong>${LessonCommon.escapeHtml(seg.slice(2, -2))}</strong>`;
          return LessonCommon.escapeHtml(seg);
        })
        .join("");
    },
    // Which card index the URL hash points at, clamped to [0, count - 1].
    cardFromHash(count) {
      const n = parseInt((location.hash || "").replace(/[^0-9]/g, ""), 10);
      return Number.isFinite(n) ? Math.min(Math.max(n - 1, 0), count - 1) : 0;
    },
    // Storage seam (default: localStorage) and the course progress built on it.
    memoryStorage,
    storage: defaultStorage,
    // Course progress (shared XP counter + which cards already paid out), kept
    // behind the storage seam so grading/XP can be unit-tested with a fake store.
    createProgress(opts) {
      const store = (opts && opts.storage) || LessonCommon.storage;
      const xpKey = opts.xpKey;
      const awardedKey = opts.awardedKey;
      const awarded = JSON.parse(store.getItem(awardedKey) || "{}");
      function xp() {
        return parseInt(store.getItem(xpKey) || "0", 10);
      }
      return {
        xp,
        addXP(amount) {
          store.setItem(xpKey, String(xp() + amount));
          return xp();
        },
        isAwarded(i) {
          return Boolean(awarded[i]);
        },
        markAwarded(i) {
          awarded[i] = true;
          store.setItem(awardedKey, JSON.stringify(awarded));
        },
      };
    },
    // The run-output + compile-error surface for a lesson card. Injecting the
    // two elements keeps the show/hide/error logic in one place instead of
    // copied into each engine. Falls back to plain text output when the shared
    // code-lab error panel is unavailable.
    createOutputPanel(els) {
      const output = (els && els.output) || null;
      const errors = (els && els.errors) || null;
      const panel = () =>
        errors && typeof window !== "undefined" && window.CodeLab && window.CodeLab.showErrorPanel
          ? window.CodeLab.showErrorPanel
          : null;
      function showOutput(text, isError) {
        if (!output) return;
        output.hidden = false;
        output.textContent = text;
        output.classList.toggle("is-error", Boolean(isError));
      }
      function hideOutput() {
        if (!output) return;
        output.hidden = true;
        output.textContent = "";
      }
      function clearErrors() {
        const show = panel();
        if (show) show(errors, []);
      }
      function showErrors(list) {
        const show = panel();
        if (show) {
          if (output) output.hidden = true;
          return show(errors, list);
        }
        showOutput((list || []).map((e) => e.friendly || e.raw).join("\n"), true);
        return Boolean(list && list.length);
      }
      return { showOutput, hideOutput, clearErrors, showErrors };
    },
    // Chrome (UI furniture) text lookup: the localized string for the current
    // language from window.ChromeText, else the English fallback when no catalog
    // is active (so non-i18n pages stay byte-identical). key is namespaced
    // (nav.run, card.goal, quiz.check, ...).
    t(key, fallback) {
      var c = (typeof window !== "undefined" && window.ChromeText) || null;
      if (c && Object.prototype.hasOwnProperty.call(c, key)) {
        var v = c[key];
        if (v != null) return v;
      }
      return fallback;
    },
    // Put values into a localized string: "...{expected}..." + { expected: "Woof" }.
    // Named placeholders (not concatenation) so a translator can move the value to
    // wherever the sentence needs it - Spanish rarely keeps English word order.
    // Same {name} convention the code-lab widgets already use, so one syntax is
    // true across every catalog. An unknown placeholder is left visible rather
    // than blanked, so a typo shows up instead of quietly losing text.
    fill(tpl, vars) {
      return String(tpl).replace(/\{(\w+)\}/g, function (m, k) {
        return vars && Object.prototype.hasOwnProperty.call(vars, k) ? String(vars[k]) : m;
      });
    },
  };

  return LessonCommon;
});
