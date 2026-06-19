// First Builds - Track 2 bridge between micro-coding and the capstone.
// Five small write-from-scratch tasks. Each is graded by running the code
// through the shared Roslyn/WASM host and matching the printed output.
// This is deliberately a separate, lightweight engine from drill-engine.js:
// the interaction is "write code, run it, match output", not fill-in-blanks.
(function () {
  "use strict";

  const tasks = [
    {
      title: "A class with one method",
      concept: "Objects",
      context:
        "An object groups data and behaviour. Here a method returns a value and Main prints it.",
      goal: [
        "Make Greeting.Say() return the text \"hello\".",
        "Run it and confirm the output is hello.",
      ],
      expected: "hello",
      starter:
        'using System;\n\npublic class Greeting\n{\n    public string Say()\n    {\n        // TODO: return "hello"\n        return "";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var greeting = new Greeting();\n        Console.WriteLine(greeting.Say());\n    }\n}\n',
      solution:
        'using System;\n\npublic class Greeting\n{\n    public string Say()\n    {\n        return "hello";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var greeting = new Greeting();\n        Console.WriteLine(greeting.Say());\n    }\n}\n',
    },
    {
      title: "One method, one job",
      concept: "Single job",
      context:
        "A method should do one clear thing. Format turns a pass/fail flag into a word.",
      goal: [
        "Return \"PASS\" when passed is true, otherwise \"FAIL\".",
        "Main calls Format(true), so the output should be PASS.",
      ],
      expected: "PASS",
      starter:
        'using System;\n\npublic class ReportFormatter\n{\n    public string Format(bool passed)\n    {\n        // TODO: "PASS" when passed is true, otherwise "FAIL"\n        return "";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var formatter = new ReportFormatter();\n        Console.WriteLine(formatter.Format(true));\n    }\n}\n',
      solution:
        'using System;\n\npublic class ReportFormatter\n{\n    public string Format(bool passed)\n    {\n        return passed ? "PASS" : "FAIL";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var formatter = new ReportFormatter();\n        Console.WriteLine(formatter.Format(true));\n    }\n}\n',
    },
    {
      title: "Hand the work in",
      concept: "Inject",
      context:
        "Instead of building its tools, a class can receive them through its constructor. That is dependency injection - the same move the capstone asks for.",
      goal: [
        "Store the formatter passed into the constructor.",
        "Run() should print PASS.",
      ],
      expected: "PASS",
      starter:
        'using System;\n\npublic class ReportFormatter\n{\n    public string Format(bool passed) => passed ? "PASS" : "FAIL";\n}\n\npublic class TestRunner\n{\n    private readonly ReportFormatter _formatter;\n\n    public TestRunner(ReportFormatter formatter)\n    {\n        // TODO: keep the formatter that was handed in\n    }\n\n    public string Run() => _formatter.Format(true);\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var runner = new TestRunner(new ReportFormatter());\n        Console.WriteLine(runner.Run());\n    }\n}\n',
      solution:
        'using System;\n\npublic class ReportFormatter\n{\n    public string Format(bool passed) => passed ? "PASS" : "FAIL";\n}\n\npublic class TestRunner\n{\n    private readonly ReportFormatter _formatter;\n\n    public TestRunner(ReportFormatter formatter)\n    {\n        _formatter = formatter;\n    }\n\n    public string Run() => _formatter.Format(true);\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var runner = new TestRunner(new ReportFormatter());\n        Console.WriteLine(runner.Run());\n    }\n}\n',
    },
    {
      title: "Depend on an interface",
      concept: "Abstraction",
      context:
        "An interface is a promise about what a type can do, not how. Code that depends on the interface does not care which class fills it.",
      goal: [
        "Declare the method on IReporter so the call compiles.",
        "The output should be PASS.",
      ],
      expected: "PASS",
      starter:
        'using System;\n\npublic interface IReporter\n{\n    // TODO: declare string Report(bool passed);\n}\n\npublic class PassFailReporter : IReporter\n{\n    public string Report(bool passed) => passed ? "PASS" : "FAIL";\n}\n\nclass Program\n{\n    static void Main()\n    {\n        IReporter reporter = new PassFailReporter();\n        Console.WriteLine(reporter.Report(true));\n    }\n}\n',
      solution:
        'using System;\n\npublic interface IReporter\n{\n    string Report(bool passed);\n}\n\npublic class PassFailReporter : IReporter\n{\n    public string Report(bool passed) => passed ? "PASS" : "FAIL";\n}\n\nclass Program\n{\n    static void Main()\n    {\n        IReporter reporter = new PassFailReporter();\n        Console.WriteLine(reporter.Report(true));\n    }\n}\n',
    },
    {
      title: "Swap in a new reporter",
      concept: "Open to extend",
      context:
        "Because callers depend on IReporter, you can add a new reporter without touching the old one. New behaviour by adding a class, not editing existing code.",
      goal: [
        "Implement EmojiReporter.Report to return \"OK\" when passed, otherwise \"X\".",
        "Main now uses EmojiReporter, so the output should be OK.",
      ],
      expected: "OK",
      starter:
        'using System;\n\npublic interface IReporter\n{\n    string Report(bool passed);\n}\n\npublic class PassFailReporter : IReporter\n{\n    public string Report(bool passed) => passed ? "PASS" : "FAIL";\n}\n\npublic class EmojiReporter : IReporter\n{\n    // TODO: return "OK" when passed, otherwise "X"\n    public string Report(bool passed) => "";\n}\n\nclass Program\n{\n    static void Main()\n    {\n        IReporter reporter = new EmojiReporter();\n        Console.WriteLine(reporter.Report(true));\n    }\n}\n',
      solution:
        'using System;\n\npublic interface IReporter\n{\n    string Report(bool passed);\n}\n\npublic class PassFailReporter : IReporter\n{\n    public string Report(bool passed) => passed ? "PASS" : "FAIL";\n}\n\npublic class EmojiReporter : IReporter\n{\n    public string Report(bool passed) => passed ? "OK" : "X";\n}\n\nclass Program\n{\n    static void Main()\n    {\n        IReporter reporter = new EmojiReporter();\n        Console.WriteLine(reporter.Report(true));\n    }\n}\n',
    },
  ];

  const COURSE_XP_KEY = "course_global_xp";
  const AWARDED_KEY = "first_builds_awarded";
  const AWARD_AMOUNT = 25;

  const el = (id) => document.getElementById(id);
  const editor = el("fbEditor");
  const meta = el("fbMeta");
  const title = el("fbTitle");
  const context = el("fbContext");
  const concept = el("fbConcept");
  const progress = el("fbProgress");
  const expected = el("fbExpected");
  const goal = el("fbGoal");
  const output = el("fbOutput");
  const result = el("fbResult");
  const resultTitle = el("fbResultTitle");
  const resultBody = el("fbResultBody");
  const runBtn = el("fbRun");
  const solutionBtn = el("fbSolution");
  const resetBtn = el("fbReset");
  const prevBtn = el("fbPrev");
  const nextBtn = el("fbNext");
  const xpLabel = el("courseXpLabel");

  const runner = new CodeLab.RoslynIframeRunner({ url: "level3-app/index.html?runner=1" });

  const code = tasks.map((t) => t.starter);
  const awarded = JSON.parse(localStorage.getItem(AWARDED_KEY) || "{}");
  let idx = 0;

  function loadXP() {
    return parseInt(localStorage.getItem(COURSE_XP_KEY) || "0", 10);
  }

  function renderXP() {
    if (xpLabel) xpLabel.textContent = `Course XP: ${loadXP()}`;
  }

  function award(taskIndex) {
    if (awarded[taskIndex]) return;
    awarded[taskIndex] = true;
    localStorage.setItem(AWARDED_KEY, JSON.stringify(awarded));
    localStorage.setItem(COURSE_XP_KEY, String(loadXP() + AWARD_AMOUNT));
    renderXP();
  }

  function showOutput(text, isError) {
    output.hidden = false;
    output.textContent = text;
    output.classList.toggle("is-error", Boolean(isError));
  }

  function showResult(ok, body) {
    result.hidden = false;
    result.classList.toggle("is-pass", ok);
    result.classList.toggle("is-fail", !ok);
    resultTitle.textContent = ok ? "Passed" : "Not yet";
    resultBody.textContent = body;
  }

  function render() {
    const task = tasks[idx];
    meta.textContent = "Bridge: First Builds";
    title.textContent = task.title;
    context.textContent = task.context;
    concept.textContent = task.concept;
    progress.textContent = `Build ${idx + 1} / ${tasks.length}`;
    expected.textContent = task.expected;
    editor.value = code[idx];

    goal.innerHTML = "";
    task.goal.forEach((g) => {
      const li = document.createElement("li");
      li.textContent = g;
      goal.appendChild(li);
    });

    output.hidden = true;
    result.hidden = true;
    prevBtn.disabled = idx === 0;
    nextBtn.disabled = idx === tasks.length - 1;
  }

  async function run() {
    code[idx] = editor.value;
    const task = tasks[idx];

    runBtn.disabled = true;
    runBtn.textContent = "Running...";
    showOutput("Compiling and running...", false);
    result.hidden = true;

    try {
      const res = await runner.run(code[idx]);
      if (res.errors && res.errors.length) {
        showOutput(res.errors.map((e) => e.friendly || e.raw).join("\n"), true);
        showResult(false, "The code did not compile. Read the errors above and try again.");
        return;
      }
      if (res.runtimeError) {
        showOutput(`${res.output}\n${res.runtimeError}`.trim(), true);
        showResult(false, "It ran but threw an error. Fix it and run again.");
        return;
      }
      const out = (res.output || "").trim();
      showOutput(out || "(no output)", false);
      if (out.split(/\r?\n/).some((line) => line.trim() === task.expected)) {
        award(idx);
        showResult(true, `Output matched "${task.expected}". XP awarded.`);
      } else {
        showResult(false, `Expected a line equal to "${task.expected}". Adjust your code and run again.`);
      }
    } catch (err) {
      showOutput(err.message || "Could not run the code.", true);
      showResult(false, "Something went wrong running the code.");
    } finally {
      runBtn.disabled = false;
      runBtn.textContent = "Run";
    }
  }

  runBtn.addEventListener("click", run);
  solutionBtn.addEventListener("click", () => {
    code[idx] = tasks[idx].solution;
    editor.value = code[idx];
  });
  resetBtn.addEventListener("click", () => {
    code[idx] = tasks[idx].starter;
    editor.value = code[idx];
    output.hidden = true;
    result.hidden = true;
  });
  editor.addEventListener("input", () => {
    code[idx] = editor.value;
  });
  prevBtn.addEventListener("click", () => {
    if (idx > 0) {
      idx -= 1;
      render();
    }
  });
  nextBtn.addEventListener("click", () => {
    if (idx < tasks.length - 1) {
      idx += 1;
      render();
    }
  });

  renderXP();
  render();
})();
