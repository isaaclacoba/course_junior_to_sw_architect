  // Optional interactive visual for a lesson, supplied as a DECOUPLED data file
  // (window.LESSON_VIZ, e.g. theory-N.viz.js) and mounted once, right under the
  // hero. Keeps the lesson's text (drill data) and its visual (viz config) apart.
  if (window.LESSON_VIZ && window.CodeLab && window.CodeLab.MemoryViz) {
    const vizHost = document.createElement("section");
    vizHost.className = "lesson-viz";
    hero.insertAdjacentElement("afterend", vizHost);
    if (!window.LESSON_VIZ.nextHref) window.LESSON_VIZ.nextHref = page.nextHref;
    // Track progress: mark the lesson done + award XP when the last step is
    // reached. A migrated lesson carries its exact key in LESSON_META; a flat
    // page derives it from the filename (theory-5.html -> theory_5_awarded) so it
    // matches the card on the index, unless the lesson sets its own.
    if (!window.LESSON_VIZ.awardedKey) {
      if (window.LESSON_META && window.LESSON_META.key) {
        window.LESSON_VIZ.awardedKey = window.LESSON_META.key;
      } else {
        const file = (location.pathname.split("/").pop() || "").replace(/\.html$/, "");
        if (/^[a-z0-9]+(-[a-z0-9]+)*$/i.test(file)) {
          window.LESSON_VIZ.awardedKey = file.replace(/-/g, "_") + "_awarded";
        }
      }
    }
    // Pull the MemoryViz chrome strings from the shared catalog (viz.* keys) so a
    // non-default language localizes the transport, font control, transcript
    // author tags and tool-rack directions. Absent keys keep code-lab's English
    // defaults, so the default language stays byte-identical.
    const applyVizLabels = () => {
      const C = window.ChromeText;
      if (!C) return;
      const keys = ["prev", "play", "pause", "next", "nextLesson", "reset", "step", "textSize", "textSmall", "textDefault", "textLarge", "authorYou", "authorApp", "authorModel", "authorCode", "toolCall", "toolError", "toolResult", "fanCaption"];
      const labels = {};
      let any = false;
      keys.forEach((k) => { const v = C["viz." + k]; if (v != null) { labels[k] = v; any = true; } });
      if (any) window.LESSON_VIZ.labels = labels;
    };
    try {
      applyVizLabels();
      let vizController = window.CodeLab.MemoryViz.create(vizHost, window.LESSON_VIZ);
      // Localizable surface: a language swap re-binds LESSON_VIZ's narrations
      // (bind-viz), then this re-creates the visual so the new text paints.
      // destroy() removes the old root; a fresh create restarts at step 1, which
      // is acceptable on a language change.
      window.PageShellViz = {
        setLocale: () => {
          try { if (vizController && vizController.destroy) vizController.destroy(); } catch (e) {}
          vizHost.innerHTML = "";
          try {
            applyVizLabels();
            vizController = window.CodeLab.MemoryViz.create(vizHost, window.LESSON_VIZ);
          } catch (e) {
            console.error("lesson-viz relocalize failed", e);
          }
        },
      };
    } catch (err) {
      console.error("lesson-viz mount failed", err);
      vizHost.remove();
    }
  }

  // Optional graded checkpoint, supplied as a DECOUPLED data file
  // (window.QUIZ_CONFIG, e.g. theory-check-N.js) and mounted as the code-lab
  // Quiz component - the assessment logic lives in code-lab, not here.
  if (window.QUIZ_CONFIG && window.CodeLab && window.CodeLab.Quiz) {
    const quizHost = document.createElement("section");
    quizHost.className = "lesson-quiz";
    hero.insertAdjacentElement("afterend", quizHost);
    if (!window.QUIZ_CONFIG.nextHref) window.QUIZ_CONFIG.nextHref = page.nextHref;
    // Pull the Quiz's chrome strings from the shared catalog (quiz.* keys) so a
    // non-default language localizes the result/feedback text. Absent keys keep
    // code-lab's English defaults, so the default language stays byte-identical.
    const applyQuizLabels = () => {
      const C = window.ChromeText;
      if (!C) return;
      const keys = ["knowledgeCheck", "submit", "retry", "continue", "progressPassed", "progressFresh", "progressScored", "answerAll", "stillNeeds", "correctPrefix", "notQuitePrefix", "passTitle", "failTitle", "scoredLine", "passTail", "failTail", "xpLine", "courseXp"];
      const labels = {};
      let any = false;
      keys.forEach((k) => { const v = C["quiz." + k]; if (v != null) { labels[k] = v; any = true; } });
      if (any) window.QUIZ_CONFIG.labels = labels;
    };
    try {
      applyQuizLabels();
      let quizController = window.CodeLab.Quiz.create(quizHost, window.QUIZ_CONFIG);
      // Localizable surface: a language swap re-binds QUIZ_CONFIG's strings
      // (bind-checkpoint), then this re-creates the Quiz so the new text paints.
      // destroy() removes the old root; a fresh create redraws a question set,
      // which is acceptable on a language change.
      window.PageShellCheckpoint = {
        setLocale: () => {
          try { if (quizController && quizController.destroy) quizController.destroy(); } catch (e) {}
          quizHost.innerHTML = "";
          try {
            applyQuizLabels();
            quizController = window.CodeLab.Quiz.create(quizHost, window.QUIZ_CONFIG);
          } catch (e) {
            console.error("lesson-quiz relocalize failed", e);
          }
        },
      };
    } catch (err) {
      console.error("quiz mount failed", err);
      quizHost.remove();
    }
  }
