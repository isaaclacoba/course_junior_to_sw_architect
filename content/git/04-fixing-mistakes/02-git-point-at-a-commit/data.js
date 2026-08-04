// Git · Part four - "Point at any commit". Two cards on the same four-commit
// history: the first puts a name on an older commit without moving, the second
// moves onto one and leaves HEAD detached.
//
// Both start states are identical on purpose - the history is the constant, and
// the only thing that changes is what the learner does to it. No card ever names
// a literal hash: hashes are display-only here, and the verifier replays these
// commands against a repo whose ids it does not know in advance.
// Data only: the git plugin reads window.LESSON_CONFIG. The prose here is
// mirrored in res/strings/default/en.json, which the resource layer binds back on.
(function () {
  "use strict";

  const fourCommits = [
    "git add cat.txt",
    "git commit -m \"add cat\"",
    "git add dog.txt",
    "git commit -m \"add dog\"",
    "git add bird.txt",
    "git commit -m \"add bird\"",
    "git add fish.txt",
    "git commit -m \"add fish\""
  ];
  const files = ["cat.txt", "dog.txt", "bird.txt", "fish.txt"];

  const tasks = [
    {
      title: "Put a branch on an older commit",
      concept: "main~2",
      context:
        "`main` names the newest commit on that line. Add `~2` and git walks back two parents from it, so `main~2` is the commit two before the tip.\n\n`git branch old main~2` makes the name `old` there. It does not move you - you stay on `main`, and the new name just sits further back.",
      goal: [
        "See what the name resolves to first: `git rev-parse main~2`.",
        "Make the branch there with `git branch old main~2`.",
        "Stay on `main` - `old` should end up on `add dog`."
      ],
      files: files,
      start: fourCommits,
      target: fourCommits.concat(["git branch old main~2"]),
      solution: [
        "git rev-parse main~2",
        "git branch old main~2"
      ]
    },
    {
      title: "Stand on a commit, not a branch",
      concept: "git checkout HEAD~1",
      context:
        "`git checkout` takes one of these names too. `git checkout HEAD~1` moves you back one commit - and there is no branch sitting there, so `HEAD` ends up pointing straight at the commit.\n\nGit calls that a detached `HEAD`. It is fine for looking around, but a commit made here would have no branch name holding on to it.",
      goal: [
        "Step back one commit with `git checkout HEAD~1`.",
        "Read `git status` - it should say `HEAD detached`, not `On branch main`.",
        "Leave `main` where it is; the only thing that moves is you."
      ],
      files: files,
      start: fourCommits,
      target: fourCommits.concat(["git checkout HEAD~1"]),
      solution: [
        "git checkout HEAD~1",
        "git status"
      ]
    },
    {
      summary: true,
      title: "Point at any commit - recap",
      concept: "Recap",
      context: "Names that count backwards, and what happens when you stand where no branch is.",
      summaryIntro:
        "A hash is one way to name a commit, and usually the least convenient one. `HEAD` and a branch name are the other two, and both take a step-back suffix - so most of the time you never have to read a hash at all.",
      summaryItems: [
        {
          title: "Revision - ",
          text: "any way of naming a commit: `HEAD`, a branch, a tag, a hash, or a step back from one of them."
        },
        {
          title: "`~n` - ",
          text: "walks back n parents, so `HEAD~1` is the commit before the one you are on and `main~2` is two before the tip of `main`. `HEAD^` means the same as `HEAD~1`."
        },
        {
          title: "`git rev-parse <rev>` - ",
          text: "prints the hash a name resolves to, which is a quick way to check you counted right."
        },
        {
          title: "Detached `HEAD` - ",
          text: "standing on a commit rather than on a branch, so a commit made there would have no name holding on to it."
        }
      ],
      summaryClose: "Next: what `reset` actually moves - now that you can name the commit to move it to."
    }
  ];

  window.LESSON_CONFIG = {
    prefix: "gpc",
    metaLabel: "Fixing mistakes · Point at any commit",
    progressNoun: "Exercise",
    tasks,
    xpKey: "course_global_xp",
    awardedKey: "git_point_at_a_commit_awarded",
    awardAmount: 20,
  };
})();
