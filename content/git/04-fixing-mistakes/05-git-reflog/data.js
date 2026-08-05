// Git · Part four - "Find a lost commit". Two cards, one lost commit, two ways
// to get hold of it: stand on it, then give it a name.
//
// THE COMMIT IS LOST BY AN AMEND, NOT BY A RESET. This lesson sits BEFORE
// `what-reset-moves`, so `gt-reset` has not been introduced yet and the learner
// must never have to type it. `git commit --amend` (gt-amend, part four card 1)
// leaves the replaced commit unreachable, which is the same predicament and
// uses only what has already been taught. `reset` is named once, in the recap,
// as the thing coming next.
//
// THE HASH. Recovery works by the hash printed in the reflog listing, and
// `HEAD@{n}` is NOT a revision this model accepts - `git reset --hard HEAD@{1}`
// parses as a pathspec and silently does nothing, so no goal asks for it.
// The hashes below (`18f5843` = the pre-amend `add bird`) are HARDCODED, which
// is safe for three measured reasons, 2026-08-05:
//   1. the preimage is parents + message + seq (code-lab git-model makeHash),
//      so it holds no timestamp and no randomness;
//   2. it holds no FILE CONTENT either, so the localized `task.N.files.i.text`
//      cannot move it - EN and ES replay to byte-identical reflogs (measured);
//   3. tools/verify-lesson.mjs replays `solution` against `target` on every run,
//      so a hashing change breaks the gate loudly instead of going quiet.
// No goal GATE names a hash: they are `ran: "git checkout"` / `ran: "git branch"`
// on leading words, so a learner typing a 6-character prefix still ticks.
//
// EVERY `absent` CLAUSE IS ANCHORED TO `main` (`on: "main"`), not left bare.
// A bare `absent: { commit: "add bird" }` is true only until the learner gets the
// commit back, and the tracker's latch does not survive a language switch - so
// switching EN->ES on a finished card made a green goal go grey again. `on: "main"`
// is also the more accurate claim: what `git log` cannot see is what `main` cannot
// reach, and that stays true after the rescue.
//
// Measured through tools/lib/git-validate.mjs: both cards reach their target,
// every gate and row starts red and lights up on the solution, and the two
// answers are not interchangeable - card 1's detached checkout does not solve
// card 2, and card 2's branch does not solve card 1.
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

  const THREE_COMMITS = [
    "git add cat.txt",
    "git commit -m \"add cat\"",
    "git add dog.txt",
    "git commit -m \"add dog\"",
    "git add bird.txt",
    "git commit -m \"add bird\""
  ];

  const AMEND = "git commit --amend -m \"add Pip the budgie\"";

  // The pre-amend `add bird` commit. See the header note on why this is safe to
  // write down; the learner reads it off their own `git reflog`.
  const LOST = "18f5843";

  const tasks = [
    {
      title: "The commit git log forgot",
      concept: "git reflog",
      context:
        "Three commits, and the message on the last one says nothing useful. `git commit --amend` is the fix you already met.\n\nIt puts a new commit in place of the top one. The old commit stays in the repository - it only loses the name that pointed at it. `git log` walks back from where you are standing, so a commit no branch reaches never shows up there. `git reflog` reads a different list: every place `HEAD` has stood, newest first, each line starting with the hash it stood on.",
      goal: [
        "Replace the top commit with `git commit --amend -m \"add Pip the budgie\"`.",
        "Read `git log --oneline`. Three commits, and `add bird` is not one of them.",
        "Read `git reflog`. `HEAD` stood on `add bird`, and that line still starts with its hash.",
        "Copy that hash and `git checkout` it. You end up standing on the commit `git log` could not see."
      ],
      goals: [
        { code: [AMEND, { row: "main -> add Pip the budgie", branch: "main", at: "add Pip the budgie" }, { row: "add bird -> not on main", absent: { commit: "add bird", on: "main" } }],
          gate: { ran: "git commit --amend", branch: "main", at: "add Pip the budgie" } },
        { code: ["git log --oneline", { row: "add bird -> not listed", absent: { commit: "add bird", on: "main" } }],
          gate: { ran: "git log --oneline", absent: { commit: "add bird", on: "main" } } },
        { code: ["git reflog"],
          gate: { ran: "git reflog" } },
        { code: ["git checkout <hash>", { row: "HEAD -> add bird, detached", detached: true, commit: "add bird", at: "HEAD" }],
          gate: { ran: "git checkout", detached: true, commit: "add bird", at: "HEAD" } }
      ],
      files: files(),
      start: THREE_COMMITS,
      target: THREE_COMMITS.concat([AMEND, "git checkout " + LOST]),
      solution: [
        AMEND,
        "git log --oneline",
        "git reflog",
        "git checkout " + LOST
      ]
    },
    {
      title: "Give it a name",
      concept: "git branch <name> <hash>",
      context:
        "The amend has already happened here. The commit that added `bird.txt` is the one you want back, and `git log` cannot see it.\n\nStanding on it does not keep it: step away and it is out of reach again. A commit is lost when no name points at it, so the repair is to point a name at it. `git branch <name> <hash>` puts a branch on any commit you can name, and the reflog is where the hash comes from.",
      goal: [
        "Read `git log --oneline`. The commit that added `bird.txt` is not on the list.",
        "Read `git reflog` and find the line `commit: add bird`. The hash it starts with is that commit.",
        "Put a branch called `rescue` on it with `git branch rescue <hash>`.",
        "Move onto it with `git checkout rescue`. `add bird` has a name again, so `git log` can reach it."
      ],
      goals: [
        { code: ["git log --oneline", { row: "add bird -> not listed", absent: { commit: "add bird", on: "main" } }],
          gate: { ran: "git log --oneline", absent: { commit: "add bird", on: "main" } } },
        { code: ["git reflog"],
          gate: { ran: "git reflog" } },
        { code: ["git branch rescue <hash>", { row: "rescue -> add bird", branch: "rescue", at: "add bird" }],
          gate: { ran: "git branch", branch: "rescue", at: "add bird" } },
        { code: ["git checkout rescue", { row: "HEAD -> rescue", head: "rescue" }, { row: "add bird -> reachable", commit: "add bird", on: "rescue" }],
          gate: { ran: "git checkout rescue", head: "rescue", detached: false } }
      ],
      files: files(),
      start: THREE_COMMITS.concat([AMEND]),
      target: THREE_COMMITS.concat([AMEND, "git branch rescue " + LOST, "git checkout rescue"]),
      solution: [
        "git log --oneline",
        "git reflog",
        "git branch rescue " + LOST,
        "git checkout rescue"
      ]
    },
    {
      summary: true,
      title: "Find a lost commit - recap",
      concept: "Recap",
      context: "Two lists, and only one of them forgets.",
      summaryIntro:
        "`git log` answers one question: what can this branch still reach. `git reflog` answers a different one: where has `HEAD` been. The second list keeps commits the first has already forgotten, so a commit you replaced ten minutes ago is still findable by its hash.",
      summaryItems: [
        {
          title: "`git reflog` - ",
          text: "lists every place `HEAD` has stood, newest first, each line starting with the hash it stood on."
        },
        {
          title: "`HEAD@{0}`, `HEAD@{1}` - ",
          text: "the position of each line in that listing. Read them to find the line you want; the hash at the start of that line is what you type."
        },
        {
          title: "`git checkout <hash>` - ",
          text: "stands you on a commit no branch reaches, so you can look at it before deciding."
        },
        {
          title: "`git branch <name> <hash>` - ",
          text: "points a name at that commit, which is what stops it being lost."
        }
      ],
      summaryClose: "Next you meet `git reset`, which moves a branch name backwards on purpose. This is the list you read when it takes more than you meant."
    }
  ];

  window.LESSON_CONFIG = {
    prefix: "grl",
    metaLabel: "Fixing mistakes · Find a lost commit",
    progressNoun: "Exercise",
    tasks,
    xpKey: "course_global_xp",
    awardedKey: "git_reflog_awarded",
    awardAmount: 20,
  };
})();
