// Visual for git-when-changes-collide - a DATA-ONLY file, `repo` panel.
//
// The lesson owns ONE question: what is git actually looking at when it says it
// cannot decide? Nearly everybody answers "the filename", and that answer is
// wrong, so the lesson is built to break it. The same two branches change the
// same file twice over. The first time the edits sit on different lines and the
// merge runs straight through without a word; the second time they sit on the
// same line and it stops. The only thing that changed between the two runs is
// WHERE the edit was.
//
// The stop is then read off the file itself. Git leaves the marked-up
// `feeding.md` in the working tree, and the markers are diff3 - both answers with
// the shared original between them - so the learner sees what the line WAS, which
// is what explains why git will not rank the two versions.
//
// Settling the conflict is deliberately NOT here: that is the practical lesson
// that follows (git-settle-a-conflict), and a theory step re-showing it would be
// the replay this rebuild exists to remove.
//
// States are replayed through the git runtime the practical lessons type into,
// so this picture and the next lesson's exercise cannot drift apart.
(function () {
  "use strict";

  var FILES = [{ path: "feeding.md", text: "Mia 07:00\nRex 07:30\nPip 08:00" }];

  var BASE = ['git add feeding.md', 'git commit -m "start the feeding board"'];

  // Round one: `fix` rewrites Mia's line, `main` rewrites Pip's. Different lines
  // of one file, so the three-way merge has no overlap to stop on.
  var APART = BASE.concat([
    'git switch -c fix',
    'echo -e "Mia 06:30\\nRex 07:30\\nPip 08:00" > feeding.md',
    'git add feeding.md', 'git commit -m "Mia eats earlier"',
    'git switch main',
    'echo -e "Mia 07:00\\nRex 07:30\\nPip 09:00" > feeding.md',
    'git add feeding.md', 'git commit -m "Pip eats later"',
  ]);
  var MERGED = APART.concat(['git merge fix']);

  // Round two: identical, except `main` rewrites MIA's line instead of Pip's.
  var SAME_LINE = BASE.concat([
    'git switch -c fix',
    'echo -e "Mia 06:30\\nRex 07:30\\nPip 08:00" > feeding.md',
    'git add feeding.md', 'git commit -m "Mia eats earlier"',
    'git switch main',
    'echo -e "Mia 09:00\\nRex 07:30\\nPip 08:00" > feeding.md',
    'git add feeding.md', 'git commit -m "Mia eats later"',
  ]);
  var STOPPED = SAME_LINE.concat(['git merge fix']);

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
        narr: "One commit, one file: a feeding board with a line for each pet. Read it in the panel under the board - Mia at 07:00, Rex at 07:30, Pip at 08:00.\n\nEverything that follows grows out of this version, and both branches are about to change this same file.",
        repo: { files: FILES, commands: BASE, note: "One shared starting point." },
      },
      {
        narr: "Two branches now, and both of them changed `feeding.md`. On `fix`, Mia's line moved to 06:30. Here on `main`, Pip's line moved to 09:00 - that is the version the panel is showing you.\n\nThe same file, rewritten on both sides. Most people expect that to be the thing that stops a merge.",
        repo: { files: FILES, commands: APART, note: "Both sides changed `feeding.md`." },
      },
      {
        narr: "`git merge fix` runs straight through and nobody is asked anything.\n\nRead `feeding.md` now: Mia at 06:30 and Pip at 09:00, both in one file. Git was never comparing filenames. It lined both versions up against the commit they share and worked down them line by line. Where only one side had written, it took that side's line.",
        repo: { files: FILES, commands: MERGED, note: "Both edits kept. Nothing to ask about." },
      },
      {
        narr: "Now the same setup with one thing moved. `fix` still puts Mia at 06:30. `main` this time puts Mia at 09:00, so both edits are on Mia's line and Pip is left alone.\n\nNothing else is different. Same file, same two branches, same command coming next.",
        repo: { files: FILES, commands: SAME_LINE, note: "Both sides changed the same line." },
      },
      {
        narr: "`git merge fix`, and it stops. Look at the graph: **nothing was added**. No dot, and no name moved.\n\nGit worked through `feeding.md` the same way as before. `Rex` came through untouched, because only one side wrote there. Then it reached the line both sides had rewritten, and there it has two answers and no way to rank them.",
        repo: { files: FILES, commands: STOPPED, note: "The merge stopped. No commit was saved." },
      },
      {
        narr: "Read `feeding.md` in the panel to see exactly what git had in front of it. The markers hold both answers, and between them git has written the line as it stood in the commit the two branches share.\n\nThat middle line is the reason it stops. Git can see what each side did to `Mia 07:00`, and neither one is a correction of the other. A conflict is that narrow - the stretch of lines two branches rewrote on top of each other, handed back for you to settle.",
        repo: { files: FILES, commands: STOPPED, ran: 0, note: "Both answers, with the shared original between them." },
      },
    ],
    xpKey: "course_global_xp",
    awardedKey: "git_when_changes_collide_awarded",
  };
})();
