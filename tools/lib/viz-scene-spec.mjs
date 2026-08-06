// viz-scene-spec.mjs - the single source of truth for which prose a MemoryViz
// scene carries and where it lives. It MIRRORS resource/bind-viz.js (browser)
// exactly; the seed tool and the i18n checker both import this so the extraction
// and the runtime binding can never drift. Code identifiers (tool/param names,
// the emitted call) and structural fields (role, state, score) are excluded on
// purpose - only human prose is listed.
import fs from "node:fs";
import vm from "node:vm";

export const SCENE_PROPS = ["transcript", "agent", "agentLoop", "toolRack", "memoryShelf", "retrieval", "plan", "repo", "objects"];

// For a scene of `type`, list [keySuffix, path] pairs: the res key is
// "step.<i>.<keySuffix>" and `path` locates the string inside the scene.
export function sceneLeaves(type, sc) {
  const out = [];
  const push = (suffix, p) => out.push([suffix, p]);
  if (type === "transcript") {
    push("caption", ["caption"]);
    (sc.messages || []).forEach((m, j) => {
      push(`msg.${j}.text`, ["messages", j, "text"]);
      push(`msg.${j}.note`, ["messages", j, "note"]);
    });
  } else if (type === "agent") {
    push("stripCaption", ["stripCaption"]);
    push("coreSub", ["core", "sub"]);
  } else if (type === "agentLoop") {
    push("goal", ["goal"]);
    push("think", ["think"]);
    (sc.ctx || []).forEach((_, j) => push(`ctx.${j}`, ["ctx", j]));
    (sc.chips || []).forEach((_, j) => push(`chip.${j}`, ["chips", j]));
  } else if (type === "toolRack") {
    push("caption", ["caption"]);
    push("banner", ["banner"]);
    (sc.tools || []).forEach((_, j) => push(`tool.${j}.desc`, ["tools", j, "desc"]));
  } else if (type === "memoryShelf") {
    push("caption", ["caption"]);
    push("workingCaption", ["workingCaption"]);
    (sc.working || []).forEach((_, j) => push(`work.${j}`, ["working", j, "text"]));
    const stores = sc.stores || {};
    Object.keys(stores).forEach((k) => {
      (stores[k] || []).forEach((_, j) => push(`store.${k}.${j}`, ["stores", k, j, "text"]));
    });
  } else if (type === "retrieval") {
    push("caption", ["caption"]);
    push("query", ["query"]);
    (sc.docs || []).forEach((_, j) => push(`doc.${j}`, ["docs", j, "text"]));
  } else if (type === "repo") {
    // The board's caption only. `commands` and `files` are real git, and
    // translating them would break the replay the step is drawn from.
    push("note", ["note"]);
  } else if (type === "objects") {
    // The caption only, and for a sharper reason than `repo`: an object's id is
    // computed from its bytes, so translating a file's text or a save's message
    // hands the Spanish learner different forty characters from the English one.
    push("note", ["note"]);
  } else if (type === "plan") {
    push("caption", ["caption"]);
    push("goal", ["goal"]);
    (sc.steps || []).forEach((_, j) => {
      push(`pstep.${j}.text`, ["steps", j, "text"]);
      push(`pstep.${j}.note`, ["steps", j, "note"]);
    });
  }
  return out;
}

export function getPath(obj, p) {
  let cur = obj;
  for (const k of p) {
    if (cur == null) return undefined;
    cur = cur[k];
  }
  return cur;
}

// Load a viz.js data file and return its window.LESSON_CONFIG.
export function loadWindowGlobal(file) {
  const src = fs.readFileSync(file, "utf8");
  const sandbox = { window: {} };
  vm.runInNewContext(src, sandbox, { filename: file });
  return sandbox.window.LESSON_CONFIG;
}

// Extract [key, english] scene entries for a lesson's viz (window.LESSON_CONFIG).
export function extractSceneEntries(viz) {
  const entries = [];
  const steps = (viz && viz.steps) || [];
  steps.forEach((step, i) => {
    if (!step) return;
    for (const type of SCENE_PROPS) {
      const sc = step[type];
      if (!sc) continue;
      for (const [suffix, p] of sceneLeaves(type, sc)) {
        const v = getPath(sc, p);
        if (typeof v === "string" && v.trim() !== "") entries.push([`step.${i}.${suffix}`, v]);
      }
      break; // one scene per step
    }
  });
  return entries;
}
