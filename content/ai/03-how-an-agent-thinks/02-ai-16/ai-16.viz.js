// Visual for ai-16 "Planning" - a DATA-ONLY file. It uses the `planboard` panel:
// a goal decomposed into an ordered list of smaller steps, worked one at a time,
// each carrying a state (pending, active, done, blocked). It shows task
// decomposition and re-planning when a step gets stuck - the "planning" pillar of
// an agent's brain.
(function () {
  "use strict";

  const GOAL = "Plan a weekend trip to Lisbon";

  window.LESSON_CONFIG = {
    code: [],
    legend: [
      { sw: "#ffd479", label: "the step being worked now" },
      { sw: "#37d3a6", label: "a finished step" },
      { sw: "#e0708a", label: "a blocked step - time to re-plan" },
    ],
    layout: {
      visual: [{ type: "planboard" }],
      aside: [{ type: "narration" }, { type: "controls" }],
    },
    steps: [
      {
        narr: "One goal, far too big to do in a single move. Booking, timing, budget, an itinerary - all tangled together. The first thing a capable agent does is not act. It **plans**.",
        plan: { caption: "A goal, no plan yet", goal: GOAL, steps: [] },
      },
      {
        narr: "It breaks the goal into an ordered list of smaller steps - **task decomposition**. Each step is small enough to actually do, and the order captures what depends on what: you need dates before you can search flights.",
        plan: {
          caption: "Decompose the goal into steps",
          goal: GOAL,
          steps: [
            { text: "Check the travel dates" },
            { text: "Search flights for those dates" },
            { text: "Pick the cheapest good option" },
            { text: "Find a hotel near the centre" },
            { text: "Draft a day-by-day itinerary" },
          ],
        },
      },
      {
        narr: "Now it works **one step at a time**. Step one: check the dates - it recalls them from memory. Doing a single step keeps the model focused, instead of juggling the whole trip at once.",
        plan: {
          caption: "Work the plan, one step at a time",
          goal: GOAL,
          steps: [
            { text: "Check the travel dates", state: "active" },
            { text: "Search flights for those dates" },
            { text: "Pick the cheapest good option" },
            { text: "Find a hotel near the centre" },
            { text: "Draft a day-by-day itinerary" },
          ],
        },
      },
      {
        narr: "Step done, it moves on. Step two calls the flight-search tool; step three picks from what came back. Each finished step shrinks what is left and feeds the next.",
        plan: {
          caption: "Each finished step feeds the next",
          goal: GOAL,
          steps: [
            { text: "Check the travel dates", state: "done", note: "3 to 7 May" },
            { text: "Search flights for those dates", state: "done", note: "3 options found" },
            { text: "Pick the cheapest good option", state: "active" },
            { text: "Find a hotel near the centre" },
            { text: "Draft a day-by-day itinerary" },
          ],
        },
      },
      {
        narr: "Not everything goes to plan. The hotel step comes back empty - nothing free near the centre. A rigid script would break here. An agent treats it as a **signal**, not a dead end.",
        plan: {
          caption: "A step gets blocked",
          goal: GOAL,
          steps: [
            { text: "Check the travel dates", state: "done", note: "3 to 7 May" },
            { text: "Search flights for those dates", state: "done", note: "3 options found" },
            { text: "Pick the cheapest good option", state: "done", note: "the 9am, EUR 140" },
            { text: "Find a hotel near the centre", state: "blocked", note: "nothing free near the centre" },
            { text: "Draft a day-by-day itinerary" },
          ],
        },
      },
      {
        narr: "So it **re-plans**: rework the blocked step and add a fallback - widen the search, take a room one metro stop out. The plan is not carved in stone; it is a living list the agent revises as it learns.",
        plan: {
          caption: "Re-plan around the block",
          goal: GOAL,
          steps: [
            { text: "Check the travel dates", state: "done", note: "3 to 7 May" },
            { text: "Search flights for those dates", state: "done", note: "3 options found" },
            { text: "Pick the cheapest good option", state: "done", note: "the 9am, EUR 140" },
            { text: "Widen the hotel search to nearby areas", state: "active" },
            { text: "Book a room one metro stop out" },
            { text: "Draft a day-by-day itinerary" },
          ],
        },
      },
      {
        narr: "With a room found, the last steps fall into place. That is **planning**: turn a big goal into an ordered list of small steps, do them one at a time, and revise when a step gets stuck. It is what keeps an agent on track across a long task instead of losing the thread after the first move.",
        plan: {
          caption: "The plan carried out",
          goal: GOAL,
          steps: [
            { text: "Check the travel dates", state: "done", note: "3 to 7 May" },
            { text: "Search flights for those dates", state: "done", note: "3 options found" },
            { text: "Pick the cheapest good option", state: "done", note: "the 9am, EUR 140" },
            { text: "Widen the hotel search to nearby areas", state: "done", note: "found one nearby" },
            { text: "Book a room one metro stop out", state: "done", note: "booked" },
            { text: "Draft a day-by-day itinerary", state: "done" },
          ],
        },
      },
    ],
  };
})();
