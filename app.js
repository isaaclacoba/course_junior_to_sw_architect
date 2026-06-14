const challenges = [
  {
    type: "Android",
    title: "Device Properties Via Fake ADB",
    concept: "Interface + Constructor Injection",
    context:
      "Fill the missing pieces so AndroidDevice depends on an abstraction and prints two properties.",
    learning: {
      summary:
        "This exercise shows dependency injection: Program creates objects, then passes needed dependencies into constructors.",
      points: [
        "Variable assignment uses =. Example: _adb = adb; copies the constructor argument reference into the field.",
        "An object is a created value in memory, like new FakeAdbClient().",
        "An instance is one concrete object of a class. device is an instance of AndroidDevice.",
      ],
      glossary: [
        {
          term: "Variable assignment",
          meaning: "Use = to store a value or reference into a variable or field.",
        },
        {
          term: "Object",
          meaning: "A runtime value created from a class, usually with new.",
        },
        {
          term: "Instance",
          meaning: "One specific object of a class.",
        },
      ],
    },
    snippet: `public interface IAdbClient
{
    string {{1}}(string propertyKey);
}

public class FakeAdbClient : IAdbClient
{
    public string GetProperty(string propertyKey)
    {
        if (propertyKey == "ro.product.brand") return "PixelWorks";
        if (propertyKey == "ro.product.model") return "PX-10";
        return "unknown";
    }
}

public class AndroidDevice
{
    private readonly IAdbClient _adb;

    public AndroidDevice(IAdbClient adb)
    {
        {{2}}
    }

    public string Describe()
    {
        var brand = _adb.GetProperty("ro.product.brand");
        var model = _adb.GetProperty("ro.product.model");
        return {{3}};
    }
}

public class Program
{
    public static void Main()
    {
        var device = new AndroidDevice(new FakeAdbClient());
        Console.WriteLine(device.{{4}}());
    }
}`,
    blanks: [
      {
        id: 1,
        label: "Method name in the interface",
        answer: "GetProperty",
        hints: [
          "It should match the method implemented by FakeAdbClient.",
          "Look at GetProperty(string propertyKey) in the concrete class.",
        ],
      },
      {
        id: 2,
        label: "Store constructor input in class field _adb",
        answer: "_adb = adb;",
        hints: [
          "A field is the class variable declared near the top: _adb.",
          "Inside the constructor, save the argument adb into _adb.",
        ],
      },
      {
        id: 3,
        label: "Return interpolated description",
        answer: "$\"{brand} {model}\"",
        hints: [
          "Use C# string interpolation.",
          "Expected output shape: brand and model separated by a space.",
        ],
      },
      {
        id: 4,
        label: "Method called from Main",
        answer: "Describe",
        hints: ["Call the method that returns a summary string.", "The method is in AndroidDevice."],
      },
    ],
    output: "PixelWorks PX-10",
    tokens: ["GetProperty", "_adb = adb;", '$"{brand} {model}"', "Describe", "SetProperty", "_adb = null;", "ToString", "Start"],
  },
  {
    type: "Android",
    title: "Encapsulation Around Battery Reading",
    concept: "Private State + Public Behavior",
    context:
      "Complete this class so battery value is encapsulated and validated before update.",
    learning: {
      summary:
        "This exercise focuses on encapsulation: private data is changed only through public methods with validation.",
      points: [
        "_batteryPercent is private, so external code cannot directly set it.",
        "UpdateBattery controls valid values before assignment.",
        "Methods like GetBatteryPercent expose read access without exposing writable internal state.",
      ],
      glossary: [
        {
          term: "Field",
          meaning: "A variable declared at class level, such as _batteryPercent.",
        },
        {
          term: "Encapsulation",
          meaning: "Keep internal state private and expose controlled behavior through methods.",
        },
        {
          term: "Validation",
          meaning: "Checking input rules before storing or using a value.",
        },
      ],
    },
    snippet: `public class DeviceHealth
{
    private int _batteryPercent;

    public DeviceHealth(int initialPercent)
    {
        _batteryPercent = initialPercent;
    }

    public int {{1}}()
    {
        return _batteryPercent;
    }

    public void UpdateBattery(int value)
    {
        if (value < 0 || value > 100) {{2}}
        _batteryPercent = value;
    }
}

// Usage in test setup:
var health = new DeviceHealth(78);
health.UpdateBattery(73);
Console.WriteLine(health.{{3}}());`,
    blanks: [
      {
        id: 1,
        label: "Getter-like public method name",
        answer: "GetBatteryPercent",
        hints: ["Name should describe what value is returned.", "Use the common GetX naming style."],
      },
      {
        id: 2,
        label: "Invalid value handling",
        answer: "throw new ArgumentOutOfRangeException(nameof(value));",
        hints: [
          "Reject invalid battery percentages immediately.",
          "Throw ArgumentOutOfRangeException with nameof(value).",
        ],
      },
      {
        id: 3,
        label: "Call to read current battery",
        answer: "GetBatteryPercent",
        hints: ["Use the method you added in blank 1.", "It returns int."],
      },
    ],
    output: "73",
    tokens: ["GetBatteryPercent", "throw new ArgumentOutOfRangeException(nameof(value));", "return null;", "GetBattery", "throw new Exception();", "SetBatteryPercent"],
  },
  {
    type: "Web",
    title: "Page Object Core Structure",
    concept: "Abstraction + Composition",
    context:
      "Build a minimal login page object that hides low-level browser operations.",
    learning: {
      summary:
        "This exercise applies the Page Object idea: hide selector details behind a class API.",
      points: [
        "LoginPage composes an IBrowser dependency, rather than owning browser internals.",
        "A constructor parameter (browser) becomes reusable state by assigning it to _browser.",
        "Methods on LoginPage represent user actions, not low-level technical details.",
      ],
      glossary: [
        {
          term: "Parameter",
          meaning: "A variable defined in a method or constructor signature.",
        },
        {
          term: "Argument",
          meaning: "The actual value passed into a parameter at call time.",
        },
        {
          term: "Composition",
          meaning: "Building a class using other objects as fields.",
        },
      ],
    },
    snippet: `public interface IBrowser
{
    void Click(string selector);
    void Type(string selector, string value);
}

public class LoginPage
{
    private readonly IBrowser _browser;

    public LoginPage(IBrowser browser)
    {
        {{1}}
    }

    public void Login(string username, string password)
    {
        _browser.Type("#user", username);
        _browser.Type("#pass", password);
        _browser.{{2}}("#login");
    }
}

// In test:
IBrowser browser = new FakeBrowser();
var page = {{3}};
page.Login("qa-user", "safe-pass");`,
    blanks: [
      {
        id: 1,
        label: "Store constructor input in class field _browser",
        answer: "_browser = browser;",
        hints: [
          "A field is the class variable declared near the top: _browser.",
          "Inside the constructor, save the argument browser into _browser.",
        ],
      },
      {
        id: 2,
        label: "Browser action for submit",
        answer: "Click",
        hints: ["The interface has two methods: Type and Click.", "Use the one for pressing the login button."],
      },
      {
        id: 3,
        label: "Instantiate page object",
        answer: "new LoginPage(browser)",
        hints: ["Create an object with constructor injection.", "Use browser variable as argument."],
      },
    ],
    output: "(no console output — Login() triggers browser actions silently)",
    tokens: ["_browser = browser;", "Click", "new LoginPage(browser)", "Type", "_browser = null;", "Navigate", "new FakeBrowser()"],
  },
  {
    type: "Web",
    title: "Polymorphism With Driver Types",
    concept: "Inheritance + Method Override",
    context:
      "Use a base driver and two implementations to demonstrate polymorphic Navigate behavior.",
    learning: {
      summary:
        "This exercise demonstrates polymorphism: one base type variable can point to different derived objects.",
      points: [
        "driver has static type DriverBase but runtime instance can vary.",
        "Calling Navigate on the same variable executes different overrides based on runtime object.",
        "Override keeps a shared method contract while allowing specialized behavior.",
      ],
      glossary: [
        {
          term: "Inheritance",
          meaning: "A class derives from a base class and can reuse or extend behavior.",
        },
        {
          term: "Polymorphism",
          meaning: "Same method call, different behavior depending on runtime object type.",
        },
        {
          term: "Override",
          meaning: "A derived class implementation that replaces a base abstract or virtual method.",
        },
      ],
    },
    snippet: `public abstract class DriverBase
{
    public abstract void {{1}}(string url);
}

public class ChromeDriverFake : DriverBase
{
    public override void Navigate(string url)
    {
        Console.WriteLine($"[Chrome] => {url}");
    }
}

public class MobileWebDriverFake : DriverBase
{
    public override void Navigate(string url)
    {
        Console.WriteLine($"[Mobile] => {url}");
    }
}

DriverBase driver = new ChromeDriverFake();
driver.{{2}}("https://example.test");
driver = new {{3}}();
driver.Navigate("https://example.test/mobile");`,
    blanks: [
      {
        id: 1,
        label: "Abstract method name",
        answer: "Navigate",
        hints: ["Think browser movement.", "Overrides already show the method name."],
      },
      {
        id: 2,
        label: "Polymorphic method invocation",
        answer: "Navigate",
        hints: ["Call the abstract/override method on DriverBase variable.", "Same as blank 1."],
      },
      {
        id: 3,
        label: "Second concrete class type",
        answer: "MobileWebDriverFake",
        hints: ["Switch from desktop fake to mobile fake implementation.", "Class is already declared above."],
      },
    ],
    output: "[Chrome] => https://example.test\n[Mobile] => https://example.test/mobile",
    tokens: ["Navigate", "MobileWebDriverFake", "ChromeDriverFake", "Start", "FirefoxDriverFake", "Open"],
  },
  {
    type: "Android",
    title: "Simple Test Flow Orchestrator",
    concept: "Single Responsibility + Collaboration",
    context:
      "Complete a tiny orchestrator that coordinates launcher and assertions classes.",
    learning: {
      summary:
        "This exercise reinforces object collaboration: each class has one focused responsibility in the test flow.",
      points: [
        "SmokeTest coordinates actions but does not own launching or assertion logic details.",
        "AppLauncher handles start behavior; Assertions handles verification behavior.",
        "Creating objects and passing them into SmokeTest shows explicit dependencies.",
      ],
      glossary: [
        {
          term: "Responsibility",
          meaning: "A single clear purpose owned by one class.",
        },
        {
          term: "Dependency",
          meaning: "Another object a class needs in order to do its work.",
        },
        {
          term: "Orchestrator",
          meaning: "A class that coordinates calls between focused collaborators.",
        },
      ],
    },
    snippet: `public class AppLauncher
{
    public void Start(string packageName)
    {
        Console.WriteLine($"Launching {packageName}");
    }
}

public class Assertions
{
    public void AssertEquals(string expected, string actual)
    {
        if (expected != actual)
            throw new Exception($"Expected {expected}, got {actual}");
    }
}

public class SmokeTest
{
    private readonly AppLauncher _launcher;
    private readonly Assertions _assertions;

    public SmokeTest(AppLauncher launcher, Assertions assertions)
    {
        _launcher = launcher;
        _assertions = assertions;
    }

    public void Run()
    {
        _launcher.{{1}}("com.demo.app");

        var screenTitle = "Home";
        _assertions.{{2}}("Home", screenTitle);
    }
}

var test = new SmokeTest(new AppLauncher(), new Assertions());
test.{{3}}();`,
    blanks: [
      {
        id: 1,
        label: "Launch call",
        answer: "Start",
        hints: ["Use method in AppLauncher.", "Name indicates beginning app lifecycle."],
      },
      {
        id: 2,
        label: "Assertion method",
        answer: "AssertEquals",
        hints: ["Use assertion class behavior.", "Method compares expected and actual strings."],
      },
      {
        id: 3,
        label: "Execute test method",
        answer: "Run",
        hints: ["Call the orchestrator behavior.", "Single method in SmokeTest for flow."],
      },
    ],
    output: "Launching com.demo.app",
    tokens: ["Start", "AssertEquals", "Run", "Launch", "Assert", "Execute"],
  },
];

let currentIndex = 0;
const answersState = challenges.map((challenge) =>
  challenge.blanks.map(() => ({ value: "", hintLevel: -1, explain: false }))
);

const challengeMeta = document.getElementById("challengeMeta");
const challengeTitle = document.getElementById("challengeTitle");
const challengeContext = document.getElementById("challengeContext");
const conceptBadge = document.getElementById("conceptBadge");
const progressBadge = document.getElementById("progressBadge");
const codeBlock = document.getElementById("codeBlock");
const inputsContainer = document.getElementById("inputsContainer");
const resultPanel = document.getElementById("resultPanel");
const resultTitle = document.getElementById("resultTitle");
const resultBody = document.getElementById("resultBody");
const resultList = document.getElementById("resultList");
const coachSummary = document.getElementById("coachSummary");
const coachPoints = document.getElementById("coachPoints");
const coachGlossary = document.getElementById("coachGlossary");
const coachDiagramCaption = document.getElementById("coachDiagramCaption");
const coachDiagram = document.getElementById("coachDiagram");
const outputPanel = document.getElementById("outputPanel");
const outputContent = document.getElementById("outputContent");
const wordBank = document.getElementById("wordBank");
const fillHeading = document.getElementById("fillHeading");
const xpLabel = document.getElementById("xpLabel");
const xpFill = document.getElementById("xpFill");
const courseXpLabel = document.getElementById("courseXpLabel");

const XP_PER_BLANK = 10;
const XP_LEVEL = 100;
const COURSE_XP_KEY = "course_global_xp";
const LEVEL3_AWARDED_KEY = "level3_awarded";
const level3Awarded = JSON.parse(localStorage.getItem(LEVEL3_AWARDED_KEY) || "{}");

if (window.mermaid) {
  window.mermaid.initialize({
    startOnLoad: false,
    theme: "neutral",
    securityLevel: "loose",
  });
}

function loadXP() {
  return parseInt(localStorage.getItem("csharp_xp") || "0", 10);
}

function saveXP(xp) {
  localStorage.setItem("csharp_xp", String(xp));
}

function renderXP() {
  const xp = loadXP();
  xpLabel.textContent = `XP ${xp}`;
  xpFill.style.width = `${(xp % XP_LEVEL)}%`;
}

function awardXP(amount) {
  saveXP(loadXP() + amount);
  renderXP();
}

function resetXP() {
  saveXP(0);
  renderXP();
}

function loadCourseXP() {
  return parseInt(localStorage.getItem(COURSE_XP_KEY) || "0", 10);
}

function renderCourseXP() {
  if (courseXpLabel) {
    courseXpLabel.textContent = `Course XP: ${loadCourseXP()}`;
  }
}

function addCourseXP(amount) {
  const next = loadCourseXP() + amount;
  localStorage.setItem(COURSE_XP_KEY, String(next));
  renderCourseXP();
}

function markLevel3Awarded(challengeIndex) {
  level3Awarded[challengeIndex] = true;
  localStorage.setItem(LEVEL3_AWARDED_KEY, JSON.stringify(level3Awarded));
}

function shake(element) {
  element.classList.remove("shake");
  void element.offsetWidth; // force reflow to restart animation
  element.classList.add("shake");
  element.addEventListener("animationend", () => element.classList.remove("shake"), { once: true });
}

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const checkBtn = document.getElementById("checkBtn");
const hintBtn = document.getElementById("hintBtn");
const revealBtn = document.getElementById("revealBtn");
const resetBtn = document.getElementById("resetBtn");

function normalize(text) {
  return text.replace(/\s+/g, " ").trim();
}

function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

// Returns: 'correct' | 'almost' | 'close' | 'wrong'
function matchQuality(raw, expected) {
  const norm = normalize(raw);
  const exp = normalize(expected);

  if (norm === exp) return "correct";
  if (norm.toLowerCase() === exp.toLowerCase()) return "almost"; // casing only

  // Collapse all whitespace differences
  const normWS = norm.replace(/\s/g, "");
  const expWS = exp.replace(/\s/g, "");
  if (normWS.toLowerCase() === expWS.toLowerCase()) return "almost"; // spacing only

  const dist = levenshtein(norm.toLowerCase(), exp.toLowerCase());
  const threshold = Math.max(2, Math.floor(exp.length * 0.15));
  if (dist <= threshold) return "close";

  return "wrong";
}

function explainLine(snippet, blankId) {
  const marker = `{{${blankId}}}`;
  const line = snippet
    .split("\n")
    .find((candidate) => candidate.includes(marker));

  if (!line) {
    return "Fill the missing piece so this part of the scenario can run correctly.";
  }

  return `You are completing this line: ${line.replace(marker, "____").trim()}`;
}

function simpleExplain(challenge, blank) {
  const firstHint = blank.hints && blank.hints.length > 0 ? blank.hints[0] : "Think about what this step should do.";
  return `${explainLine(challenge.snippet, blank.id)} This blank is about: ${blank.label}. ${firstHint}`;
}

const TIER_MESSAGES = {
  correct: (id) => `Blank ${id}: correct`,
  almost: (id, exp) =>
    `Blank ${id}: almost — check casing or spacing. Expected: ${exp}`,
  close: (id, exp) =>
    `Blank ${id}: close — small typo. Expected: ${exp}`,
  wrong: (id, exp) =>
    `Blank ${id}: not quite. Expected: ${exp}`,
};

function buildSnippet(challenge) {
  return challenge.snippet.replace(/\{\{(\d+)\}\}/g, (_, id) => `__${id}__`);
}

function getDiagramData(challengeTitle) {
  switch (challengeTitle) {
    case "Device Properties Via Fake ADB":
      return {
        caption: "Instantiation + dependency injection + memory references",
          mermaid: `flowchart LR
        A["Program Main"] --> B["device variable"]
        A --> C["new FakeAdbClient"]
        A --> D["new AndroidDevice"]
        D --> E["_adb field -> FakeAdbClient"]
        D --> F["Describe call"]
        F --> G["brand"]
        F --> H["model"]`,
        lanes: [
          {
            label: "Stack (method scope)",
            nodes: ["device var", "adb arg", "brand", "model"],
          },
          {
            label: "Heap (objects)",
            nodes: ["AndroidDevice instance", "_adb field -> FakeAdbClient", "Describe() reads props"],
          },
        ],
      };
    case "Encapsulation Around Battery Reading":
      return {
        caption: "Object state update with guarded assignment",
          mermaid: `flowchart LR
        A["Caller"] --> B["UpdateBattery"]
        B --> C{"value in range"}
        C -->|yes| D["assign _batteryPercent"]
        C -->|no| E["throw out-of-range"]
        A --> F["GetBatteryPercent"]`,
        lanes: [
          {
            label: "Flow",
            nodes: ["UpdateBattery(value)", "validate 0..100", "assign _batteryPercent", "GetBatteryPercent()"],
          },
          {
            label: "Memory view",
            nodes: ["DeviceHealth instance", "private _batteryPercent", "external code via methods only"],
          },
        ],
      };
    case "Page Object Core Structure":
      return {
        caption: "Composition and DI in a Page Object",
          mermaid: `flowchart LR
        A["Test"] --> B["new FakeBrowser"]
        A --> C["new LoginPage"]
        C --> D["_browser field"]
        C --> E["Login"]
        E --> F["Type user"]
        E --> G["Type pass"]
        E --> H["Click login"]`,
        lanes: [
          {
            label: "Instantiation",
            nodes: ["browser = new FakeBrowser", "new LoginPage(browser)", "_browser field set"],
          },
          {
            label: "Action flow",
            nodes: ["Type #user", "Type #pass", "Click #login"],
          },
        ],
      };
    case "Polymorphism With Driver Types":
      return {
        caption: "Inheritance tree and runtime polymorphism",
          mermaid: `flowchart LR
        A["DriverBase"] --> B["ChromeDriverFake"]
        A --> C["MobileWebDriverFake"]
        D["driver as DriverBase"] --> E["Navigate call"]
        E --> F["Chrome behavior"]
        E --> G["Mobile behavior"]`,
        lanes: [
          {
            label: "Type hierarchy",
            nodes: ["DriverBase", "ChromeDriverFake", "MobileWebDriverFake"],
          },
          {
            label: "Runtime dispatch",
            nodes: ["driver: DriverBase", "= ChromeDriverFake", "Navigate() => Chrome", "= MobileWebDriverFake", "Navigate() => Mobile"],
          },
        ],
      };
    case "Simple Test Flow Orchestrator":
      return {
        caption: "Collaboration between focused classes",
          mermaid: `flowchart LR
        A["SmokeTest"] --> B["AppLauncher"]
        A --> C["Assertions"]
        D["Run"] --> E["Start app"]
        D --> F["Assert equals"]`,
        lanes: [
          {
            label: "Object graph",
            nodes: ["SmokeTest", "_launcher: AppLauncher", "_assertions: Assertions"],
          },
          {
            label: "Run flow",
            nodes: ["Run()", "Start(package)", "AssertEquals(expected, actual)"],
          },
        ],
      };
    default:
      return {
        caption: "High-level object interactions",
        mermaid: `flowchart LR
  A[Create] --> B[Inject]
  B --> C[Call]
  C --> D[Validate]`,
        lanes: [{ label: "Flow", nodes: ["Create", "Inject", "Call", "Validate"] }],
      };
  }
}

async function renderDiagram(challenge) {
  const data = getDiagramData(challenge.title);
  coachDiagramCaption.textContent = data.caption;
  coachDiagram.innerHTML = "";

  if (window.mermaid && data.mermaid) {
    const mermaidId = `coach-diagram-${currentIndex}-${Date.now()}`;
    try {
      const { svg } = await window.mermaid.render(mermaidId, data.mermaid);
      coachDiagram.innerHTML = `<div class="mermaid">${svg}</div>`;
      return;
    } catch (_err) {
      const note = document.createElement("p");
      note.className = "context";
      note.textContent = "Mermaid parse failed for this challenge, showing fallback diagram.";
      coachDiagram.appendChild(note);
    }
  }

  data.lanes.forEach((lane) => {
    const laneEl = document.createElement("div");
    laneEl.className = "diagram-lane";

    const laneLabel = document.createElement("span");
    laneLabel.className = "diagram-lane-label";
    laneLabel.textContent = lane.label;

    const flow = document.createElement("div");
    flow.className = "diagram-flow";

    lane.nodes.forEach((node, index) => {
      const nodeEl = document.createElement("span");
      nodeEl.className = "diagram-node";
      nodeEl.textContent = node;
      flow.appendChild(nodeEl);

      if (index < lane.nodes.length - 1) {
        const arrow = document.createElement("span");
        arrow.className = "diagram-arrow";
        arrow.textContent = "->";
        flow.appendChild(arrow);
      }
    });

    laneEl.append(laneLabel, flow);
    coachDiagram.appendChild(laneEl);
  });
}

function render() {
  const challenge = challenges[currentIndex];
  const state = answersState[currentIndex];

  challengeMeta.textContent = `${challenge.type} Scenario`;
  challengeTitle.textContent = challenge.title;
  challengeContext.textContent = challenge.context;
  conceptBadge.textContent = challenge.concept;
  progressBadge.textContent = `Challenge ${currentIndex + 1} / ${challenges.length}`;

  codeBlock.textContent = buildSnippet(challenge);
  Prism.highlightElement(codeBlock);

  outputPanel.hidden = true;

  // Word bank — shuffle tokens
  const shuffled = [...challenge.tokens].sort(() => Math.random() - 0.5);
  wordBank.innerHTML = "";
  shuffled.forEach((token) => {
    const chip = document.createElement("button");
    chip.className = "token-chip";
    chip.textContent = token;
    chip.type = "button";
    chip.addEventListener("click", () => fillNextBlank(token, chip));
    wordBank.appendChild(chip);
  });

  // Reveal token bank only at hint level 2 (second click).
  wordBank.hidden = state.every((item) => item.hintLevel < 1);

  renderXP();
  renderCourseXP();
  coachSummary.textContent = challenge.learning.summary;
  coachPoints.innerHTML = "";
  challenge.learning.points.forEach((point) => {
    const li = document.createElement("li");
    li.textContent = point;
    coachPoints.appendChild(li);
  });

  coachGlossary.innerHTML = "";
  challenge.learning.glossary.forEach((entry) => {
    const dt = document.createElement("dt");
    dt.textContent = entry.term;

    const dd = document.createElement("dd");
    dd.textContent = entry.meaning;

    coachGlossary.append(dt, dd);
  });

  void renderDiagram(challenge);

  inputsContainer.innerHTML = "";
  challenge.blanks.forEach((blank, idx) => {
    const row = document.createElement("div");
    row.className = "input-row";
    if (state[idx].explain) row.classList.add("explain-focus");

    const hintLevel = state[idx].hintLevel;

    const label = document.createElement("label");
    label.setAttribute("for", `blank-${idx}`);
    label.textContent = `Blank ${blank.id}: ${blank.label}`;

    const input = document.createElement("input");
    input.id = `blank-${idx}`;
    input.value = state[idx].value;
    input.setAttribute("aria-label", `Blank ${blank.id}`);
    input.placeholder = "Type your C# code here";

    input.addEventListener("input", (event) => {
      state[idx].value = event.target.value;
      input.classList.remove("correct", "wrong", "almost");
    });

    const hint = document.createElement("div");
    hint.className = "hint";

    // Level 1: first hint text. Level 2: second hint text (label already revealed above).
    if (hintLevel >= 0) {
      const capped = Math.min(hintLevel, blank.hints.length - 1);
      hint.textContent = `Hint: ${blank.hints[capped]}`;
    }

    const explainBtn = document.createElement("button");
    explainBtn.type = "button";
    explainBtn.className = "btn explain-btn";
    explainBtn.textContent = state[idx].explain ? "Hide simple explain" : "Explain this part";
    explainBtn.addEventListener("click", () => {
      state[idx].explain = !state[idx].explain;
      render();
    });

    const explainBox = document.createElement("div");
    explainBox.className = "hint explain-box";
    explainBox.hidden = !state[idx].explain;
    explainBox.textContent = `Simple explain: ${simpleExplain(challenge, blank)}`;

    row.append(label, input, hint, explainBtn, explainBox);
    inputsContainer.appendChild(row);
  });

  resultPanel.hidden = true;
  // Reveal the section heading only when the learner has reached hint level 2.
  fillHeading.hidden = state.every((item) => item.hintLevel < 1);
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === challenges.length - 1;
}

function fillNextBlank(token, chip) {
  const inputs = [...inputsContainer.querySelectorAll("input")];
  const target = inputs.find((inp) => inp.value === "");
  if (!target) return;
  const idx = inputs.indexOf(target);
  answersState[currentIndex][idx].value = token;
  target.value = token;
  target.classList.remove("correct", "wrong", "almost");
  chip.classList.add("used");
}

function checkAnswers() {
  const challenge = challenges[currentIndex];
  const state = answersState[currentIndex];
  const rows = [...inputsContainer.querySelectorAll(".input-row")];

  let correct = 0;
  let almostCount = 0;
  const messages = [];
  let earnedXP = 0;

  challenge.blanks.forEach((blank, idx) => {
    const input = rows[idx].querySelector("input");
    const quality = matchQuality(state[idx].value, blank.answer);

    input.classList.remove("correct", "wrong", "almost");

    if (quality === "correct") {
      correct += 1;
      earnedXP += XP_PER_BLANK;
      input.classList.add("correct");
    } else if (quality === "almost" || quality === "close") {
      almostCount += 1;
      input.classList.add("almost");
      shake(input);
    } else {
      input.classList.add("wrong");
      shake(input);
    }

    messages.push({ quality, text: TIER_MESSAGES[quality](blank.id, blank.answer) });
  });

  if (earnedXP > 0) awardXP(earnedXP);

  if (correct === challenge.blanks.length) {
    outputPanel.hidden = false;
    outputContent.textContent = challenge.output;

    if (!level3Awarded[currentIndex]) {
      addCourseXP(35);
      markLevel3Awarded(currentIndex);
    }
  }

  const total = challenge.blanks.length;
  resultTitle.textContent = `${correct} / ${total} correct`;

  if (correct === total) {
    resultBody.textContent = "All correct. You matched the intended OO structure for this scenario.";
  } else if (almostCount > 0 && correct + almostCount === total) {
    resultBody.textContent = "Nearly there — you have the right ideas. Fix casing or small typos in the highlighted blanks.";
  } else {
    resultBody.textContent = "Review the highlighted blanks. Use hints to reinforce the concept.";
  }

  resultList.innerHTML = "";
  messages.forEach(({ quality, text }) => {
    const li = document.createElement("li");
    li.textContent = text;
    if (quality === "almost" || quality === "close") li.style.color = "var(--warn)";
    if (quality === "correct") li.style.color = "var(--good)";
    resultList.appendChild(li);
  });

  resultPanel.hidden = false;
}

function showNextHint() {
  const challenge = challenges[currentIndex];
  const state = answersState[currentIndex];

  challenge.blanks.forEach((blank, idx) => {
    if (state[idx].hintLevel < blank.hints.length - 1) {
      state[idx].hintLevel += 1;
    }
  });

  render();
}

function revealAnswers() {
  const challenge = challenges[currentIndex];
  const state = answersState[currentIndex];

  challenge.blanks.forEach((blank, idx) => {
    state[idx].value = blank.answer;
  });

  render();
}

function resetCurrentChallenge(event) {
  if (event) event.preventDefault();

  resetXP();

  answersState[currentIndex] = challenges[currentIndex].blanks.map(() => ({
    value: "",
    hintLevel: -1,
    explain: false,
  }));

  // Clear feedback/output immediately, then re-render pristine challenge state.
  resultPanel.hidden = true;
  resultList.innerHTML = "";
  outputPanel.hidden = true;
  outputContent.textContent = "";
  fillHeading.hidden = true;
  wordBank.hidden = true;

  render();
}

prevBtn.addEventListener("click", () => {
  currentIndex -= 1;
  render();
});

nextBtn.addEventListener("click", () => {
  currentIndex += 1;
  render();
});

checkBtn.addEventListener("click", checkAnswers);
hintBtn.addEventListener("click", showNextHint);
revealBtn.addEventListener("click", revealAnswers);
resetBtn.addEventListener("click", resetCurrentChallenge);

render();
