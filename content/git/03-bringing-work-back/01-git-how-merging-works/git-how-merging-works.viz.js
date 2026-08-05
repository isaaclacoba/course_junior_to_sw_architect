// Visual for git-how-merging-works - a DATA-ONLY file, `repo` panel.
//
// The lesson owns ONE question the practical cannot ask: why does the same
// `git merge fix` do two different things, and what decides which? The answer is
// a single fact about where the two names sit, so the lesson is a controlled
// comparison - the same file, the same branch, the same command, run twice, with
// exactly one thing changed between the two runs.
//
// The file panel is what makes the answer honest rather than asserted. After the
// fast-forward it shows the last commit holding `fix`'s snapshot unchanged -
// nothing was combined, because the version already existed. After the real merge
// it shows a `feeding.md` with one line from each side, which no commit on either
// branch ever held. That is why a commit had to be written: there was nothing to
// point at.
//
// States are replayed through the git runtime the practical lessons type into,
// so this picture and the next lesson's exercise cannot drift apart.
(function () {
  "use strict";

  var FILES = [{ path: "feeding.md", text: "Mia 07:00\nRex 07:30\nPip 08:00" }];

  // `fix` moves Mia's line. `main` - when it moves at all - moves Pip's line, so
  // the two edits never sit on top of each other and the merge stays clean.
  var SPLIT = [
    'git add feeding.md', 'git commit -m "start the feeding board"',
    'git switch -c fix',
    'echo -e "Mia 06:30\\nRex 07:30\\nPip 08:00" > feeding.md',
    'git add feeding.md', 'git commit -m "Mia eats earlier"',
    'git switch main',
  ];
  var SLID = SPLIT.concat(['git merge fix']);

  var BOTH_MOVED = SPLIT.concat([
    'echo -e "Mia 07:00\\nRex 07:30\\nPip 09:00" > feeding.md',
    'git add feeding.md', 'git commit -m "Pip eats later"',
  ]);
  var JOINED = BOTH_MOVED.concat(['git merge fix']);

  window.LESSON_CONFIG = {
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
        narr: "`main` and `fix` both grew out of `start the feeding board`. On `fix` somebody moved Mia half an hour earlier, and `main` has saved nothing since the split.\n\nYou are standing on `main`, and `git merge fix` brings the other branch in. Before git does anything it settles one question: standing here, can it already reach `fix`? It can - `fix` grew straight out of the commit `main` is sitting on.",
        repo: { files: FILES, commands: SPLIT, ran: 0, note: "`main` is behind on the same line." },
      },
      {
        narr: "`git merge fix`, and the name slides forward onto `fix`'s commit. No new dot appeared.\n\nOpen `feeding.md` in the panel underneath: the last commit now holds Mia at 06:30, exactly the snapshot `fix` saved. Nothing had to be combined, because the version you wanted was already written down. Git calls that shortcut a fast-forward.",
        repo: { files: FILES, commands: SLID, note: "The name moved. No commit was saved." },
      },
      {
        narr: "Same start, one difference: this time `main` saved something of its own before merging - Pip now eats at 09:00.\n\nAsk git's question again and the answer flips. From `main` there is no way forward to `fix`, and from `fix` no way forward to `main`. Each side holds a commit the other has never seen.",
        repo: { files: FILES, commands: BOTH_MOVED, note: "Both sides moved. Neither can reach the other." },
      },
      {
        narr: "The same `git merge fix`, and this time a dot appears with two lines running back out of it, one to each side.\n\nRead `feeding.md` in the panel. Mia at 06:30 came from `fix`, Pip at 09:00 came from `main`, and they are in one file. No commit on either branch held that version, so git had to write it down. **That is what a merge commit is for.**",
        repo: { files: FILES, commands: JOINED, note: "One new commit, holding a file neither branch had." },
      },
      {
        narr: "Nobody has to tell you which one you got. A name that moved forward with no new dot was a fast-forward, and you get one when your branch has added nothing since the split - there is a single line, and you were behind on it. A dot with two parents means both sides had moved, and git wrote the combination down because nothing else held it.\n\nOne command, and where the two names were sitting decided the rest.",
        repo: { files: FILES, commands: JOINED, ran: 0, note: "The shape on the graph tells you which one happened." },
      },
    ],
    xpKey: "course_global_xp",
    awardedKey: "git_how_merging_works_awarded",
  };
})();
