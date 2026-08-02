// Visual for "Good names" - data-only. No board: the stack region is reused as
// labelled NAME slots. Each slot pairs a name (k) with what a reader can tell
// from it (v). A vague snippet is renamed step by step until the code reads as
// its own description. Test-automation flavour in the examples; plain voice in
// the narration.
(function () {
  "use strict";

  const slot = (id, k, v) => ({ id, k, v });

  const vagueFrame = () => ({
    id: "vague", name: "vague names",
    vars: [
      slot("t", "t", "30 \u00b7 seconds? tries?"),
      slot("r", "r", "true \u00b7 ready? result?"),
    ],
  });
  const clearFrame = () => ({
    id: "clear", name: "clear names",
    vars: [
      slot("ts", "timeoutSeconds", "30"),
      slot("lw", "loginWorks", "true"),
    ],
  });
  const funcFrame = () => ({
    id: "func", name: "a name says what a function does",
    vars: [
      slot("cv", "check()", "checks... what?"),
      slot("cc", "checkLogin()", "checks a login"),
    ],
  });

  window.LESSON_VIZ = {
    scene: { board: false, regions: ["stack"], zoomTab: false },
    regionTags: { stack: "NAMES <span>\u00b7 say what it holds or does</span>" },
    chipName: "names",
    chipAddr: "a good name saves a comment",
    steps: [
      {
        narr: "You read code far more often than you write it - and the reader is usually you, weeks later.\nThe cheapest way to make code explain itself is a good **name**: one that says what a value holds or what a function does.",
        stack: [vagueFrame()],
      },
      {
        narr: "Here one value is called `t` and another `r`. What do they hold?\nA single letter forces the reader to stop and guess - the real meaning lives in your head, not in the code.",
        stack: [vagueFrame()],
      },
      {
        narr: "Now rename them to say what they hold: `t` becomes `timeoutSeconds`, `r` becomes `loginWorks`.\nThe values did not change - but the code now reads like a sentence, and there is nothing left to guess.",
        stack: [clearFrame()],
      },
      {
        narr: "The same rule fits functions. `check()` could check anything - a name that vague makes you open the function just to find out.\n`checkLogin()` says what it does, so you can read the line that calls it and move on.",
        stack: [funcFrame()],
      },
      {
        narr: "So a good **name** says what a value holds or what a function does - it turns a comment you would have to write into code that reads itself.\nAim for clear, not short and not epic: `timeoutSeconds` beats `t`, and it also beats `theNumberOfSecondsToWaitForLogin`.",
        stack: [clearFrame(), funcFrame()],
      },
    ],
  };
})();
