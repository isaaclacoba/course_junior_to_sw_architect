/*
 * resource/preference.js - a persisted single choice from a fixed set of values.
 *
 * Generic and DOM-free: read/validate the saved value against the allowed set,
 * expose get()/set(). By default set() persists and reloads the page - callers
 * whose rendering is synchronous (the legacy engines, the theme) re-read the new
 * value on the next load. A caller that can re-render in place (a kernel lesson
 * controller) passes an onChange handler: set() then persists and calls onChange
 * instead of reloading, so the choice is applied live. Knows nothing about voices
 * or themes.
 */
(function (global) {
  "use strict";

  function create(opts) {
    var storageKey = opts.storageKey;
    var values = opts.values || [];
    var dflt = opts.defaultValue !== undefined ? opts.defaultValue : values[0];
    var onChange = typeof opts.onChange === "function" ? opts.onChange : null;

    function read() { try { return global.localStorage.getItem(storageKey); } catch (e) { return null; } }
    function write(v) { try { global.localStorage.setItem(storageKey, v); } catch (e) { /* private mode */ } }

    var current = values.indexOf(read()) >= 0 ? read() : dflt;

    function get() { return current; }
    function set(v) {
      if (values.indexOf(v) === -1 || v === current) return;
      current = v;
      write(v);
      if (onChange) { onChange(v); return; }
      try { global.location.reload(); } catch (e) { /* no-op outside a browser */ }
    }

    return { get: get, set: set, values: values, defaultValue: dflt };
  }

  global.ResourcePreference = { create: create };
})(typeof window !== "undefined" ? window : this);
