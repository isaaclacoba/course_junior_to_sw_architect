  // Course order lives in generated/course-data.js (window.CourseData). A
  // lesson's final "Next" advances to the next lesson in the same track; a page
  // may still override by setting window.PAGE.nextHref itself. If the course
  // data is not loaded, "Next" simply returns to the index rather than guessing
  // an order here.
  if (!page.nextHref) {
    var href = "index.html";
    var course = window.CourseData || window.Course;
    if (course && typeof course.locate === "function") {
      var current = (location.pathname.split("/").pop() || "").toLowerCase();
      var metaId = window.LESSON_META && window.LESSON_META.id;
      // A migrated page's filename is always "index.html", so its id is the only
      // reliable key - never fall back to locate(current), which would match an
      // arbitrary lesson. A flat legacy page keys on its filename.
      var loc = metaId && typeof course.locateById === "function"
        ? course.locateById(metaId)
        : course.locate(current);
      if (loc && loc.order) {
        href = loc.index < loc.order.length - 1 ? loc.order[loc.index + 1] : "index.html";
      }
    }
    // A generated lesson page lives four dirs deep (content/<track>/<part>/<lesson>/),
    // so a root-relative next href needs the same prefix the page's assets use.
    var rootPrefix = (window.LESSON_META && window.LESSON_META.id) ? "../../../../" : "";
    page.nextHref = rootPrefix + href;
  }

  hero.innerHTML = heroHTML(page.hero);
  renderAgenda();
  // The hero's intro is a Localizable content element (text, no logic); a kernel
  // lesson controller holds this and calls setLocale() on a voice/lang change.
  window.PageShellHero = { setLocale: repaintHero };

  if (page.archetype === "drill") {
    hero.insertAdjacentHTML("afterend", drillCard(page.prefix));
  } else if (page.archetype === "build") {
    hero.insertAdjacentHTML("afterend", buildCard(page.prefix));
  }

