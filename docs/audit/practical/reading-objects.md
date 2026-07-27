# Reading Objects (`reading-objects.js`)

- **Track / Part:** Practical - Part 1 Understand the ideas
- **Engine / format:** drill-engine (fill-in-the-blank) with per-drill Run button
- **Difficulty pill:** Steady  **XP cards (data-total):** 10
- **Runnable:** yes (index-aligned complete programs; `runnerUrl` set)  **Theme:** neutral (`Clock`, `Cart`, `Checkout`, `Mailer`, `Worker`)

## Concept(s) taught
Object collaboration intuition - one object asks another and acts on the
answer. It quietly seeds Single Responsibility (one job per method/class) and
Dependency Inversion (receive collaborators, do not build them) without naming
SOLID, so those ideas feel familiar when they arrive later.

## Card-by-card
| # | Card title | Concept | What the learner does |
|---|---|---|---|
| 1 | Two Objects Talk | Objects collaborate | Call `clock.Hour()`; build a `Clock`. |
| 2 | Ask Another Object For Data | Delegation | Call `PriceOf` and `Total`. |
| 3 | A Method That Does One Thing | One job per method | Return `width * height`. |
| 4 | Spot The Second Job | One reason to change | Finish a method doing maths + wording. |
| 5 | Extract The Job Into A Method | Separate the jobs | Call the extracted `FormatReceipt`. |
| 6 | Extract The Job Into A Class | Separate the jobs | Build `ReceiptFormatter`, call `Format`. |
| 7 | Same Name, Two Classes | The object decides | Build a `Circle`, call `Area`. |
| 8 | Use What Is Handed In | Receive, don't build | Use the injected `Outbox`; build one to pass in. |
| 9 | Trace The Output | Read before you run | Predict a counter after three `Add`s. |
| 10 | Wire Two Objects And Run | Put it together | Wire `Worker` + `ConsoleLog`, then Run. |

Snippets are display fragments (they use `public static void Main()` after type
declarations, which will not compile standalone); each drill is paired with a
complete `class Program` in `runnablePrograms` that the Run button executes.

## Prerequisites
Assumes classes, methods, fields, and constructors from Part 1. The file states
it is a bridge between the `level1-coding` micro-drills and the later SOLID
work.

## Complexity rung
Steady - the step up from `level1-coding` is reasoning about collaboration and
single responsibility rather than typing one token. The arc builds
deliberately: collaborate -> delegate -> one job -> spot the second job ->
extract to method -> extract to class -> the object decides -> injection ->
trace -> wire and run.

## Covered well
- A coherent narrative that earns SRP and DI by feel before naming them.
- Every drill is runnable, and the final drill explicitly ends with "press Run".
- Plain voice; each `explain` ties the blank back to the collaborating object.

## Gaps / issues
- Untaught syntax used freely: `=>` expression-bodied members (drills 1-10),
  the `?:` ternary (drill 1's `Greet`), and `_count++` (drill 9). The `explain`
  steps do not unpack `=>` or `?:`.
- **Snippet vs runnable mismatch:** snippets show `public static void Main()`
  under class declarations, while the runnable versions use `class Program {
  static void Main() }`. The display form would not compile as written - fine
  for a teaching fragment, but worth noting.
- No recap/summary card to name the SRP/DI ideas it seeded.

## Verification status
Read-only content audit. Prior work-log entries record dotnet verification of
the runnable programs and the shared Roslyn runner path.
