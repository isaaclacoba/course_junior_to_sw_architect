  // ---- Concepts: "In this lesson" agenda + click-to-define panel (Phases 2-3) ----
  // Both the agenda chips and in-prose [[concept:...]] mentions carry a
  // data-concept-id; one delegated click handler opens a shared panel that reads
  // the def from window.ConceptIndex (loaded by the lesson page's script block).

  // A ConceptI18n source (voice/lang-aware, graph as fallback) injected by the
  // kernel-controller. Unset (legacy / non-kernel pages) => read the English
  // graph directly, so the default render stays byte-identical.
  let conceptSource = null;
  // The concept currently shown in the panel, kept in a variable (NOT a data-
  // attribute on the panel) so the panel never matches the [data-concept-id] chip
  // selector - otherwise clicking its close button re-triggers showConcept and the
  // panel re-opens (only the outside-click path would then close it).
  let activeConceptId = null;
  function conceptDef(id) {
    if (conceptSource) return { term: conceptSource.term(id), def: conceptSource.def(id) };
    const CI = window.ConceptIndex;
    return (CI && CI.defs && CI.defs[id]) || null;
  }
  function conceptTerm(id) {
    if (conceptSource) return conceptSource.term(id);
    const d = conceptDef(id);
    return d ? d.term : id;
  }
  // Concepts the learner has answered correctly in a checkpoint (written by
  // CodeLab.Quiz to a shared key); used to mark agenda chips as covered.
  function conceptProgress() {
    try {
      return JSON.parse(localStorage.getItem("course_concept_progress") || "{}") || {};
    } catch (e) {
      return {};
    }
  }

  // "In this lesson" - built from the page's own LESSON_META.concepts.
  function renderAgenda() {
    const existing = hero.querySelector(".lesson-agenda");
    if (existing) existing.remove();
    const meta = window.LESSON_META;
    const c = meta && meta.concepts;
    if (!c) return;
    const covered = conceptProgress();
    const ids = (arr) => (arr || []).map((x) => (typeof x === "string" ? x : x.id));
    const groups = [
      { ids: ids(c.introduces), label: tHtml("agenda.new", "New here"), kind: "introduces" },
      { ids: ids(c.revisits), label: tHtml("agenda.revisited", "Revisited"), kind: "revisits" },
      { ids: ids(c.uses), label: tHtml("agenda.used", "Used"), kind: "uses" },
    ].filter((g) => g.ids.length);
    if (!groups.length) return;
    const rows = groups
      .map((g) => {
        const chips = g.ids
          .map(
            (id) =>
              `<button type="button" class="agenda-chip agenda-chip--${g.kind}${covered[id] ? " is-covered" : ""}" data-concept-id="${LessonCommon.escapeHtml(id)}">${LessonCommon.escapeHtml(conceptTerm(id))}</button>`
          )
          .join("");
        return `<div class="agenda-row"><span class="agenda-label">${g.label}</span>${chips}</div>`;
      })
      .join("");
    hero.insertAdjacentHTML(
      "beforeend",
      `<div class="lesson-agenda" aria-label="Concepts in this lesson"><p class="agenda-title">${tHtml("agenda.title", "In this lesson")}</p>${rows}</div>`
    );
  }

  // One shared panel, created on first use, that shows a concept's definition.
  function conceptPanelEl() {
    let el = document.getElementById("conceptPanel");
    if (el) return el;
    el = document.createElement("div");
    el.id = "conceptPanel";
    el.className = "concept-panel";
    el.hidden = true;
    el.innerHTML =
      '<button type="button" class="concept-panel-close" aria-label="Close">\u00d7</button>' +
      '<p class="concept-panel-term"></p><p class="concept-panel-def"></p><p class="concept-panel-link"></p>';
    document.body.appendChild(el);
    el.querySelector(".concept-panel-close").addEventListener("click", () => { el.hidden = true; });
    return el;
  }
  function showConcept(id) {
    const d = conceptDef(id);
    const panel = conceptPanelEl();
    activeConceptId = id;
    panel.querySelector(".concept-panel-term").textContent = d ? d.term : id;
    panel.querySelector(".concept-panel-def").textContent = d ? d.def : LessonCommon.t("concept.notFound", "Definition not found.");
    const prefix = window.LESSON_META && window.LESSON_META.id ? "../../../../" : "";
    panel.querySelector(".concept-panel-link").innerHTML = `<a href="${prefix}glossary.html">${tHtml("concept.openGlossary", "Open the glossary")}</a>`;
    panel.hidden = false;
  }
  document.addEventListener("click", (e) => {
    const btn = e.target && e.target.closest ? e.target.closest("[data-concept-id]") : null;
    if (btn) { showConcept(btn.getAttribute("data-concept-id")); return; }
    const panel = document.getElementById("conceptPanel");
    if (panel && !panel.hidden && !panel.contains(e.target)) panel.hidden = true;
  });

  // Localizable surface: the kernel-controller injects a ConceptI18n source and,
  // on a language swap, calls setLocale() to re-localize the agenda chips + an
  // open panel. Never runs on the default render, so it stays byte-identical.
  window.PageShellConcepts = {
    setConceptSource: function (src) { conceptSource = src; },
    setLocale: function () {
      renderAgenda();
      const panel = document.getElementById("conceptPanel");
      if (panel && !panel.hidden && activeConceptId) showConcept(activeConceptId);
    }
  };

