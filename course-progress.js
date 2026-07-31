/**
 * course-progress.js - the one owner of the index-side progress contract.
 *
 * It keeps three concerns that used to be scattered inside the index in one
 * testable place:
 *   - a storage seam (DIP): swap CourseProgress.storage for a fake in a test,
 *     so none of the progress logic hard-depends on localStorage;
 *   - the single definition of how a raw award count becomes a status
 *     (done / progress / todo, plus a "final" card) - deriveStatus;
 *   - a DOM-free summary of a whole track (counts, percentage, resume target),
 *     so the index just paints the result instead of computing it inline.
 *
 * No DOM here on purpose. The index (course-index.js) and the nav
 * (course-nav.js) read from this; nothing writes lesson content.
 *
 * Note: page-shell.js keeps its own small storage seam for lesson grading. The
 * two never load on the same page (index has no page-shell; lessons have no
 * course-index), so each context owns its persistence once - no shared runtime.
 */
(function (global) {
  var XP_KEY = "course_global_xp";
  var TRACK_KEY = "course_track";

  function memoryStorage() {
    var map = new Map();
    return {
      getItem: function (k) { return map.has(k) ? map.get(k) : null; },
      setItem: function (k, v) { map.set(k, String(v)); },
      removeItem: function (k) { map.delete(k); }
    };
  }
  var defaultStorage;
  try {
    defaultStorage = (typeof localStorage !== "undefined" && localStorage) || memoryStorage();
  } catch (e) {
    defaultStorage = memoryStorage();
  }

  // Pure: the single place the status thresholds live. Adding a new lesson kind
  // means one new branch here, not a change scattered across the index and nav.
  function deriveStatus(count, total, kind) {
    if (kind === "final") return "final";
    if (total && count >= total) return "done";
    return count > 0 ? "progress" : "todo";
  }

  var CourseProgress = {
    XP_KEY: XP_KEY,
    TRACK_KEY: TRACK_KEY,
    memoryStorage: memoryStorage,
    storage: defaultStorage,
    deriveStatus: deriveStatus,

    awardedCount: function (key) {
      try { return Object.keys(JSON.parse(CourseProgress.storage.getItem(key) || "{}")).length; }
      catch (e) { return 0; }
    },
    xp: function () { return parseInt(CourseProgress.storage.getItem(XP_KEY) || "0", 10); },
    track: function () { return CourseProgress.storage.getItem(TRACK_KEY); },
    setTrack: function (name) { CourseProgress.storage.setItem(TRACK_KEY, name); },

    statusOf: function (lesson) {
      return deriveStatus(CourseProgress.awardedCount(lesson.key), lesson.total, lesson.kind);
    },

    // DOM-free progress summary for a whole track. The index paints from this.
    summarize: function (track) {
      var perCard = [], tracked = 0, done = 0, firstOpen = null, finalHref = null;
      track.parts.forEach(function (part) {
        part.lessons.forEach(function (lesson) {
          var status = CourseProgress.statusOf(lesson);
          perCard.push({ href: lesson.href, status: status });
          if (status === "final") { finalHref = lesson.href; return; }
          tracked += 1;
          if (status === "done") done += 1;
          else if (!firstOpen) firstOpen = lesson.href;
        });
      });
      return {
        perCard: perCard,
        tracked: tracked,
        done: done,
        pct: tracked ? Math.round((done / tracked) * 100) : 0,
        firstOpenHref: firstOpen,
        finalHref: finalHref,
        xp: CourseProgress.xp()
      };
    }
  };

  global.CourseProgress = CourseProgress;
})(typeof window !== "undefined" ? window : this);
