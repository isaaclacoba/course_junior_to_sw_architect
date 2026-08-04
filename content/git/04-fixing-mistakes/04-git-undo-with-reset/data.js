// Git · Part four - "Undo with reset". Three cards, one mistake. Every card
// starts from the SAME three commits and asks for the SAME step back, so the
// only thing the learner changes is the mode - and the only thing that can
// differ in the graded end state is which zone holds `draft.txt`.
//
// That is deliberate: grading is three-area (kernel/grading/state-match.js), so
// `--soft`, `--mixed` and `--hard` are told apart by staging and the working
// tree rather than by the commit graph, which is identical in all three.
// Data only: the git plugin reads window.LESSON_CONFIG. The prose here is
// mirrored in res/strings/default/en.json, which the resource layer binds back on.
(function () {
  "use strict";

  const FILES = ["cat.txt", "dog.txt", "draft.txt"];

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
      title: "Undo the commit, keep the files staged",
      concept: "git reset --soft",
      context:
        "The last commit is a mistake: `draft.txt` went in before it was ready, under the message `oops`.\n\n`git reset --soft HEAD~1` moves `main` back one commit and leaves that file staged. The snapshot goes; your work stays picked for the next commit.",
      goal: [
        "Undo the last commit with `git reset --soft HEAD~1`.",
        "Leave `draft.txt` staged - do not unstage it.",
        "Run `git status` to see which zone it landed in."
      ],
      files: FILES,
      start: THREE_COMMITS,
      target: THREE_COMMITS.concat(["git reset --soft HEAD~1"]),
      solution: [
        "git reset --soft HEAD~1",
        "git status"
      ]
    },
    {
      title: "Put the file back in the folder instead",
      concept: "git reset --mixed",
      context:
        "Same mistake, one word different. `--mixed` moves `main` back the same single commit, then empties staging.\n\n`draft.txt` ends up in the working tree, picked for nothing, so you choose again what goes into the next commit. This is the mode you get when you name none.",
      goal: [
        "Undo the last commit with `git reset --mixed HEAD~1`.",
        "Leave `draft.txt` in the working tree - do not stage it again.",
        "Nothing should be staged when you are done."
      ],
      files: FILES,
      start: THREE_COMMITS,
      target: THREE_COMMITS.concat(["git reset --mixed HEAD~1"]),
      solution: [
        "git reset --mixed HEAD~1",
        "git status"
      ]
    },
    {
      title: "Drop the commit and its file",
      concept: "git reset --hard",
      context:
        "This time `draft.txt` was never wanted. `--hard` makes the same move as the other two and keeps nothing: staging is cleared and the file goes from the folder as well.\n\nIt is the only one of the three that can lose work you cannot get back, so read it twice before you run it.",
      goal: [
        "Undo the last commit with `git reset --hard HEAD~1`.",
        "Leave staging empty and `draft.txt` gone.",
        "`git status` should show nothing waiting in either zone."
      ],
      files: FILES,
      start: THREE_COMMITS,
      target: THREE_COMMITS.concat(["git reset --hard HEAD~1"]),
      solution: [
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
