// Theory track - Part 1, Lesson 6: "Text, images, and sound as numbers".
//
// Follows Lesson 5 (everything is numbers, built from bits and bytes). This
// lesson answers "so how does a letter, a photo or a song actually become
// numbers?" - the idea of an encoding, then text, images and sound each in turn,
// closing with the key point that the same number means different things under
// different encodings. Same gentle audience and theory-mode format.
(function () {
  "use strict";

  const drills = [
    {
      title: "An agreed code: encoding",
      concept: "Encoding",
      context:
        "To store something as numbers, people agree on a code: this number means that thing, and so on. That agreed mapping between things and numbers is called an encoding. Both the program that saves and the program that reads must use the same one.",
      quiz: {
        question: "What is an encoding?",
        options: [
          { text: "An agreed rule for which number means what", correct: true },
          { text: "A secret password", correct: false },
          { text: "A type of hardware", correct: false },
        ],
        answerWhy: "An encoding is the agreed mapping between things and numbers - the rule for turning something into numbers and back.",
      },
      snippet: "An agreed code that says which number means what is called an {{1}}. Saving and reading must use the same one.",
      points: [
        "An encoding maps real things to numbers, and back again.",
        "Both sides must agree on the encoding, or the numbers make no sense.",
      ],
      blanks: [
        {
          id: 1,
          label: "The agreed mapping between things and numbers",
          answer: "encoding",
          accept: ["an encoding"],
          hints: ["The rule for turning something into numbers."],
          explain: [
            { text: "An encoding is the agreed code that maps things to numbers, used by both the saver and the reader." },
          ],
        },
      ],
    },
    {
      title: "Text is numbers",
      concept: "Text",
      context:
        "Every letter, digit and symbol is given a number by an agreed code. For example the capital letter A is 65. A worldwide standard called Unicode gives a number to the characters of every language, so text travels between computers correctly.",
      quiz: {
        question: "How is the letter A stored?",
        options: [
          { text: "As a number, using an agreed code", correct: true },
          { text: "As a tiny drawing of an A", correct: false },
          { text: "As the sound 'ay'", correct: false },
        ],
        answerWhy: "Each character is mapped to a number (A is 65); a standard like Unicode covers every language.",
      },
      snippet: "Each letter, digit and symbol is stored as a {{1}}, using an agreed code. The worldwide standard for this is called Unicode.",
      points: [
        "Each character maps to a number - for example, A is 65.",
        "Unicode gives a number to characters in every language.",
      ],
      blanks: [
        {
          id: 1,
          label: "What each character is stored as",
          answer: "number",
          accept: ["code"],
          hints: ["The same thing everything is, deep down."],
          explain: [
            { text: "Each character is stored as a number; Unicode is the agreed code that maps them." },
          ],
        },
      ],
    },
    {
      title: "Images are numbers too",
      concept: "Pixels",
      context:
        "An image is a grid of tiny coloured dots called pixels. Each pixel's colour is stored as a few numbers: how much red, how much green, how much blue. Mix those three and you get any colour. More pixels means more detail.",
      quiz: {
        question: "An image is stored as...",
        options: [
          { text: "Numbers for the colour of each pixel", correct: true },
          { text: "One number for the whole picture", correct: false },
          { text: "The word 'photo'", correct: false },
        ],
        answerWhy: "An image is a grid of pixels; each pixel's colour is stored as amounts of red, green and blue.",
      },
      snippet: "An image is a grid of tiny dots called {{1}}. Each one's colour is stored as amounts of red, green and {{2}}.",
      points: [
        "A picture is a grid of pixels, each a tiny coloured dot.",
        "Each pixel's colour is three numbers: red, green, blue.",
      ],
      blanks: [
        {
          id: 1,
          label: "The tiny coloured dots that make up an image",
          answer: "pixels",
          accept: ["pixel"],
          hints: ["More of them means a sharper picture."],
          explain: [
            { text: "Pixels are the tiny dots that make up an image; each has a colour stored as numbers." },
          ],
        },
        {
          id: 2,
          label: "The third colour mixed into every pixel (after red and green)",
          answer: "blue",
          hints: ["Red, green and ___ mix to make any colour."],
          explain: [
            { text: "Each pixel's colour is amounts of red, green and blue mixed together." },
          ],
        },
      ],
    },
    {
      title: "Sound is numbers too",
      concept: "Sound",
      context:
        "Sound is a wave that rises and falls. The computer measures the height of that wave many thousands of times a second and stores each measurement as a number. Played back in order, those numbers recreate the sound.",
      quiz: {
        question: "How is sound stored?",
        options: [
          { text: "As many number measurements taken over time", correct: true },
          { text: "As the word 'sound'", correct: false },
          { text: "As a single picture", correct: false },
        ],
        answerWhy: "Sound is captured by measuring the wave thousands of times a second and saving each measurement as a number.",
      },
      snippet: "Sound is stored by measuring the wave many times a second and saving each measurement as a {{1}}. Play them back in order and you hear the sound.",
      points: [
        "Sound is sampled - measured repeatedly over time.",
        "Each measurement is a number; together they recreate the wave.",
      ],
      blanks: [
        {
          id: 1,
          label: "What each measurement of the sound wave is saved as",
          answer: "number",
          accept: ["measurement", "value"],
          hints: ["The same thing text and images become."],
          explain: [
            { text: "Each measurement of the sound wave is saved as a number; playing them back recreates the sound." },
          ],
        },
      ],
    },
    {
      title: "Same numbers, different meaning",
      concept: "Interpretation",
      context:
        "The same number can be a letter, a shade of colour, or a moment of sound. What it actually means depends on the encoding the program decides to use. Open a photo as if it were text and you get gibberish - the numbers are fine, but the wrong code is reading them.",
      quiz: {
        question: "What decides whether a stored number is a letter or a colour?",
        options: [
          { text: "The encoding the program uses to read it", correct: true },
          { text: "The number itself", correct: false },
          { text: "The screen", correct: false },
        ],
        answerWhy: "Numbers carry no meaning on their own; the encoding the program applies decides what they represent.",
      },
      snippet: "The same number can be a letter, a colour, or a moment of sound. What it means depends on the {{1}} the program uses to read it.",
      points: [
        "Numbers carry no meaning by themselves.",
        "The encoding decides what they represent - use the wrong one and you get gibberish.",
      ],
      blanks: [
        {
          id: 1,
          label: "What decides the meaning of a stored number",
          answer: "encoding",
          accept: ["code"],
          hints: ["The same agreed code from the first card."],
          explain: [
            { text: "The encoding decides what a number means; the wrong encoding turns sense into gibberish." },
          ],
        },
      ],
    },
    {
      title: "Text, images and sound - recap",
      concept: "Recap",
      summary: true,
      context: "You now know how the real things you use turn into the numbers from Lesson 5.",
      summaryIntro:
        "Everything becomes numbers through an agreed encoding - and the same numbers mean different things under different encodings.",
      summaryItems: [
        { title: "Encoding - ", text: "the agreed code that maps things to numbers and back." },
        { title: "Text - ", text: "each character is a number; Unicode covers every language." },
        { title: "Images - ", text: "a grid of pixels, each a few numbers for red, green and blue." },
        { title: "Sound - ", text: "the wave measured many times a second, each measurement a number." },
        { title: "Meaning - ", text: "a number means nothing alone; the encoding decides what it is." },
      ],
      summaryClose: "Next lesson: the operating system's bigger job - organising all these bytes into files and folders, and talking to your devices.",
      blanks: [],
    },
  ];

  window.DRILL_CONFIG = {
    prefix: "th6",
    mode: "theory",
    metaLabel: "Foundations \u00b7 Everything as numbers",
    progressNoun: "Topic",
    awardedKey: "theory_6_awarded",
    awardAmount: 20,
    drills,
  };
})();
