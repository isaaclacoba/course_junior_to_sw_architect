/*
 * resource/settings.js - one floating "Settings" popover that groups site
 * controls into labelled sections.
 *
 * A gear button (bottom-right) opens a right-anchored panel (so it can never
 * overflow the edge). It owns ALL of the menu markup: each section supplies only
 * data - a title, an `options` list (or a function returning one), and an
 * `onSelect(id, ctx)`. An option is { id, label, note?, swatch?, active? }. This
 * keeps the popover generic (add a control by adding a data section) and means no
 * caller hand-builds item DOM. ctx.refresh re-renders the panel (for controls that
 * change state in place, like theme).
 */
(function (global) {
  "use strict";

  function tr(key, fallback) {
    var C = (typeof window !== "undefined") && window.LessonCommon;
    return (C && typeof C.t === "function") ? C.t(key, fallback) : fallback;
  }

  function create(opts) {
    var sections = (opts && opts.sections) || [];
    var root = null;
    var panel = null;
    var open = false;

    function setOpen(next) {
      open = next;
      if (!root) return;
      root.classList.toggle("is-open", open);
      var btn = root.querySelector(".c-settings-btn");
      if (btn) btn.setAttribute("aria-expanded", open ? "true" : "false");
      if (panel) panel.hidden = !open;
    }

    function optionsOf(sec) {
      var o = sec.options;
      return (typeof o === "function" ? o() : o) || [];
    }

    // A section's title may be a plain string or a function. A function is
    // re-evaluated on every render, which is what lets the panel come out in the
    // new language after a locale switch - a string captured at create() time
    // would stay in whatever language was loaded when the section was built.
    function titleOf(sec) {
      var t = sec.title;
      return (typeof t === "function" ? t() : t) || "";
    }

    function renderItem(container, sec, opt, ctx) {
      var item = document.createElement("button");
      item.type = "button";
      item.className = "c-settings-item" + (opt.active ? " is-active" : "");
      item.setAttribute("role", "menuitemradio");
      item.setAttribute("aria-checked", opt.active ? "true" : "false");
      if (opt.swatch && opt.swatch.length) {
        var sw = document.createElement("span");
        sw.className = "c-settings-sw";
        opt.swatch.forEach(function (c) {
          var dot = document.createElement("span");
          dot.className = "c-settings-dot";
          dot.style.background = c;
          sw.appendChild(dot);
        });
        item.appendChild(sw);
      }
      var text = document.createElement("span");
      text.className = "c-settings-text";
      var name = document.createElement("span");
      name.className = "c-settings-name";
      name.textContent = opt.label;
      text.appendChild(name);
      if (opt.note) {
        var note = document.createElement("span");
        note.className = "c-settings-note";
        note.textContent = opt.note;
        text.appendChild(note);
      }
      item.appendChild(text);
      item.addEventListener("click", function () {
        if (typeof sec.onSelect === "function") sec.onSelect(opt.id, ctx);
      });
      container.appendChild(item);
    }

    // The gear button's own label. Painted here rather than at mount() so a
    // locale switch repaints it too - it is the one control that is visible
    // without opening the panel, so an English "Settings" next to a Spanish page
    // is the first thing a learner sees.
    function renderButton() {
      if (!root) return;
      var btn = root.querySelector(".c-settings-btn");
      if (!btn) return;
      var label = tr("settings.title", "Settings");
      btn.setAttribute("aria-label", label);
      var span = btn.querySelector("span");
      if (span) span.textContent = label;
    }

    function renderPanel() {
      if (!panel) return;
      panel.innerHTML = "";
      var ctx = { refresh: renderPanel, close: function () { setOpen(false); } };
      sections.forEach(function (sec) {
        if (!sec) return;
        var group = document.createElement("div");
        group.className = "c-settings-group";
        var title = document.createElement("p");
        title.className = "c-settings-title";
        title.textContent = titleOf(sec);
        group.appendChild(title);
        var body = document.createElement("div");
        body.className = "c-settings-body";
        group.appendChild(body);
        optionsOf(sec).forEach(function (opt) { renderItem(body, sec, opt, ctx); });
        panel.appendChild(group);
      });
    }

    function mount() {
      if (typeof document === "undefined") return;
      if (!sections.length) return;
      if (document.getElementById("siteSettings")) return;

      root = document.createElement("div");
      root.className = "c-settings";
      root.id = "siteSettings";

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "c-settings-btn";
      btn.setAttribute("aria-haspopup", "true");
      btn.setAttribute("aria-expanded", "false");
      btn.innerHTML =
        '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">' +
        '<path fill="currentColor" d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm8.4 3.5c0-.5-.05-.98-.13-1.45l1.87-1.46-1.9-3.29-2.2.9a7.6 7.6 0 0 0-2.5-1.45L15 2.5H9l-.44 2.25a7.6 7.6 0 0 0-2.5 1.45l-2.2-.9-1.9 3.29 1.87 1.46a7.7 7.7 0 0 0 0 2.9L2 14.41l1.9 3.29 2.2-.9c.74.62 1.58 1.11 2.5 1.45L9 20.5h6l.44-2.25a7.6 7.6 0 0 0 2.5-1.45l2.2.9 1.9-3.29-1.87-1.46c.08-.47.13-.95.13-1.45Z"/>' +
        "</svg><span></span>";
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        setOpen(!open);
      });

      panel = document.createElement("div");
      panel.className = "c-settings-panel";
      panel.setAttribute("role", "menu");
      panel.hidden = true;

      root.appendChild(btn);
      root.appendChild(panel);
      document.body.appendChild(root);
      renderButton();
      renderPanel();

      document.addEventListener("click", function (e) {
        if (open && root && !root.contains(e.target)) setOpen(false);
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && open) setOpen(false);
      });
    }

    function refresh() {
      renderButton();
      renderPanel();
    }

    return { mount: mount, refresh: refresh };
  }

  global.SiteSettings = { create: create };
})(typeof window !== "undefined" ? window : this);
