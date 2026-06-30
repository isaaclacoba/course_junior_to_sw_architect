// Theory track - Part 3, Lesson 2: "References vs values". The keystone the
// practical OOP lessons quietly assume. Built very slowly: a small value sits in
// its slot, but a big thing lives on the heap and the slot only holds its address
// (a reference). Then the payoff: copying a value makes a separate copy, but
// copying a reference makes two names share one thing - which is exactly how
// objects behave. Drill-engine theory mode (MC + fill-blank), with simple
// stack->heap diagrams.
(function () {
  "use strict";

  const drills = [
    {
      title: "Small things sit right in the slot",
      concept: "Value",
      context:
        "A small thing, like a number, fits straight into its memory slot. The slot literally holds `7`. When the thing fits inside the slot itself, we call it a value.",
      quiz: {
        question: "Where does a small number like 7 live?",
        options: [
          { text: "Right inside its own slot", correct: true },
          { text: "Far away on the heap", correct: false },
          { text: "On the screen", correct: false },
        ],
        answerWhy: "A small number fits inside its slot, so the slot holds the value itself.",
      },
      snippet: "A small thing like a number sits right inside its slot - we call it a {{1}}.",
      points: [
        "A number is small enough to fit in one slot.",
        "The slot holds the thing itself: a value.",
      ],
      blanks: [
        {
          id: 1,
          label: "A thing that fits inside its own slot",
          answer: "value",
          hints: ["The opposite of pointing somewhere else."],
          explain: [
            { text: "When the thing fits inside the slot, the slot holds a value." },
          ],
        },
      ],
    },
    {
      title: "Big things live elsewhere",
      concept: "Reference",
      context:
        "Some things are too big for a single slot - a whole list, a picture, an object. So the thing itself lives on the heap, and the slot holds its address: a note saying where to find it. That note is a reference.",
      quiz: {
        question: "If a thing is too big to fit in a slot, what does the slot hold instead?",
        options: [
          { text: "Its address - a reference that points to it", correct: true },
          { text: "Nothing at all", correct: false },
          { text: "A picture of the screen", correct: false },
        ],
        answerWhy: "The big thing lives on the heap; the slot holds its address, which we call a reference.",
      },
      snippet: "When a thing is too big for a slot, the slot holds its address - a {{1}} that points to it.",
      points: [
        "Big things live on the heap, not in the slot.",
        "The slot holds a reference: where to find the thing.",
      ],
      mermaid:
        "flowchart LR\n  V[\"slot: pet\"] -->|points to| O[\"Dog object<br/>(on the heap)\"]",
      blanks: [
        {
          id: 1,
          label: "The 'where to find it' note a slot holds for a big thing",
          answer: "reference",
          hints: ["It refers you to where the thing is."],
          explain: [
            { text: "A reference is the address the slot holds, pointing to the real thing on the heap." },
          ],
        },
      ],
    },
    {
      title: "A reference is a 'where to find it' note",
      concept: "Reference is an address",
      context:
        "A reference does not contain the thing - it contains where the thing is, like a note that says 'warehouse, shelf 12'. Follow the note and you reach the real thing on the heap. The note is tiny; the thing it points to can be huge.",
      quiz: {
        question: "What does a reference actually hold?",
        options: [
          { text: "Where the thing is (its address)", correct: true },
          { text: "A full copy of the thing", correct: false },
          { text: "The thing's colour", correct: false },
        ],
        answerWhy: "A reference holds the address - where to find the thing - not the thing itself.",
      },
      snippet: "A reference holds where to find a thing - its {{1}} on the heap - not the thing itself.",
      points: [
        "The reference is a small 'where' note.",
        "The thing it points to can be large.",
      ],
      blanks: [
        {
          id: 1,
          label: "What the note holds: where to find the thing",
          answer: "address",
          hints: ["The same word from the previous lesson - a slot's number."],
          explain: [
            { text: "A reference holds an address: where the thing lives on the heap." },
          ],
        },
      ],
    },
    {
      title: "Copy a value, get a separate copy",
      concept: "Copying a value",
      context:
        "Copy a value from one slot to another and you get two independent copies. Each slot holds its own `7`. Change one and the other is untouched - they were never connected.",
      quiz: {
        question: "You copy a number from a to b, then change b. What happens to a?",
        options: [
          { text: "a is unchanged", correct: true },
          { text: "a changes too", correct: false },
          { text: "a disappears", correct: false },
        ],
        answerWhy: "Copying a value makes a separate copy, so changing one leaves the other untouched.",
      },
      snippet: "Copy a value and you get a separate {{1}}; changing one does not touch the other.",
      points: [
        "Two slots, each with its own value.",
        "They are not connected, so changes do not spread.",
      ],
      mermaid:
        "flowchart LR\n  A[\"a = 7\"]\n  B[\"b = 7 (a separate copy)\"]",
      blanks: [
        {
          id: 1,
          label: "What you get when you copy a value",
          answer: "copy",
          hints: ["A second, independent one."],
          explain: [
            { text: "Copying a value gives a separate copy; the two are independent." },
          ],
        },
      ],
    },
    {
      title: "Copy a reference, share one thing",
      concept: "Copying a reference",
      context:
        "Copy a reference and you copy the note, not the thing. Now two names hold the same address, so both point to the same thing on the heap. There is still only one thing - just two notes that lead to it.",
      quiz: {
        question: "You copy a reference from a to b. How many real things are there now?",
        options: [
          { text: "One, shared by both names", correct: true },
          { text: "Two separate things", correct: false },
          { text: "None", correct: false },
        ],
        answerWhy: "Copying a reference copies the address, not the thing, so both names point to the one thing.",
      },
      snippet: "Copy a reference and both names point to the {{1}} thing - there is still only one.",
      points: [
        "You copied the note, not the thing.",
        "Two references, one thing on the heap.",
      ],
      mermaid:
        "flowchart LR\n  A[\"a\"] --> O[\"one Dog object\"]\n  B[\"b\"] --> O",
      blanks: [
        {
          id: 1,
          label: "Both names point to the ___ thing",
          answer: "same",
          hints: ["Not separate - the very same one."],
          explain: [
            { text: "Both references hold the same address, so they point to the same thing." },
          ],
        },
      ],
    },
    {
      title: "Why changing one name changes 'the other'",
      concept: "Shared object",
      context:
        "Because both names point to the same thing, a change made through one name is seen through the other - there is only one thing to change. This is the surprise that trips up beginners, and it is exactly how objects behave in the practical track.",
      quiz: {
        question: "Two names point to the same object. You change it through one. The other...",
        options: [
          { text: "Sees the change too", correct: true },
          { text: "Stays the old way", correct: false },
          { text: "Becomes empty", correct: false },
        ],
        answerWhy: "There is only one object, so a change through either name is visible through both.",
      },
      snippet: "When two names point to one thing, a change through one is seen through the {{1}}.",
      points: [
        "There is only one thing, so changes are shared.",
        "This is how objects behave - the same object, two names.",
      ],
      blanks: [
        {
          id: 1,
          label: "The change is seen through the ___ name too",
          answer: "other",
          hints: ["The second name pointing at the same thing."],
          explain: [
            { text: "Both names reach the one object, so a change shows up through the other too." },
          ],
        },
      ],
    },
    {
      title: "References vs values - recap",
      concept: "Recap",
      summary: true,
      context: "You now know the difference that explains how objects really behave.",
      summaryIntro:
        "Small things are held as values; big things live on the heap and are reached through a reference - and that changes what 'copying' means.",
      summaryItems: [
        { title: "Value - ", text: "a small thing held right inside its slot." },
        { title: "Reference - ", text: "the address of a bigger thing that lives on the heap." },
        { title: "Copy a value - ", text: "you get a separate, independent copy." },
        { title: "Copy a reference - ", text: "both names point to the one same thing." },
        { title: "Shared thing - ", text: "a change through one name is seen through the other." },
      ],
      summaryClose: "This is the heart of how objects work in the practical track: an object lives on the heap, and a variable holds a reference to it. Next lesson: how your written code becomes a running program - the build-and-run cycle.",
      blanks: [],
    },
  ];

  window.DRILL_CONFIG = {
    prefix: "th16",
    mode: "theory",
    metaLabel: "How software runs \u00b7 References vs values",
    progressNoun: "Topic",
    awardedKey: "theory_16_awarded",
    awardAmount: 20,
    drills,
  };
})();
