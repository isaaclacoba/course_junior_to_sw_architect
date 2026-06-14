const drills = [
  {
    title: "Variables Hold State",
    concept: "Variable Assignment",
    context: "Write two simple lines to store and print state.",
    snippet: `public class Program
{
    public static void Main()
    {
        int age = {{1}};
        Console.WriteLine({{2}});
    }
}`,
    points: [
      "Variables store the current value of the model.",
      "Assignment uses =.",
      "Console.WriteLine helps inspect state.",
    ],
    mermaid: `flowchart LR
  A[age variable] --> B[stores value]
  B --> C[printed to console]`,
    blanks: [
      { id: 1, label: "Assign an integer", answer: "30", hints: ["Use a simple whole number."] },
      { id: 2, label: "Print variable value", answer: "age", hints: ["Print the variable, not a fixed literal."] },
    ],
  },
  {
    title: "Functions Change State",
    concept: "Method Parameters + Return",
    context: "Complete a method that updates state and returns it.",
    snippet: `public static int AddOne(int value)
{
    return {{1}};
}

public static void Main()
{
    var count = 5;
    count = AddOne(count);
    Console.WriteLine({{2}});
}`,
    points: [
      "A function is a transformation rule.",
      "Input parameter is value.",
      "Return gives updated state back.",
    ],
    mermaid: `flowchart LR
  A[value] --> B[AddOne]
  B --> C[value + 1]`,
    blanks: [
      { id: 1, label: "Return incremented value", answer: "value + 1", hints: ["Increase by exactly one."] },
      { id: 2, label: "Print updated variable", answer: "count", hints: ["Print the variable modified in Main."] },
    ],
  },
  {
    title: "Class and Instance",
    concept: "Blueprint vs Object",
    context: "Create an object from class and call its behavior.",
    snippet: `public class Counter
{
    public int Value;

    public void Increment()
    {
        Value = Value + 1;
    }
}

public static void Main()
{
    var counter = new {{1}}();
    counter.{{2}}();
    Console.WriteLine(counter.Value);
}`,
    points: [
      "Class is the blueprint.",
      "Object/instance is a concrete runtime value.",
      "Method call updates internal state.",
    ],
    mermaid: `flowchart LR
  A[Counter class] --> B[counter instance]
  B --> C[Increment]
  C --> D[Value changes]`,
    blanks: [
      { id: 1, label: "Instantiate class", answer: "Counter", hints: ["Use class name after new."] },
      { id: 2, label: "Call update method", answer: "Increment", hints: ["Call method that adds one."] },
    ],
  },
  {
    title: "Encapsulation",
    concept: "Private State + Public Access",
    context: "Protect field access through methods.",
    snippet: `public class Wallet
{
    private int _amount;

    public void SetAmount(int value)
    {
        _amount = value;
    }

    public int {{1}}()
    {
        return _amount;
    }
}

var wallet = new Wallet();
wallet.SetAmount(50);
Console.WriteLine(wallet.{{2}}());`,
    points: [
      "Private fields avoid uncontrolled writes.",
      "Public methods expose safe interaction.",
      "Read and write paths are explicit.",
    ],
    mermaid: `flowchart LR
  A[Caller] --> B[SetAmount]
  B --> C[_amount private field]
  A --> D[GetAmount]`,
    blanks: [
      { id: 1, label: "Getter method name", answer: "GetAmount", hints: ["Follow GetX style."] },
      { id: 2, label: "Call getter", answer: "GetAmount", hints: ["Use method from blank 1."] },
    ],
  },
  {
    title: "Polymorphism Intro",
    concept: "Same Call, Different Behavior",
    context: "Use base type reference with different implementations.",
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

Animal pet = new {{1}}();
Console.WriteLine(pet.{{2}}());`,
    points: [
      "One contract, many implementations.",
      "Runtime type decides behavior.",
      "Caller code can stay generic.",
    ],
    mermaid: `flowchart LR
  A[Animal ref] --> B[Dog]
  A --> C[Cat]
  B --> D[Woof]
  C --> E[Meow]`,
    blanks: [
      { id: 1, label: "Choose concrete implementation", answer: "Dog", hints: ["Use a class that inherits Animal."] },
      { id: 2, label: "Call abstract contract", answer: "Speak", hints: ["Method returns sound."] },
    ],
  },
];

const state = drills.map((d) => d.blanks.map(() => ({ value: "", hint: -1, explain: false })));
let i = 0;

const l2Meta = document.getElementById("l2Meta");
const l2Title = document.getElementById("l2Title");
const l2Context = document.getElementById("l2Context");
const l2Concept = document.getElementById("l2Concept");
const l2Progress = document.getElementById("l2Progress");
const l2Code = document.getElementById("l2Code");
const l2Points = document.getElementById("l2Points");
const l2Diagram = document.getElementById("l2Diagram");
const l2Inputs = document.getElementById("l2Inputs");
const l2Result = document.getElementById("l2Result");
const l2ResultTitle = document.getElementById("l2ResultTitle");
const l2ResultBody = document.getElementById("l2ResultBody");
const l2ResultList = document.getElementById("l2ResultList");
const courseXpLabel = document.getElementById("courseXpLabel");
const l2CodeWrap = l2Code.closest(".code-wrap");

const l2Prev = document.getElementById("l2Prev");
const l2Next = document.getElementById("l2Next");
const l2Hint = document.getElementById("l2Hint");
const l2Check = document.getElementById("l2Check");
const l2Reset = document.getElementById("l2Reset");

const COURSE_XP_KEY = "course_global_xp";
const LEVEL2_AWARDED_KEY = "level2_awarded";
const level2Awarded = JSON.parse(localStorage.getItem(LEVEL2_AWARDED_KEY) || "{}");

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

function markLevel2Awarded(drillIndex) {
  level2Awarded[drillIndex] = true;
  localStorage.setItem(LEVEL2_AWARDED_KEY, JSON.stringify(level2Awarded));
}

if (window.mermaid) {
  window.mermaid.initialize({ startOnLoad: false, theme: "neutral", securityLevel: "loose" });
}

function normalize(s) {
  return s.replace(/\s+/g, " ").trim().toLowerCase();
}

function withSlots(snippet) {
  return snippet.replace(/\{\{(\d+)\}\}/g, (_, n) => `__${n}__`);
}

function explainLine(snippet, blankId) {
  const marker = `{{${blankId}}}`;
  const line = snippet
    .split("\n")
    .find((candidate) => candidate.includes(marker));

  if (!line) {
    return "Fill the missing part so the code works as one complete idea.";
  }

  return `You are completing this line: ${line.replace(marker, "____").trim()}`;
}

function simpleExplain(drill, blank) {
  const firstHint = blank.hints && blank.hints.length > 0 ? blank.hints[0] : "Think about what this line should do.";
  return `${explainLine(drill.snippet, blank.id)} This blank is about: ${blank.label}. ${firstHint}`;
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

  explainBody = document.createElement("p");
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
  if (l2CodeWrap) l2CodeWrap.classList.remove("code-spotlight");
}

function positionExplainCard() {
  if (!l2CodeWrap || !explainCard) return;
  const rect = l2CodeWrap.getBoundingClientRect();
  const cardWidth = Math.min(560, window.innerWidth - 32);
  const left = Math.max(16, Math.min(rect.left + 18, window.innerWidth - cardWidth - 16));
  const top = Math.max(16, rect.top + 18);
  explainCard.style.left = `${left}px`;
  explainCard.style.top = `${top}px`;
}

function showExplainOverlay(blank, message) {
  ensureExplainOverlay();
  explainTitle.textContent = `Blank ${blank.id}: ${blank.label}`;
  explainBody.textContent = message;
  explainOverlay.hidden = false;
  if (l2CodeWrap) l2CodeWrap.classList.add("code-spotlight");
  positionExplainCard();
}

window.addEventListener("resize", () => {
  if (explainOverlay && !explainOverlay.hidden) positionExplainCard();
});

async function renderDiagram(drill) {
  l2Diagram.innerHTML = "";
  if (window.mermaid && drill.mermaid) {
    try {
      const { svg } = await window.mermaid.render(`l2-${i}-${Date.now()}`, drill.mermaid);
      l2Diagram.innerHTML = `<div class="mermaid">${svg}</div>`;
      return;
    } catch (_err) {
      // fallback below
    }
  }
  const p = document.createElement("p");
  p.className = "context";
  p.textContent = "Diagram fallback shown because Mermaid did not render.";
  l2Diagram.appendChild(p);
}

function render() {
  const d = drills[i];
  const s = state[i];

  closeExplainOverlay();

  renderCourseXP();

  l2Meta.textContent = "Core coding drills";
  l2Title.textContent = d.title;
  l2Context.textContent = d.context;
  l2Concept.textContent = d.concept;
  l2Progress.textContent = `Drill ${i + 1} / ${drills.length}`;

  l2Code.textContent = withSlots(d.snippet);
  Prism.highlightElement(l2Code);

  l2Points.innerHTML = "";
  d.points.forEach((point) => {
    const li = document.createElement("li");
    li.textContent = point;
    l2Points.appendChild(li);
  });

  void renderDiagram(d);

  l2Inputs.innerHTML = "";
  d.blanks.forEach((b, idx) => {
    const row = document.createElement("div");
    row.className = "input-row";

    const label = document.createElement("label");
    label.setAttribute("for", `l2-${idx}`);
    label.textContent = `Blank ${b.id}: ${b.label}`;

    const input = document.createElement("input");
    input.id = `l2-${idx}`;
    input.value = s[idx].value;
    input.placeholder = "Write short C# code";
    input.addEventListener("input", (e) => {
      s[idx].value = e.target.value;
      input.classList.remove("correct", "wrong", "almost");
    });

    const hint = document.createElement("div");
    hint.className = "hint";
    if (s[idx].hint >= 0) {
      hint.textContent = `Hint: ${b.hints[Math.min(s[idx].hint, b.hints.length - 1)]}`;
    }

    const explainBtn = document.createElement("button");
    explainBtn.type = "button";
    explainBtn.className = "btn explain-btn";
    explainBtn.textContent = "Explain this part";
    explainBtn.addEventListener("click", () => {
      showExplainOverlay(b, `Simple explain: ${simpleExplain(d, b)}`);
    });

    row.append(label, input, hint, explainBtn);
    l2Inputs.appendChild(row);
  });

  l2Result.hidden = true;
  l2Prev.disabled = i === 0;
  l2Next.disabled = i === drills.length - 1;
}

function showHint() {
  const d = drills[i];
  const s = state[i];
  d.blanks.forEach((b, idx) => {
    if (s[idx].hint < b.hints.length - 1) s[idx].hint += 1;
  });
  render();
}

function check() {
  const d = drills[i];
  const s = state[i];
  const rows = [...l2Inputs.querySelectorAll(".input-row")];

  let ok = 0;
  const details = [];

  d.blanks.forEach((b, idx) => {
    const input = rows[idx].querySelector("input");
    const expected = normalize(b.answer);
    const actual = normalize(s[idx].value);

    input.classList.remove("correct", "wrong", "almost");

    if (actual === expected) {
      ok += 1;
      input.classList.add("correct");
      details.push(`Blank ${b.id}: correct`);
    } else if (expected.includes(actual) || actual.includes(expected)) {
      input.classList.add("almost");
      details.push(`Blank ${b.id}: close, check exact syntax`);
    } else {
      input.classList.add("wrong");
      details.push(`Blank ${b.id}: expected ${b.answer}`);
    }
  });

  l2ResultTitle.textContent = `${ok} / ${d.blanks.length} correct`;
  l2ResultBody.textContent =
    ok === d.blanks.length
      ? "Great. You refreshed this core concept with valid C# fragments."
      : "Not yet. Use hints and retry.";

  if (ok === d.blanks.length && !level2Awarded[i]) {
    addCourseXP(25);
    markLevel2Awarded(i);
  }

  l2ResultList.innerHTML = "";
  details.forEach((msg) => {
    const li = document.createElement("li");
    li.textContent = msg;
    l2ResultList.appendChild(li);
  });

  l2Result.hidden = false;
}

function resetDrill() {
  state[i] = drills[i].blanks.map(() => ({ value: "", hint: -1, explain: false }));
  render();
}

l2Prev.addEventListener("click", () => {
  i -= 1;
  render();
});

l2Next.addEventListener("click", () => {
  i += 1;
  render();
});

l2Hint.addEventListener("click", showHint);
l2Check.addEventListener("click", check);
l2Reset.addEventListener("click", resetDrill);

render();
