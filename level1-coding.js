const drills = [
  {
    title: "Model State With Variables",
    concept: "Why Software Exists",
    context: "Represent model state with a variable and output it.",
    snippet: `var doorOpen = {{1}};
Console.WriteLine(doorOpen);`,
    points: ["State is represented as data.", "Use explicit values for model state."],
    blanks: [
      {
        id: 1,
        label: "Assign boolean state",
        answer: "true",
        hints: ["Use a boolean literal."],
        explain: [
          { text: "var creates a variable called doorOpen — a named place in memory to store data.", highlight: "var doorOpen" },
          { text: "The = sign puts a value into it. Because it is a door, the only options are true (open) or false (closed).", highlight: "var doorOpen = {{1}}" },
          { text: "This line reads doorOpen and prints what is stored there to the screen.", highlight: "Console.WriteLine(doorOpen)" },
        ],
      },
    ],
  },
  {
    title: "Behavior As Transformation",
    concept: "Variables and Functions",
    context: "The method name says the goal: return exactly twice the input value.",
    snippet: `// Double means: duplicate the numeric value.
int Double(int x)
{
    return {{1}};
}`,
    points: [
      "Function names should communicate intent clearly.",
      "Here, 'Double' means output is exactly 2 times input.",
    ],
    blanks: [
      {
        id: 1,
        label: "Return transformed value",
        answer: "x * 2",
        hints: ["Multiply by 2."],
        explain: [
          { text: "This is the function header. It says: I take a whole number called x as input, and I give back a whole number.", highlight: "int Double(int x)" },
          { text: "return sends a value back to whoever called this function. The function stops after return.", highlight: "return {{1}}" },
          { text: "The name Double means the output must be exactly 2 times the input. If x is 5, the answer is 10.", highlight: "// Double means" },
          { text: "The * symbol means multiply.", highlight: "return {{1}}" },
        ],
      },
    ],
  },
  {
    title: "Instantiate A Class",
    concept: "Class and Object",
    context: "Given the class below, instantiate it and call the method that updates its state.",
    snippet: `public class Counter
{
    public int Value;

    public void Increment()
    {
        Value = Value + 1;
    }
}

var counter = new {{1}}();
counter.{{2}}();
Console.WriteLine(counter.Value);`,
    points: [
      "Use the class name declared in the snippet.",
      "Call the method that changes Value.",
    ],
    blanks: [
      {
        id: 1,
        label: "Class name after new",
        answer: "Counter",
        hints: ["Use the class declared above."],
        explain: [
          { text: "Counter is the blueprint. It defines what data the counter holds (Value) and what it can do (Increment).", highlight: "public class Counter" },
          { text: "new tells C# to build an actual object in memory using that blueprint. You have to say which blueprint to use.", highlight: "var counter = new {{1}}()" },
          { text: "The object is stored in the variable counter so we can use it in the lines below.", highlight: "var counter = new {{1}}()" },
        ],
      },
      {
        id: 2,
        label: "Method that increases Value",
        answer: "Increment",
        hints: ["Call the method that adds 1 to Value."],
        explain: [
          { text: "The dot after counter means: go inside this object and call something on it.", highlight: "counter.{{2}}()" },
          { text: "Increment is defined inside Counter. When called, it runs Value = Value + 1 — it adds one to the stored number.", highlight: "public void Increment()" },
          { text: "This last line prints Value so we can see the change actually happened.", highlight: "Console.WriteLine(counter.Value)" },
        ],
      },
    ],
  },
  {
    title: "Reference Assignment",
    concept: "Memory Model",
    context: "Represent that two variables reference the same object.",
    snippet: `var a = new User();
var b = {{1}};`,
    points: ["Assignment copies the reference for reference types.", "No automatic clone occurs."],
    blanks: [
      {
        id: 1,
        label: "Assign existing reference",
        answer: "a",
        hints: ["Use the variable already holding the object reference."],
        explain: [
          { text: "new User() creates an object in memory. The variable a holds the address of where that object lives — not the object itself.", highlight: "var a = new User()" },
          { text: "This line does not create a second object. It copies the address stored in a and puts it into b.", highlight: "var b = {{1}}" },
          { text: "After this, both a and b hold the same address — they point to the exact same object.", highlight: "var b = {{1}}" },
        ],
      },
    ],
  },
  {
    title: "Encapsulation Accessor",
    concept: "Encapsulation",
    context: "Expose controlled read access to private state.",
    snippet: `private int _balance;
public int {{1}}()
{
    return _balance;
}`,
    points: ["Private state should be accessed through methods.", "Public API should be explicit."],
    blanks: [
      {
        id: 1,
        label: "Getter method name",
        answer: "GetBalance",
        hints: ["Use Get + field meaning."],
        explain: [
          { text: "_balance is private. Nothing outside this class can read or change it directly.", highlight: "private int _balance" },
          { text: "This is a public method — the only way outside code can read the balance. It returns a whole number.", highlight: "public int {{1}}()" },
          { text: "return _balance sends the stored value out. The caller gets the number without touching the field.", highlight: "return _balance" },
        ],
      },
    ],
  },
  {
    title: "Polymorphic Call",
    concept: "Polymorphism",
    context: "Polymorphism means the same method call can produce different behavior depending on the runtime object.",
    snippet: `public abstract class Animal
{
    public abstract string Speak();
}

public class Dog : Animal
{
    public override string Speak() => "Woof";
}

public class Cat : Animal
{
    public override string Speak() => "Meow";
}

var pets = new List<Animal> { new Dog(), new Cat() };
foreach (var pet in pets)
{
    Console.WriteLine(pet.{{1}}());
}

// Output:
// Woof
// Meow`,
    points: [
      "Caller code stays the same: pet.Speak() for every element.",
      "Runtime type (Dog or Cat) decides which Speak implementation runs.",
    ],
    blanks: [
      {
        id: 1,
        label: "Shared contract method called on each animal",
        answer: "Speak",
        hints: ["Use the same method for Dog and Cat.", "This method is declared in Animal."],
        explain: [
          { text: "Animal is the shared type. Both Dog and Cat inherit from it — they are specific kinds of Animal.", highlight: "public abstract class Animal" },
          { text: "Dog has its own Speak that returns Woof. Cat has its own that returns Meow. Same method name, different behavior.", highlight: "public override string Speak() => \"Woof\"" },
          { text: "The loop goes through each animal one at a time. pet holds the current one on each pass.", highlight: "foreach (var pet in pets)" },
          { text: "The same call runs for every animal. C# decides at runtime which Speak version to use — Dog's or Cat's.", highlight: "Console.WriteLine(pet.{{1}}())" },
        ],
      },
    ],
  },
  {
    title: "Inheritance Declaration",
    concept: "Inheritance",
    context: "Extend a base class and specialize behavior in the derived class.",
    snippet: `public class Vehicle
{
    public virtual int GetWheelCount()
    {
        return 0;
    }
}

public class Car : {{1}}
{
    public override int GetWheelCount()
    {
        return {{2}};
    }
}

var car = new Car();
Console.WriteLine(car.GetWheelCount());

// Output:
// 4`,
    points: [
      "Inheritance models an is-a relation: Car is a Vehicle.",
      "Derived classes can override base behavior to provide specific results.",
    ],
    blanks: [
      {
        id: 1,
        label: "Base class for Car",
        answer: "Vehicle",
        hints: ["Use the class declared above Car."],
        explain: [
          { text: "Vehicle is the base class. It has a GetWheelCount method that returns 0 — it does not know what kind of vehicle it is.", highlight: "public class Vehicle" },
          { text: "The colon means Car inherits from Vehicle. Car gets all of Vehicle's code and can replace what it needs.", highlight: "public class Car : {{1}}" },
        ],
      },
      {
        id: 2,
        label: "Car-specific wheel count",
        answer: "4",
        hints: ["A standard car has four wheels in this example."],
        explain: [
          { text: "override means Car is replacing Vehicle's version of GetWheelCount with its own. Vehicle returns 0. Car returns the real number.", highlight: "public override int GetWheelCount()" },
          { text: "A car has 4 wheels. When we call car.GetWheelCount(), this Car version runs — not the one inside Vehicle.", highlight: "return {{2}}" },
        ],
      },
    ],
  },
  {
    title: "Composition Field",
    concept: "Composition",
    context: "Model has-a relationship with a collaborator.",
    snippet: `public class OrderService
{
    private readonly IRepository _repo;

    public OrderService(IRepository repo)
    {
        {{1}}
    }
}`,
    points: ["Composition uses collaborators.", "Constructor stores required dependency."],
    blanks: [
      {
        id: 1,
        label: "Store collaborator",
        answer: "_repo = repo;",
        hints: ["Assign constructor parameter to field."],
        explain: [
          { text: "_repo is the field that stores the repository this service will use. It is private — only code inside this class can reach it.", highlight: "private readonly IRepository _repo" },
          { text: "The constructor receives repo from outside. Someone who creates an OrderService must hand it in.", highlight: "public OrderService(IRepository repo)" },
          { text: "This line saves the incoming repo into _repo so every method in the class can use it later. Without this line, _repo stays empty.", highlight: "{{1}}" },
        ],
      },
    ],
  },
  {
    title: "Dependency Injection",
    concept: "Dependency Injection",
    context: "Use the declarations below and inject the logger from the outside.",
    snippet: `public interface ILogger
  {
    void Log(string message);
  }

  public class ConsoleLogger : ILogger
  {
    public void Log(string message) { }
  }

  public class ReportService
  {
    private readonly ILogger _logger;

    public ReportService(ILogger logger)
    {
      _logger = logger;
    }
  }

  var logger = new ConsoleLogger();
var service = new ReportService({{1}});`,
    points: ["Dependencies are provided externally.", "Class should not construct its own collaborators."],
    blanks: [
      {
        id: 1,
        label: "Injected dependency argument",
        answer: "logger",
        hints: ["Pass the collaborator variable."],
        explain: [
          { text: "ReportService needs a logger. Its constructor asks for one — it must be provided from the outside.", highlight: "public ReportService(ILogger logger)" },
          { text: "A few lines above, a ConsoleLogger was created and stored in the variable logger.", highlight: "var logger = new ConsoleLogger()" },
          { text: "Here we pass that logger in when creating the service. ReportService will use it without knowing how it was built.", highlight: "var service = new ReportService({{1}})" },
        ],
      },
    ],
  },
  {
    title: "Closing Synthesis",
    concept: "Level 1 Closing Check",
    context: "Final exam: complete the missing parts of this full program to demonstrate all Level 1 concepts together.",
    snippet: `using System;
  using System.Collections.Generic;

  public interface ILogger
  {
    void Log(string message);
  }

  public class ConsoleLogger : ILogger
  {
    public void Log(string message) => Console.WriteLine({{1}});
  }

  public abstract class Notification
  {
    protected readonly ILogger _logger;

    protected Notification({{2}} logger)
    {
      _logger = logger;
    }

    public abstract string BuildMessage(string userName);
  }

  public class EmailNotification : Notification
  {
    public EmailNotification(ILogger logger) : base(logger) { }

    public override string BuildMessage(string userName)
    {
      _logger.Log("Email notification selected");
      return $"Email for {userName}";
    }
  }

  public class SmsNotification : Notification
  {
    public SmsNotification(ILogger logger) : base(logger) { }

    public override string BuildMessage(string userName)
    {
      _logger.Log("SMS notification selected");
      return $"{{3}} for {userName}";
    }
  }

  public class NotificationService
  {
    private readonly List<Notification> _notifications;
    private int _sentCount;

    public NotificationService({{4}} notifications)
    {
      _notifications = notifications;
    }

    public void SendAll(string userName)
    {
      foreach (var notification in _notifications)
      {
        var message = notification.BuildMessage(userName);
        Console.WriteLine(message);
        _sentCount = AddOne(_sentCount);
      }
    }

    public int GetSentCount()
    {
      return _sentCount;
    }

    private int AddOne(int value)
    {
        return value + {{5}};
    }
  }

  var logger = new ConsoleLogger();
  var notifications = new List<Notification>
  {
    new EmailNotification(logger),
    new SmsNotification(logger)
  };

var sameRef = {{6}};
  var service = new NotificationService(notifications);
  service.SendAll("Isaac");

Console.WriteLine($"Notifications sent: {service.{{7}}()}");
  Console.WriteLine($"Same object in memory: {Object.ReferenceEquals(notifications, sameRef)}");`,
    points: [
      "One program combines all Level 1 ideas in a realistic flow.",
      "Polymorphism happens in foreach: same call, different runtime behavior.",
      "Dependency injection and composition appear through constructor-provided collaborators.",
    ],
    blanks: [
      {
        id: 1,
        label: "Value passed to Console.WriteLine",
        answer: "message",
        hints: ["Use the Log method parameter directly."],
        explain: [
          { text: "Log is a method that receives a text value called message as its input.", highlight: "void Log(string message)" },
          { text: "Console.WriteLine prints to the screen. We want to print whatever was passed in as message.", highlight: "public void Log(string message) => Console.WriteLine({{1}})" },
        ],
      },
      {
        id: 2,
        label: "Type of injected logger in Notification constructor",
        answer: "ILogger",
        hints: ["Use the interface, not a concrete logger class."],
        explain: [
          { text: "ILogger is an interface — a contract that says: any class that implements me must have a Log method.", highlight: "public interface ILogger" },
          { text: "The constructor uses ILogger rather than ConsoleLogger. Any class with a Log method can be passed in here — keeping Notification flexible.", highlight: "protected Notification({{2}} logger)" },
        ],
      },
      {
        id: 3,
        label: "Prefix text returned by SmsNotification",
        answer: "SMS",
        hints: ["Match the class intent in uppercase."],
        explain: [
          { text: "EmailNotification returns a message that starts with Email.", highlight: "return $\"Email for" },
          { text: "SmsNotification does the same thing, but for SMS. Both classes have the same method name with different content — that is polymorphism.", highlight: "return $\"{{3}} for" },
        ],
      },
      {
        id: 4,
        label: "Constructor parameter type for notifications collection",
        answer: "List<Notification>",
        hints: ["Use a list containing the base notification type."],
        explain: [
          { text: "This field stores all the notification objects the service will work with.", highlight: "private readonly List<Notification> _notifications" },
          { text: "The constructor receives the list from outside. The type must match the field — a List containing Notification objects.", highlight: "public NotificationService({{4}} notifications)" },
        ],
      },
      {
        id: 5,
        label: "Increment amount in AddOne",
        answer: "1",
        hints: ["Increase the counter by one each send."],
        explain: [
          { text: "AddOne is a helper method. It takes a number and gives back that number increased by some amount.", highlight: "private int AddOne(int value)" },
          { text: "The method is called AddOne, so the number to add is 1. value + __ is where the increase happens.", highlight: "return value + {{5}}" },
        ],
      },
      {
        id: 6,
        label: "Reuse the existing list reference",
        answer: "notifications",
        hints: ["Use the variable that already stores the List<Notification>."],
        explain: [
          { text: "notifications was already created above as a list with two items in it.", highlight: "var notifications = new List<Notification>" },
          { text: "This line does not build a new list. It copies the address stored in notifications into sameRef.", highlight: "var sameRef = {{6}}" },
          { text: "This checks whether both variables point to the exact same object in memory.", highlight: "Object.ReferenceEquals(notifications, sameRef)" },
        ],
      },
      {
        id: 7,
        label: "Read encapsulated sent counter",
        answer: "GetSentCount",
        hints: ["Use the public method that exposes private _sentCount."],
        explain: [
          { text: "_sentCount counts how many notifications were sent. It is private — outside code cannot read it directly.", highlight: "private int _sentCount" },
          { text: "GetSentCount is the public method that returns its value. The name describes exactly what it gives you.", highlight: "public int GetSentCount()" },
          { text: "We call it here to print the total after all notifications were sent.", highlight: "service.{{7}}()" },
        ],
      },
    ],
  },
];

let idx = 0;
const progress = drills.map((d) => d.blanks.map(() => ({ value: "", hint: -1, explain: false })));

const l1cMeta = document.getElementById("l1cMeta");
const l1cTitle = document.getElementById("l1cTitle");
const l1cContext = document.getElementById("l1cContext");
const l1cConcept = document.getElementById("l1cConcept");
const l1cProgress = document.getElementById("l1cProgress");
const l1cCode = document.getElementById("l1cCode");
const l1cPoints = document.getElementById("l1cPoints");
const l1cInputs = document.getElementById("l1cInputs");
const l1cResult = document.getElementById("l1cResult");
const l1cResultTitle = document.getElementById("l1cResultTitle");
const l1cResultBody = document.getElementById("l1cResultBody");
const l1cResultList = document.getElementById("l1cResultList");
const courseXpLabel = document.getElementById("courseXpLabel");
const l1cCodeWrap = l1cCode.closest(".code-wrap");
const l1cCard = l1cCode.closest(".card");

const l1cPrev = document.getElementById("l1cPrev");
const l1cNext = document.getElementById("l1cNext");
const l1cHint = document.getElementById("l1cHint");
const l1cCheck = document.getElementById("l1cCheck");
const l1cShow = document.getElementById("l1cShow");
const l1cReset = document.getElementById("l1cReset");

const COURSE_XP_KEY = "course_global_xp";
const LEVEL1_CODING_AWARDED_KEY = "level1_coding_awarded";
const codingAwarded = JSON.parse(localStorage.getItem(LEVEL1_CODING_AWARDED_KEY) || "{}");

function loadCourseXP() {
  return parseInt(localStorage.getItem(COURSE_XP_KEY) || "0", 10);
}

function addCourseXP(amount) {
  const next = loadCourseXP() + amount;
  localStorage.setItem(COURSE_XP_KEY, String(next));
  renderCourseXP();
}

function renderCourseXP() {
  if (courseXpLabel) {
    courseXpLabel.textContent = `Course XP: ${loadCourseXP()}`;
  }
}

function markCodingAwarded(drillIndex) {
  codingAwarded[drillIndex] = true;
  localStorage.setItem(LEVEL1_CODING_AWARDED_KEY, JSON.stringify(codingAwarded));
}

function norm(text) {
  return text.replace(/\s+/g, " ").trim().toLowerCase();
}

function canonical(text) {
  return text
    .trim()
    .replace(/;\s*$/g, "")
    .replace(/\s+/g, "")
    .toLowerCase();
}

function withGaps(snippet) {
  return snippet.replace(/\{\{(\d+)\}\}/g, (_, n) => `__${n}__`);
}

let currentHighlightEl = null;

function clearCodeHighlight() {
  if (currentHighlightEl) {
    currentHighlightEl.remove();
    currentHighlightEl = null;
  }
}

function applyCodeHighlight(snippet, highlightStr) {
  clearCodeHighlight();
  if (!highlightStr || !l1cCodeWrap) return;
  const pre = l1cCodeWrap.querySelector("pre");
  if (!pre) return;

  const clean = highlightStr.replace(/\{\{\d+\}\}/g, "").trim();
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
}

let explainOverlay;
let explainCard;
let explainTitle;
let explainBody;

function ensureExplainOverlay() {
  if (explainOverlay) return;

  explainOverlay = document.createElement("div");
  explainOverlay.className = "explain-overlay";
  explainOverlay.hidden = true;

  explainCard = document.createElement("div");
  explainCard.className = "explain-card";

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
  explainOverlay.appendChild(explainCard);
  document.body.appendChild(explainOverlay);

  explainOverlay.addEventListener("click", (event) => {
    if (event.target === explainOverlay) closeExplainOverlay();
  });
}

function closeExplainOverlay() {
  if (!explainOverlay) return;
  explainOverlay.hidden = true;
  clearCodeHighlight();
  if (l1cCodeWrap) l1cCodeWrap.classList.remove("code-spotlight");
  if (l1cCard) l1cCard.classList.remove("code-focus");
}

function positionExplainCard() {
  if (!l1cCodeWrap || !explainCard) return;
  const rect = l1cCodeWrap.getBoundingClientRect();
  const cardHeight = explainCard.offsetHeight || 180;
  const cardWidth = Math.min(560, window.innerWidth - 32);
  const gap = 12;
  const left = Math.max(16, Math.min(rect.left, window.innerWidth - cardWidth - 16));

  // Prefer placing the explanation above the code block to avoid covering source lines.
  let top = rect.top - cardHeight - gap;
  if (top < 16) {
    // If there is not enough room above, place it below the code block instead.
    top = Math.min(window.innerHeight - cardHeight - 16, rect.bottom + gap);
  }

  explainCard.style.left = `${left}px`;
  explainCard.style.top = `${top}px`;
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
      ol.querySelectorAll(".explain-step").forEach((el) => el.classList.remove("active"));
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
  if (l1cCodeWrap) l1cCodeWrap.classList.add("code-spotlight");
  if (l1cCard) l1cCard.classList.add("code-focus");
  positionExplainCard();
}

window.addEventListener("resize", () => {
  if (explainOverlay && !explainOverlay.hidden) positionExplainCard();
});

function render() {
  const d = drills[idx];
  const s = progress[idx];

  closeExplainOverlay();

  renderCourseXP();

  l1cMeta.textContent = "Level 1 Microcoding";
  l1cTitle.textContent = d.title;
  l1cContext.textContent = d.context;
  l1cConcept.textContent = d.concept;
  l1cProgress.textContent = `Drill ${idx + 1} / ${drills.length}`;

  l1cCode.textContent = withGaps(d.snippet);
  Prism.highlightElement(l1cCode);

  l1cPoints.innerHTML = "";
  d.points.forEach((point) => {
    const li = document.createElement("li");
    li.textContent = point;
    l1cPoints.appendChild(li);
  });

  l1cInputs.innerHTML = "";
  d.blanks.forEach((b, i) => {
    const row = document.createElement("div");
    row.className = "input-row";

    const label = document.createElement("label");
    label.setAttribute("for", `l1c-${i}`);
    label.textContent = `Blank ${b.id}: ${b.label}`;

    const input = document.createElement("input");
    input.id = `l1c-${i}`;
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
    l1cInputs.appendChild(row);
  });

  l1cResult.hidden = true;
  l1cPrev.disabled = idx === 0;
  l1cNext.disabled = idx === drills.length - 1;
}

function showHint() {
  const d = drills[idx];
  const s = progress[idx];
  d.blanks.forEach((b, i) => {
    if (s[i].hint < b.hints.length - 1) s[i].hint += 1;
  });
  render();
}

function check() {
  const d = drills[idx];
  const s = progress[idx];
  const rows = [...l1cInputs.querySelectorAll(".input-row")];

  let ok = 0;
  const msgs = [];

  d.blanks.forEach((b, i) => {
    const input = rows[i].querySelector("input");
    const expected = norm(b.answer);
    const actual = norm(s[i].value);
    const expectedCanonical = canonical(b.answer);
    const actualCanonical = canonical(s[i].value);

    input.classList.remove("correct", "wrong", "almost");

    if (actual === expected || actualCanonical === expectedCanonical) {
      ok += 1;
      input.classList.add("correct");
      msgs.push(`Blank ${b.id}: correct`);
    } else if (
      expected.includes(actual) ||
      actual.includes(expected) ||
      expectedCanonical.includes(actualCanonical) ||
      actualCanonical.includes(expectedCanonical)
    ) {
      input.classList.add("almost");
      msgs.push(`Blank ${b.id}: close, verify exact syntax`);
    } else {
      input.classList.add("wrong");
      msgs.push(`Blank ${b.id}: expected ${b.answer}`);
    }
  });

  l1cResultTitle.textContent = `${ok} / ${d.blanks.length} correct`;
  l1cResultBody.textContent =
    ok === d.blanks.length
      ? "Good progress. This concept is now reinforced in code form."
      : "Keep going. Use the hint and try again.";

  if (ok === d.blanks.length && !codingAwarded[idx]) {
    addCourseXP(20);
    markCodingAwarded(idx);
  }

  l1cResultList.innerHTML = "";
  msgs.forEach((m) => {
    const li = document.createElement("li");
    li.textContent = m;
    l1cResultList.appendChild(li);
  });

  l1cResult.hidden = false;
}

function resetDrill() {
  progress[idx] = drills[idx].blanks.map(() => ({ value: "", hint: -1, explain: false }));
  render();
}

function showAnswer() {
  const d = drills[idx];
  const s = progress[idx];

  d.blanks.forEach((b, i) => {
    s[i].value = b.answer;
  });

  render();

  l1cResultTitle.textContent = "Answer revealed";
  l1cResultBody.textContent =
    "You can review the expected solution in the inputs, then use Reset Drill to try again from scratch.";
  l1cResultList.innerHTML = "";
  d.blanks.forEach((b) => {
    const li = document.createElement("li");
    li.textContent = `Blank ${b.id}: ${b.answer}`;
    l1cResultList.appendChild(li);
  });
  l1cResult.hidden = false;
}

l1cPrev.addEventListener("click", () => {
  idx -= 1;
  render();
});

l1cNext.addEventListener("click", () => {
  idx += 1;
  render();
});

l1cHint.addEventListener("click", showHint);
l1cCheck.addEventListener("click", check);
l1cShow.addEventListener("click", showAnswer);
l1cReset.addEventListener("click", resetDrill);

render();
