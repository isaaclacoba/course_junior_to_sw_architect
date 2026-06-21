// Generic write-from-scratch lesson engine. Reads window.BUILD_CONFIG and drives
// a write-the-code / run-it / match-the-output loop through the shared Roslyn host.
// The editor surface is CodeLab.MonacoEditor (the same Monaco editor used by
// level3-app). Elements are resolved by id as prefix + suffix.
// Grading: the program output must contain a line equal to task.expected.
(function () {
  "use strict";

  const cfg = window.BUILD_CONFIG;
  if (!cfg || !Array.isArray(cfg.tasks) || !cfg.tasks.length) return;

  const prefix = cfg.prefix;
  const tasks = cfg.tasks;
  const metaLabel = cfg.metaLabel || "";
  const progressNoun = cfg.progressNoun || "Task";
  const runnerUrl = cfg.runnerUrl || "level3-app/index.html?runner=1";
  const xpKey = cfg.xpKey || "course_global_xp";
  const awardedKey = cfg.awardedKey;
  const awardAmount = cfg.awardAmount || 20;

  const el = (suffix) => document.getElementById(prefix + suffix);

  const editorHost = el("Editor");
  const meta = el("Meta");
  const title = el("Title");
  const context = el("Context");
  const concept = el("Concept");
  const progress = el("Progress");
  const expected = el("Expected");
  const goal = el("Goal");
  const errors = el("Errors");
  const output = el("Output");
  const result = el("Result");
  const resultTitle = el("ResultTitle");
  const resultBody = el("ResultBody");
  const runBtn = el("Run");
  const solutionBtn = el("Solution");
  const resetBtn = el("Reset");
  const prevBtn = el("Prev");
  const nextBtn = el("Next");
  const xpLabel = document.getElementById("courseXpLabel");

  const runner = new CodeLab.RoslynIframeRunner({ url: runnerUrl });
  const editor = new CodeLab.MonacoEditor();

  const code = tasks.map((t) => t.starter);
  const awarded = JSON.parse(localStorage.getItem(awardedKey) || "{}");
  let idx = 0;

  function loadXP() {
    return parseInt(localStorage.getItem(xpKey) || "0", 10);
  }

  function renderXP() {
    if (xpLabel) xpLabel.textContent = `Course XP: ${loadXP()}`;
  }

  function award(taskIndex) {
    if (awarded[taskIndex]) return;
    awarded[taskIndex] = true;
    localStorage.setItem(awardedKey, JSON.stringify(awarded));
    localStorage.setItem(xpKey, String(loadXP() + awardAmount));
    renderXP();
  }

  function showOutput(text, isError) {
    output.hidden = false;
    output.textContent = text;
    output.classList.toggle("is-error", Boolean(isError));
  }

  function hideOutput() {
    output.hidden = true;
    output.textContent = "";
  }

  // Render the shared capstone-quality compile-error panel (or clear it).
  function showErrors(list) {
    if (errors && CodeLab.showErrorPanel) {
      return CodeLab.showErrorPanel(errors, list);
    }
    // Fallback: keep the old text output if the shared renderer is missing.
    showOutput((list || []).map((e) => e.friendly || e.raw).join("\n"), true);
    return Boolean(list && list.length);
  }

  function clearErrors() {
    if (errors && CodeLab.showErrorPanel) CodeLab.showErrorPanel(errors, []);
  }

  function showResult(ok, body) {
    result.hidden = false;
    result.classList.toggle("is-pass", ok);
    result.classList.toggle("is-fail", !ok);
    resultTitle.textContent = ok ? "Passed" : "Not yet";
    resultBody.textContent = body;
  }

  // expected as a string: any output line equals it.
  // expected as an array: the non-empty output lines equal that exact sequence.
  function matches(out, expected) {
    const lines = out.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    if (Array.isArray(expected)) {
      return (
        lines.length === expected.length &&
        expected.every((e, i) => lines[i] === e)
      );
    }
    return lines.some((line) => line === expected);
  }

  // Optional technique gate: a task may require the source to satisfy patterns
  // (e.g. actually use a loop), so a hardcoded answer that prints the expected
  // output is not enough. Returns the first failing requirement, or null.
  function unmetRequirement(source, requirements) {
    if (!Array.isArray(requirements)) return null;
    for (const req of requirements) {
      const re = req.pattern instanceof RegExp ? req.pattern : new RegExp(req.pattern);
      if (!re.test(source)) return req.message || "Your code does not meet this task's requirement yet.";
    }
    return null;
  }

  function describeExpected(expected) {
    if (Array.isArray(expected)) {
      return `Expected these lines, in order:\n${expected.join("\n")}\nAdjust your code and run again.`;
    }
    return `Expected a line equal to "${expected}". Adjust your code and run again.`;
  }

  function render() {
    const task = tasks[idx];
    if (meta) meta.textContent = metaLabel;
    title.textContent = task.title;
    context.textContent = task.context;
    if (concept) concept.textContent = task.concept;
    progress.textContent = `${progressNoun} ${idx + 1} / ${tasks.length}`;
    if (expected) {
      expected.textContent = Array.isArray(task.expected)
        ? task.expected.join("\n")
        : task.expected;
    }
    editor.setValue(code[idx]);

    goal.innerHTML = "";
    task.goal.forEach((g) => {
      const li = document.createElement("li");
      li.textContent = g;
      goal.appendChild(li);
    });

    output.hidden = true;
    clearErrors();
    result.hidden = true;
    prevBtn.disabled = idx === 0;
    nextBtn.disabled = idx === tasks.length - 1;
  }

  async function run() {
    code[idx] = editor.getValue();
    const task = tasks[idx];

    runBtn.disabled = true;
    runBtn.textContent = "Running...";
    showOutput("Compiling and running...", false);
    clearErrors();
    result.hidden = true;

    try {
      const res = await runner.run(code[idx]);
      if (res.errors && res.errors.length) {
        hideOutput();
        showErrors(res.errors);
        if (editor.setMarkers) editor.setMarkers(res.errors);
        showResult(false, "The code did not compile. Read the errors above and try again.");
        return;
      }
      if (editor.setMarkers) editor.setMarkers([]);
      clearErrors();
      if (res.runtimeError) {
        showOutput(`${res.output}\n${res.runtimeError}`.trim(), true);
        showResult(false, "It ran but threw an error. Fix it and run again.");
        return;
      }
      const out = (res.output || "").trim();
      showOutput(out || "(no output)", false);
      const unmet = unmetRequirement(code[idx], task.requireSource);
      if (!matches(out, task.expected)) {
        showResult(false, describeExpected(task.expected));
      } else if (unmet) {
        showResult(false, unmet);
      } else {
        award(idx);
        showResult(true, "Output matched what the task asked for. XP awarded.");
      }
    } catch (err) {
      showOutput(err.message || "Could not run the code.", true);
      showResult(false, "Something went wrong running the code.");
    } finally {
      runBtn.disabled = false;
      runBtn.textContent = "Run";
    }
  }

  // The runner warms itself on construction; reflect that in the button so the
  // user knows the first run is being prepared.
  async function warmUp() {
    runBtn.disabled = true;
    runBtn.textContent = "Preparing compiler...";
    try {
      await runner.warm();
    } catch (err) {
      // Warm-up is best effort; the user can still click Run, which retries.
    } finally {
      runBtn.disabled = false;
      runBtn.textContent = "Run";
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
    }
  });

  Promise.resolve(CodeLab.loadMonaco())
    .then(() => editor.mount(editorHost, { value: code[0], language: "csharp", readOnly: false }))
    .then(() => {
      renderXP();
      render();
      warmUp();
    });
})();
