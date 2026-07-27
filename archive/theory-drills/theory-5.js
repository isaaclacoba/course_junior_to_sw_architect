// Theory track - Part 1, Lesson 5: "How computers store everything as numbers".
//
// The data-representation foundation. Builds on Lessons 1-4 (programs, memory,
// the OS). The big idea: underneath, everything is numbers, and those numbers
// are made of bits - two-state on/off values - grouped into bytes. Sets up
// Lesson 6 (how text, images and sound become numbers). Same gentle audience and
// theory-mode format (quiz + prose fill-in-the-blank) as the earlier lessons.
(function () {
  "use strict";

  const drills = [
    {
      title: "Everything is numbers",
      concept: "Numbers underneath",
      context:
        "Underneath, a computer stores everything the same way: as numbers. Text, photos, music, video - all of it is numbers in the end. What makes them different is only how a program chooses to interpret those numbers.",
      quiz: {
        question: "Deep down, how is a photo stored?",
        options: [
          { text: "As numbers", correct: true },
          { text: "As tiny pictures", correct: false },
          { text: "As letters", correct: false },
        ],
        answerWhy: "Everything in a computer - text, images, sound - is stored as numbers; the difference is only how they are interpreted.",
      },
      snippet: "A computer stores everything - text, images, sound - as {{1}}. What makes them different is only how those numbers are interpreted.",
      points: [
        "Text, images, and sound are all numbers underneath.",
        "The meaning comes from how a program reads the numbers, not the numbers themselves.",
      ],
      blanks: [
        {
          id: 1,
          label: "What everything is stored as, deep down",
          answer: "numbers",
          accept: ["number"],
          hints: ["The same thing maths is made of."],
          explain: [
            { text: "Everything is stored as numbers; only the interpretation differs between text, images and sound." },
          ],
        },
      ],
    },
    {
      title: "A bit: on or off",
      concept: "Bit",
      context:
        "Those numbers are built from the smallest piece of all: a single on-or-off value, written as 1 or 0. One such value is called a bit. A bit is the smallest piece of information a computer can hold.",
      quiz: {
        question: "How many different values can a single bit hold?",
        options: [
          { text: "Two", correct: true },
          { text: "Ten", correct: false },
          { text: "Unlimited", correct: false },
        ],
        answerWhy: "A bit is a single on/off value, so it holds exactly two possibilities: 1 or 0.",
      },
      snippet: "The smallest piece of information is a single on-or-off value, written as 1 or 0. One such value is called a {{1}}.",
      points: [
        "A bit holds just two values: 1 or 0, on or off.",
        "Everything larger is built from many bits.",
      ],
      blanks: [
        {
          id: 1,
          label: "The smallest piece of information (3 letters)",
          answer: "bit",
          accept: ["a bit"],
          hints: ["Short for 'binary digit'."],
          explain: [
            { text: "A bit is a single on/off value - 1 or 0 - the smallest piece of information." },
          ],
        },
      ],
    },
    {
      title: "Why only two states",
      concept: "Reliability",
      context:
        "Computers use just two states because they are reliable. A wire is either carrying current or it is not; a switch is either on or off. Two clearly different states are easy to build and hard to misread, so everything is built up from them.",
      quiz: {
        question: "Why do computers use only two states?",
        options: [
          { text: "Two clearly different states are reliable and easy to build", correct: true },
          { text: "Because designers were in a hurry", correct: false },
          { text: "Because two is a lucky number", correct: false },
        ],
        answerWhy: "On/off is easy to build and hard to confuse - far more reliable than trying to tell apart many in-between levels.",
      },
      snippet: "Computers use two states because they are {{1}}: a wire either carries current or it does not, with no fuzzy in-between to misread.",
      points: [
        "On or off is clear and hard to mistake.",
        "Reliable two-state parts are the foundation everything is built on.",
      ],
      blanks: [
        {
          id: 1,
          label: "Why two states are used (one word)",
          answer: "reliable",
          accept: ["dependable", "simple", "clear"],
          hints: ["The opposite of error-prone."],
          explain: [
            { text: "Two clearly different states are reliable - easy to build and hard to misread." },
          ],
        },
      ],
    },
    {
      title: "Counting in binary",
      concept: "Binary",
      context:
        "With only the digits 0 and 1 to work with, counting is done in binary. A single bit gives 2 possibilities; add another bit and you get 4; another and you get 8. Each extra bit doubles how many different values you can represent.",
      quiz: {
        question: "What happens to the number of possible values when you add one more bit?",
        options: [
          { text: "It doubles", correct: true },
          { text: "It goes up by one", correct: false },
          { text: "It goes up by ten", correct: false },
        ],
        answerWhy: "Each extra bit doubles the possibilities: 1 bit = 2, 2 bits = 4, 3 bits = 8, and so on.",
      },
      snippet: "Counting with only 0 and 1 is called {{1}}. Each extra bit you add {{2}} the number of values you can represent.",
      points: [
        "Binary uses just two digits: 0 and 1.",
        "Every extra bit doubles the values: 2, 4, 8, 16, ...",
      ],
      blanks: [
        {
          id: 1,
          label: "Counting with only 0 and 1",
          answer: "binary",
          hints: ["'Bi' means two."],
          explain: [
            { text: "Binary is counting with only two digits, 0 and 1." },
          ],
        },
        {
          id: 2,
          label: "What each extra bit does to the number of values",
          answer: "doubles",
          accept: ["double"],
          hints: ["2, then 4, then 8 - each step is times two."],
          explain: [
            { text: "Each added bit doubles the possible values: 2, 4, 8, 16, and so on." },
          ],
        },
      ],
    },
    {
      title: "A byte is eight bits",
      concept: "Byte",
      context:
        "Bits are usually grouped into blocks of eight, and a block of eight bits is called a byte. One byte can hold 256 different values - enough for a single letter. This is why file sizes and memory are measured in bytes.",
      quiz: {
        question: "How many bits are in a byte?",
        options: [
          { text: "Eight", correct: true },
          { text: "Two", correct: false },
          { text: "One hundred", correct: false },
        ],
        answerWhy: "A byte is eight bits, which can hold 256 values - enough for one character.",
      },
      snippet: "Bits are grouped into blocks. One {{1}} is {{2}} bits, enough to store a single character. File sizes are measured in these.",
      points: [
        "A byte is 8 bits and can hold 256 different values.",
        "File sizes and memory are counted in bytes (and kilobytes, megabytes...).",
      ],
      blanks: [
        {
          id: 1,
          label: "A block of eight bits",
          answer: "byte",
          accept: ["a byte"],
          hints: ["Sounds like 'bite'; file sizes are measured in these."],
          explain: [
            { text: "A byte is a block of eight bits - enough to store one character." },
          ],
        },
        {
          id: 2,
          label: "How many bits are in a byte",
          answer: "eight",
          accept: ["8"],
          hints: ["A single digit number."],
          explain: [
            { text: "There are eight bits in a byte, giving 256 possible values." },
          ],
        },
      ],
    },
    {
      title: "Everything is numbers - recap",
      concept: "Recap",
      summary: true,
      context: "You now know what all that data is really made of.",
      summaryIntro:
        "Right at the bottom, a computer holds everything as numbers, and those numbers are built from two-state bits grouped into bytes.",
      summaryItems: [
        { title: "Numbers underneath - ", text: "text, images and sound are all stored as numbers." },
        { title: "Bit - ", text: "a single on/off value, 1 or 0 - the smallest piece of information." },
        { title: "Two states - ", text: "on/off is used because it is reliable and hard to misread." },
        { title: "Binary - ", text: "counting with only 0 and 1; each extra bit doubles the values." },
        { title: "Byte - ", text: "eight bits, holding 256 values - enough for one character." },
      ],
      summaryClose: "Next lesson: if everything is numbers, how does a letter, a photo or a song actually become numbers? That is encoding.",
      blanks: [],
    },
  ];

  window.DRILL_CONFIG = {
    prefix: "th5",
    mode: "theory",
    metaLabel: "Foundations \u00b7 Everything is numbers",
    progressNoun: "Topic",
    awardedKey: "theory_5_awarded",
    awardAmount: 20,
    drills,
  };
})();
