/**
 * tools/lib/lesson-validators.mjs - the archetype VALIDATOR REGISTRY.
 *
 * tools/verify-lesson.mjs used to dispatch on archetype with an if/else chain
 * inside verifyLesson, and a second one inside the render check. Every new
 * archetype was another branch in two places, and the archetype that had no
 * branch - `git` - was verified by nothing while still being reported as passed.
 *
 * So dispatch is now DATA. A validator is a plain object:
 *
 *   {
 *     archetype,              // the meta.js archetype it answers for
 *     bodyField,              // the LESSON_CONFIG array that IS its body
 *     verify(ctx) -> boolean, // ctx = { config, opts }; reports as it goes
 *     rendered(dom) -> boolean// did the BODY paint, not just the page furniture
 *   }
 *
 * and adding a sixth archetype is one entry in createValidators(), not a branch.
 *
 * Every collaborator a validator needs is INJECTED through createValidators(deps):
 * the reporter functions, the dotnet runner, the shared grading policy, and the
 * loaded code-lab bundle. Nothing here reaches for a module-level singleton, so
 * each validator is testable with fakes.
 */
import { CONFIG_GLOBALS, lessonBody } from "../lib.mjs";
import { checkGitTask, gitRuntimeFrom, replay, startOf, solutionOf, filesOf } from "./git-validate.mjs";
import { createRequire } from "node:module";

const require_ = createRequire(import.meta.url);
const structure = require_("../../kernel/grading/structure-match.js");
// The SAME policy the browser widget paints with, so a gate CI calls dead is the
// gate the learner sees stay dashed - there is no second opinion to drift from.
const gitGoals = require_("../../kernel/grading/git-goal-match.js");

// Scene-panel roots a viz lesson may mount.
export const PANEL_CLASSES = ["cl-tx", "cl-al", "cl-rg", "cl-pb", "cl-mv", "cl-ms", "cl-tr", "cl-ag"];

function firstError(errs) {
  const line = (errs.split(/\r?\n/).find((l) => /error [A-Z]{2}\d+/.test(l)) || errs.split(/\r?\n/)[0] || "").trim();
  return "    " + line.slice(0, 200);
}

/**
 * Resolve a lesson's body the way every gate does.
 *
 * tools/lib.mjs owns that rule for the archetypes it knows, and delegating keeps
 * the failure messages of build/drill/viz/checkpoint byte-identical across the
 * three gates. It does not (yet) carry `git` - test/lesson-body.test.js pins that
 * - so a registered archetype lib.mjs has never heard of is resolved here by the
 * SAME rule rather than by a forked one. An archetype neither knows fails with
 * lib.mjs's own wording.
 */
export function resolveBody(win, archetype, validator) {
  if (CONFIG_GLOBALS[archetype]) return lessonBody(win, archetype);
  if (!validator || !validator.bodyField) return { ok: false, reason: `unknown archetype "${archetype}"` };
  const field = validator.bodyField;
  const config = win && win.LESSON_CONFIG;
  if (!config) return { ok: false, reason: "no lesson config - looked for window.LESSON_CONFIG" };
  const body = config[field];
  if (!Array.isArray(body)) {
    return { ok: false, reason: `window.LESSON_CONFIG.${field} is ${body === undefined ? "missing" : typeof body}, expected an array` };
  }
  if (body.length === 0) {
    return { ok: false, reason: `window.LESSON_CONFIG.${field} is empty - the lesson has no body` };
  }
  return { ok: true, global: "LESSON_CONFIG", config, field, count: body.length };
}

/**
 * deps = {
 *   report:  { ok, bad, skip, note },
 *   dotnet:  { available(), compileRun(source) },
 *   grading: { matches, buildProbe },   // kernel/grading/output-match.js
 *   codeLab: () => CodeLab,             // the loaded vendored bundle
 * }
 */
export function createValidators(deps) {
  const { ok, bad, skip, note } = deps.report;

  // Task titles are LOCALIZED - they live in res/strings, not in data.js - so
  // `t.title` is legitimately empty for every migrated lesson and the label used
  // to read `task 2 ""`. Empty quotes read as a broken renderer, which is
  // exactly the kind of noise that trains a reader to skim past real findings.
  const taskLabel = (t, i) => {
    const title = (t.title || "").slice(0, 40);
    return title ? `task ${i + 1} "${title}"` : `task ${i + 1}`;
  };
  const { matches, buildProbe } = deps.grading;

  // Mirrors TeachingWarningIds in the compiler host: the diagnostics the run
  // surface actually shows. Anything outside this set stays a note, so the gate
  // enforces exactly what a learner sees and not a stricter private standard.
  //
  // CS8618 is deliberately NOT here even though the host lists it. `dotnet new
  // console` turns nullable reference types on, the browser host does not, so
  // this project sees CS8618 on code the learner never gets warned about. Failing
  // on it would mean failing lessons over a diagnostic that does not exist where
  // it matters. It is reported below as its own note instead.
  const SHOWN_WARNING_IDS = new Set([
    "CS1717", "CS1718", "CS0162", "CS0164", "CS0168",
    "CS0169", "CS0219", "CS0414", "CS0472", "CS0652",
  ]);

  // --- build / drill: compile + run each task's solution ---------------------
  function verifyCompiled({ config, opts }) {
    if (opts.noDotnet) { skip("dotnet compile (--no-dotnet)"); return true; }
    if (!deps.dotnet.available()) { skip("dotnet compile (no dotnet on PATH)"); return true; }
    const compileRun = deps.dotnet.compileRun;
    let allOk = true;
    const tasks = (config.tasks || []).filter((t) => !t.summary);
    tasks.forEach((t, i) => {
      const label = taskLabel(t, i);
      if (!t.solution) { skip(`${label} - no solution`); return; }
      const run = compileRun(t.solution);
      if (!run.built) { bad(`${label} solution did not compile\n${firstError(run.errors)}`); allOk = false; return; }
      if (!matches((run.output || "").trim(), t.expected)) {
        bad(`${label} output != expected\n    expected: ${JSON.stringify(t.expected)}\n    got: ${JSON.stringify((run.output || "").trim())}`);
        allOk = false;
      } else ok(`${label} solution runs and matches expected`);
      // The runner shows these same ids to the learner. A solution that trips one
      // would hand them a warning panel on the answer we told them was right, so
      // this is a failure and not a note. The list mirrors TeachingWarningIds in
      // code-lab/compiler-host/Services/CompilerService.cs - keep the two in step.
      const shown = (run.warningIds || []).filter((id) => SHOWN_WARNING_IDS.has(id));
      if (shown.length) {
        bad(`${label} solution compiles with warning(s) the learner would be shown: ${shown.join(", ")}`);
        allOk = false;
      } else if (run.warnings) note(`solution compiled with ${run.warnings} warning(s), none shown to the learner`);
      // Not learner-visible today, but it IS the house rule (an uninitialised
      // string field starts null), so it is worth surfacing without failing.
      if ((run.warningIds || []).includes("CS8618")) {
        note(`${label} solution has an uninitialised non-nullable field (CS8618 under real dotnet; the browser does not warn). Give it a default.`);
      }

      for (const req of t.requireSource || []) {
        const re = req.pattern instanceof RegExp ? req.pattern : new RegExp(req.pattern);
        if (re.test(t.solution)) ok(`${label} requireSource /${re.source}/ matches solution`);
        else { bad(`${label} requireSource /${re.source}/ does NOT match solution`); allOk = false; }
      }
      if (t.verify && t.verify.main) {
        const probe = compileRun(buildProbe(t.solution, t.verify.main));
        if (!probe.built) { bad(`${label} verify probe did not compile\n${firstError(probe.errors)}`); allOk = false; }
        else if (!matches((probe.output || "").trim(), t.verify.expected)) {
          bad(`${label} verify probe output != verify.expected (${JSON.stringify(t.verify.expected)}); got ${JSON.stringify((probe.output || "").trim())}`);
          allOk = false;
        } else ok(`${label} hidden verify probe passes`);
      }
    });
    return allOk;
  }

  // The live goal tracker must be able to LIGHT UP. Every blueprint member and
  // every goal gate is asserted against the authored solution, because a gate
  // that can never be met is the worst kind of bug this repo keeps producing: a
  // check that simply goes quiet. A learner would see a box that stays dashed no
  // matter what they write, and conclude their correct answer was wrong.
  function checkTracker(t, label, fail) {
    // Local record of whether anything in THIS tracker failed. `fail` reports
    // upward but tells us nothing, so without this the summary line below would
    // print "lights up fully" straight under a list of rows that never tick.
    let trackerOk = true;
    const note = () => { trackerOk = false; fail(); };
    const goals = t.goals || [];
    const gates = goals.map((g) => g && g.gate !== undefined ? g.gate : undefined);
    if (!gates.length) return;

    const CL = deps.codeLab();
    if (!CL || typeof CL.scanCSharp !== "function") {
      bad(`${label} has a goal tracker but the vendored bundle exports no scanCSharp - re-vendor vendor/code-lab/code-lab.global.js`);
      note();
      return;
    }
    const types = CL.scanCSharp(t.solution || "").types || [];

    // A goals array is index-aligned with the localized goal prose it ticks,
    // so a count mismatch silently attaches ticks to the wrong sentences.
    const proseCount = (t.goal || []).length;
    if (gates.length && proseCount && gates.length !== proseCount) {
      bad(`${label} has ${gates.length} goals entry/entries for ${proseCount} goal line(s) - they are index-aligned, so the counts must match`);
      note();
    }
    // null gate = run-gated (about OUTPUT, not shape). Any non-null gate must
    // light up on the solution or it is a checklist item nobody can ever satisfy.
    structure.evaluate(types, gates, t.solution || "").forEach((met, i) => {
      if (met === false) {
        bad(`${label} goals[${i}].gate (${structure.describe(gates[i])}) is NOT met by the solution - it could never tick`);
        note();
      }
    });
    // Every MEMBER ROW is a subtask with its own tick, so each one has to light
    // up too. A row naming a member the solution never declares - a renamed
    // field, a constructor signature that drifted - would sit grey forever and
    // read as "your correct answer is wrong".
    let rowCount = 0;
    if (typeof structure.rows === "function") {
      goals.forEach((g, i) => {
        const code = g && g.code;
        if (!code) return;
        const list = Array.isArray(code) ? code : [code];
        // A run-gated blueprint box has no gate, but its rows are still claims
        // about the solution's shape and a typo in one is just as invisible.
        // Derive the type from the header ("class Cat", "Cat : IAnimal").
        let gate = gates[i];
        if (gate === null || gate === undefined) {
          const head = String(structure.rowLabel ? structure.rowLabel(list[0]) : list[0] || "")
            .split(":")[0].trim().split(/\s+/).pop();
          if (!head) return;
          gate = { type: head };
        }
        const verdicts = structure.rows(types, gate, list, t.solution || "");
        verdicts.forEach((met, r) => {
          rowCount++;
          if (met !== true) {
            const shown = structure.rowLabel ? structure.rowLabel(list[r]) : list[r];
            const how = list[r] && typeof list[r] === "object"
              ? ` (step row watching for \`${list[r].writes || list[r].gone}\`)` : "";
            bad(`${label} goals[${i}].code[${r}] ("${shown}")${how} is NOT found in the solution - that subtask row could never tick`);
            note();
          }
        });
      });
    }
    checkGranularity(t, label, types, note);
    checkCallSiteTracked(t, label, types, note);
    if (trackerOk) {
      ok(`${label} goal tracker lights up fully on the solution (${gates.length} gate(s), ${rowCount} row(s))`);
    }
  }

  // Rows that LIGHT UP are only half the contract. The other half is that the
  // box actually SHOWS the work: a blueprint listing nothing but `class Cat`
  // passes every check above while telling the learner nothing, and its single
  // tick flips from grey to green in one jump with no sense of progress.
  //
  // So every member the learner has to ADD - each field, the constructor, each
  // method present in the solution but not in the starter - must have its own
  // row. That is what makes the tracker a set of subtasks instead of a
  // pass/fail lamp, and it is the piece an author forgets first.
  // The granularity check above reads DECLARATIONS, so it is blind to the one
  // place a card almost always changes and almost never tracks: the caller.
  // Rewiring `Main` declares no field and no method - it is statements inside a
  // method that already existed - so a card can move every line of it and every
  // check here still passes while the tracker says nothing at all.
  //
  // That is not a hypothetical. Four of the seven SOLID cards rewired `Main`
  // with no row watching it, and the learner was left to infer the last step of
  // the refactor from the expected output. So: if the caller's body changes
  // between starter and solution, some box must be watching it.
  function checkCallSiteTracked(t, label, solTypes, fail) {
    const CL = deps.codeLab();
    let starterSrc = t.starter || "";
    if (!starterSrc || !t.solution) return;

    const holder = solTypes.find((x) => (x.members || []).some((m) => m.name === "Main"));
    if (!holder) return;

    // Comments are not work, and neither is reindenting.
    const bodyOf = (src) => structure.squeeze(
      structure.stripComments(structure.typeBody(structure.stripComments(src), holder.name)));
    let before, after;
    try {
      before = bodyOf(starterSrc);
      after = bodyOf(t.solution);
    } catch {
      return;
    }
    if (!before || !after || before === after) return;

    const boxes = (t.goals || []).filter((g) => g && g.code).map((g) => {
      const list = Array.isArray(g.code) ? g.code : [g.code];
      return {
        head: String(structure.rowLabel(list[0]) || "").split(":")[0].trim().split(/\s+/).pop(),
        steps: list.slice(1).filter((r) => r && typeof r === "object").length,
      };
    });
    const box = boxes.find((b) => b.head === holder.name);
    if (!box) {
      bad(`${label} rewires \`${holder.name}.Main\` between starter and solution, but no goal box tracks it. ` +
        `Wiring the new pieces together is real work the learner must do - give it a "${holder.name}" box with a step row ` +
        `({ row, writes }) per move, or the last step of the refactor is the one step with no help.`);
      fail();
      return;
    }
    if (!box.steps) {
      bad(`${label} has a "${holder.name}" box but no step rows, so the rewiring of \`Main\` is untracked. ` +
        `Statements declare no symbol, so a member row can never see them - each move needs a { row, writes } step row.`);
      fail();
    }
  }

  function checkGranularity(t, label, solTypes, fail) {
    const CL = deps.codeLab();
    let starterTypes = [];
    try {
      starterTypes = CL.scanCSharp(t.starter || "").types || [];
    } catch (err) {
      // Swallowing this would abandon the whole granularity check with no
      // signal - the precise "check that simply goes quiet" failure this file
      // exists to catch. Say so and fail.
      bad(`${label} starter could not be scanned, so granularity was not checked: ${err && err.message ? err.message : err}`);
      fail();
      return;
    }

    (t.goals || []).forEach((g, i) => {
      const code = g && g.code;
      if (!code) return;
      const list = Array.isArray(code) ? code : [code];
      // "class Cat", "Cat : IAnimal" and "interface ILog" all name their type last.
      const head = String(structure.rowLabel ? structure.rowLabel(list[0]) : list[0] || "")
        .split(":")[0].trim().split(/\s+/).pop();
      const solType = solTypes.find((x) => x.name === head);
      if (!solType) return; // the row check above already reports an unknown type

      const starterType = starterTypes.find((x) => x.name === head);
      const alreadyThere = new Set(((starterType && starterType.members) || []).map((m) => m.name));
      // Step rows watch statements, not declarations, so they name no member and
      // cannot discharge the granularity duty for one.
      const rowNames = new Set(list.slice(1)
        .filter((r) => !(r && typeof r === "object"))
        .map((r) => structure.symbolName(r)).filter(Boolean));

      const unlisted = (solType.members || [])
        .filter((m) => !alreadyThere.has(m.name) && !rowNames.has(m.name));
      if (unlisted.length) {
        const what = unlisted.map((m) => `${m.kind} ${m.detail || m.name}`).join(", ");
        bad(`${label} goals[${i}] box "${list[0]}" hides work the learner must do: ${what}. ` +
          `Every field, constructor and method the solution adds needs its own row, or the box ticks in one jump instead of tracking each piece.`);
        fail();
      }
    });
  }

  // A practice lesson fills a card title from its config.
  function renderedTitle(dom) {
    const titles = [...dom.matchAll(/id="[^"]*Title"[^>]*>([^<]*)</g)].map((m) => m[1]);
    return titles.some((t) => t.trim());
  }

  // --- viz: run every step's scene through the real resolvers ----------------
  function verifyViz({ config, opts }) {
    if (opts.noViz) { skip("viz resolvers (--no-viz)"); return true; }
    const steps = config.steps || [];
    const CL = deps.codeLab();
    const resolvers = { transcript: CL.resolveTranscript, retrieval: CL.resolveRetrieval, plan: CL.resolvePlan };
    let allOk = true, ran = 0;
    steps.forEach((step, i) => {
      for (const [field, fn] of Object.entries(resolvers)) {
        if (!step[field]) continue;
        if (typeof fn !== "function") { skip(`step ${i + 1} ${field}: no resolver in bundle`); continue; }
        try { const out = fn(step[field]); if (!out || typeof out !== "object") throw new Error("resolver returned non-object"); ran++; }
        catch (e) { bad(`step ${i + 1} ${field} resolver threw: ${e.message}`); allOk = false; }
      }
    });
    if (ran) ok(`${ran} scene(s) resolved cleanly across ${steps.length} step(s)`);
    else skip(`no transcript/retrieval/plan scenes to resolve (${steps.length} step(s))`);
    return allOk;
  }

  // --- git: replay the authored solution and demand it reach the target ------
  function verifyGit({ config }) {
    const git = gitRuntimeFrom(deps.codeLab());
    if (!git) {
      bad("the vendored code-lab bundle exports no gitInit/gitRun - cannot replay this lesson; re-vendor vendor/code-lab/code-lab.global.js");
      return false;
    }
    let allOk = true;
    const tasks = (config.tasks || []).filter((t) => !t.summary);
    tasks.forEach((t, i) => {
      const label = taskLabel(t, i);
      const r = checkGitTask(t, git);
      if (r.ok) ok(`${label} solution reaches the target (${r.commands} command(s))`);
      else { bad(`${label} ${r.reason} [${r.code}]`); allOk = false; }
      // The tracker is checked even when the solution does not reach the target.
      // Reporting only the first failure would hide a dead gate behind an
      // unrelated broken command, and the author would fix one and ship the other.
      if (!checkGitTracker(t, label, git)) allOk = false;
    });
    return allOk;
  }

  /**
   * The git half of "the tracker must be able to LIGHT UP".
   *
   * Same contract as checkTracker for C#, but the evidence is a REPLAY rather
   * than a source scan: seed the card, run the authored solution, and demand
   * that every gate and every row is true at the end. A `ran` gate is also
   * checked against the solution's command list, because a read the solution
   * never types is a box that stays dashed while the learner is doing
   * everything right.
   */
  function checkGitTracker(t, label, git) {
    const goals = t.goals || [];
    if (!goals.length) return true;

    let trackerOk = true;
    const note = () => { trackerOk = false; };

    // Index alignment with the localized prose, exactly as on the C# side.
    const proseCount = (t.goal || []).length;
    if (proseCount && goals.length !== proseCount) {
      bad(`${label} has ${goals.length} goals entry/entries for ${proseCount} goal line(s) - they are index-aligned, so the counts must match`);
      note();
    }

    const files = filesOf(t);
    const start = startOf(t);
    const solution = solutionOf(t);
    const s0 = Array.isArray(start) ? replay(git, start, null, files) : { state: git.init(files), failed: null };
    if (s0.failed) {
      bad(`${label} cannot check the goal tracker - start command failed: '${s0.failed.line}'`);
      return false;
    }
    const done = replay(git, solution, s0.state);
    if (done.failed) {
      bad(`${label} cannot check the goal tracker - solution command failed: '${done.failed.line}'`);
      return false;
    }

    // Replay the solution ONE COMMAND AT A TIME and keep a high-water mark, which
    // is exactly what the browser does: the tracker syncs after every command and
    // latches the goals that describe a moment. Judging only the end state would
    // call "stage cat.txt, and only that one" dead, because `git commit` empties
    // the index it just checked - a gate that is genuinely reachable would be
    // reported as broken and authors would be pushed to write worse goals.
    const everMet = [];
    const everRow = [];
    let rowCount = 0;
    const ran = [];
    let cur = s0.state;

    const observe = () => {
      const world = { state: cur, ran: ran.slice() };
      const verdicts = gitGoals.verdicts(goals, world) || [];
      goals.forEach((g, i) => {
        if (verdicts[i] === true) everMet[i] = true;
        const code = g && g.code;
        if (!code) return;
        const list = Array.isArray(code) ? code : [code];
        const gate = g && g.gate !== undefined ? g.gate : undefined;
        const rowVerdicts = gitGoals.rows(gate, list, world) || [];
        if (!everRow[i]) everRow[i] = [];
        rowVerdicts.forEach((met, r) => { if (met === true) everRow[i][r] = true; });
      });
    };

    observe();
    for (const line of solution) {
      const step = replay(git, [line], cur);
      cur = step.state;
      ran.push(line);
      observe();
      if (step.failed) break;
    }

    goals.forEach((g, i) => {
      const gate = g && g.gate !== undefined ? g.gate : undefined;
      // A null/undefined gate is run-gated: only reaching the target settles it,
      // so there is nothing factual to assert. Its rows are still claims, though.
      if (gate !== null && gate !== undefined && !everMet[i]) {
        bad(`${label} goals[${i}].gate (${gitGoals.describe(gate)}) is never met while the solution runs - it could never tick`);
        note();
      }
      const code = g && g.code;
      if (!code) return;
      const list = Array.isArray(code) ? code : [code];
      list.forEach((row, r) => {
        rowCount++;
        if (!(everRow[i] || [])[r]) {
          const shown = gitGoals.rowLabel ? gitGoals.rowLabel(row) : row;
          bad(`${label} goals[${i}].code[${r}] ("${shown}") is never true while the solution runs - that subtask row could never tick`);
          note();
        }
      });
    });

    if (trackerOk) {
      ok(`${label} goal tracker lights up fully on the solution (${goals.length} gate(s), ${rowCount} row(s))`);
    }
    return trackerOk;
  }

  // The goal tracker is a PURE STATIC check - it reads the solution's shape, not
  // its output - so it must never ride along inside the dotnet path. It used to,
  // and `--no-dotnet` (and any machine without dotnet on PATH) silently skipped
  // every tracker assertion in the repo. A check that goes quiet is worse than
  // no check: it reports PASS.
  function verifyTracker({ config }) {
    let allOk = true;
    (config.tasks || []).filter((t) => !t.summary).forEach((t, i) => {
      if (!(t.goals || []).length) return;
      checkTracker(t, taskLabel(t, i),
        () => { allOk = false; });
    });
    return allOk;
  }

  function verifyTasks(args) {
    // Both run, and both verdicts count - `&&` would short-circuit the tracker
    // report away the moment a compile failed.
    const tracker = verifyTracker(args);
    const compiled = verifyCompiled(args);
    return tracker && compiled;
  }

  const list = [
    { archetype: "build", bodyField: "tasks", verify: verifyTasks, rendered: renderedTitle },
    { archetype: "drill", bodyField: "tasks", verify: verifyTasks, rendered: renderedTitle },
    { archetype: "viz", bodyField: "steps", verify: verifyViz, rendered: (dom) => PANEL_CLASSES.some((c) => dom.includes(c)) },
    { archetype: "checkpoint", bodyField: "questions", verify: () => true, rendered: (dom) => dom.includes("cl-quiz") },
    // The git body is the terminal the learner types into plus the graph it
    // grades against; furniture without them is an inert lesson.
    { archetype: "git", bodyField: "tasks", verify: verifyGit, rendered: (dom) => dom.includes("cl-term") && dom.includes("cl-git") },
  ];

  const byArchetype = new Map(list.map((v) => [v.archetype, v]));
  return {
    get: (archetype) => byArchetype.get(archetype) || null,
    archetypes: () => [...byArchetype.keys()],
    // Exposed on its own because it is PURE and STATIC: it reads the solution's
    // shape, never its output, so it needs no dotnet and no browser. That lets
    // tools/validate.mjs - the check that actually runs in CI and in the push
    // gate - assert every goal gate in the course, instead of the gates only
    // being checked by a per-lesson tool somebody has to remember to run.
    // Reused rather than reimplemented: a second copy of "is this gate dead"
    // would drift, and the copy that drifts is the one that stops catching.
    tracker: verifyTracker,
    // The git equivalent, exposed for the same reason. A git gate is judged by
    // REPLAYING the authored solution, so unlike the C# scan it needs the git
    // runtime out of the vendored bundle - but it still needs no dotnet and no
    // browser, so the course-wide sweep can run it too. Without this, the sweep
    // fell back to the C# scanner on git lessons and read every git gate as
    // "(empty gate)" - 65 errors that were all the checker's fault, not the
    // content's, which is exactly the kind of noise that gets a gate switched off.
    gitTracker: ({ config }) => {
      const git = gitRuntimeFrom(deps.codeLab());
      if (!git) {
        bad("the vendored code-lab bundle exports no gitInit/gitRun - cannot replay git goal gates");
        return false;
      }
      let allOk = true;
      (config.tasks || []).filter((t) => !t.summary).forEach((t, i) => {
        if (!checkGitTracker(t, taskLabel(t, i), git)) allOk = false;
      });
      return allOk;
    },
  };
}
