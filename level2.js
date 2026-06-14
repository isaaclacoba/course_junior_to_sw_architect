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
      {
        id: 1,
        label: "Assign an integer",
        answer: "30",
        hints: ["Use a simple whole number."],
        explain: [
          { text: "int declares a variable that can hold a whole number. age is the name we chose for it.", highlight: "int age = {{1}}" },
          { text: "The = sign puts a value into the variable. You just need to put a number after it.", highlight: "int age = {{1}}" },
          { text: "This line reads age and prints whatever number is stored in it.", highlight: "Console.WriteLine({{2}})" },
        ],
      },
      {
        id: 2,
        label: "Print variable value",
        answer: "age",
        hints: ["Print the variable, not a fixed literal."],
        explain: [
          { text: "age is the variable we filled with a number just above.", highlight: "int age = {{1}}" },
          { text: "Console.WriteLine prints whatever you put inside the parentheses. Putting age here means it prints the number stored in age — not the word 'age'.", highlight: "Console.WriteLine({{2}})" },
        ],
      },
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
      {
        id: 1,
        label: "Return incremented value",
        answer: "value + 1",
        hints: ["Increase by exactly one."],
        explain: [
          { text: "AddOne is a function. It takes a number called value as input and must give back a new number.", highlight: "public static int AddOne(int value)" },
          { text: "return sends the result back to whoever called the function. The function stops after return.", highlight: "return {{1}}" },
          { text: "The function is named AddOne — so the result must be value plus 1. The + symbol means add.", highlight: "return {{1}}" },
        ],
      },
      {
        id: 2,
        label: "Print updated variable",
        answer: "count",
        hints: ["Print the variable modified in Main."],
        explain: [
          { text: "count starts at 5. The next line calls AddOne and stores the result back into count.", highlight: "count = AddOne(count)" },
          { text: "Console.WriteLine prints whatever is in the parentheses. We want to see the updated count after AddOne ran.", highlight: "Console.WriteLine({{2}})" },
        ],
      },
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
      {
        id: 1,
        label: "Instantiate class",
        answer: "Counter",
        hints: ["Use class name after new."],
        explain: [
          { text: "Counter is the class defined above. It is the blueprint that describes what a counter looks like and what it can do.", highlight: "public class Counter" },
          { text: "new creates a real object in memory using that blueprint. You must name which class to use right after new.", highlight: "var counter = new {{1}}()" },
          { text: "counter is the variable that holds a reference to the new object. The lines below use it.", highlight: "var counter = new {{1}}()" },
        ],
      },
      {
        id: 2,
        label: "Call update method",
        answer: "Increment",
        hints: ["Call method that adds one."],
        explain: [
          { text: "Increment is defined inside Counter. When called, it runs Value = Value + 1.", highlight: "public void Increment()" },
          { text: "The dot after counter means: call something on this object. Increment() calls the method.", highlight: "counter.{{2}}()" },
          { text: "This prints Value to confirm the increment happened.", highlight: "Console.WriteLine(counter.Value)" },
        ],
      },
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
      {
        id: 1,
        label: "Getter method name",
        answer: "GetAmount",
        hints: ["Follow GetX style."],
        explain: [
          { text: "_amount is private. Nothing outside Wallet can read or set it directly.", highlight: "private int _amount" },
          { text: "SetAmount is the write door — it puts a value into _amount.", highlight: "public void SetAmount(int value)" },
          { text: "This is the read door. It is public, returns an int, and simply gives back _amount.", highlight: "public int {{1}}()" },
          { text: "return _amount sends the stored value out to the caller.", highlight: "return _amount" },
        ],
      },
      {
        id: 2,
        label: "Call getter",
        answer: "GetAmount",
        hints: ["Use method from blank 1."],
        explain: [
          { text: "wallet.SetAmount(50) stored 50 inside _amount.", highlight: "wallet.SetAmount(50)" },
          { text: "To read _amount from outside the class, we must go through the public method. The dot after wallet calls it on that object.", highlight: "Console.WriteLine(wallet.{{2}}())" },
        ],
      },
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
      {
        id: 1,
        label: "Choose concrete implementation",
        answer: "Dog",
        hints: ["Use a class that inherits Animal."],
        explain: [
          { text: "Animal is abstract — you cannot create an Animal directly. Dog and Cat are concrete classes that extend Animal.", highlight: "public abstract class Animal" },
          { text: "new Dog() creates a Dog object in memory. It can be stored in an Animal variable because Dog is a kind of Animal.", highlight: "Animal pet = new {{1}}()" },
          { text: "pet is typed as Animal. C# will decide which Speak to call based on the actual object at runtime.", highlight: "Animal pet = new {{1}}()" },
        ],
      },
      {
        id: 2,
        label: "Call abstract contract",
        answer: "Speak",
        hints: ["Method returns sound."],
        explain: [
          { text: "Speak is declared in Animal and overridden in both Dog and Cat with different return values.", highlight: "public abstract string Speak()" },
          { text: "pet.Speak() calls Speak through the Animal reference. Because pet holds a Dog, C# runs Dog's version and returns Woof.", highlight: "Console.WriteLine(pet.{{2}}())" },
        ],
      },
    ],
  },
];

const state = drills.map((d) => d.blanks.map(() => ({ value: "", hint: -1 })));
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

let currentHighlightEl = null;

function clearCodeHighlight() {
  if (currentHighlightEl) {
    currentHighlightEl.remove();
    currentHighlightEl = null;
  }
}

function applyCodeHighlight(snippet, highlightStr) {
  clearCodeHighlight();
  if (!highlightStr || !l2CodeWrap) return;
  const pre = l2CodeWrap.querySelector("pre");
  if (!pre) return;

  const clean = highlightStr.replace(/\{\{\d+\}\}/g, "").trim();
  if (!clean) return;
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

  hl.scrollIntoView({ block: "nearest", behavior: "smooth" });
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
  explainCard.hidden = true;

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
  document.body.appendChild(explainOverlay);
  document.body.appendChild(explainCard);

  explainOverlay.addEventListener("click", (event) => {
    if (event.target === explainOverlay) closeExplainOverlay();
  });
}

function closeExplainOverlay() {
  if (!explainOverlay) return;
  explainOverlay.hidden = true;
  if (explainCard) explainCard.hidden = true;
  explainOverlay.style.clipPath = "";
  clearCodeHighlight();
  if (l2CodeWrap) l2CodeWrap.classList.remove("code-spotlight");
}

function updateOverlayClipPath() {
  if (!l2CodeWrap || !explainOverlay) return;
  const r = l2CodeWrap.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const d = `M0 0 H${vw} V${vh} H0 Z M${r.left} ${r.top} H${r.right} V${r.bottom} H${r.left} Z`;
  explainOverlay.style.clipPath = `path(evenodd, '${d}')`;
}

function positionExplainCard() {
  if (!explainCard) return;
  const cardWidth = Math.min(560, window.innerWidth - 32);
  const left = Math.max(16, Math.floor((window.innerWidth - cardWidth) / 2));
  explainCard.style.left = `${left}px`;
  explainCard.style.top = "";
  explainCard.style.bottom = "16px";
  explainCard.style.maxHeight = `${Math.floor(window.innerHeight * 0.38)}px`;
  explainCard.style.overflowY = "auto";
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
  if (explainCard) explainCard.hidden = false;
  if (l2CodeWrap) {
    l2CodeWrap.scrollIntoView({ behavior: "instant", block: "start" });
    l2CodeWrap.classList.add("code-spotlight");
  }
  requestAnimationFrame(() => {
    updateOverlayClipPath();
    positionExplainCard();
  });
}

window.addEventListener("resize", () => {
  if (explainOverlay && !explainOverlay.hidden) {
    updateOverlayClipPath();
    positionExplainCard();
  }
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
      showExplainOverlay(Array.isArray(b.explain) ? b.explain : [], d.snippet);
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
  state[i] = drills[i].blanks.map(() => ({ value: "", hint: -1 }));
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
