// Chrome text helpers: the tHtml/tAttr/tSlot markers a template uses to emit
// localizable static chrome, plus the live repaint that re-applies a language.
//
// A self-contained module: window.PageShellChromeText in the browser, module.exports in Node
// so a unit test can require() it without loading the whole page shell.
(function (root, factory) {
  "use strict";
  if (typeof module === "object" && module.exports) {
    module.exports = factory(require("./lesson-common.js"));
    return;
  }
  var api = factory(root.LessonCommon);
  root.PageShellChromeText = api;
  // The Localizable surface the kernel controller collects, unchanged.
  root.PageShellChrome = { setLocale: api.repaintChrome };
})(typeof window !== "undefined" ? window : globalThis, function (LessonCommon) {
  // Template chrome helpers. With NO catalog (the non-i18n pages) tAttr adds
  // nothing and tHtml/tSlot return the English literal, so the markup is
  // byte-identical; on an i18n page tAttr emits a data-t marker so a live swap can
  // re-localize the element in place.
  function chromeActive() {
    return typeof window !== "undefined" && !!window.ChromeText;
  }
  function tHtml(key, english) {
    return LessonCommon.escapeHtml(LessonCommon.t(key, english));
  }
  function tAttr(key) {
    return chromeActive() ? ' data-t="' + key + '"' : "";
  }
  // A chrome text slot that is NOT already its own element: inactive -> the plain
  // (escaped) English literal, byte-identical; active -> wrapped in <span data-t>
  // so it can be re-localized on a live swap.
  function tSlot(key, english) {
    return chromeActive()
      ? '<span data-t="' + key + '">' + tHtml(key, english) + "</span>"
      : LessonCommon.escapeHtml(english);
  }

  // Chrome Localizable: re-apply the current language to every element carrying a
  // data-t marker (present only on i18n pages). Lets a live language swap
  // re-localize the static chrome (headings, buttons, labels) in place.
  function repaintChrome() {
    if (typeof document === "undefined") return;
    var nodes = document.querySelectorAll("[data-t]");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      el.textContent = LessonCommon.t(el.getAttribute("data-t"), el.textContent);
    }
  }

  return { tHtml: tHtml, tAttr: tAttr, tSlot: tSlot, repaintChrome: repaintChrome };
});
