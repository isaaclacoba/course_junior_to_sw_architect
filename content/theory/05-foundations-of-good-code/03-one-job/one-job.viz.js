// Visual for "One function, one job" - data-only. No board: the stack region is
// reused as labelled slots listing what a function does. One function doing three
// jobs forces a vague name and blocks reuse; splitting it into three
// single-purpose functions gives each a clear name and lets a caller pick one.
(function () {
  "use strict";

  const slot = (id, k, v) => ({ id, k, v });

  const overloaded = () => ({
    id: "big", name: "handleUser() \u00b7 does three things",
    vars: [
      slot("j1", "1. load", "read the user from a file"),
      slot("j2", "2. check", "is the login valid?"),
      slot("j3", "3. save", "write the result back"),
    ],
  });
  const stuck = () => ({
    id: "stuck", name: "you only need the check",
    vars: [
      slot("s1", "call handleUser()", "but it also loads and saves \u2717"),
    ],
  });
  const split = () => ({
    id: "split", name: "three jobs, three functions",
    vars: [
      slot("f1", "loadUser()", "read the user"),
      slot("f2", "checkLogin()", "is the login valid?"),
      slot("f3", "saveUser()", "write the result"),
    ],
  });
  const reused = () => ({
    id: "reuse", name: "now a caller picks one",
    vars: [
      slot("r1", "call checkLogin()", "just the check, nothing else \u2713"),
    ],
  });

  window.LESSON_CONFIG = {
    scene: { board: false, regions: ["stack"], zoomTab: false },
    regionTags: { stack: "WHAT A FUNCTION DOES <span>\u00b7 one job, or many</span>" },
    chipName: "function",
    chipAddr: "one job each",
    steps: [
      {
        narr: "Here is one function, `handleUser()`, doing three separate jobs: it loads a user, checks the login, then saves the result.\nIt runs fine - but look at how much it is holding.",
        stack: [overloaded()],
      },
      {
        narr: "The first cost is the name. Because it does three things, no honest name fits - so it ends up vague, like `handleUser`.\nA vague name tells the reader nothing; they have to open the function to find out what it really does.",
        stack: [overloaded()],
      },
      {
        narr: "The second cost is reuse. Suppose elsewhere you only want to check a login.\nYou cannot - calling `handleUser()` would also load and save, which you did not ask for. The check is tangled up with the rest.",
        stack: [stuck()],
      },
      {
        narr: "So give each job its own function: `loadUser()`, `checkLogin()`, `saveUser()`.\nEach does one thing, so each earns a clear, honest name.",
        stack: [split()],
      },
      {
        narr: "Now a caller reaches for exactly the piece it needs - just `checkLogin()`, nothing else comes along.\nSmall single-purpose functions snap together like building blocks.",
        stack: [reused()],
      },
      {
        narr: "So aim for **one function, one job**. It is easier to name, easier to reuse, and easier to check on its own.\nThis is the everyday seed of a design idea you will meet later - giving each piece a single responsibility.",
        stack: [split()],
      },
    ],
  };
})();
