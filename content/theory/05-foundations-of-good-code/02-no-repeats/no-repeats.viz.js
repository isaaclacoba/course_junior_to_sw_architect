// Visual for "Don't repeat yourself" - data-only. No board: the stack region is
// reused as labelled slots showing WHERE a piece of logic lives. Two copies of
// the same rule drift apart when only one is fixed; extracting it into one named
// function puts the rule in a single place every caller shares.
(function () {
  "use strict";

  const slot = (id, k, v) => ({ id, k, v });

  const twoCopies = () => ({
    id: "copies", name: "the same rule, copied",
    vars: [
      slot("a", "signup form", "price = base * 1.21"),
      slot("b", "checkout page", "price = base * 1.21"),
    ],
  });
  const drifted = () => ({
    id: "drift", name: "one copy fixed, one missed",
    vars: [
      slot("a", "signup form", "price = base * 1.21  \u2717 stale"),
      slot("b", "checkout page", "price = base * 1.10"),
    ],
  });
  const oneHome = () => ({
    id: "one", name: "one named home",
    vars: [
      slot("f", "priceWithTax()", "base * 1.10"),
    ],
  });
  const shared = () => ({
    id: "share", name: "every caller shares it",
    vars: [
      slot("a", "signup form", "priceWithTax(base)"),
      slot("b", "checkout page", "priceWithTax(base)"),
    ],
  });

  window.LESSON_VIZ = {
    scene: { board: false, regions: ["stack"], zoomTab: false },
    regionTags: { stack: "WHERE THE RULE LIVES <span>\u00b7 one place, or many</span>" },
    chipName: "logic",
    chipAddr: "say it once",
    steps: [
      {
        narr: "Copy-paste feels fast. Here the same tax rule sits in two places - the signup form and the checkout page.\nRight now they agree, so nothing looks wrong.",
        stack: [twoCopies()],
      },
      {
        narr: "This is **duplication**: the same piece of knowledge written more than once.\nThe cost is hidden until the rule changes - and rules always change.",
        stack: [twoCopies()],
      },
      {
        narr: "The tax rate changes, so you update the checkout page. You forget the signup form still says the old rate.\nNow the two copies disagree, and one of them is quietly wrong.",
        stack: [drifted()],
      },
      {
        narr: "The fix is to say it once. Move the rule into a single function with a clear name - `priceWithTax()` - so it lives in exactly one home.",
        stack: [oneHome()],
      },
      {
        narr: "Now both pages call that one function instead of keeping their own copy.\nChange the rule in one place and every caller gets it - there is no second copy left to forget.",
        stack: [shared()],
      },
      {
        narr: "So **don't repeat yourself**: each piece of knowledge belongs in one place.\nWhen you feel the urge to copy-paste logic, give it a name and call it instead - your future self only has to fix it once.",
        stack: [oneHome(), shared()],
      },
    ],
  };
})();
