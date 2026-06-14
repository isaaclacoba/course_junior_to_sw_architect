const topics = [
  {
    title: "Why Software Exists",
    concept: "Modeling Real-World Ideas",
    context: "Programs are formal models of a domain, expressed as state and valid transitions.",
    explain:
      "Software models a real or conceptual domain using explicit representations. Variables encode observable state, and operations define how state may change under rules.",
    points: [
      "State describes what is true at a given time.",
      "Behavior defines valid transitions between states.",
      "Good models make transitions explicit and testable.",
    ],
    mermaid: `flowchart LR\n  A["Real world process"] --> B["Software model"]\n  B --> C["Variables store state"]\n  B --> D["Functions change state"]`,
    question: "Within a software model, what does a variable represent?",
    options: [
      { text: "A piece of model state at a point in time", correct: true },
      { text: "A control-flow structure for repetition", correct: false },
      { text: "A rule that transforms state", correct: false },
    ],
    answerWhy: "A variable binds a name to a value that represents state.",
  },
  {
    title: "Variables and Functions",
    concept: "State + Mechanism",
    context: "Before OO, understand the base layer: data and transformations.",
    explain:
      "Variables bind names to values, and functions define computations over those values. A function may return a new value, mutate existing state, or both.",
    points: [
      "Variables represent program state.",
      "Functions implement deterministic rules over input.",
      "OO builds on these same primitives.",
    ],
    mermaid: `flowchart LR\n  A["input values"] --> B["function rule"]\n  B --> C["updated state"]`,
    question: "In this context, what is the primary role of a function?",
    options: [
      { text: "To define a computation or state transformation", correct: true },
      { text: "To store persistent program data", correct: false },
      { text: "To declare object fields", correct: false },
    ],
    answerWhy: "Functions encode behavior by mapping input to output or updated state.",
  },
  {
    title: "Class and Object",
    concept: "Blueprint vs Instance",
    context: "A class describes shape/behavior; an object is one concrete runtime instance.",
    explain:
      "A class defines a type contract: data members and operations. An object (instance) is a runtime realization of that type with its own independent state.",
    points: [
      "Class = type definition.",
      "Instance = concrete runtime object.",
      "Instances of the same class do not share per-object fields.",
    ],
    mermaid: `flowchart LR\n  A["Class Blueprint"] --> B["Instance 1"]\n  A --> C["Instance 2"]\n  B --> D["state A"]\n  C --> E["state B"]`,
    question: "Which statement correctly distinguishes class and instance?",
    options: [
      { text: "A class defines a type; instances are concrete runtime objects", correct: true },
      { text: "An instance defines the class structure", correct: false },
      { text: "All instances of a class share the same per-object fields", correct: false },
    ],
    answerWhy: "A class is a definition; each instance has its own object state.",
  },
  {
    title: "Memory Model (Intro)",
    concept: "Instantiation and Assignment Semantics",
    context: "Instantiation allocates a new object; assignment stores a value or a reference.",
    explain:
      "When you instantiate an object, the runtime creates a new object in memory. A variable then stores either a direct value (for value semantics) or a reference to that object (for reference semantics).",
    points: [
      "Instantiation creates a new object identity.",
      "Assignment writes a value or reference into a variable slot.",
      "Copying a reference does not clone the underlying object.",
    ],
    mermaid: `flowchart LR\n  A["var a"] --> B["reference"]\n  C["var b = a"] --> B\n  B --> D["Object state"]`,
    question: "After `var b = a` (where `a` references an object), what is true?",
    options: [
      { text: "`a` and `b` reference the same object instance", correct: true },
      { text: "A new object is automatically cloned", correct: false },
      { text: "The assignment only copies method definitions", correct: false },
    ],
    answerWhy: "For reference semantics, assignment copies the reference, not the object itself.",
  },
  {
    title: "Encapsulation",
    concept: "Protecting Internal State",
    context: "Expose safe operations, hide direct field mutation.",
    explain:
      "Encapsulation groups state with behavior and restricts uncontrolled access. External code interacts through methods that preserve invariants.",
    points: [
      "Private members protect representation details.",
      "Public methods expose stable contracts.",
      "Validation should occur at mutation boundaries.",
    ],
    mermaid: `flowchart LR\n  A["Caller"] --> B["Public Method"]\n  B --> C["Validation"]\n  C --> D["Private Field Update"]`,
    question: "What is the main goal of encapsulation?",
    options: [
      { text: "To protect invariants by controlling access to state", correct: true },
      { text: "To eliminate the need for public APIs", correct: false },
      { text: "To expose internal fields directly for convenience", correct: false },
    ],
    answerWhy: "Encapsulation protects internal representation and enforces valid updates.",
  },
  {
    title: "Polymorphism",
    concept: "Same Call, Different Behavior",
    context: "One base type reference can point to different implementations.",
    explain:
      "Polymorphism allows one interface or base type to represent multiple concrete implementations. Method dispatch resolves behavior according to runtime type.",
    points: [
      "The contract is stable, implementations vary.",
      "Subtypes satisfy the same callable interface.",
      "Client code depends on abstraction, not concrete classes.",
    ],
    mermaid: `flowchart LR\n  A["Base Type Ref"] --> B["Concrete Type A"]\n  A --> C["Concrete Type B"]\n  B --> D["Behavior A"]\n  C --> E["Behavior B"]`,
    question: "What does polymorphism enable at runtime?",
    options: [
      { text: "Different implementations behind one shared contract", correct: true },
      { text: "Automatic conversion of all classes to one type", correct: false },
      { text: "Direct field access across unrelated types", correct: false },
    ],
    answerWhy: "A call through an abstraction resolves to the concrete implementation at runtime.",
  },
  {
    title: "Inheritance",
    concept: "Hierarchy and Reuse Through Base Types",
    context: "After polymorphism, inheritance is the natural next layer to model hierarchy.",
    explain:
      "Inheritance expresses an is-a relationship between types. A derived type extends or specializes behavior defined in its base type.",
    points: [
      "Use inheritance for semantic hierarchy, not only reuse.",
      "It enables polymorphism through base references.",
      "Each type must still protect its invariants.",
    ],
    mermaid: `flowchart LR\n  A["Base class"] --> B["Derived class A"]\n  A --> C["Derived class B"]\n  B --> D["Specialized behavior"]\n  C --> E["Specialized behavior"]`,
    question: "What best characterizes inheritance in OO design?",
    options: [
      { text: "Modeling an is-a hierarchy with shared and specialized members", correct: true },
      { text: "Replacing composition in all designs", correct: false },
      { text: "Removing runtime polymorphism", correct: false },
    ],
    answerWhy: "Inheritance expresses hierarchy and supports reuse plus polymorphic substitution.",
  },
  {
    title: "Composition",
    concept: "Reuse by Combining Collaborators",
    context: "While inheritance builds hierarchy, composition builds reusable logic by combining objects.",
    explain:
      "Composition expresses a has-a relationship: a type delegates part of its behavior to collaborators. It often improves flexibility and reduces tight coupling.",
    points: [
      "Behavior is assembled from focused components.",
      "Each collaborator encapsulates its own state.",
      "Polymorphism appears when collaborators are abstracted by interfaces.",
    ],
    mermaid: `flowchart LR\n  A["Service"] --> B["Validator collaborator"]\n  A --> C["Repository collaborator"]\n  B --> D["Encapsulated logic"]\n  C --> E["Encapsulated logic"]`,
    question: "Which statement best defines composition?",
    options: [
      { text: "Building behavior by delegating to collaborating objects", correct: true },
      { text: "Expressing hierarchy through base and derived types", correct: false },
      { text: "Exposing all collaborator internals for reuse", correct: false },
    ],
    answerWhy: "Composition is a has-a relationship where collaborators provide focused behavior.",
  },
  {
    title: "Dependency Injection (Intro)",
    concept: "Supplying Dependencies from Outside",
    context: "A class should receive collaborators instead of creating them internally.",
    explain:
      "Dependency Injection externalizes object construction and supplies required collaborators to a class. This is a practical form of inversion of control.",
    points: [
      "Classes declare dependencies explicitly.",
      "A composition root wires concrete implementations.",
      "Testing improves because dependencies are replaceable.",
    ],
    mermaid: `flowchart LR\n  A["Composer or Main"] --> B["new Dependency"]\n  A --> C["new Service"]\n  C --> D["Uses injected dependency"]`,
    question: "What is the primary design benefit of dependency injection?",
    options: [
      { text: "Lower coupling through externally provided dependencies", correct: true },
      { text: "No need to define object responsibilities", correct: false },
      { text: "Guaranteed elimination of all abstractions", correct: false },
    ],
    answerWhy: "DI separates object behavior from object construction, improving substitutability and testing.",
  },
  {
    title: "Level 1 Closing Check",
    concept: "Integrated Mental Model",
    context: "Final checkpoint before moving to coding practice.",
    explain:
      "This final question checks whether you can connect state, behavior, object identity, and abstraction choices in one coherent model.",
    points: [
      "Model state explicitly.",
      "Control state changes through behavior.",
      "Choose abstraction and reuse strategy intentionally.",
    ],
    mermaid: `flowchart LR\n  A["State"] --> B["Behavior"]\n  B --> C["Objects and identity"]\n  C --> D["Abstraction choice"]`,
    question: "Which sequence best reflects Level 1 reasoning from a software model to OO design?",
    options: [
      { text: "State -> behavior -> object identity -> abstraction strategy", correct: true },
      { text: "Inheritance -> syntax tricks -> random output", correct: false },
      { text: "Dependency injection -> no state modeling", correct: false },
    ],
    answerWhy: "Solid OO design starts from modeling state and behavior, then applies identity and abstraction choices.",
  },
];

let topicIndex = 0;
const selectedAnswer = new Map();

const l1Meta = document.getElementById("l1Meta");
const l1Title = document.getElementById("l1Title");
const l1Context = document.getElementById("l1Context");
const l1Concept = document.getElementById("l1Concept");
const l1Progress = document.getElementById("l1Progress");
const l1Explain = document.getElementById("l1Explain");
const l1Points = document.getElementById("l1Points");
const l1Diagram = document.getElementById("l1Diagram");
const l1Question = document.getElementById("l1Question");
const l1Options = document.getElementById("l1Options");
const l1Feedback = document.getElementById("l1Feedback");
const l1Prev = document.getElementById("l1Prev");
const l1Next = document.getElementById("l1Next");
const courseXpLabel = document.getElementById("courseXpLabel");

const COURSE_XP_KEY = "course_global_xp";
const LEVEL1_THEORY_AWARDED_KEY = "level1_theory_awarded";
const theoryAwarded = JSON.parse(localStorage.getItem(LEVEL1_THEORY_AWARDED_KEY) || "{}");

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

function markTheoryAwarded(topicIdx) {
  theoryAwarded[topicIdx] = true;
  localStorage.setItem(LEVEL1_THEORY_AWARDED_KEY, JSON.stringify(theoryAwarded));
}

if (window.mermaid) {
  window.mermaid.initialize({
    startOnLoad: false,
    theme: "neutral",
    securityLevel: "loose",
  });
}

async function renderLevel1Diagram(topic) {
  l1Diagram.innerHTML = "";
  if (window.mermaid && topic.mermaid) {
    try {
      const { svg } = await window.mermaid.render(`l1-${topicIndex}-${Date.now()}`, topic.mermaid);
      l1Diagram.innerHTML = `<div class="mermaid">${svg}</div>`;
      return;
    } catch (_err) {
      // fallback text for safety
    }
  }

  const fallback = document.createElement("p");
  fallback.className = "context";
  fallback.textContent = "Diagram rendering fallback: please refresh if Mermaid did not load.";
  l1Diagram.appendChild(fallback);
}

function setFeedback(text, isGood) {
  l1Feedback.textContent = text;
  l1Feedback.style.color = isGood ? "var(--good)" : "var(--warn)";
}

function shuffleOptions(options) {
  const copy = [...options];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function renderOptions(topic) {
  l1Options.innerHTML = "";
  l1Feedback.textContent = "";

  const shuffled = shuffleOptions(topic.options);

  shuffled.forEach((option, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn";
    const letter = String.fromCharCode(65 + idx);
    btn.textContent = `${letter}) ${option.text}`;

    btn.addEventListener("click", () => {
      selectedAnswer.set(topicIndex, option.text);
      if (option.correct) {
        setFeedback(`Good choice. ${topic.answerWhy}`, true);
        if (!theoryAwarded[topicIndex]) {
          addCourseXP(10);
          markTheoryAwarded(topicIndex);
        }
      } else {
        setFeedback(`Thanks for answering. ${topic.answerWhy}`, false);
      }
    });

    l1Options.appendChild(btn);
  });
}

function renderTopic() {
  const topic = topics[topicIndex];
  const remaining = topics.length - (topicIndex + 1);
  const shortExplain = topic.explain.split(". ").slice(0, 2).join(". ").trim();

  renderCourseXP();

  l1Meta.textContent = `Foundations · ${remaining} topics remaining`;
  l1Title.textContent = topic.title;
  l1Context.textContent = topic.context;
  l1Concept.textContent = topic.concept;
  l1Progress.textContent = `Topic ${topicIndex + 1} / ${topics.length}`;
  l1Explain.textContent = shortExplain.endsWith(".") ? shortExplain : `${shortExplain}.`;
  l1Question.textContent = `Question (choose 1): ${topic.question}`;

  l1Points.innerHTML = "";
  topic.points.slice(0, 2).forEach((point) => {
    const li = document.createElement("li");
    li.textContent = point;
    l1Points.appendChild(li);
  });

  renderOptions(topic);
  void renderLevel1Diagram(topic);

  l1Prev.disabled = topicIndex === 0;
  l1Next.disabled = topicIndex === topics.length - 1;
}

l1Prev.addEventListener("click", () => {
  topicIndex -= 1;
  renderTopic();
});

l1Next.addEventListener("click", () => {
  topicIndex += 1;
  renderTopic();
});

renderTopic();
