// Theory track - Part 1, Lesson 7: "The operating system's bigger job".
//
// The closer for Part 1. Earlier lessons used the OS only as the thing that
// starts and schedules programs. This lesson covers its other big jobs: turning
// raw storage into files and folders, guarding them with permissions, and
// standing between programs and the hardware devices via drivers. The recap
// wraps Part 1 and points to Part 2. Same gentle audience and theory-mode format.
(function () {
  "use strict";

  const drills = [
    {
      title: "Files: named bundles of bytes",
      concept: "Files",
      context:
        "Storage is really one huge space of bytes. On its own that is unusable, so the operating system organises it into files. A file is just a named bundle of bytes, so you and your programs can find things by name instead of by raw location.",
      quiz: {
        question: "What is a file?",
        options: [
          { text: "A named bundle of bytes the OS keeps track of", correct: true },
          { text: "A physical paper folder", correct: false },
          { text: "A running program", correct: false },
        ],
        answerWhy: "A file is a named bundle of bytes; the OS tracks it so you can find it by name instead of a raw location.",
      },
      snippet: "The operating system organises raw storage into {{1}} - each a named bundle of bytes you can find by name.",
      points: [
        "Storage is a big space of bytes; files give those bytes names.",
        "You open things by name because the OS keeps track of where they are.",
      ],
      blanks: [
        {
          id: 1,
          label: "Named bundles of bytes",
          answer: "files",
          accept: ["file"],
          hints: ["You open, save and rename these every day."],
          explain: [
            { text: "A file is a named bundle of bytes the OS keeps track of, so you find it by name." },
          ],
        },
      ],
    },
    {
      title: "Folders organise files",
      concept: "Folders",
      context:
        "With thousands of files, names alone are not enough. The operating system groups files into folders (also called directories), arranged in a tree. The route through those folders to a particular file is called its path.",
      quiz: {
        question: "What are folders for?",
        options: [
          { text: "Grouping files so they stay organised and findable", correct: true },
          { text: "Making programs run faster", correct: false },
          { text: "Storing electricity", correct: false },
        ],
        answerWhy: "Folders group files into a tree so large numbers of them stay organised; the route to a file is its path.",
      },
      snippet: "{{1}} group files into a tree so thousands of them stay findable. The route through them to a file is its {{2}}.",
      points: [
        "Folders (directories) arrange files into a tree.",
        "A path is the route through folders to a specific file.",
      ],
      blanks: [
        {
          id: 1,
          label: "What groups files into a tree",
          answer: "folders",
          accept: ["directories", "folder"],
          hints: ["Also called directories."],
          explain: [
            { text: "Folders (directories) group files into a tree so they stay organised." },
          ],
        },
        {
          id: 2,
          label: "The route through folders to a file",
          answer: "path",
          accept: ["the path"],
          hints: ["Like an address that leads to the file."],
          explain: [
            { text: "A path is the route through the folders that leads to a particular file." },
          ],
        },
      ],
    },
    {
      title: "The OS guards your files",
      concept: "Permissions",
      context:
        "Programs do not touch the drive directly. They ask the operating system to open, read, or save a file, and the OS checks permissions first. That is how it stops one program from quietly reading or wrecking another's files.",
      quiz: {
        question: "How does a program save a file?",
        options: [
          { text: "It asks the operating system to do it", correct: true },
          { text: "It writes to the drive directly", correct: false },
          { text: "It prints it to the screen", correct: false },
        ],
        answerWhy: "Programs ask the OS to read or save files; the OS checks permissions, which keeps files safe from other programs.",
      },
      snippet: "Programs do not touch the drive directly. They ask the {{1}} to open, read or save a file, and it checks permissions first.",
      points: [
        "All file access goes through the operating system.",
        "Permission checks stop one program from reaching another's files.",
      ],
      blanks: [
        {
          id: 1,
          label: "Who a program asks to read or save a file",
          answer: "operating system",
          accept: ["os", "operating-system"],
          hints: ["The same program in charge from Lesson 3."],
          explain: [
            { text: "Programs ask the operating system to read or save files; it checks permissions before allowing it." },
          ],
        },
      ],
    },
    {
      title: "Talking to your devices",
      concept: "Devices",
      context:
        "The operating system also sits between programs and the hardware devices: the keyboard, the screen, the printer, the network. A program does not work the device itself - it asks the OS, and the OS works the device on its behalf.",
      quiz: {
        question: "When a program shows something on screen, it...",
        options: [
          { text: "Asks the operating system, which works the screen", correct: true },
          { text: "Controls the screen's pixels directly", correct: false },
          { text: "Produces light by itself", correct: false },
        ],
        answerWhy: "Programs ask the OS to use devices like the screen; the OS handles the hardware on their behalf.",
      },
      snippet: "The OS also sits between programs and the hardware {{1}} - keyboard, screen, printer, network. A program asks the OS, and the OS works the device.",
      points: [
        "Programs reach hardware only through the operating system.",
        "This keeps programs simple and the hardware shared safely.",
      ],
      blanks: [
        {
          id: 1,
          label: "The hardware the OS works on a program's behalf",
          answer: "devices",
          accept: ["device"],
          hints: ["Keyboard, screen, printer, network - all of these."],
          explain: [
            { text: "Devices are the hardware - keyboard, screen, printer, network - that the OS works for the program." },
          ],
        },
      ],
    },
    {
      title: "Drivers: the OS's translators",
      concept: "Drivers",
      context:
        "Every device is a little different, so the operating system needs help to talk to each one. That help is a small piece of software called a driver, which teaches the OS how to work that exact device. It is why plugging in a new printer sometimes installs something first.",
      quiz: {
        question: "What is a driver?",
        options: [
          { text: "Software that lets the OS talk to a specific device", correct: true },
          { text: "The person using the computer", correct: false },
          { text: "A kind of file you open", correct: false },
        ],
        answerWhy: "A driver is software that teaches the OS how to talk to one particular device.",
      },
      snippet: "Each device needs a small piece of software, a {{1}}, that teaches the OS how to talk to that exact device.",
      points: [
        "A driver bridges the OS and one specific device.",
        "New hardware often installs a driver so the OS can use it.",
      ],
      blanks: [
        {
          id: 1,
          label: "The software that teaches the OS to use a device",
          answer: "driver",
          accept: ["a driver"],
          hints: ["Installed when you plug in new hardware."],
          explain: [
            { text: "A driver is software that teaches the operating system how to talk to a particular device." },
          ],
        },
      ],
    },
    {
      title: "The operating system - recap",
      concept: "Recap",
      summary: true,
      context: "That completes the picture of what a computer is and how it works.",
      summaryIntro:
        "Beyond starting programs, the operating system organises storage into files and folders, guards them, and stands between every program and the hardware.",
      summaryItems: [
        { title: "Files - ", text: "named bundles of bytes, so storage is usable by name." },
        { title: "Folders - ", text: "files grouped into a tree; the route to one is its path." },
        { title: "Permissions - ", text: "programs ask the OS for files, and it checks who is allowed." },
        { title: "Devices - ", text: "programs reach the keyboard, screen and network only through the OS." },
        { title: "Drivers - ", text: "small software that teaches the OS to talk to each specific device." },
      ],
      summaryClose: "That completes Part one - you now understand what a computer is and how it runs your programs. Next, Part two: from idea to running code - languages, variables, and types - the bridge to writing software yourself.",
      blanks: [],
    },
  ];

  window.DRILL_CONFIG = {
    prefix: "th7",
    mode: "theory",
    metaLabel: "Foundations \u00b7 The operating system",
    progressNoun: "Topic",
    awardedKey: "theory_7_awarded",
    awardAmount: 20,
    drills,
  };
})();
