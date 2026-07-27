# Saving data (`theory-18.viz.js`)

- **Track / Part:** Theory - Part 3 How software runs and connects
- **Engine / format:** viz widget (`window.LESSON_VIZ`, mounted by `page-shell.js`; no board, stack region relabelled DIRECTORY, heap relabelled THE FILE)
- **Difficulty pill:** Gentle  **XP cards (data-total):** 1
- **Runnable:** no (step-through visual, no Run button)  **Theme:** neutral

## Concept(s) taught
How data survives after a program stops. `RAM` is wiped when the program ends,
so you save to `storage` as a `file`. On disk a file is an `inode` (its bytes
plus metadata - size, permissions, `link count`) and a separate `name` living in
a `directory`. A name-to-inode pointer is a `hard link` (one inode can have
several; deleting is really *unlinking*, and the file is gone when the count
hits `0`). A `soft link` is a different thing - a small file holding a `path`.

## Card-by-card
One `LESSON_VIZ` run of seven steps; no code, region tags relabelled to
DIRECTORY (names) and THE FILE (an inode).

| # | Step | Concept | What the learner does |
|---|---|---|---|
| 1 | RAM wiped, save to storage | persistence | See data leave RAM for disk as a file. |
| 2 | The inode | file = bytes + metadata | See the inode holding bytes, size, permissions. |
| 3 | Name in a directory | names are separate | See a directory entry point at the inode. |
| 4 | Hard link | name-to-inode pointer | See renaming leave the bytes untouched. |
| 5 | Two names | link count | See a second hard link; count becomes 2. |
| 6 | Unlink | deleting removes a name | See the count drop; file gone only at `0`. |
| 7 | Soft link | shortcut holding a path | See a symlink that breaks if the target moves. |

## Prerequisites
Builds on [theory-15.md](theory-15.md) (RAM is volatile, storage persists) and
the Part 1 storage idea (see [theory-2.md](theory-2.md)). No syntax; all terms
(inode, hard link, soft link, link count) introduced here.

## Complexity rung
Denser than its intro suggests: inodes, directories, hard vs soft links, link
counts, and unlinking are a full filesystem model. Each is shown one step at a
time, but this is more than the "save a file" framing promises.

## Covered well
- Reframes deletion as unlinking, which explains the otherwise-odd link count.
- Clear separation of the file (inode) from its name (directory entry).
- Terse, concrete steps that match the region relabelling.

## Gaps / issues
- **Intro overpromises.** The HTML hero says data leaves RAM "for storage -
  files, then databases," but the viz covers only the filesystem; the source
  comment states plainly "No databases - this lesson is just the filesystem."
  The promised databases content is absent - fix the intro or add the content.
- **Dead sibling file.** `theory-18.js` exists but `theory-18.html` loads only
  `theory-18.viz.js`. Manifest lists both; only the viz is live.
- Hard/soft links are arguably deeper than an absolute beginner needs at this
  point; no in-lesson check.

## Verification status
Read-only content audit (no compile). Inode/link values are display-only.
Confirmed from the HTML that the viz widget is the live lesson.
