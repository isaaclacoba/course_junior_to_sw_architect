# The operating system's bigger job (`theory-7.viz.js`)

- **Track / Part:** Theory - Part 1 What a computer really is
- **Engine / format:** viz widget (`CodeLab.MemoryViz`, mounted by `page-shell.js` from `window.LESSON_VIZ`)
- **Difficulty pill:** Gentle  **XP cards (data-total):** 1
- **Runnable:** no (step-through visual, no Run button)  **Theme:** neutral

## Concept(s) taught
The OS beyond launching programs: it organises raw storage into named `files`,
groups them into `folders` reached by a `path`, checks `permissions` when a
program opens or saves a file, and mediates access to hardware `devices`.

## Card-by-card
One `MemoryViz` run (board + `heap` region standing in for `UFS` storage) showing
files as objects on disk.

| # | Step | Concept | What the learner does |
|---|---|---|---|
| 1 | Storage into files | Files | See raw bytes organised into one named `File`. |
| 2 | Files into folders | Folders / path | See files grouped into a `/docs` tree. |
| 3 | Programs ask the OS | Permissions | See the OS check permissions before opening a file. |
| 4 | Devices go through the OS | Devices | See the OS work a `GPIO` device on a program's behalf. |

## Prerequisites
Builds on [theory-3.md](theory-3.md) (the OS launches programs) and
[theory-4.md](theory-4.md) (the OS mediates and isolates). Introduces files,
folders/paths, permissions, device I/O.

## Complexity rung
Gentle and concrete - each step is a distinct OS responsibility. The last of Part
1's foundation lessons before the checkpoint.

## Covered well
- Files and folders shown as real objects on the storage die, not just described.
- Permissions and device mediation framed by a concrete reason (one program cannot
  wreck another's files / drive the hardware directly).
- Ties back to the OS role introduced in Lessons 3-4.

## Gaps / issues
- **No closing synthesis step.** Lessons 1-6 each end on a recap/synthesis step;
  this lesson ends on the device-I/O step with no wrap-up tying files, folders,
  permissions and devices together. A brief closing step would match the Part's pattern.
- **Dead sibling file.** `theory-7.js` (`DRILL_CONFIG` with quiz + recap) is not
  loaded by `theory-7.html`; only `theory-7.viz.js` runs. Legacy content to remove
  or reconcile.
- Shortest lesson of the Part (four steps); coverage is fine but leaner than its neighbours.

## Verification status
Read-only content audit (no compile). File objects are display-only. Confirmed from
HTML that the viz widget is the live lesson.
