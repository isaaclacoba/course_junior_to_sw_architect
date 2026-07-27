// Theory track - Part 3 checkpoint. Closes Part three ("How software runs") and
// awards XP once on a pass. Data only: sets window.QUIZ_CONFIG for the code-lab
// Quiz component (CodeLab.Quiz), which owns the bank draw / shuffle / grading.
// IMPORTANT: options must stay PLAIN - no **bold** or emphasis that could single
// out the correct answer. Emphasis lives only in the stem and the explanation.
(function () {
  "use strict";

  window.QUIZ_CONFIG = {
    prefix: "chk3",
    metaLabel: "How software runs \u00b7 Part three checkpoint",
    title: "Part three checkpoint",
    intro:
      "Ten questions drawn from Part three - how software runs and connects. Pick the best answer for each, then submit. Score seven or more to pass and earn XP; a fresh set is drawn each time you retry.",
    xpKey: "course_global_xp",
    awardedKey: "theory_check_3_awarded",
    awardAmount: 40,
    askCount: 10,
    passRatio: 0.7,
    nextHref: "theory-21.html",
    nextLabel: "Continue to Part four",
    questions: [
      {
        concept: "Where data lives",
        stem: "Where does a running program keep the variables and objects it is actively working with?",
        options: [
          "In RAM, its working memory",
          "On disk, inside the program's file",
          "Only in the CPU's registers",
          "In the operating system's own memory",
        ],
        correct: 0,
        why: "Live data sits in RAM. The CPU holds a few values in registers at a time, but the working set lives in memory; the disk holds the program, not its live data.",
      },
      {
        concept: "The stack",
        stem: "During a function call, where do that call's local variables live?",
        options: [
          "On the stack, in the call's frame",
          "On the heap, until garbage-collected",
          "In the globals area",
          "In the code segment",
        ],
        correct: 0,
        why: "Each call gets a stack frame holding its locals; the frame - and its locals - are gone when the call returns.",
      },
      {
        concept: "The heap",
        stem: "An object created with `new` needs to outlive the function that made it. Where does it live?",
        options: [
          "On the heap",
          "On the stack, in that function's frame",
          "In the code segment",
          "In a CPU register",
        ],
        correct: 0,
        why: "The heap holds objects whose lifetime is not tied to a single call; the stack frame is gone as soon as the call returns.",
      },
      {
        concept: "Value vs reference types",
        stem: "What decides whether a variable stores its data directly, or stores a reference to it kept elsewhere?",
        options: [
          "Its type - value type versus reference type",
          "How big the value is",
          "The variable's name",
          "How much memory is free",
        ],
        correct: 0,
        why: "The type decides: a value type holds its data in the slot; a reference type holds a reference to an object stored elsewhere.",
      },
      {
        concept: "Copying a reference",
        stem: "Two reference-type variables point at the same object. You change the object through one of them. The other...?",
        options: [
          "Sees the change - both reference the one object",
          "Is unaffected - it has its own copy",
          "Is set to null",
          "Causes a compile error",
        ],
        correct: 0,
        why: "Copying a reference copies the address, not the object - so both names reach the same object and see each other's changes.",
      },
      {
        concept: "Copying a value",
        stem: "A value type is copied *by value*: `b = a` copies the data itself. You then change `a`. What is in `b`?",
        options: [
          "The original value - an independent copy",
          "The new value - it changed too",
          "Nothing - it is now empty",
          "A reference back to a",
        ],
        correct: 0,
        why: "A value type is copied by value, so `b` gets its own independent copy - changing `a` afterwards does not touch it.",
      },
      {
        concept: "Compile time",
        stem: "Translating your source into a runnable program - and checking its rules - happens at...?",
        options: [
          "Compile time, done by the compiler",
          "Run time, done by the CPU",
          "Save time, done by the editor",
          "Startup, done by the operating system",
        ],
        correct: 0,
        why: "The compiler translates the source and checks the rules at compile time - before the program ever runs.",
      },
      {
        concept: "Build errors",
        stem: "You break one of the language's rules. When is it caught?",
        options: [
          "At compile time - the build fails until you fix it",
          "At run time - it crashes on that line",
          "Never - the CPU skips it",
          "At save time - the editor rewrites it",
        ],
        correct: 0,
        why: "A broken rule is a build error, caught by the compiler before the program can run - which is why many mistakes never reach users.",
      },
      {
        concept: "Cross-compilation",
        stem: "Machine code is built for a specific target (a CPU and OS). Building, on your laptop, a program meant to run on a *different* machine is called...?",
        options: [
          "Cross-compiling",
          "Interpreting",
          "Linking",
          "Refactoring",
        ],
        correct: 0,
        why: "Cross-compiling means aiming the compiler at a target other than the machine you build on - say ARM Linux from an x64 laptop.",
      },
      {
        concept: "Persistence",
        stem: "RAM is cleared when a program stops. To keep data for next time, you...?",
        options: [
          "Write it to storage - a file on disk",
          "Leave it in RAM and hope",
          "Print it to the screen",
          "Declare it as a global",
        ],
        correct: 0,
        why: "Storage - a file on disk - survives after the program exits; RAM does not.",
      },
      {
        concept: "Files and inodes",
        stem: "On disk, a file is an inode plus a name. What does the inode hold?",
        options: [
          "The file's bytes and its metadata, like size and permissions",
          "Just the file's name",
          "A path pointing at another file",
          "The folder the file sits in",
        ],
        correct: 0,
        why: "The inode is the file itself - its data plus metadata. The name is a separate directory entry that points to the inode.",
      },
      {
        concept: "Links",
        stem: "A directory entry that maps a name to an inode is a...?",
        options: [
          "Hard link",
          "Soft link (symlink)",
          "Compiler",
          "Stack frame",
        ],
        correct: 0,
        why: "A hard link is a name to inode entry; a file can have several. A soft link is different - a small file that just holds a path.",
      },
      {
        concept: "Request and response",
        stem: "One program asks another for data over a network. The message it sends and the answer it gets back are a...?",
        options: [
          "Request and a response",
          "Commit and a push",
          "Compile and a link",
          "Read and a write",
        ],
        correct: 0,
        why: "Programs communicate by sending a request and receiving a response - the basis of the client/server model.",
      },
      {
        concept: "APIs",
        stem: "What is an API (application programming interface)?",
        options: [
          "The defined set of requests one program exposes for others to call",
          "A file format stored on disk",
          "A single CPU instruction",
          "A kind of variable",
        ],
        correct: 0,
        why: "An API is the interface a program offers other programs - the defined set of requests (operations) they can call, and what each returns.",
      },
    ],
  };
})();
