# git-inside-names-that-move - design of record

Brief: [git-inside-names-that-move.md](../plans/git-inside-names-that-move.md). Decisions: `node tools/journal.mjs show git-inside-names-that-move`.

Part two of the `git-inside` theory track. Lessons 6-9 cover: the ref file (L6), `HEAD` symbolic and detached (L7), the index (L8), immutability via amend and reset (L9).

## Lessons and their questions (D-1 to D-6, D-9, D-10)

| # | Title | Owns | Acts used | Cards |
|---|---|---|---|
| 6 | Why is making a branch instant? | a ref is a file holding one id | `name` (existing) | 4-6, plus annotated tag intro |
| 7 | How does git know where you are? | `HEAD` names a ref, or holds an id (detached) | `switch`, `detach` | 5-7, plus reflog intro |
| 8 | What is the staging area, as a file? | the index maps paths to blob ids | `store` (existing) | 4-6, plus config intro |
| 9 | Does editing a line change anything git kept? | objects are immutable; names move | `amend`, `reset` | 6-8, gc mention |

**Prose sequencing** (decisions): L6 ref opens with full path before numeric detail (D-1); L7 opens symbolic mode before detached (D-2); L8 opens by fulfilling L3's promise (D-3); L9 shows both amend and reset (D-5). Index entry fields are mode, blob id, path only - stage number omitted (D-4). gc gets one sentence (D-6).

**Coverage added** (D-9, D-10): reflog, config, annotated tags - each gets one intro card in the lesson whose concept it extends, no detail. Reflog and config go in L7 or L8; annotated tags extend L6.

**Part one fix** (D-13): L5 claims "three kinds of object and no more"; this excludes refs, which L6 teaches. Corrected EN+ES before part two ships.

## The four new acts (D-11, D-14, D-15, D-16)

Implemented in `code-lab/src/core/objects-scene.ts` against `ObjectStore` (`code-lab/src/core/git-objects.ts`). No shared core with `git-model.ts` - the two models answer different questions (commit-graph topology vs bytes on disk) and use incompatible hash formats (FNV-1a 7-char vs SHA-1 40-char). Estimated ~90 lines implementation, ~40 lines tests.

```typescript
type Act =
  | ... existing acts
  | { act: "switch"; ref: string }      // repoint HEAD at a different ref
  | { act: "detach"; commitId: string } // write raw id into HEAD
  | { act: "amend"; message: string }   // replace commit, move ref, orphan original
  | { act: "reset"; ref: string; to: string } // move ref backward, orphan what it left
```

**Orphan rendering**: `ObjectStore.reachable()` already walks from refs; unreachable objects get the `cl-ob-orphan` CSS class (greyed, D-15).

**Act contract**: closed discriminated union. Scale by adding cases (`gc`, `fetch`, `clone` for parts 3-4), not by abstraction (D-16).

## What already renders (grounding output 2026-08-07)

The `objects` scene renders refs as files, `HEAD` in both symbolic (`ref: refs/heads/main`) and detached (raw 40-char id) forms, the index as path -> blob id list, and orphaned objects via `reachable()`. L6, L8, and the orphan visuals in L9 need no view work - only the acts that drive them.

## Scope ceiling (D-7, D-8, D-12)

Elementary breadth-over-depth - the owner's governing steer. Part one sets the bar: show the thing exists, one thing it does, then stop. Theory lessons explain git's internals; they do not teach git commands or duplicate practical-track content.

## Out of scope

Annotated tags as a full object type (`tag` added to `ObjectType`) - ~40 lines across 2 files. Marked open in the brief for owner decision.
