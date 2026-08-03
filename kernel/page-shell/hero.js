  // The hero's intro paragraphs, built from h.intro. Shared by the initial
  // heroHTML render and by repaintHeroIntro (the Localizable swap) so both emit
  // identical markup.
  function heroIntroHTML(h) {
    return (h.intro || [])
      .map((item) => {
        const html = typeof item === "string" ? item : item.html;
        const cls = (typeof item === "object" && item.class) || "subtitle";
        return `<p class="${cls}">${html}</p>`;
      })
      .join("\n");
  }

  function heroHTML(h) {
    const intro = heroIntroHTML(h);
    const links = (h.links || [])
      .map((l) => `<p class="subtitle"><a href="${l.href}">${l.label}</a></p>`)
      .join("\n");
    return `
      <p class="eyebrow">${h.eyebrow}</p>
      <h1>${h.title}</h1>
      ${intro}
      <p class="subtitle"><strong id="courseXpLabel">${tHtml("nav.xp", "Course XP:")} 0</strong></p>
      ${links}`;
  }

  // Localizable content element: repaint the hero's eyebrow, title and intro
  // paragraphs from the (already-refreshed) window.PAGE.hero, in place. Leaves the
  // Course-XP label node, links and agenda untouched - so no cached reference (e.g.
  // the engine's #courseXpLabel) is invalidated. Never runs on the initial render,
  // so the default hero stays byte-identical.
  // The inline (default-language) breadcrumb + document title live in the DOM, not
  // in a bundle - the same snapshot/restore concern the binders have. Delegate to
  // the shared window.ResourceOrigin so switching BACK to the default restores them
  // exactly (bind snapshots each on first sight, restores when resolved is
  // undefined). Never runs on the initial render, so the default stays byte-identical.
  function repaintCrumb(h) {
    let lang = "en";
    try { lang = localStorage.getItem("course_lesson_lang") || "en"; } catch (e) {}
    const metaEl = document.querySelector("p.meta");
    const O = window.ResourceOrigin;
    if (lang === "en") {
      O.bind(document, "title", undefined);
      if (metaEl) O.bind(metaEl, "textContent", undefined);
      return;
    }
    if (h.title) O.bind(document, "title", h.title);
    if (!metaEl || !metaEl.textContent || !h.eyebrow || !h.title) return;
    // The eyebrow reads "<kicker> \u00b7 <part title>"; the breadcrumb wants
    // "<part title> \u00b7 <lesson title>". Reuse the localized pieces already on
    // the page rather than depending on a per-lesson translation.
    const segs = h.eyebrow.split("\u00b7");
    const partTitle = (segs.length > 1 ? segs[segs.length - 1] : segs[0]).trim();
    O.bind(metaEl, "textContent", partTitle + " \u00b7 " + h.title);
  }

  function repaintHero() {
    const h = window.PAGE && window.PAGE.hero;
    if (!h) return;
    const eyebrowEl = hero.querySelector(".eyebrow");
    if (eyebrowEl && h.eyebrow != null) eyebrowEl.textContent = h.eyebrow;
    const h1 = hero.querySelector("h1");
    if (h1 && h.title != null) h1.textContent = h.title;
    // Non-default language only: the breadcrumb + document title were filled from
    // the English registry (not owned by heroHTML), so localize them here. Gated
    // on lang so the default language stays byte-identical.
    repaintCrumb(h);
    const xpLabel = hero.querySelector("#courseXpLabel");
    const anchor = xpLabel ? xpLabel.closest("p") : null;
    if (!anchor || !h1) return;
    // Drop the current intro nodes (everything between <h1> and the XP paragraph).
    let node = h1.nextSibling;
    while (node && node !== anchor) {
      const next = node.nextSibling;
      hero.removeChild(node);
      node = next;
    }
    // Insert fresh intro nodes (identical markup to heroHTML) before the XP p.
    const frag = document.createElement("div");
    frag.innerHTML = heroIntroHTML(h);
    while (frag.firstChild) hero.insertBefore(frag.firstChild, anchor);
  }

