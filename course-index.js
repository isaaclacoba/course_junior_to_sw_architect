/**
 * course-index.js - builds the course path from the generated course data and
 * orchestrates the index page.
 *
 * Its single job is structure and coordination:
 *   - turn the course data (window.CourseData) into DOM: the track chooser, the
 *     track switch, and one collapsible path per track;
 *   - show or switch a track, painting each card's status from a progress
 *     summary (window.CourseProgress) - it does not compute status itself;
 *   - hand the active track to the navigation engine (window.CourseNav) and ask
 *     it to refresh.
 *
 * The progress maths lives in course-progress.js; the on-page navigation lives
 * in course-nav.js; the data lives in generated/course-data.js (built from
 * course-registry.js). This file only wires them to the DOM.
 */
(function () {
  var C = window.CourseData || window.Course;
  var P = window.CourseProgress;
  var Nav = window.CourseNav;

  function byId(id) { return document.getElementById(id); }
  function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

  var STATUS_LABEL = { done: "Completed", progress: "In progress", todo: "Not started", final: "Final challenge" };

  var chooser = byId("trackChooser");
  var chooserCards = byId("trackCards");
  var activeEl = byId("trackActive");
  var switchEl = byId("trackSwitch");
  var mount = byId("trackMount");

  if (!C || !P || !mount) return;

  // ---------- build DOM from the manifest ----------
  function cardHTML(l) {
    var attrs = 'href="' + l.href + '"';
    if (l.kind === "final") attrs += ' data-final="1"';
    else {
      if (l.key) attrs += ' data-key="' + l.key + '"';
      if (l.total != null) attrs += ' data-total="' + l.total + '"';
    }
    var pill = l.pill || "steady";
    return '<div class="c-step"><a class="c-card" ' + attrs + '>' +
      '<span class="c-node" aria-hidden="true"></span>' +
      '<div class="c-card-top"><h3 class="c-card-title">' + l.title + '</h3>' +
      '<span class="c-status">' + (l.kind === "final" ? STATUS_LABEL.final : "Not started") + '</span></div>' +
      '<p class="c-card-blurb">' + l.blurb + '</p>' +
      '<div class="c-card-meta"><span class="c-pill c-pill--' + pill + '">' + cap(pill) + '</span>' +
      (l.time ? '<span class="c-meta-time">' + l.time + '</span>' : '') +
      '</div></a></div>';
  }

  function partHTML(p, idx) {
    var chev = '<svg class="c-part-chev" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';
    return '<li class="c-part" data-part="' + idx + '">' +
      '<div class="c-part-head">' +
        '<div class="c-part-head-txt">' +
          '<p class="c-stage-kicker">' + p.kicker + '</p>' +
          '<h2 class="c-stage-title">' + p.title + '</h2>' +
        '</div>' +
        '<span class="c-part-badge"></span>' + chev +
      '</div>' +
      '<div class="c-part-body"><div>' + p.lessons.map(cardHTML).join("") + '</div></div>' +
    '</li>';
  }

  C.tracks().forEach(function (t) {
    var cc = document.createElement("button");
    cc.type = "button";
    cc.className = "c-track-card";
    cc.setAttribute("data-track", t.id);
    cc.innerHTML = '<span class="c-track-kicker">' + t.kicker + '</span>' +
      '<span class="c-track-name">' + t.name + '</span>' +
      '<span class="c-track-blurb">' + t.blurb + '</span>';
    chooserCards.appendChild(cc);

    var sb = document.createElement("button");
    sb.type = "button";
    sb.className = "c-switch-btn";
    sb.setAttribute("data-track", t.id);
    sb.textContent = t.name;
    switchEl.appendChild(sb);

    var path = document.createElement("div");
    path.className = "c-track-path";
    path.id = "track-" + t.id;
    path.setAttribute("data-track", t.id);
    path.hidden = true;
    path.innerHTML = '<ol class="c-path">' + t.parts.map(partHTML).join("") + '</ol>';
    mount.appendChild(path);
  });

  var trackEls = {};
  C.tracks().forEach(function (t) { trackEls[t.id] = byId("track-" + t.id); });
  var current = null;

  // ---------- paint progress (statuses from CourseProgress, no maths here) ----------
  function renderTrack(name) {
    var container = trackEls[name];
    if (!container) return;
    var summary = P.summarize(C.track(name));

    summary.perCard.forEach(function (entry) {
      var card = container.querySelector('.c-card[href="' + entry.href + '"]');
      if (!card) return;
      card.setAttribute("data-status", entry.status);
      var statusEl = card.querySelector(".c-status");
      if (statusEl) statusEl.textContent = STATUS_LABEL[entry.status] || "Not started";
    });

    var fill = byId("cBarFill");
    if (fill) fill.style.width = summary.pct + "%";
    var stats = byId("cStats");
    if (stats) stats.textContent = summary.done + " / " + summary.tracked + " lessons \u00b7 " + summary.xp + " XP";
    var cta = byId("cCta");
    if (cta) {
      var target = summary.firstOpenHref || summary.finalHref || (summary.perCard[0] && summary.perCard[0].href);
      if (target) cta.setAttribute("href", target);
      cta.textContent = summary.done === 0 ? "Start"
        : summary.firstOpenHref ? "Continue where you left off" : "You finished this track";
    }
    if (Nav) Nav.refresh(summary);
  }

  // ---------- show / switch ----------
  function showChooser() {
    if (activeEl) activeEl.hidden = true;
    if (chooser) chooser.hidden = false;
    if (Nav) Nav.hide();
    Object.keys(trackEls).forEach(function (k) { if (trackEls[k]) trackEls[k].hidden = true; });
    current = null;
  }

  function showTrack(name, animate) {
    if (!trackEls[name]) return;
    current = name;
    if (chooser) chooser.hidden = true;
    if (activeEl) activeEl.hidden = false;
    Object.keys(trackEls).forEach(function (k) { if (trackEls[k]) trackEls[k].hidden = k !== name; });
    if (switchEl) {
      Array.prototype.slice.call(switchEl.querySelectorAll(".c-switch-btn")).forEach(function (b) {
        b.classList.toggle("is-active", b.getAttribute("data-track") === name);
      });
    }
    P.setTrack(name);
    if (Nav) Nav.setTrack(C.track(name), trackEls[name]);
    renderTrack(name);
    if (animate) {
      var el = trackEls[name];
      el.classList.remove("c-anim");
      void el.offsetWidth;
      el.classList.add("c-anim");
    }
  }

  // ---------- events ----------
  if (chooserCards) {
    chooserCards.addEventListener("click", function (e) {
      var b = e.target.closest(".c-track-card");
      if (b) showTrack(b.getAttribute("data-track"), true);
    });
  }
  if (switchEl) {
    switchEl.addEventListener("click", function (e) {
      var b = e.target.closest(".c-switch-btn");
      if (b) { showTrack(b.getAttribute("data-track"), true); window.scrollTo({ top: 0, behavior: "smooth" }); }
    });
  }

  // ---------- boot ----------
  if (Nav) {
    Nav.init({
      jumpbar: byId("cJumpbar"),
      jbScroll: byId("cJbScroll"),
      jbTrack: byId("cJbTrack"),
      indicator: byId("cJbIndicator"),
      edgeL: byId("cJbEdgeL"),
      edgeR: byId("cJbEdgeR"),
      jbCount: byId("cJbCount"),
      jbCta: byId("cJbCta"),
      scrollprog: byId("cScrollprog"),
      totop: byId("cTotop"),
      activeEl: activeEl
    });
  }

  var saved = P.track();
  if (saved && trackEls[saved]) showTrack(saved, false);
  else showChooser();
})();
