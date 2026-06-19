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

        <div class="code-wrap">
          <pre class="line-numbers"><code id="${p}Code" class="language-csharp"></code></pre>
        </div>
        <div class="code-actions">
          <button id="${p}Run" class="btn" type="button" hidden>Run</button>
        </div>
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

        <pre id="${p}Output" class="run-output" hidden></pre>

        <section id="${p}Result" class="result-panel" hidden>
          <h3 id="${p}ResultTitle"></h3>
          <p id="${p}ResultBody"></p>
        </section>

        <footer class="nav-row">
          <button id="${p}Prev" class="btn" type="button">Previous</button>
          <button id="${p}Next" class="btn primary" type="button">Next</button>
        </footer>
      </section>`;
  }

  hero.innerHTML = heroHTML(page.hero);

  if (page.archetype === "drill") {
    hero.insertAdjacentHTML("afterend", drillCard(page.prefix));
  } else if (page.archetype === "build") {
    hero.insertAdjacentHTML("afterend", buildCard(page.prefix));
  }
})();
