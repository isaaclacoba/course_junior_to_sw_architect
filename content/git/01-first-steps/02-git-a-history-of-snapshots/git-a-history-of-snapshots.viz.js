// Visual for git-a-history-of-snapshots - a DATA-ONLY file, `repo` panel.
//
// Lesson 1 left three dots on the board. This lesson is about the LINE between
// them: a commit remembers the one it was built on, and that single backward
// link is the whole reason git can look back at all.
//
// The states are built by replaying real git commands through the same runtime
// the practical lessons use, so the picture here and the picture the learner
// types into next are produced by one engine - they cannot drift apart.
(function () {
  "use strict";


  var FILES = ["cat.txt", "dog.txt", "bird.txt"];

  var ONE = ['git add cat.txt', 'git commit -m "add cat"'];
  var TWO = ONE.concat(['git add dog.txt', 'git commit -m "add dog"']);
  var THREE = TWO.concat(['git add bird.txt', 'git commit -m "add bird"']);

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
        narr: "Here is the repository right after your first commit. One dot. It holds `cat.txt`, and it points at nothing - there was nothing before it. Git calls this the **root commit**.",
        repo: {
          files: FILES,
          commands: ONE,
          note: "One commit. Nothing behind it yet.",
        },
      },
      {
        narr: "Commit `dog.txt` and a second dot appears - joined to the first. That line is the important part. The new commit records which commit it was built on, and that commit is its **parent**.",
        repo: {
          files: FILES,
          commands: TWO,
          note: "The second commit remembers the first. That link is its parent.",
        },
      },
      {
        narr: "A third commit, a third link. Notice the direction: each commit points **backwards**, at the one before it. None of them knows what comes next - a commit is finished the moment you make it, so it can only ever look back.",
        repo: {
          files: FILES,
          commands: THREE,
          note: "Every arrow points back. Nothing points forward.",
        },
      },
      {
        narr: "That backwards chain is what `git log` walks. Start where you are, follow the parent, follow its parent, and you have the **history** - every snapshot behind you, in order, without git storing an order anywhere.",
        repo: {
          files: FILES,
          commands: THREE,
          note: "`git log` starts at the tip and follows the parents back.",
        },
      },
      {
        narr: "So a history is not a list git keeps. It is what you get by following the links back from where you stand. Every commit you make from now on joins the chain the same way - remembering exactly one thing: what came before it.",
        repo: {
          files: FILES,
          commands: THREE,
          note: "A history is the chain behind where you stand.",
        },
      },
    ],
  };
})();
