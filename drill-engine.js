// Shared fill-in-the-blank drill engine.
//
// A page provides its data and wiring through `window.DRILL_CONFIG` before this
// script loads, then this engine drives the DOM. The same engine powers every
// fill-in-the-blank track (foundations micro-coding, the Reading Objects bridge,
// and the SOLID drills), so the controller lives in one place instead of being
// copied per page.
//
// Required config:
//   prefix         element id prefix used by the page (e.g. "l1c")
//   metaLabel      small label shown above each drill title
//   drills         array of drill objects
// Optional config:
//   runnablePrograms  array index-aligned with drills; enables the Run button
//   runnerUrl         Roslyn host url (default "level3-app/index.html?runner=1")
//   xpKey             localStorage key for the shared course XP counter
//   awardedKey        localStorage key tracking which drills already paid XP
//   awardAmount       XP granted the first time a drill is fully correct
//   progressNoun      word used in the progress badge (default "Drill")
//
// Drill object: { title, concept, context, snippet (with {{n}} blanks), points[],
//   blanks[{ id, label, answer, accept?[], hints[], explain[{ text, highlight }] }],
//   pain?, map?, mermaid? }.
(function () {
  const cfg = window.DRILL_CONFIG;
  if (!cfg) {
    console.error("drill-engine: window.DRILL_CONFIG is missing");
    return;
  }

  const prefix = cfg.prefix;
  const drills = cfg.drills;
  const runnablePrograms = cfg.runnablePrograms || [];
  const runnerUrl = cfg.runnerUrl || "level3-app/index.html?runner=1";
  const xpKey = cfg.xpKey || "course_global_xp";
  const awardedKey = cfg.awardedKey || `${prefix}_awarded`;
  const awardAmount = typeof cfg.awardAmount === "number" ? cfg.awardAmount : 20;
  const progressNoun = cfg.progressNoun || "Drill";
  const metaLabel = cfg.metaLabel || "";

  const el = (suffix) => document.getElementById(prefix + suffix);

  const els = {
    meta: el("Meta"),
    title: el("Title"),
    context: el("Context"),
    pain: el("Pain"),
    map: el("Map"),
    concept: el("Concept"),
    progress: el("Progress"),
    code: el("Code"),
    points: el("Points"),
    diagram: el("Diagram"),
    inputs: el("Inputs"),
    result: el("Result"),
    resultTitle: el("ResultTitle"),
    resultBody: el("ResultBody"),
    resultList: el("ResultList"),
    run: el("Run"),
    output: el("Output"),
    prev: el("Prev"),
    next: el("Next"),
    hint: el("Hint"),
    check: el("Check"),
    show: el("Show"),
    reset: el("Reset"),
  };
  const courseXpLabel = document.getElementById("courseXpLabel");
  const codeWrap = els.code ? els.code.closest(".code-wrap") : null;

  const runner =
    runnablePrograms.length && window.CodeLab
      ? new CodeLab.RoslynIframeRunner({ url: runnerUrl })
      : null;

  let idx = 0;
  const progress = drills.map((d) => d.blanks.map(() => ({ value: "", hint: -1 })));
  const awarded = JSON.parse(localStorage.getItem(awardedKey) || "{}");

  // ---- XP -----------------------------------------------------------------
  function loadCourseXP() {
    return parseInt(localStorage.getItem(xpKey) || "0", 10);
  }
  function renderCourseXP() {
    if (courseXpLabel) courseXpLabel.textContent = `Course XP: ${loadCourseXP()}`;
  }
  function addCourseXP(amount) {
    localStorage.setItem(xpKey, String(loadCourseXP() + amount));
    renderCourseXP();
  }
  function markAwarded(i) {
    awarded[i] = true;
    localStorage.setItem(awardedKey, JSON.stringify(awarded));
  }

  // ---- text helpers -------------------------------------------------------
  function norm(text) {
    return text.replace(/\s+/g, " ").trim().toLowerCase();
  }
  function canonical(text) {
    return text.trim().replace(/;\s*$/g, "").replace(/\s+/g, "").toLowerCase();
  }
  function withGaps(snippet) {
    return snippet.replace(/\{\{(\d+)\}\}/g, (_, n) => `__${n}__`);
  }

  // ---- code line highlight ------------------------------------------------
  let currentHighlightEl = null;
  function clearCodeHighlight() {
    if (currentHighlightEl) {
      currentHighlightEl.remove();
      currentHighlightEl = null;
    }
  }
  function applyCodeHighlight(snippet, highlightStr) {
    clearCodeHighlight();
    if (!highlightStr || !codeWrap) return;
    const pre = codeWrap.querySelector("pre");
    if (!pre) return;

    const clean = highlightStr.replace(/\{\{\d+\}\}/g, "").trim();
    if (!clean) return;
    const lines = snippet.split("\n");
    const lineIndex = lines.findIndex((l) =>
      l.replace(/\{\{\d+\}\}/g, "").includes(clean)
    );
    if (lineIndex < 0) return;

    const lineSpans = pre.querySelectorAll(".line-numbers-rows > span");
    if (!lineSpans[lineIndex]) return;

    const span = lineSpans[lineIndex];
    const preRect = pre.getBoundingClientRect();
    const spanRect = span.getBoundingClientRect();
    const top = spanRect.top - preRect.top + pre.scrollTop;
    const height = Math.max(spanRect.height, 20);

    const hl = document.createElement("div");
    hl.className = "code-line-hl";
    hl.style.top = `${top}px`;
    hl.style.height = `${height}px`;
    pre.style.position = "relative";
    pre.appendChild(hl);
    currentHighlightEl = hl;
    hl.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  // ---- explain overlay ----------------------------------------------------
  let explainOverlay, explainCard, explainTitle, explainBody;

  function ensureExplainOverlay() {
    if (explainOverlay) return;

    explainOverlay = document.createElement("div");
    explainOverlay.className = "explain-overlay";
    explainOverlay.hidden = true;

    explainCard = document.createElement("div");
    explainCard.className = "explain-card";
    explainCard.hidden = true;

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "btn explain-close";
    closeBtn.textContent = "Close";
    closeBtn.addEventListener("click", closeExplainOverlay);

    explainTitle = document.createElement("h4");
    explainTitle.className = "explain-title";

    explainBody = document.createElement("div");
    explainBody.className = "explain-text";

    explainCard.append(explainTitle, explainBody, closeBtn);
    document.body.appendChild(explainOverlay);
    document.body.appendChild(explainCard);

    explainOverlay.addEventListener("click", (event) => {
      if (event.target === explainOverlay) closeExplainOverlay();
    });
  }

  function closeExplainOverlay() {
    if (!explainOverlay) return;
    explainOverlay.hidden = true;
    if (explainCard) explainCard.hidden = true;
    explainOverlay.style.clipPath = "";
    clearCodeHighlight();
    if (codeWrap) codeWrap.classList.remove("code-spotlight");
  }

  function updateOverlayClipPath() {
    if (!codeWrap || !explainOverlay) return;
    const r = codeWrap.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const d = `M0 0 H${vw} V${vh} H0 Z M${r.left} ${r.top} H${r.right} V${r.bottom} H${r.left} Z`;
    explainOverlay.style.clipPath = `path(evenodd, '${d}')`;
  }

  function positionExplainCard() {
    if (!explainCard) return;
    const cardWidth = Math.min(560, window.innerWidth - 32);
    const left = Math.max(16, Math.floor((window.innerWidth - cardWidth) / 2));
    explainCard.style.left = `${left}px`;
    explainCard.style.top = "";
    explainCard.style.bottom = "16px";
    explainCard.style.maxHeight = `${Math.floor(window.innerHeight * 0.38)}px`;
    explainCard.style.overflowY = "auto";
  }

  function showExplainOverlay(steps, snippet) {
    ensureExplainOverlay();
    explainTitle.textContent = "What this part of the code does";
    explainBody.innerHTML = "";

    const ol = document.createElement("ol");
    ol.className = "explain-steps";

    steps.forEach((step) => {
      const li = document.createElement("li");
      li.className = "explain-step";
      li.textContent = step.text;
      li.addEventListener("mouseenter", () => {
        ol.querySelectorAll(".explain-step").forEach((e) => e.classList.remove("active"));
        li.classList.add("active");
        applyCodeHighlight(snippet, step.highlight);
      });
      ol.appendChild(li);
    });

    explainBody.appendChild(ol);

    if (steps.length > 0) {
      ol.firstChild.classList.add("active");
      applyCodeHighlight(snippet, steps[0].highlight);
    }

    explainOverlay.hidden = false;
    if (explainCard) explainCard.hidden = false;
    if (codeWrap) {
      codeWrap.scrollIntoView({ behavior: "instant", block: "start" });
      codeWrap.classList.add("code-spotlight");
    }
    requestAnimationFrame(() => {
      updateOverlayClipPath();
      positionExplainCard();
    });
  }

  window.addEventListener("resize", () => {
    if (explainOverlay && !explainOverlay.hidden) {
      updateOverlayClipPath();
      positionExplainCard();
    }
  });

  // ---- optional mermaid diagram ------------------------------------------
  let diagramSeq = 0;
  function renderDiagram(d) {
    if (!els.diagram) return;
    if (!d.mermaid || !window.mermaid) {
      els.diagram.hidden = true;
      els.diagram.innerHTML = "";
      return;
    }
    els.diagram.hidden = false;
    const id = `${prefix}-mmd-${diagramSeq++}`;
    try {
      window.mermaid
        .render(id, d.mermaid)
        .then(({ svg }) => {
          els.diagram.innerHTML = svg;
        })
        .catch(() => {
          els.diagram.hidden = true;
        });
    } catch (_) {
      els.diagram.hidden = true;
    }
  }

  // ---- render -------------------------------------------------------------
  function setOptional(node, value) {
    if (!node) return;
    if (value) {
      node.textContent = value;
      node.hidden = false;
    } else {
      node.textContent = "";
      node.hidden = true;
    }
  }

  function render() {
    const d = drills[idx];
    const s = progress[idx];

    closeExplainOverlay();
    renderCourseXP();

    if (els.meta) els.meta.textContent = metaLabel;
    els.title.textContent = d.title;
    setOptional(els.context, d.context);
    setOptional(els.pain, d.pain);
    setOptional(els.map, d.map);
    if (els.concept) els.concept.textContent = d.concept || "";
    if (els.progress) els.progress.textContent = `${progressNoun} ${idx + 1} / ${drills.length}`;

    els.code.textContent = withGaps(d.snippet);
    if (window.Prism) Prism.highlightElement(els.code);

    renderDiagram(d);

    const canRun = Boolean(runner && runnablePrograms[idx]);
    if (els.run) {
      els.run.hidden = !canRun;
      els.run.disabled = false;
      els.run.textContent = "Run this example";
    }
    if (els.output) {
      els.output.hidden = true;
      els.output.textContent = "";
      els.output.classList.remove("is-error");
    }

    els.points.innerHTML = "";
    (d.points || []).forEach((point) => {
      const li = document.createElement("li");
      li.textContent = point;
      els.points.appendChild(li);
    });

    els.inputs.innerHTML = "";
    d.blanks.forEach((b, i) => {
      const row = document.createElement("div");
      row.className = "input-row";

      const label = document.createElement("label");
      label.setAttribute("for", `${prefix}-${i}`);
      label.textContent = `Blank ${b.id}: ${b.label}`;

      const input = document.createElement("input");
      input.id = `${prefix}-${i}`;
      input.value = s[i].value;
      input.placeholder = "Write short C# code";
      input.addEventListener("input", (e) => {
        s[i].value = e.target.value;
        input.classList.remove("correct", "wrong", "almost");
      });

      const hint = document.createElement("div");
      hint.className = "hint";
      if (s[i].hint >= 0) {
        const n = Math.min(s[i].hint, b.hints.length - 1);
        hint.textContent = `Hint: ${b.hints[n]}`;
      }

      const explainBtn = document.createElement("button");
      explainBtn.type = "button";
      explainBtn.className = "btn explain-btn";
      explainBtn.textContent = "Explain this part";
      explainBtn.addEventListener("click", () => {
        showExplainOverlay(Array.isArray(b.explain) ? b.explain : [], d.snippet);
      });

      row.append(label, input, hint, explainBtn);
      els.inputs.appendChild(row);
    });

    els.result.hidden = true;
    if (els.prev) els.prev.disabled = idx === 0;
    if (els.next) els.next.disabled = idx === drills.length - 1;
  }

  // ---- actions ------------------------------------------------------------
  function showHint() {
    const d = drills[idx];
    const s = progress[idx];
    d.blanks.forEach((b, i) => {
      if (s[i].hint < b.hints.length - 1) s[i].hint += 1;
    });
    render();
  }

  function answersFor(b) {
    return [b.answer, ...(b.accept || [])];
  }

  function check() {
    const d = drills[idx];
    const s = progress[idx];
    const rows = [...els.inputs.querySelectorAll(".input-row")];

    let ok = 0;
    const msgs = [];

    d.blanks.forEach((b, i) => {
      const input = rows[i].querySelector("input");
      const actual = norm(s[i].value);
      const actualCanonical = canonical(s[i].value);
      input.classList.remove("correct", "wrong", "almost");

      const options = answersFor(b);
      const exact = options.some(
        (a) => actual === norm(a) || actualCanonical === canonical(a)
      );
      const close = options.some((a) => {
        const e = norm(a);
        const ec = canonical(a);
        return (
          e.includes(actual) ||
          actual.includes(e) ||
          ec.includes(actualCanonical) ||
          actualCanonical.includes(ec)
        );
      });

      if (exact) {
        ok += 1;
        input.classList.add("correct");
        msgs.push(`Blank ${b.id}: correct`);
      } else if (actual && close) {
        input.classList.add("almost");
        msgs.push(`Blank ${b.id}: close, verify exact syntax`);
      } else {
        input.classList.add("wrong");
        msgs.push(`Blank ${b.id}: expected ${b.answer}`);
      }
    });

    els.resultTitle.textContent = `${ok} / ${d.blanks.length} correct`;
    els.resultBody.textContent =
      ok === d.blanks.length
        ? "Good progress. This concept is now reinforced in code form."
        : "Keep going. Use the hint and try again.";

    if (ok === d.blanks.length && !awarded[idx]) {
      addCourseXP(awardAmount);
      markAwarded(idx);
    }

    els.resultList.innerHTML = "";
    msgs.forEach((m) => {
      const li = document.createElement("li");
      li.textContent = m;
      els.resultList.appendChild(li);
    });

    els.result.hidden = false;
  }

  function resetDrill() {
    progress[idx] = drills[idx].blanks.map(() => ({ value: "", hint: -1 }));
    render();
  }

  function showAnswer() {
    const d = drills[idx];
    const s = progress[idx];

    d.blanks.forEach((b, i) => {
      s[i].value = b.answer;
    });

    render();

    els.resultTitle.textContent = "Answer revealed";
    els.resultBody.textContent =
      "You can review the expected solution in the inputs, then use Reset Drill to try again from scratch.";
    els.resultList.innerHTML = "";
    d.blanks.forEach((b) => {
      const li = document.createElement("li");
      li.textContent = `Blank ${b.id}: ${b.answer}`;
      els.resultList.appendChild(li);
    });
    els.result.hidden = false;
  }

  function showOutput(text, isError) {
    if (!els.output) return;
    els.output.hidden = false;
    els.output.textContent = text;
    els.output.classList.toggle("is-error", Boolean(isError));
  }

  async function runExample() {
    const code = runnablePrograms[idx];
    if (!code || !runner) return;

    els.run.disabled = true;
    els.run.textContent = "Running...";
    showOutput("Compiling and running...", false);

    try {
      const result = await runner.run(code);
      if (result.errors && result.errors.length) {
        showOutput(result.errors.map((e) => e.friendly || e.raw).join("\n"), true);
      } else if (result.runtimeError) {
        showOutput(`${result.output}\n${result.runtimeError}`.trim(), true);
      } else {
        showOutput(result.output || "(no output)", false);
      }
    } catch (err) {
      showOutput(err.message || "Could not run the example.", true);
    } finally {
      els.run.disabled = false;
      els.run.textContent = "Run this example";
    }
  }

  // ---- wiring -------------------------------------------------------------
  if (els.prev)
    els.prev.addEventListener("click", () => {
      idx -= 1;
      render();
    });
  if (els.next)
    els.next.addEventListener("click", () => {
      idx += 1;
      render();
    });
  if (els.hint) els.hint.addEventListener("click", showHint);
  if (els.check) els.check.addEventListener("click", check);
  if (els.show) els.show.addEventListener("click", showAnswer);
  if (els.reset) els.reset.addEventListener("click", resetDrill);
  if (els.run) els.run.addEventListener("click", runExample);

  render();
})();
