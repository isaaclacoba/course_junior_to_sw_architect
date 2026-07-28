/*
 * theme-registry.js - the list of available themes (data only).
 *
 * A theme is metadata plus a pointer to its presentation:
 *   - id     : matches the [data-theme="<id>"] block in styles.css
 *   - label  : shown in the picker
 *   - note   : one short line describing the mood
 *   - swatch : three colors previewed in the picker (bg, primary, ink)
 *   - font   : optional stylesheet href, loaded only while the theme is active
 *
 * "default" is the built-in clean look and carries no overrides; its rules live
 * in :root. Adding a theme is a data-only change here plus one CSS block in
 * styles.css - no logic edits.
 */
(function () {
  "use strict";

  var THEMES = [
    {
      id: "default",
      label: "Clean",
      note: "Calm, high-contrast reading theme.",
      swatch: ["#fbfbf8", "#1f6f5f", "#1b1d22"]
    },
    {
      id: "critters",
      label: "Critters",
      note: "Warm and rounded, with friendly animal touches.",
      swatch: ["#fff7ef", "#e8734a", "#3a2a24"],
      font:
        "https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700&family=Nunito:wght@400;600;700&display=swap"
    }
  ];

  var DEFAULT_ID = "default";
  var byId = Object.create(null);
  THEMES.forEach(function (t) {
    byId[t.id] = t;
  });

  window.Themes = Object.freeze({
    defaultId: DEFAULT_ID,
    list: function () {
      return THEMES.slice();
    },
    get: function (id) {
      return byId[id] || byId[DEFAULT_ID];
    },
    has: function (id) {
      return Object.prototype.hasOwnProperty.call(byId, id);
    }
  });
})();
