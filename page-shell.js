// Shared page shell.
//
// Every level/lesson page repeats the same hero block and, for the drill and
// build tracks, the same card scaffold. This script renders those shared parts
// from a small `window.PAGE` config so each page is just its content, not a
// copy of the template.
//
// window.PAGE = {
//   hero: {
//     eyebrow: string,
//     title: string,
//     intro: Array<string | { html: string, class?: string }>,
//     links: Array<{ href: string, label: string }>,
//   },
//   archetype?: "drill" | "build",   // omit for pages with a bespoke body
//   prefix?: string,                 // id prefix used by the matching engine
// }
//
// The hero is rendered into <section class="hero" id="pageHero">. For the drill
// and build archetypes the matching card scaffold is inserted right after it,
// so drill-engine.js / build-engine.js find their prefixed element ids.
(function () {
  // Shared lesson helpers used by both engines (build + drill), so the escaping
  // and inline-markup rules live in one place. Defined before any early return
  // below so the engines can rely on it regardless of this page's config.
  // A tiny storage seam so course progress does not hard-depend on localStorage.
  // Defaults to real localStorage; falls back to an in-memory store when it is
  // unavailable (tests, private mode). A page or test can replace
  // LessonCommon.storage before an engine runs to inject its own.
  function memoryStorage() {
    const map = new Map();
    return {
      getItem: (k) => (map.has(k) ? map.get(k) : null),
      setItem: (k, v) => {
        map.set(k, String(v));
      },
      removeItem: (k) => {
        map.delete(k);
      },
    };
  }
  let defaultStorage;
  try {
    defaultStorage = (typeof localStorage !== "undefined" && localStorage) || memoryStorage();
  } catch (e) {
    defaultStorage = memoryStorage();
  }

  const LessonCommon = {
    escapeHtml(s) {
      return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    },
    // Turn `backtick` spans into inline <code> and **bold** into <strong>.
    renderInline(text) {
      return (text || "")
        .split(/(`[^`]+`|\*\*[^*]+\*\*)/)
        .map((seg) => {
          if (seg.length > 1 && seg.startsWith("`") && seg.endsWith("`"))
            return `<code>${LessonCommon.escapeHtml(seg.slice(1, -1))}</code>`;
          if (seg.length > 3 && seg.startsWith("**") && seg.endsWith("**"))
            return `<strong>${LessonCommon.escapeHtml(seg.slice(2, -2))}</strong>`;
          return LessonCommon.escapeHtml(seg);
        })
        .join("");
    },
    // Which card index the URL hash points at, clamped to [0, count - 1].
    cardFromHash(count) {
      const n = parseInt((location.hash || "").replace(/[^0-9]/g, ""), 10);
      return Number.isFinite(n) ? Math.min(Math.max(n - 1, 0), count - 1) : 0;
    },
    // Storage seam (default: localStorage) and the course progress built on it.
    memoryStorage,
    storage: defaultStorage,
    // Course progress (shared XP counter + which cards already paid out), kept
    // behind the storage seam so grading/XP can be unit-tested with a fake store.
    createProgress(opts) {
      const store = (opts && opts.storage) || LessonCommon.storage;
      const xpKey = opts.xpKey;
      const awardedKey = opts.awardedKey;
      const awarded = JSON.parse(store.getItem(awardedKey) || "{}");
      function xp() {
        return parseInt(store.getItem(xpKey) || "0", 10);
      }
      return {
        xp,
        addXP(amount) {
          store.setItem(xpKey, String(xp() + amount));
          return xp();
        },
        isAwarded(i) {
          return Boolean(awarded[i]);
        },
        markAwarded(i) {
          awarded[i] = true;
          store.setItem(awardedKey, JSON.stringify(awarded));
        },
      };
    },
    // The run-output + compile-error surface for a lesson card. Injecting the
    // two elements keeps the show/hide/error logic in one place instead of
    // copied into each engine. Falls back to plain text output when the shared
    // code-lab error panel is unavailable.
    createOutputPanel(els) {
      const output = (els && els.output) || null;
      const errors = (els && els.errors) || null;
      const panel = () =>
        errors && typeof window !== "undefined" && window.CodeLab && window.CodeLab.showErrorPanel
          ? window.CodeLab.showErrorPanel
          : null;
      function showOutput(text, isError) {
        if (!output) return;
        output.hidden = false;
        output.textContent = text;
        output.classList.toggle("is-error", Boolean(isError));
      }
      function hideOutput() {
        if (!output) return;
        output.hidden = true;
        output.textContent = "";
      }
      function clearErrors() {
        const show = panel();
        if (show) show(errors, []);
      }
      function showErrors(list) {
        const show = panel();
        if (show) {
          if (output) output.hidden = true;
          return show(errors, list);
        }
        showOutput((list || []).map((e) => e.friendly || e.raw).join("\n"), true);
        return Boolean(list && list.length);
      }
      return { showOutput, hideOutput, clearErrors, showErrors };
    },
  };
  window.LessonCommon = LessonCommon;

  const page = window.PAGE;
  if (!page) {
    console.error("page-shell: window.PAGE is missing");
    return;
  }

  const hero = document.getElementById("pageHero");
  if (!hero) {
    console.error("page-shell: <section id=\"pageHero\"> is missing");
    return;
  }

  function heroHTML(h) {
    const intro = (h.intro || [])
      .map((item) => {
        const html = typeof item === "string" ? item : item.html;
        const cls = (typeof item === "object" && item.class) || "subtitle";
        return `<p class="${cls}">${html}</p>`;
      })
      .join("\n");
    const links = (h.links || [])
      .map((l) => `<p class="subtitle"><a href="${l.href}">${l.label}</a></p>`)
      .join("\n");
    return `
      <p class="eyebrow">${h.eyebrow}</p>
      <h1>${h.title}</h1>
      ${intro}
      <p class="subtitle"><strong id="courseXpLabel">Course XP: 0</strong></p>
      ${links}`;
  }

  function drillCard(p) {
    return `
      <section class="card" aria-live="polite">
        <header class="challenge-head">
          <div>
            <p id="${p}Meta" class="meta"></p>
            <h2 id="${p}Title"></h2>
            <p id="${p}Context" class="context"></p>
          </div>
          <div class="badge-group">
            <span id="${p}Concept" class="badge"></span>
            <span id="${p}Progress" class="badge ghost"></span>
          </div>
        </header>

        <section class="pain-box" hidden>
          <h3>The problem</h3>
          <p id="${p}Pain"></p>
        </section>

        <section class="map-box" hidden>
          <h3>Where this fits</h3>
          <p id="${p}Map"></p>
        </section>

        <section id="${p}Quiz" class="quiz-box" hidden>
          <h3>Knowledge check</h3>
          <p id="${p}Question" class="context"></p>
          <div id="${p}Options" class="options"></div>
          <p id="${p}QuizFeedback" class="quiz-feedback" hidden></p>
        </section>

        <div class="code-wrap">
          <pre class="line-numbers"><code id="${p}Code" class="language-csharp"></code></pre>
        </div>
        <div class="code-actions">
          <button id="${p}Run" class="btn" type="button" hidden>Run</button>
        </div>
        <div id="${p}Errors" class="run-errors" hidden></div>
        <pre id="${p}Output" class="run-output" hidden></pre>

        <section class="coach">
          <h3>Goal</h3>
          <ul id="${p}Points" class="coach-list"></ul>
          <div id="${p}Diagram" class="coach-diagram" hidden></div>
        </section>

        <section class="fill-section">
          <h3>Complete the code</h3>
          <div id="${p}Inputs" class="inputs"></div>
        </section>

        <section class="actions">
          <button id="${p}Check" class="btn primary" type="button">Check</button>
          <button id="${p}Hint" class="btn" type="button">Hint</button>
          <button id="${p}Show" class="btn danger" type="button">Show Answer</button>
          <button id="${p}Reset" class="btn" type="button">Reset</button>
        </section>

        <section id="${p}Result" class="result-panel" hidden>
          <h3 id="${p}ResultTitle"></h3>
          <p id="${p}ResultBody"></p>
          <ul id="${p}ResultList"></ul>
        </section>

        <section id="${p}Summary" class="summary-section" hidden>
          <p id="${p}SummaryIntro" class="context"></p>
          <ul id="${p}SummaryList" class="summary-list"></ul>
          <p id="${p}SummaryClose" class="summary-close"></p>
        </section>

        <footer class="nav-row">
          <button id="${p}Prev" class="btn" type="button">Previous</button>
          <button id="${p}Next" class="btn primary" type="button">Next</button>
        </footer>
      </section>`;
  }

  function buildCard(p) {
    return `
      <section class="card" aria-live="polite">
        <header class="challenge-head">
          <div>
            <p id="${p}Meta" class="meta"></p>
            <h2 id="${p}Title"></h2>
            <div id="${p}Context" class="context"></div>
          </div>
          <div class="badge-group">
            <span id="${p}Concept" class="badge"></span>
            <span id="${p}Progress" class="badge ghost"></span>
          </div>
        </header>

        <section id="${p}ExampleWrap" class="example-box" hidden>
          <h3>Here's the pattern</h3>
          <pre class="code-example"><code id="${p}Example" class="language-csharp"></code></pre>
        </section>

        <section class="coach">
          <h3>Goal</h3>
          <ul id="${p}Goal" class="coach-list"></ul>
          <p class="context">
            Expected output: <strong id="${p}Expected" class="expected-line"></strong>
          </p>
        </section>

        <section class="fill-section">
          <h3>Your Code</h3>
          <div id="${p}Editor" class="code-editor-host"></div>
        </section>

        <section class="actions">
          <button id="${p}Run" class="btn primary" type="button">Run</button>
          <button id="${p}Solution" class="btn danger" type="button">Show Solution</button>
          <button id="${p}Reset" class="btn" type="button">Reset</button>
        </section>

        <div id="${p}Errors" class="run-errors" hidden></div>
        <pre id="${p}Output" class="run-output" hidden></pre>

        <section id="${p}Result" class="result-panel" hidden>
          <h3 id="${p}ResultTitle"></h3>
          <p id="${p}ResultBody"></p>
        </section>

        <section id="${p}Summary" class="summary-section" hidden>
          <p id="${p}SummaryIntro" class="context"></p>
          <ul id="${p}SummaryList" class="summary-list"></ul>
          <p id="${p}SummaryClose" class="summary-close"></p>
        </section>

        <footer class="nav-row">
          <button id="${p}Prev" class="btn" type="button">Previous</button>
          <button id="${p}Next" class="btn primary" type="button">Next</button>
        </footer>
      </section>`;
  }

  // Course order, so a lesson's final "Next" advances to the next lesson
  // instead of dead-ending. Maintained in one place; a page may override by
  // setting window.PAGE.nextHref itself.
  const PRACTICAL = [
    "foundations.html", "practice-the-basics.html", "control-flow.html", "writing-methods.html",
    "reading-objects.html", "reuse-without-regret.html",
    "type-conversion.html", "strings.html", "arrays.html", "class-members.html",
    "null-safety.html", "access-properties.html", "type-system.html",
    "collections.html", "data-shapes.html", "lambdas.html", "linq.html", "errors-null.html", "generics.html",
    "encapsulation.html", "interfaces.html", "polymorphism.html", "composition.html",
    "dependency-injection.html", "testing-basics.html", "test-doubles.html", "testable-design.html",
    "the-solid-principles.html", "level3-app/",
  ];
  const THEORY = [
    "theory-1.html", "theory-2.html", "theory-3.html", "theory-4.html", "theory-5.html",
    "theory-6.html", "theory-7.html", "theory-check-1.html", "theory-8.html", "theory-9.html", "theory-10.html",
    "theory-11.html", "theory-12.html", "theory-13.html", "theory-14.html", "theory-check-2.html",
    "theory-15.html", "theory-16.html", "theory-17.html", "theory-18.html", "theory-19.html", "theory-check-3.html",
    "theory-21.html", "theory-20.html", "theory-check-4.html",
    "ai-1.html", "ai-2.html", "ai-3.html", "ai-9.html", "ai-10.html",
    "ai-4.html", "ai-5.html",
    "ai-6.html", "ai-7.html", "ai-14.html", "ai-8.html", "ai-13.html",
    "ai-15.html", "ai-16.html", "ai-17.html", "ai-18.html",
    "ai-19.html", "ai-20.html", "ai-21.html", "ai-22.html", "ai-23.html",
  ];
  if (!page.nextHref) {
    const current = (location.pathname.split("/").pop() || "").toLowerCase();
    let href = "index.html";
    for (const list of [PRACTICAL, THEORY]) {
      const i = list.findIndex((f) => f.toLowerCase() === current);
      if (i >= 0) {
        href = i < list.length - 1 ? list[i + 1] : "index.html";
        break;
      }
    }
    page.nextHref = href;
  }

  hero.innerHTML = heroHTML(page.hero);

  if (page.archetype === "drill") {
    hero.insertAdjacentHTML("afterend", drillCard(page.prefix));
  } else if (page.archetype === "build") {
    hero.insertAdjacentHTML("afterend", buildCard(page.prefix));
  }

  // Optional interactive visual for a lesson, supplied as a DECOUPLED data file
  // (window.LESSON_VIZ, e.g. theory-N.viz.js) and mounted once, right under the
  // hero. Keeps the lesson's text (drill data) and its visual (viz config) apart.
  if (window.LESSON_VIZ && window.CodeLab && window.CodeLab.MemoryViz) {
    const vizHost = document.createElement("section");
    vizHost.className = "lesson-viz";
    hero.insertAdjacentElement("afterend", vizHost);
    if (!window.LESSON_VIZ.nextHref) window.LESSON_VIZ.nextHref = page.nextHref;
    // Track progress: mark the lesson done + award XP when the last step is
    // reached. The key is derived from the page (theory-5.html -> theory_5_awarded)
    // so it matches the card on the index, unless the lesson sets its own.
    if (!window.LESSON_VIZ.awardedKey) {
      const file = (location.pathname.split("/").pop() || "").replace(/\.html$/, "");
      if (/^[a-z0-9]+(-[a-z0-9]+)*$/i.test(file)) {
        window.LESSON_VIZ.awardedKey = file.replace(/-/g, "_") + "_awarded";
      }
    }
    try {
      window.CodeLab.MemoryViz.create(vizHost, window.LESSON_VIZ);
    } catch (err) {
      console.error("lesson-viz mount failed", err);
      vizHost.remove();
    }
  }

  // Optional graded checkpoint, supplied as a DECOUPLED data file
  // (window.QUIZ_CONFIG, e.g. theory-check-N.js) and mounted as the code-lab
  // Quiz component - the assessment logic lives in code-lab, not here.
  if (window.QUIZ_CONFIG && window.CodeLab && window.CodeLab.Quiz) {
    const quizHost = document.createElement("section");
    quizHost.className = "lesson-quiz";
    hero.insertAdjacentElement("afterend", quizHost);
    if (!window.QUIZ_CONFIG.nextHref) window.QUIZ_CONFIG.nextHref = page.nextHref;
    try {
      window.CodeLab.Quiz.create(quizHost, window.QUIZ_CONFIG);
    } catch (err) {
      console.error("quiz mount failed", err);
      quizHost.remove();
    }
  }
})();
