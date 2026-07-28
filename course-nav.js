/**
 * course-nav.js - the on-page navigation engine for the index.
 *
 * Everything about moving around a long track lives here and nowhere else:
 * the sticky frosted jump bar with its gliding scrollspy indicator, the edge
 * cues plus wheel and drag scrolling, folding completed parts into a slim
 * summary row, resume-to-your-current-lesson, back-to-top, and the scroll
 * progress line.
 *
 * It owns no data and builds no cards - course-index.js builds the DOM from the
 * manifest and hands this engine the active track and its container. The two
 * talk through a small API (init / setTrack / refresh / hide) and the DOM.
 */
(function (global) {
  var chev = '<svg class="c-part-chev" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';
  var pillCheck = '<svg class="c-jb-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>';
  var partTick = '<svg class="c-part-tick" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>';

  var r = {};            // DOM refs, set in init
  var container = null;  // active track's DOM container
  var parts = [];        // .c-part elements for the active track
  var pills = [];        // jump-bar pill buttons for the active track
  var activePill = -1;
  var spy = null;
  var active = false;    // is a track currently shown

  function setActivePill(i) {
    if (i === activePill || !pills[i]) return;
    activePill = i;
    pills.forEach(function (p, k) { p.classList.toggle("is-active", k === i); });
    var pill = pills[i];
    r.indicator.style.width = pill.offsetWidth + "px";
    r.indicator.style.transform = "translateX(" + pill.offsetLeft + "px)";
    var pl = pill.offsetLeft, pr = pl + pill.offsetWidth,
        vl = r.jbScroll.scrollLeft, vr = vl + r.jbScroll.clientWidth;
    if (pl < vl) r.jbScroll.scrollTo({ left: pl - 16, behavior: "smooth" });
    else if (pr > vr) r.jbScroll.scrollTo({ left: pr - r.jbScroll.clientWidth + 16, behavior: "smooth" });
    updateEdges();
  }

  function jumpToPart(i) {
    if (!parts[i]) return;
    var y = parts[i].getBoundingClientRect().top + window.pageYOffset - 64;
    window.scrollTo({ top: y, behavior: "smooth" });
  }

  function bindSpy() {
    if (spy) spy.disconnect();
    spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) setActivePill(parts.indexOf(e.target));
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    parts.forEach(function (p) { spy.observe(p); });
  }

  function updateEdges() {
    if (!r.jbScroll) return;
    var max = r.jbScroll.scrollWidth - r.jbScroll.clientWidth;
    r.edgeL.classList.toggle("show", r.jbScroll.scrollLeft > 4);
    r.edgeR.classList.toggle("show", r.jbScroll.scrollLeft < max - 4);
  }

  function nudge(dir) {
    r.jbScroll.scrollBy({ left: dir * Math.round(r.jbScroll.clientWidth * 0.7), behavior: "smooth" });
  }

  function buildPills(track) {
    r.jbTrack.querySelectorAll(".c-jb-pill").forEach(function (n) { n.remove(); });
    pills = [];
    track.parts.forEach(function (p, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "c-jb-pill";
      b.innerHTML = pillCheck + '<span class="c-jb-num">' + ("0" + (i + 1)).slice(-2) + "</span>" + p.title;
      b.addEventListener("click", function () { jumpToPart(i); });
      r.jbTrack.appendChild(b);
      pills.push(b);
    });
    activePill = -1;
    if (r.jbScroll) r.jbScroll.scrollLeft = 0;
  }

  // Fold fully-completed parts into a slim summary row and mark the jump pill.
  // Reads the data-status the index has already painted onto each card.
  function markParts() {
    if (!container) return;
    Array.prototype.slice.call(container.querySelectorAll(".c-part")).forEach(function (pl, i) {
      var cards = Array.prototype.slice.call(pl.querySelectorAll(".c-card"))
        .filter(function (c) { return c.getAttribute("data-status") !== "final"; });
      var total = cards.length;
      var doneN = cards.filter(function (c) { return c.getAttribute("data-status") === "done"; }).length;
      var full = total > 0 && doneN === total;
      pl.classList.toggle("is-done", full);
      if (!full) pl.classList.remove("open");
      var badge = pl.querySelector(".c-part-badge");
      if (badge) badge.innerHTML = full ? total + " lessons \u00b7 done" + partTick : "";
      if (pills[i]) pills[i].classList.toggle("is-done", full);
    });
  }

  function bindPartToggles() {
    Array.prototype.slice.call(container.querySelectorAll(".c-part")).forEach(function (pl) {
      var head = pl.querySelector(".c-part-head");
      if (!head || head.dataset.bound) return;
      head.dataset.bound = "1";
      head.addEventListener("click", function () {
        if (pl.classList.contains("is-done")) pl.classList.toggle("open");
      });
    });
  }

  function resume() {
    if (!container) return;
    var card = container.querySelector('.c-card[data-status="progress"],.c-card[data-status="todo"]');
    if (!card) { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    var part = card.closest(".c-part");
    if (part && part.classList.contains("is-done")) part.classList.add("open");
    var y = card.getBoundingClientRect().top + window.pageYOffset - 90;
    window.scrollTo({ top: y, behavior: "smooth" });
    setTimeout(function () {
      card.classList.add("c-pulse");
      setTimeout(function () { card.classList.remove("c-pulse"); }, 1500);
    }, 420);
  }

  function onScroll() {
    var y = window.pageYOffset, h = document.documentElement.scrollHeight - window.innerHeight;
    if (r.scrollprog) r.scrollprog.style.width = (h > 0 ? (y / h * 100) : 0) + "%";
    if (r.jumpbar && active) {
      var pastHero = r.activeEl && r.activeEl.getBoundingClientRect().bottom < 8;
      r.jumpbar.classList.toggle("is-visible", pastHero);
    }
    if (r.totop) r.totop.classList.toggle("is-visible", y > 620);
  }

  var CourseNav = {
    // Grab DOM refs once and wire the handlers that never change.
    init: function (refs) {
      r = refs;
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", function () {
        updateEdges();
        if (activePill >= 0 && pills[activePill]) {
          var p = pills[activePill];
          r.indicator.style.width = p.offsetWidth + "px";
          r.indicator.style.transform = "translateX(" + p.offsetLeft + "px)";
        }
      });
      if (r.edgeL) r.edgeL.addEventListener("click", function () { nudge(-1); });
      if (r.edgeR) r.edgeR.addEventListener("click", function () { nudge(1); });
      if (r.jbScroll) {
        r.jbScroll.addEventListener("scroll", updateEdges, { passive: true });
        r.jbScroll.addEventListener("wheel", function (e) {
          if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) { r.jbScroll.scrollLeft += e.deltaY; e.preventDefault(); }
        }, { passive: false });
        var down = false, sx = 0, sl = 0;
        r.jbScroll.addEventListener("pointerdown", function (e) {
          down = true; sx = e.clientX; sl = r.jbScroll.scrollLeft; r.jbScroll.setPointerCapture(e.pointerId);
        });
        r.jbScroll.addEventListener("pointermove", function (e) {
          if (!down) return;
          var dx = e.clientX - sx;
          if (Math.abs(dx) > 3) r.jbScroll.classList.add("is-dragging");
          r.jbScroll.scrollLeft = sl - dx;
        });
        var end = function () { down = false; r.jbScroll.classList.remove("is-dragging"); };
        r.jbScroll.addEventListener("pointerup", end);
        r.jbScroll.addEventListener("pointercancel", end);
      }
      if (r.jbCta) r.jbCta.addEventListener("click", resume);
      if (r.totop) r.totop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
    },

    // Switch the engine to a freshly shown track and its container.
    setTrack: function (track, el) {
      container = el;
      active = true;
      buildPills(track);
      parts = Array.prototype.slice.call(container.querySelectorAll(".c-part"));
      bindPartToggles();
      bindSpy();
      updateEdges();
      onScroll();
    },

    // Re-fold completed parts and update the count, after statuses are painted.
    refresh: function (summary) {
      if (r.jbCount && summary) r.jbCount.textContent = summary.done + " / " + summary.tracked;
      markParts();
    },

    // Hide the bar when the chooser is shown (no active track).
    hide: function () {
      active = false;
      if (r.jumpbar) r.jumpbar.classList.remove("is-visible");
    }
  };

  global.CourseNav = CourseNav;
})(typeof window !== "undefined" ? window : this);
