# Theory track - lesson index

Every lesson in the Theory track, in live `index.html` path order, grouped by
Part. Each row links to its full audit report and gives a one-line summary. See
[README.md](README.md) for the cross-track findings and cycle plan, and
[infrastructure.md](infrastructure.md) for the shared engines.

Every shipped `theory-N.html` loads the `theory-N.viz.js` visual widget. The
sibling `theory-N.js` drill files are on disk but not loaded - see each report
and the infrastructure findings.

## Part 1 - What a computer is

| Lesson | Report | One line |
|---|---|---|
| What a program is | [theory-1.md](theory/theory-1.md) | A computer follows tiny exact instructions in order; a program is an ordered list acting on data. |
| How a program runs | [theory-2.md](theory/theory-2.md) | Loaded storage-to-RAM, the CPU's fetch-execute loop, the program counter, jumps. |
| What starts a program | [theory-3.md](theory/theory-3.md) | The OS launches it, a loader copies it in, execution begins at the `Main` entry point. |
| Running many programs at once | [theory-4.md](theory/theory-4.md) | A running program is a process; the OS time-shares one core, the scheduler picks next, cores add real parallelism. |
| How computers store everything as numbers | [theory-5.md](theory/theory-5.md) | Everything is numbers built from bits; binary; each extra bit doubles the range. |
| Text, images, and sound as numbers | [theory-6.md](theory/theory-6.md) | Agreed encodings: characters to numbers, pixels as RGB, sound as samples. |
| The operating system's bigger job | [theory-7.md](theory/theory-7.md) | Files, folders and paths, permissions on open/save, mediating hardware devices. |
| Part one checkpoint | [theory-check-1.md](theory/theory-check-1.md) | Graded review of Part 1; draws 5 of 9 questions, 40 XP on a pass. |

## Part 2 - How code works

| Lesson | Report | One line |
|---|---|---|
| What a programming language is | [theory-8.md](theory/theory-8.md) | Human-friendly words and rules a tool translates into the CPU's numeric machine code. |
| Variables | [theory-9.md](theory/theory-9.md) | A named slot in memory holding one value; read and write; a slot holds one value at a time. |
| Types | [theory-10.md](theory/theory-10.md) | Every value has a kind that decides what you can do; the compiler stops a misuse before running. |
| Statements and expressions | [theory-11.md](theory/theory-11.md) | A statement is one step; an expression produces a value; assignment stores it. |
| Decisions and repetition | [theory-12.md](theory/theory-12.md) | A condition is a yes/no question; `if`/`else` picks a branch; a loop re-checks and repeats. |
| Functions | [theory-13.md](theory/theory-13.md) | A named bundle of reusable steps; a call pushes a frame; arguments arrive as locals. |
| Bugs: why programs go wrong | [theory-14.md](theory/theory-14.md) | The computer did what you wrote, not what you meant; syntax error vs logic error. |
| Part two checkpoint | [theory-check-2.md](theory/theory-check-2.md) | Mixed review of Part 2; draws 5 of 10 questions. |

## Part 3 - How software runs and connects

| Lesson | Report | One line |
|---|---|---|
| Where data lives | [theory-15.md](theory/theory-15.md) | Program copied storage-to-RAM; RAM as numbered slots split into code/rodata/data/stack/heap regions. |
| References vs values | [theory-16.md](theory/theory-16.md) | Value types hold the data in their bits; reference types hold an address to an object on the heap. |
| The build-and-run cycle | [theory-17.md](theory/theory-17.md) | Compile time (checks, build errors) vs run time; compiled vs interpreted vs in-between. |
| Saving data | [theory-18.md](theory/theory-18.md) | RAM is wiped at exit, so save to a file; on disk a file is an inode plus a separate name. |
| Programs that talk | [theory-19.md](theory/theory-19.md) | Client asks, server answers; a request gets a response back into memory. |
| Part three checkpoint | [theory-check-3.md](theory/theory-check-3.md) | Review of Part 3: where data lives, value vs reference, compile vs run time, files, networking. |

## Part 4 - The development world

| Lesson | Report | One line |
|---|---|---|
| Standing on other code | [theory-21.md](theory/theory-21.md) | You do not write everything; libraries and dependencies are code others wrote that you build on. |
| How code is shared | [theory-20.md](theory/theory-20.md) | Version control keeps a history of changes so many people can work on one codebase. |
| Part four checkpoint | [theory-check-4.md](theory/theory-check-4.md) | Review of Part 4: dependencies/libraries and version control. |
