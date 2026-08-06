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
  var subSwitchEl = byId("trackSubSwitch");
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

  // Two tracks can be the two halves of one course - the git course is a
  // hands-on track and an internals track. They share ONE tab, named by the
  // group; a segmented control inside picks which half you are reading. A track
  // with no `group` is its own group of one and no segment appears.
  //
  // The FIRST member owns the tab: its kicker, name and blurb are the group's.
  function groupsOf(tracks) {
    var seen = {};
    var order = [];
    tracks.forEach(function (t) {
      var gid = t.group || t.id;
      if (!seen[gid]) { seen[gid] = { id: gid, lead: t, members: [] }; order.push(seen[gid]); }
      seen[gid].members.push(t);
    });
    return order;
  }
  var GROUPS = groupsOf(C.tracks());
  function groupOf(trackId) {
    for (var i = 0; i < GROUPS.length; i++) {
      for (var j = 0; j < GROUPS[i].members.length; j++) {
        if (GROUPS[i].members[j].id === trackId) return GROUPS[i];
      }
    }
    return null;
  }
  function trackText(t) {
    var o = ov(); var to = o && o.tracks && o.tracks[t.id];
    return {
      name: (to && to.name) || t.name,
      kicker: (to && to.kicker) || t.kicker,
      blurb: (to && to.blurb) || t.blurb,
      groupLabel: (to && to.groupLabel) || t.groupLabel || ((to && to.name) || t.name),
      groupBlurb: (to && to.groupBlurb) || t.groupBlurb,
    };
  }

  // One chooser card and one tab per GROUP; one path per TRACK.
  GROUPS.forEach(function (g) {
    var txt = trackText(g.lead);
    var cc = document.createElement("button");
    cc.type = "button";
    cc.className = "c-track-card";
    cc.setAttribute("data-track", g.lead.id);
    cc.innerHTML = '<span class="c-track-kicker">' + txt.kicker + '</span>' +
      '<span class="c-track-name">' + txt.name + '</span>' +
      '<span class="c-track-blurb">' + (txt.groupBlurb || txt.blurb) + '</span>';
    chooserCards.appendChild(cc);

    var sb = document.createElement("button");
    sb.type = "button";
    sb.className = "c-switch-btn";
    sb.setAttribute("data-track", g.lead.id);
    sb.textContent = txt.name;
    switchEl.appendChild(sb);
  });

  C.tracks().forEach(function (t) {
    var path = document.createElement("div");
    path.className = "c-track-path";
    path.id = "track-" + t.id;
    path.setAttribute("data-track", t.id);
    path.hidden = true;
    // A part with no lessons yet is a heading with nothing under it, which reads
    // as a broken page rather than as a plan. The registry keeps the whole
    // syllabus; the page shows the parts that have something in them.
    var filled = t.parts.filter(function (p) { return p.lessons.length > 0; });
    path.innerHTML = '<ol class="c-path">' + filled.map(partHTML).join("") + '</ol>';
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
    if (subSwitchEl) subSwitchEl.hidden = true;
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
    var group = groupOf(name);
    if (switchEl && group) {
      Array.prototype.slice.call(switchEl.querySelectorAll(".c-switch-btn")).forEach(function (b) {
        b.classList.toggle("is-active", b.getAttribute("data-track") === group.lead.id);
      });
    }
    paintSubSwitch(group, name);
    // The stored id is the MEMBER, and the tab is derived from its group. Storing
    // the group instead would remember the tab and forget which half you were on.
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

  // The second level. Absent for a group of one, so three of the four tabs look
  // exactly as they did.
  function paintSubSwitch(group, selected) {
    if (!subSwitchEl) return;
    if (!group || group.members.length < 2) {
      subSwitchEl.hidden = true;
      subSwitchEl.innerHTML = "";
      return;
    }
    subSwitchEl.hidden = false;
    subSwitchEl.innerHTML = group.members.map(function (m) {
      var txt = trackText(m);
      var count = m.parts.reduce(function (n, p) { return n + p.lessons.length; }, 0);
      var word = count === 1 ? tr("landing.lesson", "lesson") : tr("landing.lessons", "lessons");
      return '<button type="button" class="c-sub-btn' + (m.id === selected ? " is-active" : "") +
        '" data-track="' + m.id + '" role="tab" aria-selected="' + (m.id === selected) + '">' +
        txt.groupLabel + '<small>' + count + " " + word + "</small></button>";
    }).join("");
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
      if (!b) return;
      // A tab names a GROUP. Land on its first member unless you were already
      // inside this group, in which case stay on the half you were reading.
      var g = groupOf(b.getAttribute("data-track"));
      var target = (g && groupOf(current) === g) ? current : (g ? g.lead.id : b.getAttribute("data-track"));
      showTrack(target, true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
  if (subSwitchEl) {
    subSwitchEl.addEventListener("click", function (e) {
      var b = e.target.closest(".c-sub-btn");
      if (b) showTrack(b.getAttribute("data-track"), true);
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
    // Icon-only controls carry their whole accessible name in aria-label, so a
    // screen reader gets the page language only if these are translated too.
    function setAria(sel, key) {
      var el = document.querySelector(sel);
      if (el) el.setAttribute("aria-label", tr(key, el.getAttribute("aria-label") || ""));
    }
    setAria("#cJbEdgeL", "landing.scrollLeft");
    setAria("#cJbEdgeR", "landing.scrollRight");
    setAria("#trackSwitch", "landing.chooseTrack");
    setAria("#trackSubSwitch", "landing.chooseHalf");
    setAria("#cTotop", "landing.backToTop");
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
    // i18n-ignore: a language switch names its TARGET language in that language - translating it defeats the control
    btn.setAttribute("aria-label", toEs ? "Cambiar a espa\u00f1ol" : "Switch to English");
    btn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm6.9 6h-3a15 15 0 0 0-1.2-3.3A8 8 0 0 1 18.9 8ZM12 4c.7 0 1.7 1.4 2.3 4H9.7C10.3 5.4 11.3 4 12 4ZM4.3 14a8 8 0 0 1 0-4h3.2a17 17 0 0 0 0 4Zm.8 2h3a15 15 0 0 0 1.2 3.3A8 8 0 0 1 5.1 16Zm3-8h-3a8 8 0 0 1 4.2-3.3A15 15 0 0 0 8.1 8ZM12 20c-.7 0-1.7-1.4-2.3-4h4.6c-.6 2.6-1.6 4-2.3 4Zm2.7-6H9.3a15 15 0 0 1 0-4h5.4a15 15 0 0 1 0 4Zm.2 5.3a15 15 0 0 0 1.2-3.3h3a8 8 0 0 1-4.2 3.3ZM16.5 14a17 17 0 0 0 0-4h3.2a8 8 0 0 1 0 4Z"/></svg><span>' + (toEs ? "Espa\u00f1ol" : "English") + "</span>"; // i18n-ignore: same - the switch label is the target language's own name
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
      fetch("generated/landing-i18n.es.json").then(function (r) { return r.json(); }).catch(function () { return null; })
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
