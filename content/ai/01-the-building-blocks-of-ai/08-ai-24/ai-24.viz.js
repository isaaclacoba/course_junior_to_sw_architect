// Visual for ai-24 "Writing a good instruction" - a DATA-ONLY file. It closes AI
// Part 1 by teaching the everyday craft of asking well, using the `transcript`
// panel met in ai-13. One task runs through the whole lesson - turn a sentence
// about an animal into a structured note - so each move shows its own payoff:
// be specific, show an example (few-shot), then ask for an output format. No
// engine change; the scene is the same message-list widget, driven by data.
(function () {
  "use strict";

  window.LESSON_VIZ = {
    code: [],
    legend: [
      { sw: "#37d3a6", label: "your instruction - the prompt you write" },
      { sw: "#ffd479", label: "the model's reply" },
    ],
    layout: {
      visual: [{ type: "transcript" }],
      aside: [{ type: "narration" }, { type: "controls" }],
    },
    steps: [
      {
        narr: "Ask for something vague and you get something vague back. You never said *what* you wanted, so the model filled the gap with whatever seemed likely - a little essay about dogs, when maybe you just wanted the fact. How you ask does most of the work.",
        transcript: {
          caption: "A vague ask",
          messages: [
            { role: "user", text: "Tell me about this: The dog next door barked all night.", hot: true },
            { role: "assistant", text: "Dogs are loyal companion animals, and barking is how they communicate - it can signal alertness, excitement, boredom, or a need for attention.", note: "you never said what you wanted, so the model guessed" },
          ],
        },
      },
      {
        narr: "Now the instruction is **specific**: one short sentence, name the animal and the sound. The reply lands on target. Being specific is the first and biggest move - say the length, say the focus, and say what to leave out.",
        transcript: {
          caption: "Say exactly what you want",
          messages: [
            { role: "user", text: "In one short sentence, name the animal and the sound it made: The dog next door barked all night.", hot: true },
            { role: "assistant", text: "A dog barked." },
          ],
        },
      },
      {
        narr: "You want a compact tag like `dog: bark`, so you try to describe that shape in words. But a shape described in words is easy to misread - here the model answered in a full sentence anyway. When the exact shape matters, do not *tell* the model the shape - *show* it.",
        transcript: {
          caption: "Describing a shape in words is shaky",
          messages: [
            { role: "user", text: "Give it as the animal, a colon, then the sound - nothing else: The dog next door barked all night.", hot: true },
            { role: "assistant", text: "The animal is a dog and the sound is a bark.", note: "asked for a shape in words, still got a sentence" },
          ],
        },
      },
      {
        narr: "Some shapes are hard to say but easy to show. Put a couple of worked examples - the input, then the answer you want - right in the prompt, and the model copies the pattern. This is **few-shot**: you teach by example, inside the instruction itself.",
        transcript: {
          caption: "Show a couple of examples",
          messages: [
            { role: "user", text: "\"The cat meowed at dawn.\" -> cat: meow", note: "an example: the input, then the answer you want" },
            { role: "user", text: "\"A cow mooed in the field.\" -> cow: moo" },
            { role: "user", text: "\"The dog next door barked all night.\" ->", hot: true },
            { role: "assistant", text: "dog: bark" },
          ],
        },
      },
      {
        narr: "When something downstream will read the answer - your own code, or a later step - ask for an exact **output format**: a template, a label, or a data format like JSON. Now the reply is predictable, and a program can use it straight away instead of parsing prose.",
        transcript: {
          caption: "Ask for the exact output format",
          messages: [
            { role: "user", text: "Reply with JSON only, nothing else: {\"animal\": \"...\", \"sound\": \"...\"}. Text: The dog next door barked all night.", hot: true },
            { role: "assistant", text: "{\"animal\": \"dog\", \"sound\": \"bark\"}", note: "a predictable shape your code can read without guessing" },
          ],
        },
      },
      {
        narr: "Three small moves, and they are the cheapest tools you have. **Be specific** about what you want. **Show an example** when the shape is easier to show than to say. **Ask for the output format** when something will read the answer. Same model, far better replies - just from asking well.",
        transcript: {
          caption: "Three moves, same model",
          messages: [
            { role: "user", text: "Reply with JSON only, nothing else: {\"animal\": \"...\", \"sound\": \"...\"}. Text: The dog next door barked all night." },
            { role: "assistant", text: "{\"animal\": \"dog\", \"sound\": \"bark\"}" },
          ],
        },
      },
    ],
  };
})();
