// Theory track - Part 3, Lesson 4: "Saving data". Absolute-beginner, no code.
// Memory is temporary, so to keep data you write it to storage (persistence):
// a file for simple data, a database for lots of organised data; save by
// writing, get it back by reading. Drill-engine theory mode (MC + fill-blank).
(function () {
  "use strict";

  const drills = [
    {
      title: "Memory forgets when the program stops",
      concept: "Temporary memory",
      context:
        "Everything in memory - the stack, the heap, your variables - lasts only while the program runs. Close the program, or switch the computer off, and it is all gone. Memory is temporary working space, not a place to keep things.",
      quiz: {
        question: "What happens to data in memory when the program closes?",
        options: [
          { text: "It is gone", correct: true },
          { text: "It stays there forever", correct: false },
          { text: "It moves onto the screen", correct: false },
        ],
        answerWhy: "Memory is temporary; when the program stops, everything it held is gone.",
      },
      snippet: "Data in memory is {{1}} - it disappears when the program stops.",
      points: [
        "Memory only lasts while the program runs.",
        "Close it or power off, and the data is gone.",
      ],
      blanks: [
        {
          id: 1,
          label: "What memory is - it does not last",
          answer: "temporary",
          accept: ["lost", "gone", "volatile"],
          hints: ["The opposite of permanent."],
          explain: [
            { text: "Memory is temporary - it disappears when the program ends." },
          ],
        },
      ],
    },
    {
      title: "To keep data, write it to storage",
      concept: "Persistence",
      context:
        "To keep data after the program ends, you save it to storage - a disk or drive that holds data even with the power off. Keeping data around like this, so it survives, is called persistence.",
      quiz: {
        question: "How do you keep data after a program closes?",
        options: [
          { text: "Save it to storage, like a disk", correct: true },
          { text: "Keep it in memory", correct: false },
          { text: "Say it out loud", correct: false },
        ],
        answerWhy: "Storage (a disk) keeps data even when the power is off; saving data there is persistence.",
      },
      snippet: "Saving data so it survives after the program ends is called {{1}}.",
      points: [
        "Storage keeps data even with the power off.",
        "Making data last is called persistence.",
      ],
      blanks: [
        {
          id: 1,
          label: "The word for making data survive after the program ends",
          answer: "persistence",
          accept: ["persisting"],
          hints: ["Data that 'persists' sticks around."],
          explain: [
            { text: "Saving data so it lasts beyond the program is called persistence." },
          ],
        },
      ],
    },
    {
      title: "A file is the simplest way to save",
      concept: "File",
      context:
        "The simplest place to save data is a file - a named bundle of bytes on disk (you met files in Part one). Write your data to a file, and it is still there the next time you open the program.",
      quiz: {
        question: "What is the simplest place to save data?",
        options: [
          { text: "A file on disk", correct: true },
          { text: "A new variable", correct: false },
          { text: "The CPU", correct: false },
        ],
        answerWhy: "A file - a named bundle of bytes on disk - is the simplest way to save data.",
      },
      snippet: "The simplest way to save data is to write it to a {{1}} on disk.",
      points: [
        "A file is a named bundle of bytes on disk.",
        "Write to it now, read it back later.",
      ],
      blanks: [
        {
          id: 1,
          label: "The simplest named place on disk to save data",
          answer: "file",
          hints: ["The same thing from Part one's operating-system lesson."],
          explain: [
            { text: "A file on disk is the simplest place to save data." },
          ],
        },
      ],
    },
    {
      title: "A database for lots of organised data",
      concept: "Database",
      context:
        "When there is a lot of data, or many users, a plain file gets clumsy. A database stores data in an organised, searchable way - many records you can quickly add to, find, and update without reading the whole thing.",
      quiz: {
        question: "What is a database good for?",
        options: [
          { text: "Lots of organised, searchable data", correct: true },
          { text: "A single number", correct: false },
          { text: "Drawing pictures", correct: false },
        ],
        answerWhy: "A database organises lots of data so you can quickly search, add, and update records.",
      },
      snippet: "A {{1}} stores lots of data in an organised, searchable way.",
      points: [
        "Better than a plain file when there is a lot of data.",
        "Quickly find, add, and update records.",
      ],
      blanks: [
        {
          id: 1,
          label: "An organised, searchable store for lots of data",
          answer: "database",
          hints: ["A 'base' that holds your data."],
          explain: [
            { text: "A database keeps lots of data organised and searchable." },
          ],
        },
      ],
    },
    {
      title: "Write to keep, read to get it back",
      concept: "Save and load",
      context:
        "Saving has two halves. You write the data out to storage to keep it, and later you read it back in to use it again. Write when something changes; read when the program starts up.",
      quiz: {
        question: "How do you get saved data back later?",
        options: [
          { text: "Read (load) it from storage", correct: true },
          { text: "Write it out again", correct: false },
          { text: "It comes back by itself", correct: false },
        ],
        answerWhy: "You read the data back from storage to use it again; writing is how it got saved.",
      },
      snippet: "Write data to storage to keep it; {{1}} it back later to use it again.",
      points: [
        "Write = save it out to storage.",
        "Read = load it back in to use again.",
      ],
      blanks: [
        {
          id: 1,
          label: "What you do to get saved data back",
          answer: "read",
          accept: ["load"],
          hints: ["The opposite of write."],
          explain: [
            { text: "You read (load) saved data back from storage to use it again." },
          ],
        },
      ],
    },
    {
      title: "Saving data - recap",
      concept: "Recap",
      summary: true,
      context: "You now know how data outlives a single run of a program.",
      summaryIntro:
        "Memory is temporary, so to keep data you save it to storage - a file for simple data, a database for lots of it - and read it back later.",
      summaryItems: [
        { title: "Memory is temporary - ", text: "everything in it is gone when the program stops." },
        { title: "Persistence - ", text: "saving data to storage so it survives." },
        { title: "File - ", text: "the simplest save: a named bundle of bytes on disk." },
        { title: "Database - ", text: "lots of data kept organised and searchable." },
        { title: "Write and read - ", text: "write to save it, read to get it back later." },
      ],
      summaryClose: "Next lesson: programs do not work alone - how they talk to each other across a network. Clients, servers and APIs.",
      blanks: [],
    },
  ];

  window.DRILL_CONFIG = {
    prefix: "th18",
    mode: "theory",
    metaLabel: "How software runs \u00b7 Saving data",
    progressNoun: "Topic",
    awardedKey: "theory_18_awarded",
    awardAmount: 20,
    drills,
  };
})();
