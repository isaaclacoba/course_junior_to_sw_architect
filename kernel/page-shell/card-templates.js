// The two archetype card scaffolds. drillCard is dormant (no live lesson uses
// the drill engine today) but is kept as the base for a future exam track.
//
// A self-contained module: window.PageShellCards in the browser, module.exports in Node
// so a unit test can require() it without loading the whole page shell.
(function (root, factory) {
  "use strict";
  if (typeof module === "object" && module.exports) {
    module.exports = factory(require("./chrome-text.js"));
    return;
  }
  root.PageShellCards = factory(root.PageShellChromeText);
})(typeof window !== "undefined" ? window : globalThis, function (chrome) {
  var tHtml = chrome.tHtml, tAttr = chrome.tAttr, tSlot = chrome.tSlot;

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
          <h3${tAttr("card.pattern")}>${tHtml("card.pattern", "Here's the pattern")}</h3>
          <pre class="code-example"><code id="${p}Example" class="language-csharp"></code></pre>
        </section>

        <section class="coach">
          <h3${tAttr("card.goal")}>${tHtml("card.goal", "Goal")}</h3>
          <ul id="${p}Goal" class="coach-list"></ul>
          <p class="context">
            ${tSlot("card.expected", "Expected output:")} <strong id="${p}Expected" class="expected-line"></strong>
          </p>
        </section>

        <section class="fill-section">
          <h3${tAttr("card.yourcode")}>${tHtml("card.yourcode", "Your Code")}</h3>
          <div id="${p}Editor" class="code-editor-host"></div>
        </section>

        <section class="actions">
          <button id="${p}Run" class="btn primary" type="button">${tHtml("nav.run", "Run")}</button>
          <button id="${p}Solution" class="btn danger" type="button"${tAttr("nav.solution")}>${tHtml("nav.solution", "Show Solution")}</button>
          <button id="${p}Reset" class="btn" type="button"${tAttr("nav.reset")}>${tHtml("nav.reset", "Reset")}</button>
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
          <button id="${p}Prev" class="btn" type="button"${tAttr("nav.prev")}>${tHtml("nav.prev", "Previous")}</button>
          <button id="${p}Next" class="btn primary" type="button">${tHtml("nav.next", "Next")}</button>
        </footer>
      </section>`;
  }

  return { drillCard: drillCard, buildCard: buildCard };
});
