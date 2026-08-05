// Visual for git-how-merging-works - a DATA-ONLY file, `repo` panel.
//
// The lesson makes one comparison: the SAME merge command on two graphs. When
// `main` added nothing since the split there is nothing to combine, so the name
// slides; when both sides moved, one commit with two parents joins them. Showing
// the two side by side in time is the whole argument - saying "sometimes git
// fast-forwards" in prose teaches nobody to read a graph.
//
// States are replayed through the git runtime the practical lessons type into,
// so this picture and the next lesson's exercise cannot drift apart.
(function () {
  "use strict";

  var FILES = ["cat.txt", "dog.txt", "feeder.txt"];

  var SPLIT = [
    'git add cat.txt', 'git commit -m "add cat"',
    'git switch -c fix',
    'git add dog.txt', 'git commit -m "add dog"',
    'git switch main',
  ];
  var SLID = SPLIT.concat(['git merge fix']);

  var BOTH_MOVED = SPLIT.concat([
    'git add feeder.txt', 'git commit -m "feed the cat"',
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
        narr: "`main` has one commit, `add cat`. `fix` split off from it and saved `add dog` of its own, so `fix` is one commit ahead.\n\nYou are standing on `main` - that is what `HEAD` says. To merge, you name the branch you want to bring IN: `git merge fix`. The branch you are standing on is the one that moves.",
        repo: { files: FILES, commands: SPLIT, note: "`fix` is one commit ahead. `main` has not moved." },
      },
      {
        narr: "Before running anything, look at where `main` sits: still on `add cat`, the exact commit `fix` grew out of. `main` has added nothing since the split. So there are not really two lines here - there is one line, and `main` is standing behind on it.",
        repo: { files: FILES, commands: SPLIT, note: "Nothing to combine - `main` is simply behind." },
      },
      {
        narr: "`git merge fix`, and the name slides forward onto `fix`'s commit. **Nothing new was saved.** There was nothing to combine, so git took the shortcut - that shortcut is called a fast-forward.",
        repo: { files: FILES, commands: SLID, note: "The name moved. No new commit." },
      },
      {
        narr: "Same story, one change: while `fix` was working, `main` saved `feed the cat` of its own. Now neither name is behind the other - each has a commit the other has never seen. Sliding `main` forward would leave its own commit off the line.",
        repo: { files: FILES, commands: BOTH_MOVED, note: "Both sides moved. Neither is behind." },
      },
      {
        narr: "`git merge fix` again, and this time git saves a commit. Look at what it points back at: **two parents**, one on each side. That single commit is what joins the two lines, and it is the only kind with more than one parent.",
        repo: { files: FILES, commands: JOINED, note: "One new commit, pointing back at both tips." },
      },
      {
        narr: "So you can read which one you got straight off the graph, without being told. A name that just moved forward, with no new dot, was a fast-forward. A dot with two lines running back out of it is a merge commit - and it is there because both sides had moved.",
        repo: { files: FILES, commands: JOINED, note: "The shape tells you which merge happened." },
      },
    ],
    xpKey: "course_global_xp",
    awardedKey: "git_how_merging_works_awarded",
  };
})();
