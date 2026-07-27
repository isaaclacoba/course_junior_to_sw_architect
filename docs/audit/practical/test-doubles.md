# Test doubles (`test-doubles.js`)

- **Track / Part:** Practical - Part 5 Prove it works
- **Engine / format:** build-engine (write-from-scratch)
- **Difficulty pill:** Steady  **XP cards (data-total):** 3
- **Runnable:** yes (compiles and runs each solution)  **Theme:** test-automation (clock, price feed, mailer)

## Concept(s) taught
The three common test doubles: a fake (fixed working behaviour), a stub (returns
data you choose), and a spy (records how it was used). Each is a stand-in you
inject in place of a real dependency so a test is fast, repeatable, and under
your control. Builds directly on injection from Part 4.

## Card-by-card
| # | Card title | Concept | What the learner does |
|---|---|---|---|
| 1 | Fake a shaky dependency | A fake | Write `FixedClock : IClock` whose `Hour()` returns `9`; inject into `Greeter`. Gates: `class FixedClock : IClock`, `return 9`. No `verify`. |
| 2 | Feed it canned data | A stub | Write `StubFeed : IPriceFeed` whose `Price()` returns `10`; check `Cart.Total(3) == 30`. Gates: `class StubFeed : IPriceFeed`, `return 10`. No `verify`. |
| 3 | Spy on the call | A spy | Write `SpyMailer : IMailer` with a public `bool WasCalled` set by `Send()`; check `Signup.Register` called it. Gates: `class SpyMailer : IMailer`, `WasCalled = true`. No `verify`. |
| - | Test doubles - recap | Recap | Summary card (not counted). |

No hidden `verify` probes; each card is graded by two `requireSource` gates
(the `: Interface` shape and the tell-tale body line) plus output-match. The
class under test (`Greeter`/`Cart`/`Signup`) is given, so the double is the only
thing the learner writes.

## Prerequisites
Assumes interfaces, constructor injection, and depending on `IAnimal`-style
promises (Why abstract?, Why inject?), plus AAA and `PASS`/`FAIL` from What a
test is. Card 3 uses a public `bool` field on the double.

## Complexity rung
Steady but light (three cards). Each card is one kind of double, and all three
share the same "given class + written double + `PASS`/`FAIL` check" shape, so the
steps are small. The step from What a test is: controlling a dependency rather
than testing a self-contained value.

## Covered well
- **Best-formatted prose in the set.** Each `context` leads with the plain
  problem, then a **bold** concept name, then two contrast bullets (real
  dependency vs. the double) - the Part 5 structure, rendered by build-engine's
  paragraph/bullet/`**bold**` support.
- Card 3 names `Signup.Register` so the class under test is explicit.
- The recap explicitly credits injection ("the payoff of that earlier work") and
  ties doubles back to depending on an interface.
- Example boxes use unrelated subjects (`FakeRandom`, `StubFeed`/`IFeed`, `SpyLog`).

## Gaps / issues
- **No `verify` probes.** The given class under test does the real work and the
  gates check the double's shape, so the exposure is smaller than in Part 4, but
  a double that hardcodes the passing value could still satisfy some cards.
- `var` and the ternary `?:` (in the given `Main`) are used untaught.
- The public mutable field (`public bool WasCalled`) is idiomatic for a spy but
  runs against the encapsulation habit taught in Why objects? - worth a note for
  the learner that this is intentional for a test double.

## Verification status
Read-only content audit only (no compile). Prose structure, gates, and expected
outputs read for consistency.
