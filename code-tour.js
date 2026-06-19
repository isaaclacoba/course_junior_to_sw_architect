// Reusable guided code walkthrough ("Code Tour").
// Renders the code inside a focused modal so highlighting is a class toggle on
// real line elements and scrolling stays contained - no page-scroll fighting,
// no clip-path hole to misalign (the two weak points of the old Level 2 spotlight).
//
// Usage:
//   window.codeTour.open({ title, code, steps });
//   step = { text: string, lines?: number | number[] }   // 1-based line numbers
(function () {
  let overlay;
  let modal;
  let titleEl;
  let codePane;
  let narration;
  let counter;
  let dots;
  let prevBtn;
  let nextBtn;
  let state = null; // { steps, index, lineEls }
  let lastFocused = null;
  let titleId = "tour-title";

  function escapeHtml(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function highlight(line) {
    if (window.Prism && window.Prism.languages && window.Prism.languages.csharp) {
      return window.Prism.highlight(line, window.Prism.languages.csharp, "csharp");
    }
    return escapeHtml(line);
  }

  function normalizeLines(lines) {
    if (lines === undefined || lines === null) return [];
    return Array.isArray(lines) ? lines : [lines];
  }

  function buildDom() {
    if (overlay) return;

    overlay = document.createElement("div");
    overlay.className = "tour-overlay";
    overlay.hidden = true;
    overlay.addEventListener("click", close);

    modal = document.createElement("div");
    modal.className = "tour-modal";
    modal.hidden = true;
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.addEventListener("click", (e) => e.stopPropagation());

    modal.setAttribute("aria-labelledby", titleId);

    const header = document.createElement("div");
    header.className = "tour-header";
    titleEl = document.createElement("h4");
    titleEl.className = "tour-title";
    titleEl.id = titleId;
    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "btn tour-close";
    closeBtn.textContent = "Close";
    closeBtn.addEventListener("click", close);
    header.append(titleEl, closeBtn);

    codePane = document.createElement("div");
    codePane.className = "tour-code-pane";

    narration = document.createElement("p");
    narration.className = "tour-narration";

    const footer = document.createElement("div");
    footer.className = "tour-footer";
    prevBtn = document.createElement("button");
    prevBtn.type = "button";
    prevBtn.className = "btn";
    prevBtn.textContent = "Previous";
    prevBtn.addEventListener("click", () => go(state.index - 1));
    dots = document.createElement("div");
    dots.className = "tour-dots";
    counter = document.createElement("span");
    counter.className = "tour-counter";
    nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = "btn primary";
    nextBtn.textContent = "Next";
    nextBtn.addEventListener("click", () => go(state.index + 1));
    footer.append(prevBtn, dots, counter, nextBtn);

    modal.append(header, codePane, narration, footer);
    document.body.append(overlay, modal);
  }

  function renderCode(code) {
    const lines = code.replace(/\n+$/, "").split("\n");
    codePane.innerHTML = "";
    state.lineEls = lines.map((text, i) => {
      const row = document.createElement("div");
      row.className = "tour-line";

      const num = document.createElement("span");
      num.className = "tour-ln";
      num.textContent = String(i + 1);

      const codeEl = document.createElement("code");
      codeEl.className = "tour-code language-csharp";
      codeEl.innerHTML = text.length ? highlight(text) : "&nbsp;";

      row.append(num, codeEl);
      codePane.appendChild(row);
      return row;
    });
  }

  function renderDots() {
    dots.innerHTML = "";
    state.steps.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "tour-dot" + (i === state.index ? " is-active" : "");
      dot.setAttribute("aria-label", `Step ${i + 1}`);
      dot.addEventListener("click", () => go(i));
      dots.appendChild(dot);
    });
  }

  function scrollWithin(el) {
    const c = codePane.getBoundingClientRect();
    const e = el.getBoundingClientRect();
    if (e.top < c.top) {
      codePane.scrollBy({ top: e.top - c.top - 14, behavior: "smooth" });
    } else if (e.bottom > c.bottom) {
      codePane.scrollBy({ top: e.bottom - c.bottom + 14, behavior: "smooth" });
    }
  }

  function pulseNarration() {
    narration.classList.remove("is-changing");
    // force reflow so the animation restarts on every step change
    void narration.offsetWidth;
    narration.classList.add("is-changing");
  }

  function applyStep() {
    const step = state.steps[state.index];
    const active = normalizeLines(step.lines);

    state.lineEls.forEach((el, i) => {
      const isActive = active.includes(i + 1);
      el.classList.toggle("is-active", isActive);
      el.classList.toggle("is-dim", active.length > 0 && !isActive);
    });

    narration.textContent = step.text || "";
    pulseNarration();
    counter.textContent = `${state.index + 1} / ${state.steps.length}`;
    prevBtn.disabled = state.index === 0;
    nextBtn.disabled = state.index === state.steps.length - 1;
    renderDots();

    if (active.length) scrollWithin(state.lineEls[active[0] - 1]);
  }

  function go(index) {
    if (!state || index < 0 || index >= state.steps.length) return;
    state.index = index;
    applyStep();
  }

  function focusableEls() {
    return [...modal.querySelectorAll("button:not([disabled])")];
  }

  function trapTab(e) {
    const els = focusableEls();
    if (!els.length) return;
    const first = els[0];
    const last = els[els.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function onKey(e) {
    if (e.key === "Escape") close();
    else if (e.key === "Tab") trapTab(e);
    else if (e.key === "ArrowRight") go(state.index + 1);
    else if (e.key === "ArrowLeft") go(state.index - 1);
  }

  function open({ title, code, steps }) {
    buildDom();
    lastFocused = document.activeElement;
    const safeSteps = Array.isArray(steps) && steps.length ? steps : [{ text: "", lines: [] }];
    state = { steps: safeSteps, index: 0, lineEls: [] };
    titleEl.textContent = title || "Walk me through the code";
    renderCode(code || "");
    codePane.scrollTop = 0;
    applyStep();
    overlay.hidden = false;
    modal.hidden = false;
    document.addEventListener("keydown", onKey);
    const focusables = focusableEls();
    if (focusables.length) focusables[focusables.length - 1].focus();
  }

  function close() {
    if (!overlay) return;
    overlay.hidden = true;
    modal.hidden = true;
    document.removeEventListener("keydown", onKey);
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
    lastFocused = null;
  }

  window.codeTour = { open, close };
})();
