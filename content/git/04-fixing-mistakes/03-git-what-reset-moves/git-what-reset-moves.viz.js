// Visual for git-what-reset-moves - a DATA-ONLY file, `repo` panel.
//
// The lesson owns ONE question: where does my work GO in each of the three
// modes? A controlled comparison answers it - steps 1-3 replay the SAME three
// commits and the SAME step back, changing one word. The branch name lands on
// the same commit every time, so the only thing that can be seen moving is the
// work the undone commit was holding.
//
// The undone commit MODIFIES a tracked file rather than adding a new one, and
// that is the whole reason the answer is visible: `Pip 08:00` is one line, and
// the file panel shows the same `+ Pip 08:00` sitting in staging under `--soft`,
// in the working tree under `--mixed`, and in no zone at all under `--hard`,
// while the last commit holds two lines throughout. Prose could assert that;
// three pictures from one engine show it.
//
// States are replayed through the git runtime the practical lessons use, so this
// picture and the board the learner types into in the next lesson come from one
// engine and cannot drift apart.
(function () {
  "use strict";

  var FILES = [
    { path: "feeding.md", text: "Mia 07:00\nRex 07:30" },
    { path: "walks.md", text: "Rex 08:00\nRex 17:00" },
  ];

  var THREE = [
    'git add feeding.md', 'git commit -m "start the feeding board"',
    'git add walks.md', 'git commit -m "add the walk list"',
    'echo -e "Mia 07:00\\nRex 07:30\\nPip 08:00" > feeding.md',
    'git add feeding.md', 'git commit -m "oops"',
  ];
  var SOFT = THREE.concat(['git reset --soft HEAD~1']);
  var MIXED = THREE.concat(['git reset --mixed HEAD~1']);
  var HARD = THREE.concat(['git reset --hard HEAD~1']);
  var REDONE = SOFT.concat(['git commit -m "add the bird"']);

  window.LESSON_CONFIG = {
    legend: [
      { sw: "#f59e0b", label: "working tree - the file as it is right now" },
      { sw: "#22c55e", label: "staging - the copy you picked for the next commit" },
      { sw: "#94a3b8", label: "repository - the snapshots already saved" },
    ],
    layout: {
      visual: [{ type: "repo" }],
      aside: [{ type: "narration" }, { type: "controls" }],
    },
    steps: [
      {
        narr: "Three commits, and `main` on the newest. That last one is the mistake: Pip's feeding time went into `feeding.md` and was committed before anyone had checked it, under the message `oops`.\n\nIt is saved now - the panel shows the last commit holding all three lines. Staging and the folder are empty, because everything is committed.",
        repo: { files: FILES, commands: THREE, note: "`main` sits on the commit you wish you had not made." },
      },
      {
        narr: "`git reset --soft HEAD~1` moves `main` back one commit. The `oops` dot is still drawn, but no name points at it any more.\n\nPip's line did not travel back with the name. The panel has opened on `Staging` and put a dot on it, because that copy differs from the one behind it: `+ Pip 08:00`, sitting there, still picked for the next commit you make. **The snapshot went; the work did not.**",
        repo: { files: FILES, commands: SOFT, note: "`--soft` - the name moved back, the work waits in staging." },
      },
      {
        narr: "Run the same step back with `--mixed`, and `main` lands on **exactly the same commit**. Compare the graph with the last step: it is identical.\n\nThe panel has moved one button to the left. The same `+ Pip 08:00`, now in the working tree and picked for nothing, so you choose again what goes into the next commit.",
        repo: { files: FILES, commands: MIXED, note: "`--mixed` - same move, the work waits in the folder." },
      },
      {
        narr: "`--hard` makes that same step back and keeps nothing. Staging is empty, the folder is empty, and the panel falls back to the last commit - Mia and Rex, no Pip.\n\nThe line you were holding is in no zone at all now. This is the one to read twice before you run it.",
        repo: { files: FILES, commands: HARD, note: "`--hard` - same move, and the work is gone." },
      },
      {
        narr: "The graph move was identical all three times. The mode only ever decided where Pip's line came to rest.\n\nThat is what makes `--soft` useful: the work is still staged, so one `git commit` puts it straight back under the message you meant. Pick the mode by deciding where you want the files waiting for you.",
        repo: { files: FILES, commands: REDONE, ran: 2, note: "Reset moves a name. The mode decides where your work lands." },
      },
    ],
    xpKey: "course_global_xp",
    awardedKey: "git_what_reset_moves_awarded",
  };
})();
