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
import { checkGitTask, gitRuntimeFrom } from "./git-validate.mjs";

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
  const { matches, buildProbe } = deps.grading;

  // --- build / drill: compile + run each task's solution ---------------------
  function verifyCompiled({ config, opts }) {
    if (opts.noDotnet) { skip("dotnet compile (--no-dotnet)"); return true; }
    if (!deps.dotnet.available()) { skip("dotnet compile (no dotnet on PATH)"); return true; }
    const compileRun = deps.dotnet.compileRun;
    let allOk = true;
    const tasks = (config.tasks || []).filter((t) => !t.summary);
    tasks.forEach((t, i) => {
      const label = `task ${i + 1} "${(t.title || "").slice(0, 40)}"`;
      if (!t.solution) { skip(`${label} - no solution`); return; }
      const run = compileRun(t.solution);
      if (!run.built) { bad(`${label} solution did not compile\n${firstError(run.errors)}`); allOk = false; return; }
      if (!matches((run.output || "").trim(), t.expected)) {
        bad(`${label} output != expected\n    expected: ${JSON.stringify(t.expected)}\n    got: ${JSON.stringify((run.output || "").trim())}`);
        allOk = false;
      } else ok(`${label} solution runs and matches expected`);
      if (run.warnings) note(`solution compiled with ${run.warnings} warning(s)`);

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
      const label = `task ${i + 1} "${(t.title || "").slice(0, 40)}"`;
      const r = checkGitTask(t, git);
      if (r.ok) ok(`${label} solution reaches the target (${r.commands} command(s))`);
      else { bad(`${label} ${r.reason} [${r.code}]`); allOk = false; }
    });
    return allOk;
  }

  const list = [
    { archetype: "build", bodyField: "tasks", verify: verifyCompiled, rendered: renderedTitle },
    { archetype: "drill", bodyField: "tasks", verify: verifyCompiled, rendered: renderedTitle },
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
  };
}
