// Level 4 - Reuse Without Regret.
// Reading-to-understand: every card shows code; you only choose an answer.
// Spine: is-a vs has-a, favour composition, diamond problem as the core "why".

const lessons = [
  // ---------------------------------------------------------------- Section A
  {
    section: "A. What is what",
    title: "Two ways to build, one payoff",
    concept: "The big picture",
    context: "Inheritance and composition both answer: how do I build a type out of other types?",
    code: `// 1) INHERITANCE - a Cat IS-A Animal (borrow from a parent)
public class Animal { public void Breathe() { } }
public class Cat : Animal { public void Meow() { } }

// 2) COMPOSITION - a Cat HAS-A Heart (hold a smaller part)
public class Heart { public void Beat() { } }
public class RoboCat { private Heart _heart = new Heart(); }

// POLYMORPHISM is neither. It is the PAYOFF both can deliver:
// call one method name, get many behaviours.`,
    explain:
      "Juniors often think inheritance, composition and polymorphism are three options on the same menu. They are not. Inheritance (is-a) and composition (has-a) are two ways to combine code. Polymorphism is the reward you collect afterwards.",
    points: [
      "Inheritance and composition: ways to combine types.",
      "Polymorphism: one call, many behaviours - the payoff.",
    ],
    mermaid:
      "flowchart LR\n  subgraph Inheritance [\"is-a\"]\n    An[Animal] --> Ca[Cat]\n  end\n  subgraph Composition [\"has-a\"]\n    Rc[RoboCat] --> He[Heart]\n  end",
    question: "Inheritance and composition are both ways to do what?",
    options: [
      { text: "Combine and reuse code by building a type from other types", correct: true },
      { text: "Make the program run faster", correct: false },
      { text: "Exactly the same thing as polymorphism", correct: false },
    ],
    answerWhy: "Both are about building one type out of others. Polymorphism is the payoff, not a third way to combine.",
  },
  {
    section: "A. What is what",
    title: "Inheritance is an is-a promise",
    concept: "Inheritance = is-a",
    context: "A child class borrows everything its parent has, because it claims to be a kind of that parent.",
    code: `public class Animal
{
    public void Breathe() => Console.WriteLine("...breathe...");
}

// A Dog IS-A Animal, so it gets Breathe() for free.
public class Dog : Animal
{
    public void Fetch() => Console.WriteLine("fetches the stick");
}

var rex = new Dog();
rex.Breathe();   // inherited from Animal
rex.Fetch();     // its own`,
    explain:
      "The colon in `Dog : Animal` reads as 'is a'. A Dog is a kind of Animal, so every Animal member comes along automatically. Inheritance is reuse by claiming kinship.",
    points: [
      "`Dog : Animal` means Dog is-a Animal.",
      "The child inherits the parent's members without redeclaring them.",
    ],
    mermaid: "flowchart LR\n  Animal --> Dog\n  Dog -->|inherits| Breathe[\"Breathe()\"]",
    question: "Why can rex call Breathe() when Dog never declares it?",
    options: [
      { text: "Dog is-a Animal, so it inherits Breathe() from the parent", correct: true },
      { text: "Breathe() is a global function any class can call", correct: false },
      { text: "Dog secretly holds an Animal field", correct: false },
    ],
    answerWhy: "Inheritance means a Dog is a kind of Animal, so it inherits the parent's members.",
  },
  {
    section: "A. What is what",
    title: "Composition is a has-a promise",
    concept: "Composition = has-a",
    context: "Instead of being a kind of something, a class can hold one and use it.",
    code: `public class Voice
{
    private readonly string _sound;
    public Voice(string sound) => _sound = sound;
    public void Speak() => Console.WriteLine(_sound);
}

// A Dog HAS-A Voice. It holds one and asks it to do the work.
public class Dog
{
    private readonly Voice _voice = new Voice("Woof");
    public void Bark() => _voice.Speak();
}`,
    explain:
      "Here Dog does not inherit anything. It keeps a Voice as a field and delegates to it. That holding relationship is composition: a has-a. The Dog is built out of smaller parts it owns.",
    points: [
      "Dog holds a Voice field - it has-a Voice.",
      "Bark() delegates the real work to the held object.",
    ],
    mermaid: "flowchart LR\n  Dog -->|has-a| Voice\n  Voice --> Speak[\"Speak()\"]",
    question: "What is the relationship between Dog and Voice here?",
    options: [
      { text: "Dog has-a Voice (composition)", correct: true },
      { text: "Dog is-a Voice (inheritance)", correct: false },
      { text: "Voice is-a Dog", correct: false },
    ],
    answerWhy: "Dog holds a Voice as a field and delegates to it. That is composition - a has-a relationship.",
  },
  {
    section: "A. What is what",
    title: "Polymorphism: one call, many answers",
    concept: "Polymorphism = the payoff",
    context: "Same method name, different behaviour, chosen at runtime by the real type.",
    code: `public abstract class Animal { public abstract string Speak(); }
public class Dog : Animal { public override string Speak() => "Woof"; }
public class Cat : Animal { public override string Speak() => "Meow"; }
public class Cow : Animal { public override string Speak() => "Moo"; }

foreach (Animal a in new Animal[] { new Dog(), new Cat(), new Cow() })
    Console.WriteLine(a.Speak());`,
    explain:
      "The loop knows nothing about Dog, Cat or Cow. It calls Speak() on an Animal. Each real object answers in its own way. One call site, many behaviours - that is polymorphism, and it is why the loop never needs an if-else per animal.",
    points: [
      "The loop variable is typed Animal, not Dog/Cat/Cow.",
      "The runtime type decides which Speak() runs.",
    ],
    mermaid:
      "flowchart LR\n  Call[\"a.Speak()\"] --> Dog[\"Woof\"]\n  Call --> Cat[\"Meow\"]\n  Call --> Cow[\"Moo\"]",
    question: "The loop calls a.Speak() once. Why three different words?",
    options: [
      { text: "Each subtype overrides Speak() with its own behaviour - polymorphism", correct: true },
      { text: "The loop secretly runs three separate methods each pass", correct: false },
      { text: "Speak() returns a random word", correct: false },
    ],
    answerWhy: "One call site, many behaviours chosen at runtime by the real type. That is polymorphism.",
  },

  // ---------------------------------------------------------------- Section B
  {
    section: "B. Read and predict",
    title: "Predict the pen",
    concept: "Trace polymorphism",
    context: "Read carefully and predict the exact output before you answer.",
    code: `public abstract class Animal { public abstract string Sound(); }
public class Duck  : Animal { public override string Sound() => "Quack"; }
public class Sheep : Animal { public override string Sound() => "Baa"; }

Animal[] pen = { new Sheep(), new Duck(), new Sheep() };
foreach (var a in pen)
    Console.Write(a.Sound() + " ");`,
    explain:
      "There is no trick beyond reading the array order and each type's overridden Sound(). The array is Sheep, Duck, Sheep, so the words follow that order.",
    points: [
      "Read the array order left to right.",
      "Each element answers with its own override.",
    ],
    mermaid:
      "flowchart LR\n  S1[Sheep] --> Baa1[Baa]\n  D[Duck] --> Q[Quack]\n  S2[Sheep] --> Baa2[Baa]",
    question: "What does this print?",
    options: [
      { text: "Baa Quack Baa", correct: true },
      { text: "Quack Baa Quack", correct: false },
      { text: "Baa Baa Baa", correct: false },
    ],
    answerWhy: "The array order is Sheep, Duck, Sheep, and each picks its own overridden Sound().",
  },
  {
    section: "B. Read and predict",
    title: "Trace the robo-duck",
    concept: "Trace composition",
    context: "A composed object delegates. Follow the delegation to the final string.",
    code: `public class Engine
{
    public string Start() => "vroom";
}

public class RoboDuck
{
    private readonly Engine _engine = new Engine();   // has-a Engine
    public string WakeUp() => "Quack-" + _engine.Start();
}

Console.WriteLine(new RoboDuck().WakeUp());`,
    explain:
      "RoboDuck has-a Engine. WakeUp() builds its own prefix 'Quack-' and then asks the engine to Start(), which returns 'vroom'. Concatenated, that is one string.",
    points: [
      "RoboDuck holds an Engine and delegates to it.",
      "Read the concatenation order: prefix first, then the engine's result.",
    ],
    mermaid: "flowchart LR\n  RoboDuck -->|has-a| Engine\n  RoboDuck --> Out[\"Quack-\" + \"vroom\"]",
    question: "What does WakeUp() print?",
    options: [
      { text: "Quack-vroom", correct: true },
      { text: "vroom-Quack", correct: false },
      { text: "Quack", correct: false },
    ],
    answerWhy: "RoboDuck has-a Engine and delegates: 'Quack-' then the engine's 'vroom'.",
  },
  {
    section: "B. Read and predict",
    title: "Spot the difference",
    concept: "is-a vs has-a, side by side",
    context: "Same behaviour, two designs. One inherits, one composes. Which is which?",
    code: `// Version A
public class Bird { public void Fly() => Console.WriteLine("flap"); }
public class Parrot : Bird { }

// Version B
public class Wings { public void Fly() => Console.WriteLine("flap"); }
public class Parrot2
{
    private readonly Wings _wings = new Wings();
    public void Fly() => _wings.Fly();
}`,
    explain:
      "Version A makes Parrot a kind of Bird (is-a, inheritance). Version B gives Parrot2 a Wings field it delegates to (has-a, composition). Both let a parrot fly; they differ in how the ability is obtained.",
    points: [
      "Version A: `Parrot : Bird` is inheritance (is-a).",
      "Version B: a Wings field is composition (has-a).",
    ],
    mermaid:
      "flowchart LR\n  subgraph A [\"Version A: is-a\"]\n    Bird --> Parrot\n  end\n  subgraph B [\"Version B: has-a\"]\n    Parrot2 --> Wings\n  end",
    question: "Which version uses composition?",
    options: [
      { text: "Version B - Parrot2 has-a Wings", correct: true },
      { text: "Version A - Parrot : Bird", correct: false },
      { text: "Both use composition", correct: false },
    ],
    answerWhy: "Version A inherits (is-a); Version B holds a Wings field and delegates (has-a) - that is composition.",
  },

  // ---------------------------------------------------------------- Section C
  {
    section: "C. When and why",
    title: "The is-a lie",
    concept: "When inheritance hurts",
    context: "Inheritance is a promise of full substitutability. Break the promise and the compiler still says yes.",
    code: `public class Bird
{
    public void Fly() => Console.WriteLine("up we go!");
}

// "A penguin is a bird, so Penguin : Bird." Careful...
public class Penguin : Bird { }

var pingu = new Penguin();
pingu.Fly();   // compiles happily. Pingu launches off the iceberg.`,
    explain:
      "A penguin is a bird in biology, but in code `Penguin : Bird` promises a Penguin can do everything a Bird can - including Fly(). It cannot. The hierarchy lets you call behaviour the type should never have. The model lies, and nothing stops you.",
    points: [
      "Inheritance promises the child is fully usable as the parent.",
      "Penguin inherits Fly() but cannot honour it - a broken promise.",
    ],
    mermaid: "flowchart LR\n  Bird --> Penguin\n  Penguin -->|inherits Fly\\(\\)| Oops[\"but cannot fly\"]",
    question: "Why is Penguin : Bird a design trap?",
    options: [
      { text: "Penguin inherits Fly() but cannot fly - the is-a promise is a lie", correct: true },
      { text: "Penguins are not animals at all", correct: false },
      { text: "Fly() is private so it should not compile", correct: false },
    ],
    answerWhy: "Inheritance promises a Penguin is a fully substitutable Bird. It is not - it inherits behaviour it cannot honour. (You will meet this again as the Liskov rule.)",
  },
  {
    section: "C. When and why",
    title: "The fragile base class",
    concept: "When inheritance hurts",
    context: "Change one parent, surprise every descendant - even the ones it never fit.",
    code: `public class Animal
{
    // Monday: someone "improves" the base class.
    public virtual void Move() => Console.WriteLine("walks");
}

public class Cat     : Animal { }   // fine: walks
public class Fish    : Animal { }   // ...also "walks". On land. Uh oh.
public class RoboCat : Cat    { }   // inherits the surprise too`,
    explain:
      "Inheritance couples children to a parent's implementation. The moment Animal.Move() decides everyone 'walks', Fish walks on land and RoboCat inherits it through Cat. One edit rippled to types the author never looked at. The deeper the tree, the worse it gets.",
    points: [
      "A base-class change ripples to all descendants.",
      "Some descendants (Fish) never fit the new behaviour.",
    ],
    mermaid:
      "flowchart TB\n  Animal[\"Animal.Move() changed\"] --> Cat\n  Animal --> Fish\n  Cat --> RoboCat\n  Fish --> Bad[\"walks on land?!\"]",
    question: "One edit to Animal.Move() affected how many classes?",
    options: [
      { text: "Every class below it - Cat, Fish and RoboCat", correct: true },
      { text: "Only Animal itself", correct: false },
      { text: "None - subclasses are isolated", correct: false },
    ],
    answerWhy: "A change to a base class reaches every descendant, including ones it never fits (Fish). That is the fragile base class problem.",
  },
  {
    section: "C. When and why",
    title: "The diamond problem",
    concept: "The core reason composition wins",
    context: "This is the heart of it: why C# flatly refuses to let a class have two parents.",
    code: `public class Animal { public string Greet() => "hi from Animal"; }

public class Swimmer : Animal { public new string Greet() => "hi from Swimmer"; }
public class Flyer   : Animal { public new string Greet() => "hi from Flyer"; }

// public class Duck : Swimmer, Flyer   // <-- C# REFUSES this line.
// duck.Greet();  // Swimmer's Greet or Flyer's Greet? Nobody can say.`,
    explain:
      "Picture Duck inheriting from both Swimmer and Flyer, which both descend from Animal. The inheritance graph forms a diamond. Now Duck.Greet() is ambiguous: two parents offer it, and the compiler cannot choose. To avoid this whole class of bug, C# forbids inheriting from more than one class. That single restriction is the strongest practical argument for composition.",
    points: [
      "Two parents bringing the same member = ambiguity.",
      "C# bans multiple class inheritance to dodge the diamond.",
    ],
    mermaid:
      "flowchart TB\n  Animal --> Swimmer\n  Animal --> Flyer\n  Swimmer --> Duck\n  Flyer --> Duck\n  Duck --> Q[\"Greet\\(\\) = ???\"]",
    question: "Why does C# forbid `class Duck : Swimmer, Flyer`?",
    options: [
      { text: "Both parents define Greet() - the call would be ambiguous (the diamond problem)", correct: true },
      { text: "Because ducks cannot both swim and fly", correct: false },
      { text: "Because there are simply too many classes", correct: false },
    ],
    answerWhy: "With two parents bringing the same member, the compiler cannot pick which to inherit - the diamond. C# bans multiple class inheritance to avoid it.",
  },
  {
    section: "C. When and why",
    title: "Composition dissolves the diamond",
    concept: "Why we favour composition",
    context: "The duck still wants to swim and fly. Composition gives it both, with zero ambiguity.",
    code: `// Behaviours as small parts you can mix freely:
public class Swimming { public string Go() => "swim"; }
public class Flying   { public string Go() => "fly"; }

public class Duck
{
    private readonly Swimming _swim = new Swimming();   // has-a
    private readonly Flying   _fly  = new Flying();     // has-a
    public string Swim() => _swim.Go();
    public string Fly()  => _fly.Go();
}`,
    explain:
      "No parents, no diamond. Duck holds a Swimming and a Flying and names each one when it delegates. There is never a question of 'which Go() wins' because you call _swim.Go() or _fly.Go() explicitly. Want a third ability? Add a third field. This is exactly why the advice is 'favour composition over inheritance'.",
    points: [
      "Duck has-a Swimming and has-a Flying - both, unambiguously.",
      "Mix as many behaviours as you like; inheritance allows only one parent.",
    ],
    mermaid:
      "flowchart LR\n  Duck -->|has-a| Swimming\n  Duck -->|has-a| Flying",
    question: "How does composition give Duck both abilities without the diamond?",
    options: [
      { text: "Duck has-a Swimming and has-a Flying - each named, so no ambiguous parents", correct: true },
      { text: "Duck inherits from both Swimming and Flying", correct: false },
      { text: "It cannot - you still need multiple inheritance", correct: false },
    ],
    answerWhy: "Holding two behaviour objects has no ambiguity: each is named and called explicitly. Mix as many as you like. That is why we favour composition over inheritance.",
  },
  {
    section: "C. When and why",
    title: "You already shipped this",
    concept: "Tie-back to the capstone",
    context: "The SOLID capstone you finished was composition plus polymorphism the whole time.",
    code: `public interface IReporter { void Send(string msg); }
public class ConsoleReporter : IReporter { public void Send(string m) => Console.WriteLine(m); }
public class SilentReporter  : IReporter { public void Send(string m) { } }

public class TestRunner
{
    private readonly IReporter _reporter;             // HAS-A, injected
    public TestRunner(IReporter reporter) => _reporter = reporter;
    // _reporter.Send(...) runs ConsoleReporter OR SilentReporter - same call.
}`,
    explain:
      "TestRunner has-a IReporter (composition, handed in through the constructor). Any class that implements IReporter slots in, and the same _reporter.Send(...) call behaves differently for each (polymorphism). No inheritance of TestRunner was needed. Keeper rule: can you honestly say A is-a B - always, everywhere, forever? If not, or if you need to mix behaviours, compose instead.",
    points: [
      "TestRunner has-a IReporter (composition + injection).",
      "One Send() call, many behaviours (polymorphism).",
    ],
    mermaid:
      "flowchart LR\n  TestRunner -->|has-a| IReporter\n  IReporter --> ConsoleReporter\n  IReporter --> SilentReporter",
    question: "TestRunner works with any IReporter. Which ideas made that possible?",
    options: [
      { text: "Composition (has-a, injected) plus polymorphism (one call, many behaviours)", correct: true },
      { text: "Deep inheritance of TestRunner from each reporter", correct: false },
      { text: "Nothing reusable - it only worked by luck", correct: false },
    ],
    answerWhy: "TestRunner has-a IReporter (composition) and any implementation slots in (polymorphism). You already shipped this - now you can name it.",
  },
];

let lessonIndex = 0;
const selectedAnswer = new Map();

const l4Meta = document.getElementById("l4Meta");
const l4Title = document.getElementById("l4Title");
const l4Context = document.getElementById("l4Context");
const l4Concept = document.getElementById("l4Concept");
const l4Progress = document.getElementById("l4Progress");
const l4Code = document.getElementById("l4Code");
const l4Explain = document.getElementById("l4Explain");
const l4Points = document.getElementById("l4Points");
const l4Diagram = document.getElementById("l4Diagram");
const l4Question = document.getElementById("l4Question");
const l4Options = document.getElementById("l4Options");
const l4Feedback = document.getElementById("l4Feedback");
const l4Prev = document.getElementById("l4Prev");
const l4Next = document.getElementById("l4Next");
const courseXpLabel = document.getElementById("courseXpLabel");

const COURSE_XP_KEY = "course_global_xp";
const LEVEL4_AWARDED_KEY = "level4_awarded";
const awarded = JSON.parse(localStorage.getItem(LEVEL4_AWARDED_KEY) || "{}");

function loadCourseXP() {
  return parseInt(localStorage.getItem(COURSE_XP_KEY) || "0", 10);
}

function addCourseXP(amount) {
  localStorage.setItem(COURSE_XP_KEY, String(loadCourseXP() + amount));
  renderCourseXP();
}

function renderCourseXP() {
  if (courseXpLabel) courseXpLabel.textContent = `Course XP: ${loadCourseXP()}`;
}

function markAwarded(idx) {
  awarded[idx] = true;
  localStorage.setItem(LEVEL4_AWARDED_KEY, JSON.stringify(awarded));
}

if (window.mermaid) {
  window.mermaid.initialize({ startOnLoad: false, theme: "neutral", securityLevel: "loose" });
}

async function renderDiagram(lesson) {
  l4Diagram.innerHTML = "";
  if (window.mermaid && lesson.mermaid) {
    try {
      const { svg } = await window.mermaid.render(`l4-${lessonIndex}-${Date.now()}`, lesson.mermaid);
      l4Diagram.innerHTML = `<div class="mermaid">${svg}</div>`;
      return;
    } catch (_err) {
      // fall through to text fallback
    }
  }
  const fallback = document.createElement("p");
  fallback.className = "context";
  fallback.textContent = "Diagram fallback: please refresh if Mermaid did not load.";
  l4Diagram.appendChild(fallback);
}

function setFeedback(text, isGood) {
  l4Feedback.textContent = text;
  l4Feedback.style.color = isGood ? "var(--good)" : "var(--warn)";
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function renderOptions(lesson) {
  l4Options.innerHTML = "";
  l4Feedback.textContent = "";

  shuffle(lesson.options).forEach((option, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn";
    btn.textContent = `${String.fromCharCode(65 + idx)}) ${option.text}`;
    btn.addEventListener("click", () => {
      selectedAnswer.set(lessonIndex, option.text);
      if (option.correct) {
        setFeedback(`Correct. ${lesson.answerWhy}`, true);
        if (!awarded[lessonIndex]) {
          addCourseXP(10);
          markAwarded(lessonIndex);
        }
      } else {
        setFeedback(`Not quite. ${lesson.answerWhy}`, false);
      }
    });
    l4Options.appendChild(btn);
  });
}

function renderLesson() {
  const lesson = lessons[lessonIndex];
  const remaining = lessons.length - (lessonIndex + 1);

  renderCourseXP();

  l4Meta.textContent = `${lesson.section} · ${remaining} card${remaining === 1 ? "" : "s"} remaining`;
  l4Title.textContent = lesson.title;
  l4Context.textContent = lesson.context;
  l4Concept.textContent = lesson.concept;
  l4Progress.textContent = `Card ${lessonIndex + 1} / ${lessons.length}`;

  l4Code.textContent = lesson.code;
  if (window.Prism) Prism.highlightElement(l4Code);

  l4Explain.textContent = lesson.explain;
  l4Question.textContent = `Choose 1: ${lesson.question}`;

  l4Points.innerHTML = "";
  lesson.points.forEach((point) => {
    const li = document.createElement("li");
    li.textContent = point;
    l4Points.appendChild(li);
  });

  renderOptions(lesson);
  void renderDiagram(lesson);

  l4Prev.disabled = lessonIndex === 0;
  l4Next.disabled = lessonIndex === lessons.length - 1;
}

l4Prev.addEventListener("click", () => {
  lessonIndex -= 1;
  renderLesson();
});

l4Next.addEventListener("click", () => {
  lessonIndex += 1;
  renderLesson();
});

renderLesson();
