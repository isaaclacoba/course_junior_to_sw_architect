# Work Log

# Work Log

- Start: 2026-07-28 10:24:50 | Task: Author a new BUILD lesson "Abstract types and overriding" (type-system.js/.html, prefix ts, awardedKey type_system_awarded, awardAmount 25) for Unit 2 "Everyday essentials", after Type conversion and before "Know the language". Formalise the type-system mechanics (abstract base + override, virtual/override, method overloading, custom ToString, deterministic cleanup with IDisposable/using) in a language-agnostic way. 5 build tasks + recap, each a small themed class + Main + hidden verify probe, requireSource technique gate, culture-safe output. Copy type-conversion conventions. Do not edit index.html / concept-ledger.md / page-shell.js; do not commit or push.
- End: 2026-07-28 10:36:46 | Result: Created type-system.js (BUILD_CONFIG, prefix ts, metaLabel "Everyday essentials \u00b7 Abstract types and overriding", progressNoun Step, xpKey course_global_xp, awardedKey type_system_awarded, awardAmount 25, runnerUrl level3-app/index.html?runner=1) with 5 build tasks + recap. T1 abstract class Animal + abstract Speak, Cat override -> Meow (gate: abstract class + abstract string Speak + override; probe Dog:Animal -> Woof). T2 Pet virtual Sound default "quiet", Parrot override -> Squawk (gate: virtual + override; probe plain Pet -> quiet, proving base stays instantiable with a default). T3 Counter overloading Add(int)/Add(int,int), Main Add(2,3) -> 5 (gate: both signatures same name; probe Add(4) -> 4). T4 Cat override ToString -> "Cat: "+name, Console.WriteLine(cat) -> Cat: Whiskers (gate: override string ToString + "Cat: "; probe new Cat("Tom") -> Cat: Tom, catches hardcoding). T5 Cage : IDisposable printing "open" in ctor + "closed" in Dispose, Main using-block -> [open, closed] (gate: :IDisposable + using(; probe two using blocks -> [open,closed,open,closed]). Examples on different subjects (Shape/Circle, Greeter/Robot, Printer, Point, Door). Culture-safe: only strings/ints/bools printed. Recap card excluded from count. Created type-system.html (archetype build, eyebrow "Part two \u00b7 Everyday essentials", prefix ts, load order code-lab.global.js -> page-shell.js -> type-system.js -> build-engine.js, no Prism). Verified: node --check clean; real dotnet 8 harness replicating the engine grading -> ALL_TASKS_PASS: all 5 solutions compile warning-free with output == expected (Meow/Squawk/5/Cat: Whiskers/[open,closed]), all 5 requireSource sets match their solution, all 5 rebuilt verify probes compile and match verify.expected (Woof/quiet/4/Cat: Tom/[open,closed,open,closed]), all 5 starters compile but do NOT pass. Headless google-chrome render of http://localhost:8091/type-system.html: "Step 1 / 5", title "Abstract types and overriding", first task "A type you cannot make", id="tsEditor" present, undefined=0. Temp artifacts removed. index.html / concept-ledger.md / page-shell.js untouched. Not committed, not pushed.

- Start: 2026-07-27 16:19:45 | Task: Convert lesson "The SOLID Principles" (level2.js/level2.html) from the fill-in-the-blank drill engine (10 drills + Mermaid) to a Monaco write-and-run BUILD lesson (build-engine.js). Five build tasks S/O/L/I/D (recap excluded), each describes the trap in prose then asks the learner to write the fix; each has a requireSource technique gate and a hidden verify probe. Drop Mermaid; keep prefix l2 / awardedKey level2_awarded / awardAmount 25.
- End: 2026-07-27 16:27:21 | Result: Rewrote level2.js as window.BUILD_CONFIG (prefix l2, metaLabel "Design for change - The SOLID principles", progressNoun Build, awardedKey level2_awarded, xpKey course_global_xp, awardAmount 25, runnerUrl level3-app/index.html?runner=1). Five build tasks over a shared test-automation subject: S split LoginTest.RunAndReport into LoginTest.Run + ReportFormatter.Format (gate: ReportFormatter class + Format(bool) + bool Run() + no RunAndReport; probe Format(false)->FAIL). O convert ReportFormatter.Build if-chain into IReport + PlainReport/EmojiReport (gate: interface + both impls + no style==/switch; probe EmojiReport.Build(true)->OK). L stop SkippedTest:Test throwing; IRunnable with LoginTest/SkippedTest returning Pass/Skipped (gate: interface + both implement IRunnable + no throw + no ": Test"; probe [Pass,Skipped]; starter throws at runtime). I split fat ITestPlugin into IRunnable+IReportable, ReportPlugin implements only IReportable (gate: both interfaces + ReportPlugin:IReportable + no ITestPlugin + no NotImplementedException; probe defines SummaryPlugin:IReportable->summary ready). D inject IReporter into TestRunner instead of newing ConsoleReporter (gate: IReporter + ConsoleReporter:IReporter + TestRunner(IReporter + no field "= new ConsoleReporter();"; probe FakeReporter records->test passed). Recap card excluded from count. Dropped all Mermaid; rewrote level2.html to build archetype (load order code-lab.global.js -> page-shell.js -> level2.js -> build-engine.js, no Prism/Mermaid). Verified: node --check clean; dotnet 8 compiled all 5 solutions warning-free with output matching expected, all requireSource regexes match each solution, all 5 verify probes pass, all 5 starters compile but are blocked (requireSource/probe; L starter throws) so none pre-passes. Headless render: "Build 1 / 5", first title "S - Single Responsibility: split the jobs", id="l2Editor" present, undefined=0, mermaid=0. Temp artifacts removed. index.html and docs/concept-ledger.md left for the orchestrator (data-total 10 -> 5; ledger row 24 wording). Not committed, not pushed.

- Start: 2026-07-09 10:50:18 | Task: Add a bridge build lesson "Refactor moves" between Part five (testing / testable-design) and Part six (SOLID). Audit found a complexity cliff: testable-design tasks are one tiny class with one method, then SOLID reasons about several collaborating classes and five principles at once. New build-engine lesson: 5 behaviour-preserving refactor drills, each one "move" that later becomes a SOLID habit (extract a method, depend on an interface, inject a dependency, replace a type-branch with polymorphism, split a fat class). Output stays constant; requireSource enforces the new shape; verify probes prove the refactor is real. Wire a Steady card at the top of Part six before SOLID.
- End: 2026-07-09 11:00:28 | Result: Created refactor-moves.js (BUILD_CONFIG, prefix rm, awardedKey refactor_moves_awarded, awardAmount 25) with 5 tasks + recap. T1 "Give the rule a name" (extract method) - inline status rule -> static bool IsSuccess; gate forces the method + that Main calls it; expected PASS. T2 "Depend on the shape, not the thing" (program to interface) - Suite typed to concrete ConsoleReporter -> IReporter; gates interface + implements + constructor param; verify hands a SilentReporter -> QUIET. T3 "Hand it in, don't build it in" (inject) - Greeter news its own SystemClock -> constructor IClock; gate on ctor param; verify hands AfternoonClock(15) -> afternoon (catches a still-hardwired clock). T4 "Let each object answer for itself" (branch -> polymorphism) - Zoo.Speak(kind) if-chain -> IAnimal/Cat/Dog; gates interface + both classes + negative lookaheads forbidding `kind ==` and `switch` + Main calling .Speak(); expected [Meow, Woof]. T5 "One class, one job" (split fat class) - TestRunner check+format -> Checker + Reporter wired in Main; gates both classes+methods; verify Check(1,9) -> FAIL. Each example uses a DIFFERENT subject (InRange / IShape+Box / Order / IShape+Box+Ball / Parser+Formatter). Recap maps the 5 moves to the SOLID bridge. Created refactor-moves.html (archetype build, eyebrow "Part six", Monaco via code-lab, no Prism). index.html: new Steady card at the top of Part six before level2 (data-total 5). Verified: node --check clean; a vm harness replicated the engine grading + dotnet compiled every solution (PASS/PASS/morning/Meow+Woof/PASS), every starter (working before-code that FAILS its gates), and every verify probe (QUIET/afternoon/FAIL) with 0 warnings - all gates pass on solutions, fail on starters, probes catch un-refactored starters. Headless render: refactor-moves.html shows "Refactor moves" / "Build 1 / 5" / "Give the rule a name" / "Extract a method", no undefined; index shows the new card. Temp server + project removed. Not pushed.
- Start: 2026-07-09 11:04:00 | Task: Review feedback - drill 1 taught a free-floating `static` method (wrong practice to sow before SOLID), was a copy of the shown example, and was actually SIMPLER than testable-design (which already had constructor injection). Replace it with a real OO refactor and confirm the arc sows only good practices.
- End: 2026-07-09 11:08:35 | Result: Replaced T1 with "Move the behaviour onto the data" (Encapsulate Field + Move Method): starter has a Cage with public fields and a loose `static bool IsFull(Cage)` in Program; solution gives Cage a `Cage(int animals, int capacity)` ctor, private readonly fields, and an instance `bool IsFull()`. Gates: instance `bool IsFull()` (no args), `Cage(int` ctor, negative-lookahead forbidding `static bool IsFull` and `public int Animals;`/`Capacity;` fields. Added a verify probe new Cage(2,5) -> ROOM (starter's field-init Cage has no matching ctor, so it fails the probe). Example is a different subject (Jar/_cookies/IsEmpty), so it is not copyable. Now no drill uses a free static function; the lesson sows encapsulation -> SRP -> DIP(abstract) -> DIP(inject) -> OCP, all good practices SOLID names. Updated recap item 1, hero intro ("put behaviour next to the data it uses"), and index blurb ("move behaviour to its data"). Re-verified: node --check clean; dotnet compiled all 5 solutions (FULL/PASS/morning/Meow+Woof/PASS), all 5 starters (working before-code, all FAIL their gates), and all 4 verify probes (ROOM/QUIET/afternoon/FAIL) with 0 warnings. Headless render shows the new T1 title/concept, no stale IsSuccess/Extract-a-method/undefined. Temp artifacts removed. Not pushed.
- Start: 2026-07-09 11:30:00 | Task: Reviewer flagged the prose was not following AGENTS.md. Re-read AGENTS.md and rewrite the user-facing prose of refactor-moves to the course voice.
- End: 2026-07-09 11:36:16 | Result: Audited against AGENTS.md and fixed: (1) Hero intro was a jargon topic-list (forbidden) opening with hype ("the skill that keeps a codebase alive") and a tricolon ("read code, write it, and test it"). Rewrote it to the prescribed intro shape - wrong-instinct question ("When code already works, why go back and change it?") -> humble cost (the next person, often you a month later, must understand it first) -> plain preview (that reshaping is called refactoring) -> goal (five small programs, output unchanged). (2) All five drill `context`s ended with the same template "Same X on the screen. But now Y" - an AI tell; rewrote each with varied structure and a concrete consequence, no formula. (3) Cut meta-commentary ("which is what an object is for", "which is where the next part, the SOLID principles, begins"). (4) Hedged/removed absolutes: starter comment "hardwires its own clock - impossible to substitute" -> "builds its own clock, so a test cannot swap it". (5) Recap summaryIntro/summaryClose reworded off the "make deliberate"/"these are the moves" phrasing. Code unchanged except the one drill-3 starter comment. Re-verified: node --check clean; dotnet recompiled all 5 solutions (FULL/PASS/morning/Meow+Woof/PASS), all 5 starters compile and still fail their gates, all 4 verify probes pass (ROOM/QUIET/afternoon/FAIL), 0 warnings. Headless render confirms the new intro + context render, the "Same ... on the screen" template is gone, no undefined. Temp artifacts removed. Not pushed.
- Start: 2026-07-09 11:40:00 | Task: User (rightly, angrily) flagged that the drill contexts never say WHAT the lesson is, WHAT it teaches, or WHY - they dive straight into the specific example (Cage) with no concept named. Rewrite every context to the proven course pattern used in test-doubles.
- End: 2026-07-09 11:44:04 | Result: Rewrote all 5 contexts to the test-doubles shape: plain problem in the concrete scenario -> **concept named and defined in one line (bold)** -> two before/after contrast bullets -> the unchanged output. T1 now opens "A Cage keeps two numbers ... in public fields" then defines **Encapsulation**; T2 defines **Programming to an interface**; T3 defines **Injecting a dependency**; T4 defines **Polymorphism**; T5 defines **Single responsibility**. Aligned concept badges to the formal terms (Encapsulation / Program to an interface / Inject the dependency / Polymorphism / Single responsibility). No code (starter/solution/gates/verify) changed - only concept + context prose - so the prior compile/gate/verify verification still holds. node --check clean; headless render shows the concept name, its definition, and the Scattered/Together bullets, no undefined. Not pushed.
- Start: 2026-07-09 12:00:00 | Task: Iterate refactor-moves prose and exercises on live user feedback - text too long/exercise-focused, then reshape drills 4 and 5 the way this session taught us.
- End: 2026-07-09 13:23:00 | Result: (Prose) Trimmed every context to three short beats: general problem -> **concept** (bold) + one-line why -> a single "Here:" line naming the problem in THIS exercise's starting code (not the finished state). Dropped the before/after bullets and "output stays X" filler; trimmed the hero. Fixed word choice per user (drill 2: "names the exact type" -> "works directly with one exact type"; "Here" now says Suite USES ConsoleReporter so it is hard to extend/test). (Drill 4 rework) The old solution deleted `Zoo` entirely - threw away the polymorphism payoff. Now `Zoo` is kept and refactored to hold a `List<IAnimal>` with `Add(IAnimal)` + a `SpeakAll()` loop; starter is a `List<string>` + if/else SpeakAll. Gates force `List<IAnimal>` and `Add(IAnimal)` (not string) and forbid kind==/switch; new verify probe adds a `Bird`->`Tweet` to prove `Zoo` takes an unseen animal with no change to `Zoo`. (Drill 5 rework, same lesson) Old solution deleted `TestRunner` and wired Checker+Reporter in Main. Now `TestRunner` is kept as a thin coordinator that delegates to a `Checker` (decides) and a `Reporter` (formats); Main is byte-identical starter->solution. Gates require both classes + that TestRunner calls .Check()/.Report() + keep TestRunner; verify RunAndReport(1,9)->FAIL proves the delegation chain. Verified: node --check clean; dotnet compiled all 5 solutions (FULL/PASS/morning/Meow+Woof/PASS), all 5 starters compile and fail their gates, all 5 verify probes pass (ROOM/QUIET/afternoon/Tweet/FAIL), 0 warnings. Temp artifacts removed. Not pushed.
- Start: 2026-07-09 13:30:00 | Task: Keep the animal flavour in the exercises, tighten drill 5 to good practice, and do a final review before publishing.
- End: 2026-07-09 14:52:30 | Result: (Animal theme) Re-themed the three dry drills: drill 2 Suite/ConsoleReporter -> `Vet`/`Dog`/`IPet` (Visit/Checkup, verify Parrot->COUGH); drill 3 Greeter/SystemClock -> chicken `Coop`/`SunClock` (Door open/shut, verify NightClock->shut); drill 5 TestRunner/Checker/Reporter -> `PetShow`/`Judge`/`Announcer` (Run, GOOD DOG/BAD DOG, verify Run(1,9)->BAD DOG). Drills 1 (Cage) and 4 (Zoo) were already animal. (Drill 5 injection fix) PetShow newed its own Judge/Announcer as fields - contradicted the injection drill; changed to constructor injection (`PetShow(Judge, Announcer)`), Main wires them, gate requires the ctor. Updated the Calc example to inject too. (Justification) Added a line so injecting concrete Judge/Announcer is not read as contradicting "program to an interface": interfaces earn their place when you need to swap a part out, and here you do not yet. (Review fix) Drill 1 "Here:" stated the task, not the problem like the others; changed to "a loose method in Program reaches into Cage's public fields to decide if it is full". Confirmed html/index wiring: card data-total=5 (recap excluded), data-key=refactor_moves_awarded matches awardedKey, prefix rm, correct load order, no Prism. Final verification: node --check clean; dotnet compiled all 5 solutions and all 5 starters (starters are working before-code that fail their gates), all 5 verify probes pass, 0 warnings; headless render shows Refactor moves / Build 1 / 5 / Encapsulation, no undefined. Committed and pushed.
- Start: 2026-07-08 08:07:56 | Task: Lambdas build lesson follow-up (phase 5) - the previous exercises were still a 1:1 transcription of the shown example (write the exact 2-line lambda that the pattern already shows). Make the learner ASSEMBLE genuine small code - a lambda PLUS actually using it over a small array with a foreach - so the answer is not a copy of the example, while staying easy.
- End: 2026-07-08 08:09:30 | Result: Rewrote the 4 tasks in lambdas.js. Each `example` now shows the shape on a DIFFERENT subject/data (square on 2&3; count nums>10; count prices<=limit; add tax), so copying it does not produce the answer. T1 "Store it once, call it twice" - reuse via two calls (addLeg, expected 4 then 5; gates var, =>, +1). T2 "Run a rule over a list" - store isFourLegged (==4) then foreach+if+counter over legs, expected 2 (gates var, ==4, for(each)). T3 "A rule that reads a local" - capture: enough reads local minLegs, count >=minLegs over legs, expected 3 (gates var, /=>[^;\n]*minLegs/, for(each)). T4 "Configure a step, then run it" - reward captures local bonus, foreach prints each rewarded score, expected 15 then 30 (gates var, /=>[^;\n]*bonus/, for(each)). Loop gate /\bfor(each)?\s*\(/ accepts for and foreach; foreach var differs from the array name. Recap reworded (store&reuse / rule over a list / capture / configure) with a LINQ bridge close (Count/Select do that foreach for you). Header comment updated. Verified: node --check clean; all 4 solutions pass their gates and the empty starters are blocked; dotnet built+ran all 4 solutions with 0 warnings/0 errors -> 4/5, 2, 3, 15/30. index.html data-total stays 4 (unchanged). Temp artifacts removed. Not pushed.

- Start: 2026-07-07 22:05:00 | Task: Lambdas build lesson follow-up - make the exercises force colleagues to write slightly more real code while staying equally easy. Starters had handed over the full lambda skeleton (learner edited one body token).
- End: 2026-07-07 22:09:27 | Result: lambdas.js: each of the 4 tasks now ships an EMPTY Main body with a TODO; the learner writes the whole lambda declaration AND the Console.WriteLine call themselves (worked example still shows the shape on a different subject). Added a `/var\s+\w+\s*=/` requireSource gate to every task so the empty starter is blocked and storing-in-a-variable is enforced (kept the `=>`, `+ 1`, `== 4`, `wanted`, `bonus` gates). Goals reworded to "Store a lambda ... / Print the result of calling ...". Header comment notes the empty-Main intent. Verified: node --check clean; all 4 solutions pass their gates and the empty starters are blocked; dotnet built+ran the 4 solutions with 0 warnings/errors -> 5 / True / True / 15. Temp artifacts removed. Not pushed.

- Start: 2026-07-07 21:34:35 | Task: Improve lambdas.js lesson to motivate WHY you store callable objects, for colleagues who don't know callback/hook and find command/dispatcher too complex. Keep the 5 syntax drills, reframe the intro + Array.Find drill as the first callback, add 3 runnable drills (store a step / run later; a callback; a hook that passes data), rewrite the recap. Update hero intro and index card total 5 -> 8.
- End: 2026-07-07 21:38:34 | Result: lambdas.js: reworded file header; drill 1 ("A function with no name") context + 3rd point now frame storing a lambda as holding a callable to pass on; "Hand a lambda to a method" (Array.Find) reframed as the first callback (you say the rule, the method runs it). Added 3 runnable drills before the recap: "Store a step now, run it later" (`() =>` no-input lambda, stored line prints nothing, blank = feedCat call), "A callback - the method calls your step" (introduces `Action`, WhenReady calls callMeBack(), blank = callMeBack), "A hook - slot your step into a process" (introduces `Action<string>`, Adopt hands petName to onAdopted, blank = petName). No command/dispatcher jargon; callback/hook taught in plain words. Appended runnablePrograms[5..7] index-aligned. Recap rewritten (store-now-run-later / callback / hook items, why-store-a-callable close). lambdas.html hero intro poses "why store a function at all?". index.html lambdas card data-total 5 -> 8 and blurb updated. Verified: node --check clean; dotnet compiled+ran programs 5/6/7 - 0 warnings/0 errors each, outputs match the explain text (Not fed yet/Fed the cat; Groomer.../You: on my way; Paperwork for Rex done/Rex goes to a new home); headless render shows "Drill 1 / 8", first card renders, no undefined. Temp artifacts removed. Not pushed.

- Start: 2026-07-07 21:45:00 | Task: Follow-up - colleagues ask "why a lambda if we can call a normal/static function?" and asked to drop fill-in-the-blank for coding exercises. Convert the lambdas lesson from drill-engine to build-engine (write-from-scratch), and make it answer the method-vs-lambda question honestly (a named method is a callable too; capture is the real dividing line).
- End: 2026-07-07 21:48:12 | Result: Rewrote lambdas.js as a BUILD_CONFIG IIFE (prefix lam, awardedKey lambdas_awarded, awardAmount 20) with 4 write-from-scratch tasks + recap. T1 "A method is already a callable" - learner writes static `Zoo.IsFourLegged` and passes it BY NAME to `Array.Find` (requireSource gates the method + the by-name pass; hidden verify re-runs with {6,3,4,2}->4). T2 "The same step, written inline" - same search as an inline lambda (gates Array.Find + `=>`). T3 "A lambda reads the locals beside it" - capture: lambda reads local `wanted` (gate `/=>[^;\n]*wanted/`); prose states a static method can't see your locals - the answer to the colleagues' question. T4 "Build a step from a runtime value" - store `reward = score => score + bonus` capturing local `bonus` (gate `/=>[^;\n]*bonus/`, expected 15). Each task has an `example` on a DIFFERENT subject (numbers/prices/tax). Recap "Lambda or method?" states the decision rule (method when it deserves a name/reuse/test; lambda when small+inline or needs capture). lambdas.html: archetype drill->build, dropped Prism (3 script tags + 2 css links), swapped drill-engine.js->build-engine.js, hero intro now leads with the why-lambda-vs-method question. index.html: lambdas card data-total 8->4, pill gentle->steady, 15->20 min, blurb rewritten. Verified: node --check clean; all 4 requireSource gates pass on their solutions; dotnet built+ran all 4 solutions (4/4/4/15) and T1 verify probe (4) with 0 warnings/0 errors; all 4 starters compile; headless render shows "Build 1 / 4", first task + editor, no undefined, no Prism. Temp artifacts removed. Not pushed.
- Start: 2026-07-07 21:13:06 | Task: Audit and fix poor identifier names (single-letter locals/params) in the C# code strings of testing-basics.js, test-doubles.js, testable-design.js, level2.js, level1-coding.js. No public class/interface/method/property renames, no generic-param renames; keep loop counter i; keep starter/solution names paired; keep output and requireSource gates unchanged.
- End: 2026-07-07 21:15:26 | Result: testing-basics.js: example `int n` -> `int count`; Adder `Add(int a, int b)` -> `Add(int left, int right)` (both tasks, starter+solution). test-doubles.js: SpyLog example `Write(string m)` -> `Write(string message)`. testable-design.js: Mix example `Blend(int a, int b)` -> `Blend(int left, int right)`. level2.js: `Send(string msg)`/`msg` -> `message` in both Dependency Inversion drills (snippets + highlights). level1-coding.js: Double `int x`/`x * 2` -> `int value`/`value * 2` (snippet+answer+explains+runnable); reference-assignment `a`/`b` -> `user`/`sameUser` (snippet+answer+explains+runnable). Kept idiomatic abbreviations qty/repo/to. No requireSource regex referenced any renamed local. node --check clean on all five. Not pushed.
- Start: 2026-07-07 21:10:01 | Task: Audit and fix poor identifier names (single-letter locals/params) in the C# code strings of level1.js, control-flow.js, reading-objects.js, level4.js. No public/blank-answer/generic-param renames; keep loop counter i; keep runnable output unchanged.
- End: 2026-07-07 21:10:40 | Result: level1.js (no C# code) and control-flow.js (vars clear; n/i prose-and-loop-bound) needed no change. reading-objects.js: h -> hour (Greet, snippet+highlight+runnable), r -> rectangle (Rectangle usage, snippet+runnable). level4.js: foreach a -> animal (Predict-the-pen, code+runCode; polymorphism card kept `a` since prose references it), Send(string m) -> Send(string message) (You-already-shipped card, code+runCode). node --check clean on all four. Not pushed.

- Start: 2026-07-07 21:09:39 | Task: Audit and fix poor identifier names (single-letter locals, method/lambda/constructor params) in the C# code strings of encapsulation.js, interfaces.js, polymorphism.js, composition.js, dependency-injection.js. No class/interface/method/property renames; keep private field names; keep output and requireSource gates working.
- End: 2026-07-07 21:16:17 | Result: Renamed locals/params only. encapsulation: c->cat (tasks 1-2), a/b/c cats->firstCat/secondCat/thirdCat (task 5), example Add(int n)->Add(int amount). interfaces: Greet(Cat c)->cat, IAnimal a->animal, Greet(IAnimal a)->animal, example Introduce(Guest g)->guest, Announce(IShape s)->shape; updated task-2 requireSource /c\.Speak/ -> /cat\.Speak/ plus its goal/context prose. polymorphism: IAnimal a/b->cat/dog, foreach a->animal, adopt result a->animal, example foreach n->number, Pick(string k)->kind. composition: d->dog, p->parrot, c->creature, Boost(string s)->Boost(string text). dependency-injection: example Player(IInstrument i)->instrument (field _i kept). No class/interface/method/property renamed; private fields (_dog/_animal/_legs/_used/_treats/_food/_word/_i etc.) untouched; outputs and all requireSource/verify gates preserved. Verified: node --check clean on all five. Not pushed.

- Start: 2026-07-07 14:36:22 | Task: Reformat the narration (`narr`) strings in theory-5/6/7/8.viz.js into short paragraphs with `\n`, one bold key concept per step, and backticked identifiers/values. Only narr text changed; all other step fields and step order untouched.
- End: 2026-07-07 14:37:11 | Result: Rewrote every `narr` in theory-5.viz.js (6 steps), theory-6.viz.js (5), theory-7.viz.js (4), theory-8.viz.js (5). Bold concepts: bit/bit/binary/bit/binary/byte (5); encoding/text/image/sound/encoding (6); files/folders/operating system/devices (7); machine code/(bridge)/programming language/translates/languages (8). Verified: node --check clean on all four. Not pushed.

- Start: 2026-07-07 14:35:16 | Task: Reformat the narration (`narr`) strings in theory-13/14/15.viz.js into short paragraphs with `\n`, one bold key concept per step, and backticked identifiers (matching the already-done theory-16). Other step fields untouched.
- End: 2026-07-07 14:37:00 | Result: Rewrote every `narr` in theory-13.viz.js (6 steps), theory-14.viz.js (6), theory-15.viz.js (steps 1-11; recap step 12 already bulleted, left as-is). Only narr text changed - pc/stack/heap/highlight/instr/etc. and step count/order preserved. Bold concepts used: function/reuse/frame/local/popped/many functions (13); bug/syntax error/logic error/debugging/found the bug (14); RAM/volatile/address/regions/code/globals/stack/heap/frame/automatically/garbage collector (15). Verified: node --check clean on all three. Not pushed.

- Start: 2026-07-07 14:36:07 | Task: Reformat the narration (`narr`) strings in theory-17/18/19/20/21.viz.js into short paragraphs with `\n`, one bold key concept per step, and backticked identifiers. Other step fields untouched.
- End: 2026-07-07 14:38:00 | Result: Rewrote only the `narr` of every step in theory-17.viz.js (5), theory-18.viz.js (5), theory-19.viz.js (5), theory-20.viz.js (4), theory-21.viz.js (5). Split each into short paragraphs with `\n`, bolded one key concept per step (compiler/build error/build/runtime; RAM/temporary/storage/file/database; network/client+server/request/response/API; version control/commit/history/work together; library/standard library/package/package manager/one thing) and backticked identifiers (`score`, `name`, `Json.Parse`, `.NET`, `NuGet`). No other fields touched; step count/order preserved. Verified: node --check clean on all five. Not pushed.

- Start: 2026-07-07 10:34:28 | Task: Convert theory lessons 10 and 16 from drill-engine to the CodeLab.MemoryViz widget.
- End: 2026-07-07 10:36:00 | Result: Created theory-10.viz.js (stack-only, no board, chip "RAM" / "each slot has a type", 5 steps: every value has a type - age=30 int, name="Rex" string, ready=true bool -> the type decides allowed operations -> common types int/double/string/bool -> the type travels with the variable -> the type stays fixed for the slot's life, so the compiler catches misuse early) and theory-16.viz.js (stack+heap, no board, chip "RAM" / "values in slots, objects on the heap", 5 steps: a simple value sits in its slot count=5 no heap -> a reference-type Dog lives on the heap and pet holds a note/arrow to it, decided by TYPE not size -> a reference is a "where to find it" address -> copy a value gives a separate independent copy a=5/b=9 -> copy a reference and both x and y arrow to the one Dog). Rewired theory-10.html and theory-16.html: removed archetype:"drill" from window.PAGE, dropped theory-N.js and drill-engine.js, added theory-N.viz.js before page-shell.js (page-shell last). theory-16.html also lost the mermaid <script> and its hero intro was reworded to invite stepping through memory. theory-10.js and theory-16.js left on disk untouched. Verified: node --check clean on both viz files; grep confirms no mermaid/archetype/drill-engine/theory-N.js references remain in either HTML. Not pushed.

- Start: 2026-07-07 10:34:08 | Task: Convert theory lessons 8 and 17 from drill-engine to the CodeLab.MemoryViz widget.
- End: 2026-07-07 10:35:04 | Result: Created theory-8.viz.js (board+code, chip "SoC", 5 steps: CPU speaks only numeric instructions -> hand-writing them is painful -> a language is human-friendly rules -> one high-level line becomes many machine ops -> many languages, one machine) and theory-17.viz.js (board+code, chip "RAM", 5 steps: code is plain text -> compiler translates -> build error on a broken rule -> successful build loads into RAM -> runtime runs it). Rewired theory-8.html and theory-17.html: removed archetype:"drill" from window.PAGE, dropped theory-N.js and drill-engine.js, added theory-N.viz.js before page-shell.js (page-shell last), and reworded each hero intro to invite stepping through the visual. theory-8.js and theory-17.js left on disk untouched. Verified: node --check clean on both viz files. Not pushed.

- Start: 2026-06-26 13:30:00 | Task: Build the whole of theory track Part 2 "From idea to running code" (7 lessons), conceptual bridge from Part 1 to writing programs. Approved syllabus: languages, variables, types, statements/expressions, decisions/repetition, functions, bugs. Also reworded the LINQ intro (removed "loop-free way to query" jargon).
- End: 2026-06-26 14:06:17 | Result: Built theory-8..14 (.js + .html, drill-engine theory mode, prefixes th8..th14, awardedKeys theory_8..14_awarded, 20 XP/topic, 5 quiz+prose-fill cards + recap each). L1 What a programming language is (why a language, rules, high-level, many languages, syntax). L2 Variables (named box, why names, can change, read/write, one at a time). L3 Types (every value has a type, decides what you can do, common types, one per box, catches mistakes early). L4 Statements and expressions (statement, expression, they fit together, assignment, top-to-bottom). L5 Decisions and repetition (decision, condition true/false, if/else, loop, all built from Part 1 jumps -> practical Control Flow). L6 Functions (bundle of steps, reuse, arguments, return value, programs are many functions incl. Main -> practical Methods). L7 Bugs (a bug is a mistake in literal instructions, syntax vs logic errors, debugging, bugs are normal; closes Part 2, hands off to the practical track). Recap chaining threads each lesson to the next and back to Part 1. index.html theory track gained a "Theory Part two - From idea to running code" stage + 7 Gentle cards (data-total 5 each) after Part 1. Also reworded linq.html intro to concrete ("ready-made tools to ask a question about a list ... in one short line instead of a foreach"). Verified: node --check clean on all 7; headless render of theory-8/11/14 shows Topic 1 / 5, the cloze slot, prose-mode, no undefined; index lists theory-1..14 in order. Theory track now has 14 lessons across 2 parts. Not pushed.

- Start: 2026-06-26 10:15:00 | Task: Audit the course (theory + practical tracks) and decide next steps. Decision: finish the practical "Know the language" part (Exceptions+nullable, then Generics), keep theory=concept / practical=hands-on, build lesson-by-lesson.
- End: 2026-06-26 10:37:32 | Result: Built the two remaining "Know the language" lessons. "Errors and null" (errors-null.js/html, runnable fill-blank drills on drill-engine, prefix en, errors_null_awarded, 20 XP, animal-themed): 7 drills + recap - try/catch, the exception Message (catch (Exception e)), finally, throw, null + == null, ?? fallback, ?. safe access. Every runnable program runs to completion (exceptions caught); the three null drills use string? to stay warning-free (CS8600). "Generics" (generics.js/html, write-from-scratch builds on build-engine, prefix gen, generics_awarded, 25 XP): 4 builds - define Box<T> (constructor, warning-free), a generic method First<T>, Pair<A,B> (two type params), and Wrap<T> returning Box<T>. Each has a requireSource gate (class Box<T> / First<T>( / Pair<A,B> / Wrap<T>() ) and a hidden verify probe that re-runs with a different type (string), so an int-hardcoded answer fails. index.html practical Part three now reads Collections -> Data shapes -> LINQ -> Errors and null -> Generics. Verified: node --check clean on both; all 7 errors-null programs compile and run to completion warning-free; all 4 generics solutions + 4 verify probes compile warning-free with exact expected output, all requireSource gates pass; headless render shows errors-null Drill 1 / 7 and generics Build 1 / 4 (Monaco mounted), no undefined. Practical "Know the language" is now complete (5 lessons). Not pushed.

- Start: 2026-06-24 21:20:00 | Task: Finish Part 1 of the theory track - build Lessons 5, 6 and 7 (data representation + the OS's bigger job), completing the planned 7-lesson Part 1. User will review and give feedback.
- End: 2026-06-24 21:39:22 | Result: Added three lessons (drill-engine theory mode, quiz + prose fill-blank, gentle voice). Lesson 5 "How computers store everything as numbers" (theory-5, prefix th5, theory_5_awarded, 5 topics): everything is numbers; a bit (on/off, two values); why two states (reliable); counting in binary (each bit doubles values); a byte is eight bits. Lesson 6 "Text, images, and sound as numbers" (theory-6, th6, theory_6_awarded, 5 topics): encoding (agreed code); text -> numbers (Unicode); images -> pixels + red/green/blue; sound -> wave measured over time; same numbers mean different things under different encodings. Lesson 7 "The operating system's bigger job" (theory-7, th7, theory_7_awarded, 5 topics): files (named bundles of bytes); folders + path; the OS guards files (permissions); talking to devices; drivers - recap closes Part one and points to Part two (from idea to running code). Recap chaining: L4->L5 (binary), L5->L6 (encoding), L6->L7 (OS), L7->Part two. index.html theory track gained all three cards (Gentle, 20 min each) after Lesson 4. Verified: node --check clean on all three; headless render of each shows Topic 1 / 5, the cloze slot, prose-mode, no undefined; index lists theory-1..7 in order (7 links). Theory track Part 1 is now complete at 7 lessons. Not pushed.

- Start: 2026-06-24 21:10:00 | Task: Build theory track Lesson 4 "Running many programs at once" - resolve the everyday puzzle (one core, one instruction at a time, yet many apps run together). Cover processes, time-sharing, the scheduler, multiple cores, and process isolation. Same gentle audience/format as Lessons 1-3.
- End: 2026-06-24 21:15:51 | Result: Added theory-4.js + theory-4.html (prefix th4, awardedKey theory_4_awarded, 20 XP/topic, drill-engine theory mode). Six quiz + prose fill-blank cards + recap: a running program is a process (vs the file on disk; Task Manager tie-in); one core does one thing at a time (the puzzle); the OS switches between them fast (time-sharing, a tiny slice of time each); the scheduler decides who runs next; more cores, some real at-once (quad-core tie-in, but still more processes than cores); each process keeps its own memory (isolation - why one crash stays contained). Recap teases Lesson 5 (how computers store everything as numbers - bits/bytes/binary). index.html theory track gained a "Running many programs at once" card (Gentle, 20 min, data-key theory_4_awarded, data-total 6) after Lesson 3. Verified: node --check clean; headless render shows card 1, Topic 1 / 6, the cloze slot, no undefined; index links theory-4.html once. Theory track now has 4 lessons. Not pushed.

- Start: 2026-06-24 21:00:00 | Task: Build theory track Lesson 3 "What starts a program" - the operating system, the loader, the entry point, and that the entry point is usually Main (quietly demystifying the practical track's static void Main). Same gentle audience/format as Lessons 1-2.
- End: 2026-06-24 21:08:28 | Result: Added theory-3.js + theory-3.html (prefix th3, awardedKey theory_3_awarded, 20 XP/topic, drill-engine theory mode). Five quiz + prose fill-blank cards + recap: something has to start it (the operating system); the loader brings it into memory (callback to Lesson 2); execution begins at the entry point; the entry point is usually called `Main` (payoff - connects to the practical track's Main); it runs, then it ends (OS frees the memory). Recap teases Lesson 4 (running several programs at once - processes and the scheduler). index.html theory track gained a "What starts a program" card (Gentle, 20 min, data-key theory_3_awarded, data-total 5) after Lesson 2. Verified: node --check clean; headless render shows card 1 "Something has to start it", Topic 1 / 5, the cloze slot, no undefined; index links theory-3.html once. The theory track now has 3 lessons forming a clean arc: a program is instructions -> how the CPU works through them -> what starts them and where they begin. Not pushed.

- Start: 2026-06-24 20:45:00 | Task: Build theory track Lesson 2 "How a program runs" (gentle, same audience/format as Lesson 1), continuing from "a program is an ordered list of instructions" into how it actually runs - setting up later lessons on the loader and entry point. Also a quick UX fix to the theory cloze blank.
- End: 2026-06-24 20:58:20 | Result: Added theory-2.js + theory-2.html (prefix th2, awardedKey theory_2_awarded, 20 XP/topic, drill-engine theory mode). Five quiz + prose fill-blank cards plus a recap: loaded into memory first (reintroduces RAM with a purpose, vs storage); the run loop (fetch-and-execute, executing = carrying out); it keeps its place (in order by default); some instructions change the order (jumps - seeds decisions/loops, a bridge to the practical Control Flow); data lives in memory too (seeds variables). Recap teases Lesson 3 (the loader + entry point). index.html theory track gained a "How a program runs" card (Gentle, 20 min, data-key theory_2_awarded, data-total 5) after Lesson 1, under the existing Theory Part one stage. Plain practical-track voice throughout. Verified: node --check clean; headless render shows card 1 "Loaded into memory first", Topic 1 / 5, quiz options, the superscript+slot cloze, prose-mode, no undefined; index links theory-2.html and the new title once. Not pushed. (Earlier this session also fixed the cloze blank: number now a small superscript before a clean underline slot, not on the line.)

- Start: 2026-06-24 20:28:00 | Task: Recalibrate theory Lesson 1 for the real audience - people who use computers daily but have no programming/OS background. Hardware vs software is too basic for them; teach what they actually lack: what an instruction is, that a program is an ordered set of instructions, and what compilation is. Also fix the theory fill-blank slot, which rendered the blank number as a bare digit (looked like the word "one").
- End: 2026-06-24 20:36:37 | Result: (1) Fixed the cloze slot in drill-engine.js: a {{n}} now renders as an empty underlined slot with the number as a small superscript (<span class="cloze"><sup class="cloze-n">n</sup></span>) instead of a bare digit; updated .cloze/.cloze-n CSS. (2) Reworked theory-1.js: dropped the "Software vs hardware", RAM and Storage cards; new 6-card arc - a computer just follows instructions (literal, never guesses); what a single instruction is (one tiny exact step; apps are millions of them); a program is an ordered list (order matters); instructions work on data; the CPU runs the instructions; your code gets translated (compilation/compiler) - plus a recap. Retitled the lesson "What a program is" across theory-1.html (title, hero, intro) and the index card + blurb; metaLabel -> "Foundations - Programs and instructions". data-total stays 6. Verified: node --check clean; headless render shows new card 1 "A computer just follows instructions", no "Software vs hardware", Topic 1 / 6, the underlined cloze slot, no undefined. Not pushed.

- Start: 2026-06-24 19:45:00 | Task: Expand the course with a parallel theory track. Operational: split index.html into a two-track selector (Practical / Theory) with animated switching and a remembered choice. Design: theory = foundations from zero for today's junior (no software/OS/CS background); start with Part 1, Lesson 1. Reuse the existing drill-engine for quiz + fill-the-blank, rethought for prose instead of code. Global XP, current CSS.
- End: 2026-06-24 20:24:56 | Result: (1) Extended the shared drill-engine.js with an opt-in theory mode (DRILL_CONFIG.mode === "theory"): renders the snippet as prose via a new renderProse (escape, backtick->inline code, each {{n}} -> a numbered .cloze slot), sets the input placeholder and the fill-section heading ("Fill in the blanks") and a prose success line, and drops the language-* class on the code element so Prism's auto-highlight does not re-tokenise the prose. Added .prose-mode + .cloze styling to styles.css. (2) Built theory-1.js + theory-1.html (Part 1 Lesson 1 "What a computer is", prefix th1, awardedKey theory_1_awarded, 20 XP/topic): 6 quiz+fill cards (program = instructions; software vs hardware; instructions + data; CPU; RAM is temporary; storage is permanent) + a recap, all foundational, plain voice. (3) Refactored index.html into a two-track selector: a #trackChooser with two .c-track-card buttons, a #trackActive header block holding a segmented #trackSwitch (Practical/Theory) plus the track-scoped progress bar/XP/CTA, and #trackPractical / #trackTheory path wrappers. The inline script now scopes progress to the active track's .c-card set, persists the choice in localStorage (course_track), restores it on load, and animates the path in (trackIn keyframes, honoring prefers-reduced-motion). Practical path content unchanged; theory path seeded with Theory Part one + the Lesson 1 card. Verified: node --check clean (drill-engine, theory-1); headless render of theory-1 shows the prose with a surviving .cloze slot and NO Prism token spans, quiz options, blank input, "Fill in the blanks", "Topic 1 / 6", no undefined; index defaults to the chooser (trackActive hidden); seeding course_track=theory shows the theory path (0 / 1 lessons, CTA -> theory-1.html), hides the practical path, marks the theory switch active. Temp _tracktest.html harness removed. Not pushed.

- Start: 2026-06-24 19:50:00 | Task: Study the project architecture (code-lab module + unit tests, drill-engine, build-engine, page-shell, index/deploy) and write an instructions file so future agents know how to work in this repo and reuse what exists.
- End: 2026-06-24 20:10:07 | Result: Read the full architecture - drill-engine.js (DRILL_CONFIG schema: drills/blanks/quiz/summary, runnablePrograms, XP/awarded keys, the explain overlay and code-highlight logic), build-engine.js (BUILD_CONFIG: tasks with expected/requireSource/verify, the buildProbe that replaces from `class Program`), page-shell.js (drill/build card scaffolds, prefix+suffix ids), the existing .github/instructions/code-editor.instructions.md, .github/workflows/deploy.yml (submodule publish with ExerciseSource -> level3-app -> Pages), and code-lab/ (src core/dom/editors/runners/tour, package.json scripts: typecheck/test via tsx/build via tsup). Wrote .github/copilot-instructions.md (185 lines, repo-wide auto-loaded guide): project overview, golden rules (reuse-first, Monaco/runner only, work-log, no emojis, verify+cleanup, voice consistency), architecture map, step-by-step "how to add a lesson" for both the drill (quiz+fill) and build (write-from-scratch) archetypes incl. exact script load order and the index card snippet, the verification recipe (node --check, vm-extract + dotnet compile, headless render), code-lab module commands, build/deploy, local serve, gotchas (CS8618 default strings, snippet-need-not-compile, Monaco sized host, warm-up disabled Run, theme-data-vs-voice), and the two-track course orientation. Complements the existing scoped editor rules without duplicating them.

- Start: 2026-06-23 12:05:00 | Task: Build the next "Know the language" lesson, "LINQ", in the same quiz + fill-the-gaps theory format as Control Flow (multiple-choice check, then fill the blank; pure theory, no compiler Run). Beginner level, animal theme; the learner already knows lambdas, so blanks focus on which operator to reach for.
- End: 2026-06-23 12:22:07 | Result: Added "LINQ" as a quiz+fill theory lesson on the shared drill-engine (prefix lq, awardedKey linq_awarded, 20 XP/topic). linq.js holds 7 operator cards + a recap, each querying a List<Animal> (Name, Legs): Where (filter), Count (tally - explicit callback to the Collections manual loop), Any (bool), All (bool), Select (project, two blanks: operator + .Name), FirstOrDefault (safe vs First-throws), OrderBy (sort). Each card is a knowledge check (3 options, answerWhy) then a fill-blank whose answer is the operator name. linq.html is the thin drill shell (PAGE eyebrow "Part three - Know the language", prefix lq, Prism + code-lab + page-shell + linq.js + drill-engine.js). index.html gained a LINQ card (Gentle, 20 min, data-key linq_awarded, data-total 7) in Part three right after Data shapes. Verified: node --check clean; path order confirmed (Part three = Collections, Data shapes, LINQ); headless Chrome render shows card 1 "Filter with Where" with the quiz question, the .options block, the fill-blank input, progress "Topic 1 / 7", no undefined. Pure theory so no programs to compile. Not yet pushed.

- Start: 2026-06-22 17:55:00 | Task: Build the next "Know the language" lesson, "Data shapes", in the programming/build style of First Builds and Wiring It Up (write-from-scratch, run, match output). Cover the everyday ways C# packages data: properties, a computed property, enum, struct (value copy) and record (value equality). Keep the funny animal theme.
- End: 2026-06-22 18:22:35 | Result: Added "Data shapes" as 5 write-from-scratch builds on the shared build-engine (prefix ds, awardedKey data_shapes_awarded, 25 XP/build). data-shapes.js (data-only window.BUILD_CONFIG): (1) add a `Name { get; set; }` property to Cat -> Mittens; (2) computed read-only `HumanYears => Age * 7` -> 21; (3) `enum Mood { Sleepy, Hungry, Playful }` + Say() -> feed me; (4) `struct Treats` proving value-copy (change the copy, original stays 3); (5) `record Animal(string Name, int Legs)` proving value equality -> True. Each card has a worked example, a requireSource technique gate (get;set; / HumanYears / enum Mood / struct Treats / record Animal so a class cannot pass struct/record tasks), and the first three carry a hidden verify probe (Tom / 35 / zzz) that rejects hardcoded answers. data-shapes.html is the thin build shell (PAGE eyebrow "Part three - Know the language", prefix ds, code-lab bundle + page-shell + build-engine; Monaco editor). index.html gained a Data shapes card (Steady, 30 min, data-key data_shapes_awarded, data-total 5) in Part three right after Collections. Verified: node --check clean; all 5 solutions compile and print the exact expected output via dotnet 8; all 3 hidden verify probes (built exactly as build-engine's buildProbe does, replacing from `class Program`) print their expected values; all 5 requireSource regexes match their solutions (8/8 program checks pass); headless Chrome render shows "Build 1 / 5" with the Monaco editor mounted, Run button, no undefined. Temp artifacts removed.

- Start: 2026-06-22 15:20:00 | Task: Re-theme the Collections lesson examples from the test-automation domain to light, funny animal examples. Reuse everything - the shared drill-engine, the collections.html shell, the index card and the lesson structure stay untouched; only the example content changes.
- End: 2026-06-22 15:37:37 | Result: Rewrote only the data arrays in collections.js (engine, HTML shell and index wiring reused as-is). New animal examples, same 7 concepts: (1) sneak llama/raccoon into a party + Count, (2) roll call of pets Rex/Whiskers/Bubbles with foreach, (3) penguin queue Pingu/Skipper/Waddles - index 0 and Count-1, (4) List<Cat> with Name + KnockedSomethingOver (Mittens guilty: True / Smudge: False), (5) Dictionary legs spider=8/chicken=2 lookup, (6) ContainsKey("snake") -> "no legs!", (7) tally good boys -> "3 treats for 4 dogs". Updated context/points/blanks/explains/runnablePrograms and the recap intro to match; header comment notes the animal theme. Verified: node --check clean; all 7 runnable programs compile and print the exact expected output via dotnet 8 (warning-free); headless Chrome render shows drill 1 "Make a list" with the llama content, 2 blank inputs, Run button, no undefined. Temp artifacts removed.

- Start: 2026-06-22 12:49:00 | Task: Start a new "Part three - Know the language" track to cover the everyday C# features the course was missing (collections, exceptions, generics, nullable, LINQ, enum, struct, records, properties). Decision: new part at the end after the Capstone, mix format per topic, keep the test-automation theme, start with one prototype lesson.
- End: 2026-06-22 15:08:14 | Result: Built the first lesson, "Collections", as runnable fill-in-the-blank drills on the shared drill-engine. collections.js holds 7 runnable drills + a recap (prefix col, awardedKey collections_awarded, 20 XP/drill): (1) make a List<string> + Add + Count, (2) walk a list with foreach, (3) index into a list incl. Count-1 last item, (4) a List of your own CheckResult objects, (5) Dictionary<string,int> lookup by key, (6) ContainsKey safe lookup, (7) manual count-what-matches tally (sets up the future LINQ win). Each drill has an index-aligned complete runnablePrograms entry. collections.html is a thin drill shell (PAGE eyebrow "Part three - Know the language", prefix col, code-lab bundle + page-shell + drill-engine). index.html gained a "Part three - Know the language" stage head and a Collections card (Steady, 25 min, data-key collections_awarded, data-total 7) after the Capstone. Verified: node --check clean; all 7 runnable programs compile and print the exact expected output via dotnet 8 (2 / login..logout / open..submit / login: True..logout: False / 120 / missing / 3 / 4), warning-free after defaulting CheckResult.Name = ""; headless Chrome render of collections.html shows drill 1 "Make a list" with 2 blank inputs, the labelled blank, progress noun "Drill", Run button, no undefined. Temp artifacts removed.

- Start: 2026-06-22 12:47:22 | Task: Summarize the whole course content so far to understand what the course covers, as input for designing next chapters.
- End: 2026-06-22 12:48:01 | Result: Inventoried all 10 lessons (Foundations, Practice the Basics, Control Flow, Methods, Reading Objects, The SOLID Principles, Reuse Without Regret, First Builds, Wiring It Up, Capstone) - ~90 cards/drills/milestones across the path. Wrote docs/course-overview.md: course identity, ordered path table (page/format/cards/XP/concept per lesson), concept-coverage breakdown (language fundamentals, OO core, design principles), pedagogical patterns, a "not yet covered" list to seed next chapters (collections, exceptions, generics, nullability, LINQ, enums/structs/records, properties, static, async, writing tests, IO), and a file map.

- Start: 2026-06-21 17:38:00 | Task: Two queued items. (1) Control Flow card 4 (the `for` loop) and card 3 (`while`) use `++`/`--` in the blanks but never introduce those operators. (2) Adapt "Wiring It Up" to match the Control Flow theme: pure programming exercises, slightly more complex than the theory drills, covering the same control-flow tools.
- End: 2026-06-21 17:48:08 | Result: Control Flow - introduced the increment/decrement operators where they first appear: the `while` card now explains `n--` (shorthand for `n = n - 1`, with its twin `n++`) in its context and points, and the `for` card explains `i++` (shorthand for `i = i + 1`, with `i--`). Wiring It Up - rewrote all six builds to practise the Control Flow tools as small working methods (a step up from filling one blank): (1) `if`/`else if`/`else` to band an error count, (2) boolean logic `&&`/`||`/`!` for an access decision, (3) a `while` countdown with `n--`, (4) a `for` loop using the index and `.Length` to number items, (5) `foreach` with `continue`/`break` to skip and stop, (6) a `switch` mapped over every item with a `foreach`. Each card keeps the build-engine shape: worked example, requireSource technique gate, and a hidden verify probe (different inputs) so a hardcoded answer is rejected. Updated the page hero and the index.html card blurb to describe the new control-flow focus. Verified: node --check clean on control-flow.js and wiring-it-up.js; a dotnet harness compiled and ran all six solutions and all six hidden verify probes - 12/12 produced the exact expected output; headless render shows card 1 ("Branch with if / else") with inline `<code>if</code>`/`<code>else if</code>` and the worked example. The Roslyn/WASM runner and grading engine are unchanged from the already-deployed build lessons.

- Start: 2026-06-21 16:53:00 | Task: Two readability/teaching fixes. (1) Wiring It Up: starters still hand the learner the accumulator variable (e.g. card 3 `int total = 0; ... return total;`); remove the given variable from every card so the learner introduces it. (2) Control Flow: format programming terms (if, else, &&, ||, !, while, for, foreach, break, continue, switch) as inline code so the prose is easier to read.
- End: 2026-06-21 16:58:37 | Result: Wiring It Up - cleared the given accumulator and return line from cards 3 (Sum), 4 (Slowest) and 5 (Percent) starters, leaving an empty method body with a guiding TODO (cards 1, 2 and 6 already had none). The worked example above each card still shows the pattern, and Show Solution still reveals a full working answer. Control Flow - added a renderInline helper to the shared drill-engine.js (escapes HTML, turns `backtick` spans into inline <code>) and applied it to context, pain/map, goal points, the quiz question and feedback, and the recap summary intro/items/close; lessons without backticks are unchanged. Wrapped the programming terms in backticks throughout control-flow.js, and broadened the inline-code CSS (.context/.coach-list/.quiz-feedback/.summary-list code). Verified: node --check clean on wiring-it-up.js, drill-engine.js, control-flow.js; headless render shows Control Flow context and question with inline <code>if</code>/<code>else</code>.

- Start: 2026-06-21 16:37:19 | Task: Add a new theory lesson "Control Flow" after Practice the Basics and before Methods/Reading Objects, covering if/else, comparison and boolean logic, while, for, foreach, break/continue, and switch. Combine the fill-in-the-blank way of working with the quiz way: each topic shows a multiple-choice knowledge check first, then a fill-the-blank for the same idea. Pure theory (no compiler Run). Reuse the shared drill archetype by extending drill-engine.js with an optional per-card quiz instead of writing a new engine.
- End: 2026-06-21 16:43:39 | Result: Extended the shared drill archetype rather than building a new engine. page-shell.js drillCard now includes a #<prefix>Quiz block (question + .options buttons + .quiz-feedback) above the code. drill-engine.js gained an optional drill.quiz { question, options[{text,correct}], answerWhy }: it renders the choices, gives immediate Correct/Not-quite feedback on click, tracks the pick in a parallel quizState, hides the block on cards without a quiz, resets on Reset, and (in check) requires the correct option in addition to all blanks before awarding XP - with a result line nudging the learner to the knowledge check when blanks pass but the quiz is unanswered. Added .quiz-box / .quiz-feedback styles. New data file control-flow.js (window.DRILL_CONFIG, prefix "cf", awardedKey control_flow_awarded, 20 XP/card) holds 7 combined quiz+fill cards (if/else, boolean logic, while, for, foreach, break/continue, switch) plus a recap summary card. New thin shell control-flow.html (archetype drill, prefix cf, Prism + code-lab + page-shell + control-flow.js + drill-engine.js). index.html gained a Control Flow card (Gentle, 20 min, data-total 7) between Practice the Basics and Methods so course progress/XP tracks it. Verified: node --check clean on control-flow.js / drill-engine.js / page-shell.js; headless render shows the quiz (question + 3 options) above the blanked code with inputs and Check; a self-driving headless interaction confirmed blanks-correct-but-quiz-unanswered is blocked (no award, nudge shown), the correct option shows Correct feedback, and answering then checking awards exactly 20 XP once; all 7 filled snippets compile with dotnet (Build succeeded, no warnings).

- Start: 2026-06-21 16:16:00 | Task: Make the build lesson "Your code" editor grow and shrink to fit its content instead of a fixed height, and stop card 2 of Wiring It Up handing the learner the accumulator variable.
- End: 2026-06-21 16:35:00 | Result: Added an optional autoHeight mount option to the shared code-lab MonacoEditor (src/types.ts + src/editors/monaco.ts: drive host height from the editor's content height via onDidContentSizeChange, clamped to min/max), rebuilt and re-vendored the bundle. build-engine.js mounts with autoHeight { minHeight: 160, maxHeight: 640 }; styles.css .code-editor-host switched from a fixed 24rem to min-height 10rem so content drives the size. Simplified wiring-it-up.js card 2 starter to an empty method body with a plain TODO (removed the int passed = 0; / return passed; giveaway, since the counter pattern is already shown in the example above). Verified headless: the editor host takes a content-driven inline height (e.g. 380px); node --check clean.

- Start: 2026-06-21 16:10:00 | Task: Two presentation fixes for the Wiring It Up lesson so it teaches by showing instead of asking the student to copy code by hand: (1) render the lesson context text with proper code formatting (inline code, not running prose); (2) every card should SHOW a worked "here is how a loop looks" example, and the starter must not embed the loop pattern as a copy-this comment.
- End: 2026-06-21 16:16:42 | Result: Added a shared, optional Example block to the build card (page-shell.js: #<prefix>ExampleWrap + a <pre class="code-example"><code> host, hidden when a task has no example). build-engine.js now renders task.context through a renderInline helper that escapes HTML and turns `backtick` spans into inline <code>, and populates/show-hides the example block from task.example. Added .context code and .code-example / .example-box styles to styles.css. Rewrote all 6 Wiring It Up tasks: each context now references identifiers with backticks and points at the pattern below; each card carries an example snippet that demonstrates the loop shape with different data (colors, evens, prices, max, hits/Length, item.Name/Active); every starter dropped its "// foreach (...)" copy-this hint, leaving just the method skeleton and a plain TODO. Solutions and hidden verify probes are unchanged. Verified: node --check clean on all three files; every task has an example and no starter loop hint; headless Chrome render confirms context shows inline <code>foreach</code>, the example block is visible with the worked snippet, and the wrapper unhides correctly.

- Start: 2026-06-21 16:00:00 | Task: Simplify the "Wiring It Up" lesson so it teaches loops instead of assuming prior knowledge. The previous six tasks pulled in interfaces, polymorphism and multi-collaborator wiring - too much, too soon, since loops have not been covered in detail. Rebuild every card to teach foreach over collections one step at a time, each program small like First Builds (30 lines tops), with simpler tasks. Keep the hidden verify probes so hardcoded answers are still rejected.
- End: 2026-06-21 16:03:40 | Result: Rewrote wiring-it-up.js as six teaching cards, all foreach-over-collections, each program 27-30 lines modeled on First Builds: (1) Visit each item - print each name; (2) Count the passes - count true results; (3) Add up the total - running sum; (4) Keep the largest - track max; (5) Turn a count into a rate - percent from count and results.Length; (6) One line per check - Check{Name,Passed}[] printing "Name: PASS/FAIL". Each context paragraph explains the loop pattern in plain words, each starter shows the foreach shape as a comment hint plus a TODO. requireSource gate simplified to ITERATES = /foreach|\bfor\b|\bwhile\b/ (plus Length/Name checks where relevant); hidden verify probes retained on every card. Updated the wiring-it-up.html hero intro to describe the loops-teaching focus (dropped the interfaces/pipeline wording). Verified with dotnet 8: all 6 solutions print their visible expected output, all 6 hidden probes pass with different inputs, and a loop-plus-`return 2;` cheat prints 2 where the probe expects 3 (rejected); card 6 builds warning-free after defaulting Name. node --check clean; longest solution 30 lines.

- Start: 2026-06-21 15:45:00 | Task: Close the build-grading hole - a solution that prints the right answer still passes even when the value is hardcoded (e.g. a loop is present but the method does `return 2;`). Output-matching a fixed program cannot tell correct logic from a hardcoded constant.
- End: 2026-06-21 15:52:49 | Result: Added an optional hidden `verify` probe to the build task schema. build-engine.js now, after the visible output matches and requireSource passes, re-runs the learner's own classes against a different entry point with different inputs (buildProbe replaces the trailing Program/Main with task.verify.main) and checks task.verify.expected; a hardcoded answer that matches the visible case fails the hidden case and is rejected with a targeted message. Added verify blocks to all 6 Wiring It Up tasks (e.g. card 1 hidden case is three passes -> "3", so `return 2;` is caught). Verified with dotnet: all 6 reference solutions match their hidden expected outputs, and a loop-plus-`return 2;` cheat prints 2 where the probe expects 3 (rejected). node --check clean on build-engine.js and wiring-it-up.js.

- Start: 2026-06-21 15:05:00 | Task: Fix two defects reported after the code-lab dedup refactor: (1) the rich capstone-quality compile-error output regressed - build-engine.js and drill-engine.js were collapsing structured errors to a single join(friendly||raw) line, dropping the heading, the note, the per-error line/col and the raw text; (2) build grading only matches printed output, so a hardcoded answer (e.g. return 2) that prints the right thing passes without ever using a loop. Keep the fix in the shared code-lab component so every consumer benefits (no per-page reimplementation).
- End: 2026-06-21 15:35:17 | Result: Added a shared renderer to code-lab (committed 7f53a68, pushed): renderErrorPanel/showErrorPanel build the capstone-quality error list (heading "Let's fix this first", explanatory note, per-error Line N, col M badge + friendly + raw) with .cl-errors styles in code-lab.css; 6 DOM tests added (suite now 38/38), typecheck clean, bundle rebuilt and re-vendored, submodule bumped to 7f53a68. Wired both run surfaces onto it: page-shell.js now scaffolds a #<prefix>Errors host before Output in the drill and build cards; build-engine.js and drill-engine.js call CodeLab.showErrorPanel on compile errors (with a text fallback) and clear it on success/reset. Added optional requireSource grading to the build schema: build-engine.js checks each task.requireSource {pattern, message} against the submitted source after an output match, so a correct-but-hardcoded answer is rejected with a targeted message. Gated all 6 Wiring It Up tasks (loop/iteration and key API-call patterns). Verified end-to-end through the real WASM compiler (warm + run bad C# -> errs=1, line=2, raw "; expected", panel renders 1 item), plus a static harness (heading/note/loc/friendly/raw all correct, border-left 4px applied) and a full page boot (wuErrors host present, Monaco mounts, no JS errors). All 6 solutions still compile to expected output and satisfy their requireSource regexes; node --check clean on all engines.

- Start: 2026-06-21 14:30:10 | Task: Add a new bridge coding lesson between First Builds and the Capstone - 5 to 10 build exercises in the same reporter/test-runner domain as First Builds but a notch harder (loops, collections, polymorphism, multi-collaborator composition, a small pipeline). Reuse the existing build archetype (page-shell.js + build-engine.js); no new engine code.
- End: 2026-06-21 15:00:20 | Result: Added "Wiring It Up" (prefix wu, awardedKey wiring_it_up_awarded, +25 XP per task). wiring-it-up.js holds a data-only window.BUILD_CONFIG with 6 escalating tasks: (1) Count what passed - a CountPasses loop over bool[] -> "2"; (2) Run a list of checks - Suite.Summarize iterates ICheck[] -> "2 / 3 passed"; (3) Two collaborators - TestRunner composes ICheck+IReporter -> "PASS"; (4) One job each - CountPasses with the wiring pre-done -> "2/3"; (5) Report a pass rate - PassRateReporter percentage -> "50%"; (6) The whole pipeline - iterate named ICheck[] printing "name: status" -> ["login: PASS","logout: FAIL"]. wiring-it-up.html is a thin shell (PAGE hero + archetype build + prefix wu) loading the code-lab bundle, page-shell.js, the data file, then build-engine.js. Added an index.html card between First Builds and the Capstone (Steady pill, 40 min, data-total 6) so course progress/XP tracks it automatically. Verified all 6 solutions compile and print the expected output via dotnet 8 (six PASS); node --check clean; both pages serve 200; headless render shows hero, first task, Monaco editor host and Run button with no JS errors. Temp artifacts removed.

- Start: 2026-06-19 20:25:42 | Task: Kill the ~90% template duplication across the level pages. Two layers: (1) every page repeats the same hero shell and card scaffold; (2) the three fill-in-blank drill pages (level1-coding, level2, reading-objects) repeat near-identical markup behind prefixed IDs, and level1-coding.js / level2.js re-implement the shared drill-engine.js. Plan: add page-shell.js that renders the shared hero (all pages) plus the drill and build card scaffolds from a per-page window.PAGE config; collapse the drill trio onto drill-engine.js (move data to DRILL_CONFIG, extend the engine to render level2's recap, delete the bespoke controllers); move shared per-page <style> into styles.css. Lesson content stays untouched.
- End: 2026-06-19 20:39:50 | Result: Added page-shell.js (179 lines): renders the hero on every level page and the drill/build card scaffold from a small window.PAGE config, so each page is content-only. Extended drill-engine.js to render level2's recap (summary drill: Recap progress label, summaryIntro/summaryList/summaryClose, practice sections hidden) and to hide empty pain/map section wrappers, making one scaffold serve all three drill tracks. Converted level1-coding.js and level2.js from ~1240/1133-line bespoke controllers to data-only files that set window.DRILL_CONFIG (level2 keeps toRunnable to pre-build runnablePrograms; recap maps to null) and deleted their duplicated DOM logic. Rewrote all 7 level HTML files to the shell: drill trio (level1-coding/level2/reading-objects) + build pair (writing-methods/first-builds) declare archetype+prefix; the two singletons (level1/level4) keep their bespoke card but adopt the shared hero. Moved the build pages' per-page <style> (editor host height, expected-line, result-panel pass/fail) into styles.css as .code-editor-host etc. Renamed level2's Show button id l2Answers->engine's Show suffix via the generated scaffold. Verified headless: all 7 pages render hero+first content with zero JS errors; level2 recap renders (Recap, 5 items, practice hidden); level2 drill 1 Run compiles+runs through the WASM host -> PASS. All JS node --check clean; server 200 on every page. Temp harnesses (_verify.html, _runtest.html) removed; git status clean.

- Start: 2026-06-19 20:09:27 | Task: Unify the level/lesson pages with the index theme. The index uses a bright flat minimal look (solid background, flat white cards, teal accent), while the level pages share a warm gradient/glassy styles.css. Retheme the shared styles.css to match the index, unify hover/transitions, and standardize cosmetic wording (back-links, action buttons, nav buttons, hero eyebrows, Course XP label). Lesson content stays untouched.

- Start: 2026-06-19 19:45:00 | Task: The write-and-run lessons (Methods, First Builds) were using CodeLab.TextareaEditor, not the real Monaco editor that level3-app uses. Switch them to Monaco and add a project instruction file so the wrong editor is never used again.
- End: 2026-06-19 19:50:57 | Result: Added monaco-boot.js (shared Monaco CDN loader exposing window.monaco + client-side C# completions, mirroring level3-app's setup). Switched build-engine.js from CodeLab.TextareaEditor to CodeLab.MonacoEditor, awaiting window.ensureMonaco() before mount. Updated writing-methods.html and first-builds.html: dropped Prism, load the Monaco loader + monaco-boot.js before the code-lab bundle, gave the editor host an explicit height (Monaco needs a sized container). Added .github/instructions/code-editor.instructions.md making CodeLab.MonacoEditor the only approved editor and documenting the lesson wiring contract. Headless-verified both pages: monaco=yes, editable (readOnly=false), Run grades to Passed (Methods -> OK, First Builds -> hello). Temp harness removed.

- Start: 2026-06-19 19:00:00 | Task: Redesign the course landing page (index.html) so it reads and feels like a single guided course instead of two parallel level menus.
- End: 2026-06-19 19:05:24 | Result: Rebuilt index.html as one vertical path with a connecting spine, grouped into two tied stages (Part one "Understand the ideas", Part two "Build it for real"). Replaced build-jargon copy (micro-coding/drills/bridge/Level N) with warm learner-facing titles and blurbs: Foundations, Practice the Basics, Reading Objects, The SOLID Principles, Reuse Without Regret, First Builds, Capstone. Added course-feel UI: top progress bar + "X / 6 lessons . N XP", per-lesson status node (Completed/In progress/Not started, all clickable), difficulty pill + time estimate per lesson, and one smart CTA that switches Start the course -> Continue where you left off -> Take on the Capstone. Status read live from existing localStorage keys (level1_theory_awarded, level1_coding_awarded, reading_objects_awarded, level2_awarded, level4_awarded 12, first_builds_awarded; course_global_xp) via an inline script; capstone marked as the final challenge (untracked). Bright minimal restyle scoped to index.html only (new c- classes + inline <style>), so lesson pages are untouched. Headless-verified on a fresh browser: 6 tracked lessons all "todo", bar 0%, stats "0 / 6 lessons . 0 XP", CTA "Start the course -> level1.html". Temp harness removed.

- Start: 2026-06-19 13:30 CEST | Task: Make code-lab own and ship the C# compiler host (compile on demand, never track the WASM binaries in git), then make EVERY page that shows C# runnable on it - specifically Level 1 microcoding and Level 2, not just Level 4.
- End: 2026-06-19 14:27:35 CEST | Done (code-lab repo): Moved the Blazor/Roslyn compiler host source into code-lab/compiler-host/ (source only, ~328KB, 20 files) and added npm scripts build:host (dotnet publish -> dist/compiler-host, git-ignored) and build:all; .gitignore excludes the 72MB _framework output so binaries are compiled, never tracked. Fixed the host index.html load order (blazor.webassembly.js loads last, after window.level3Capstone, base href "./") which also cures the pre-existing level3Capstone.initEditor-undefined bug. Verified the host compiles + runs C# end-to-end headlessly. Committed (41cac99). Done (course repo): Replaced the served level3-app/ (git-ignored) with code-lab's verified build (correct load order). Made Level 2 runnable: vendored code-lab.css/code-lab.global.js bundle wiring, added a Run button + run-output panel per drill, a toRunnable() that fills the answers and wraps each drill in class __Lab, and a RoslynIframeRunner pointed at level3-app/index.html?runner=1; verified all 10 drills compile (9 clean + 1 intentional Liskov throw surfaced correctly). Made Level 1 microcoding runnable: the teaching snippets are intentionally invalid standalone programs (top-level statements after type declarations, undefined types), so authored an index-aligned runnablePrograms array of 10 complete validated programs and wired the same Run button + output + runner; verified all 10 compile and run through the host (True / 10 / 1 / True / 0 / Woof+Meow / 4 / confirmation / Report generated / full synthesis output) and confirmed the real level1-coding.html page boots the bundle and Run returns True. Vendor bundle confirmed identical to code-lab's build (no re-vendor needed). NOTE/BLOCKER: CI deploy still publishes the duplicated course-local level3-blazor source; wiring code-lab as a git submodule (chosen topology) and retiring level3-blazor is blocked on pushing code-lab to its own GitHub remote (user action - code-lab is local-only).

- Start: 2026-06-19 13:00 CEST | Task: Make Level 4 consume the shared code-lab package (it was still using local code-tour.js/code-runner.js) and make every lesson example runnable.
- End: 2026-06-19 13:15 CEST | Done: Added runCode drivers to the 6 cards that lacked them (1,3,7,9,11,12) so all 12 examples now run. Built the code-lab IIFE bundle and vendored it (vendor/code-lab/code-lab.global.js + code-lab.css) into the course for static GitHub Pages hosting. Switched level4.html to load the bundle + CSS, and level4.js to instantiate CodeLab.Tour and CodeLab.RoslynIframeRunner (url level3-app/index.html?runner=1) instead of the window.codeTour/window.codeRunner globals. Removed the now-obsolete code-tour.js and code-runner.js (no remaining consumers; level3 host pages use the unrelated codeRunnerHost). Verified node --check, all assets serve 200, and a headless Chrome render shows the first card and the Run button.

- Start: 2026-06-19 12:30 CEST | Task: Make the extracted code-lab package architecturally clear and testable (clear interfaces, unit tests), and prototype a LessonSource seam so Level 4 lessons are not hard-wired to an inline array.
- End: 2026-06-19 12:55 CEST | Done (code-lab repo): Extracted DOM-free core (src/core/lines.ts, present.ts, tour-state.ts) and routed Tour + the CodeLab facade through it, so the decision logic (line flags, run-result presentation, run-code selection, tour navigation) is now testable in isolation. Added the Node built-in test runner with tsx (TS loader, Node 20 has no native strip-types) and jsdom; 32 tests across pure core + jsdom DOM (Tour navigation/keys/focus, ReadOnlyView, highlighter). Exposed core helpers from the barrel. typecheck (src + tests), build (ESM/CJS/IIFE/.d.ts/css), and all 32 tests green. Done (course repo): Prototyped a LessonSource seam in level4.js - ArrayLessonSource wraps the inline lessons; renderer now uses source.count()/at() and an async start() that awaits source.init(), leaving room for a future JsonLessonSource (one file per lesson, static fetch, GitHub Pages friendly) with no UI change. Verified node --check and a headless Chrome render (first card title + 'Card 1 / 12').

- Start: 2026-06-19 12:00 CEST | Task: Restructure the index into two tracks (theory + micro-exercises, and programming tasks with the Capstone as the first programming exercise) and remove the old Level 3 applied OO automation gap-fill level.
- End: 2026-06-19 12:04:10 CEST | Done: Deleted level3.html and app.js (the gap-fill page + its data). Rewrote index.html into two track sections: Track 1 'Theory and micro-exercises' (Level 1 theory + micro, Level 2, Level 4) and Track 2 'Programming tasks' (Capstone, labelled first programming exercise). Added .track/.track-head/.track-sub styles. Updated README (track selector wording, file list now lists level4.html, dropped level3.html, replaced app.js customization section). Verified: index shows both tracks, level3.html now 404s, no stray references remain.

- End: 2026-06-18 14:07:37 CEST | Done: Applied all 4 audit fixes. Built reusable runner: code-runner.js (window.codeRunner.run/preload, hidden-iframe bridge, same-origin checked, ready/run timeouts); RunnerBridge.razor headless component + codeRunnerHost relay in capstone index.html; Home.razor ?runner=1 mode (skips Monaco). Wired l4Run button + runCode fields on cards 2/4/5/6 in level4. Fixed two infra issues: (1) local .NET broke when unattended-upgrades moved the 8.0.28 runtime to /usr/lib/dotnet while the SDK looks in /usr/share/dotnet - symlinked shared/ and packs/ across; (2) Roslyn threw PlatformNotSupportedException (Monitor.Wait) on single-threaded WASM - set concurrentBuild:false in CompilerService. Rebuilt + redeployed level3-app. Verified end-to-end via headless Chrome (DevTools Protocol): run returned compiled:true, output 'Woof\nMeow\nMoo\n'.

- End: 2026-06-18 09:59:17 CEST | Done: Added level4.html (Prism C# code panel + Level 1 quiz shell, l4-prefixed ids), level4.js (12 read-and-predict cards across 3 sections A/B/C; diamond problem centerpiece; capstone IReporter tie-back; shared course_global_xp, level4_awarded once-only 10 XP, mermaid neutral diagrams), and a Level 4 card on index.html. Verified: node --check passes, all l4 ids wired, CSS hooks present, assets serve HTTP 200.

- Start: 2026-06-18 10:40 CEST | Task: Add a solid, reusable guided code walkthrough ('Code Tour') feature, rebuilt from the Level 2 spotlight but fixing its two flaws (clip-path hole misalignment + page-scroll vs line-scroll fight). Must narrate theory while spotlighting the matching code line(s), and apply to all 12 Level 4 cards.
- End: 2026-06-18 11:18:10 CEST | Done: New standalone module code-tour.js exposing window.codeTour.open({title, code, steps}); renders code as per-line elements inside a focused modal so highlighting is a class toggle and scrolling stays contained (no clip-path, no page-scroll). Steps narrate theory + target 1-based line numbers (single or array), with Prev/Next, clickable dots, keyboard arrows, Esc to close. Added .tour-* CSS to styles.css. Authored walk[] step arrays for all 12 level4 lessons and wired a 'Walk me through the code' button (l4Walk) in level4.html (+ code-tour.js include). Verified: node --check on both scripts, 12 walk arrays present, code-tour.js serves HTTP 200.

- Start: 2026-06-17 15:43:30 CEST | Task: Redesign Level 3 capstone milestone ladder to enforce dependency injection in small junior-friendly steps - inject the formatter (no interface, pure function), abstract+inject+swap the reporter (interface, side effect), with concept notes teaching when an interface earns its place.
- End: 2026-06-17 15:57:41 CEST | Result: Grew ladder from 5 to 7 milestones (added 'inject the formatter, don't build it' and 'prove substitutability'); tightened reporter step to require interface-typed injection and no Console. in TestRunner; added Roslyn checks for formatter injection, console-welding, and two-reporter substitution; added per-milestone 'Learn why' concept notes mapping each step to SRP/DI/DIP/OCP/LSP and the interface-vs-over-engineering rule; updated StarterCode/ReferenceSolution to inject the formatter and run both reporters. Build clean.

- Start: 2026-06-17 16:09:07 CEST | Task: Add Level-2-style 'point with the finger' interactivity to the Level 3 capstone - glow the student's own offending line in Monaco, a 'Show me where' button, and a per-milestone dependency mini-diagram.
- End: 2026-06-17 16:15:32 CEST | Result: StructuralChecks now returns CodeAnchor spans (problem/target) located via Roslyn for the student's own code (e.g. inline new TestFormatter()); added Monaco highlightSpans/clearHighlights using deltaDecorations with red/green glow + glyph-margin dots; 'Learn why' and a new 'Show me where' button now scroll to and glow the exact line; added a Mermaid mini-diagram per milestone (rendered via mermaid 10.9.1 renderMermaid interop) showing the welded->injected arrow flip; highlights cleared on Run/Check/Reset/GiveUp. Build clean.

- Start: 2026-06-17 16:16:00 CEST | Task: SOLID audit of the capstone code and atomic commits of the session's work.
- End: 2026-06-17 16:26:43 CEST | Result: Flagged StructuralChecks.Run as the flagship violation - one method parsed the code, held all 7 milestone rules, and built every anchor (SRP), with results assembled from three positionally-coupled arrays so extending it meant editing three spots in lockstep (OCP). Fixed by introducing IMilestoneRule strategies (one rule per milestone, matched by Id) and a shared CapstoneSyntax parsed once (DRY); Run() now just maps rules over Capstone.Milestones. Noted but deferred as over-engineering/higher-risk: CompilerService hint switches (idiomatic lookup), Home.razor multi-concern @code block. Committed atomically: feature baseline, then the refactor, then docs. Build clean.


- Task: Build frontend-only interactive C# OO automation learning quiz (gap-filling + hints + scoring).
- End: 2026-06-14 13:30:09 CEST
- Result: Delivered frontend-only training app with 5 C# OO automation-themed gap-fill challenges, hints, and feedback.

- Start: 2026-06-14 19:29:02 CEST | Task: Implement global Course XP across Level 1 theory, Level 1 coding, Level 2, and Level 3 with one-time awards and shared localStorage key.
- End: 2026-06-14 19:29:21 CEST | Result: Added shared course_global_xp display and progression updates on all level pages; XP is awarded once per completed item per track.

- Start: 2026-06-14 19:31:55 CEST | Task: Improve Level 1 microcoding polymorphism example to be explicit and behavior-focused for beginners.
- End: 2026-06-14 19:32:39 CEST | Result: Updated polymorphism drill to use Dog/Cat list and foreach call showing same method with different runtime outputs (Woof/Meow).

- Start: 2026-06-14 19:33:08 CEST | Task: Make Level 1 microcoding drill 9 self-contained.
- End: 2026-06-14 19:33:08 CEST | Result: Added missing ILogger, ConsoleLogger, and ReportService declarations directly in drill 9 snippet.

- Start: 2026-06-14 19:34:20 CEST | Task: Replace Level 1 final microcoding drill with a full self-contained program covering all Level 1 concepts.
- End: 2026-06-14 19:34:20 CEST | Result: Added comprehensive closing program demonstrating variables/functions, classes/objects, memory refs, encapsulation, inheritance, polymorphism, composition, and DI.

- Start: 2026-06-14 19:35:03 CEST | Task: Improve Level 1 microcoding drill 7 (Inheritance).
- End: 2026-06-14 19:35:03 CEST | Result: Reworked drill into a self-contained base/derived override example with concrete output and two guided blanks.

- Start: 2026-06-14 19:36:58 CEST | Task: Expand Level 1 drill 10 into multi-question final exam.
- End: 2026-06-14 19:36:58 CEST | Result: Increased closing drill to 7 blanks across core concepts while reusing the full integrated program.

- Start: 2026-06-14 19:40:13 CEST | Task: Add per-question "Explain this part" helper across coding levels.
- End: 2026-06-14 19:40:13 CEST | Result: Added simple-language explain toggle for each blank in Level 1 coding, Level 2, and Level 3, plus row highlight styling.

- Start: 2026-06-14 19:43:25 CEST | Task: Keep explain UX work scoped to Level 1 with dimmed-page overlay and floating code explainer card.
- End: 2026-06-14 19:43:25 CEST | Result: Level 1 explain flow now dims the page and shows a top explanation card above the code spotlight.

- Start: 2026-06-14 19:44:17 CEST | Task: Adjust Level 1 explain overlay placement to avoid covering source code.
- End: 2026-06-14 19:44:17 CEST | Result: Explanation card now opens above the code block when possible, otherwise below it.

- Start: 2026-06-14 19:45:16 CEST | Task: Remove "Simple explain" wording from Level 1 explain overlay text.
- End: 2026-06-14 19:45:16 CEST | Result: Replaced learner-facing prefix with plain "Explanation" wording.

- Start: 2026-06-14 19:46:13 CEST | Task: Make Level 1 explain overlay text code-focused (not question-focused).
- End: 2026-06-14 19:46:13 CEST | Result: Explanations now describe the code line plus nearby flow (before/after lines) without question-label guidance.

- Start: 2026-06-14 19:50:00 CEST | Task: Replace auto-generated explain text with hand-written code explanations per blank.
- End: 2026-06-14 19:50:00 CEST | Result: Every blank now has an explain field with a plain description of what that code does. Auto-generation removed.

- Start: 2026-06-14 19:55:00 CEST | Task: Numbered overlay steps with code line highlighting per step.
- End: 2026-06-14 19:55:00 CEST | Result: Each blank has a hand-written step array; hovering a step highlights the matching code line with a yellow strip.

- Start: 2026-06-15 18:42:44 CEST | Task: Redesign Level 2 as baby-step SOLID curriculum (test-automation running codebase, three-beat hook/zoom-out/micro-action rhythm). Prototype topic 1 (Single Responsibility) first.
- End: 2026-06-15 18:47:04 CEST | Result: Prototype topic 1 (S - Single Responsibility) live. Added pain/map boxes (HTML+CSS), three-beat rhythm, single test-automation running codebase. Old 5 recap drills removed.

- Start: 2026-06-15 18:55:53 CEST | Task: Level 2 fixes - add Show Answers button, fix Next (build remaining 6 SOLID drills), add SOLID intro paragraph.
- End: 2026-06-15 18:55:53 CEST | Result: Added Show answers button (fills correct answers). Built O, L-trap, L-fix, I, D-trap, D-fix drills (7 total, Next now works). Added 2-line SOLID intro on hero.

- Start: 2026-06-15 19:13:38 CEST | Task: Make every SOLID principle trap-then-fix (show the broken version before the fix), like L already did.
- End: 2026-06-15 19:13:38 CEST | Result: Added broken S, O, I drills before their fixes; retitled fixes; reframed maps as "now done right". Level 2 now 10 drills (broken+fix per S,O,L,I,D).

- Start: 2026-06-15 19:42:30 CEST | Task: Add final recap page summarizing the SOLID lesson after drill 10.
- End: 2026-06-15 19:42:30 CEST | Result: Added summary entry (11th page) with per-letter recap + closing thread to testing; render hides practice sections and shows recap; progress reads "Recap" and drills now count out of 10.

- Start: 2026-06-15 19:57:04 CEST | Task: Level 3 as Blazor WebAssembly app that compiles and runs student C# in-browser (Roslyn in WASM), SOLID capstone (test-automation theme), embedded in existing site via iframe.
- End: 2026-06-15 20:42:35 CEST | Result: Built guided gamified Level 3 capstone. 5 structural milestones (S formatter extract, S TestRunner stops formatting, D reporter interface, D inject reporter, O second reporter) detected via Roslyn syntax analysis in StructuralChecks.cs. Home.razor: progress bar, per-milestone opt-in "I'm stuck" 3-rung hint ladders (concept -> direction -> skeleton), friendly compiler-error translation (CS-code map), gated "I give up" reveal of reference solution. Builds clean; running on :5099.

- Start: 2026-06-17 14:15:34 CEST | Task: Fix compiler errors showing no line numbers + suppress cascade; link Blazor capstone from index; make it runnable on Windows.
- End: 2026-06-17 14:15:34 CEST | Result: CompilerService now attaches Line/Column to each diagnostic, shows only syntax errors when parse fails (kills the misleading namespace/boot/duplicate-Program cascade), dedupes/sorts/caps at 6. Home.razor renders a red "Line N, col M" badge + root-cause-first note. Published Blazor to level3-app/ with base href="./"; added Capstone card to index.html and back-to-selector link. Added serve.cmd/serve.sh and README HTTP-serving instructions (Blazor WASM cannot run from file://). Verified all resources serve 200 over HTTP.

- Start: 2026-06-17 14:41:48 CEST | Task: Host the site on GitHub Pages (Blazor capstone + static levels), no PAT.
- End: 2026-06-17 14:41:48 CEST | Result: Added .github/workflows/deploy.yml (CI builds Blazor with .NET 8, assembles static site + published level3-app via rsync, rewrites base href to ./, adds .nojekyll, deploys with actions/deploy-pages using built-in GITHUB_TOKEN). Added .gitignore for bin/obj/publish/level3-app. No binaries committed; every push to master republishes.

- Start: 2026-06-19 18:11:07 | Task: Make code-lab a generic language-agnostic compile/run/milestone engine; move the capstone exercise (content + structural checks) into the course and inject it into the host at build time. Also fix level4 Mermaid syntax errors and capstone validator false-negatives.
- End: 2026-06-19 18:11:07 | Result: Added level3-exercise/ (CapstoneContent.cs, StructuralChecks.cs, CapstoneExercise.cs) implementing code-lab's IExercise contract; the host is now built with -p:ExerciseSource=level3-exercise and the resulting level3-app loads Title/Lead/Brief/Milestones/Check from the course. Validator fixes carried in: M1 formatter detected by shape (LooksLikeFormatter) so a typo'd PASS/FAIL literal still grades; M7 counts variable-held reporters via ConcreteReporterType. level4.js Mermaid fixed (card 6 quoted output, card 8 inheritance edge label). Headless-verified: capstone renders 7 milestones from the course exercise, starter grades 0 passed; reference solution passes all 7 in the unit harness.

- Start: 2026-06-19 18:18:05 | Task: Wire code-lab as a git submodule (level3-host) and retire the duplicated level3-blazor source.
- End: 2026-06-19 18:18:05 | Result: Rewrote .github/workflows/deploy.yml to checkout submodules and publish level3-host/compiler-host with -p:ExerciseSource=level3-exercise into level3-app (no base-href rewrite needed; host already uses ./). Removed level3-blazor/ entirely. Updated README rebuild instructions. Verified the exact CI publish command builds CodeLabHost with the injected capstone exercise from the submodule path.

- Start: 2026-06-19 18:37:11 | Task: Flatten the course difficulty gradient. Build two bridge exercises: Track 1 "Reading Objects" (between Level 1 micro and Level 2 SOLID) and Track 2 "First Builds" (between micro-coding and the capstone). Extract a shared drill engine (DRY) first. Propose a clean level numbering. SOLID 5x10 restructure and senior placement deferred.
- End: 2026-06-19 19:42:00 | Result: Extracted drill-engine.js, a shared config-driven fill-in-the-blank controller (reads window.DRILL_CONFIG) so bridge pages reuse the Level 1 drill UX without copying the ~500-line controller again (supports optional pain/map/mermaid and blank.accept[] alternates for a later Level 2 migration). Built Bridge A "Reading Objects" (reading-objects.html + reading-objects.js): 10 drills + 10 index-aligned runnable programs seeding SRP/DIP habits without naming SOLID; headless-verified it renders "Two Objects Talk" at "Drill 1 / 10", grades drill 0 (Hour/Clock) 2/2, and Runs drill 0 to "Good morning". Built Bridge B "First Builds" (first-builds.html + first-builds.js): a separate lightweight write-from-scratch engine (textarea editor + RoslynIframeRunner + output-match grading, no new WASM build) with 5 builds (class/method/constructor-inject/interface/second-impl) mirroring the capstone moves; headless-verified it renders "Build 1 / 5", and the build-1 solution compiles, runs to "hello", and grades "Passed". Wired both into index.html (Reading Objects card after Level 1 in Track 1; First Builds card before the Capstone in Track 2). All JS passes node --check; index/pages serve 200; temp harnesses removed. Deferred (todo): migrate level1-coding.js and level2.js onto drill-engine.js to drop the duplicated controllers; the proposed clean numbering rename.

## 2026-06-21 — Inline-code styling for programming terms across all levels
Start: 2026-06-21 17:05:00 | Task: The Control Flow inline-code styling for terms like if/else looked good; apply the same styling to every level so backticked programming terms render as inline <code> everywhere.
End: 2026-06-21 17:36:00 | Result: Wired renderInline (escape HTML, turn `backtick` spans into inline <code>) into every rendering path: build-engine.js goal points; drill-engine.js explain steps and quiz option buttons (context/points/quiz/summary were already covered); and the two self-contained lessons level1.js and level4.js (added their own renderInline and applied it to context, explain, question, points, options and feedback). Wrapped C# tokens in backticks across the prose-only fields of level1-coding.js, level2.js, reading-objects.js, level4.js, first-builds.js and writing-methods.js (code/snippet/starter/solution/mermaid left untouched). Broadened the course inline-code CSS to cover .options/.explain-step/.feedback and any non-pre <code>. The Level 4 walk-through runs through the shared code-lab Tour, which rendered narration with textContent; enhanced code-lab (src/tour.ts + code-lab.css: renderInline narration as innerHTML with a .cl-inline-code chip), rebuilt (38 tests pass) and re-vendored the bundle/CSS. Verified: node --check clean on all touched JS; headless renders show inline <code> in first-builds/writing-methods/reading-objects prose and in the Level 4 tour narration (`<code class="cl-inline-code">Cat : Animal</code>`).


## 2026-06-30 — New Part 4 "Build with objects" (programming exercises)
Start: 2026-06-30 16:19:00 | Task: Build a new Part 4 made only of write-from-scratch programming exercises that answer five "why" questions juniors struggle with - encapsulation (why classes/methods vs monolithic), interfaces (why abstract logic), polymorphism (why many implementations), composition vs inheritance (why not inherit everything / 3 parents), and dependency injection (why inject vs new everywhere). Reuse build-engine.js. Renumber the existing Part 4 (SOLID + Capstone) to Part 5.
End: 2026-06-30 17:16:51 | Result: Added Part 4 "Build with objects" - five write-from-scratch build lessons answering the why behind each OO tool: encapsulation.js (why classes/methods vs monolith: group state, behaviour-with-state, private, guard an invariant, change in one place), interfaces.js (why abstract: look-alike classes -> a caller stuck on one type -> name the promise -> program to it -> add a type for free), polymorphism.js (why many impls: if-per-style pain -> one call the object resolves -> loop over a List<IReporter> -> runtime Pick -> add a class without touching the loop), composition.js (inherit vs compose: real is-a -> the is-a lie -> C# one-base-class limit -> compose three parts -> swap a part behind IEngine), dependency-injection.js (why inject: new-inside knot -> editing the class to change it -> constructor injection -> inject IReporter -> inject a FakeReporter to test in isolation). Each lesson 5 tasks, 25 total, all reuse build-engine.js + RoslynIframeRunner. Built matching *.html pages (Part four eyebrow). Wired all five cards into index.html as a new Part four and renumbered the SOLID+Capstone stage to Part five. Verified: node --check clean on all 5 JS; a dotnet harness compiled+ran every solution and every hidden verify probe (25/25 solutions match expected, requireSource patterns present, verify probes return the differing expected so hardcoding is blocked); confirmed no starter passes prematurely; headless Chrome render of all 5 pages shows the first card + correct meta label and zero 'undefined'. Temp harness/project removed.
End: 2026-06-30 17:56:38 | Result: Drill 3 (encapsulation "Hide the inside") no longer expects juniors to recall read-only property syntax - the private field and read-only Treats property are now scaffolded in the starter (with plain-language comments), learner writes only the Give body; consistent with drill 4 (Bowl). Added recap support to build-engine.js (backward compatible): page-shell buildCard now has a Summary section; engine excludes a task.summary card from the build count + XP, hides the example/goal/editor/actions and shows the recap (summaryIntro/summaryItems/summaryClose), mirroring drill-engine. Added a recap card to all five Part 4 lessons (encapsulation, interfaces, polymorphism, composition, dependency-injection), each summarising its five concepts and pointing to the next lesson. Verified: node --check clean on engine + page-shell + all 5 lessons; recap data well-formed (6 tasks, 5 builds each); headless render shows "Build 1 / 5" (recap excluded) and no engine regression on data-shapes; drill-3 starter compiles warning-free to 0, solution to 2.
End: 2026-06-30 18:46:47 | Result: Three fixes. (1) End-of-lesson Next button now advances to the next lesson instead of dead-ending: course order centralized in page-shell.js (PRACTICAL + THEORY lists -> window.PAGE.nextHref), and build-engine.js, drill-engine.js, level1.js and level4.js navigate there on the last card (labelled "Next lesson"); verified the ordering for 8 pages via a stubbed-DOM run (encapsulation->interfaces, di->level2, level2->level3-app/, theory-14->index, etc). (2) Rewrote the Part 4 prose to the plain animal course voice, removing AI-tell phrasing ("build the answer by feel", "this is the payoff", "here is why", "the win:", "watch the next step", "the relief:") from contexts, recap text and the five page intros. (3) Committed and pushed. node --check clean across engines + lessons; headless render OK on build + drill pages. Note: also included a pre-existing working-tree improvement to generics.js example fields.
End: 2026-06-30 19:43:14 | Result: Two things. (1) Hotfix (pushed 2330893): the Part 4 "Build with objects" starters spelled the literal code to type in their TODO comments, so the exercises were copy-the-comment. Rewrote every TODO to state intent only; verified every solution passes and every starter fails (real work). (2) Built Theory Part 3 "How software runs and connects" for absolute beginners: theory-15 Where data lives (memory, addresses, variable=slot, stack, heap), theory-16 References vs values (value vs reference, copying, aliasing - the OOP keystone), theory-17 The build-and-run cycle (source, compiler, compile-time error, .NET runtime, run-time error, the loop), theory-18 Saving data (temporary memory, persistence, file, database, read/write), theory-19 Programs that talk (network, client/server, request/response, API), theory-20 How code is shared (version control, commit, history, sharing). Same drill-engine theory mode (MC + fill-blank), mermaid diagrams on the memory/reference/cycle/client-server cards. Wired into index theory track as Part three (6 cards), extended page-shell course order (Next chains 14->15->...->20->index), theory-14 now hands to Part three. Verified: node --check clean; headless renders show correct first cards + Topic counts + zero undefined; nav ordering confirmed.
End: 2026-07-04 09:44:19 | Result: Deployed the Build-with-objects redesign + URL feature. (1) Redesigned all 5 Part 4 lessons so the learner writes the actual class/interface/method/loop from a bare starter (only Main + a spec comment given) - no more pre-implemented bodies with a one-token blank. (2) Fixed real contradictions: encapsulation drill 5 now uses a private field + constructor (was a public field poked from Main); composition Parrot takes its word via constructor into a private field (was public). (3) De-duplicated encapsulation drills 2 vs 5 (drill 5 is now a nine-lives calculation). (4) Rewrote every "Here's the pattern" example to show the real technique on a different subject (no literal answers, no vague comments); polymorphism drill 2 shows a full interface + two implementations. (5) Added URL-hash card tracking to build-engine, drill-engine, level1, level4: opening #N jumps to that card, navigating updates the URL via replaceState, hashchange re-renders. Verified: node --check clean on all touched files; dotnet harness confirms every solution passes and every starter fails; headless deep-link to #N works.
- 2026-07-07 14:35 Reformat narr strings in theory-9/10/11/12 .viz.js (paragraphs, bold, backticks)
  done 2026-07-07 14:36 node --check passed for all 4 viz files
- 2026-07-07 16:32 Theory track: MemoryViz/Quiz engine build-out + progress. Result:
  Converted all theory lessons 5-21 to the code-lab MemoryViz widget; built the
  checkpoint Quiz as a proper code-lab component (bank draw + shuffle + grade +
  retry + XP), with Part 1-4 checkpoints. Added generic, reusable engine features
  (all in code-lab, driven by lesson data): region highlight, code marks
  (statement/expr/operator), hot slots + hot object fields, per-step code override,
  heap object @location label, narration formatting (paragraphs/bullets/bold/code),
  expanded memory regions (code/rodata/data/bss/global/heap/stack/mmap), and
  per-lesson completion + XP tracking on reaching the last step. Reworked lessons
  15 (memory regions), 16 (references vs values, corrected value/reference model),
  17 (build/run + cross-compilation, language-agnostic), 18 (files/inodes/hard &
  soft links). Fixed a quiz answer-leak (bold emphasis only on the correct option;
  engine now strips bold from options) and tightened the Part 3 question bank.
  Verified: code-lab typecheck + 57 unit tests + build; headless renders clean
  (no undefined) across lessons; completion writes done + XP end-to-end.
  code-lab pushed to master (784b242).

- 2026-07-07 21:09:34  Audit/fix poor C# identifier names in writing-methods.js, first-builds.js, wiring-it-up.js. Renamed `n`->`count` and `temp`->`temperature` in wiring-it-up.js; other two files already used good names. node --check all pass.

## 2026-07-07 21:09 - Audit poor identifier names in lambdas.js, linq.js, errors-null.js
- Start: rename single-letter local/lambda vars to descriptive camelCase.
- End (2026-07-07 21:11): renamed lambda/local params in 3 files; node --check all pass.

## 2026-07-13 20:08 - Cycle 1 content audit: per-lesson reports + agentic files
- Start: read every lesson, write one markdown report per lesson (50), plus
  infrastructure report, track indexes, master index, SPECS, and two skills.
- End (2026-07-13 20:09): docs/audit/ has 50/50 reports (tracker 100%),
  infrastructure.md, practical/index.md, theory/index.md, README.md; docs/SPECS.md;
  .github/skills/{lesson-authoring,course-audit}/SKILL.md. Read-only audit, no
  lesson content changed, nothing compiled.

## 2026-07-27 09:08 - Distil audit learnings into ledger + SPECS + skills
- Start: turn recurring audit findings into durable guidance.
- End (2026-07-27 09:10): added docs/concept-ledger.md (portable syllabus, both
  tracks + language-surface policy); SPECS.md principles (portability,
  ledger-enforced ordering, runnable-by-default, grading definition, voice loop)
  and prefer-build direction; lesson-authoring skill (ledger step + preflight
  checklist); course-audit skill (recurring-defect scan). Docs only.

## 2026-07-27 09:40 - Give LINQ and Control Flow code-lab exercises
- Start: LINQ had no runnable code-lab exercise; Control Flow was a non-runnable drill.
- Decisions: LINQ -> converted to a write-from-scratch build lesson (7 query
  tasks, each with a requireSource gate + hidden verify probe). Control Flow ->
  kept as the Part 1 theory drill (its build partner is wiring-it-up) and made
  runnable by adding index-aligned runnablePrograms + a Run button per card.
- Verified with real dotnet: all 7 LINQ solutions compile warning-free and match,
  hidden probes catch hardcoding, starters do not pre-pass, gates hold; all 7
  Control Flow programs compile warning-free with correct output. Headless render
  confirmed: LINQ "Query 1/7" build card, Control Flow "Topic 1/7" with Run button.
- Updated linq.html (build archetype), index.html cards, and the two audit reports.
- End: LINQ and Control Flow both runnable through code-lab.

## 2026-07-27 10:05 - Review fixes: lambda clarity + snippet consistency
- LINQ: made the lambda link explicit for a beginner - intro now frames "each
  operator takes a lambda (x => ...) from the Lambdas lesson", task 1 context
  names `animal => animal.Legs == 4` as a lambda, and every example comment
  labels the lambda. Only context/example display strings changed; solution,
  starter and verify code untouched (dotnet verification still valid).
- Control Flow: boolean card snippet now prints `resting` too, so the displayed
  snippet matches the runnable program (was the one review nit); warning-free.
- Refreshed the stale linq.md audit report (concept, card-by-card table,
  complexity, covered-well, verification status) to the build form.
- Verified: node --check both; headless render confirms the bridge text, example
  label, intro framing, and the two WriteLines in the control-flow snippet; 0 undefined.

## 2026-07-27 10:55 - Cycle 1 low-effort cleanup (5 theory items)
- 1. Archived the 21 dead drill files (theory-1.js..theory-21.js) to
  archive/theory-drills/ via git mv (no HTML referenced them).
- 2. Reordered Part 4 cards in index.html: How code is shared (theory-20) now
  precedes Standing on other code (theory-21), matching file numbers + ledger;
  no file rename. Updated concept-ledger.md and theory/index.md.
- 3. Added a closing synthesis step to theory-7.viz.js (now 5 steps) for Part 1
  rhythm consistency.
- 4. Fixed theory-18.html intro - dropped the "then databases" overpromise.
- 5. Raised checkpoint coverage: askCount 5 -> 7/7/10/7 for Part 1-4, with intro
  and pass wording updated to match.
- Verified: node --check all changed JS; headless render clean (theory-7 shows
  1/5, theory-18 intro fixed, checkpoint renders); card order 20->21; no HTML
  references the archived files; 0 undefined. Updated audit README checklist.

## 2026-07-27 16:19 CEST - Convert "Reading Objects" drill -> Monaco build lesson
Start. Converting reading-objects (10 fill-in-blank drills) to build-engine
(write-and-run), ~6 tasks + recap, Part 1 bridge, Gentle. Surface budget row 5:
class/field/constructor/method/if-else/comparison/string +. No var, no interpolation,
no =>. Every task gets requireSource + hidden verify probe.
End 16:31 CEST. reading-objects.js is now a build lesson: 6 write-and-run tasks
(collaborate, delegate, one-job method, separate the jobs, receive-don't-build,
wire-and-run) + a recap card. reading-objects.html switched to build archetype
(Prism dropped; load order vendor -> page-shell -> data -> build-engine). Every
task has a requireSource gate + hidden verify probe; output is int/string only.
Verified: node --check OK; per-task dotnet solution+probe pass, warning-free
solutions, starters compile and do not pre-pass, all requireSource match; headless
shows "Step 1 / 6", first title, roEditor, 0 undefined. Temp files removed.
Pending (orchestrator): index.html card (drop nothing structural; data-total=6)
and ledger row 5 surface update.

## 2026-07-28 10:24 - Author BUILD lesson "Strings" (Unit 2 Everyday essentials)

## tis 28 jul 2026 10:24:58 CEST - Author BUILD lesson "Access and properties" (Unit 2 Everyday essentials)
Start. New build lesson access-properties (Part 2, after type-conversion). 4
tasks + recap: hide a field expose get-only property; auto-property get/set;
expression-bodied computed property; init-only set-once. Portable framing:
visibility (public/private/protected) + exposing state through a property, not a
raw field. Surface budget: class/field/constructor/method + access modifiers +
properties. No List/Dictionary/LINQ/generics/lambda/enum/struct/record/array.
Every task: requireSource gate + hidden verify probe; culture-safe output.

## 2026-07-28 10:25 CEST - Start: BUILD lesson "static, const, and readonly" (class-members)
New Unit 2 practical build lesson (build-engine.js), prefix "cm", awardedKey
class_members_awarded, data-total 4 + recap. Portable framing: some
data/behaviour belongs to the TYPE (static), some values never change (const),
some fields are set once (readonly). Tasks: (1) static helper method, (2) const
value used by a method, (3) readonly field set in the constructor, (4) static
field shared across instances. Every task: requireSource keyword gate + hidden
verify probe; culture-safe output (int/string/bool only). Not editing index,
ledger, or page-shell per request.

## 2026-07-28 10:26 CEST - Start: BUILD lesson "Null-safety" (null-safety)
New Unit 2 practical build lesson (build-engine.js), prefix "ns", awardedKey
null_safety_awarded, data-total 4 + recap. Portable framing: a value may be
absent ("no value") and robust code handles that case instead of crashing.
Tasks: (1) default when null with ??, (2) safe navigation with ?., (3) nullable
value type int? + null check, (4) ??= assign-if-null on a field. Every task:
requireSource technique gate + hidden verify probe run with BOTH null and
non-null input; culture-safe output (string/int/bool only); solutions
warning-free under nullable reference types. Not editing index, ledger, or
page-shell per request.
   Done 2026-07-28 10:31 - strings.js + strings.html. 4 tasks + recap (data-total 4). Verified: node --check; dotnet all 4 (solution=expected, hidden verify probe=verify.expected, requireSource regexes, starter compiles + not pre-pass); headless Step 1 / 4, first title, 0 undefined.
End tis 28 jul 2026 10:33:08 CEST. access-properties.js + .html authored. 4 build tasks + recap
(data-total 4). Verified with dotnet 8: every solution runs == expected
(9 / Rex / cat:Milo / Rex), every rebuilt verify probe == verify.expected
(7 / Bella / cat:Zoe / Sky), all requireSource patterns match each solution,
every starter compiles and does NOT pre-pass, no compiler warnings. Headless
render of access-properties.html shows meta, title, "Step 1 / 4", 0 undefined.
Temp files removed. Not committed. Pending orchestrator: index.html card
(data-key access_properties_awarded, data-total 4) + concept-ledger row.

## 2026-07-28 10:38 CEST - End: BUILD lesson "static, const, and readonly" (class-members)
Created class-members.js (BUILD_CONFIG, prefix cm, awardedKey
class_members_awarded, awardAmount 20, 4 tasks + recap) and class-members.html
(eyebrow "Part two - Everyday essentials", title "Static, const, and readonly",
load order vendor/code-lab -> page-shell -> class-members -> build-engine).
Tasks: 1 static helper method (Zoo.Double), 2 const (Herd.LegsPerCow), 3
readonly field set in ctor (Cat name), 4 static shared counter (Sheep.Count).
Each: requireSource keyword gate + hidden verify probe; output int/string/bool
only. Did NOT edit index.html, docs/concept-ledger.md, or page-shell.js (per
request; proposed ledger row reported to author).
Verified (dotnet 8): node --check OK; all 4 solutions compile+run == expected;
all 4 verify probes == verify.expected; requireSource matches every solution;
starters compile and do not pre-pass. Browser render confirmed "Step 1 / 4",
concept/meta/goal/expected all set, Monaco loaded, 0 "undefined". Temp files
removed.

## 2026-07-28 10:39 CEST - End: BUILD lesson "Null-safety" (null-safety)
Created null-safety.js (BUILD_CONFIG, prefix "ns", 4 tasks + recap) and
null-safety.html (copy of type-conversion.html; eyebrow "Part two - Everyday
essentials", title "Null-safety"). Tasks: (1) default with `??`, (2) safe call
with `?.`, (3) nullable value type `int?` + null check, (4) assign-if-null with
`??=` on a field. Each: requireSource technique gate + hidden verify probe that
re-runs the learner's class with BOTH a null and a non-null input; culture-safe
output (string/int only).
Verified (real dotnet 8, Nullable enable): every solution output == expected;
zero nullable warnings; every probe passes ["Rex","stray"]/["Milo","nobody"]/
["age 4","unknown"]/["Rex","guest"]; requireSource matches each solution;
starters compile and do not pre-pass. Headless dump of /null-safety.html shows
"Step 1 / 4", 0 "undefined", title, meta, Run button. Temp files deleted.
Did NOT edit index.html, docs/concept-ledger.md, or page-shell.js per request.
## 2026-07-27 11:42 - AI track: code-lab agent panel + Lesson 1 "What is an LLM?"
- Start (2026-07-27 11:28): after co-designing and getting sign-off on the clean
  look (reuse course styles, no new palette), build the real code-lab `agent`
  panel and prove it with Lesson 1.
- End (2026-07-27 11:42): code-lab - new src/core/agent-model.ts (pure AgentScene model +
  agentFanRows, 6 unit tests); Step.agent field + "agent" PanelType +
  configurable LegendItem[] in memory-model; new src/dom/agent-view.ts (token
  strip, LLM core, next-token fan); facade branch + legend threaded through
  VizControls; .cl-ag CSS (course palette only, amber = chosen token) in
  code-lab.css; exports in index.ts. typecheck clean, 63/63 tests pass, built
  and re-vendored code-lab.global.js + code-lab.css. Course - new ai-1.viz.js
  (data-only LESSON_VIZ, 6 steps) + ai-1.html; verified end-to-end via headless
  render (strip, live core, probability fan, amber chosen token, autoregression).
  Not yet wired into index.html; lessons 2-10 + checkpoint still to come.

- Start (2026-07-27 11:45): Build AI-track Part 1 lessons 2-5 (Tokens, The
  prompt, Context, The context window) on the locked clean look, then wire the
  whole AI track into index.html.
- End (2026-07-27 12:25): Authored ai-2..ai-5 (viz + html) reusing the `agent`
  panel: L2 Tokens (word->token split, hot spotlight, no fan), L3 The prompt
  (user prompt tokens + amber continuation + a next-token fan), L4 Context (fan
  goes from flat guess to peaked "tuna" 86% once context is added), L5 The
  context window (oldest tokens struck-through as `dropped` + dashed window
  divider). Small engine add: optional `fan` flag on the agent PanelSpec so
  fan-free lessons (2 and 5) omit the empty probability box; AgentView takes a
  showFan arg. typecheck clean, 63/63 tests pass, rebuilt + re-vendored
  code-lab.global.js + code-lab.css. Wired the AI track into index.html (third
  chooser card + switch button + trackAi container with Part-1 stage head and 5
  cards + registered in the tracks JS) and added the AI order array to
  page-shell.js for nextHref. Verified every lesson and the landing page via
  headless render (correct token kinds, fan states, divider, 3-track chooser,
  AI track active with 0/5 progress; no `undefined`). Removed temp harnesses
  (_drv.html, _idrv.html) and the superseded approved mock (_agent-l1-clean.html).

- Start (2026-07-27 12:55): Act on review feedback - fix "AI-style" voice in
  lessons 4-5, and fold the AI track into the Theory track (not a separate track).
- End (2026-07-27 13:05): Voice - rewrote ai-4 intro + steps 3/5/6 and ai-5
  intro + steps 4/5/6 to strip AI tells (removed "the model looks smart", "just
  means", "simply", the tricolon topic-lists, and the "which is next" meta
  bridges) per AGENTS.md. Structure - merged AI into Theory: removed the third
  chooser card, the AI switch button, and the trackAi container; moved the AI
  stage head + 5 cards into the Theory <ol> as "Theory · Part five - The
  building blocks of AI"; reverted the lead to "Two ways to learn" (noting
  theory now includes AI); dropped tracks.ai; appended ai-1..ai-5 to the THEORY
  order array in page-shell.js so the chain runs theory-check-4 -> ai-1 -> ...
  -> ai-5; updated the 5 AI lesson eyebrows to "Theory · Part five". Verified
  via headless render: 2 chooser cards + 2 switch tabs, no trackAi, Theory shows
  "0 / 30 lessons" with Part five + AI cards, lesson 4 eyebrow/intro/step-5 read
  clean, no `undefined`. No engine rebuild needed (content + wiring only).

- Start (2026-07-27 13:06): Depth decision (user): keep the intro lessons at the
  current gentle pace; raise difficulty in later parts. Continue the arc with
  Memory, opening a new "From model to agent" part.
- End (2026-07-27 13:12): Built ai-6 "Memory" (viz + html), gentle pace, reusing
  the agent panel with no engine change: a fact is saved (hot), the window fills
  and it drops out (dropped + divider), the model alone guesses (cold fan), then
  the fact is recalled into the context (hot green) and the fan peaks on "tuna"
  86%. Wired into the Theory track as the first card of "Theory · Part six -
  From model to agent"; appended ai-6.html to the THEORY nextHref array. Verified
  via headless render (save/forget/recall beats read clearly, no `undefined`).
  NEXT (proposed): Tools, then From LLM to agent (the loop) to finish Part six.

- Start (2026-07-27 13:22): Continue Part six with richer visuals per the user's
  directive - stop forcing the token strip; build new widget visuals where the
  concept calls for it. Targets: Tools and From LLM to agent (the loop).
- End (2026-07-27 13:38): Extended the code-lab agent engine with two genuinely
  new visuals, then built the two lessons on top.
  Engine (code-lab, rebuilt + re-vendored, typecheck clean, 66/66 tests):
  * agent-model.ts: AgentTool (name/call/result/state) + AgentScene.tool.
  * agent-view.ts: renders a tool card beside the core - the call the model emits
    (amber chip) and the result that returns (teal chip), with the core->tool wire
    lighting up while calling. CSS: .cl-ag-tool block (course palette only).
  * agent-loop-model.ts (new) + agent-loop-view.ts (new): a new "agentloop" panel
    type - the capstone SVG diagram (environment/context/LLM/tools/memory) wired in
    a perceive-reason-act-observe loop, ported from the agreed mockup. Per step it
    lights nodes (amber), a loop stage, a memory row (blue) and tool chips, fills
    the context box, shows the model's thought, and animates a packet along the
    active wire. Omitting `active` shows the whole picture neutral (intro/recap).
    Pure helper agentLoopActiveSet + 3 unit tests. Wired into memory-model
    (Step.agentLoop, PanelType "agentloop"), the facade, index.ts exports, and a
    .cl-al CSS block.
  Lessons (Theory · Part six · From model to agent):
  * ai-7 "Tools" (viz + html): a question the model can't know alone -> it emits a
    getWeather("Paris") call -> the tool returns 12C, rain -> the result lands in
    the context as a hot token -> it answers. Uses the tool card, fan off.
  * ai-8 "From LLM to agent" (viz + html): assembles model + context + memory +
    tools in the loop; one turn (perceive -> reason -> recall -> act -> observe)
    then a recap. Uses the agentloop panel. The bridge to the harder material.
  Wired both cards into index.html (Theory now 33 lessons) and appended ai-7.html,
  ai-8.html to the THEORY nextHref chain. Verified through the real vendored engine
  via headless render: tool card call/result + context landing, loop stages and
  node/tool/memory lighting, both pages mount with no `undefined`.

## 2026-07-27 13:59 CEST - AI track: steering & sampling (the two optional building-block lessons)
Task: build the two optional lessons the user approved (system-vs-user messages,
sampling/temperature) and place them in Part five right after "The prompt", so the
window -> memory hook stays intact. Both reuse existing agent-panel visuals (no
engine change, no rebuild).
Done:
  * ai-9 "System and user messages" (viz + html): the same question ("Explain
    gravity.") with two different system messages - a terse expert vs a playful
    teacher for kids - produces two different replies. Reuses the token strip's
    system (blue) / user (teal) / gen (amber) token kinds; fan off. prefix ai9.
  * ai-10 "Sampling and temperature" (viz + html): the same prompt lands on
    different words. The probability fan goes from a peaked spread at low
    temperature (orange 88%, almost always picked) to a flat spread at high
    temperature (orange 30 / pink 26 / red 22 ...) where a lower-ranked word can
    win. prefix ai10, reuses the fan.
Wiring: inserted both cards into index.html between "The prompt" (ai-3) and
"Context" (ai-4); reordered the THEORY nextHref chain to ai-1,2,3,9,10,4,5,6,7,8
so Prompt -> Steering -> Sampling -> Context flows. Theory now 35 lessons / 35 XP.
Verified through the real vendored engine (headless): steering shows three token
colours, sampling shows peaked vs flat fans; both pages mount with 0 undefined and
the correct "Part five" eyebrow. No engine rebuild (visuals reused). Temp harness
and screenshots removed.

## 2026-07-27 14:38 CEST - AI-track engine: pay down SOLID debt (code review findings 2, 3, 4)
After a SOLID review + an independent rubber-duck pass, fixed the three findings
tied to this session's AI-track engine work (left finding 1, the Step fat
interface, as documented debt per both reviewers).
  * Finding 2 (OCP/DIP - panel factory): replaced the imperative switch in
    MemoryViz.makePanel with a typed panelFactories registry
    (Record<PanelType, builder>). TypeScript now enforces exhaustiveness, so a new
    panel is pure addition (one record entry + import) rather than editing a
    switch. Imports stay explicit - no self-registration side effects.
  * Finding 3 (OCP - AgentLoopView hardcoded taxonomy): moved the tool chips and
    memory rows out of the inline SVG into named data constants
    (DEFAULT_LOOP_TOOLS / DEFAULT_LOOP_MEMORIES) rendered by the view in a loop,
    and tightened AgentLoopScene.mem/chips to literal id types (AgentLoopMemoryId /
    AgentLoopToolId) so a lesson can no longer reference an id the diagram can't
    draw. Box heights derive from row count, so the picture is byte-identical at
    three rows and still fits if the taxonomy grows. Exported the new types +
    constants from index.ts.
  * Finding 4 (SRP - MemoryViz doing too much): extracted the localStorage
    XP/completion persistence into a testable ProgressStore (core, storage
    injected) and the autoplay timing loop into a small Autoplay driver (core,
    talks to the host only through hooks, so control-button state stays owned by
    MemoryViz). MemoryViz now composes + orchestrates + reflects XP into the hero,
    delegating persistence and timing.
Tests: +5 progress-store + 2 autoplay (mock timers) = 73/73 pass (was 66).
typecheck clean; npm run build; re-vendored code-lab.global.js + code-lab.css.
Verified through the rebuilt vendored engine (headless): the agent-loop diagram
(ai-8) renders identically from the data constants; a memory lesson (theory-1)
still mounts board/die/narration/controls via the registry; Play advances a step
(autoplay wired); reaching the last step awards xp=20 for both an AI and a memory
lesson (ProgressStore wired); 0 undefined across ai-1/ai-8/ai-10/theory-1. No
push. Temp harnesses removed.

## 2026-07-27 15:20-15:31 CEST - Deeper AI lessons: Memory (4 kinds) + Tools (schemas/errors)
Start 15:20, end 15:31. Built two "Going deeper" lessons that expand ai-6/ai-7
with NEW engine visuals instead of reusing the token strip.
Engine (code-lab, uncommitted): NEW memory-shelf scene (core memory-shelf-model.ts
+ dom memory-shelf-view.ts, panel type "memoryshelf": working strip + episodic/
semantic/procedural store cards) and NEW tool-rack scene (core tool-rack-model.ts
+ dom tool-rack-view.ts, panel type "toolrack": rack of tool cards with typed
signatures + call/error/retry/result I/O). Wired Step.memoryShelf / Step.toolRack,
PanelType union, panelFactories, index.ts exports, .cl-ms/.cl-tr CSS. +7 unit
tests = 80/80 pass; typecheck clean; npm run build; re-vendored global.js + css.
Course: ai-11.viz.js/.html (Memory, four kinds; prefix ai11) and ai-12.viz.js/.html
(Tools, deeper; prefix ai12), 7 steps each. index.html: new "Going deeper" (Part
seven) stage + ai-11/ai-12 cards (Steady). page-shell THEORY nextHref: ai-8 ->
ai-11 -> ai-12. Theory now 37 lessons.
Verified (headless, real vendored engine): 12 AI cards + "Going deeper" stage,
0 undefined; memoryshelf shows working strip + 3 stores; toolrack shows 3 tool
cards with signatures + idle->chosen->calling->error->returned progression;
nextHref chain ai-8->ai-11->ai-12->index. No push. Temp harnesses removed.

## 2026-07-27 15:37 CEST - SOLID review of ai-11/ai-12 engine code + fix
Reviewed the two new scenes for SOLID. Finding: the tool-rack put its domain
logic (which I/O rows to show, error-takes-precedence-over-result, state
defaulting) in the DOM view, untested - asymmetric with the memory-shelf, which
resolves in a pure, tested model (shelfStores/activeStores). SRP + testability
gap. Fix: moved it into tool-rack-model.ts as pure resolveRackTools() (signature
+ state default, in order) and toolRackRows() (call, then error XOR result);
ToolRackView is now a thin renderer that maps resolved rows to markup (kind ->
css/dir label kept in the view as presentation). Exported the new fns/types.
Tests: +6 tool-rack (resolveRackTools defaults/empty; toolRackRows empty/
call+result/error-precedence/error-without-call) +1 memory-shelf custom-taxonomy
seam = 87/87 pass (was 80). typecheck clean; npm run build; re-vendored. ai-12
renders identically (headless): 3 signatures, io area, 0 undefined. No push.

## 2026-07-27 15:49 CEST - ai-11/ai-12 readability fixes (reported on localhost)
Three issues found via screenshots. (1) *italic* showed literally: the narration
engine handled **bold** and `code` but not italic. Added italic to inline() in
narration.ts (after bold, so **x** is never misread), +3 unit tests (90/90).
(2) ai-11 working caption was dark on the dark-green strip: the views reused the
class cl-ag-cap, which is scoped to .cl-ag, so inside .cl-ms/.cl-tr it got no
widget colour and fell back to the page's dark text. Gave the two scenes their
own caption classes (cl-ms-cap light for the dark strip, cl-tr-cap muted like the
agent scenes) and a shared caption rule. (3) ai-12 tool signatures were dark: the
course's :not(pre) > code light pill leaked into the widget's <code>. Added a
reset scoped to .cl-mv-visual (spares narration pills in the aside; skips <pre>
listings); scene chips re-assert their colours at higher specificity. Bumped idle
tool-card opacity 0.72->0.82. typecheck; 90/90 tests; build; re-vendored.
Verified (headless screenshots): ai-11 caption readable + bold/italic render,
ai-12 signatures readable + caption consistent, ai-1 agent captions unregressed.
No push.

## 2026-07-28 09:12 CEST - AI track: finish the "transcript" widget + lesson ai-13
Continued the prior session's unfinished work. It had started a NEW code-lab
"transcript" scene (an honest view of an agent run as a growing list of
role-tagged messages) but left it half-wired, so code-lab did not typecheck.
- Engine (code-lab): finished the transcript widget. Added Step.transcript, the
  "transcript" PanelType, its entry in the panelFactories registry (MemoryViz),
  and the transcript-model exports in index.ts; wrote the .cl-tx CSS block
  (course palette only - each message's left edge + author tag coloured by WHO
  wrote it: you=teal, app=blue, model=amber, code=rose); added
  test/transcript-model.test.ts (5 tests for resolveTranscript/authorOf). The
  transcript-model.ts + transcript-view.ts the prior session wrote were kept.
  typecheck clean; 95/95 tests pass (was 90); npm run build; re-vendored
  code-lab.global.js + code-lab.css.
- Course: authored ai-13 "What a run really is: the transcript" (viz + html,
  data-only LESSON_VIZ, 7 steps, prefix ai13). It makes the non-obvious truths
  visible - the model only ever writes an assistant message; a tool result is
  written by your code, not the model; "memory" is just the list re-sent every
  call; instructions live as text near the top. Wired a Part-seven card into
  index.html (Theory now 38 lessons) and appended ai-13.html to the THEORY
  nextHref chain (ai-12 -> ai-13 -> index).
- Verified through the rebuilt vendored engine (headless): ai-13 mounts the
  transcript scene with correct role + author tags and 0 undefined; a probe
  step exercising all five roles, all four authors, the send banner + arrow,
  notes and hot all render; index shows 13 AI cards + "Going deeper" with 0
  undefined; nextHref computes ai-12 -> ai-13 -> index. Also resolved a stale
  stash conflict in this log. Temp harnesses removed. No push.

## 2026-07-28 10:10 CEST - Merge AI deeper lessons into their intros
- Start: 2026-07-28 10:10 CEST
- Folded the two "Going deeper" lessons back into their intro lessons so each
  topic is one lesson that starts plain and goes deep. ai-6 "Memory" now runs on
  the richer `memoryshelf` panel (8 steps): the model forgets, working memory,
  save to a store, the four kinds (episodic/semantic/procedural), recall the
  right kinds, close. ai-7 "Tools" now runs on the `toolrack` panel (9 steps):
  a single tool called on the happy path, then several tools with typed schemas,
  choosing the right one, a call that errors on a bad argument, and recover +
  retry. Rewrote ai-6.html / ai-7.html intros and their index cards (pill Gentle
  -> Steady, longer time) to match the merged depth.
- Removed ai-11.html/.viz.js (Memory, deeper) and ai-12.html/.viz.js (Tools,
  deeper); dropped the "Theory - Part seven - Going deeper" stage head. Moved the
  ai-13 transcript card up under Part six (after ai-8) and reset its eyebrow to
  "Theory - Part six - From model to agent". Trimmed the THEORY nextHref chain to
  ai-8 -> ai-13 -> index (Theory track now 36 lessons; count is data-driven).
- Verified (headless, vendored engine): ai-6 mounts memoryshelf 1/8 with the
  four-kinds narration; ai-7 mounts toolrack 1/9 with the tool schema signature;
  ai-13 mounts transcript 1/7; index has no Part seven and no ai-11/ai-12 refs;
  0 undefined on every page; no stale ai-11/ai-12 references remain in any
  html/js. Engine untouched (no submodule change). No push.
- End: 2026-07-28 10:10 CEST

## 2026-07-28 10:44 CEST - Extend AI track: reasoning, planning, retrieval, reliability
- Start: 2026-07-28 10:44 CEST
- Grounded a gap analysis in the canonical agent authors (Anthropic "Building
  Effective Agents", Lilian Weng "LLM-Powered Autonomous Agents", OpenAI and
  Google agent guides) and built the ten missing introductory-to-reliable
  lessons the AI track lacked.
- Two new reusable code-lab scenes (data-only, pure model + thin view, both
  unit-tested): `retrieval` (`cl-rg`) - a store of document chunks, a query
  turned into a vector, similarity scores, the closest chunks retrieved, and an
  answer grounded in them (RAG); and `planboard` (`cl-pb`) - a goal decomposed
  into an ordered list of steps carrying pending/active/done/blocked state, with
  re-planning. Wired both into Step, PanelType, the panel factory, index.ts
  exports and code-lab.css; added retrieval-model + planboard-model tests
  (typecheck clean, 104/104 tests, rebuilt + re-vendored the IIFE bundle + css).
- Ten new lessons, all data-only `LESSON_VIZ` on existing engine scenes:
  ai-14 Retrieval (retrieval), Part six. New Part seven "How an agent thinks":
  ai-15 Reasoning/chain-of-thought (transcript), ai-16 Planning (planboard),
  ai-17 Reason and act / ReAct (transcript), ai-18 Reflection (transcript).
  New Part eight "Making agents reliable": ai-19 Workflow or agent? (planboard),
  ai-20 Guardrails (transcript), ai-21 Knowing when to stop (agentloop),
  ai-22 Hallucination and grounding (transcript), ai-23 Did it work? Reading the
  trace (transcript).
- Wired index.html (ai-14 card into Part six after Tools; new Part seven and
  Part eight stage heads + nine cards) and the page-shell THEORY chain
  (ai-7 -> ai-14 -> ai-8 -> ai-13 -> ai-15 ... -> ai-23 -> index).
- Verified: node --check on all 10 viz files; the real resolvers run against
  every step of every lesson (retrieval reaches 2 matches + grounded answer,
  planboard reaches all-done, every transcript author resolves); headless render
  of all 10 lessons + index shows correct panels (cl-rg/cl-pb/cl-tx/cl-al),
  right step counts and titles, both new stage titles, 21 AI cards, 0 undefined.
  Temp harnesses removed. No push.
- End: 2026-07-28 10:44 CEST

## 2026-07-28 11:16 CEST - Merge AI agentic track into master
- Task: merge branch agents/ai-reading-list-syllabus-creation (29 ahead / 4 behind)
  into master. Master had diverged (practical-track restructure); our side added
  ai-13..ai-23 plus three code-lab scenes (retrieval, planboard, transcript).
- Submodule: fetched code-lab 4db99fd/ed6848b into master's module store so the
  gitlink (base==master==56ba20a, ours==ed6848b) fast-forwarded cleanly.
- Conflicts: only docs/work-log.md (append vs append) - kept both sides' entries.
  index.html and page-shell.js auto-merged (AI region vs practical region).
- Re-applied the viz-lessons section onto master's lesson-authoring skill.
- Verified on merged master (headless): index 0 undefined / 21 AI cards / both new
  stage heads; ai-14 cl-rg, ai-16 & ai-19 cl-pb, ai-23 cl-tx, 0 undefined; master's
  restructured arrays/null-safety/strings build lessons still render. No push.
- End: 2026-07-28 11:16 CEST

## 2026-07-28 14:04 CEST - Rebuild the data-driven index after a hard reset lost the wiring
A `git reset --hard HEAD` in the editor reverted every TRACKED file to HEAD.
The four new registry files (course-manifest.js, course-progress.js,
course-nav.js, course-index.js) survived because they were untracked; the
wiring in index.html, page-shell.js and the lesson pages did not. Rebuilt it
properly so the manifest is the single source of truth and nothing is
hardcoded twice:
- index.html is now a thin shell (462 lines, was 1907). It holds only the hero,
  empty containers (#trackChooser/#trackCards, #trackSwitch, #trackMount), the
  jump-bar shell, the scroll-progress line and back-to-top. course-index.js
  builds the chooser, the track switch and one collapsible path per track from
  window.Course; course-progress.js paints status; course-nav.js runs the jump
  bar. No lesson cards and no progress logic live in the HTML any more. Added
  the missing nav CSS (.c-jb-*, collapsible .c-part*, .c-scrollprog, .c-totop,
  .c-pulse) ported from the approved nav prototype.
- page-shell.js no longer carries its own hardcoded PRACTICAL/THEORY order
  arrays (which had the AI lessons wrongly appended to Theory). It derives a
  lesson's "Next" from window.Course.locate(current) - the same manifest - and
  falls back to index.html if the manifest is absent. This removes the second
  copy of the course order.
- All 75 lesson pages now load course-manifest.js before page-shell.js so the
  lookup works; the two POC pages that do not use page-shell were left alone.
- Verified: node --check on all five JS files; headless render of the chooser
  (3 track cards, 14 parts, 76 cards, 0 undefined) and a seeded AI-part-1-done
  state (collapse to a summary row with no spine overlap, 7/21 in both the hero
  and the jump bar, one done pill, 7 Completed cards); lesson next-href resolves
  through the frozen facade (control-flow -> writing-methods, ai-5 -> ai-6,
  ai-23 -> index, theory-check-4 -> index for the 3-track split,
  the-solid-principles -> level3-app/). Screenshot matched the pre-loss view.
  Temp harnesses removed. Not pushed.

## 2026-07-28 15:09 +0200 - Theme system (start)

Goal: extensible theme system. Tokenize all colors in styles.css + index.html
inline into CSS custom properties (SSOT), keep default byte-identical, add a
theme registry + switcher + localStorage persistence (early-applied, no FOUC),
ship default (Clean) + one full "Critters" animal theme (palette + rounder font
+ SVG decorations), applied site-wide (index + all lesson pages).

## 2026-07-28 15:27 +0200 - Theme system (end)

Shipped an extensible, site-wide theme system.

- Tokenized every raw color in styles.css (72 unique) and the index.html inline
  styles into semantic CSS custom properties, with RGB-channel tokens
  (--primary-rgb / --accent-rgb / --dark-rgb, plus --bg-1-rgb / --card-rgb /
  --shade-rgb) so tints follow a recolor. :root defaults are byte-identical -
  headless pixel diff of the default index vs master = 0 differing pixels, and a
  lesson page matched apart from the compiler-warmup button label.
- Added a small registry/behavior split: theme-registry.js (data - the list of
  themes) and theme-switch.js (applies data-theme before paint to avoid a flash,
  persists to localStorage course_theme, loads the theme font on demand, builds
  a floating picker). Wired both into the <head> of index + all 75 lesson pages
  after the styles.css link. Presentation lives in styles.css [data-theme] blocks.
- Shipped default (Clean) + a full "Critters" skin: warm rounded palette, Baloo 2
  / Nunito fonts, larger radii, a faint paw-print background, and a fox mascot in
  the lesson hero. Adding another theme is a data entry plus one CSS block.
- Picker sits bottom-right, stacked above the index back-to-top and clear of the
  lesson Previous/Next nav; panel opens upward, closes on outside-click/Escape.

## 2026-07-28 16:43 +0200 - Dark theme (start)

Adding a dark theme as the next low-hanging fruit from the market investigation.
Plan: one data entry in theme-registry.js (with a scheme:"dark" flag), one
[data-theme="dark"] override block in styles.css (full surface/ink/hairline/tint
inversion, plus targeted fixes for dual-role tokens), and a small FOUC-safe change
to theme-switch.js so an unset preference follows the OS prefers-color-scheme.

## 2026-07-29 08:22 +0200 - Dark theme (end)

Added a Dark theme, the first cheap win from the market investigation.

- theme-registry.js: one data entry (id "dark", swatch, note) plus a scheme
  flag and a schemeDefault(scheme) query. No logic in the data file.
- styles.css: one [data-theme="dark"] block that overrides every surface / ink /
  hairline / tint / channel token for a dim, low-glare palette, sets
  color-scheme: dark, and adds two targeted fixes for dual-role tokens (inline
  code text color, and the back-to-top elevation shadow) that had assumed a
  light surface. :root defaults untouched - the default still renders unchanged.
- theme-switch.js: when the visitor has no saved choice, the theme now follows
  the OS prefers-color-scheme (picking the scheme-tagged theme), and it keeps
  following live OS changes until an explicit pick is made. An explicit choice
  always wins. FOUC-safe: still applied in <head> before first paint.
- Verified: node --check on both JS files; a Node DOM-stub harness covering the
  boot decision (9 cases) and the live OS-change watcher (6 cases), all passing;
  every dark foreground/background pair checked against WCAG AA (all >= 4.5:1);
  headless render of index + a lesson page with dark seeded (data-theme applied,
  0 undefined, picker lists Clean/Critters/Dark with Dark active); default index
  with no saved choice still carries no data-theme attribute.

## 2026-07-29 08:36 +0200 - Dark theme: polish theory/AI interactive widgets

Start. The dark palette landed, but the theory and AI visual widgets
(CodeLab.MemoryViz board/die scenes, the AI agent scenes, and the checkpoint
Quiz) still carry hardcoded light panels that glare on the dark page: the
narration panel and Prev/Reset controls, the pastel RAM region cards and
stack/heap slots, the AI next-token probability panel, and the whole quiz card.
Plan: add a [data-theme="dark"] widget-skin section to styles.css that
re-points the components' own CSS variables and darkens the few hardcoded
surfaces, deriving colours from the course dark tokens (no parallel palette).
The vendored code-lab bundle is untouched - this is theme CSS only.

## 2026-07-29 09:00 +0200 - Dark theme widgets: done

End. Added a [data-theme="dark"] widget-skin section to styles.css that darkens
the light panels the vendored code-lab visuals hardcode, deriving every colour
from the course dark tokens (no parallel palette; code-lab bundle untouched):
- MemoryViz shell: re-pointed its own --mv-ink/--mv-muted/--mv-line (and the
  frame-name --mv-stack) to course tokens; dimmed the narration note and the
  Prev/Reset/text-size controls; lifted the teal step/label text.
- RAM die: darkened the pastel region cards (code/global/stack/heap/...) while
  keeping each region's hue in its tag; darkened stack frames, memory slots and
  heap objects, keeping the per-process accent colour.
- AI agent scene: darkened the next-token probability panel and its rows.
- Checkpoint Quiz: a full dark skin (card, question cards, options, results).
All overrides keep the widget-root ancestor so they outweigh code-lab.css, which
loads after styles.css.
Verified with puppeteer-core driving the widgets to later steps: theory board/
die/frames/slots, a filled AI probability fan, the memory-shelf and plan-board
scenes, and a checkpoint quiz - all read cleanly on dark. Every new fg/bg pair
clears WCAG AA (worst 4.79:1). The default light theme is unchanged (rules are
all [data-theme="dark"]-scoped; re-checked headless). Temp harness removed.

## 2026-07-29 12:14 +0200 - Execution-visualizer spec: canonical doc

Start+End (design-only). Wrote docs/execution-visualizer-spec.md - a 149-line
canonical spec for the C# execution visualizer, distilled from three research
threads (tool teardown, learning science, explorables/interaction design) after
a final cross-correlation pass folded in every data/execution feature the earlier
draft had dropped. Ten sections: problem, three pillars, what-it-shows-by-level
(L0-L3 projection table), visual language, interaction, the differentiators over
Python Tutor, accessibility, build/architecture (evolve MemoryViz; derived-from-
Step features; Roslyn tracer as a separate track; phases P1-P5), open decisions,
and one-line evidence. Linked from docs/SPECS.md as a companion doc. No code.

## 2026-07-29 12:48 +0200 - Execution visualizer P1: level-0 renderer

Start+End. Built P1 of the C# execution visualizer (docs/execution-visualizer-
spec.md): the level-0 presentation on a hand-written trace, by EVOLVING MemoryViz
(not a new widget). Confirmed decisions: P1 first, evolve MemoryViz, prototype =
theory-14, defer heavy motion to P3 (static change-highlight only).

code-lab submodule:
- Added "vartable" to the PanelType union (memory-model.ts).
- New src/dom/vartable-view.ts: a Panel that renders the active (top) stack
  frame's locals as a flat Name | Value table - no stack/heap split, no arrows,
  no addresses. Unassigned slot -> "unassigned"; a slot the step marks hot -> a
  STATIC amber highlight (no motion, so it is also the reduced-motion path).
  Values are HTML-escaped (a value like List<int> would otherwise break markup).
- Registered the factory in memory-viz.ts; added .cl-mv-vartable CSS.
- typecheck clean, 103 tests pass, tsup build clean. Re-vendored the IIFE bundle
  + css into vendor/code-lab/.

Course repo:
- Converted theory-14.viz.js to a level-0 exec scene: layout { visual:[code,
  vartable], aside:[narration, controls] } over the same 6 steps, dropping the
  board/die. Boxes fill one line at a time during the debug walkthrough, each
  change amber-highlighted. Same narration/voice.
- Added a [data-theme="dark"] skin for the vartable in styles.css.
- Locked the four open decisions in the spec.

Verified headless (chrome --dump-dom): step 1 shows code + 3 rows (a=10, b=5,
total=unassigned) + narration + scrubber, no undefined; driving Next to step 4
shows a=10 amber-highlighted with b/total still "unassigned" - the one-at-a-time
fill and change-highlight work. CSS braces balanced; temp harness removed.

## 2026-07-29 13:15 - P1 review fix: level-0 vartable value-only
Code review of the P1 vartable change surfaced one latent design-intent issue:
the reusable level-0 panel rendered '-> heapId' for a ref slot, contradicting
the spec's level-0 'no arrows, no addresses' rule. Dropped the ref branch so a
reference slot falls through to its display value. Typecheck + 103 tests pass;
rebuilt and re-vendored. code-lab e900057.

## 2026-07-29 13:25 - Fleet: P2 post-processor, dark widgets, two level-0 lessons
Three parallel tracks, each scoped to disjoint files, integrated after review:
- Track A (code-lab): derived-trace post-processor (exec-trace.ts) + 6 tests.
  deriveTrace() -> per-step changes, value-history, line-heatmap, call-depth,
  notable moments. DOM-free, not yet wired to a panel (P3). 109 tests pass.
- Track B (styles.css): dark-theme overrides for widget elements that lacked a
  skin (code line labels, slot addr, hot-slot border, quiz meta + primary).
- Track C: converted theory-9 (Variables) and theory-11 (Statements and
  expressions) to the level-0 execution scene, using theory-14 as the template.
All dark rules stay [data-theme=dark]-scoped; both lessons headless-verified.

- Start: 2026-07-29 13:36:20 | Task: Reproject theory-13 Functions visual onto the level-1 execution call stack layout, preserving existing code and narration scope.
- End: 2026-07-29 13:37:34 | Result: Reprojected theory-13.viz.js onto the level-1 execution layout (code + callstack). Preserved the existing add/main CODE array and six-step teaching arc; replaced legacy board/RAM scene fields with layout + legend; added local box/frame helpers, stable frame ids, copied hot arguments on add push, hot return value in the add frame, and hot r when the returned 8 lands back in main. Verified: node --check theory-13.viz.js passed; node load printed steps 6, callstack layout, ok max frames 2.

- Start: 2026-07-29 13:45 | Task: Integrate P3 fleet (level-1 callstack panel + scrubber enrichment + level-0/level-1 lesson conversions) into the shared engine, rebuild, re-vendor, verify, and commit.
- End: 2026-07-29 13:47 | Result: Wired the new CallStackView panel into memory-viz (PanelType "callstack", factory entry, deriveTrace + setDerived scrubber wiring); merged the callstack + scrubber-enrichment CSS into code-lab.css and added [data-theme=dark] skins for both to the course styles.css (braces 283/283, all dark-scoped). code-lab: typecheck clean, 109 tests, build ok, re-vendored. Headless-verified theory-13 (2 stacked frames, hot args, hot return, 2 notable dots) and theory-10/12/14 (no regression, zero undefined). Committing submodule then course.
- Start: 2026-07-29 13:54 | Task: P4 - level-2 heap cards + reference arrows + explicit null. New HeapCardsView panel (frames with primitives inline + refs as dots + null; heap object cards; derived bezier arrows), reproject theory-16 References vs values onto it, dark skin, verify, commit.
- End: 2026-07-29 14:04 | Result: Built the level-2 HeapCardsView panel (self-contained: running frame's locals on the left - primitives inline, references as dots, explicit null in red - and heap objects as cards on the right, joined by derived bezier reference arrows redrawn on resize). Added PanelType "heapcards", the memory-viz factory entry, a pure slotKind classifier (empty/null/ref/value) with 4 unit tests (113 total), and the panel CSS. Reprojected theory-16 References vs values onto layout [code, heapcards] (dropped board/addresses; kept value-copy count/b and reference-copy pet/friend; added an explicit Dog stray = null step; 8 steps). Added the [data-theme=dark] skin for the panel in course styles.css, reusing the die-view dark palette (verified computed: panel #14171d, card #122a24, null #f2777a, hot #2e2410). code-lab: typecheck clean, 113 tests, build ok, re-vendored. Headless-verified theory-16: step0 empty heap + value box, step1 Dog card + 1 arrow, step5 two names one Dog (2 arrows + glow), step6 explicit null row; 0 undefined throughout.
- Start: 2026-07-29 14:11 | Task: P5 round 1 - the generated-trace track. P5a: a pure trace contract (ExecTrace/TraceStep) + traceToSteps adapter that maps a generated trace onto the same Step[] the hand-authored scenes use (derived hot/hotFields, incremental printed). P5b: a real Roslyn source-instrumentation TracerService in the compiler-host that captures locals + heap + stdout per statement, verified with real dotnet, wired through the iframe runner (Trace JSInvokable + coderunner:trace + client trace()).
- End: 2026-07-29 14:26:34 | Result: Shipped P5 round 1 - the generated-trace track, end to end. (1) exec-tracer-model.ts: the wire contract (ExecTrace/TraceStep/TraceFrame/TraceVar/TraceObject) plus a pure traceToSteps(trace) adapter that maps a generated trace onto the same Step[] the hand-authored scenes use - pc=line-1, value/ref slots (id ${frame.id}:${var.name}), hot and hotFields DERIVED by diffing consecutive steps (animate-only-what-changed for free), incremental printed from cumulative stdout, honest narration from the source line. Added Step.printed; barrel exports; 10 unit tests (123 total). (2) Tracer.cs: a real Roslyn source-instrumentation tracer in the compiler-host - a semantic-model pass computes the in-scope, definitely-assigned locals to snapshot after each statement (AnalyzeDataFlow + LookupSymbols), a CSharpSyntaxRewriter injects __CLTrace.Enter/Step/Leave hooks (Enter/try-finally-Leave per method; Begin/Enter...Leave for top-level statements), and a reflection-only injected runtime records line + shadow call stack + object->id heap + cumulative stdout as ExecTrace-shaped JSON. Verified with a real dotnet console harness on 6 programs (value flow, loop counter reuse, two-frame method call, heap object with field mutation + explicit null, top-level statements, inline List) and cross-checked the real JSON back through traceToSteps (hotFields on Name then Age, ref slot, null, printed delta). (3) Wired through the runner: RunnerBridge.Trace JSInvokable + CompilerService.References; coderunner:trace/traceResult relay in the host index.html; RoslynIframeRunner.trace(code): Promise<TraceOutcome>. code-lab: typecheck clean, 123 tests, host builds (0 warn/0 err), bundle built + re-vendored (traceToSteps + coderunner:trace present). Deferred to round 2: the "Visualize my code" lesson UI surface, predict-then-reveal engagement, and expression substitution.
- Start: 2026-07-29 14:40 | Task: P5 round 2 - the "Visualize my code" learner surface + make the visualizer reusable in place. Build a VizLab surface (Monaco + runner.trace() + traceToSteps + MemoryViz) with a Values/Call stack/Heap level toggle, and give MemoryViz a real setSteps() so the surface re-renders without destroy+recreate (preserving the learner's step on a level toggle).
- End: 2026-07-29 15:23:37 | Result: Shipped P5 round 2. (1) MemoryViz.setSteps(steps, {code?, layout?, preserveIndex?}): the widget can now be re-fed a scene in place - extracted the panel build loop into idempotent buildPanels() + a wireControls() helper, stored the reusable pieces as fields (buildCtx, layout, handlers, columns, steps, deriveRefs, autoDim), and made player/layout reassignable; the constructor now composes through the same two helpers (no behaviour change for the 40+ existing scenes). setSteps rebuilds the player + panels and re-seeks, keeping the current step index by default. (2) viz-lab.ts: the "Visualize my code" surface - pure composition of MonacoEditor + RoslynIframeRunner.trace() + traceToSteps + MemoryViz, with a Values/Call stack/Heap toggle that now reuses the live widget via setSteps (a new trace resets to step 1; a level toggle preserves the learner's place). Barrel exports (VizLab, VizLabConfig, VizLevel) + a .cl-vl block. (3) visualize.html: a bespoke page (window.PAGE={hero,prefix:"vl"}, no archetype) that mounts VizLab against level3-app. Verified: typecheck clean, 123 tests, build + re-vendor; published the WASM host locally (level3-app) and browser-verified end to end with real Chrome - Monaco mounts, warm-up enables Visualize, a heap program traces (Dog card mutates Name then Age, reference arrow present, printed delta), and toggling Heap->Values->Call stack->Heap all hold STEP 4/5 (position preserved). Regression: theory-16/13/10 and ai-1 still render, 0 undefined. Code-reviewed (no significant findings). Deferred: how to surface it on the index (playground vs lesson card), predict-then-reveal, expression substitution.

- Start: 2026-07-29 15:35 | Task: P5 round 3 - fix the four (then five) tracer limitations found by testing a learner's own interface/class program in visualize.html: (1) the last real statement lost its narration to the "finished" label, (2) constructors were not instrumented, (3) expression-bodied members were not stepped into, (4) private fields were hidden on heap cards, and (5) a method whose body is a single return was never seen from the inside.
- End: 2026-07-30 09:04:09 | Result: Fixed all five, verified against real dotnet + real Chrome. (1) exec-tracer-model.ts: dropped the i===last "finished" override so every real step narrates its own line, and append one synthetic terminal step that repeats the end state (no hot flags, no printed, pc=-1) narrated "The program has finished." (or "Stopped early..." when trace.truncated) - N real steps now render as N+1. Updated the adapter tests (single-step -> 2, last-line keeps its narration, added a truncated-note test; 124 total). (2)(3) Tracer.cs: a BodyNormalizer : CSharpSyntaxRewriter pre-pass converts expression-bodied methods and constructors to block bodies (void/ctor -> ExpressionStatement, non-void -> ReturnStatement, throw-expr -> ThrowStatement), moving the arrow's leading trivia onto the open brace and the semicolon's trailing trivia onto the close brace so newline count - and therefore every reported line number - is preserved; analysis/model/BuildPlan/Instrumenter now run on the normalized tree. Added Instrumenter.VisitConstructorDeclaration (Enter("new "+Type)/try-finally-Leave). (5) VisitBlock and VisitCompilationUnit now place the Step hook BEFORE a control-transfer statement (return/throw/break/continue/goto/yield) instead of after, so a one-line "=> _value" method is captured from inside (the post-return hook was dead code). (4) runtime Members(): added BindingFlags.NonPublic to the fields loop and skip compiler-generated backing fields (name starts with '<'), so private fields like _value show on the card while auto-properties do not duplicate. Verified on the learner's exact program: 5 rendered steps - step 1 enters "new Fake" (param value), step 2 the assignment, step 3 enters "Test", step 4 keeps the WriteLine narration, step 5 finished; the Fake card shows _value="Hello World"; Main's lines stay 20/21 (no shift). Regression sweep (values/heap/method-return/loop break+continue/throw-expr-body) all correct; code-lab typecheck clean, 124 tests, host builds 0 warn/0 err, bundle re-vendored, WASM host republished to level3-app, browser-walked all 5 steps.

## 2026-07-30 10:27 CEST - decoupling code-lab into a reusable package (A1-C)
- start: making the code-lab submodule reusable (npm package + separately-shippable WASM backend) with no hidden coupling to this course. Nine fixes: A1 css token scope, A2/A3 xp/label callbacks, A4 quiz store/keys, A5 monaco doc, B1 package docs, B2 host de-brand, B3 runner rename+alias, C vizlab language. Course-side page-shell wiring keeps the live course working. Local only, no push.
2026-07-30T10:28:15+02:00 - START Task B1/B2 code-lab host de-branding and backend docs
2026-07-30T10:28:57+02:00 - END Task B1/B2 code-lab host de-branding and backend docs
- end (2026-07-30 10:47 CEST): shipped all nine decoupling fixes with the live course kept working, verified end-to-end.
  - A1 code-lab.css: moved the --cl-* design tokens off `.cl-root` onto `:where(.cl-root,.cl-mv,.cl-vl,.cl-quiz)` (specificity 0) so each widget is self-styled when mounted without a .cl-root wrapper; layout stays on .cl-root. Fixes a latent bug (the course mounts .cl-mv/.cl-quiz bare and never defined the tokens).
  - A2/A3 widgets stop reaching for the course: MemoryViz and Quiz no longer do getElementById("courseXpLabel") or print "Course XP:"; they call an optional config.onXpChange(xp). VizControls end-button text is a config nextLabel (neutral default "Next"). Config interfaces (memory-model.ts, quiz-model.ts) gained onXpChange; MemoryViz gained nextLabel.
  - A4 store seam + neutral keys: quiz-view localStore now routes through the injected KeyValueStore (default globalThis.localStorage); library default xpKey changed "course_global_xp" -> neutral "codelab_xp" for both Quiz and MemoryViz.
  - A5 load-monaco: fixed the doc-drift comment (said jsDelivr, uses cdnjs) and named a MONACO_VERSION const; behaviour unchanged.
  - B1 package.json prepublishOnly + README "Backend (runner)" section documenting the WASM host as a separate deliverable and the coderunner:* wire.
  - B2 de-brand compiler-host: static <title> -> "Code Lab"; awardXp postMessage type "level3-xp" -> "codelab:xp" and origin "*" -> window.location.origin; NavMenu shows @Exercise.Title via injected IExercise instead of the hardcoded "Level3Capstone".
  - B3 runner rename: RoslynIframeRunner -> IframeRunner (config too), with back-compat aliases kept and both exported, so the course's CodeLab.RoslynIframeRunner keeps working.
  - C VizLabConfig gained optional language (default "csharp").
  - Course compensation (page-shell.js): when mounting the widgets it injects xpKey:"course_global_xp", nextLabel:"Next lesson >", and onXpChange (updates #courseXpLabel) into LESSON_VIZ, and xpKey:"course_global_xp" + onXpChange into QUIZ_CONFIG - the course coupling now lives in the course, not the library.
  - Verified: code-lab typecheck clean, 124 tests pass, bundle rebuilt + re-vendored (js+css), WASM host republished to level3-app. Browser-walked visualize.html (both runner names are live functions, --cl-* tokens resolve on the bare .cl-vl, a real trace of the interface/class program steps into the ctor and Test() across 5 steps), a full theory-check-1 pass (wrote course_global_xp=40 through the seam, hero label updated via callback), and ai-14 viz injection. code-review agent: no significant issues. Local only, no push.

## 2026-07-30 11:00 CEST - generic theme token contract + Critters theme
- start: tokenize the code-lab widget surfaces so a theme sets a bounded set of scene tokens instead of repainting ~106 elements; refactor the dark theme onto the contract; author Critters; update the theme-authoring skill.
- end (2026-07-30 11:24 CEST): shipped the widget theme token contract. Tokenized `code-lab/src/code-lab.css` (MemoryViz `--mv-*`, Quiz `--clq-*`, AI fan `--ag-*`) with per-site `var(--token, <original-hex>)` fallbacks so the default theme stays pixel-identical while a theme skins by setting tokens. Refactored the dark theme from ~106 override rules to compact token-assignment blocks. Added a warm Critters widget skin (the page theme already existed). Rebuilt code-lab (typecheck clean, 124 tests) and re-vendored css (js byte-identical). Verified headless across default/dark/critters on the level-0 vartable, level-2 heapcards, the Quiz (all option + result states) and the AI fan; WCAG AA on new Critters pairs (bumped name-ink + ag-val-ink to var(--info-ink)). Updated the theme-authoring skill (token-contract section) and copilot-instructions (theme pointer). Local only, no push.

## 2026-07-30 13:37 CEST - execution visualizer redesign (memory + statics + layout)
- start: act on five UX complaints on the "Visualize my code" surface - top/bottom controls too far apart, unify Stack+Heap into one Memory section, add globals/constants, see memory and call stack at once, and keep the top of long code in view.
- end (2026-07-30 13:37 CEST): shipped the redesign. Tier A (no compiler change): VizLab levels are now Memory (the heapcards view: frames + heap + statics together) and Simple values, with Memory the default and back-compat normalization for old callstack/heap level names; the code panel auto-scrolls the active line into a scrollable list so long programs keep the running line visible. Tier B (Roslyn tracer): __CLTrace.Snapshot now emits statics and consts via reflection over the emitted assembly, mapped through exec-tracer-model to globals/rodata, and heapcards-view renders a STATICS/CONSTANTS band above the frames (hidden when empty). Course: dark theme gained a .cl-vl skin (the unselected level chip was dark-on-dark; fixed via the dual-role --cl-ink pattern, all pairs >= 4.5:1) and the visualize.html intro now names the Memory / Simple values levels. Rebuilt code-lab (typecheck clean, 124 tests), re-vendored js+css, republished the WASM host. Headless e2e against the live tracer: the user's ITest/Fake program now steps new Fake -> Main -> Test with _value="Hello World", and a Counter program shows STATICS Counter.Total=2 + CONSTANTS Counter.Max=10; verified across default/dark/critters. Local only, no push.

## 2026-07-30 13:58 CEST - visualizer follow-up: drop the toggle, one code surface
- start: two usability problems the redesign left behind - the Memory/Simple values toggle was really "everything vs a strict subset" (Simple values is redundant now that Memory shows the call stack + heap together), and the code was shown twice (the editor plus a duplicate CODE panel).
- end (2026-07-30 13:58 CEST): removed the level toggle - VizLab now always shows the one full memory view (call stack + heap). Killed the duplicate code panel: MemoryViz gained an onStep callback and the Monaco wrapper a highlightLine(line) that paints a whole-line decoration + gutter bar and reveals the running line, so VizLab drops the code panel and highlights the line in the editor itself (code shown once). Renamed the heapcards caption to name the call stack ("the call stack on the left, objects on the heap on the right") so the stack no longer reads as "just names". Removed the now-dead level-chip CSS (code-lab + the dark-theme chip fix). Updated the visualize.html intro. Rebuilt code-lab (typecheck clean, 124 tests, build), re-vendored js+css (no compiler-host change, so no republish). Headless e2e across default/dark/critters: 0 toggle elements, 0 duplicate code panels, the editor highlights the running line (verified the teal decoration on line 12 while narration says "Running this line: public string Test() => _value;"), frames step new Fake -> Main -> Test. Local only, no push.

## 2026-07-30 14:05 CEST - visualizer: start the trace in Main
- start: when Main's first statement instantiates an object, the first shown step landed inside the constructor (`_prices = prices;`) instead of on the `new Cart(...)` line in Main - the trace never "started in Main".
- end (2026-07-30 14:15 CEST): fixed in the Roslyn tracer (`code-lab/compiler-host/Services/Tracer.cs`). The tracer used a post-execution snapshot model (Step emitted after each statement), so running Main's first line fully entered the constructor before Main's own snapshot fired. Added an entry snapshot: `__CLTrace.Enter(name, line)` now records the fresh frame at the body's first line, and the Instrumenter passes that line for methods, constructors and top-level statements (new `EnterCall`/`FirstBodyLine` helpers). The call stack now visibly grows at each call and the trace starts in Main. Verified offline (console harness dumping raw steps) and end-to-end headless against the republished WASM host: the Cart/PriceList program now steps Main -> new Cart -> Main -> Total -> PriceOf -> Main, step 1 highlights the `new Cart(...)` line in Main (editor line 27) and step 2 the constructor (line 14); the ITest/Fake program starts on the `new Fake(...)` line in Main too. typecheck clean, 124 tests pass; C#-only change so no re-vendor. Republished level3-app locally (git-ignored, CI regenerates on deploy). Local only, no push.

## 2026-07-30 14:35 CEST - visualizer: label call frames + animate the stack
- start: three clarity/animation requests on the "Visualize my code" surface - (1) say on each stack frame whether the call is a method, a static function or a constructor, and disambiguate multiple instances of the same object; (2) animate call-stack pushes and pops; (3) label heap objects so it is clear which object is which.
- end (2026-07-30 14:35 CEST): the Roslyn tracer (`code-lab/compiler-host/Services/Tracer.cs`) now emits per-call metadata - a `kind` (entry / method / static / ctor), the receiver instance label (`recv`, e.g. "Clock #1", skipped for value types), and a per-type instance number (`no`) memoized by object identity so the same object reads "#1" whether shown as a heap card or as a frame's receiver. Threaded `kind`/`recv`/`no` through `exec-tracer-model.ts` and `memory-model.ts` (+2 adapter tests). Rewrote `heapcards-view.ts` to reuse the existing keyed `reconcile` helper for both frames and heap objects (so pushes/pops use the existing `.enter`/`.leaving` keyframes) and to render a kind badge (ENTRY POINT / INSTANCE METHOD / STATIC METHOD / CONSTRUCTOR), an "on <Type> #n" receiver line, and a "#n" on each object card; the roots column is `column-reverse` so a pushed frame animates in at the top. CSS added to `code-lab/src/code-lab.css` reusing already-themed tokens (`--mv-name-ink`, `--mv-cool-*`, `--mv-hot-*`) so dark and critters needed no new mappings. Rebuilt code-lab (typecheck clean, 126 tests, build), re-vendored js+css, republished the WASM host (tracer changed). Headless e2e on a two-instance Clock/Greeter program across default/dark/critters: frames show entry point / constructor / instance method / static method, receivers read "on Clock #1" vs "on Clock #2", static Greet has no receiver, heap cards show #1/#2, and stack push/pop animates. Local only, no push.

## 2026-07-30 14:49 CEST - visualizer: caller call-site line + live arrow redraw
- start: two follow-ups on the "Visualize my code" surface - (1) when execution jumps from a caller into a callee (e.g. Main into a constructor), the caller's frame box should show the line it is paused on (the call site); (2) when frames or objects animate out, the reference arrows stayed frozen at their old positions until the next step was pressed.
- end (2026-07-30 14:49 CEST): (1) the Roslyn tracer (`Tracer.cs`) now records each frame's current line - a cheap `At(line)` mark is injected before every instrumented statement so a caller frame carries its call-site line while a callee runs, and `Enter` seeds a new frame's line; `Snapshot` emits a per-frame `line`, threaded through `exec-tracer-model.ts` and `memory-model.ts` (Frame.line) into `heapcards-view.ts`, which shows "paused at line N" on caller frames only (the active frame's line is already lit in the editor). (2) `heapcards-view.ts` now reuses arrow `<path>` elements across renders keyed "from->to" (updating each path's `d` in place instead of clearing and re-adding) and runs a ~340ms requestAnimationFrame redraw loop after each step so the arrows stay glued to their dots through the enter/leave animation and the reflow when a frame pops; a generation counter cancels a stale loop when a newer step starts. Rebuilt code-lab (typecheck clean, 126 tests incl. a new per-frame-line assertion, build), re-vendored js+css, republished the WASM host (tracer changed). Headless e2e on the Greeter/Clock program: inside `new Clock` the Main frame shows "paused at line 32" (`Clock clock = new Clock(9);`), and nested calls show Main@33 / Greet@18; a probe sampling arrow geometry across the pop window confirmed the paths move mid-animation (y 283->208) and settle, instead of freezing. Verified default + dark (paused line reuses the already-themed --mv-name-ink, so no new theme work). Local only, no push.

## 2026-07-30 15:25 CEST - visualizer: editor beside the memory view (compact layout)
- start: the code editor was full width but the code only needs ~70-80 columns, leaving a lot of empty horizontal space while the memory view sat far below - a taller, less compact surface than needed.
- end (2026-07-30 15:25 CEST): on wide screens (>= 1240px) the "Visualize my code" surface now places the editor and the live memory picture side by side instead of stacked. CSS-only, in the VizLab block of `code-lab/src/code-lab.css`: `.cl-vl` becomes a two-column grid `minmax(0, 43rem) minmax(33rem, 1fr)` (the editor capped near 80 monospace columns, the memory view taking the rest), and in that narrower right column the MemoryViz drops to one column (`.cl-vl-stage .cl-mv { grid-template-columns: 1fr }`, aside un-stuck) so the call stack + heap sit on top and the narration + transport controls below. Below 1240px it keeps the original stacked layout (editor over the full-width, two-column memory view), so nothing regresses on laptops/tablets. Rebuilt code-lab (CSS copied verbatim to dist) and re-vendored js+css; no compiler-host change, so no republish. Headless screenshots: at 1500px the editor is 688px (~80 cols) beside a 649px memory column with the call stack + heap in parallel and controls below; at 1280px the memory column holds at its 528px min with the arrows intact; at 1100px it falls back to stacked. Verified default + dark (no glare, arrows visible). Local only, no push.

## 2026-07-30 15:32 CEST - visualizer: controls pinned to the bottom, memory grows
- start: on the wide side-by-side layout the transport controls sat right under the memory picture, so the call stack + heap could not use the full height of the right column while the taller editor left empty space beside them.
- end (2026-07-30 15:32 CEST): CSS-only change to the `@media (min-width: 1240px)` block in `code-lab/src/code-lab.css`. `.cl-vl` now stretches its row (`align-items: stretch`) so the right column fills the height set by the taller editor; `.cl-vl-stage` becomes a flex column and the MemoryViz inside it (`grid-template-rows: minmax(0, 1fr) auto`) puts the MEMORY panel in a growing top row and pins the narration + transport controls to the bottom `auto` row. The MEMORY panel fills its grown row via flex (`.cl-mv-visual { min-height: 0; display: flex; flex-direction: column }`, `.cl-mv-heapcards { flex: 1 }`), giving the call stack and heap room to grow as the program runs deeper. Rebuilt code-lab (CSS copied verbatim to dist) and re-vendored js+css; no compiler-host change, so no republish. Headless e2e at 1500px (default + dark): the aside bottom now aligns with the editor bottom (both at 1015px), the memory panel grew from ~250px to 378px, and the controls sit in the lower part of the right column; at 1100px the layout still falls back to stacked (editor over the two-column memory view), so nothing regresses. Local only, no push.

## 2026-07-30 15:48 CEST - visualizer: show what the program prints (console panel)
- start: on the "Visualize my code" surface, stepping over `Console.WriteLine(animal.Speak())` lit the line and grew the stack, but the printed text appeared nowhere - the learner never saw what landed in the console, so the program's actual result was invisible.
- end (2026-07-30 15:48 CEST): added a CONSOLE panel to the visualizer. The Roslyn tracer already captured stdout and the adapter already derived the per-step delta (`Step.printed`), but nothing rendered it - the data fell on the floor at the last mile. Wired it up render-only (no Tracer.cs change, so no republish): the adapter now also carries the cumulative transcript on each step (`Step.output`, plus on the appended "program finished" snapshot) so the panel is stateless across back/seek; a new `ConsoleView` (`src/dom/console-view.ts`, a `console` panel type registered in `memory-viz.ts`) shows the whole transcript for the current step and highlights just the line printed this step; VizLab's layout now places it in the reading rail between the narration and the transport controls, so "this line runs" and "this is what it printed" read together. Styled as an intentionally dark terminal "device" surface (`.cl-mv-console`), which - like the RAM die and board - reads on any theme without a per-theme override; the fresh line is highlighted mint-green. Extended the adapter test to assert cumulative `output` per step and on the terminal snapshot (typecheck clean, 126 tests, build, re-vendor js+css). Headless e2e on the interface/Cat/Dog program across default/dark/critters: the console starts "Nothing printed yet.", shows `Meow` highlighted the moment `Console.WriteLine(animal.Speak())` runs (step 5, line lit in the editor), keeps it while stepping, adds `Woof` highlighted at step 9, and the finished-program step retains the full transcript. Local only, no push.
