// Git · Part four - "Undo with reset". Three cards, one mistake. Every card
// starts from the SAME three commits and asks for the SAME step back, so the
// only thing the learner changes is the mode - and the only thing that can
// differ in the graded end state is which zone holds `draft.txt`.
//
// No goal names a mode. Each states the OUTCOME wanted and the learner picks
// `--soft`, `--mixed` or `--hard` from it; the commit to move to is named in
// words (`add dog`) so `git log --oneline` is what tells them it is one step
// back. Measured 2026-08-05 through tools/lib/git-validate.mjs: each of the
// three solutions passes its own card and fails the other two, and `HEAD~2`
// fails all three.
//
// That is deliberate: grading is three-area (kernel/grading/state-match.js), so
// `--soft`, `--mixed` and `--hard` are told apart by staging and the working
// tree rather than by the commit graph, which is identical in all three.
// Data only: the git plugin reads window.LESSON_CONFIG. The prose here is
// mirrored in res/strings/default/en.json, which the resource layer binds back on.
(function () {
  "use strict";

  // A fresh copy per card: the resource layer writes the translated text onto
  // these objects, so three cards sharing one array would share one text.
  // `draft.txt` is the file the whole lesson moves, and it reads as unfinished -
  // that is what the file panel shows sitting in staging, in the folder, or gone.
  const files = () => [
    { path: "cat.txt", text: "Mia, tabby, 4 years old." },
    { path: "dog.txt", text: "Rex, collie, 2 years old." },
    {
      path: "draft.txt",
      text: "Bath day: Mia first, then Rex.\nTODO: nobody has asked the cat."
    }
  ];

  const THREE_COMMITS = [
    "git add cat.txt",
    "git commit -m \"add cat\"",
    "git add dog.txt",
    "git commit -m \"add dog\"",
    "git add draft.txt",
    "git commit -m \"oops\""
  ];

  const tasks = [
    {
      title: "Undo the commit, keep the work ready",
      concept: "git reset",
      context:
        "The commit on top is a mistake: `draft.txt` went in before it was ready, under the message `oops`.\n\n`git reset <mode> <rev>` moves `main` back to the commit you name, and the mode decides where that file lands. Here you want it kept staged, ready to commit again the moment it is finished.",
      goal: [
        "Read `git log --oneline` and see how far back `add dog` is.",
        "Move `main` onto `add dog` with one `git reset`.",
        "`draft.txt` should end up staged, ready to go straight back in.",
        "Read `git diff --staged` - it prints the lines that commit was holding, still there."
      ],
      files: files(),
      start: THREE_COMMITS,
      target: THREE_COMMITS.concat(["git reset --soft HEAD~1"]),
      solution: [
        "git log --oneline",
        "git reset --soft HEAD~1",
        "git status",
        "git diff --staged"
      ]
    },
    {
      title: "Put the file back in the folder instead",
      concept: "git reset",
      context:
        "Same mistake, a different wish. This time you are not sure `draft.txt` belongs in the next commit either, and you want to choose again before anything is saved.\n\nThe move back is the same one; only the mode changes. Pick the mode that empties the staging area and drops the file in the working tree.",
      goal: [
        "Read `git log --oneline` and count back to `add dog` again.",
        "Move `main` there with a `git reset` that leaves nothing staged.",
        "`draft.txt` should sit in the working tree when you are done."
      ],
      files: files(),
      start: THREE_COMMITS,
      target: THREE_COMMITS.concat(["git reset --mixed HEAD~1"]),
      solution: [
        "git log --oneline",
        "git reset --mixed HEAD~1",
        "git status"
      ]
    },
    {
      title: "Drop the commit and its file",
      concept: "git reset",
      context:
        "This time `draft.txt` was never wanted. One of the three modes makes the same move back and keeps nothing: staging is emptied and the file goes from the folder as well.\n\nIt is the only one that throws work away, so read it twice before you run it. If you ever run it by mistake, `git reflog` still lists the commit you left behind for a while, and you can go back to it.",
      goal: [
        "Read `git log --oneline` and count back to `add dog` one more time.",
        "Move `main` there and keep nothing - nothing staged, and no `draft.txt` in the folder.",
        "`git status` should show nothing waiting in either zone."
      ],
      files: files(),
      start: THREE_COMMITS,
      target: THREE_COMMITS.concat(["git reset --hard HEAD~1"]),
      solution: [
        "git log --oneline",
        "git reset --hard HEAD~1",
        "git status"
      ]
    },
    {
      summary: true,
      title: "Undo with reset - recap",
      concept: "Recap",
      context: "One move back, three places for the files to land.",
      summaryIntro:
        "Every reset did the same thing to the history: it moved the name you are standing on to the commit you named. The mode was never about the graph - it answered a second question, about the files that commit was holding.",
      summaryItems: [
        {
          title: "`git reset --soft HEAD~1` - ",
          text: "moves the name back and leaves the files staged, ready to commit again."
        },
        {
          title: "`git reset --mixed HEAD~1` - ",
          text: "moves the name back and drops the files in the working tree, so you pick again."
        },
        {
          title: "`git reset --hard HEAD~1` - ",
          text: "moves the name back and keeps nothing; the files go with the commit."
        },
        {
          title: "`HEAD~1` - ",
          text: "one step back from where you stand, so you never have to copy a hash to undo."
        }
      ],
      summaryClose: "That is the whole elementary track: save work, split it, bring it back together, and move the labels when you get it wrong."
    }
  ];

  window.LESSON_CONFIG = {
    prefix: "gur",
    metaLabel: "Fixing mistakes · Undo with reset",
    progressNoun: "Exercise",
    tasks,
    xpKey: "course_global_xp",
    awardedKey: "git_undo_with_reset_awarded",
    awardAmount: 20,
  };
})();
