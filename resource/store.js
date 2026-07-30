/*
 * resource/store.js - swappable async loader for resource bundles.
 *
 * The default implementation fetches "<base>/<voice>/<lang>.json" relative to the
 * page and caches each bundle by "<voice>/<lang>". A missing or unreadable bundle
 * resolves to {} so the resolver can fall back rather than throw. The `fetch`
 * dependency is injectable, so the store can be driven from a test with no network.
 */
(function (global) {
  "use strict";

  function create(opts) {
    var base = (opts && opts.base) || "res/strings";
    var fetchImpl = (opts && opts.fetch) ||
      (typeof fetch !== "undefined" ? fetch.bind(global) : null);
    var cache = {};

    function keyOf(voice, lang) {
      return voice + "/" + lang;
    }

    // Load one bundle; returns a cached Promise resolving to a plain object.
    function load(voice, lang) {
      var k = keyOf(voice, lang);
      if (cache[k]) return cache[k];
      var url = base + "/" + voice + "/" + lang + ".json";
      var p;
      if (!fetchImpl) {
        p = Promise.resolve({});
      } else {
        p = fetchImpl(url)
          .then(function (r) { return r && r.ok ? r.json() : {}; })
          .catch(function () { return {}; });
      }
      cache[k] = p;
      return p;
    }

    // Load several [voice, lang] pairs and return a bundles map for the resolver.
    function loadAll(pairs) {
      var names = [];
      var jobs = pairs.map(function (pr) {
        names.push(keyOf(pr[0], pr[1]));
        return load(pr[0], pr[1]);
      });
      return Promise.all(jobs).then(function (results) {
        var bundles = {};
        results.forEach(function (obj, i) { bundles[names[i]] = obj || {}; });
        return bundles;
      });
    }

    return { load: load, loadAll: loadAll };
  }

  global.ResourceStore = { create: create };
})(typeof window !== "undefined" ? window : this);
