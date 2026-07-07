// Visual for theory-6 "Text, images, and sound as numbers" - data-only.
// Memory scene, no board: just the Stack region, used as labelled slots that
// show real things turning into numbers. An agreed code (encoding) maps each
// thing to a number; text, image and sound each fill the same kind of slots,
// and the closing step lines all three up to make the point that it is all
// just numbers underneath.
(function () {
  "use strict";

  const encFrame = () => ({
    id: "enc", name: "encoding · the agreed code",
    vars: [
      { id: "e1", k: "'A'", v: "65" },
      { id: "e2", k: "'B'", v: "66" },
    ],
  });
  const textFrame = () => ({
    id: "txt", name: "text · \"Hi\"",
    vars: [
      { id: "t1", k: "'H'", v: "72" },
      { id: "t2", k: "'i'", v: "105" },
    ],
  });
  const imgFrame = () => ({
    id: "img", name: "image · pixels",
    vars: [
      { id: "p1", k: "pixel", v: "(255, 0, 0)" },
      { id: "p2", k: "pixel", v: "(0, 128, 255)" },
      { id: "p3", k: "pixel", v: "(0, 0, 0)" },
    ],
  });
  const sndFrame = () => ({
    id: "snd", name: "sound · samples",
    vars: [
      { id: "s1", k: "sample", v: "32" },
      { id: "s2", k: "sample", v: "120" },
      { id: "s3", k: "sample", v: "-45" },
    ],
  });

  window.LESSON_VIZ = {
    scene: { board: false, regions: ["stack"], zoomTab: false },
    regionTags: { stack: "SLOTS <span>· things become numbers</span>" },
    chipName: "RAM",
    chipAddr: "everything ends up a number",
    steps: [
      {
        narr: "To store something as numbers, people agree on a code: this number means that thing, and back again.\nThat agreed mapping is an **encoding** - here, the letter `A` is `65` and `B` is `66`.",
        stack: [encFrame()],
      },
      {
        narr: "**Text** is the first example. Each character gets a number by the agreed code, so `\"Hi\"` is stored as `H` = `72` and `i` = `105`.\nA worldwide standard called Unicode gives every language's characters a number.",
        stack: [textFrame()],
      },
      {
        narr: "An **image** is a grid of tiny coloured dots called pixels.\nEach pixel's colour is a few numbers - how much red, green and blue - and mixing those three makes any colour.",
        stack: [imgFrame()],
      },
      {
        narr: "**Sound** is a wave that rises and falls. The computer measures its height thousands of times a second and saves each measurement as a number - a sample.\nPlay the samples back in order and you hear the sound.",
        stack: [sndFrame()],
      },
      {
        narr: "Text, image and sound all end up as the same thing: numbers in ordinary slots.\nA number means nothing on its own - the **encoding** a program uses is what decides whether it is a letter, a colour, or a moment of sound.",
        stack: [textFrame(), imgFrame(), sndFrame()],
      },
    ],
  };
})();
