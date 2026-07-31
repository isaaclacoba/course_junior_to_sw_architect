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
  var LANG = "en";
  try { LANG = window.localStorage.getItem("course_lesson_lang") || "en"; } catch (e) {}

  function tr(key, fb) { var t = window.ChromeText; return (t && t[key]) || fb; }
  function ov() { return (LANG === "es" && window.LandingContent) || null; }

  function boot() {
  var C = window.CourseData || window.Course;
  var P = window.CourseProgress;
  var Nav = window.CourseNav;

  function byId(id) { return document.getElementById(id); }
  function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

  function statusText(s) {
    if (s === "done") return tr("landing.statusCompleted", "Completed");
    if (s === "progress") return tr("landing.statusInProgress", "In progress");
    if (s === "final") return tr("landing.statusFinal", "Final challenge");
    return tr("landing.statusNotStarted", "Not started");
  }
  function pillText(pill) {
    var map = { gentle: "landing.pillGentle", steady: "landing.pillSteady", challenging: "landing.pillChallenging" };
    return tr(map[pill] || "", cap(pill));
  }

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
    var o = ov(); var m = o && o.lessons && o.lessons[l.id];
    var title = (m && m.title) || l.title;
    var blurb = (m && m.blurb) || l.blurb;
    return '<div class="c-step"><a class="c-card" ' + attrs + '>' +
      '<span class="c-node" aria-hidden="true"></span>' +
      '<div class="c-card-top"><h3 class="c-card-title">' + title + '</h3>' +
      '<span class="c-status">' + (l.kind === "final" ? statusText("final") : statusText("todo")) + '</span></div>' +
      '<p class="c-card-blurb">' + blurb + '</p>' +
      '<div class="c-card-meta"><span class="c-pill c-pill--' + pill + '">' + pillText(pill) + '</span>' +
      (l.time ? '<span class="c-meta-time">' + l.time + '</span>' : '') +
      '</div></a></div>';
  }

  function partHTML(p, idx) {
    var chev = '<svg class="c-part-chev" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';
    var o = ov();
    var kicker = (o && o.partKickers && o.partKickers[p.kicker]) || p.kicker;
    var ptitle = (o && o.parts && o.parts[p.title]) || p.title;
    return '<li class="c-part" data-part="' + idx + '">' +
      '<div class="c-part-head">' +
        '<div class="c-part-head-txt">' +
          '<p class="c-stage-kicker">' + kicker + '</p>' +
          '<h2 class="c-stage-title">' + ptitle + '</h2>' +
        '</div>' +
        '<span class="c-part-badge"></span>' + chev +
      '</div>' +
      '<div class="c-part-body"><div>' + p.lessons.map(cardHTML).join("") + '</div></div>' +
    '</li>';
  }

  C.tracks().forEach(function (t) {
    var o = ov(); var to = o && o.tracks && o.tracks[t.id];
    var tname = (to && to.name) || t.name;
    var tkicker = (to && to.kicker) || t.kicker;
    var tblurb = (to && to.blurb) || t.blurb;
    var cc = document.createElement("button");
    cc.type = "button";
    cc.className = "c-track-card";
    cc.setAttribute("data-track", t.id);
    cc.innerHTML = '<span class="c-track-kicker">' + tkicker + '</span>' +
      '<span class="c-track-name">' + tname + '</span>' +
      '<span class="c-track-blurb">' + tblurb + '</span>';
    chooserCards.appendChild(cc);

    var sb = document.createElement("button");
    sb.type = "button";
    sb.className = "c-switch-btn";
    sb.setAttribute("data-track", t.id);
    sb.textContent = tname;
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
      if (statusEl) statusEl.textContent = statusText(entry.status);
    });

    var fill = byId("cBarFill");
    if (fill) fill.style.width = summary.pct + "%";
    var stats = byId("cStats");
    if (stats) stats.textContent = summary.done + " / " + summary.tracked + " " + tr("landing.lessons", "lessons") + " \u00b7 " + summary.xp + " " + tr("landing.xp", "XP");
    var cta = byId("cCta");
    if (cta) {
      var target = summary.firstOpenHref || summary.finalHref || (summary.perCard[0] && summary.perCard[0].href);
      if (target) cta.setAttribute("href", target);
      cta.textContent = summary.done === 0 ? tr("landing.ctaStart", "Start")
        : summary.firstOpenHref ? tr("landing.ctaContinue", "Continue where you left off") : tr("landing.ctaFinished", "You finished this track");
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
  } // end boot

  function paintStaticChrome() {
    if (!window.ChromeText) return;
    function setText(sel, key) { var el = document.querySelector(sel); if (el) el.textContent = tr(key, el.textContent); }
    setText(".c-eyebrow", "landing.eyebrow");
    setText(".c-title", "landing.heading");
    var lead = document.querySelector(".c-lead"); if (lead) lead.innerHTML = tr("landing.lead", lead.innerHTML);
    setText("#cTrackLabel", "landing.progressLabel");
    setText("#cJbCta", "landing.jumpbarCta");
    var foot = document.querySelector(".c-foot");
    if (foot) foot.innerHTML = tr("landing.footerNote", "") + ' &middot; <a href="glossary.html">' + tr("landing.glossary", "Concept glossary") + "</a>";
    if (window.ChromeText["landing.title"]) document.title = window.ChromeText["landing.title"];
  }

  function mountLangToggle() {
    if (document.getElementById("langControl")) return;
    var wrap = document.createElement("div");
    wrap.className = "c-lang";
    wrap.id = "langControl";
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "c-theme-btn";
    var toEs = LANG !== "es";
    btn.setAttribute("aria-label", toEs ? "Cambiar a espa\u00f1ol" : "Switch to English");
    btn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm6.9 6h-3a15 15 0 0 0-1.2-3.3A8 8 0 0 1 18.9 8ZM12 4c.7 0 1.7 1.4 2.3 4H9.7C10.3 5.4 11.3 4 12 4ZM4.3 14a8 8 0 0 1 0-4h3.2a17 17 0 0 0 0 4Zm.8 2h3a15 15 0 0 0 1.2 3.3A8 8 0 0 1 5.1 16Zm3-8h-3a8 8 0 0 1 4.2-3.3A15 15 0 0 0 8.1 8ZM12 20c-.7 0-1.7-1.4-2.3-4h4.6c-.6 2.6-1.6 4-2.3 4Zm2.7-6H9.3a15 15 0 0 1 0-4h5.4a15 15 0 0 1 0 4Zm.2 5.3a15 15 0 0 0 1.2-3.3h3a8 8 0 0 1-4.2 3.3ZM16.5 14a17 17 0 0 0 0-4h3.2a8 8 0 0 1 0 4Z"/></svg><span>' + (toEs ? "Espa\u00f1ol" : "English") + "</span>";
    btn.addEventListener("click", function () {
      try { window.localStorage.setItem("course_lesson_lang", toEs ? "es" : "en"); } catch (e) {}
      window.location.reload();
    });
    wrap.appendChild(btn);
    document.body.appendChild(wrap);
  }

  if (LANG === "es") {
    Promise.all([
      fetch("res/chrome/es.json").then(function (r) { return r.json(); }).catch(function () { return null; }),
      fetch("res/landing/es.json").then(function (r) { return r.json(); }).catch(function () { return null; })
    ]).then(function (res) {
      if (res[0]) window.ChromeText = res[0];
      if (res[1]) window.LandingContent = res[1];
      boot();
      paintStaticChrome();
      mountLangToggle();
      try { window.dispatchEvent(new Event("course:localechange")); } catch (e) {}
    });
  } else {
    boot();
    mountLangToggle();
  }
})();
