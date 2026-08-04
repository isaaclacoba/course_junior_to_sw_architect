/*
 * kernel/engine/plugins/git-plugin.js - the "git" archetype as a PRACTICE plugin
 * for the generic lesson engine (kernel/engine/lesson-engine.js).
 *
 * The archetype-specific middle and nothing else: a CodeLab.LineTerminal the
 * learner types real git commands into, a CodeLab.GitGraph beside it, and the
 * teaching-model git runtime (CodeLab.gitRun) in between. Everything the core
 * owns - header, goal list, XP + award, the result panel, prev/next nav,
 * setLocale fan-out - is deliberately absent; the plugin mounts a surface,
 * paints a card body, and hands each verdict back through ctx.report.
 *
 * Ratified UX (docs/architecture/git-track.md, "Practical page UX", 2026-08-04):
 *   - NO Check button. Pressing Enter runs the command AND re-checks the goal,
 *     like a real terminal.
 *   - The target is drawn IN PLACE on one canvas: commits the learner has are
 *     solid, the NEXT missing one is ghosted in the slot it will occupy, and
 *     off-plan commits are flagged. "Show whole target" ghosts all of them.
 *   - Off-plan commits BLOCK the pass until the learner undoes them or resets.
 *   - Buttons are Reset and Show solution (which prints the commands - the
 *     learner still types them).
 *
 * Nothing here re-implements comparison. window.KernelGitProgress
 * (kernel/engine/git-progress.js) answers achieved / missing / off-plan and
 * returns the union RepoState that makes the single-canvas visual possible; the
 * plugin only drives the widgets with it and maps its `reason` to chrome.
 *
 * AUTHORING SHAPE - a task carries its own start and target as COMMAND LISTS:
 *
 *   {
 *     title, concept, context, goal: [...],
 *     start:  ["git commit -m \"init\""],                  // replayed at render
 *     target: ["git commit -m \"init\"", "git branch fix"], // replayed at render
 *     solution: ["git branch fix"]                          // printed, never run
 *   }
 *
 * Commands, not literal RepoState JSON: a RepoState needs real Maps, so a JSON
 * data file cannot hold one without a hand-written revival step, and a list of
 * git lines is what the lesson author is already thinking in. Replaying them
 * through the SAME runtime the learner types into also means a start or target
 * that no real command sequence can produce is impossible by construction.
 * `commands` / `targetCommands` are accepted as aliases, and an already-built
 * RepoState object is taken as-is (the verifier and tests can pass one).
 *
 * i18n: the terminal and the git commands stay ENGLISH, exactly like the
 * runnable drills - only the chrome and the result-panel sentence go through
 * ctx.tr. The panel sentence embeds git-progress's English `reason` the same way
 * build-plugin embeds the lesson's expected output.
 *
 * Loaded two ways with no bundler (same UMD shape as the core):
 *   - browser: a <script> loads it after lesson-engine.js; it registers itself on
 *     window.LessonEngine and exposes nothing else.
 *   - node:    module.exports the plugin object, and it registers on the core it
 *     require()s, so it is unit-testable with a fake DOM + fake CodeLab.
 */
(function (root, factory) {
  "use strict";
  var LessonEngine =
    (root && root.LessonEngine) ||
    (typeof require === "function" ? require("../lesson-engine.js") : null);
  var plugin = factory();
  if (LessonEngine && LessonEngine.register) LessonEngine.register(plugin);
  if (typeof module === "object" && module.exports) {
    module.exports = plugin;
  }
})(typeof globalThis !== "undefined" ? globalThis : (typeof self !== "undefined" ? self : this), function () {
  "use strict";

  // Resolve every collaborator the same lazy way build-plugin does, so the
  // plugin is testable off a fake global and never hard-depends on script order
  // at module-eval time.
  function resolveLC() {
    var g = typeof globalThis !== "undefined" ? globalThis : null;
    if (g && g.LessonCommon) return g.LessonCommon;
    if (typeof require === "function") {
      try { return require("../../page-shell/lesson-common.js"); } catch (e) {}
    }
    return null;
  }
  function codeLab() {
    var g = typeof globalThis !== "undefined" ? globalThis : null;
    return (g && g.CodeLab) || null;
  }
  function gitProgress() {
    var g = typeof globalThis !== "undefined" ? globalThis : null;
    if (g && g.KernelGitProgress) return g.KernelGitProgress;
    if (typeof require === "function") {
      try { return require("../git-progress.js"); } catch (e) {}
    }
    return null;
  }
  function fill(tpl, vars) {
    var LC = resolveLC();
    return LC && LC.fill ? LC.fill(tpl, vars) : tpl;
  }
  function warn(message) {
    if (typeof console !== "undefined" && console.error) console.error(message);
  }

  // ---- authoring shape -> RepoState ----------------------------------------
  // Replay a list of git lines through the runtime the learner types into. A
  // line that errors is an authoring bug, not a learner mistake, so it is
  // reported loudly and the replay continues (the graph then shows the shortfall).
  // `files` are the paths the card says the folder holds: they are seeded as
  // UNTRACKED before anything runs, so the learner can see what there is to add,
  // `git status` tells the truth, and `git add nope.txt` fails like real git.
  // Start and target are seeded identically - otherwise the end-state grader
  // would read the seed itself as a difference.
  function replay(CL, commands, files) {
    var state = CL.gitInit();
    if (files && files.length && typeof CL.gitAddFiles === "function") {
      state = CL.gitAddFiles(state, files).state;
    }
    for (var i = 0; i < commands.length; i++) {
      var res = CL.gitRun(commands[i], state);
      if (res && res.error) {
        warn("git-plugin: setup command failed - '" + commands[i] + "': " + res.output);
      }
      if (res && res.state) state = res.state;
    }
    return state;
  }
  function isRepoState(s) {
    return !!(s && s.commits && s.commits.get && s.refs && s.refs.forEach && s.head);
  }
  function toState(CL, spec, files) {
    if (Array.isArray(spec)) return replay(CL, spec, files);
    if (isRepoState(spec)) return spec;
    return replay(CL, [], files);
  }

  // Which files the card's folder holds. Two sources, unioned:
  //  - inferred: any path the card itself adds (start, target or solution). If a
  //    card says `git add cat.txt`, then cat.txt obviously exists.
  //  - declared `files`: the override, for files that must be VISIBLE but never
  //    added - the `notes.md` a learner is asked to leave out.
  // Anything else still fails like real git, so `git add nope.txt` is an error.
  function filesOf(task) {
    if (!task) return [];
    var seen = Object.create(null);
    var out = [];
    function take(paths) {
      for (var i = 0; i < paths.length; i++) {
        if (seen[paths[i]]) continue;
        seen[paths[i]] = true;
        out.push(paths[i]);
      }
    }
    take(task.files || []);
    var lists = [startOf(task) || [], targetOf(task) || [], solutionOf(task)];
    for (var j = 0; j < lists.length; j++) {
      if (!Array.isArray(lists[j])) continue;
      for (var k = 0; k < lists[j].length; k++) take(addedPaths(lists[j][k]));
    }
    return out;
  }

  // The paths one `git add` line names. Flags and pathspecs like `.` or `-A` are
  // not filenames, so they seed nothing.
  function addedPaths(line) {
    var words = String(line || "").trim().split(/\s+/);
    if (words[0] !== "git" || words[1] !== "add") return [];
    var out = [];
    for (var i = 2; i < words.length; i++) {
      var w = words[i];
      if (!w || w.charAt(0) === "-" || w === "." || w === "*") continue;
      out.push(w);
    }
    return out;
  }

  // The terminal the learner types into. A lesson may inject its own shell (one
  // with extra commands); otherwise the default knows `git` plus the built-ins.
  // If the bundle is too old to carry a Shell we fall back to running git
  // directly, which costs `help` and typo hints but still teaches the lesson.
  function makeShell(CL, ctx) {
    var injected = ctx && ctx.cfg && ctx.cfg.shell;
    if (injected) return injected;
    if (!CL.Shell || typeof CL.createGitCommand !== "function") return null;
    return new CL.Shell().register(CL.createGitCommand());
  }
  function startOf(task) { return task && (task.start || task.commands); }
  function targetOf(task) { return task && (task.target || task.targetCommands); }
  function solutionOf(task) {
    var s = task && task.solution;
    if (Array.isArray(s)) return s;
    return s ? [s] : [];
  }

  // ---- the single canvas ---------------------------------------------------
  // One progress call feeds both the view and the verdict: the union RepoState
  // is laid out once, so a ghost can never land in a different row than the
  // solid commit it will become. The graph is mounted on the first paint, when
  // the current card's start state is known.
  function paint(surface, animate) {
    var p = gitProgress().progress(
      { actual: surface.state, target: surface.target },
      { all: surface.showAll }
    );
    surface.progress = p;
    var host = surface.ctx.hosts.graph;
    if (!surface.graph || !host) return p;
    var overlay = { ghost: p.ghost, diverged: p.diverged };
    if (surface.mounted) {
      surface.graph.setState(p.union, { ghost: overlay.ghost, diverged: overlay.diverged, animate: !!animate });
    } else {
      surface.graph.mount(host, { state: p.union, ghost: overlay.ghost, diverged: overlay.diverged });
      surface.mounted = true;
    }
    return p;
  }

  // ---- verdict text --------------------------------------------------------
  // Two surfaces, one decision. The terminal line is English (the terminal is
  // English-only by design); the result-panel sentence is the localized one.
  function offPlanEnglish(n) {
    return n === 1
      ? "One commit here is not part of this exercise, so this card cannot pass. Undo it, or press Reset to start the exercise over."
      : n + " commits here are not part of this exercise, so this card cannot pass. Undo them, or press Reset to start the exercise over.";
  }
  function messageFor(ctx, p) {
    var tr = ctx.tr;
    // Off-plan work is checked FIRST: git-progress already forces solved:false,
    // but its `reason` names the next missing step whenever one exists, which
    // would leave the learner with no idea why a finished-looking card is stuck.
    if (p.diverged.length) {
      return p.diverged.length === 1
        ? tr("result.gitOffPlanOne", offPlanEnglish(1))
        : fill(
          tr("result.gitOffPlan", "{count} commits here are not part of this exercise, so this card cannot pass. Undo them, or press Reset to start the exercise over."),
          { count: p.diverged.length }
        );
    }
    if (p.solved) {
      return tr("result.gitPass", "The repository has the shape the task asked for. XP awarded.");
    }
    return fill(tr("result.gitNotYet", "Not there yet - {reason}."), { reason: p.reason });
  }

  // The "Show whole target" affordance has no page-shell element of its own -
  // the plugin owns it, so it also owns its label across a language swap. No
  // data-t marker: repaintChrome would fight the toggled label.
  function labelTarget(surface) {
    var btn = surface.targetBtn;
    if (!btn) return;
    btn.textContent = surface.showAll
      ? surface.ctx.tr("nav.showNextStep", "Show next step only")
      : surface.ctx.tr("nav.showTarget", "Show whole target");
  }
  function makeTargetButton(ctx) {
    var actions = ctx.hosts.actions;
    if (!actions || typeof document === "undefined" || !document.createElement) return null;
    var btn = document.createElement("button");
    btn.id = ctx.prefix + "Target";
    btn.type = "button";
    btn.className = "btn";
    actions.appendChild(btn);
    return btn;
  }

  var GitPlugin = {
    archetype: "git",

    // Mount the terminal ONCE and wire the plugin's buttons. The graph waits for
    // the first renderCard, which is where a card's start state becomes known.
    mount: function (ctx) {
      var CL = codeLab();
      var GP = gitProgress();
      if (!CL || !CL.LineTerminal || !CL.GitGraph || typeof CL.gitRun !== "function" || !GP) {
        warn(
          "git-plugin: needs CodeLab (LineTerminal, GitGraph, gitRun) and KernelGitProgress; " +
          "the lesson body stays inert."
        );
        return { ctx: ctx, inert: true };
      }

      var hosts = ctx.hosts;
      var surface = {
        ctx: ctx,
        inert: false,
        terminal: null,
        graph: new CL.GitGraph(),
        mounted: false,
        task: null,
        taskIndex: 0,
        start: null,
        state: null,
        target: null,
        showAll: false,
        progress: null,
        targetBtn: makeTargetButton(ctx),
      };

      if (hosts.terminal) {
        surface.shell = makeShell(CL, ctx);
        surface.terminal = new CL.LineTerminal();
        surface.terminal.mount(hosts.terminal, {
          prompt: (ctx.cfg && ctx.cfg.prompt) || "$",
          onCommand: function (line) { GitPlugin.run(surface, line); },
        });
      }
      // Ratified: no Check button. A page shell that still emits one must not
      // show a dead control.
      if (hosts.check) hosts.check.hidden = true;

      if (hosts.solution) {
        hosts.solution.addEventListener("click", function () {
          GitPlugin.showSolution(surface, surface.task);
        });
      }
      if (hosts.reset) {
        hosts.reset.addEventListener("click", function () {
          GitPlugin.reset(surface, surface.task);
        });
      }
      if (surface.targetBtn) {
        surface.targetBtn.addEventListener("click", function () {
          GitPlugin.showTarget(surface);
        });
      }
      labelTarget(surface);
      return surface;
    },

    // Paint one practice card body. Every card is a fresh exercise: its own start
    // state, its own target, an empty terminal, and the ghost depth back to "next
    // step only".
    renderCard: function (surface, task, i) {
      if (surface.inert) return;
      var CL = codeLab();
      surface.task = task;
      surface.taskIndex = i;
      surface.showAll = false;
      var files = filesOf(task);
      surface.start = toState(CL, startOf(task), files);
      surface.target = toState(CL, targetOf(task), files);
      surface.state = surface.start;
      if (surface.terminal) surface.terminal.clear();
      labelTarget(surface);
      paint(surface, false);
    },

    // One learner line. This IS the grading loop - there is no Check button, so
    // every Enter runs the command and re-checks the goal.
    run: function (surface, line) {
      if (surface.inert || !surface.task) return null;
      var CL = codeLab();
      var res;
      try {
        res = surface.shell
          ? surface.shell.run(line, surface.state)
          : CL.gitRun(line, surface.state);
      } catch (err) {
        res = { state: surface.state, output: (err && err.message) || String(err), error: true };
      }
      if (res && res.state) surface.state = res.state;
      // `clear` wipes the scrollback: the shell decides, the view carries it out.
      if (res && res.effect && res.effect.kind === "clear" && surface.terminal) {
        surface.terminal.clear();
      }
      if (surface.terminal && res && res.output) {
        surface.terminal.write(res.output, res.error ? "err" : "out");
      }
      var p = paint(surface, true);
      surface.ctx.report({
        ok: p.solved,
        reason: p.reason,
        message: messageFor(surface.ctx, p),
      });
      return p;
    },

    // Print the solution into the scrollback. It is NOT run: typing it is the
    // exercise, and the learner still watches each ghost turn solid.
    showSolution: function (surface, task) {
      var t = task || surface.task;
      if (surface.inert || !t || !surface.terminal) return;
      var commands = solutionOf(t);
      if (!commands.length) return;
      surface.terminal.write("Type these, one line at a time:", "warn");
      for (var i = 0; i < commands.length; i++) surface.terminal.write(commands[i], "out");
      surface.terminal.focus();
    },

    // Back to the card's start state: the repo, the scrollback, and the graph.
    // The result panel is hidden rather than repainted - the learner has not run
    // anything yet in the restarted exercise.
    reset: function (surface, task) {
      if (surface.inert) return;
      var t = task || surface.task;
      if (!t) return;
      surface.state = surface.start || toState(codeLab(), startOf(t), filesOf(t));
      if (surface.terminal) {
        surface.terminal.clear();
        surface.terminal.focus();
      }
      if (surface.ctx.hosts.result) surface.ctx.hosts.result.hidden = true;
      paint(surface, false);
    },

    // Ghost depth toggle: the whole target, or only the next step (the default,
    // so the finished shape is not copyable from second zero).
    showTarget: function (surface) {
      if (surface.inert) return;
      surface.showAll = !surface.showAll;
      labelTarget(surface);
      paint(surface, true);
    },

    // The core re-localizes its own chrome; the only label the plugin owns is
    // the target toggle it created. The terminal scrollback and the repo state
    // are the learner's work and are left untouched.
    setLocale: function (surface) {
      if (!surface || surface.inert) return;
      labelTarget(surface);
    },
  };

  return GitPlugin;
});
