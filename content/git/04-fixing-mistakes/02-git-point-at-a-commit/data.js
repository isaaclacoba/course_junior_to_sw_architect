// Git · Part four - "Point at any commit". Two cards on the same four-commit
// history: the first puts a name on an older commit without moving, the second
// moves onto one and leaves HEAD detached.
//
// Neither goal states the notation. It names the commit in words - `add dog`,
// `add bird` - so `git log --oneline` is what tells the learner how many steps
// back that is, and the `~n` they type is derived rather than copied. This
// lesson owns gt-revision, so that derivation IS the teaching point; miscounting
// by one is graded not-solved.
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
      title: "Put a name on an older commit",
      concept: "git branch + ~",
      context:
        "`main` names the newest commit on that line. Add `~` and a number and git walks back that many parents, so `main~1` is the commit just before the tip.\n\n`git branch old <rev>` puts the name `old` wherever that revision lands, and leaves you standing where you are. You work out the number from the log.",
      goal: [
        "Read `git log --oneline` and count how many steps back `add dog` sits from the tip.",
        "Check the count with `git rev-parse main~<n>` before you use it.",
        "Put a branch called `old` on that commit with `git branch old main~<n>`, and stay on `main`."
      ],
      files: files,
      start: fourCommits,
      target: fourCommits.concat(["git branch old main~2"]),
      solution: [
        "git log --oneline",
        "git rev-parse main~2",
        "git branch old main~2"
      ]
    },
    {
      title: "Stand on a commit, not a branch",
      concept: "Detached HEAD",
      context:
        "`git checkout` takes the same kind of name. Point it at an older commit and there is no branch sitting there, so `HEAD` ends up on the commit itself. Git calls that a detached `HEAD`.\n\nCounting starts from where you stand, so `HEAD~1` is the commit before this one. Read the log again to find the number you need.",
      goal: [
        "Read `git log --oneline` and find the commit whose message is `add bird`.",
        "Count the steps back from the tip and step onto it with `git checkout HEAD~<n>`.",
        "Read `git status` - it should say `HEAD detached`. `main` does not move."
      ],
      files: files,
      start: fourCommits,
      target: fourCommits.concat(["git checkout HEAD~1"]),
      solution: [
        "git log --oneline",
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
