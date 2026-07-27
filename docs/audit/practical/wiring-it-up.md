# Wiring It Up (`wiring-it-up.js`)

- **Track / Part:** Practical - Part 2 Build it for real
- **Engine / format:** build-engine (write-from-scratch)
- **Difficulty pill:** Steady  **XP cards (data-total):** 6
- **Runnable:** yes (compiles and runs each solution)  **Theme:** neutral ops/test flavour (`Triage`, `AccessControl`, `Countdown`, `Scanner`, `Labeler`)

## Concept(s) taught
Turns the Control Flow theory into hands-on code. Each card takes one
control-flow tool - `if`/`else`, boolean logic, `while`, `for`, `foreach` with
`break`/`continue`, and `switch` - and asks for a small working method.

## Card-by-card
| # | Card title | Concept | What the learner does + gate |
|---|---|---|---|
| 1 | Branch with if / else | `if`/`else` | Map error count to a level. Gate: `if`; verify re-runs `Level(0)` -> `clean`. |
| 2 | Combine conditions | `&&` `||` `!` | Decide access. Gate: `&&` and `||`; verify `Decide(true,15,true)` -> `deny`. |
| 3 | Repeat with while | `while` | Count down then `liftoff`. Gate: `while`; verify from 2 -> `2,1,liftoff`. |
| 4 | Count with for | `for` | Number items 1-based. Gate: `for(` and `.Length`; verify `a,b,c`. |
| 5 | Skip and stop with foreach | `foreach` + `break`/`continue` | Skip/stop over steps. Gate: `foreach`,`continue`,`break`; verify -> `x`. |
| 6 | Map values with switch | `switch` | Label codes over a loop. Gate: `switch` and `foreach`; verify `mid,mid`. |

Every task has both a `requireSource` technique gate (regex on the source) and
a hidden `verify` probe: the engine re-runs the learner's class with a
different `Main` and a different expected output, so a hardcoded answer for the
visible case fails.

## Prerequisites
Assumes Control Flow (the theory lesson) for every construct, plus methods and
string `+` from Methods. It is positioned as a bridge that applies that theory.

## Complexity rung
Steady - a step up from single-blank drills to writing a whole method body, but
each task isolates one control-flow tool. The `example` block in each card shows
the same tool on a different subject, so the learner adapts rather than copies.

## Covered well
- **Best-verified of the Part 1-2 build lessons:** every task pairs a
  `requireSource` gate with a hidden `verify` probe, so both the technique and
  the real (non-hardcoded) logic are enforced.
- One control-flow construct per card, each motivated by a worked example on a
  different subject.
- Plain voice; the `verify.message` explains why the example answer is not
  enough ("banned user must be denied - combine the real flags").

## Gaps / issues
- `$"..."` string interpolation is used in the `for` and `switch` examples and
  solutions (cards 4 and 6) before interpolation is formally taught.
- `var` appears in the hidden `verify` mains and examples, ahead of a dedicated
  lesson - minor, and consistent with the rest of the course.
- Placed in Part 2 while the Control Flow theory it depends on is in Part 1;
  reasonable as a bridge, but the two are separated by other lessons.

## Verification status
Read-only content audit. The built-in `requireSource` + `verify` design gives
strong in-engine checking; prior work-log entries record dotnet verification of
build-engine tasks.
