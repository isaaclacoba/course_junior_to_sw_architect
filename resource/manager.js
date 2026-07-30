/*
 * resource/manager.js - facade over the store and resolver.
 *
 * init() loads the bundles the current selection can reach (from the resolver's
 * fallback chain - the single source of that policy) and builds a resolver;
 * get(key)/has(key) then read a resolved string. The resolver is injected via
 * opts (defaulting to the global) so the facade depends on the abstraction, not a
 * hard-wired implementation. It knows nothing about the course's data shape - that
 * mapping lives in the page's binder - so it can be lifted into a shared library.
 */
(function (global) {
  "use strict";

  function create(opts) {
    var store = opts.store;
    var selection = opts.selection; // () -> { voice, lang, defaultVoice, defaultLang }
    var resolverApi = opts.resolver || global.ResourceResolver;
    var resolver = null;

    function init() {
      var sel = selection();
      return store.loadAll(resolverApi.chain(sel)).then(function (bundles) {
        resolver = resolverApi.create(bundles, sel);
        return api;
      });
    }
    function get(key) { return resolver ? resolver.get(key) : undefined; }
    function has(key) { return resolver ? resolver.has(key) : false; }

    var api = { init: init, get: get, has: has };
    return api;
  }

  global.ResourceManager = { create: create };
})(typeof window !== "undefined" ? window : this);
