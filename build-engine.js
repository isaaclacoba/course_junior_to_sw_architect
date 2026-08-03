// Generic write-from-scratch lesson engine. Reads window.BUILD_CONFIG and drives
// a write-the-code / run-it / match-the-output loop through the shared Roslyn host.
// The editor surface is CodeLab.MonacoEditor (the same Monaco editor used by
// level3-app). Elements are resolved by id as prefix + suffix.
// Grading: the program output must contain a line equal to task.expected.
(function () {
  "use strict";

  // The build widget factory. create(cfg, opts) wires the write/run/match loop over
  // the scaffold page-shell already rendered and returns a controller. It has NO side
  // effects until boot() runs, so a kernel lesson controller can hold the instance and
  // drive it (re-localize in place). Pages that include this file directly self-boot via
  // the footer at the bottom unless their <script> tag carries data-manual.
  function create(cfg, opts) {
    if (!cfg || !Array.isArray(cfg.tasks) || !cfg.tasks.length) {
      return { boot: function () {}, render: function () {} };
    }

    const prefix = cfg.prefix;
    const tasks = cfg.tasks;
    const metaLabel = cfg.metaLabel || "";
    const progressNoun = cfg.progressNoun || "Task";
    // A migrated lesson lives four dirs deep (content/<track>/<part>/<lesson>/), so
    // the root-relative runner host needs the same prefix its assets use; a flat
    // page (no LESSON_META) keeps the root-relative default.
    const rootPrefix = window.LESSON_META && window.LESSON_META.id ? "../../../../" : "";
    const runnerUrl = cfg.runnerUrl || rootPrefix + "level3-app/index.html?runner=1";
    const xpKey = cfg.xpKey || "course_global_xp";
    const awardedKey = cfg.awardedKey;
    const awardAmount = cfg.awardAmount || 20;
    const nextHref = (window.PAGE && window.PAGE.nextHref) || "index.html";

    const el = (suffix) => document.getElementById(prefix + suffix);

    const editorHost = el("Editor");
    const meta = el("Meta");
    const title = el("Title");
    const context = el("Context");
    const concept = el("Concept");
    const example = el("Example");
    const exampleWrap = el("ExampleWrap");
    const progress = el("Progress");
    const expected = el("Expected");
    const goal = el("Goal");
    const errors = el("Errors");
    const output = el("Output");
    const result = el("Result");
    const resultTitle = el("ResultTitle");
    const resultBody = el("ResultBody");
    const summary = el("Summary");
    const summaryIntro = el("SummaryIntro");
    const summaryList = el("SummaryList");
    const summaryClose = el("SummaryClose");
    const runBtn = el("Run");
    const solutionBtn = el("Solution");
    const resetBtn = el("Reset");
    const prevBtn = el("Prev");
    const nextBtn = el("Next");
    const xpLabel = document.getElementById("courseXpLabel");

    const runner = new CodeLab.RoslynIframeRunner({ url: runnerUrl });
    const editor = new CodeLab.MonacoEditor();

    const code = tasks.map((t) => t.starter);
    const course = LessonCommon.createProgress({ xpKey, awardedKey });
    // A trailing recap card (task.summary) is content, not a build - exclude it
    // from the count shown and from XP.
    const buildCount = tasks.filter((t) => !t.summary).length;
    function cardFromHash() {
      return LessonCommon.cardFromHash(tasks.length);
    }
    let idx = cardFromHash();

    // Chrome text shorthand: LessonCommon.t(key, englishFallback).
    const tr = LessonCommon.t;

    function renderXP() {
      if (xpLabel) xpLabel.textContent = tr("nav.xp", "Course XP:") + " " + course.xp();
    }

    function award(taskIndex) {
      if (course.isAwarded(taskIndex)) return;
      course.markAwarded(taskIndex);
      course.addXP(awardAmount);
      renderXP();
    }

    const outputPanel = LessonCommon.createOutputPanel({ output, errors });
    const showOutput = outputPanel.showOutput;
    const hideOutput = outputPanel.hideOutput;
    const showErrors = outputPanel.showErrors;
    const clearErrors = outputPanel.clearErrors;

    function showResult(ok, body) {
      result.hidden = false;
      result.classList.toggle("is-pass", ok);
      result.classList.toggle("is-fail", !ok);
      resultTitle.textContent = ok ? tr("result.passed", "Passed") : tr("result.notyet", "Not yet");
      resultBody.textContent = body;
    }

    // Remember the last run result as a re-derivable thunk so setLocale can
    // re-paint it in the new language (the title localizes via chrome; the body
    // is re-derived by re-running its producer). The setLocale repaint is gated
    // on the result being visible, so a stale thunk is never shown.
    let lastResult = null;
    function setResult(ok, bodyFn) {
      lastResult = { ok: ok, bodyFn: bodyFn };
      showResult(ok, bodyFn());
    }

    // The C# output-grading policy lives in one shared module
    // (kernel/grading/output-match.js) so the browser engine and the Node verifier
    // grade a lesson the same way and cannot drift. matches/unmetRequirement/
    // describeExpected are pure; the hidden verify probe needs the runner, so it is
    // injected here.
    const Grading = window.KernelGrading;
    if (!Grading) {
      if (window.console) window.console.error("build-engine: window.KernelGrading missing - load kernel/grading/output-match.js before build-engine.js");
      return { boot: function () {}, render: function () {} };
    }
    const matches = Grading.matches;
    const unmetRequirement = Grading.unmetRequirement;
    const describeExpected = Grading.describeExpected;
    function passesHiddenVerify(source, verify) {
      return Grading.passesHiddenVerify(source, verify, { run: (src) => runner.run(src) });
    }

    // Escaping and inline `backtick`/**bold** markup are shared with the drill
    // engine; the single source of truth is page-shell's LessonCommon.
    const escapeHtml = LessonCommon.escapeHtml;
    const renderInline = LessonCommon.renderInline;

    // Prose can carry structure: a blank line starts a new paragraph, a run of
    // lines beginning with "- " becomes a bullet list, a single newline is a soft
    // break. Backticks and **bold** render inline.
    function renderProse(text) {
      return (text || "")
        .split(/\n{2,}/)
        .map((block) => {
          const lines = block.split("\n");
          const isList = lines.length > 0 && lines.every((l) => /^\s*-\s+/.test(l));
          if (isList) {
            const items = lines
              .map((l) => `<li>${renderInline(l.replace(/^\s*-\s+/, ""))}</li>`)
              .join("");
            return `<ul class="context-list">${items}</ul>`;
          }
          return `<span class="para">${renderInline(block).replace(/\n/g, "<br>")}</span>`;
        })
        .join("");
    }

    // Toggle the build workflow (example, goal, editor, actions, output) on or off
    // so a trailing recap card can show only its summary, like the drill engine.
    function setPracticeVisible(visible) {
      const hosts = [
        exampleWrap,
        goal && goal.closest(".coach"),
        editorHost && editorHost.closest(".fill-section"),
        runBtn && runBtn.closest(".actions"),
      ];
      hosts.forEach((h) => {
        if (h) h.hidden = !visible;
      });
      if (!visible) {
        if (output) output.hidden = true;
        clearErrors();
        if (result) result.hidden = true;
      }
      if (summary) summary.hidden = visible;
    }

    // Paint just the recap card's prose (intro, item list, close). Split out so
    // setLocale can repaint it without disturbing layout or visibility.
    function paintSummaryProse(task) {
      if (summaryIntro) summaryIntro.innerHTML = renderInline(task.summaryIntro || "");
      if (summaryList) {
        summaryList.innerHTML = "";
        (task.summaryItems || []).forEach((item) => {
          const li = document.createElement("li");
          const strong = document.createElement("strong");
          strong.innerHTML = renderInline(item.title || "");
          li.appendChild(strong);
          const span = document.createElement("span");
          span.innerHTML = renderInline(item.text || "");
          li.appendChild(span);
          summaryList.appendChild(li);
        });
      }
      if (summaryClose) summaryClose.innerHTML = renderInline(task.summaryClose || "");
    }

    function renderSummary(task) {
      setPracticeVisible(false);
      paintSummaryProse(task);
    }

    // Paint the current task's goal checklist. Split out so setLocale reuses it.
    function paintGoal(task) {
      goal.innerHTML = "";
      task.goal.forEach((g) => {
        const li = document.createElement("li");
        li.innerHTML = renderInline(g);
        goal.appendChild(li);
      });
    }

    // Localizable: repaint ONLY the voiced prose of the current card from the
    // already-refreshed cfg. Never touches the editor buffer, card index, run
    // output, or result, so a locale swap leaves the learner's work intact.
    // Re-apply the dynamic chrome the engine owns (the labels page-shell does not
    // carry a data-t for): the XP counter, the Run label, and the idx-dependent Next.
    function applyChrome() {
      renderXP();
      if (runBtn) runBtn.textContent = tr("nav.run", "Run");
      if (nextBtn) {
        nextBtn.textContent = idx === tasks.length - 1 ? tr("nav.nextLesson", "Next lesson") : tr("nav.next", "Next");
      }
    }

    function setLocale() {
      const task = tasks[idx];
      title.textContent = task.title;
      context.innerHTML = renderProse(task.context);
      if (concept) concept.textContent = task.concept;
      if (task.summary) paintSummaryProse(task);
      else paintGoal(task);
      applyChrome();
      if (lastResult && !result.hidden) showResult(lastResult.ok, lastResult.bodyFn());
    }

    function render() {
      const task = tasks[idx];
      try { history.replaceState(null, "", "#" + (idx + 1)); } catch (e) {}
      if (meta) meta.textContent = metaLabel;
      title.textContent = task.title;
      context.innerHTML = renderProse(task.context);
      if (concept) concept.textContent = task.concept;
      progress.textContent = task.summary
        ? tr("card.recap", "Recap")
        : `${progressNoun} ${idx + 1} / ${buildCount}`;

      if (task.summary) {
        renderSummary(task);
        prevBtn.disabled = idx === 0;
        nextBtn.disabled = false;
        nextBtn.textContent = idx === tasks.length - 1 ? tr("nav.nextLesson", "Next lesson") : tr("nav.next", "Next");
        return;
      }

      setPracticeVisible(true);
      if (example && exampleWrap) {
        if (task.example) {
          // Highlight the "here's the pattern" example with Monaco (the same
          // engine as the editor), so no separate highlighter is needed.
          if (window.monaco && monaco.editor && monaco.editor.colorize) {
            example.textContent = task.example;
            monaco.editor
              .colorize(task.example, "csharp", {})
              .then((html) => { example.innerHTML = html; })
              .catch(() => {});
          } else {
            example.textContent = task.example;
          }
          exampleWrap.hidden = false;
        } else {
          example.textContent = "";
          exampleWrap.hidden = true;
        }
      }
      if (expected) {
        expected.textContent = Array.isArray(task.expected)
          ? task.expected.join("\n")
          : task.expected;
      }
      editor.setValue(code[idx]);

      paintGoal(task);

      output.hidden = true;
      clearErrors();
      result.hidden = true;
      prevBtn.disabled = idx === 0;
      nextBtn.disabled = false;
      nextBtn.textContent = idx === tasks.length - 1 ? tr("nav.nextLesson", "Next lesson") : tr("nav.next", "Next");
    }

    async function run() {
      code[idx] = editor.getValue();
      const task = tasks[idx];

      runBtn.disabled = true;
      runBtn.textContent = tr("run.running", "Running...");
      showOutput(tr("run.compiling", "Compiling and running..."), false);
      clearErrors();
      result.hidden = true;

      try {
        const res = await runner.run(code[idx]);
        if (res.errors && res.errors.length) {
          hideOutput();
          showErrors(res.errors);
          if (editor.setMarkers) editor.setMarkers(res.errors);
          setResult(false, () => tr("result.compileFail", "The code did not compile. Read the errors above and try again."));
          return;
        }
        if (editor.setMarkers) editor.setMarkers([]);
        clearErrors();
        if (res.runtimeError) {
          showOutput(`${res.output}\n${res.runtimeError}`.trim(), true);
          setResult(false, () => tr("result.runtimeError", "It ran but threw an error. Fix it and run again."));
          return;
        }
        const out = (res.output || "").trim();
        showOutput(out || tr("run.noOutput", "(no output)"), false);
        const unmet = unmetRequirement(code[idx], task.requireSource);
        if (!matches(out, task.expected)) {
          setResult(false, () => describeExpected(task.expected));
        } else if (unmet) {
          setResult(false, () => unmet);
        } else if (task.verify && !(await passesHiddenVerify(code[idx], task.verify))) {
          setResult(
            false,
            () => task.verify.message ||
              tr("result.verifyFail", "Your code printed the right answer for this example, but a hidden check with different inputs failed. Make the logic work for any input, not just this one.")
          );
        } else {
          award(idx);
          setResult(true, () => tr("result.pass", "Output matched what the task asked for. XP awarded."));
        }
      } catch (err) {
        showOutput(err.message || tr("run.couldNotRun", "Could not run the code."), true);
        setResult(false, () => tr("result.error", "Something went wrong running the code."));
      } finally {
        runBtn.disabled = false;
        runBtn.textContent = tr("nav.run", "Run");
      }
    }

    // The runner warms itself on construction; reflect that in the button so the
    // user knows the first run is being prepared.
    async function warmUp() {
      runBtn.disabled = true;
      runBtn.textContent = tr("run.preparing", "Preparing compiler...");
      try {
        await runner.warm();
      } catch (err) {
        // Warm-up is best effort; the user can still click Run, which retries.
      } finally {
        runBtn.disabled = false;
        runBtn.textContent = tr("nav.run", "Run");
      }
    }

    runBtn.addEventListener("click", run);
    solutionBtn.addEventListener("click", () => {
      code[idx] = tasks[idx].solution;
      editor.setValue(code[idx]);
    });
    resetBtn.addEventListener("click", () => {
      code[idx] = tasks[idx].starter;
      editor.setValue(code[idx]);
      if (editor.setMarkers) editor.setMarkers([]);
      output.hidden = true;
      clearErrors();
      result.hidden = true;
    });
    prevBtn.addEventListener("click", () => {
      if (idx > 0) {
        code[idx] = editor.getValue();
        idx -= 1;
        render();
      }
    });
    nextBtn.addEventListener("click", () => {
      if (idx < tasks.length - 1) {
        code[idx] = editor.getValue();
        idx += 1;
        render();
      } else {
        window.location.href = nextHref;
      }
    });

    window.addEventListener("hashchange", () => {
      const next = cardFromHash();
      if (next !== idx) {
        if (editor && editor.getValue) code[idx] = editor.getValue();
        idx = next;
        render();
      }
    });

    function boot() {
      return Promise.resolve(CodeLab.loadMonaco())
        .then(() =>
          editor.mount(editorHost, {
            value: code[0],
            language: "csharp",
            readOnly: false,
            autoHeight: { minHeight: 160, maxHeight: 640 },
          })
        )
        .then(() => {
          renderXP();
          render();
          warmUp();
        });
    }

    return { boot: boot, render: render, setLocale: setLocale };
  }

  window.BuildEngine = { create: create };

  // Self-boot for any page that includes this file directly (all non-kernel build
  // pages). A kernel page tags its script <build-engine.js data-manual> and drives
  // create() from its lesson controller, so the widget can be re-localized in place
  // without a reload. document.currentScript is the executing <script> at this point.
  var selfScript = document.currentScript;
  if (
    window.BUILD_CONFIG &&
    !(selfScript && selfScript.hasAttribute("data-manual"))
  ) {
    window.BuildEngine.create(window.BUILD_CONFIG).boot();
  }
})();
