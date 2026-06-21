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
//   pain?, map?, mermaid?, quiz?{ question, options[{ text, correct }], answerWhy } }.
// A card with a quiz shows the knowledge check above the fill-in-the-blank; the
// right option must also be picked before the card awards XP.
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
    quiz: el("Quiz"),
    question: el("Question"),
    options: el("Options"),
    quizFeedback: el("QuizFeedback"),
    code: el("Code"),
    points: el("Points"),
    diagram: el("Diagram"),
    inputs: el("Inputs"),
    result: el("Result"),
    resultTitle: el("ResultTitle"),
    resultBody: el("ResultBody"),
    resultList: el("ResultList"),
    run: el("Run"),
    errors: el("Errors"),
    output: el("Output"),
    prev: el("Prev"),
    next: el("Next"),
    hint: el("Hint"),
    check: el("Check"),
    show: el("Show"),
    reset: el("Reset"),
    summary: el("Summary"),
    summaryIntro: el("SummaryIntro"),
    summaryList: el("SummaryList"),
    summaryClose: el("SummaryClose"),
  };
  const courseXpLabel = document.getElementById("courseXpLabel");
  const codeWrap = els.code ? els.code.closest(".code-wrap") : null;

  const runner =
    runnablePrograms.length && window.CodeLab
      ? new CodeLab.RoslynIframeRunner({ url: runnerUrl })
      : null;

  let idx = 0;
  const progress = drills.map((d) => d.blanks.map(() => ({ value: "", hint: -1 })));
  // Per-card quiz state: which option index the learner picked (-1 = none).
  const quizState = drills.map(() => ({ chosen: -1 }));
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

  // ---- optional multiple-choice quiz -------------------------------------
  // A card may pose a knowledge-check question above the fill-in-the-blank.
  // Picking an option gives immediate feedback; the right pick is also required
  // before the card pays XP (see check()).
  function quizAnswered(d, i) {
    if (!d.quiz) return true;
    const chosen = quizState[i].chosen;
    return chosen >= 0 && Boolean(d.quiz.options[chosen] && d.quiz.options[chosen].correct);
  }

  function setQuizFeedback(d) {
    if (!els.quizFeedback) return;
    const chosen = quizState[idx].chosen;
    if (chosen < 0) {
      els.quizFeedback.hidden = true;
      els.quizFeedback.textContent = "";
      els.quizFeedback.classList.remove("is-good", "is-bad");
      return;
    }
    const correct = Boolean(d.quiz.options[chosen] && d.quiz.options[chosen].correct);
    els.quizFeedback.hidden = false;
    els.quizFeedback.textContent = `${correct ? "Correct. " : "Not quite. "}${d.quiz.answerWhy || ""}`.trim();
    els.quizFeedback.classList.toggle("is-good", correct);
    els.quizFeedback.classList.toggle("is-bad", !correct);
  }

  function renderQuiz(d) {
    if (!els.quiz) return;
    if (!d.quiz) {
      els.quiz.hidden = true;
      return;
    }
    els.quiz.hidden = false;
    if (els.question) els.question.textContent = d.quiz.question || "";
    if (els.options) {
      els.options.innerHTML = "";
      d.quiz.options.forEach((opt, i) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn";
        btn.textContent = opt.text;
        if (quizState[idx].chosen === i) {
          btn.classList.add(opt.correct ? "correct" : "wrong");
        }
        btn.addEventListener("click", () => {
          quizState[idx].chosen = i;
          [...els.options.children].forEach((c) => c.classList.remove("correct", "wrong"));
          btn.classList.add(opt.correct ? "correct" : "wrong");
          setQuizFeedback(d);
        });
        els.options.appendChild(btn);
      });
    }
    setQuizFeedback(d);
  }

  // ---- render -------------------------------------------------------------
  function setOptional(node, value) {
    if (!node) return;
    const host = node.closest(".pain-box, .map-box") || node;
    if (value) {
      node.textContent = value;
      host.hidden = false;
    } else {
      node.textContent = "";
      host.hidden = true;
    }
  }

  const practiceCount = drills.filter((d) => !d.summary).length;

  function setPracticeVisible(visible) {
    const hosts = [
      els.pain && els.pain.closest(".pain-box"),
      els.map && els.map.closest(".map-box"),
      els.quiz,
      els.code && els.code.closest(".code-wrap"),
      els.run && els.run.closest(".code-actions"),
      els.points && els.points.closest(".coach"),
      els.inputs && els.inputs.closest(".fill-section"),
      els.check && els.check.closest(".actions"),
    ];
    hosts.forEach((h) => {
      if (h) h.hidden = !visible;
    });
    if (!visible && els.output) els.output.hidden = true;
    if (els.summary) els.summary.hidden = visible;
  }

  function renderSummary(d) {
    setPracticeVisible(false);
    if (els.result) els.result.hidden = true;
    if (els.summaryIntro) els.summaryIntro.textContent = d.summaryIntro || "";
    if (els.summaryList) {
      els.summaryList.innerHTML = "";
      (d.summaryItems || []).forEach((item) => {
        const li = document.createElement("li");
        const strong = document.createElement("strong");
        strong.textContent = item.title || "";
        li.appendChild(strong);
        li.appendChild(document.createTextNode(item.text || ""));
        els.summaryList.appendChild(li);
      });
    }
    if (els.summaryClose) els.summaryClose.textContent = d.summaryClose || "";
    if (els.prev) els.prev.disabled = idx === 0;
    if (els.next) els.next.disabled = idx === drills.length - 1;
  }

  function render() {
    const d = drills[idx];
    const s = progress[idx];

    closeExplainOverlay();
    renderCourseXP();

    if (els.meta) els.meta.textContent = metaLabel;
    els.title.textContent = d.title;
    setOptional(els.context, d.context);
    if (els.concept) els.concept.textContent = d.concept || "";
    if (els.progress)
      els.progress.textContent = d.summary
        ? "Recap"
        : `${progressNoun} ${idx + 1} / ${practiceCount}`;

    if (d.summary) {
      renderSummary(d);
      return;
    }

    setPracticeVisible(true);
    setOptional(els.pain, d.pain);
    setOptional(els.map, d.map);

    renderQuiz(d);

    els.code.textContent = withGaps(d.snippet);
    if (window.Prism) Prism.highlightElement(els.code);

    renderDiagram(d);

    const canRun = Boolean(runner && runnablePrograms[idx]);
    if (els.run) {
      els.run.hidden = !canRun;
      els.run.disabled = false;
      els.run.textContent = "Run";
    }
    if (els.output) {
      els.output.hidden = true;
      els.output.textContent = "";
      els.output.classList.remove("is-error");
    }
    clearErrors();

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
    const blanksDone = ok === d.blanks.length;
    const quizOk = quizAnswered(d, idx);
    els.resultBody.textContent = !blanksDone
      ? "Keep going. Use the hint and try again."
      : quizOk
        ? "Good progress. This concept is now reinforced in code form."
        : "Blanks are correct. Now pick the right answer to the knowledge check above to finish this card.";

    if (blanksDone && quizOk && !awarded[idx]) {
      addCourseXP(awardAmount);
      markAwarded(idx);
    }

    els.resultList.innerHTML = "";
    msgs.forEach((m) => {
      const li = document.createElement("li");
      li.textContent = m;
      els.resultList.appendChild(li);
    });
    if (d.quiz && !quizOk) {
      const li = document.createElement("li");
      li.textContent =
        quizState[idx].chosen < 0
          ? "Knowledge check: not answered yet"
          : "Knowledge check: try another option";
      els.resultList.appendChild(li);
    }

    els.result.hidden = false;
  }

  function resetDrill() {
    progress[idx] = drills[idx].blanks.map(() => ({ value: "", hint: -1 }));
    quizState[idx].chosen = -1;
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
      "You can review the expected solution in the inputs, then use Reset to try again from scratch.";
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

  function clearErrors() {
    if (els.errors && window.CodeLab && CodeLab.showErrorPanel)
      CodeLab.showErrorPanel(els.errors, []);
  }

  // Capstone-quality compile-error panel, shared via code-lab.
  function showErrors(list) {
    if (els.errors && window.CodeLab && CodeLab.showErrorPanel) {
      if (els.output) els.output.hidden = true;
      return CodeLab.showErrorPanel(els.errors, list);
    }
    showOutput((list || []).map((e) => e.friendly || e.raw).join("\n"), true);
    return Boolean(list && list.length);
  }

  async function runExample() {
    const code = runnablePrograms[idx];
    if (!code || !runner) return;

    els.run.disabled = true;
    els.run.textContent = "Running...";
    showOutput("Compiling and running...", false);
    clearErrors();

    try {
      const result = await runner.run(code);
      if (result.errors && result.errors.length) {
        showErrors(result.errors);
      } else if (result.runtimeError) {
        clearErrors();
        showOutput(`${result.output}\n${result.runtimeError}`.trim(), true);
      } else {
        clearErrors();
        showOutput(result.output || "(no output)", false);
      }
    } catch (err) {
      showOutput(err.message || "Could not run the example.", true);
    } finally {
      els.run.disabled = false;
      els.run.textContent = "Run";
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
