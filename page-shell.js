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
            <p id="${p}Context" class="context"></p>
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
    "level1.html", "level1-coding.html", "control-flow.html", "writing-methods.html",
    "reading-objects.html", "level4.html", "first-builds.html", "wiring-it-up.html",
    "collections.html", "data-shapes.html", "linq.html", "errors-null.html", "generics.html",
    "encapsulation.html", "interfaces.html", "polymorphism.html", "composition.html",
    "dependency-injection.html", "level2.html", "level3-app/",
  ];
  const THEORY = [
    "theory-1.html", "theory-2.html", "theory-3.html", "theory-4.html", "theory-5.html",
    "theory-6.html", "theory-7.html", "theory-8.html", "theory-9.html", "theory-10.html",
    "theory-11.html", "theory-12.html", "theory-13.html", "theory-14.html",
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
})();
