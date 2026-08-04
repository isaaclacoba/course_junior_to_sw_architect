/*
 * kernel/grading/structure-match.js - the shared "does the code have this shape
 * yet?" policy behind the live goal tracker.
 *
 * A sibling of output-match.js and the same deal: DOM-free, dependency-free,
 * one source of truth so the browser tracker and the Node validator cannot
 * drift. It answers a STRUCTURAL question - is there a `Cat` with an
 * `IsHungry`, does `Penguin` still inherit `Bird` - over the type list a
 * scanner produced. It never sees source text and never runs anything.
 *
 * WHY IT IS NOT GRADING. Nothing here awards XP. XP stays with the run: real
 * output from the real compiler. This only drives the checklist that tells a
 * learner where they are while they type, which is exactly the help that was
 * missing when a goal could only be understood by reading the solution. A tick
 * here means "the shape is there", never "you are done".
 *
 * A gate is DECLARATIVE - a small object, not a function - so a lesson's data
 * file stays data, the Node validator can assert every gate against the
 * authored solution, and a gate that could never light up is a build failure
 * rather than a checklist item that sits grey forever.
 *
 * Gate fields, all optional, all ANDed:
 *   type   "Cat"          a type with this name exists
 *   kind   "interface"    ...and it was declared with this keyword
 *   member "IsHungry"     ...and it declares this member
 *   base   "IAnimal"      ...and its base list includes this
 *   absent "CheckAndSign" NO type declares a member (or type) with this name
 *
 * Loaded two ways with no bundler:
 *   - browser: a <script> sets window.KernelStructure.
 *   - node:    module.exports (require in tests and in tools/).
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else if (root) {
    root.KernelStructure = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : (typeof self !== "undefined" ? self : this), function () {
  "use strict";

  function nameOf(member) {
    if (!member) return "";
    return typeof member === "string" ? member : (member.name || "");
  }

  function memberNames(type) {
    var members = (type && type.members) || [];
    return members.map(nameOf).filter(Boolean);
  }

  function findType(types, name) {
    for (var i = 0; i < types.length; i++) {
      if (types[i] && types[i].name === name) return types[i];
    }
    return null;
  }

  // "Nothing anywhere is called this" - the gate that proves a shape was
  // actually SPLIT rather than merely added to. Checked over type names as well
  // as members so `absent: "AnimalVoice"` retires a whole class.
  function isAbsent(types, name) {
    for (var i = 0; i < types.length; i++) {
      if (types[i].name === name) return false;
      if (memberNames(types[i]).indexOf(name) !== -1) return false;
    }
    return true;
  }

  // Evaluate one gate against the scanned types. Returns a boolean and never
  // throws: a malformed gate is unmet, not an exception in the middle of typing.
  function meets(types, gate) {
    if (!gate || typeof gate !== "object") return false;
    types = Array.isArray(types) ? types : [];

    if (gate.absent && !isAbsent(types, gate.absent)) return false;

    // A gate MAY be absence-only ({ absent: "CheckAndSign" }), in which case
    // there is no type to look up and the absence check above is the verdict.
    if (!gate.type) return !!gate.absent;

    var found = findType(types, gate.type);
    if (!found) return false;
    if (gate.kind && found.kind !== gate.kind) return false;
    if (gate.member && memberNames(found).indexOf(gate.member) === -1) return false;
    if (gate.base) {
      var bases = found.bases || [];
      if (bases.indexOf(gate.base) === -1) return false;
    }
    return true;
  }

  // A blueprint row lists its members as SIGNATURES - "bool IsHungry()" rather
  // than "IsHungry" - because a signature tells a learner what to write without
  // writing it for them. Matching still happens on the identifier alone, so the
  // return type and parameter names are free to be a hint.
  function symbolName(spec) {
    if (!spec) return "";
    var text = typeof spec === "string" ? spec : (spec.name || "");
    var call = text.match(/([A-Za-z_]\w*)\s*(?:<[^>]*>)?\s*\(/);
    if (call) return call[1];
    var words = String(text).trim().split(/\s+/);
    var ident = (words[words.length - 1] || "").match(/([A-Za-z_]\w*)/);
    return ident ? ident[1] : "";
  }

  // The tracker's whole payload: one boolean per gate, in the authored order,
  // so a caller can zip it straight onto the localized goal list.
  function evaluate(types, gates) {
    if (!Array.isArray(gates)) return [];
    return gates.map(function (gate) { return meets(types, gate); });
  }

  // Describe a gate for a validator's failure message. Not shown to learners -
  // their copy is the localized goal text this gate sits beside.
  function describe(gate) {
    if (!gate || typeof gate !== "object") return "(not a gate)";
    var parts = [];
    if (gate.kind) parts.push(gate.kind);
    if (gate.type) parts.push(gate.type);
    if (gate.member) parts.push("." + gate.member);
    if (gate.base) parts.push(": " + gate.base);
    if (gate.absent) parts.push("without " + gate.absent);
    return parts.length ? parts.join(" ") : "(empty gate)";
  }

  return { meets: meets, evaluate: evaluate, describe: describe, symbolName: symbolName };
});
