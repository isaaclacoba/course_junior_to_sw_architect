// Visual for git-a-history-of-snapshots - a DATA-ONLY file, `repo` panel.
//
// The lesson answers one question the practical track cannot: does a commit
// store the CHANGE you made, or the whole folder? The message you type names a
// change, so "a commit is a diff" is the guess almost every learner arrives
// with, and a board of dots does nothing to dislodge it.
//
// The file panel can, because the model carries file CONTENTS. Two things are
// shown that only contents make visible:
//   1. commit 2 was about `dog.txt`, yet reading `cat.txt` at that commit finds
//      it there, whole - so the commit is not the file you added;
//   2. checking out the parent rebuilds the folder from that snapshot, and
//      `cat.txt` reads its older text again - so the commit is not a list of
//      edits replayed backwards.
//
// `cat.txt` sorts first, so the panel opens on it with no click; the steps that
// need `dog.txt` say so in the narration.
//
// File contents are names and times on purpose: `bind-viz` does not localize
// `files` or `commands`, so anything with English words in it would stay English
// after a language switch.
//
// States are replayed through the git runtime the practical lessons type into,
// so this picture and the board in `git-first-commit` cannot drift apart.
(function () {
  "use strict";

  var FILES = [
    { path: "cat.txt", text: "Mia\n07:00" },
    { path: "dog.txt", text: "Rex\n07:30" },
  ];

  var CAT = ['git add cat.txt', 'git commit -m "feeding time for Mia"'];
  var DOG = CAT.concat(['git add dog.txt', 'git commit -m "feeding time for Rex"']);
  var EDITED = DOG.concat(['echo -e "Mia\\n07:00\\n18:00" > cat.txt']);
  var SAVED = EDITED.concat(['git add cat.txt', 'git commit -m "evening meal for Mia"']);
  var BACK = SAVED.concat(['git checkout HEAD~1']);
  var FORWARD = BACK.concat(['git switch main']);

  window.LESSON_CONFIG = {
    // Without this the visual falls back to MemoryViz's default legend, which
    // talks about RAM and CPU cores - furniture from a different lesson.
    legend: [
      { sw: "#2563eb", label: "a commit - one saved snapshot", round: true },
      { sw: "#6366f1", label: "a branch name" },
      { sw: "#111827", label: "HEAD - where you are" },
    ],
    layout: {
      visual: [{ type: "repo" }],
      aside: [{ type: "narration" }, { type: "controls" }],
    },
    steps: [
      {
        narr: "The folder holds two files. Only `cat.txt` was staged, so the first commit holds only that one, with the two lines it had at that moment. `dog.txt` is still sitting in the working tree, unsaved.",
        repo: {
          files: FILES,
          commands: CAT,
          ran: 2,
          note: "One commit. It holds `cat.txt` and nothing else.",
        },
      },
      {
        narr: "Stage `dog.txt` and commit. The message names one file, and one file was staged. Now read `cat.txt` in the panel below: `Last commit` is this new dot, and `cat.txt` is in it. Git wrote down the whole folder - every file it was tracking - and `cat.txt` came along.",
        repo: {
          files: FILES,
          commands: DOG,
          ran: 2,
          note: "This commit was about `dog.txt`. It holds `cat.txt` as well.",
        },
      },
      {
        narr: "Change one line: Mia gets an evening meal. The panel compares the folder's copy with the last commit's and marks a single added row. That row is everything you changed. Watch what git keeps when you save it.",
        repo: {
          files: FILES,
          commands: EDITED,
          ran: 1,
          note: "One added line, in one file.",
        },
      },
      {
        narr: "Stage and commit. One file staged, one line different, and the new dot holds both files again in full. Click `dog.txt` in the panel: `Rex` and his time are written down a second time, unchanged, by a commit that had nothing to do with him.",
        repo: {
          files: FILES,
          commands: SAVED,
          ran: 2,
          note: "The whole folder, saved again - `dog.txt` included.",
        },
      },
      {
        narr: "`HEAD~1` means one commit back - the **parent** of the one you are on. Check it out and git rebuilds the folder from that snapshot; the board reads `HEAD detached` because you are standing on a commit itself, which a later lesson picks up. Click `cat.txt`: two lines again. Nothing was undone edit by edit - a whole picture was copied back over the folder.",
        repo: {
          files: FILES,
          commands: BACK,
          ran: 1,
          note: "The parent's snapshot, restored whole.",
        },
      },
      {
        narr: "Switch back to the newest commit. Behind you is a chain of complete folders, each one linked to the parent it was built on, and that chain is the **history**. Git can hand you any moment in it because it kept the whole moment.",
        repo: {
          files: FILES,
          commands: FORWARD,
          ran: 1,
          note: "Three commits. Three complete folders.",
        },
      },
    ],
  };
})();
