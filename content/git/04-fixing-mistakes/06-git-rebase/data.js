// Git · Part four - "Replay your work on top". Two cards on `git rebase`, then
// a recap that answers the question the lesson exists for: merge and rebase both
// bring the work together, so why pick one.
//
// THE TWO BRANCHES TOUCH DIFFERENT FILES ON PURPOSE. `feature` adds `bird.txt`,
// `main` adds `dog.txt`. When the same file has moved on both sides this model
// refuses the replay with `CONFLICT (content)` and changes nothing - resolving
// mid-rebase is not implemented - so a card whose branches overlap would hand the
// learner an error and no way forward.
//
// TWO COMMITS CARRY THE MESSAGE `add bird` once the rebase has run, and that is
// the lesson rather than an accident: the replayed commit keeps the message and
// gets a new parent, so it gets a new id. Every goal that has to tell them apart
// asks about REACHABILITY, not about the message - `commit: "add dog", on:
// "feature"` is false before the replay and true after, and card 2's
// `before-rebase` row asks what that branch canNOT reach. Message lookup picks
// the first match, so nothing here leans on it.
//
// THE HASH. `344a3ea` is the `add bird` commit as it was before the replay, read
// off the reflog. Hardcoded for the same three measured reasons the reflog lesson
// records: the preimage is parents + message + seq (code-lab git-model makeHash)
// so it holds no timestamp and no randomness; it holds no file content either, so
// the localized `task.N.files.i.text` cannot move it (EN and ES replay to
// byte-identical reflogs, measured); and tools/verify-lesson.mjs replays
// `solution` against `target` on every run, so a hashing change breaks the gate
// loudly instead of going quiet. No goal GATE names a hash - card 2's is
// `ran: "git branch"` on leading words - so a 6-character prefix still ticks.
//
// WHY THE FIRST READ IS BARE `git log` AND THE LAST IS `git log --oneline`.
// `ran` matches on leading words and accumulates over the card, so two goals
// asking for the same command would both light on the first run and the second
// read would tick before the learner had done it. The bare form also prints the
// hash on its own line, which is what these cards ask the learner to watch.
//
// Data only: the git plugin reads window.LESSON_CONFIG. The prose here is
// mirrored in res/strings/default/en.json, which the resource layer binds back on.
(function () {
  "use strict";

  // A fresh copy per card: the resource layer writes the translated text onto
  // these objects, so two cards sharing one array would share one text.
  const files = () => [
    { path: "cat.txt", text: "Mia, tabby, 4 years old." },
    { path: "dog.txt", text: "Rex, collie, 2 years old." },
    { path: "bird.txt", text: "Pip, budgie, 1 year old." }
  ];

  // One commit on `main`, a branch off it with a commit of its own, and a second
  // commit on `main` while that branch was away. Ends standing on `main`, which
  // is what card 1's first read is for.
  const FORK = [
    "git add cat.txt",
    "git commit -m \"add cat\"",
    "git checkout -b feature",
    "git add bird.txt",
    "git commit -m \"add bird\"",
    "git checkout main",
    "git add dog.txt",
    "git commit -m \"add dog\""
  ];

  const REBASED = FORK.concat(["git checkout feature", "git rebase main"]);

  // The `add bird` commit as it was before the replay. See the header note.
  const ORIGINAL = "344a3ea";

  const tasks = [
    {
      title: "Put your commit on top of theirs",
      concept: "git rebase <branch>",
      context:
        "While you were working on `feature`, `add dog` landed on `main`. Your branch does not have it yet.\n\n`git rebase <branch>` takes the commits that are on the branch you are standing on and not on `<branch>`, and makes them again on top of it. It works on wherever you happen to be standing, so check that before you run it. `git log` on its own prints a block per commit with the hash on its own line, which reads better than `--oneline` when the hash is the thing you are watching.",
      goal: [
        "Read `git branch`. The `*` marks the branch you are standing on, and it is not the one you have been working on.",
        "Move onto `feature` with `git checkout`. A rebase acts on the branch you are standing on.",
        "Read `git log`. Your branch has two commits and neither of them is `add dog`. Note the hash on `add bird`.",
        "Replay your work on top of `main` with one `git rebase`.",
        "Read `git log --oneline`. Three commits in one line now, and the hash on `add bird` is not the one you noted."
      ],
      goals: [
        { code: ["git branch"],
          gate: { ran: "git branch" } },
        { code: ["git checkout feature", { row: "HEAD -> feature", head: "feature" }],
          gate: { ran: "git checkout feature", head: "feature" } },
        { code: ["git log"],
          gate: { ran: "git log" } },
        { code: ["git rebase main", { row: "feature -> reaches add dog", commit: "add dog", on: "feature" }],
          gate: { ran: "git rebase", head: "feature", commit: "add dog", on: "feature" } },
        { code: ["git log --oneline"],
          gate: { ran: "git log --oneline", commit: "add dog", on: "feature" } }
      ],
      files: files(),
      start: FORK,
      target: REBASED,
      solution: [
        "git branch",
        "git checkout feature",
        "git log",
        "git rebase main",
        "git log --oneline"
      ]
    },
    {
      title: "The commit you started with is still there",
      concept: "git reflog after a rebase",
      context:
        "The rebase has already happened here. `feature` is one straight line on top of `main`, and the `add bird` sitting on it is a commit that did not exist a moment ago.\n\nThe one you had before is still in the repository. Nothing points at it, so `git log` cannot reach it - but `git reflog` lists every place `HEAD` has stood, and the old commit is on that list with its own hash. Put a branch on it and both versions are on the board at once.",
      goal: [
        "Read `git log`. Three commits in one line, and `add bird` sits on `add dog`. Note the hash it has now.",
        "Read `git reflog`. The line that says `commit: add bird` is the commit from before the replay, and it starts with a different hash.",
        "Put a branch called `before-rebase` on it with `git branch before-rebase <hash>`.",
        "Move onto it with `git checkout before-rebase`.",
        "Read `git log --oneline`. `add bird` on `add cat`, and no `add dog` - the line you had before the rebase, still there to walk."
      ],
      goals: [
        { code: ["git log"],
          gate: { ran: "git log" } },
        { code: ["git reflog"],
          gate: { ran: "git reflog" } },
        { code: ["git branch before-rebase <hash>", { row: "before-rebase -> cannot reach add dog", branch: "before-rebase", absent: { commit: "add dog", on: "before-rebase" } }],
          gate: { ran: "git branch", branch: "before-rebase" } },
        { code: ["git checkout before-rebase", { row: "HEAD -> before-rebase", head: "before-rebase" }],
          gate: { ran: "git checkout before-rebase", head: "before-rebase", detached: false } },
        { code: ["git log --oneline"],
          gate: { ran: "git log --oneline", head: "before-rebase" } }
      ],
      files: files(),
      start: REBASED,
      target: REBASED.concat(["git branch before-rebase " + ORIGINAL, "git checkout before-rebase"]),
      solution: [
        "git log",
        "git reflog",
        "git branch before-rebase " + ORIGINAL,
        "git checkout before-rebase",
        "git log --oneline"
      ]
    },
    {
      summary: true,
      title: "Replay your work on top - recap",
      concept: "Recap",
      context: "Two ways to bring work together, two shapes of history.",
      summaryIntro:
        "`git merge` and `git rebase` answer the same question and leave different histories behind. A merge keeps both lines and adds a commit that joins them, so the history records what actually happened. A rebase makes your commits again on top of the other branch, so the history reads as though you had started later. Remaking the commits is the part worth thinking about: the originals stay in the repository with nothing pointing at them, and anyone who already has them is left holding work you no longer have under those ids.",
      summaryItems: [
        {
          title: "`git rebase <branch>` - ",
          text: "takes the commits on the branch you are standing on that `<branch>` cannot reach, and makes them again on top of it."
        },
        {
          title: "A replayed commit - ",
          text: "keeps its message and gets a new parent, which gives it a new id. The commit you started with stays in the repository with nothing pointing at it."
        },
        {
          title: "`git reflog` - ",
          text: "still lists the commits from before the replay, so a branch on one of those hashes brings the old line back."
        },
        {
          title: "Merge or rebase - ",
          text: "merge when the join is worth recording, rebase when you want one straight line. Work that someone else already has is the case to leave alone: replaying it hands them a second copy of the same commits."
        }
      ],
      summaryClose: "That closes the git track. You have both ways of bringing two lines of work together now, and a reason to pick one."
    }
  ];

  window.LESSON_CONFIG = {
    prefix: "grb",
    metaLabel: "Fixing mistakes · Replay your work on top",
    progressNoun: "Exercise",
    tasks,
    xpKey: "course_global_xp",
    awardedKey: "git_rebase_awarded",
    awardAmount: 20,
  };
})();
