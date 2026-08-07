"use strict";
var CodeLab = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/index.ts
  var src_exports = {};
  __export(src_exports, {
    ALL_REGIONS: () => ALL_REGIONS,
    CodeLab: () => CodeLab,
    CommandHistory: () => CommandHistory,
    DEFAULT_AUTHOR: () => DEFAULT_AUTHOR,
    DEFAULT_LOOP_MEMORIES: () => DEFAULT_LOOP_MEMORIES,
    DEFAULT_LOOP_TOOLS: () => DEFAULT_LOOP_TOOLS,
    DEFAULT_MEMORY_STORES: () => DEFAULT_MEMORY_STORES,
    DEFAULT_TRACE_NARRATION: () => DEFAULT_TRACE_NARRATION,
    DEFAULT_VIZ_LABELS: () => DEFAULT_VIZ_LABELS,
    FULL_REGIONS: () => FULL_REGIONS,
    GitError: () => GitError,
    GitGraph: () => GitGraph,
    IframeRunner: () => IframeRunner,
    LineTerminal: () => LineTerminal,
    MODE_DIR: () => MODE_DIR,
    MODE_EXEC: () => MODE_EXEC,
    MODE_FILE: () => MODE_FILE,
    MemoryViz: () => MemoryViz,
    MonacoEditor: () => MonacoEditor,
    ObjectStore: () => ObjectStore,
    PlainHighlighter: () => PlainHighlighter,
    PrismHighlighter: () => PrismHighlighter,
    Quiz: () => Quiz,
    ReadOnlyView: () => ReadOnlyView,
    RoslynIframeRunner: () => RoslynIframeRunner,
    Shell: () => Shell,
    TextareaEditor: () => TextareaEditor,
    Tour: () => Tour,
    VizLab: () => VizLab,
    activeStores: () => activeStores,
    agentFanRows: () => agentFanRows,
    agentLoopActiveSet: () => agentLoopActiveSet,
    atFirst: () => atFirst,
    atLast: () => atLast,
    authorOf: () => authorOf,
    bytesOf: () => bytesOf,
    chainRows: () => chainRows,
    classifyTraceOutcome: () => classifyTraceOutcome,
    commitBody: () => commitBody,
    computeLineFlags: () => computeLineFlags,
    conceptResults: () => conceptResults,
    counterLabel: () => counterLabel,
    createEchoCommand: () => echoCommand,
    createGitCommand: () => createGitCommand,
    defaultHighlighter: () => defaultHighlighter,
    deriveRefs: () => deriveRefs,
    drawQuiz: () => drawQuiz,
    fill: () => fill,
    firstUnanswered: () => firstUnanswered,
    formatToolSignature: () => formatToolSignature,
    gitAddFiles: () => addFiles,
    gitBranch: () => branch,
    gitCheckout: () => checkout,
    gitCommit: () => commit,
    gitDiffLines: () => diffLines,
    gitEdit: () => edit,
    gitFileAt: () => fileAt,
    gitFindConflicts: () => findConflicts,
    gitFormatFileDiff: () => formatFileDiff,
    gitHasConflictMarkers: () => hasConflictMarkers,
    gitInit: () => init,
    gitJoinLines: () => joinLines,
    gitLayout: () => layout,
    gitMerge: () => merge,
    gitMerge3: () => merge3,
    gitMergeAbort: () => mergeAbort,
    gitPanelFiles: () => panelFiles,
    gitRebase: () => rebase,
    gitReset: () => reset,
    gitResolveConflicts: () => resolveConflicts,
    gitResolveFilePanel: () => resolveFilePanel,
    gitResolvePaths: () => resolvePaths,
    gitRevList: () => revList,
    gitRevParse: () => revParse,
    gitRun: () => run,
    gitSplitLines: () => splitLines,
    gitStage: () => stage,
    gitSubcommands: () => gitSubcommands,
    gitTag: () => tag,
    gitTreeAt: () => treeAt,
    goTo: () => goTo,
    hashObject: () => hashObject,
    loadMonaco: () => loadMonaco,
    makeTour: () => makeTour,
    markedLineHtml: () => markedLineHtml,
    membersOf: () => membersOf,
    mergeTemplates: () => mergeTemplates,
    missingPlaceholders: () => missingPlaceholders,
    neededToPass: () => neededToPass,
    next: () => next,
    normalizeLines: () => normalizeLines,
    objectBytes: () => objectBytes,
    placeholdersOf: () => placeholdersOf,
    planProgress: () => planProgress,
    presentRun: () => presentRun,
    prev: () => prev,
    receiverBefore: () => receiverBefore,
    referencedIds: () => referencedIds,
    renderErrorPanel: () => renderErrorPanel,
    replayObjects: () => replayObjects,
    resolveMarks: () => resolveMarks,
    resolveModel: () => resolveModel,
    resolveNarration: () => resolveNarration,
    resolveObjects: () => resolveObjects,
    resolvePlan: () => resolvePlan,
    resolveRackTools: () => resolveRackTools,
    resolveRepo: () => resolveRepo,
    resolveRetrieval: () => resolveRetrieval,
    resolveTranscript: () => resolveTranscript,
    scanCSharp: () => scanCSharp,
    scoreQuiz: () => scoreQuiz,
    selectRunCode: () => selectRunCode,
    sha1: () => sha1,
    shelfStores: () => shelfStores,
    shellTokenize: () => tokenize,
    shellTokenizeLine: () => tokenizeLine,
    short: () => short,
    showErrorPanel: () => showErrorPanel,
    shuffleQuiz: () => shuffle,
    spansForLine: () => spansForLine,
    splitCodeLines: () => splitCodeLines,
    stripCommentsAndStrings: () => stripCommentsAndStrings,
    toolRackRows: () => toolRackRows,
    traceToSteps: () => traceToSteps,
    tracerFailedOutcome: () => tracerFailedOutcome,
    treeBody: () => treeBody,
    treeSortKey: () => treeSortKey
  });

  // src/highlighter.ts
  function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  var PrismHighlighter = class {
    highlight(code, language) {
      const prism = window.Prism;
      if (prism && prism.languages && prism.languages[language]) {
        return prism.highlight(code, prism.languages[language], language);
      }
      return escapeHtml(code);
    }
  };
  var PlainHighlighter = class {
    highlight(code) {
      return escapeHtml(code);
    }
  };
  function defaultHighlighter() {
    return window.Prism ? new PrismHighlighter() : new PlainHighlighter();
  }

  // src/core/present.ts
  function selectRunCode(runCode, editorValue) {
    return runCode ?? editorValue;
  }
  function presentRun(result, labels) {
    if (result.errors && result.errors.length) {
      return {
        text: result.errors.map((e) => e.friendly || e.raw).join("\n"),
        isError: true,
        markers: result.errors
      };
    }
    if (result.runtimeError) {
      return {
        text: `${result.output}
${result.runtimeError}`.trim(),
        isError: true,
        markers: []
      };
    }
    return {
      text: result.output || labels.noOutput,
      isError: false,
      markers: []
    };
  }

  // src/core/lines.ts
  function normalizeLines(lines2) {
    if (lines2 === void 0 || lines2 === null) return [];
    const list = Array.isArray(lines2) ? lines2 : [lines2];
    return [...new Set(list.filter((n) => Number.isFinite(n) && n > 0))].sort(
      (a, b) => a - b
    );
  }
  function splitCodeLines(code) {
    return code.replace(/\n+$/, "").split("\n");
  }
  function computeLineFlags(active, count) {
    const set = new Set(active);
    const anyActive = active.length > 0;
    const flags = [];
    for (let i = 1; i <= count; i++) {
      const isActive = set.has(i);
      flags.push({ active: isActive, dim: anyActive && !isActive });
    }
    return flags;
  }

  // src/core/tour-state.ts
  function makeTour(count, index = 0) {
    const safeCount = Math.max(0, Math.floor(count));
    return { count: safeCount, index: clamp(index, safeCount) };
  }
  function clamp(index, count) {
    if (count <= 0) return 0;
    return Math.min(Math.max(0, Math.floor(index)), count - 1);
  }
  function goTo(model, index) {
    if (index < 0 || index >= model.count) return model;
    return { ...model, index };
  }
  function next(model) {
    return goTo(model, model.index + 1);
  }
  function prev(model) {
    return goTo(model, model.index - 1);
  }
  function atFirst(model) {
    return model.index <= 0;
  }
  function atLast(model) {
    return model.count === 0 || model.index >= model.count - 1;
  }
  function counterLabel(model) {
    return `${model.index + 1} / ${model.count}`;
  }

  // src/tour.ts
  function escapeHtml2(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function renderInline(text) {
    return text.split(/(`[^`]+`)/).map(
      (seg) => seg.length > 1 && seg.startsWith("`") && seg.endsWith("`") ? `<code class="cl-inline-code">${escapeHtml2(seg.slice(1, -1))}</code>` : escapeHtml2(seg)
    ).join("");
  }
  var Tour = class {
    constructor(config = {}) {
      this.titleId = `cl-tour-title-${Math.random().toString(36).slice(2)}`;
      this.state = null;
      this.lastFocused = null;
      this.onKey = (e) => this.handleKey(e);
      this.highlighter = config.highlighter ?? defaultHighlighter();
      this.language = config.language ?? "csharp";
    }
    open(opts) {
      this.buildDom();
      this.lastFocused = document.activeElement;
      const safeSteps = Array.isArray(opts.steps) && opts.steps.length ? opts.steps : [{ text: "", lines: [] }];
      this.state = { steps: safeSteps, index: 0, lineEls: [] };
      this.titleEl.textContent = opts.title || "Walk me through the code";
      this.renderCode(opts.code || "");
      this.codePane.scrollTop = 0;
      this.applyStep();
      this.overlay.hidden = false;
      this.modal.hidden = false;
      document.addEventListener("keydown", this.onKey);
      const focusables = this.focusableEls();
      if (focusables.length) focusables[focusables.length - 1].focus();
    }
    close() {
      if (!this.overlay) return;
      this.overlay.hidden = true;
      this.modal.hidden = true;
      document.removeEventListener("keydown", this.onKey);
      if (this.lastFocused instanceof HTMLElement) this.lastFocused.focus();
      this.lastFocused = null;
    }
    destroy() {
      document.removeEventListener("keydown", this.onKey);
      this.overlay?.remove();
      this.modal?.remove();
      this.overlay = void 0;
      this.modal = void 0;
    }
    normalizeLines(lines2) {
      return normalizeLines(lines2);
    }
    buildDom() {
      if (this.overlay) return;
      this.overlay = document.createElement("div");
      this.overlay.className = "cl-tour-overlay";
      this.overlay.hidden = true;
      this.overlay.addEventListener("click", () => this.close());
      this.modal = document.createElement("div");
      this.modal.className = "cl-tour-modal";
      this.modal.hidden = true;
      this.modal.setAttribute("role", "dialog");
      this.modal.setAttribute("aria-modal", "true");
      this.modal.setAttribute("aria-labelledby", this.titleId);
      this.modal.addEventListener("click", (e) => e.stopPropagation());
      const header = document.createElement("div");
      header.className = "cl-tour-header";
      this.titleEl = document.createElement("h4");
      this.titleEl.className = "cl-tour-title";
      this.titleEl.id = this.titleId;
      const closeBtn = document.createElement("button");
      closeBtn.type = "button";
      closeBtn.className = "cl-btn cl-tour-close";
      closeBtn.textContent = "Close";
      closeBtn.addEventListener("click", () => this.close());
      header.append(this.titleEl, closeBtn);
      this.codePane = document.createElement("div");
      this.codePane.className = "cl-tour-code-pane";
      this.narration = document.createElement("p");
      this.narration.className = "cl-tour-narration";
      const footer = document.createElement("div");
      footer.className = "cl-tour-footer";
      this.prevBtn = document.createElement("button");
      this.prevBtn.type = "button";
      this.prevBtn.className = "cl-btn";
      this.prevBtn.textContent = "Previous";
      this.prevBtn.addEventListener("click", () => this.go(this.state.index - 1));
      this.dots = document.createElement("div");
      this.dots.className = "cl-tour-dots";
      this.counter = document.createElement("span");
      this.counter.className = "cl-tour-counter";
      this.nextBtn = document.createElement("button");
      this.nextBtn.type = "button";
      this.nextBtn.className = "cl-btn cl-primary";
      this.nextBtn.textContent = "Next";
      this.nextBtn.addEventListener("click", () => this.go(this.state.index + 1));
      footer.append(this.prevBtn, this.dots, this.counter, this.nextBtn);
      this.modal.append(header, this.codePane, this.narration, footer);
      document.body.append(this.overlay, this.modal);
    }
    renderCode(code) {
      const lines2 = splitCodeLines(code);
      this.codePane.innerHTML = "";
      this.state.lineEls = lines2.map((text, i) => {
        const row = document.createElement("div");
        row.className = "cl-tour-line";
        const num = document.createElement("span");
        num.className = "cl-tour-ln";
        num.textContent = String(i + 1);
        const codeEl = document.createElement("code");
        codeEl.className = `cl-tour-code language-${this.language}`;
        codeEl.innerHTML = text.length ? this.highlighter.highlight(text, this.language) : "&nbsp;";
        row.append(num, codeEl);
        this.codePane.appendChild(row);
        return row;
      });
    }
    renderDots() {
      this.dots.innerHTML = "";
      this.state.steps.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "cl-tour-dot" + (i === this.state.index ? " is-active" : "");
        dot.setAttribute("aria-label", `Step ${i + 1}`);
        dot.addEventListener("click", () => this.go(i));
        this.dots.appendChild(dot);
      });
    }
    scrollWithin(el) {
      const c = this.codePane.getBoundingClientRect();
      const e = el.getBoundingClientRect();
      if (e.top < c.top) {
        this.codePane.scrollBy({ top: e.top - c.top - 14, behavior: "smooth" });
      } else if (e.bottom > c.bottom) {
        this.codePane.scrollBy({ top: e.bottom - c.bottom + 14, behavior: "smooth" });
      }
    }
    pulseNarration() {
      this.narration.classList.remove("is-changing");
      void this.narration.offsetWidth;
      this.narration.classList.add("is-changing");
    }
    applyStep() {
      const step = this.state.steps[this.state.index];
      const active = this.normalizeLines(step.lines);
      const flags = computeLineFlags(active, this.state.lineEls.length);
      this.state.lineEls.forEach((el, i) => {
        el.classList.toggle("is-active", flags[i].active);
        el.classList.toggle("is-dim", flags[i].dim);
      });
      const model = makeTour(this.state.steps.length, this.state.index);
      this.narration.innerHTML = renderInline(step.text || "");
      this.pulseNarration();
      this.counter.textContent = counterLabel(model);
      this.prevBtn.disabled = atFirst(model);
      this.nextBtn.disabled = atLast(model);
      this.renderDots();
      if (active.length) this.scrollWithin(this.state.lineEls[active[0] - 1]);
    }
    go(index) {
      if (!this.state) return;
      const current = makeTour(this.state.steps.length, this.state.index);
      const target = goTo(current, index);
      if (target === current) return;
      this.state.index = target.index;
      this.applyStep();
    }
    focusableEls() {
      return [
        ...this.modal.querySelectorAll("button:not([disabled])")
      ];
    }
    trapTab(e) {
      const els = this.focusableEls();
      if (!els.length) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    handleKey(e) {
      if (e.key === "Escape") this.close();
      else if (e.key === "Tab") this.trapTab(e);
      else if (e.key === "ArrowRight") this.go(this.state.index + 1);
      else if (e.key === "ArrowLeft") this.go(this.state.index - 1);
    }
  };

  // src/editors/readonly.ts
  var ReadOnlyView = class {
    constructor(highlighter) {
      this.value = "";
      this.language = "csharp";
      this.highlighter = highlighter ?? defaultHighlighter();
    }
    mount(host, opts) {
      this.value = opts.value;
      this.language = opts.language;
      this.pre = document.createElement("pre");
      this.pre.className = "cl-readonly line-numbers";
      this.code = document.createElement("code");
      this.code.className = `language-${opts.language}`;
      this.pre.appendChild(this.code);
      host.appendChild(this.pre);
      this.render();
    }
    render() {
      if (this.code) {
        this.code.innerHTML = this.highlighter.highlight(this.value, this.language);
      }
    }
    getValue() {
      return this.value;
    }
    setValue(value) {
      this.value = value;
      this.render();
    }
    setReadOnly() {
    }
    destroy() {
      this.pre?.remove();
      this.pre = void 0;
      this.code = void 0;
    }
  };

  // src/editors/textarea.ts
  var TextareaEditor = class {
    constructor(highlighter) {
      this.language = "csharp";
      this.listeners = [];
      this.highlighter = highlighter ?? defaultHighlighter();
    }
    mount(host, opts) {
      this.language = opts.language;
      this.wrap = document.createElement("div");
      this.wrap.className = "cl-ta-wrap";
      this.pre = document.createElement("pre");
      this.pre.className = "cl-ta-underlay";
      this.pre.setAttribute("aria-hidden", "true");
      this.code = document.createElement("code");
      this.code.className = `language-${opts.language}`;
      this.pre.appendChild(this.code);
      this.textarea = document.createElement("textarea");
      this.textarea.className = "cl-ta-input";
      this.textarea.spellcheck = false;
      this.textarea.autocapitalize = "off";
      this.textarea.setAttribute("autocomplete", "off");
      this.textarea.setAttribute("autocorrect", "off");
      this.textarea.value = opts.value;
      this.textarea.readOnly = opts.readOnly;
      this.textarea.addEventListener("input", () => this.sync());
      this.textarea.addEventListener("scroll", () => this.syncScroll());
      this.wrap.append(this.pre, this.textarea);
      host.appendChild(this.wrap);
      this.sync();
    }
    sync() {
      if (!this.code || !this.textarea) return;
      const text = this.textarea.value;
      this.code.innerHTML = this.highlighter.highlight(text + "\n", this.language);
      this.syncScroll();
      this.emit(text);
    }
    // Every path that changes the buffer funnels through sync(), so notifying
    // here covers typing AND setValue - the same events Monaco reports.
    emit(value) {
      for (const listener of this.listeners.slice()) listener(value);
    }
    onChange(listener) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter((l) => l !== listener);
      };
    }
    syncScroll() {
      if (!this.pre || !this.textarea) return;
      this.pre.scrollTop = this.textarea.scrollTop;
      this.pre.scrollLeft = this.textarea.scrollLeft;
    }
    getValue() {
      return this.textarea?.value ?? "";
    }
    setValue(value) {
      if (this.textarea) {
        this.textarea.value = value;
        this.sync();
      }
    }
    setReadOnly(readOnly) {
      if (this.textarea) this.textarea.readOnly = readOnly;
    }
    destroy() {
      this.listeners = [];
      this.wrap?.remove();
      this.wrap = void 0;
      this.pre = void 0;
      this.code = void 0;
      this.textarea = void 0;
    }
  };

  // src/editors/monaco.ts
  var MonacoEditor = class {
    constructor(config = {}) {
      // eslint-disable-line @typescript-eslint/no-explicit-any
      this.pcDecorationIds = [];
      this.monaco = config.monaco;
      this.theme = config.theme ?? "vs-dark";
    }
    async resolveMonaco() {
      if (this.monaco) return this.monaco;
      if (window.monaco) return this.monaco = window.monaco;
      try {
        const specifier = "monaco-editor";
        this.monaco = await import(
          /* @vite-ignore */
          specifier
        );
        return this.monaco;
      } catch {
        throw new Error(
          "MonacoEditor: monaco-editor is not available. Install it, expose window.monaco, or pass { monaco } to the adapter."
        );
      }
    }
    async mount(host, opts) {
      const monaco = await this.resolveMonaco();
      this.editor = monaco.editor.create(host, {
        value: opts.value,
        language: opts.language,
        theme: this.theme,
        readOnly: opts.readOnly,
        automaticLayout: true,
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: "on",
        tabSize: 4,
        insertSpaces: true,
        scrollBeyondLastLine: false,
        wordWrap: opts.wordWrap ? "on" : "off",
        bracketPairColorization: { enabled: true },
        // Breathing room so the first and last lines are not welded to the frame.
        // This is Monaco's OWN padding, not CSS on the host: `getContentHeight`
        // counts it, so an auto-height editor grows to include it. CSS padding on
        // the host would leave the height unchanged and quietly clip the last
        // line instead.
        padding: { top: 12, bottom: 12 }
      });
      if (opts.autoHeight) this.enableAutoHeight(host, opts.autoHeight);
    }
    // Drive the host height from Monaco's content height so the editor is exactly
    // as tall as the code it holds, clamped to optional min/max bounds. Width is
    // still handled by automaticLayout.
    enableAutoHeight(host, bounds) {
      const min = bounds.minHeight ?? 0;
      const max = bounds.maxHeight ?? Number.POSITIVE_INFINITY;
      const resize = () => {
        const height = Math.min(max, Math.max(min, this.editor.getContentHeight()));
        host.style.height = `${height}px`;
        this.editor.layout({ width: host.clientWidth, height });
      };
      this.editor.onDidContentSizeChange(resize);
      resize();
    }
    getValue() {
      return this.editor ? this.editor.getValue() : "";
    }
    // Notify on every buffer edit, including setValue, so a host can mirror the
    // source without polling. Monaco's disposable is handed back as a plain
    // unsubscribe function, keeping monaco's types out of the adapter contract.
    onChange(listener) {
      if (!this.editor) return () => {
      };
      const sub = this.editor.onDidChangeModelContent(() => listener(this.getValue()));
      return () => sub.dispose();
    }
    setValue(value) {
      if (this.editor) this.editor.setValue(value);
    }
    setReadOnly(readOnly) {
      if (this.editor) this.editor.updateOptions({ readOnly });
    }
    // Paint a whole-line highlight on the running source line and scroll it into
    // view. `line` is 0-based (the trace model's pc); Monaco lines are 1-based.
    highlightLine(line) {
      if (!this.editor || !this.monaco) return;
      if (line == null || line < 0) {
        this.pcDecorationIds = this.editor.deltaDecorations(this.pcDecorationIds, []);
        return;
      }
      const model = this.editor.getModel?.();
      const maxLine = model ? model.getLineCount() : line + 1;
      const ln = Math.min(Math.max(1, line + 1), maxLine);
      this.pcDecorationIds = this.editor.deltaDecorations(this.pcDecorationIds, [
        {
          range: new this.monaco.Range(ln, 1, ln, 1),
          options: {
            isWholeLine: true,
            className: "cl-vl-pcline",
            linesDecorationsClassName: "cl-vl-pcline-gutter"
          }
        }
      ]);
      if (typeof this.editor.revealLineInCenterIfOutsideViewport === "function") {
        this.editor.revealLineInCenterIfOutsideViewport(ln);
      }
    }
    setMarkers(errors) {
      if (!this.editor || !this.monaco) return;
      const model = this.editor.getModel();
      if (!model) return;
      const markers = errors.map((e) => ({
        severity: this.monaco.MarkerSeverity.Error,
        message: e.friendly || e.raw,
        startLineNumber: e.line || 1,
        startColumn: e.column || 1,
        endLineNumber: e.line || 1,
        endColumn: (e.column || 1) + 1
      }));
      this.monaco.editor.setModelMarkers(model, "code-lab", markers);
    }
    destroy() {
      this.editor?.dispose?.();
      this.editor = void 0;
    }
  };

  // src/code-lab.ts
  var DEFAULT_LABELS = {
    run: "Run this example",
    running: "Running...",
    tour: "Walk me through the code",
    noOutput: "(no output)",
    runFailed: "Could not run the example."
  };
  function buildEditor(editable, kind, highlighter) {
    if (!editable || kind === "readonly") return new ReadOnlyView(highlighter);
    if (kind === "textarea") return new TextareaEditor(highlighter);
    return new MonacoEditor();
  }
  var CodeLab = class _CodeLab {
    constructor(host, opts) {
      this.tour = null;
      this.opts = opts;
      this.labels = { ...DEFAULT_LABELS, ...opts.labels ?? {} };
      this.highlighter = opts.highlighter ?? defaultHighlighter();
      this.editable = opts.editable ?? false;
      const kind = opts.editor ?? "monaco";
      this.editor = buildEditor(this.editable, kind, this.highlighter);
      this.root = document.createElement("div");
      this.root.className = "cl-root";
      host.appendChild(this.root);
    }
    static create(host, opts) {
      const lab = new _CodeLab(host, opts);
      void lab.init();
      return lab;
    }
    async init() {
      const language = this.opts.language ?? "csharp";
      this.editorHost = document.createElement("div");
      this.editorHost.className = "cl-editor-host";
      this.root.appendChild(this.editorHost);
      await this.editor.mount(this.editorHost, {
        value: this.opts.code,
        language,
        readOnly: !this.editable
      });
      const actions = document.createElement("div");
      actions.className = "cl-actions";
      if (this.opts.tour && this.opts.tour.length) {
        this.tour = new Tour({ highlighter: this.highlighter, language });
        this.tourBtn = document.createElement("button");
        this.tourBtn.type = "button";
        this.tourBtn.className = "cl-btn cl-primary";
        this.tourBtn.textContent = this.labels.tour;
        this.tourBtn.addEventListener("click", () => this.openTour());
        actions.appendChild(this.tourBtn);
      }
      if (this.opts.runner) {
        this.runBtn = document.createElement("button");
        this.runBtn.type = "button";
        this.runBtn.className = "cl-btn";
        this.runBtn.textContent = this.labels.run;
        this.runBtn.addEventListener("click", () => void this.run());
        actions.appendChild(this.runBtn);
      }
      if (actions.childElementCount) this.root.appendChild(actions);
      if (this.opts.runner) {
        this.output = document.createElement("pre");
        this.output.className = "cl-output";
        this.output.hidden = true;
        this.output.setAttribute("aria-live", "polite");
        this.root.appendChild(this.output);
      }
    }
    openTour() {
      if (!this.tour || !this.opts.tour) return;
      this.tour.open({
        title: this.labels.tour,
        code: this.opts.code,
        steps: this.opts.tour
      });
    }
    async run() {
      const runner = this.opts.runner;
      if (!runner) return void 0;
      const code = selectRunCode(this.opts.runCode, this.getValue());
      if (this.runBtn) {
        this.runBtn.disabled = true;
        this.runBtn.textContent = this.labels.running;
      }
      this.showOutput(this.labels.running, false);
      let result;
      try {
        result = await runner.run(code);
        const view = presentRun(result, { noOutput: this.labels.noOutput });
        if (view.markers.length) this.editor.setMarkers?.(view.markers);
        this.showOutput(view.text, view.isError);
        this.opts.onRun?.(result);
      } catch (err) {
        this.showOutput(err.message || this.labels.runFailed, true);
      } finally {
        if (this.runBtn) {
          this.runBtn.disabled = false;
          this.runBtn.textContent = this.labels.run;
        }
      }
      return result;
    }
    showOutput(text, isError) {
      if (!this.output) return;
      this.output.hidden = false;
      this.output.textContent = text;
      this.output.classList.toggle("is-error", isError);
    }
    getValue() {
      return this.editor.getValue();
    }
    setValue(value) {
      this.opts.code = value;
      this.editor.setValue(value);
    }
    setEditable(editable) {
      this.editable = editable;
      this.editor.setReadOnly(!editable);
    }
    destroy() {
      this.tour?.destroy();
      this.editor.destroy();
      this.root.remove();
    }
  };

  // src/core/csharp-symbols.ts
  var NOT_A_DECLARATION = /* @__PURE__ */ new Set([
    "if",
    "else",
    "for",
    "foreach",
    "while",
    "do",
    "switch",
    "case",
    "catch",
    "try",
    "finally",
    "using",
    "lock",
    "return",
    "throw",
    "new",
    "in",
    "is",
    "as",
    "and",
    "or",
    "not",
    "when",
    "where",
    "select",
    "from",
    "let",
    "yield",
    "checked",
    "unchecked",
    "fixed",
    "unsafe",
    "default",
    "sizeof",
    "typeof",
    "nameof",
    "await",
    "base",
    "this",
    "get",
    "set",
    "add",
    "remove",
    "value"
  ]);
  var MODIFIERS = /* @__PURE__ */ new Set([
    "public",
    "private",
    "protected",
    "internal",
    "static",
    "abstract",
    "virtual",
    "override",
    "sealed",
    "readonly",
    "const",
    "extern",
    "partial",
    "async",
    "unsafe",
    "volatile",
    "new",
    "required",
    "file"
  ]);
  var TYPE_KEYWORDS = /* @__PURE__ */ new Set(["class", "interface", "record", "struct", "enum"]);
  function stripCommentsAndStrings(src) {
    const out = src.split("");
    const n = src.length;
    let i = 0;
    const blank = (from, to) => {
      for (let k = from; k < to && k < n; k++) if (out[k] !== "\n") out[k] = " ";
    };
    while (i < n) {
      const c = src[i];
      const d = src[i + 1];
      if (c === "/" && d === "/") {
        let j = i;
        while (j < n && src[j] !== "\n") j++;
        blank(i, j);
        i = j;
        continue;
      }
      if (c === "/" && d === "*") {
        let j = i + 2;
        while (j < n && !(src[j] === "*" && src[j + 1] === "/")) j++;
        blank(i, Math.min(j + 2, n));
        i = j + 2;
        continue;
      }
      if (c === "@" && d === '"') {
        let j = i + 2;
        while (j < n) {
          if (src[j] === '"' && src[j + 1] === '"') {
            j += 2;
            continue;
          }
          if (src[j] === '"') {
            j++;
            break;
          }
          j++;
        }
        blank(i, j);
        i = j;
        continue;
      }
      if (c === '"' || c === "'") {
        let j = i + 1;
        while (j < n) {
          if (src[j] === "\\") {
            j += 2;
            continue;
          }
          if (src[j] === c) {
            j++;
            break;
          }
          if (src[j] === "\n") break;
          j++;
        }
        blank(i, j);
        i = j;
        continue;
      }
      i++;
    }
    return out.join("");
  }
  function matchBrace(src, open) {
    let depth = 0;
    for (let i = open; i < src.length; i++) {
      if (src[i] === "{") depth++;
      else if (src[i] === "}") {
        depth--;
        if (depth === 0) return i;
      }
    }
    return -1;
  }
  function isIdent(s) {
    return /^[A-Za-z_][A-Za-z0-9_]*$/.test(s);
  }
  function baseList(segment) {
    const noParams = segment.replace(/\([^)]*\)/g, "");
    const noWhere = noParams.split(/\bwhere\b/)[0];
    const colon = noWhere.indexOf(":");
    if (colon === -1) return [];
    return noWhere.slice(colon + 1).split(",").map((part) => bareType(part)).filter(isIdent);
  }
  function bareType(raw) {
    return raw.replace(/<[\s\S]*$/, "").replace(/\[[\s,]*\]/g, "").replace(/\?$/, "").trim();
  }
  function scanMembers(body) {
    const members = [];
    const seen = /* @__PURE__ */ new Set();
    const push = (m) => {
      const key = m.kind + ":" + m.name;
      if (m.name && isIdent(m.name) && !seen.has(key)) {
        seen.add(key);
        members.push(m);
      }
    };
    let depth = 0;
    let stmt = "";
    for (let i = 0; i < body.length; i++) {
      const c = body[i];
      if (c === "{") {
        if (depth === 0) {
          takeDeclaration(stmt, push, true);
          stmt = "";
        }
        depth++;
        continue;
      }
      if (c === "}") {
        depth = Math.max(0, depth - 1);
        if (depth === 0) stmt = "";
        continue;
      }
      if (depth > 0) continue;
      if (c === ";") {
        takeDeclaration(stmt, push, false);
        stmt = "";
        continue;
      }
      stmt += c;
    }
    return members;
  }
  function expressionBodyArrow(text) {
    let depth = 0;
    for (let i = 0; i < text.length - 1; i++) {
      const c = text[i];
      if (c === "(" || c === "[") {
        depth++;
        continue;
      }
      if (c === ")" || c === "]") {
        depth = Math.max(0, depth - 1);
        continue;
      }
      if (depth > 0) continue;
      if (c !== "=") continue;
      if (text[i + 1] === ">") return i;
      const prev2 = text[i - 1];
      if (text[i + 1] === "=" || prev2 === "=" || prev2 === "!" || prev2 === "<" || prev2 === ">") continue;
      return -1;
    }
    return -1;
  }
  function takeDeclaration(stmt, push, blockFollows, exprBody = false) {
    const text = stmt.replace(/\s+/g, " ").trim();
    if (!text) return;
    if (/^\[/.test(text)) return;
    const arrow = expressionBodyArrow(text);
    if (arrow > 0) {
      takeDeclaration(text.slice(0, arrow), push, true, true);
      return;
    }
    const isStatic = /\bstatic\b/.test(text);
    const method = text.match(/([A-Za-z_][A-Za-z0-9_<>,.\[\]\?]*)\s+([A-Za-z_][A-Za-z0-9_]*)\s*(<[^>]*>)?\s*\(([^)]*)\)\s*$/);
    if (method) {
      const name = method[2];
      const looksLikeCtor = MODIFIERS.has(method[1]);
      if (!looksLikeCtor && !NOT_A_DECLARATION.has(name) && !MODIFIERS.has(name)) {
        const ret = bareType(method[1]);
        push({ name, kind: "method", type: ret, isStatic, detail: `${ret} ${name}(${method[4].trim()})` });
        return;
      }
    }
    const ctor = text.match(/^(?:[a-z]+\s+)*([A-Z][A-Za-z0-9_]*)\s*\(([^)]*)\)\s*$/);
    if (ctor && blockFollows) {
      const cname = ctor[1];
      push({
        name: cname,
        kind: "constructor",
        type: cname,
        isStatic: false,
        detail: `${cname}(${ctor[2].trim()})`
      });
      return;
    }
    if (blockFollows) {
      const prop = text.match(/([A-Za-z_][A-Za-z0-9_<>,.\[\]\?]*)\s+([A-Za-z_][A-Za-z0-9_]*)\s*$/);
      if (prop) {
        const name = prop[2];
        if (!NOT_A_DECLARATION.has(name) && !MODIFIERS.has(name) && !TYPE_KEYWORDS.has(name)) {
          const t = bareType(prop[1]);
          const accessors = exprBody ? "{ get; }" : "{ get; set; }";
          push({ name, kind: "property", type: t, isStatic, detail: `${t} ${name} ${accessors}` });
        }
      }
      return;
    }
    const field = text.match(/([A-Za-z_][A-Za-z0-9_<>,.\[\]\?]*)\s+([A-Za-z_][A-Za-z0-9_]*)\s*(=.*)?$/);
    if (field) {
      const name = field[2];
      if (NOT_A_DECLARATION.has(name) || MODIFIERS.has(name)) return;
      const t = bareType(field[1]);
      if (TYPE_KEYWORDS.has(t) || NOT_A_DECLARATION.has(t)) return;
      push({ name, kind: "field", type: t, isStatic, detail: `${t} ${name}` });
    }
  }
  function scanCSharp(source) {
    const types = [];
    const vars = [];
    if (!source) return { types, vars };
    let src;
    try {
      src = stripCommentsAndStrings(source);
    } catch {
      return { types, vars };
    }
    const declRe = /\b(class|interface|record|struct|enum)\s+([A-Za-z_][A-Za-z0-9_]*)/g;
    const claimed = [];
    let m;
    while ((m = declRe.exec(src)) !== null) {
      const kind = m[1];
      const name = m[2];
      const after = src.slice(m.index + m[0].length);
      const positional = after.match(/^\s*\(([^)]*)\)/);
      const open = src.indexOf("{", m.index + m[0].length);
      const semi = src.indexOf(";", m.index + m[0].length);
      const declEnd = open === -1 ? semi === -1 ? src.length : semi : semi === -1 ? open : Math.min(open, semi);
      const bases = baseList(src.slice(m.index + m[0].length, declEnd));
      let members = [];
      if (positional) {
        members = positional[1].split(",").map((p) => p.trim()).filter(Boolean).map((p) => {
          const parts = p.split(/\s+/);
          const nm = parts[parts.length - 1];
          const t = bareType(parts.slice(0, -1).join(" ")) || "object";
          return { name: nm, kind: "property", type: t, isStatic: false, detail: `${t} ${nm}` };
        }).filter((p) => isIdent(p.name));
      }
      if (open !== -1) {
        const close = matchBrace(src, open);
        const body = close === -1 ? src.slice(open + 1) : src.slice(open + 1, close);
        const between = src.slice(m.index + m[0].length, open);
        if (!/[;}]/.test(between)) {
          claimed.push([open, close === -1 ? src.length : close]);
          if (kind === "enum") {
            members = body.split(",").map((s) => s.split("=")[0].trim()).filter(isIdent).map((nm) => ({ name: nm, kind: "enumMember", isStatic: true, detail: `${name}.${nm}` }));
          } else {
            members = members.concat(scanMembers(body));
          }
        }
      }
      if (isIdent(name) && !types.some((t) => t.name === name)) types.push({ name, kind, members, bases });
    }
    const seenVar = /* @__PURE__ */ new Set();
    const varRe = /\bvar\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*new\s+([A-Za-z_][A-Za-z0-9_<>,.\s]*?)\s*[({[]/g;
    while ((m = varRe.exec(src)) !== null) {
      if (!seenVar.has(m[1])) {
        seenVar.add(m[1]);
        vars.push({ name: m[1], type: bareType(m[2]) });
      }
    }
    const typedRe = /(?:^|[;{}()]|\bfor\s*\(|\bforeach\s*\()\s*([A-Za-z_][A-Za-z0-9_<>,.\[\]\?]*)\s+([A-Za-z_][A-Za-z0-9_]*)\s*(?:=[^=]|;|\bin\b)/g;
    while ((m = typedRe.exec(src)) !== null) {
      const t = bareType(m[1]);
      const name = m[2];
      if (!isIdent(t) || NOT_A_DECLARATION.has(t) || MODIFIERS.has(t) || TYPE_KEYWORDS.has(t)) continue;
      if (NOT_A_DECLARATION.has(name) || MODIFIERS.has(name)) continue;
      if (t === "var") {
        if (!seenVar.has(name)) {
          seenVar.add(name);
          vars.push({ name });
        }
        continue;
      }
      if (!seenVar.has(name)) {
        seenVar.add(name);
        vars.push({ name, type: t });
      }
    }
    for (const t of types) {
      for (const mem of t.members) {
        if (mem.kind === "field" && !seenVar.has(mem.name)) {
          seenVar.add(mem.name);
          vars.push({ name: mem.name, type: mem.type });
        }
      }
    }
    return { types, vars };
  }
  function receiverBefore(lineUpToCursor) {
    const m = lineUpToCursor.match(/([A-Za-z_][A-Za-z0-9_]*)\s*\.\s*[A-Za-z0-9_]*$/);
    if (!m) return null;
    const before = lineUpToCursor.slice(0, lineUpToCursor.lastIndexOf(m[1]));
    if (/[.\]]\s*$/.test(before)) return null;
    return m[1];
  }
  var BUILTIN_MEMBERS = {
    List: [
      { name: "Add", kind: "method", type: "void", isStatic: false, detail: "void Add(T item)" },
      { name: "Count", kind: "property", type: "int", isStatic: false, detail: "int Count" },
      { name: "Remove", kind: "method", type: "bool", isStatic: false, detail: "bool Remove(T item)" },
      { name: "RemoveAt", kind: "method", type: "void", isStatic: false, detail: "void RemoveAt(int index)" },
      { name: "Contains", kind: "method", type: "bool", isStatic: false, detail: "bool Contains(T item)" },
      { name: "IndexOf", kind: "method", type: "int", isStatic: false, detail: "int IndexOf(T item)" },
      { name: "Insert", kind: "method", type: "void", isStatic: false, detail: "void Insert(int index, T item)" },
      { name: "Clear", kind: "method", type: "void", isStatic: false, detail: "void Clear()" },
      { name: "Sort", kind: "method", type: "void", isStatic: false, detail: "void Sort()" }
    ],
    Dictionary: [
      { name: "Add", kind: "method", type: "void", isStatic: false, detail: "void Add(TKey key, TValue value)" },
      { name: "Count", kind: "property", type: "int", isStatic: false, detail: "int Count" },
      { name: "ContainsKey", kind: "method", type: "bool", isStatic: false, detail: "bool ContainsKey(TKey key)" },
      { name: "TryGetValue", kind: "method", type: "bool", isStatic: false, detail: "bool TryGetValue(TKey key, out TValue value)" },
      { name: "Remove", kind: "method", type: "bool", isStatic: false, detail: "bool Remove(TKey key)" },
      { name: "Keys", kind: "property", isStatic: false, detail: "KeyCollection Keys" },
      { name: "Values", kind: "property", isStatic: false, detail: "ValueCollection Values" }
    ],
    string: [
      { name: "Length", kind: "property", type: "int", isStatic: false, detail: "int Length" },
      { name: "ToUpper", kind: "method", type: "string", isStatic: false, detail: "string ToUpper()" },
      { name: "ToLower", kind: "method", type: "string", isStatic: false, detail: "string ToLower()" },
      { name: "Trim", kind: "method", type: "string", isStatic: false, detail: "string Trim()" },
      { name: "Split", kind: "method", type: "string[]", isStatic: false, detail: "string[] Split(char separator)" },
      { name: "Contains", kind: "method", type: "bool", isStatic: false, detail: "bool Contains(string value)" },
      { name: "Replace", kind: "method", type: "string", isStatic: false, detail: "string Replace(string old, string New)" },
      { name: "StartsWith", kind: "method", type: "bool", isStatic: false, detail: "bool StartsWith(string value)" },
      { name: "EndsWith", kind: "method", type: "bool", isStatic: false, detail: "bool EndsWith(string value)" },
      { name: "Substring", kind: "method", type: "string", isStatic: false, detail: "string Substring(int startIndex)" }
    ]
  };
  function membersOf(symbols, receiver) {
    if (!receiver) return null;
    const asType = symbols.types.find((t2) => t2.name === receiver);
    if (asType) {
      const statics = asType.members.filter(
        (mm) => mm.kind !== "constructor" && (mm.isStatic || mm.kind === "enumMember")
      );
      return statics.length ? statics : null;
    }
    const v = symbols.vars.find((x) => x.name === receiver);
    if (!v || !v.type) return null;
    const t = symbols.types.find((x) => x.name === v.type);
    if (!t) return BUILTIN_MEMBERS[v.type] ?? null;
    const instance = t.members.filter(
      (mm) => !mm.isStatic && mm.kind !== "enumMember" && mm.kind !== "constructor"
    );
    return instance.length ? instance : null;
  }

  // src/editors/load-monaco.ts
  var MONACO_VERSION = "0.52.2";
  var DEFAULT_BASE = `https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/${MONACO_VERSION}/min/vs`;
  var pending;
  function loadMonaco(config = {}) {
    if (window.monaco) return Promise.resolve(window.monaco);
    if (pending) return pending;
    const base = config.base ?? DEFAULT_BASE;
    const registerCSharp = config.registerCSharp ?? true;
    pending = ensureLoaderScript(base).then(() => configureWorker(base)).then(() => requireEditorMain(base)).then((monaco) => {
      if (registerCSharp) registerCSharpCompletions(monaco);
      return monaco;
    });
    return pending;
  }
  function ensureLoaderScript(base) {
    if (window.require) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `${base}/loader.min.js`;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("loadMonaco: failed to load loader.min.js"));
      document.head.appendChild(script);
    });
  }
  function configureWorker(base) {
    window.MonacoEnvironment = {
      getWorkerUrl: () => `data:text/javascript;charset=utf-8,${encodeURIComponent(`
        self.MonacoEnvironment = { baseUrl: '${base.replace(/\/vs$/, "")}/' };
        importScripts('${base}/base/worker/workerMain.js');
      `)}`
    };
  }
  function requireEditorMain(base) {
    return new Promise((resolve) => {
      window.require.config({ paths: { vs: base } });
      window.require(["vs/editor/editor.main"], () => resolve(window.monaco));
    });
  }
  function registerCSharpCompletions(monaco) {
    const keywords = [
      "public",
      "private",
      "protected",
      "internal",
      "static",
      "void",
      "class",
      "interface",
      "abstract",
      "virtual",
      "override",
      "sealed",
      "readonly",
      "const",
      "new",
      "return",
      "if",
      "else",
      "for",
      "foreach",
      "while",
      "do",
      "switch",
      "case",
      "break",
      "continue",
      "using",
      "namespace",
      "this",
      "base",
      "null",
      "true",
      "false",
      "var",
      "int",
      "string",
      "bool",
      "double",
      "float",
      "decimal",
      "char",
      "object",
      "enum",
      "struct",
      "try",
      "catch",
      "finally",
      "throw",
      "get",
      "set",
      "in",
      "out",
      "ref",
      "params",
      "async",
      "await"
    ];
    const members = [
      { label: "Console.WriteLine", insert: "Console.WriteLine($0);", doc: "Write a line to the console" },
      { label: "Console.Write", insert: "Console.Write($0);", doc: "Write to the console" },
      { label: "Console.ReadLine", insert: "Console.ReadLine()", doc: "Read a line from the console" },
      { label: "string.IsNullOrEmpty", insert: "string.IsNullOrEmpty($0)", doc: "Check for null or empty string" },
      { label: "List<T>", insert: "List<$0>", doc: "Generic list" },
      { label: "Dictionary<TKey, TValue>", insert: "Dictionary<$1, $2>", doc: "Generic dictionary" },
      { label: "ToString", insert: "ToString()", doc: "Convert to string" }
    ];
    const snippets = [
      { label: "class", insert: "public class ${1:Name}\n{\n    $0\n}", doc: "Class definition" },
      { label: "interface", insert: "public interface I${1:Name}\n{\n    $0\n}", doc: "Interface definition" },
      { label: "ctor", insert: "public ${1:Type}()\n{\n    $0\n}", doc: "Constructor" },
      { label: "method", insert: "public ${1:void} ${2:Name}()\n{\n    $0\n}", doc: "Method" },
      { label: "prop", insert: "public ${1:string} ${2:Name} { get; set; }", doc: "Auto property" },
      { label: "foreach", insert: "foreach (var ${1:item} in ${2:items})\n{\n    $0\n}", doc: "Foreach loop" },
      // The course teaches design, not syntax recall. A learner who knows exactly
      // which shape they want should never be stuck on how to spell it, so every
      // control-flow construct the course uses has a skeleton here.
      { label: "if", insert: "if (${1:condition})\n{\n    $0\n}", doc: "If statement" },
      { label: "ifelse", insert: "if (${1:condition})\n{\n    $1\n}\nelse\n{\n    $0\n}", doc: "If / else" },
      { label: "else", insert: "else\n{\n    $0\n}", doc: "Else block" },
      { label: "elseif", insert: "else if (${1:condition})\n{\n    $0\n}", doc: "Else if" },
      { label: "switch", insert: "switch (${1:value})\n{\n    case ${2:option}:\n        $0\n        break;\n    default:\n        break;\n}", doc: "Switch statement" },
      { label: "case", insert: "case ${1:option}:\n    $0\n    break;", doc: "Switch case" },
      { label: "for", insert: "for (int ${1:i} = 0; ${1:i} < ${2:count}; ${1:i}++)\n{\n    $0\n}", doc: "For loop" },
      { label: "while", insert: "while (${1:condition})\n{\n    $0\n}", doc: "While loop" },
      { label: "ternary", insert: "${1:condition} ? ${2:whenTrue} : ${0:whenFalse}", doc: "Conditional expression" },
      { label: "trycatch", insert: "try\n{\n    $1\n}\ncatch (${2:Exception} ex)\n{\n    $0\n}", doc: "Try / catch" },
      { label: "list", insert: "var ${1:items} = new List<${2:string}>();", doc: "New list" },
      { label: "dict", insert: "var ${1:map} = new Dictionary<${2:string}, ${3:int}>();", doc: "New dictionary" }
    ];
    monaco.languages.registerCompletionItemProvider("csharp", {
      // `.` so member completions appear as soon as the learner types a dot,
      // instead of only after the next letter.
      triggerCharacters: ["."],
      provideCompletionItems(model, position) {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        };
        const K = monaco.languages.CompletionItemKind;
        const R = monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet;
        let scanned = { types: [], vars: [] };
        let lineUpToCursor = "";
        try {
          scanned = scanCSharp(model.getValue());
          lineUpToCursor = model.getValueInRange({
            startLineNumber: position.lineNumber,
            startColumn: 1,
            endLineNumber: position.lineNumber,
            endColumn: position.column
          });
        } catch {
        }
        const memberKind = (m) => m.kind === "method" ? K.Method : m.kind === "property" ? K.Property : m.kind === "enumMember" ? K.EnumMember : K.Field;
        const receiver = receiverBefore(lineUpToCursor);
        if (receiver) {
          const toStringItem = {
            label: "ToString",
            kind: K.Method,
            detail: "string ToString()",
            insertText: "ToString()",
            insertTextRules: void 0,
            range
          };
          const own = membersOf(scanned, receiver);
          if (own) {
            return {
              suggestions: own.map((m) => ({
                label: m.name,
                kind: memberKind(m),
                detail: m.detail,
                insertText: m.kind === "method" ? `${m.name}($0)` : m.name,
                insertTextRules: m.kind === "method" ? R : void 0,
                range
              })).concat([toStringItem])
            };
          }
          const prefix = `${receiver}.`;
          const curated = members.filter((m) => m.label.startsWith(prefix)).map((m) => ({
            label: m.label.slice(prefix.length),
            kind: K.Method,
            detail: m.doc,
            insertText: m.insert.startsWith(prefix) ? m.insert.slice(prefix.length) : m.insert,
            insertTextRules: R,
            range
          }));
          return { suggestions: curated.concat([toStringItem]) };
        }
        const suggestions = [];
        const typeKind = (t) => t.kind === "interface" ? K.Interface : t.kind === "enum" ? K.Enum : t.kind === "struct" ? K.Struct : K.Class;
        for (const t of scanned.types) {
          suggestions.push({
            label: t.name,
            kind: typeKind(t),
            detail: `${t.kind} ${t.name} (yours)`,
            insertText: t.name,
            sortText: "0" + t.name,
            range
          });
        }
        for (const v of scanned.vars) {
          suggestions.push({
            label: v.name,
            kind: K.Variable,
            detail: v.type ? `${v.type} ${v.name}` : v.name,
            insertText: v.name,
            sortText: "0" + v.name,
            range
          });
        }
        for (const kw of keywords) {
          suggestions.push({ label: kw, kind: K.Keyword, insertText: kw, range });
        }
        for (const m of members) {
          suggestions.push({ label: m.label, kind: K.Method, detail: m.doc, insertText: m.insert, insertTextRules: R, range });
        }
        for (const s of snippets) {
          suggestions.push({ label: s.label, kind: K.Snippet, detail: s.doc, insertText: s.insert, insertTextRules: R, range });
        }
        return { suggestions };
      }
    });
  }

  // src/runners/roslyn-iframe.ts
  var DEFAULT_WARM_PROGRAM = "public class __Warm { public static void Main() { } }";
  var IframeRunner = class {
    constructor(config) {
      this.iframe = null;
      this.readyPromise = null;
      this.warmPromise = null;
      this.seq = 0;
      this.pending = /* @__PURE__ */ new Map();
      this.onMessage = (e) => this.handleMessage(e);
      this.url = config.url;
      this.readyTimeout = config.readyTimeout ?? 12e4;
      this.runTimeout = config.runTimeout ?? 6e4;
      this.warmProgram = config.warmProgram ?? DEFAULT_WARM_PROGRAM;
      this.onProgress = config.onProgress;
      if (config.autoWarm ?? true) {
        void this.warm().catch(() => {
        });
      }
    }
    handleMessage(event) {
      if (event.origin !== window.location.origin) return;
      const data = event.data || {};
      const isResult = data.type === "coderunner:result" || data.type === "coderunner:traceResult";
      if (isResult && data.id != null && this.pending.has(data.id)) {
        const entry = this.pending.get(data.id);
        clearTimeout(entry.timer);
        this.pending.delete(data.id);
        entry.resolve(data.result);
      }
    }
    ensureFrame() {
      if (this.readyPromise) return this.readyPromise;
      window.addEventListener("message", this.onMessage);
      this.iframe = document.createElement("iframe");
      this.iframe.className = "cl-runner-frame";
      this.iframe.setAttribute("aria-hidden", "true");
      this.iframe.setAttribute("tabindex", "-1");
      this.iframe.title = "code runner";
      this.iframe.src = this.url;
      document.body.appendChild(this.iframe);
      this.readyPromise = new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          window.removeEventListener("message", boot);
          reject(new Error("The code runner took too long to load."));
        }, this.readyTimeout);
        const boot = (event) => {
          if (event.origin !== window.location.origin) return;
          const data = event.data || {};
          if (data.type === "coderunner:progress") {
            this.onProgress?.({
              phase: data.phase === "start" ? "start" : "download",
              percent: typeof data.percent === "number" ? data.percent : 0
            });
            return;
          }
          if (data.type === "coderunner:failed") {
            window.removeEventListener("message", boot);
            clearTimeout(timer);
            reject(new Error(data.message || "The code runner failed to load."));
            return;
          }
          if (data.type !== "coderunner:ready") return;
          window.removeEventListener("message", boot);
          clearTimeout(timer);
          resolve();
        };
        window.addEventListener("message", boot);
      });
      return this.readyPromise;
    }
    async preload() {
      await this.ensureFrame();
    }
    /** Load the runtime and JIT the backend with a throwaway compile so the first
     *  real run is fast. Idempotent: repeated calls share one warm-up. */
    async warm() {
      if (this.warmPromise) return this.warmPromise;
      this.warmPromise = (async () => {
        await this.ensureFrame();
        this.onProgress?.({ phase: "warm", percent: 100 });
        await this.run(this.warmProgram);
      })();
      return this.warmPromise;
    }
    async run(code) {
      await this.ensureFrame();
      const id = ++this.seq;
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          this.pending.delete(id);
          reject(new Error("The code took too long to run."));
        }, this.runTimeout);
        this.pending.set(id, { resolve: (r) => resolve(r), reject, timer });
        this.iframe.contentWindow.postMessage(
          { type: "coderunner:run", id, code },
          window.location.origin
        );
      });
    }
    /** Trace a program: compile an instrumented copy in the host, run it, and
     *  return the recorded ExecTrace (or the friendly errors if it did not
     *  compile). Mirrors run() over the same iframe wire. */
    async trace(code) {
      await this.ensureFrame();
      const id = ++this.seq;
      const response = await new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          this.pending.delete(id);
          reject(new Error("The code took too long to trace."));
        }, this.runTimeout);
        this.pending.set(id, { resolve: (r) => resolve(r), reject, timer });
        this.iframe.contentWindow.postMessage(
          { type: "coderunner:trace", id, code },
          window.location.origin
        );
      });
      let trace;
      if (response.compiled && response.traceJson) {
        try {
          trace = JSON.parse(response.traceJson);
        } catch {
          trace = void 0;
        }
      }
      return {
        compiled: response.compiled,
        trace,
        runtimeError: response.runtimeError ?? null,
        errors: response.errors || []
      };
    }
    destroy() {
      window.removeEventListener("message", this.onMessage);
      this.pending.forEach((p) => clearTimeout(p.timer));
      this.pending.clear();
      this.iframe?.remove();
      this.iframe = null;
      this.readyPromise = null;
      this.warmPromise = null;
    }
  };
  var RoslynIframeRunner = IframeRunner;

  // src/core/memory-model.ts
  var ALL_REGIONS = ["code", "global", "stack", "heap"];
  var FULL_REGIONS = ["code", "rodata", "data", "bss", "heap", "stack", "mmap"];
  var DEFAULT_VIZ_LABELS = {
    prev: "\u25C0 Prev",
    play: "\u25B6 Play",
    pause: "\u23F8 Pause",
    next: "Next \u25B6",
    // Byte-identical with the pre-i18n end button (was "Next"); the course catalog
    // supplies a distinct "Next lesson" string on i18n pages via `labels`.
    nextLesson: "Next \u25B6",
    reset: "Reset",
    step: "Step",
    textSize: "Text size",
    textSmall: "Small text",
    textDefault: "Default text",
    textLarge: "Large text",
    authorYou: "you wrote this",
    authorApp: "your app wrote this",
    authorModel: "the model wrote this",
    authorCode: "your code wrote this",
    toolCall: "call \u2192",
    toolError: "\u2190 error",
    toolResult: "\u2190 result",
    fanCaption: "Probability of the next token",
    objEmpty: "(empty)",
    objNoNames: "(no names yet)",
    objYourFolder: "your folder",
    objNothingYet: "Nothing points at anything yet.",
    objUnnamed: "unnamed",
    objNames: "names",
    hpMemory: "MEMORY",
    hpMemoryNote: "the call stack on the left, objects on the heap on the right",
    hpStatics: "STATICS",
    hpStaticsNote: "values shared across the program",
    hpConstants: "CONSTANTS",
    hpConstantsNote: "fixed at compile time",
    hpKindEntry: "entry point",
    hpKindStatic: "static method",
    hpKindMethod: "instance method",
    hpKindCtor: "constructor",
    hpOn: "on {recv}",
    hpPaused: "paused at line {line}",
    hpThis: "this",
    hpSecParams: "handed in",
    hpSecLocals: "declared here",
    consoleHead: "Console",
    consoleIdle: "Nothing printed yet.",
    vlPreparing: "Preparing compiler...",
    vlVisualize: "Visualize",
    vlTracing: "Tracing...",
    vlBootDownload: "Downloading compiler... {percent}%",
    vlBootStart: "Starting compiler...",
    vlBootWarm: "Warming up...",
    vlTracingSecs: "Tracing... {secs}s",
    vlHint: "Write a small program, then press Visualize to watch it run.",
    vlDidNotCompile: "Did not compile.",
    vlNoStepsHint: "That program produced no steps to show. Add a statement or two inside Main.",
    vlNoSteps: "Nothing to trace.",
    // Singular and plural are separate templates - see the note in
    // trace-narration.ts; not every language pluralises by adding a letter.
    vlTracedOne: "Traced {n} step.",
    vlTracedMany: "Traced {n} steps.",
    // These two are appended to a "Traced ..." line, so they keep their leading space.
    vlTruncated: " Stopped early - the program ran too long.",
    vlThrew: " It threw: {message}",
    vlFailedHint: "The tracer took too long or could not load. Try again."
  };
  function thisDotId(frameId) {
    return `${frameId}:this`;
  }
  function deriveRefs(stack = []) {
    const refs = [];
    for (const frame of stack) {
      if (frame.recvId) refs.push({ from: thisDotId(frame.id), to: frame.recvId });
      for (const slot of frame.vars ?? []) {
        if (slot.ref) refs.push({ from: slot.id, to: slot.ref });
      }
    }
    return refs;
  }
  function referencedIds(refs) {
    return new Set(refs.map((r) => r.to));
  }
  function slotKind(slot) {
    if (slot.empty) return "empty";
    if (slot.ref) return "ref";
    if (slot.v === "null") return "null";
    return "value";
  }
  function resolveModel(step, opts) {
    const stack = step.stack ?? [];
    const refs = opts.deriveRefs ? deriveRefs(stack) : step.refs ?? [];
    const referenced = referencedIds(refs);
    const heap = (step.heap ?? []).map((o) => ({
      ...o,
      dim: opts.autoDim ? !referenced.has(o.id) : Boolean(o.dim)
    }));
    return { ...step, stack, refs, heap };
  }
  function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  // src/core/viz-player.ts
  var VizPlayer = class {
    constructor(steps, opts) {
      this.steps = steps;
      this.opts = opts;
      this.index = 0;
      this.offScript = false;
      if (steps.length === 0) throw new Error("VizPlayer needs at least one step");
      this.model = this.resolve(this.steps[0]);
    }
    resolve(step) {
      return resolveModel(deepClone(step), this.opts);
    }
    get state() {
      return {
        index: this.index,
        total: this.steps.length,
        model: this.model,
        atStart: this.index <= 0,
        atEnd: this.index >= this.steps.length - 1,
        offScript: this.offScript
      };
    }
    goTo(n) {
      this.index = Math.max(0, Math.min(this.steps.length - 1, n));
      this.offScript = false;
      this.model = this.resolve(this.steps[this.index]);
      return this.state;
    }
    next() {
      return this.goTo(this.index + 1);
    }
    prev() {
      return this.goTo(this.index - 1);
    }
    reset() {
      return this.goTo(0);
    }
    /** Apply an interactive verb over the live model. Stays off the script until
     *  the caller steps or resets. */
    applyAction(action) {
      this.model = this.resolve(action.apply(deepClone(this.model)));
      this.offScript = true;
      return this.state;
    }
  };

  // src/core/progress-store.ts
  var ProgressStore = class {
    constructor(xpKey, awardedKey, awardAmount, store = globalThis.localStorage) {
      this.xpKey = xpKey;
      this.awardedKey = awardedKey;
      this.awardAmount = awardAmount;
      this.store = store;
      this.awarded = false;
    }
    /** The course XP total held in the store. */
    xp() {
      return parseInt(this.store.getItem(this.xpKey) || "0", 10);
    }
    /** Grant this lesson's XP the first time it is completed, once per store and
     *  once per session. No-ops when there is no awardedKey; never throws when the
     *  store is unavailable - progress simply is not saved. Returns the XP total. */
    awardOnce() {
      if (this.awarded || !this.awardedKey) return this.xp();
      this.awarded = true;
      try {
        const done = JSON.parse(this.store.getItem(this.awardedKey) || "{}");
        if (!done.done) {
          this.store.setItem(this.awardedKey, JSON.stringify({ done: true }));
          this.store.setItem(this.xpKey, String(this.xp() + this.awardAmount));
        }
      } catch {
      }
      return this.xp();
    }
  };

  // src/core/autoplay.ts
  var Autoplay = class {
    constructor(hooks) {
      this.hooks = hooks;
      this.timer = null;
      this.playing = false;
    }
    get isPlaying() {
      return this.playing;
    }
    start() {
      if (this.playing) return;
      this.playing = true;
      this.schedule();
    }
    stop() {
      if (this.timer) clearTimeout(this.timer);
      this.timer = null;
      this.playing = false;
      this.hooks.onStop();
    }
    schedule() {
      this.timer = setTimeout(() => {
        if (!this.playing) return;
        if (this.hooks.atEnd()) return this.stop();
        this.hooks.advance();
        if (this.hooks.atEnd()) this.stop();
        else this.schedule();
      }, this.hooks.stepMs());
    }
  };

  // src/core/exec-trace.ts
  function deriveTrace(steps) {
    const callDepth = new Array(steps.length);
    const lineHeatmap = /* @__PURE__ */ new Map();
    const changes = new Array(steps.length);
    const valueHistory = [];
    const historiesByName = /* @__PURE__ */ new Map();
    const notables = [];
    let previousSlots = /* @__PURE__ */ new Map();
    let previousDepth = 0;
    let previousHeapIds = /* @__PURE__ */ new Set();
    for (let i = 0; i < steps.length; i += 1) {
      const step = steps[i];
      const stack = step.stack ?? [];
      const depth = stack.length;
      const currentSlots = slotsByName(activeFrame(stack));
      callDepth[i] = depth;
      if (step.pc != null && step.pc >= 0) {
        lineHeatmap.set(step.pc, (lineHeatmap.get(step.pc) ?? 0) + 1);
      }
      changes[i] = deriveSlotChanges(currentSlots, previousSlots, i === 0);
      extendValueHistory(i, currentSlots, valueHistory, historiesByName);
      const heapIds = heapObjectIds(step);
      if (i > 0) {
        if (depth > previousDepth) notables.push({ step: i, kind: "call" });
        else if (depth < previousDepth) notables.push({ step: i, kind: "return" });
        if (heapSetGrew(previousHeapIds, heapIds)) notables.push({ step: i, kind: "new-object" });
      }
      previousSlots = currentSlots;
      previousDepth = depth;
      previousHeapIds = heapIds;
    }
    return { callDepth, lineHeatmap, changes, valueHistory, notables };
  }
  function activeFrame(stack) {
    return stack[stack.length - 1];
  }
  function slotsByName(frame) {
    const slots = /* @__PURE__ */ new Map();
    for (const slot of frame?.vars ?? []) {
      slots.set(slotName(slot), slot);
    }
    return slots;
  }
  function slotName(slot) {
    return slot.k ?? slot.id;
  }
  function slotValue(slot) {
    if (!slot || slot.empty || slot.v == null) return null;
    return slot.v;
  }
  function deriveSlotChanges(currentSlots, previousSlots, firstStep) {
    const result = [];
    for (const [name, slot] of currentSlots) {
      const previousSlot = firstStep ? void 0 : previousSlots.get(name);
      const from = firstStep ? null : slotValue(previousSlot);
      const to = slotValue(slot);
      result.push({ name, kind: changeKind(previousSlot, from, to, firstStep), from, to });
    }
    return result;
  }
  function changeKind(previousSlot, from, to, firstStep) {
    if (firstStep) return to === null ? "unchanged" : "created";
    if (!previousSlot) return "created";
    if (from === null && to !== null) return "created";
    if (from !== null && from !== to) return "changed";
    return "unchanged";
  }
  function extendValueHistory(stepIndex, currentSlots, valueHistory, historiesByName) {
    for (const [name] of currentSlots) {
      if (!historiesByName.has(name)) {
        const history = { name, values: Array(stepIndex).fill(null) };
        historiesByName.set(name, history);
        valueHistory.push(history);
      }
    }
    for (const history of valueHistory) {
      history.values.push(slotValue(currentSlots.get(history.name)));
    }
  }
  function heapObjectIds(step) {
    const ids = /* @__PURE__ */ new Set();
    for (const obj of step.heap ?? []) {
      ids.add(obj.id);
    }
    return ids;
  }
  function heapSetGrew(previousIds, currentIds) {
    return currentIds.size > previousIds.size;
  }

  // src/dom/svg.ts
  var SVG_NS = "http://www.w3.org/2000/svg";
  function svgEl(tag2, attrs) {
    const node = document.createElementNS(SVG_NS, tag2);
    for (const key in attrs) node.setAttribute(key, String(attrs[key]));
    return node;
  }

  // src/dom/board-view.ts
  var BoardView = class {
    constructor(uid) {
      this.uid = uid;
      const u = uid;
      this.el = document.createElement("div");
      this.el.className = "cl-mv-board-wrap";
      this.el.innerHTML = `
      <svg class="cl-mv-board" viewBox="0 0 1000 400" role="img" aria-label="Stylised computer board">
        <defs>
          <linearGradient id="clmv-pcb-${u}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#0f3b33" /><stop offset="1" stop-color="#0a2a25" />
          </linearGradient>
          <filter id="clmv-glow-${u}" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3.2" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <pattern id="clmv-dots-${u}" width="26" height="26" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#12463c" />
          </pattern>
        </defs>
        <rect x="6" y="6" width="988" height="388" rx="16" fill="url(#clmv-pcb-${u})" stroke="#123f36" stroke-width="2" />
        <rect x="6" y="6" width="988" height="388" rx="16" fill="url(#clmv-dots-${u})" opacity="0.6" />
        <text x="24" y="380" class="silk silk-dim s-md" font-size="12">board rev PoC \xB7 not to scale</text>

        <path data-trace="trUfs" class="trace" d="M 250 190 C 320 190, 350 190, 410 190" />
        <path data-trace="trRam" class="trace" d="M 620 150 C 690 150, 700 120, 762 120" />
        <path data-trace="trGpio" class="trace" d="M 512 300 L 512 348" />
        <path data-trace="trZoom" class="trace" d="M 851 190 C 851 300, 851 320, 851 388" opacity="0.35" />

        <g data-part="ufs">
          <rect x="96" y="136" width="154" height="108" rx="9" class="chip-body" />
          <rect x="106" y="146" width="134" height="88" rx="6" class="chip-lid" />
          <text x="173" y="178" text-anchor="middle" class="silk s-lg" font-size="15" font-weight="700">UFS</text>
          <text x="173" y="198" text-anchor="middle" class="silk s-rg" font-size="11">STORAGE</text>
          <text x="173" y="216" text-anchor="middle" class="silk silk-dim s-sm" font-size="10">256 GB \xB7 flash</text>
          <g data-ufsprog></g>
        </g>

        <g data-ram data-part="ram">
          <rect x="760" y="72" width="182" height="118" rx="9" class="chip-body" />
          <text x="851" y="92" text-anchor="middle" class="silk s-md" font-size="12" font-weight="700">LPDDR5 RAM</text>
          <g data-ramcells></g>
          <text x="851" y="184" text-anchor="middle" class="silk silk-dim s-xs" font-size="9">holds: code \xB7 global \xB7 stack \xB7 heap</text>
        </g>

        <g data-part="soc">
          <rect x="410" y="90" width="204" height="210" rx="12" class="chip-body" />
          <rect x="410" y="90" width="204" height="210" rx="12" fill="none" stroke="#2f5a52" stroke-width="1" />
          <text x="512" y="116" text-anchor="middle" class="silk s-lg" font-size="15" font-weight="700">SoC</text>
          <text x="512" y="133" text-anchor="middle" class="silk silk-dim s-sm" font-size="10">system on chip</text>
          <g data-cores></g>
          <rect x="428" y="240" width="168" height="46" rx="6" class="readout" />
          <text x="438" y="258" class="silk silk-dim s-xs" font-size="9">PC</text>
          <text data-pc x="470" y="258" class="silk s-rg" font-size="11" font-family="IBM Plex Mono, monospace">-</text>
          <text data-instr x="438" y="277" class="silk s-rg" font-size="11" font-family="IBM Plex Mono, monospace">idle</text>
        </g>

        <g data-part="gpio">
          <rect x="480" y="300" width="64" height="28" rx="5" class="chip-body" />
          <text x="512" y="318" text-anchor="middle" class="silk s-xs" font-size="9">GPIO buf</text>
          <rect x="500" y="342" width="24" height="14" rx="2" class="pad" opacity="0.85" />
          <circle data-led class="led" cx="512" cy="372" r="11" />
          <text x="536" y="376" class="silk silk-dim s-sm" font-size="10">output pin \u2192 world</text>
        </g>
      </svg>`;
      this.board = this.el.querySelector(".cl-mv-board");
      this.decorate();
    }
    decorate() {
      const cores = this.board.querySelector("[data-cores]");
      const cpos = [
        [440, 150],
        [512, 150],
        [440, 195],
        [512, 195]
      ];
      cpos.forEach((p, i) => {
        const g = svgEl("g", {});
        g.appendChild(svgEl("rect", { x: p[0], y: p[1], width: 62, height: 38, rx: 5, class: "core", "data-core": i }));
        const tx = svgEl("text", { x: p[0] + 31, y: p[1] + 24, "text-anchor": "middle", class: "silk s-xs", "font-size": 9 });
        tx.textContent = "Core " + i;
        g.appendChild(tx);
        cores.appendChild(g);
      });
      const cells = this.board.querySelector("[data-ramcells]");
      let n = 0;
      for (let r = 0; r < 3; r++)
        for (let c = 0; c < 6; c++)
          cells.appendChild(svgEl("rect", { x: 776 + c * 26, y: 110 + r * 22, width: 20, height: 16, rx: 3, class: "ramcell", "data-cell": n++ }));
      const up = this.board.querySelector("[data-ufsprog]");
      for (let i = 0; i < 4; i++)
        up.appendChild(svgEl("rect", { x: 118 + i * 30, y: 224, width: 22, height: 6, rx: 2, fill: "#c9922e", opacity: 0.9 }));
      for (let i = 0; i < 7; i++)
        this.board.appendChild(svgEl("rect", { x: 620 + i * 26, y: 348, width: 8, height: 22, rx: 2, fill: "#d9b45a", opacity: 0.5 }));
    }
    sync(ctx) {
      this.applyState(ctx.model);
    }
    animate(model) {
      return this.playPackets(model);
    }
    /** Reflect the non-animated board state for a model. */
    applyState(model) {
      const pc = model.pc ?? -1;
      this.board.querySelector("[data-pc]").textContent = pc < 0 ? "-" : "0x" + (pc + 1);
      this.board.querySelector("[data-instr]").textContent = model.instr ?? "";
      this.setRam(Boolean(model.ram));
      this.board.querySelector("[data-led]").classList.toggle("on", Boolean(model.led));
      if (typeof model.core === "number") this.pulseCore(model.core);
      this.setCores(model.cores);
      this.setHighlight(model.highlight);
    }
    setHighlight(parts) {
      const wanted = new Set(parts == null ? [] : Array.isArray(parts) ? parts : [parts]);
      this.board.querySelectorAll("[data-part]").forEach((g) => {
        g.classList.toggle("hl", wanted.has(g.getAttribute("data-part") ?? ""));
      });
    }
    setRam(loaded) {
      this.board.querySelectorAll(".ramcell").forEach((cell, i) => {
        cell.classList.toggle("on", loaded && i < 12);
      });
      this.board.querySelector("[data-ram]").classList.toggle("ram-active", loaded);
    }
    pulseCore(i) {
      const core = this.board.querySelector(`[data-core="${i}"]`);
      if (!core) return;
      core.classList.add("on");
      setTimeout(() => core.classList.remove("on"), 700);
    }
    /** Light cores persistently, tinting each to the process it runs (parallelism cue). */
    setCores(lit) {
      const tint = new Map((lit ?? []).map((c) => [c.i, c.color]));
      this.board.querySelectorAll(".core").forEach((core) => {
        const i = Number(core.getAttribute("data-core"));
        const on = tint.has(i);
        core.classList.toggle("lit", on);
        const color = tint.get(i);
        if (on && color) core.style.setProperty("--core-tint", color);
        else core.style.removeProperty("--core-tint");
      });
    }
    /** Run this model's signal packets: the load sequence, then any per-step packets. */
    async playPackets(model) {
      if (model.load) {
        await this.sendPacket("trUfs", { color: "#ffd479" });
        await this.sendPacket("trRam", { color: "#ffd479" });
        this.setRam(true);
        await this.sendPacket("trZoom", { color: "#37d3a6" });
      }
      for (const p of model.packets ?? []) await this.sendPacket(p.path, p);
    }
    sendPacket(trace, opts = {}) {
      const path = this.board.querySelector(`[data-trace="${trace}"]`);
      if (!path) return Promise.resolve();
      const { reverse = false, color = "#ffd479", dur = 780 } = opts;
      return new Promise((resolve) => {
        const len = path.getTotalLength();
        const dot = svgEl("circle", { r: 6, fill: color, filter: `url(#clmv-glow-${this.uid})` });
        this.board.appendChild(dot);
        const t0 = performance.now();
        const frame = (t) => {
          const p = Math.min(1, (t - t0) / dur);
          const pt = path.getPointAtLength((reverse ? 1 - p : p) * len);
          dot.setAttribute("cx", String(pt.x));
          dot.setAttribute("cy", String(pt.y));
          path.classList.add("hot");
          if (p < 1) requestAnimationFrame(frame);
          else {
            dot.remove();
            path.classList.remove("hot");
            resolve();
          }
        };
        requestAnimationFrame(frame);
      });
    }
  };

  // src/core/code-marks.ts
  function escapeHtml3(text) {
    return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function resolveMarks(line, mark) {
    if (mark.ranges && mark.ranges.length) {
      return mark.ranges.map(([start, end]) => ({ start, end, kind: mark.kind }));
    }
    const spans = [];
    const texts = mark.text == null ? [] : Array.isArray(mark.text) ? mark.text : [mark.text];
    for (const needle of texts) {
      if (!needle) continue;
      let from = 0;
      let idx = line.indexOf(needle, from);
      while (idx >= 0) {
        spans.push({ start: idx, end: idx + needle.length, kind: mark.kind });
        from = idx + needle.length;
        idx = line.indexOf(needle, from);
      }
    }
    return spans;
  }
  function spansForLine(lineIndex, line, codeMark, pc) {
    if (!codeMark) return [];
    const marks = Array.isArray(codeMark) ? codeMark : [codeMark];
    const spans = [];
    for (const mark of marks) {
      const target = mark.line == null ? pc : mark.line;
      if (target !== lineIndex) continue;
      spans.push(...resolveMarks(line, mark));
    }
    return spans;
  }
  function markedLineHtml(line, spans) {
    const valid = spans.filter((s) => s.start < s.end && s.start >= 0).sort((a, b) => a.start - b.start);
    if (!valid.length) return escapeHtml3(line);
    let html = "";
    let cursor = 0;
    for (const s of valid) {
      if (s.start < cursor) continue;
      const start = Math.max(cursor, s.start);
      const end = Math.min(line.length, s.end);
      if (end <= start) continue;
      if (start > cursor) html += escapeHtml3(line.slice(cursor, start));
      const kindAttr = s.kind ? ` data-kind="${escapeHtml3(s.kind)}"` : "";
      html += `<span class="cl-mv-cmark"${kindAttr}>${escapeHtml3(line.slice(start, end))}</span>`;
      cursor = end;
    }
    if (cursor < line.length) html += escapeHtml3(line.slice(cursor));
    return html;
  }

  // src/dom/reconcile.ts
  function reconcile(container, items, make) {
    const want = new Set(items.map((it) => it.id));
    Array.from(container.children).forEach((node) => {
      const el = node;
      if (!want.has(el.dataset.id ?? "") && !el.classList.contains("leaving")) {
        el.classList.add("leaving");
        setTimeout(() => el.remove(), 280);
      }
    });
    items.forEach((it) => {
      let node = container.querySelector(`[data-id="${it.id}"]:not(.leaving)`);
      if (!node) {
        node = make(it);
        node.dataset.id = it.id;
        node.classList.add("enter");
        container.appendChild(node);
      } else {
        make(it, node);
      }
    });
  }

  // src/dom/memory-die-view.ts
  var REGIONS = {
    code: {
      cls: "cl-mv-code",
      weight: 0.8,
      friendly: "code",
      tag: `CODE / TEXT <span>\xB7 read-only</span>`,
      body: `<ol data-codelist></ol>`,
      regionAttr: "data-codepanel"
    },
    rodata: {
      cls: "cl-mv-rodata",
      weight: 0.66,
      friendly: "rodata",
      tag: `RODATA <span>\xB7 constants</span>`,
      body: `<div class="cl-mv-glob" data-slots="rodata"></div>`
    },
    data: {
      cls: "cl-mv-data",
      weight: 0.7,
      friendly: "data",
      tag: `DATA <span>\xB7 set globals</span>`,
      body: `<div class="cl-mv-glob" data-slots="data"></div>`
    },
    bss: {
      cls: "cl-mv-bss",
      weight: 0.7,
      friendly: "BSS",
      tag: `BSS <span>\xB7 zeroed globals</span>`,
      body: `<div class="cl-mv-glob" data-slots="bss"></div>`
    },
    global: {
      cls: "cl-mv-global",
      weight: 0.72,
      friendly: "globals",
      tag: `GLOBAL <span>\xB7 whole-run values</span>`,
      body: `<div class="cl-mv-glob" data-slots="global"></div>`
    },
    heap: {
      cls: "cl-mv-heap",
      weight: 1.05,
      friendly: "heap",
      tag: `HEAP <span>\xB7 long-lived \xB7 grows up \u2191</span>`,
      body: `<div class="cl-mv-objs" data-heap></div>`
    },
    stack: {
      cls: "cl-mv-stack",
      weight: 1,
      friendly: "stack",
      tag: `STACK <span>\xB7 per call \xB7 grows down \u2193</span>`,
      body: `<div class="cl-mv-frames" data-stack></div>`
    },
    mmap: {
      cls: "cl-mv-mmap",
      weight: 0.72,
      friendly: "mapped",
      tag: `MAPPED <span>\xB7 shared libraries</span>`,
      body: `<div class="cl-mv-glob" data-slots="mmap"></div>`
    }
  };
  var SLOT_LIST_REGIONS = [
    ["global", "globals"],
    ["rodata", "rodata"],
    ["data", "data"],
    ["bss", "bss"],
    ["mmap", "mmap"]
  ];
  function friendlyList(regions) {
    const names = regions.map((r) => REGIONS[r].friendly);
    if (names.length <= 1) return names[0] ?? "";
    return names.slice(0, -1).join(", ") + " and " + names[names.length - 1];
  }
  var MemoryDieView = class {
    constructor(uid, code, labels, regions, showZoomTab, tagOverrides = {}) {
      this.uid = uid;
      this.code = code;
      this.regions = regions;
      this.frameNode = (f, existing) => {
        const el = existing ?? document.createElement("div");
        el.className = "cl-mv-frame" + (f.accent ? " is-accent" : "");
        if (f.accent) el.style.setProperty("--frame-accent", f.accent);
        else el.style.removeProperty("--frame-accent");
        el.innerHTML = (f.name ? `<div class="cl-mv-fname">${f.name}</div>` : "") + (f.vars ?? []).map(
          (v) => `<div class="cl-mv-slot${v.empty ? " is-empty" : ""}${v.hot ? " is-hot" : ""}">` + (v.addr ? `<span class="cl-mv-addr">${v.addr}</span>` : "") + (v.k ? `<span class="cl-mv-k">${v.k}</span>` : "") + (v.ref ? `<span class="cl-mv-v">\u2192</span><span class="cl-mv-refdot" data-dot="${v.id}"></span>` : `<span class="cl-mv-v">${v.empty ? "(free)" : v.v ?? ""}</span>`) + `</div>`
        ).join("");
        return el;
      };
      this.globalNode = (g, existing) => {
        const el = existing ?? document.createElement("div");
        el.className = "cl-mv-slot";
        el.innerHTML = `<span class="cl-mv-k">${g.k}</span><span class="cl-mv-v">${g.v}</span>`;
        return el;
      };
      this.objNode = (o, existing) => {
        const el = existing ?? document.createElement("div");
        el.className = "cl-mv-obj" + (o.dim ? " is-dim" : "");
        el.setAttribute("data-obj", o.id);
        el.innerHTML = `<div class="cl-mv-oname">${o.type} <span class="cl-mv-oat">@${o.at ?? "heap"}</span></div>` + (o.fields ?? []).map((field) => {
          const hot = (o.hotFields ?? []).includes(field[0]);
          return `<div class="cl-mv-field${hot ? " is-hot" : ""}">${field[0]} = ${field[1]}</div>`;
        }).join("");
        return el;
      };
      const regionHtml = regions.map((name) => {
        const d = REGIONS[name];
        const tag2 = tagOverrides[name] ?? d.tag;
        return `<div class="cl-mv-region ${d.cls}" data-region="${name}"${d.regionAttr ? " " + d.regionAttr : ""}><span class="cl-mv-tag">${tag2}</span>${d.body}</div>`;
      }).join("");
      const cols = regions.map((name) => `${REGIONS[name].weight}fr`).join(" ");
      this.el = document.createElement("div");
      this.el.innerHTML = `
      ${showZoomTab ? `<div class="cl-mv-zoom-tab">\u25BC zoom into the <b>${labels.chipName}</b> chip - one address space, opened up. ${friendlyList(regions)} are all areas of <b>this same chip</b>.</div>` : ""}
      <div class="cl-mv-chip">
        <div class="cl-mv-chip-head"><span class="cl-mv-chip-name">${labels.chipName}</span><span class="cl-mv-chip-addr">${labels.chipAddr}</span></div>
        <div class="cl-mv-pins"></div>
        <div class="cl-mv-die" style="grid-template-columns: ${cols};">
          ${regionHtml}
          <svg class="cl-mv-arrows"><defs>
            <marker id="clmv-ah-${uid}" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
              <path d="M0,0 L9,4.5 L0,9 z" fill="#2fa98d" stroke="none" /></marker>
          </defs></svg>
        </div>
        <div class="cl-mv-pins"></div>
      </div>`;
      this.arrows = this.el.querySelector(".cl-mv-arrows");
      this.codeList = this.el.querySelector("[data-codelist]");
      if (this.codeList) {
        code.forEach((line) => {
          const li = document.createElement("li");
          li.textContent = line;
          this.codeList.appendChild(li);
        });
      }
    }
    has(region) {
      return this.regions.includes(region);
    }
    sync(ctx) {
      this.render(ctx.model);
    }
    onResize(model) {
      this.redrawArrows(model.refs);
    }
    render(model) {
      if (this.codeList) {
        const lines2 = model.code ?? this.code;
        const pc = model.pc ?? -1;
        this.el.querySelector("[data-codepanel]").classList.toggle("dimmed", !model.codeLive);
        if (this.codeList.children.length !== lines2.length) {
          this.codeList.innerHTML = "";
          for (let i = 0; i < lines2.length; i++) this.codeList.appendChild(document.createElement("li"));
        }
        Array.from(this.codeList.children).forEach((li, i) => {
          const line = lines2[i] ?? "";
          li.innerHTML = markedLineHtml(line, spansForLine(i, line, model.codeMark, pc));
          li.classList.toggle("pc", i === pc);
        });
      }
      for (const [name, field] of SLOT_LIST_REGIONS) {
        if (!this.has(name)) continue;
        reconcile(
          this.el.querySelector(`[data-slots="${name}"]`),
          model[field] ?? [],
          this.globalNode
        );
      }
      if (this.has("stack")) {
        reconcile(this.el.querySelector("[data-stack]"), model.stack ?? [], this.frameNode);
      }
      this.setRegionHighlight(model.highlight);
      if (this.has("heap")) {
        reconcile(
          this.el.querySelector("[data-heap]"),
          model.heap.map((o) => ({ ...o })),
          this.objNode
        );
      }
      requestAnimationFrame(() => {
        model.heap.forEach((o) => {
          const el = this.el.querySelector(`[data-obj="${o.id}"]`);
          if (el) el.classList.toggle("glow", model.glow === o.id);
        });
        this.drawArrows(model.refs);
      });
    }
    redrawArrows(refs) {
      this.drawArrows(refs);
    }
    /** Spotlight the memory region(s) named in a step's `highlight`. Board parts
     *  in the same list are ignored here (the board view handles those). */
    setRegionHighlight(targets) {
      const wanted = new Set(targets == null ? [] : Array.isArray(targets) ? targets : [targets]);
      const anyRegion = this.regions.some((r) => wanted.has(r));
      this.el.querySelectorAll("[data-region]").forEach((node) => {
        const on = wanted.has(node.getAttribute("data-region") ?? "");
        node.classList.toggle("hl", on);
        node.classList.toggle("dim", anyRegion && !on);
      });
    }
    drawArrows(refs) {
      this.arrows.querySelectorAll("path.cl-mv-ref").forEach((p) => p.remove());
      if (!this.has("stack") || !this.has("heap")) return;
      const box = this.arrows.getBoundingClientRect();
      (refs ?? []).forEach((r) => {
        const from = this.el.querySelector(`[data-dot="${r.from}"]`);
        const to = this.el.querySelector(`[data-obj="${r.to}"]`);
        if (!from || !to) return;
        const a = from.getBoundingClientRect();
        const b = to.getBoundingClientRect();
        const x1 = a.left + a.width / 2 - box.left;
        const y1 = a.top + a.height / 2 - box.top;
        const x2 = b.left - box.left - 2;
        const y2 = b.top + Math.min(b.height / 2, 18) - box.top;
        const dx = Math.max(40, (x2 - x1) * 0.5);
        const path = svgEl("path", {
          class: "cl-mv-ref",
          d: `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`,
          "marker-end": `url(#clmv-ah-${this.uid})`
        });
        this.arrows.appendChild(path);
        requestAnimationFrame(() => path.classList.add("show"));
      });
    }
  };

  // src/dom/code-panel.ts
  var CodePanel = class {
    constructor(code) {
      this.lastPc = -1;
      this.code = code;
      this.el = document.createElement("div");
      this.el.className = "cl-mv-region cl-mv-code cl-mv-codepanel";
      this.el.innerHTML = `<span class="cl-mv-tag">CODE <span>\xB7 the program</span></span><ol data-codelist></ol>`;
      this.list = this.el.querySelector("[data-codelist]");
      code.forEach((line) => {
        const li = document.createElement("li");
        li.textContent = line;
        this.list.appendChild(li);
      });
    }
    sync(ctx) {
      const lines2 = ctx.model.code ?? this.code;
      const pc = ctx.model.pc ?? -1;
      const pcChanged = pc !== this.lastPc;
      this.el.classList.toggle("dimmed", !ctx.model.codeLive);
      if (this.list.children.length !== lines2.length) {
        this.list.innerHTML = "";
        for (let i = 0; i < lines2.length; i++) this.list.appendChild(document.createElement("li"));
      }
      Array.from(this.list.children).forEach((li, i) => {
        const line = lines2[i] ?? "";
        li.innerHTML = markedLineHtml(line, spansForLine(i, line, ctx.model.codeMark, pc));
        li.classList.toggle("pc", i === pc);
      });
      this.lastPc = pc;
      if (pc >= 0 && pcChanged) this.scrollPcIntoView(pc);
    }
    scrollPcIntoView(pc) {
      const activeLi = this.list.children.item(pc);
      if (!activeLi || typeof activeLi.scrollIntoView !== "function") return;
      let reducedMotion = false;
      try {
        reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
      } catch {
        reducedMotion = false;
      }
      try {
        activeLi.scrollIntoView({
          block: "nearest",
          inline: "nearest",
          behavior: reducedMotion ? "auto" : "smooth"
        });
      } catch {
      }
    }
  };

  // src/dom/vartable-view.ts
  var VarTableView = class {
    constructor() {
      this.el = document.createElement("div");
      this.el.className = "cl-mv-region cl-mv-vartable";
      this.el.innerHTML = `<span class="cl-mv-tag">VARIABLES <span>\xB7 what each name holds now</span></span><div class="cl-mv-vt-rows" data-vtrows></div>`;
      this.rows = this.el.querySelector("[data-vtrows]");
    }
    sync(ctx) {
      this.render(activeFrame2(ctx.model.stack)?.vars ?? []);
    }
    // Rebuild only when the set of names changes; otherwise update rows in place so
    // a later phase can animate the changed value without re-creating the node.
    render(vars) {
      const names = vars.map((v) => v.k ?? v.id).join("");
      if (this.rows.dataset.names !== names) {
        this.rows.dataset.names = names;
        this.rows.innerHTML = vars.length ? vars.map(rowHtml).join("") : `<div class="cl-mv-vt-empty">no variables yet</div>`;
        return;
      }
      const children = Array.from(this.rows.children);
      vars.forEach((v, i) => updateRow(children[i], v));
    }
  };
  function activeFrame2(stack) {
    const frames = stack ?? [];
    return frames[frames.length - 1];
  }
  function valueText(v) {
    if (v.empty) return "unassigned";
    return v.v ?? "";
  }
  function rowHtml(v) {
    const cls = "cl-mv-vt-row" + (v.empty ? " is-empty" : "") + (v.hot ? " is-changed" : "");
    return `<div class="${cls}"><span class="cl-mv-vt-name">${esc(v.k ?? v.id)}</span><span class="cl-mv-vt-val">${esc(valueText(v))}</span></div>`;
  }
  function updateRow(row, v) {
    if (!row) return;
    row.classList.toggle("is-empty", Boolean(v.empty));
    row.classList.toggle("is-changed", Boolean(v.hot));
    const val = row.querySelector(".cl-mv-vt-val");
    if (val) val.textContent = valueText(v);
  }
  function esc(s) {
    return s.replace(/[&<>]/g, (c) => c === "&" ? "&amp;" : c === "<" ? "&lt;" : "&gt;");
  }

  // src/dom/callstack-view.ts
  var CallStackView = class {
    constructor() {
      this.cardsById = /* @__PURE__ */ new Map();
      this.newFrameIds = /* @__PURE__ */ new Set();
      this.el = document.createElement("div");
      this.el.className = "cl-mv-region cl-mv-callstack";
      this.el.innerHTML = `<span class="cl-mv-tag">CALL STACK <span>\xB7 the calls in progress</span></span><div class="cl-mv-cs-frames" data-csframes></div>`;
      this.frames = this.el.querySelector("[data-csframes]");
    }
    sync(ctx) {
      const frames = [...ctx.model.stack ?? []].reverse();
      const liveIds = new Set(frames.map((frame) => frame.id));
      this.newFrameIds = /* @__PURE__ */ new Set();
      for (const [id, card] of this.cardsById) {
        if (!liveIds.has(id)) {
          card.remove();
          this.cardsById.delete(id);
        }
      }
      frames.forEach((frame, i) => {
        let card = this.cardsById.get(frame.id);
        if (!card) {
          card = cardEl();
          this.cardsById.set(frame.id, card);
          this.newFrameIds.add(frame.id);
        }
        updateCard(card, frame, i === 0);
        this.frames.appendChild(card);
      });
    }
    animate(_model) {
      if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
        this.newFrameIds = /* @__PURE__ */ new Set();
        return Promise.resolve();
      }
      const cards = Array.from(this.newFrameIds).map((id) => this.cardsById.get(id)).filter((card) => Boolean(card));
      this.newFrameIds = /* @__PURE__ */ new Set();
      cards.forEach((card) => card.classList.add("enter"));
      if (cards.length) {
        const removeEnter = () => cards.forEach((card) => card.classList.remove("enter"));
        if (typeof window.requestAnimationFrame === "function") window.requestAnimationFrame(removeEnter);
        else window.setTimeout(removeEnter, 60);
      }
      return Promise.resolve();
    }
  };
  function cardEl() {
    const card = document.createElement("div");
    card.className = "cl-mv-cs-frame";
    card.innerHTML = `<div class="cl-mv-cs-title"></div><div class="cl-mv-cs-locals" data-cslocals></div>`;
    return card;
  }
  function updateCard(card, frame, active) {
    card.classList.toggle("is-active", active);
    card.classList.toggle("is-caller", !active);
    const title = card.querySelector(".cl-mv-cs-title");
    if (title) title.textContent = frame.name ?? frame.id;
    const locals = card.querySelector("[data-cslocals]");
    if (locals) renderLocals(locals, frame.vars ?? []);
  }
  function renderLocals(rows, vars) {
    const names = vars.map((v) => v.k ?? v.id).join("");
    if (rows.dataset.names !== names) {
      rows.dataset.names = names;
      rows.innerHTML = vars.map(rowHtml2).join("");
      return;
    }
    const children = Array.from(rows.children);
    vars.forEach((v, i) => updateRow2(children[i], v));
  }
  function valueText2(v) {
    if (v.empty) return "unassigned";
    return v.v ?? "";
  }
  function rowHtml2(v) {
    const cls = "cl-mv-cs-row" + (v.empty ? " is-empty" : "") + (v.hot ? " is-changed" : "");
    return `<div class="${cls}"><span class="cl-mv-cs-name">${esc2(v.k ?? v.id)}</span><span class="cl-mv-cs-val">${esc2(valueText2(v))}</span></div>`;
  }
  function updateRow2(row, v) {
    if (!row) return;
    row.classList.toggle("is-empty", Boolean(v.empty));
    row.classList.toggle("is-changed", Boolean(v.hot));
    const val = row.querySelector(".cl-mv-cs-val");
    if (val) val.textContent = valueText2(v);
  }
  function esc2(s) {
    return s.replace(/[&<>]/g, (c) => c === "&" ? "&amp;" : c === "<" ? "&lt;" : "&gt;");
  }

  // src/core/template.ts
  function placeholdersOf(template) {
    const out = [];
    for (const m of String(template).matchAll(/\{(\w+)\}/g)) {
      if (!out.includes(m[1])) out.push(m[1]);
    }
    return out;
  }
  function fill(template, vars) {
    return String(template).replace(
      /\{(\w+)\}/g,
      (whole, key) => Object.prototype.hasOwnProperty.call(vars, key) ? String(vars[key]) : whole
    );
  }
  function missingPlaceholders(english, candidate) {
    const have = placeholdersOf(candidate);
    return placeholdersOf(english).filter((p) => !have.includes(p));
  }
  function mergeTemplates(defaults, overrides) {
    const merged = { ...defaults };
    const issues = [];
    if (!overrides) return { merged, issues };
    for (const key of Object.keys(overrides)) {
      const value = overrides[key];
      if (typeof value !== "string") continue;
      if (!Object.prototype.hasOwnProperty.call(defaults, key)) {
        merged[key] = value;
        continue;
      }
      const missing = missingPlaceholders(defaults[key], value);
      if (missing.length) {
        issues.push({ key, missing });
        continue;
      }
      merged[key] = value;
    }
    return { merged, issues };
  }

  // src/dom/heapcards-view.ts
  var HeapCardsView = class {
    constructor(uid, labels = DEFAULT_VIZ_LABELS) {
      // Arrow paths reused across renders (keyed "from->to"), so a reference that
      // stays put keeps its path and only its geometry updates - no flicker.
      this.refPaths = /* @__PURE__ */ new Map();
      // Bumped each render; the redraw loop stops once its generation is stale.
      this.arrowGen = 0;
      this.labels = labels;
      this.markerId = `clmv-hp-ah-${uid}`;
      this.el = document.createElement("div");
      this.el.className = "cl-mv-region cl-mv-heapcards";
      this.el.innerHTML = `<span class="cl-mv-tag">${esc3(labels.hpMemory)} <span>\xB7 ${esc3(labels.hpMemoryNote)}</span></span><div class="cl-mv-hp-statics" data-hpstatics></div><div class="cl-mv-hp-cols"><div class="cl-mv-hp-roots" data-hproots></div><div class="cl-mv-hp-objs" data-hpobjs></div><svg class="cl-mv-hp-arrows"><defs><marker id="${this.markerId}" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill="#2563eb" stroke="none" /></marker></defs></svg></div>`;
      this.statics = this.el.querySelector("[data-hpstatics]");
      this.roots = this.el.querySelector("[data-hproots]");
      this.objs = this.el.querySelector("[data-hpobjs]");
      this.arrows = this.el.querySelector(".cl-mv-hp-arrows");
    }
    sync(ctx) {
      this.render(ctx.model);
    }
    onResize(model) {
      this.drawArrows(model.refs);
    }
    render(model) {
      this.statics.innerHTML = staticsHtml(model.globals ?? [], model.rodata ?? [], this.labels);
      const stack = model.stack ?? [];
      const frames = stack.map((f, i) => ({ ...f, active: i === stack.length - 1 }));
      reconcile(this.roots, frames, (f, existing) => frameNode(f, this.labels, existing));
      reconcile(this.objs, (model.heap ?? []).map((o) => ({ ...o })), objNode);
      (model.heap ?? []).forEach((o) => {
        const card = this.el.querySelector(`[data-obj="${o.id}"]`);
        if (card) card.classList.toggle("glow", model.glow === o.id);
      });
      this.animateArrows(model.refs);
    }
    animateArrows(refs) {
      const gen = ++this.arrowGen;
      const start = now();
      const tick = () => {
        if (gen !== this.arrowGen) return;
        this.drawArrows(refs);
        if (now() - start < 340) raf(tick);
      };
      raf(tick);
    }
    drawArrows(refs) {
      const box = this.arrows.getBoundingClientRect();
      if (box.width === 0 && box.height === 0) return;
      const wanted = /* @__PURE__ */ new Map();
      (refs ?? []).forEach((r) => wanted.set(`${r.from}\u2192${r.to}`, r));
      for (const [key, path] of this.refPaths) {
        if (!wanted.has(key)) {
          path.remove();
          this.refPaths.delete(key);
        }
      }
      wanted.forEach((r, key) => {
        const from = this.el.querySelector(`[data-dot="${r.from}"]`);
        const to = this.el.querySelector(`[data-obj="${r.to}"]`);
        const existing = this.refPaths.get(key);
        if (!from || !to) {
          if (existing) {
            existing.remove();
            this.refPaths.delete(key);
          }
          return;
        }
        const a = from.getBoundingClientRect();
        const b = to.getBoundingClientRect();
        const x1 = a.left + a.width / 2 - box.left;
        const y1 = a.top + a.height / 2 - box.top;
        const x2 = b.left - box.left - 2;
        const y2 = b.top + Math.min(b.height / 2, 18) - box.top;
        const dx = Math.max(36, (x2 - x1) * 0.5);
        const d = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
        if (existing) {
          existing.setAttribute("d", d);
        } else {
          const path = svgEl("path", {
            class: "cl-mv-hp-ref",
            d,
            "marker-end": `url(#${this.markerId})`
          });
          this.arrows.appendChild(path);
          this.refPaths.set(key, path);
          raf(() => path.classList.add("show"));
        }
      });
    }
  };
  function raf(fn) {
    if (typeof window.requestAnimationFrame === "function") window.requestAnimationFrame(fn);
    else fn();
  }
  function now() {
    return typeof performance !== "undefined" && typeof performance.now === "function" ? performance.now() : Date.now();
  }
  function staticsHtml(globals, rodata, labels) {
    return [
      globals.length ? staticGroupHtml(labels.hpStatics, labels.hpStaticsNote, globals, true) : "",
      rodata.length ? staticGroupHtml(labels.hpConstants, labels.hpConstantsNote, rodata, false) : ""
    ].join("");
  }
  function staticGroupHtml(title, note, slots, allowHot) {
    const rows = slots.map((slot) => staticRowHtml(slot, allowHot)).join("");
    return `<div class="cl-mv-hp-sgroup"><span class="cl-mv-tag">${esc3(title)} <span>&#183; ${esc3(note)}</span></span><div class="cl-mv-hp-srows">${rows}</div></div>`;
  }
  function staticRowHtml(slot, allowHot) {
    const hot = allowHot && slot.hot ? " is-changed" : "";
    return `<div class="cl-mv-hp-row${hot}"><span class="cl-mv-hp-name">${esc3(slot.k)}</span><span class="cl-mv-hp-val">${esc3(slot.v)}</span></div>`;
  }
  function kindLabel(kind, labels) {
    switch (kind) {
      case "entry":
        return labels.hpKindEntry;
      case "static":
        return labels.hpKindStatic;
      case "method":
        return labels.hpKindMethod;
      case "ctor":
        return labels.hpKindCtor;
      default:
        return "";
    }
  }
  function frameNode(f, labels, existing) {
    const el = existing ?? document.createElement("div");
    el.className = "cl-mv-hp-frame" + (f.active ? " is-active" : " is-caller");
    const label = kindLabel(f.kind, labels);
    const badge = label ? `<span class="cl-mv-hp-fkind">${esc3(label)}</span>` : "";
    const paused = !f.active && typeof f.line === "number" ? `<div class="cl-mv-hp-fpaused">${esc3(fill(labels.hpPaused, { line: f.line }))}</div>` : "";
    el.innerHTML = `<div class="cl-mv-hp-fname"><span class="cl-mv-hp-fn">${esc3(f.name ?? f.id)}</span>${badge}</div>` + paused + `<div class="cl-mv-hp-rows">${frameBody(f, labels)}</div>`;
    return el;
  }
  function frameBody(f, labels) {
    const vars = f.vars ?? [];
    const thisRow = f.recvId ? section("", [refRowHtml(thisDotId(f.id), labels.hpThis, f.recv)], "is-this") : f.recv ? `<div class="cl-mv-hp-frecv">${esc3(fill(labels.hpOn, { recv: f.recv }))}</div>` : "";
    const params = vars.filter((v) => v.role === "param");
    const locals = vars.filter((v) => v.role === "local");
    if (params.length === 0 && locals.length === 0) {
      return thisRow + vars.map(rowHtml3).join("");
    }
    const rest = vars.filter((v) => v.role !== "param" && v.role !== "local");
    return thisRow + section(labels.hpSecParams, params.map(rowHtml3), "is-params") + section(labels.hpSecLocals, locals.map(rowHtml3), "is-locals") + rest.map(rowHtml3).join("");
  }
  function section(head, rows, cls) {
    if (rows.length === 0) return "";
    const title = head ? `<div class="cl-mv-hp-sechead">${esc3(head)}</div>` : "";
    return `<div class="cl-mv-hp-sec ${cls}">${title}${rows.join("")}</div>`;
  }
  function refRowHtml(dotId, name, recv) {
    const who = recv ? `<span class="cl-mv-hp-refname">${instanceHtml(recv)}</span>` : "";
    return `<div class="cl-mv-hp-row is-ref is-this"><span class="cl-mv-hp-name">${esc3(name)}</span><span class="cl-mv-hp-ref-cell"><span class="cl-mv-hp-arrowglyph">\u2192</span><span class="cl-mv-hp-dot" data-dot="${esc3(dotId)}"></span>${who}</span></div>`;
  }
  function instanceHtml(label) {
    const m = /^(.*?)(\s*#\d+)$/.exec(label);
    if (!m) return `<span class="cl-mv-hp-ty">${esc3(label)}</span>`;
    return `<span class="cl-mv-hp-ty">${esc3(m[1])}</span><span class="cl-mv-hp-instno">${esc3(m[2].trim())}</span>`;
  }
  function rowHtml3(v) {
    const kind = slotKind(v);
    const hot = v.hot ? " is-changed" : "";
    const name = `<span class="cl-mv-hp-name">${esc3(v.k ?? v.id)}</span>`;
    if (kind === "ref") {
      return `<div class="cl-mv-hp-row is-ref${hot}">` + name + `<span class="cl-mv-hp-ref-cell"><span class="cl-mv-hp-arrowglyph">\u2192</span><span class="cl-mv-hp-dot" data-dot="${esc3(v.id)}"></span></span></div>`;
    }
    if (kind === "null") {
      return `<div class="cl-mv-hp-row is-null${hot}">` + name + `<span class="cl-mv-hp-val">null</span></div>`;
    }
    const text = kind === "empty" ? "unassigned" : v.v ?? "";
    const emptyCls = kind === "empty" ? " is-empty" : "";
    return `<div class="cl-mv-hp-row${emptyCls}${hot}">` + name + `<span class="cl-mv-hp-val">${esc3(text)}</span></div>`;
  }
  function objNode(o, existing) {
    const el = existing ?? document.createElement("div");
    el.className = "cl-mv-hp-card" + (o.dim ? " is-dim" : "");
    el.setAttribute("data-obj", o.id);
    const no = typeof o.no === "number" ? `<span class="cl-mv-hp-no">#${o.no}</span>` : "";
    const fields = (o.fields ?? []).map((field) => {
      const isHot = (o.hotFields ?? []).includes(field[0]);
      return `<div class="cl-mv-hp-field${isHot ? " is-hot" : ""}"><span class="cl-mv-hp-fkey">${esc3(field[0])}</span><span class="cl-mv-hp-fval">${esc3(field[1])}</span></div>`;
    }).join("");
    el.innerHTML = `<div class="cl-mv-hp-type"><span class="cl-mv-hp-tyname">${esc3(o.type)}</span>${no}</div>` + fields;
    return el;
  }
  function esc3(s) {
    return s.replace(/[&<>]/g, (c) => c === "&" ? "&amp;" : c === "<" ? "&lt;" : "&gt;");
  }

  // src/core/narration.ts
  function escapeHtml4(text) {
    return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  var CODE_SLOT = "\0";
  function inline(text) {
    const spans = [];
    const stashed = escapeHtml4(text).replace(/`([^`]+)`/g, (_m, code) => {
      spans.push(`<code>${code}</code>`);
      return `${CODE_SLOT}${spans.length - 1}${CODE_SLOT}`;
    });
    return stashed.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\*([^*]+)\*/g, "<em>$1</em>").replace(new RegExp(`${CODE_SLOT}(\\d+)${CODE_SLOT}`, "g"), (_m, i) => spans[Number(i)]);
  }
  function renderNarration(text) {
    const lines2 = String(text ?? "").split("\n");
    let html = "";
    let bullets = [];
    const flush = () => {
      if (bullets.length) {
        html += "<ul>" + bullets.map((b) => `<li>${inline(b)}</li>`).join("") + "</ul>";
        bullets = [];
      }
    };
    for (const raw of lines2) {
      const line = raw.trim();
      if (!line) {
        flush();
        continue;
      }
      const bullet = line.match(/^[-*]\s+(.*)$/);
      if (bullet) {
        bullets.push(bullet[1]);
        continue;
      }
      flush();
      html += `<p>${inline(line)}</p>`;
    }
    flush();
    return html;
  }

  // src/dom/narration-view.ts
  var NarrationView = class {
    constructor(labels = DEFAULT_VIZ_LABELS) {
      this.stepWord = labels.step;
      this.el = document.createElement("div");
      this.el.className = "cl-mv-narr";
      this.el.innerHTML = `<span class="cl-mv-stepno" data-stepno></span><div class="cl-mv-narr-body" data-narr></div>`;
    }
    sync(ctx) {
      this.set(ctx.model.narr ?? "", `${this.stepWord.toUpperCase()} ${ctx.index + 1} / ${ctx.total}`);
    }
    set(text, stepLabel) {
      this.el.querySelector("[data-narr]").innerHTML = renderNarration(text);
      this.el.querySelector("[data-stepno]").textContent = stepLabel;
    }
  };

  // src/dom/console-view.ts
  var ConsoleView = class {
    constructor(labels = DEFAULT_VIZ_LABELS) {
      this.labels = labels;
      this.el = document.createElement("div");
      this.el.className = "cl-mv-console";
      this.el.innerHTML = `<div class="cl-mv-console-head">${esc4(labels.consoleHead)}</div><pre class="cl-mv-console-body" data-out></pre>`;
      this.body = this.el.querySelector("[data-out]");
    }
    sync(ctx) {
      const output = ctx.model.output ?? "";
      const printed = ctx.model.printed ?? "";
      if (output === "") {
        this.body.innerHTML = `<span class="cl-mv-console-idle">${esc4(this.labels.consoleIdle)}</span>`;
        return;
      }
      if (printed && output.endsWith(printed)) {
        const head = output.slice(0, output.length - printed.length);
        this.body.innerHTML = esc4(head) + `<span class="cl-mv-console-new">${esc4(printed)}</span>`;
      } else {
        this.body.textContent = output;
      }
    }
  };
  function esc4(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // src/core/agent-model.ts
  function clamp01(n) {
    if (!Number.isFinite(n)) return 0;
    return n < 0 ? 0 : n > 1 ? 1 : n;
  }
  function agentFanRows(fan) {
    if (!fan || !Array.isArray(fan.list)) return [];
    const chosen = typeof fan.chosen === "number" ? fan.chosen : -1;
    const hasChoice = chosen >= 0 && chosen < fan.list.length;
    return fan.list.map((c, i) => ({
      t: c.t,
      pct: Math.round(clamp01(c.p) * 100),
      chosen: hasChoice && i === chosen,
      dim: hasChoice && i !== chosen
    }));
  }

  // src/dom/agent-view.ts
  var AgentView = class {
    constructor(showFan = true, labels = DEFAULT_VIZ_LABELS) {
      this.showFan = showFan;
      this.fanCaption = labels.fanCaption;
      this.el = document.createElement("div");
      this.el.className = "cl-ag";
      this.el.innerHTML = `
      <div class="cl-ag-strip">
        <span class="cl-ag-cap" data-stripcap></span>
        <div class="cl-ag-tokens" data-tokens></div>
      </div>
      <div class="cl-ag-core-row">
        <span class="cl-ag-wire"></span>
        <div class="cl-ag-core" data-core>
          <div class="cl-ag-core-name" data-corename>LLM</div>
          <div class="cl-ag-core-sub" data-coresub>next-token model</div>
          <div class="cl-ag-core-dots" aria-hidden="true">
            <span></span><span></span><span></span><span></span><span></span>
          </div>
        </div>
        <span class="cl-ag-wire" data-rwire></span>
        <div class="cl-ag-tool" data-tool hidden>
          <div class="cl-ag-tool-name" data-toolname></div>
          <div class="cl-ag-tool-io" data-toolcall></div>
          <div class="cl-ag-tool-io" data-toolresult></div>
        </div>
      </div>
      ${showFan ? `<div class="cl-ag-fan is-empty" data-fan></div>` : ""}`;
    }
    sync(ctx) {
      const scene = ctx.model.agent ?? {};
      this.renderStrip(scene);
      this.renderCore(scene.core);
      this.renderTool(scene.tool);
      if (this.showFan) this.renderFan(scene);
    }
    renderStrip(scene) {
      const cap = this.el.querySelector("[data-stripcap]");
      cap.textContent = scene.stripCaption ?? "Text so far \u2014 everything the model reads";
      const host = this.el.querySelector("[data-tokens]");
      host.innerHTML = "";
      const tokens = scene.tokens ?? [];
      let prevDropped = false;
      tokens.forEach((tok, i) => {
        const dropped = tok.kind === "dropped";
        if (prevDropped && !dropped) host.appendChild(this.windowDivider(scene.windowLabel));
        const span = document.createElement("span");
        span.className = "cl-ag-tok is-" + (tok.kind ?? "given") + (tok.hot ? " is-hot" : "");
        span.textContent = tok.t;
        host.appendChild(span);
        prevDropped = dropped;
        void i;
      });
      if (scene.caret) {
        const caret = document.createElement("span");
        caret.className = "cl-ag-caret";
        host.appendChild(caret);
      }
    }
    windowDivider(label) {
      const div = document.createElement("span");
      div.className = "cl-ag-winmark";
      div.innerHTML = `<span class="cl-ag-winmark-line"></span><span class="cl-ag-winmark-label"></span>`;
      div.querySelector(".cl-ag-winmark-label").textContent = label ?? "context window";
      return div;
    }
    renderCore(core) {
      this.el.querySelector("[data-corename]").textContent = core?.label ?? "LLM";
      this.el.querySelector("[data-coresub]").textContent = core?.sub ?? "next-token model";
      this.el.querySelector("[data-core]").classList.toggle("is-live", Boolean(core?.live));
    }
    renderTool(tool) {
      const card = this.el.querySelector("[data-tool]");
      const rwire = this.el.querySelector("[data-rwire]");
      if (!tool) {
        card.hidden = true;
        rwire.className = "cl-ag-wire";
        return;
      }
      card.hidden = false;
      const state = tool.state ?? "idle";
      rwire.className = "cl-ag-wire" + (state === "calling" ? " is-hot" : "");
      card.className = "cl-ag-tool is-" + state;
      this.el.querySelector("[data-toolname]").textContent = tool.name;
      const callEl = this.el.querySelector("[data-toolcall]");
      if (tool.call) {
        callEl.hidden = false;
        callEl.className = "cl-ag-tool-io cl-ag-tool-call";
        callEl.innerHTML = `<span class="cl-ag-tool-dir">call \u2192</span><code class="cl-ag-tool-chip">${escapeHtml4(tool.call)}</code>`;
      } else {
        callEl.hidden = true;
      }
      const resEl = this.el.querySelector("[data-toolresult]");
      if (tool.result && state === "returned") {
        resEl.hidden = false;
        resEl.className = "cl-ag-tool-io cl-ag-tool-result";
        resEl.innerHTML = `<span class="cl-ag-tool-dir">\u2190 result</span><code class="cl-ag-tool-chip">${escapeHtml4(tool.result)}</code>`;
      } else {
        resEl.hidden = true;
      }
    }
    renderFan(scene) {
      const host = this.el.querySelector("[data-fan]");
      const rows = agentFanRows(scene.fan);
      const caption = scene.fan?.caption ?? this.fanCaption;
      if (rows.length === 0) {
        host.className = "cl-ag-fan is-empty";
        host.innerHTML = `<span class="cl-ag-cap">${escapeHtml4(caption)}</span>`;
        return;
      }
      host.className = "cl-ag-fan";
      let html = `<span class="cl-ag-cap">${escapeHtml4(caption)}</span>`;
      for (const row of rows) {
        const cls = "cl-ag-row" + (row.chosen ? " is-chosen" : "") + (row.dim ? " is-dim" : "");
        html += `<div class="${cls}"><span class="cl-ag-tok-name">${escapeHtml4(row.t)}</span><span class="cl-ag-track"><span class="cl-ag-fill" style="width:${row.pct}%"></span></span><span class="cl-ag-val">${row.pct}%</span></div>`;
      }
      host.innerHTML = html;
    }
  };

  // src/core/agent-loop-model.ts
  var DEFAULT_LOOP_TOOLS = [
    { id: "search", label: "search" },
    { id: "calc", label: "calculator" },
    { id: "code", label: "run code" }
  ];
  var DEFAULT_LOOP_MEMORIES = [
    { id: "episodic", label: "episodic", sub: "what happened" },
    { id: "semantic", label: "semantic", sub: "facts it knows" },
    { id: "procedural", label: "procedural", sub: "how to act" }
  ];
  function agentLoopActiveSet(scene) {
    if (!scene || !Array.isArray(scene.active)) return /* @__PURE__ */ new Set();
    return new Set(scene.active);
  }

  // src/dom/agent-loop-view.ts
  var NODES = ["env", "ctx", "llm", "tools", "mem"];
  var SVG_NS2 = "http://www.w3.org/2000/svg";
  var TOOL_BOX = { x: 812, y: 86, w: 150, rowX: 826, rowY: 122, rowW: 122, rowH: 24, step: 28 };
  var MEM_BOX = { x: 812, y: 238, w: 150, rowX: 826, rowY: 274, rowW: 122, rowH: 34, step: 38 };
  var toolsHeight = TOOL_BOX.rowY - TOOL_BOX.y + (DEFAULT_LOOP_TOOLS.length - 1) * TOOL_BOX.step + TOOL_BOX.rowH + 4;
  var memHeight = MEM_BOX.rowY - MEM_BOX.y + (DEFAULT_LOOP_MEMORIES.length - 1) * MEM_BOX.step + MEM_BOX.rowH + 18;
  var AgentLoopView = class {
    constructor() {
      this.scene = {};
      this.el = document.createElement("div");
      this.el.className = "cl-al";
      this.el.innerHTML = this.markup();
      this.svg = this.el.querySelector("svg");
    }
    sync(ctx) {
      const scene = ctx.model.agentLoop ?? {};
      this.scene = scene;
      const hasActive = Array.isArray(scene.active);
      const active = agentLoopActiveSet(scene);
      NODES.forEach((id) => {
        const el = this.node(id);
        if (!el) return;
        const on = active.has(id);
        el.classList.toggle("hl", hasActive && on);
        el.classList.toggle("dim", hasActive && !on);
      });
      this.svg.querySelectorAll(".stage").forEach(
        (s) => s.classList.toggle("on", s.getAttribute("data-stage") === (scene.stage ?? null))
      );
      this.svg.querySelectorAll(".memrow").forEach(
        (m) => m.classList.toggle("on", m.getAttribute("data-mem") === (scene.mem ?? null))
      );
      const chips = scene.chips ?? [];
      this.svg.querySelectorAll(".chip").forEach(
        (c) => c.classList.toggle("on", chips.includes(c.getAttribute("data-chip") ?? ""))
      );
      this.setCtxChips(scene.ctx ?? []);
      this.svg.querySelector("[data-think]").textContent = scene.think ?? "";
      this.svg.querySelector("[data-goal]").textContent = "GOAL: " + (scene.goal ?? "book a flight");
      const hot = new Set((scene.packets ?? []).map((p) => p.path));
      this.svg.querySelectorAll("[data-trace]").forEach(
        (t) => t.classList.toggle("hot", hot.has(t.getAttribute("data-trace") ?? ""))
      );
    }
    animate(model) {
      const scene = model.agentLoop ?? this.scene;
      (scene.packets ?? []).forEach((p) => this.sendPacket(p.path, p.reverse));
      return Promise.resolve();
    }
    node(id) {
      return this.svg.querySelector(`[data-node="${id}"]`);
    }
    setCtxChips(items) {
      const host = this.svg.querySelector("[data-ctxchips]");
      host.textContent = "";
      items.forEach((t, n) => {
        const x = 350 + n * 172;
        const g = svgEl("g", {});
        g.appendChild(svgEl("rect", { class: "ctxchip", x, y: 148, width: 160, height: 24, rx: 5 }));
        const tx = svgEl("text", { class: "ctxchip-t", x: x + 9, y: 165 });
        tx.textContent = t;
        g.appendChild(tx);
        host.appendChild(g);
      });
    }
    sendPacket(trace, reverse) {
      const path = this.svg.querySelector(`[data-trace="${trace}"]`);
      if (!path || typeof path.getTotalLength !== "function") return;
      const len = path.getTotalLength();
      const dot = document.createElementNS(SVG_NS2, "circle");
      dot.setAttribute("r", "6");
      dot.setAttribute("class", "cl-al-packet");
      this.svg.appendChild(dot);
      const dur = 780;
      const t0 = performance.now();
      const frame = (t) => {
        const p = Math.min(1, (t - t0) / dur);
        const pt = path.getPointAtLength((reverse ? 1 - p : p) * len);
        dot.setAttribute("cx", String(pt.x));
        dot.setAttribute("cy", String(pt.y));
        if (p < 1) requestAnimationFrame(frame);
        else dot.remove();
      };
      requestAnimationFrame(frame);
    }
    toolsMarkup() {
      const cx = TOOL_BOX.x + TOOL_BOX.w / 2;
      return DEFAULT_LOOP_TOOLS.map((tool, i) => {
        const y = TOOL_BOX.rowY + i * TOOL_BOX.step;
        return `<rect class="chip" data-chip="${tool.id}" x="${TOOL_BOX.rowX}" y="${y}" width="${TOOL_BOX.rowW}" height="${TOOL_BOX.rowH}" rx="5" /><text x="${cx}" y="${y + 17}" text-anchor="middle" class="chip-t" font-size="11">${tool.label}</text>`;
      }).join("");
    }
    memoriesMarkup() {
      const tx = MEM_BOX.rowX + 10;
      return DEFAULT_LOOP_MEMORIES.map((row, i) => {
        const y = MEM_BOX.rowY + i * MEM_BOX.step;
        return `<g class="memrow" data-mem="${row.id}"><rect x="${MEM_BOX.rowX}" y="${y}" width="${MEM_BOX.rowW}" height="${MEM_BOX.rowH}" rx="6" /><text x="${tx}" y="${y + 16}" class="mem-t" font-size="10" font-weight="700">${row.label}</text><text x="${tx}" y="${y + 29}" class="mem-s" font-size="9">${row.sub}</text></g>`;
      }).join("");
    }
    markup() {
      return `
      <svg class="cl-al-svg" viewBox="0 0 1000 470" role="img" aria-label="An agent: model, context, tools and memory in a loop">
        <defs>
          <linearGradient id="cl-al-pcb" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#0f3b33" /><stop offset="1" stop-color="#0a2a25" />
          </linearGradient>
          <filter id="cl-al-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <pattern id="cl-al-dots" width="26" height="26" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#12463c" />
          </pattern>
        </defs>

        <rect x="6" y="6" width="988" height="458" rx="16" fill="url(#cl-al-pcb)" stroke="#123f36" stroke-width="2" />
        <rect x="6" y="6" width="988" height="458" rx="16" fill="url(#cl-al-dots)" opacity="0.6" />

        <path data-trace="trPercept" class="trace" d="M 232 210 C 280 210, 300 165, 338 165" />
        <path data-trace="trReason"  class="trace" d="M 520 210 L 520 250" />
        <path data-trace="trRecall"  class="trace" d="M 812 300 C 700 300, 640 300, 604 292" />
        <path data-trace="trAct"     class="trace" d="M 604 262 C 700 250, 740 175, 812 165" />
        <path data-trace="trObserve" class="trace" d="M 812 150 C 720 120, 640 150, 700 158" />

        <g class="node" data-node="env">
          <rect class="node-body" x="40" y="150" width="192" height="180" rx="12" />
          <text x="136" y="180" text-anchor="middle" class="silk" font-size="15" font-weight="700">ENVIRONMENT</text>
          <text x="136" y="200" text-anchor="middle" class="silk-dim" font-size="11">the task \xB7 the world</text>
          <rect class="goal" x="56" y="220" width="160" height="34" rx="7" />
          <text data-goal x="136" y="242" text-anchor="middle" class="goal-t" font-size="11">GOAL: book a flight</text>
          <text x="136" y="286" text-anchor="middle" class="silk-dim" font-size="10">percepts out \xB7 actions in</text>
        </g>

        <rect class="agent-shell" x="300" y="70" width="430" height="320" rx="16" />
        <text x="316" y="92" class="silk-dim" font-size="12" font-weight="700" letter-spacing="1">AGENT</text>

        <g class="node" data-node="ctx">
          <rect class="node-body" x="338" y="112" width="356" height="70" rx="10" />
          <text x="350" y="132" class="silk-dim" font-size="11" font-weight="700">CONTEXT \xB7 WORKING MEMORY</text>
          <g data-ctxchips></g>
        </g>

        <g class="node llm" data-node="llm">
          <rect class="node-body" x="430" y="250" width="180" height="96" rx="12" />
          <text x="520" y="288" text-anchor="middle" class="silk" font-size="18" font-weight="700">LLM</text>
          <text x="520" y="310" text-anchor="middle" class="silk-dim" font-size="11">reasoning engine</text>
          <text data-think x="520" y="330" text-anchor="middle" class="think" font-size="10"></text>
        </g>

        <g class="node" data-node="tools">
          <rect class="node-body" x="${TOOL_BOX.x}" y="${TOOL_BOX.y}" width="${TOOL_BOX.w}" height="${toolsHeight}" rx="12" />
          <text x="887" y="110" text-anchor="middle" class="silk" font-size="14" font-weight="700">TOOLS</text>
          ${this.toolsMarkup()}
        </g>

        <g class="node" data-node="mem">
          <rect class="node-body" x="${MEM_BOX.x}" y="${MEM_BOX.y}" width="${MEM_BOX.w}" height="${memHeight}" rx="12" />
          <text x="887" y="262" text-anchor="middle" class="silk" font-size="14" font-weight="700">MEMORY</text>
          ${this.memoriesMarkup()}
        </g>

        <g class="stage" data-stage="perceive">
          <rect x="316" y="410" width="96" height="34" rx="8" />
          <text x="364" y="431" text-anchor="middle" font-size="12">Perceive</text>
        </g>
        <text x="418" y="431" class="arrow" font-size="14">&#8594;</text>
        <g class="stage" data-stage="reason">
          <rect x="436" y="410" width="96" height="34" rx="8" />
          <text x="484" y="431" text-anchor="middle" font-size="12">Reason</text>
        </g>
        <text x="538" y="431" class="arrow" font-size="14">&#8594;</text>
        <g class="stage" data-stage="act">
          <rect x="556" y="410" width="96" height="34" rx="8" />
          <text x="604" y="431" text-anchor="middle" font-size="12">Act</text>
        </g>
        <text x="658" y="431" class="arrow" font-size="14">&#8594;</text>
        <g class="stage" data-stage="observe">
          <rect x="676" y="410" width="96" height="34" rx="8" />
          <text x="724" y="431" text-anchor="middle" font-size="12">Observe</text>
        </g>
        <text x="784" y="431" class="arrow" font-size="16">&#8635;</text>
      </svg>`;
    }
  };

  // src/core/memory-shelf-model.ts
  var DEFAULT_MEMORY_STORES = [
    { id: "episodic", name: "Episodic", blurb: "what happened before" },
    { id: "semantic", name: "Semantic", blurb: "facts that stay true" },
    { id: "procedural", name: "Procedural", blurb: "how to do things" }
  ];
  function activeStores(scene) {
    if (!scene || scene.active == null) return /* @__PURE__ */ new Set();
    const list = Array.isArray(scene.active) ? scene.active : [scene.active];
    return new Set(list);
  }
  function shelfStores(scene, stores = DEFAULT_MEMORY_STORES) {
    const active = activeStores(scene);
    const byKind = scene?.stores ?? {};
    return stores.map((meta) => ({
      meta,
      items: byKind[meta.id] ?? [],
      active: active.has(meta.id)
    }));
  }

  // src/dom/memory-shelf-view.ts
  var MemoryShelfView = class {
    constructor() {
      this.el = document.createElement("div");
      this.el.className = "cl-ms";
      this.el.innerHTML = `
      <div class="cl-ms-working" data-working>
        <span class="cl-ms-cap" data-workingcap></span>
        <div class="cl-ms-strip" data-workingitems></div>
      </div>
      <div class="cl-ms-wire" aria-hidden="true"></div>
      <div class="cl-ms-stores" data-stores></div>`;
    }
    sync(ctx) {
      const scene = ctx.model.memoryShelf ?? {};
      this.renderWorking(scene);
      this.renderStores(scene);
    }
    chip(item) {
      return `<span class="cl-ms-item${item.hot ? " is-hot" : ""}">${escapeHtml4(item.text)}</span>`;
    }
    items(list) {
      return list.length ? list.map((it) => this.chip(it)).join("") : `<span class="cl-ms-empty">empty</span>`;
    }
    renderWorking(scene) {
      this.el.querySelector("[data-workingcap]").textContent = scene.workingCaption ?? "Working memory \u2014 the context read right now";
      this.el.querySelector("[data-working]").classList.toggle(
        "is-active",
        Boolean(scene.workingActive)
      );
      this.el.querySelector("[data-workingitems]").innerHTML = this.items(scene.working ?? []);
    }
    renderStores(scene) {
      const host = this.el.querySelector("[data-stores]");
      host.innerHTML = shelfStores(scene).map(
        (s) => `<div class="cl-ms-store is-${s.meta.id}${s.active ? " is-active" : ""}"><div class="cl-ms-store-head"><span class="cl-ms-store-name">${escapeHtml4(s.meta.name)}</span><span class="cl-ms-store-blurb">${escapeHtml4(s.meta.blurb)}</span></div><div class="cl-ms-store-items">${this.items(s.items)}</div></div>`
      ).join("");
    }
  };

  // src/core/tool-rack-model.ts
  function formatToolSignature(tool) {
    const params = tool.params ?? [];
    const inner = params.map((p) => `${p.name}: ${p.type}`).join(", ");
    return `${tool.name}(${inner})`;
  }
  function resolveRackTools(scene) {
    const tools = scene?.tools ?? [];
    return tools.map((tool) => ({
      name: tool.name,
      signature: formatToolSignature(tool),
      desc: tool.desc,
      state: tool.state ?? "idle"
    }));
  }
  function toolRackRows(scene) {
    const rows = [];
    if (!scene) return rows;
    if (scene.call) rows.push({ kind: "call", text: scene.call });
    if (scene.error) rows.push({ kind: "error", text: scene.error });
    else if (scene.result) rows.push({ kind: "result", text: scene.result });
    return rows;
  }

  // src/dom/tool-rack-view.ts
  var ToolRackView = class {
    constructor(labels = DEFAULT_VIZ_LABELS) {
      this.ioMeta = {
        call: { cls: "cl-tr-call", dir: labels.toolCall },
        error: { cls: "cl-tr-error", dir: labels.toolError },
        result: { cls: "cl-tr-result", dir: labels.toolResult }
      };
      this.el = document.createElement("div");
      this.el.className = "cl-tr";
      this.el.innerHTML = `
      <span class="cl-tr-cap" data-cap></span>
      <div class="cl-tr-rack" data-rack></div>
      <div class="cl-tr-io" data-io hidden></div>`;
    }
    sync(ctx) {
      const scene = ctx.model.toolRack ?? {};
      this.el.querySelector("[data-cap]").textContent = scene.caption ?? "Tools the agent can call";
      this.renderRack(scene);
      this.renderIo(scene);
    }
    renderRack(scene) {
      const host = this.el.querySelector("[data-rack]");
      host.innerHTML = resolveRackTools(scene).map((tool) => {
        const desc = tool.desc ? `<div class="cl-tr-tool-desc">${escapeHtml4(tool.desc)}</div>` : "";
        return `<div class="cl-tr-tool is-${tool.state}"><code class="cl-tr-tool-sig">${escapeHtml4(tool.signature)}</code>` + desc + `</div>`;
      }).join("");
    }
    renderIo(scene) {
      const io = this.el.querySelector("[data-io]");
      const rows = toolRackRows(scene);
      io.hidden = rows.length === 0;
      io.innerHTML = rows.map((row) => {
        const meta = this.ioMeta[row.kind];
        return `<div class="cl-tr-line ${meta.cls}"><span class="cl-tr-dir">${meta.dir}</span><code class="cl-tr-chip">${escapeHtml4(row.text)}</code></div>`;
      }).join("");
    }
  };

  // src/core/transcript-model.ts
  var ROLE_AUTHOR = {
    system: "app",
    developer: "app",
    user: "you",
    assistant: "model",
    tool: "code"
  };
  function resolveTranscript(scene) {
    const messages = scene?.messages ?? [];
    return messages.map((m) => ({
      role: m.role,
      text: m.text,
      author: m.by ?? ROLE_AUTHOR[m.role],
      hot: Boolean(m.hot),
      note: m.note
    }));
  }
  function authorOf(message) {
    return message.by ?? ROLE_AUTHOR[message.role];
  }

  // src/dom/transcript-view.ts
  var ROLE_META = {
    system: "system",
    developer: "developer",
    user: "user",
    assistant: "assistant",
    tool: "tool"
  };
  var TranscriptView = class {
    constructor(labels = DEFAULT_VIZ_LABELS) {
      this.authorMeta = {
        you: labels.authorYou,
        app: labels.authorApp,
        model: labels.authorModel,
        code: labels.authorCode
      };
      this.el = document.createElement("div");
      this.el.className = "cl-tx";
      this.el.innerHTML = `
      <span class="cl-tx-cap" data-cap></span>
      <div class="cl-tx-banner" data-banner hidden></div>
      <div class="cl-tx-list" data-list></div>`;
    }
    sync(ctx) {
      const scene = ctx.model.transcript ?? {};
      this.el.querySelector("[data-cap]").textContent = scene.caption ?? "The conversation so far";
      this.renderBanner(scene);
      this.renderList(scene);
    }
    renderBanner(scene) {
      const banner = this.el.querySelector("[data-banner]");
      if (!scene.banner) {
        banner.hidden = true;
        banner.textContent = "";
        banner.className = "cl-tx-banner";
        return;
      }
      banner.hidden = false;
      banner.className = "cl-tx-banner" + (scene.flow ? " is-" + scene.flow : "");
      const arrow = scene.flow === "send" ? "\u2193" : scene.flow === "receive" ? "\u2191" : "";
      banner.innerHTML = (arrow ? `<span class="cl-tx-arrow">${arrow}</span>` : "") + `<span class="cl-tx-banner-t">${escapeHtml4(scene.banner)}</span>`;
    }
    renderList(scene) {
      const host = this.el.querySelector("[data-list]");
      host.innerHTML = resolveTranscript(scene).map((m) => {
        const note = m.note ? `<div class="cl-tx-note">${escapeHtml4(m.note)}</div>` : "";
        return `<div class="cl-tx-msg is-${m.role} by-${m.author}${m.hot ? " is-hot" : ""}"><div class="cl-tx-head"><span class="cl-tx-role">${ROLE_META[m.role]}</span><span class="cl-tx-by">${this.authorMeta[m.author]}</span></div><div class="cl-tx-text">${escapeHtml4(m.text)}</div>` + note + `</div>`;
      }).join("");
    }
  };

  // src/core/retrieval-model.ts
  function clampScore(score) {
    if (typeof score !== "number" || Number.isNaN(score)) return null;
    return Math.max(0, Math.min(1, score));
  }
  function resolveRetrieval(scene) {
    const docs = scene?.docs ?? [];
    return docs.map((doc) => {
      const score = clampScore(doc.score);
      return {
        text: doc.text,
        state: doc.state ?? "idle",
        score,
        scorePct: score === null ? null : Math.round(score * 100)
      };
    });
  }

  // src/dom/retrieval-view.ts
  var RetrievalView = class {
    constructor() {
      this.el = document.createElement("div");
      this.el.className = "cl-rg";
      this.el.innerHTML = `
      <span class="cl-rg-cap" data-cap></span>
      <div class="cl-rg-query" data-query hidden></div>
      <div class="cl-rg-docs" data-docs></div>
      <div class="cl-rg-answer" data-answer hidden></div>`;
    }
    sync(ctx) {
      const scene = ctx.model.retrieval ?? {};
      this.el.querySelector("[data-cap]").textContent = scene.caption ?? "The knowledge store";
      this.renderQuery(scene);
      this.renderDocs(scene);
      this.renderAnswer(scene);
    }
    renderQuery(scene) {
      const host = this.el.querySelector("[data-query]");
      if (!scene.query) {
        host.hidden = true;
        host.innerHTML = "";
        return;
      }
      host.hidden = false;
      host.innerHTML = `<span class="cl-rg-tag">${escapeHtml4(scene.queryLabel ?? "query")}</span><code class="cl-rg-qtext">${escapeHtml4(scene.query)}</code>`;
    }
    renderDocs(scene) {
      const host = this.el.querySelector("[data-docs]");
      host.innerHTML = resolveRetrieval(scene).map((doc) => {
        const bar = doc.scorePct === null ? "" : `<div class="cl-rg-bar"><span class="cl-rg-fill" style="width:${doc.scorePct}%"></span></div><span class="cl-rg-score">${doc.scorePct}%</span>`;
        return `<div class="cl-rg-doc is-${doc.state}"><div class="cl-rg-doc-text">${escapeHtml4(doc.text)}</div><div class="cl-rg-doc-meter">${bar}</div></div>`;
      }).join("");
    }
    renderAnswer(scene) {
      const host = this.el.querySelector("[data-answer]");
      if (!scene.answer) {
        host.hidden = true;
        host.innerHTML = "";
        return;
      }
      host.hidden = false;
      host.innerHTML = `<span class="cl-rg-tag">${escapeHtml4(scene.answerLabel ?? "grounded answer")}</span><div class="cl-rg-atext">${escapeHtml4(scene.answer)}</div>`;
    }
  };

  // src/core/planboard-model.ts
  function resolvePlan(scene) {
    const steps = scene?.steps ?? [];
    return steps.map((step, i) => ({
      n: i + 1,
      text: step.text,
      state: step.state ?? "pending",
      note: step.note
    }));
  }
  function planProgress(scene) {
    const steps = resolvePlan(scene);
    return { done: steps.filter((s) => s.state === "done").length, total: steps.length };
  }

  // src/dom/planboard-view.ts
  var STATE_MARK = {
    pending: "",
    active: "\u2192",
    done: "\u2713",
    blocked: "!"
  };
  var PlanboardView = class {
    constructor() {
      this.el = document.createElement("div");
      this.el.className = "cl-pb";
      this.el.innerHTML = `
      <span class="cl-pb-cap" data-cap></span>
      <div class="cl-pb-goal" data-goal hidden></div>
      <div class="cl-pb-steps" data-steps></div>
      <div class="cl-pb-prog" data-prog hidden></div>`;
    }
    sync(ctx) {
      const scene = ctx.model.plan ?? {};
      this.el.querySelector("[data-cap]").textContent = scene.caption ?? "The plan";
      this.renderGoal(scene.goal);
      this.renderSteps(scene);
      this.renderProgress(scene);
    }
    renderGoal(goal) {
      const host = this.el.querySelector("[data-goal]");
      if (!goal) {
        host.hidden = true;
        host.innerHTML = "";
        return;
      }
      host.hidden = false;
      host.innerHTML = `<span class="cl-pb-tag">goal</span><span class="cl-pb-goal-t">${escapeHtml4(goal)}</span>`;
    }
    renderSteps(scene) {
      const host = this.el.querySelector("[data-steps]");
      host.innerHTML = resolvePlan(scene).map((step) => {
        const badge = STATE_MARK[step.state] || String(step.n);
        const note = step.note ? `<div class="cl-pb-note">${escapeHtml4(step.note)}</div>` : "";
        return `<div class="cl-pb-step is-${step.state}"><span class="cl-pb-num">${escapeHtml4(badge)}</span><div class="cl-pb-body"><div class="cl-pb-text">${escapeHtml4(step.text)}</div>` + note + `</div></div>`;
      }).join("");
    }
    renderProgress(scene) {
      const host = this.el.querySelector("[data-prog]");
      const { done, total } = planProgress(scene);
      if (total === 0) {
        host.hidden = true;
        host.textContent = "";
        return;
      }
      host.hidden = false;
      host.textContent = `${done} / ${total} done`;
    }
  };

  // src/core/git-layout.ts
  function headCommit(state) {
    if (state.head.kind === "detached") return state.head.commit;
    return state.refs.get(state.head.name) ?? null;
  }
  function headBranchShort(state) {
    if (state.head.kind !== "branch") return void 0;
    return state.head.name.replace(/^refs\/heads\//, "");
  }
  function layout(state) {
    const oldestFirst = [...state.commits.keys()];
    const xOf = /* @__PURE__ */ new Map();
    oldestFirst.forEach((id, i) => xOf.set(id, i));
    const newestFirst = [...oldestFirst].reverse();
    const lanes = [];
    const yOf = /* @__PURE__ */ new Map();
    let maxLane = -1;
    const firstFree = () => {
      const free = lanes.indexOf(null);
      return free === -1 ? lanes.length : free;
    };
    for (const id of newestFirst) {
      const commit2 = state.commits.get(id);
      const reserved = [];
      for (let i = 0; i < lanes.length; i++) {
        if (lanes[i] === id) reserved.push(i);
      }
      let lane;
      if (reserved.length === 0) {
        lane = firstFree();
      } else {
        lane = reserved[0];
        for (let k = 1; k < reserved.length; k++) lanes[reserved[k]] = null;
      }
      yOf.set(id, lane);
      if (lane > maxLane) maxLane = lane;
      const parents = commit2.parents;
      if (parents.length === 0) {
        lanes[lane] = null;
      } else {
        const fp = parents[0];
        const existing = lanes.indexOf(fp);
        if (existing === -1) {
          lanes[lane] = fp;
        } else {
          const keep = Math.min(existing, lane);
          const drop = Math.max(existing, lane);
          lanes[keep] = fp;
          if (drop !== keep) lanes[drop] = null;
        }
        for (let k = 1; k < parents.length; k++) {
          const p = parents[k];
          if (!lanes.includes(p)) lanes[firstFree()] = p;
        }
      }
    }
    const nodes = oldestFirst.map((id) => ({
      id,
      x: xOf.get(id),
      y: yOf.get(id)
    }));
    const edges = [];
    for (const id of newestFirst) {
      for (const parent of state.commits.get(id).parents) {
        edges.push({ from: id, to: parent });
      }
    }
    const chips = [];
    for (const [refName, commitId] of state.refs) {
      if (refName.startsWith("refs/heads/")) {
        chips.push({
          label: refName.slice("refs/heads/".length),
          kind: "branch",
          commit: commitId
        });
      } else if (refName.startsWith("refs/tags/")) {
        chips.push({
          label: refName.slice("refs/tags/".length),
          kind: "tag",
          commit: commitId
        });
      }
    }
    const head = headCommit(state);
    if (head !== null) {
      const on = headBranchShort(state);
      const chip = { label: "HEAD", kind: "head", commit: head };
      if (on !== void 0) chip.on = on;
      chips.push(chip);
    }
    return {
      nodes,
      edges,
      chips,
      width: oldestFirst.length,
      height: maxLane + 1
    };
  }

  // src/core/text-merge.ts
  function splitLines(text) {
    if (text === "") return [];
    const lines2 = text.split("\n");
    if (lines2.length > 0 && lines2[lines2.length - 1] === "") lines2.pop();
    return lines2;
  }
  function joinLines(lines2) {
    return lines2.join("\n");
  }
  function lcsLines(a, b) {
    const n = a.length;
    const m = b.length;
    const table = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
    for (let i2 = n - 1; i2 >= 0; i2--) {
      for (let j2 = m - 1; j2 >= 0; j2--) {
        table[i2][j2] = a[i2] === b[j2] ? table[i2 + 1][j2 + 1] + 1 : Math.max(table[i2 + 1][j2], table[i2][j2 + 1]);
      }
    }
    const out = [];
    let i = 0;
    let j = 0;
    while (i < n && j < m) {
      if (a[i] === b[j]) {
        out.push({ ai: i, bi: j });
        i++;
        j++;
      } else if (table[i + 1][j] >= table[i][j + 1]) {
        i++;
      } else {
        j++;
      }
    }
    return out;
  }
  function diffHunks(base, side) {
    const matches = lcsLines(base, side);
    const hunks = [];
    let bi = 0;
    let si = 0;
    const flush = (endBase, endSide) => {
      if (endBase > bi || endSide > si) {
        hunks.push({ start: bi, end: endBase, lines: side.slice(si, endSide) });
      }
    };
    for (const m of matches) {
      flush(m.ai, m.bi);
      bi = m.ai + 1;
      si = m.bi + 1;
    }
    flush(base.length, side.length);
    return hunks;
  }
  var DEFAULT_LABELS2 = { ours: "HEAD", base: "ancestor", theirs: "other" };
  function overlaps(a, b) {
    const positive = Math.max(a.start, b.start) < Math.min(a.end, b.end);
    if (positive) return true;
    const bothInsert = a.start === a.end && b.start === b.end && a.start === b.start;
    return bothInsert && joinLines(a.lines) !== joinLines(b.lines);
  }
  function groupHunks(ourHunks, theirHunks) {
    const tagged = [
      ...ourHunks.map((h) => ({ h, side: "ours" })),
      ...theirHunks.map((h) => ({ h, side: "theirs" }))
    ].sort((x, y) => x.h.start - y.h.start || x.h.end - y.h.end);
    const groups = [];
    for (const item of tagged) {
      const last = groups[groups.length - 1];
      const touching = last && (Math.max(last.start, item.h.start) < Math.min(last.end, item.h.end) || [...last.ours, ...last.theirs].some((h) => overlaps(h, item.h)));
      if (touching) {
        last.start = Math.min(last.start, item.h.start);
        last.end = Math.max(last.end, item.h.end);
        (item.side === "ours" ? last.ours : last.theirs).push(item.h);
      } else {
        groups.push({
          start: item.h.start,
          end: item.h.end,
          ours: item.side === "ours" ? [item.h] : [],
          theirs: item.side === "theirs" ? [item.h] : []
        });
      }
    }
    return groups;
  }
  function sideLines(group, side, base) {
    if (side.length === 0) return base.slice(group.start, group.end);
    const out = [];
    let cursor = group.start;
    for (const h of side) {
      out.push(...base.slice(cursor, h.start));
      out.push(...h.lines);
      cursor = h.end;
    }
    out.push(...base.slice(cursor, group.end));
    return out;
  }
  function merge3(baseText, oursText, theirsText, labels = DEFAULT_LABELS2) {
    const base = splitLines(baseText);
    const ours = splitLines(oursText);
    const theirs = splitLines(theirsText);
    const groups = groupHunks(diffHunks(base, ours), diffHunks(base, theirs));
    const out = [];
    let cursor = 0;
    let conflicts = 0;
    for (const g of groups) {
      out.push(...base.slice(cursor, g.start));
      const ourSide = sideLines(g, g.ours, base);
      const theirSide = sideLines(g, g.theirs, base);
      if (g.ours.length === 0) {
        out.push(...theirSide);
      } else if (g.theirs.length === 0) {
        out.push(...ourSide);
      } else if (joinLines(ourSide) === joinLines(theirSide)) {
        out.push(...ourSide);
      } else {
        conflicts++;
        out.push(`<<<<<<< ${labels.ours}`);
        out.push(...ourSide);
        out.push(`||||||| ${labels.base}`);
        out.push(...base.slice(g.start, g.end));
        out.push("=======");
        out.push(...theirSide);
        out.push(`>>>>>>> ${labels.theirs}`);
      }
      cursor = g.end;
    }
    out.push(...base.slice(cursor));
    return { text: joinLines(out), clean: conflicts === 0, conflicts };
  }

  // src/core/git-model.ts
  var GitError = class extends Error {
    constructor(message) {
      super(message);
      this.name = "GitError";
    }
  };
  function fnv1a(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }
  function makeHash(parents, message, seq) {
    const preimage = parents.join(",") + "\n" + message + "\n" + seq;
    return fnv1a(preimage).toString(16).padStart(8, "0").slice(0, 7);
  }
  function cloneState(s) {
    return {
      commits: new Map(s.commits),
      refs: new Map(s.refs),
      head: s.head.kind === "branch" ? { kind: "branch", name: s.head.name } : { kind: "detached", commit: s.head.commit },
      index: new Map(s.index),
      worktree: new Map(
        [...s.worktree].map(([p, e]) => [p, { status: e.status, text: e.text }])
      ),
      merge: s.merge ? { mergeHead: s.merge.mergeHead, conflicted: [...s.merge.conflicted] } : void 0,
      reflog: (s.reflog || []).map((e) => ({ commit: e.commit, label: e.label })),
      seq: s.seq
    };
  }
  function refLabel(s) {
    return s.head.kind === "branch" ? s.head.name.replace(/^refs\/heads\//, "") : null;
  }
  function headCommit2(s) {
    if (s.head.kind === "detached") return s.head.commit;
    return s.refs.get(s.head.name) ?? null;
  }
  function moveHead(s, to, why) {
    if (why) {
      if (!s.reflog) s.reflog = [];
      s.reflog.push({ commit: to, label: why });
    }
    if (s.head.kind === "branch") {
      s.refs.set(s.head.name, to);
    } else {
      s.head = { kind: "detached", commit: to };
    }
  }
  function ancestors(s, start) {
    const seen = /* @__PURE__ */ new Set();
    const stack = [start];
    while (stack.length) {
      const h = stack.pop();
      if (seen.has(h)) continue;
      seen.add(h);
      const c = s.commits.get(h);
      if (c) for (const p of c.parents) stack.push(p);
    }
    return seen;
  }
  function mergeBases(s, a, b) {
    const aAnc = ancestors(s, a);
    const common = [...ancestors(s, b)].filter((h) => aAnc.has(h));
    const bases = [];
    for (const c of common) {
      let isBase = true;
      for (const d of common) {
        if (d === c) continue;
        const dAnc = ancestors(s, d);
        dAnc.delete(d);
        if (dAnc.has(c)) {
          isBase = false;
          break;
        }
      }
      if (isBase) bases.push(c);
    }
    return bases;
  }
  function changedPaths(s, tip, base) {
    const baseAnc = base ? ancestors(s, base) : /* @__PURE__ */ new Set();
    const paths = /* @__PURE__ */ new Set();
    for (const h of ancestors(s, tip)) {
      if (baseAnc.has(h)) continue;
      const c = s.commits.get(h);
      if (c) for (const p of c.paths) paths.add(p);
    }
    return paths;
  }
  function mergeCommitPaths(s, h, o) {
    const base = mergeBases(s, h, o)[0] ?? null;
    const hp = changedPaths(s, h, base);
    const op = changedPaths(s, o, base);
    return [.../* @__PURE__ */ new Set([...hp, ...op])];
  }
  function treeAt(s, h) {
    if (h === null) return /* @__PURE__ */ new Map();
    const c = s.commits.get(h);
    return c && c.blobs ? new Map(c.blobs) : /* @__PURE__ */ new Map();
  }
  function fileAt(s, h, path) {
    if (h === null) return null;
    const c = s.commits.get(h);
    if (!c || !c.blobs) return null;
    return c.blobs.has(path) ? c.blobs.get(path) : null;
  }
  function treeWithIndex(s, parent) {
    const blobs = treeAt(s, parent);
    for (const [p, text] of s.index) blobs.set(p, text);
    return blobs;
  }
  function firstParent(s, h) {
    const c = s.commits.get(h);
    if (!c || c.parents.length === 0) {
      throw new GitError(`revision ${h} has no parent`);
    }
    return c.parents[0];
  }
  function nthParent(s, h, n) {
    const c = s.commits.get(h);
    if (!c || c.parents.length < n) {
      throw new GitError(`revision ${h} has no parent ${n}`);
    }
    return c.parents[n - 1];
  }
  function resolveBase(s, tok) {
    if (tok === "HEAD" || tok === "@") {
      const h = headCommit2(s);
      if (h === null) throw new GitError("HEAD is unborn");
      return h;
    }
    const back = /^(?:HEAD|@)@\{(\d+)\}$/.exec(tok);
    if (back) {
      const log = s.reflog || [];
      const i = log.length - 1 - Number(back[1]);
      if (i < 0) throw new GitError(`fatal: log for 'HEAD' only has ${log.length} entries`);
      return log[i].commit;
    }
    if (s.refs.has(tok)) return s.refs.get(tok);
    const bref = `refs/heads/${tok}`;
    if (s.refs.has(bref)) return s.refs.get(bref);
    const tref = `refs/tags/${tok}`;
    if (s.refs.has(tref)) return s.refs.get(tref);
    if (s.commits.has(tok)) return tok;
    if (/^[0-9a-f]{4,40}$/.test(tok)) {
      const matches = [...s.commits.keys()].filter((h) => h.startsWith(tok));
      if (matches.length === 1) return matches[0];
      if (matches.length > 1) throw new GitError(`ambiguous short id: ${tok}`);
    }
    throw new GitError(`unknown revision: ${tok}`);
  }
  function init() {
    return {
      commits: /* @__PURE__ */ new Map(),
      refs: /* @__PURE__ */ new Map(),
      head: { kind: "branch", name: "refs/heads/main" },
      index: /* @__PURE__ */ new Map(),
      worktree: /* @__PURE__ */ new Map(),
      reflog: [],
      seq: 0
    };
  }
  function addFiles(state, files) {
    const s = cloneState(state);
    for (const f of files) {
      const path = typeof f === "string" ? f : f.path;
      const text = typeof f === "string" ? "" : f.text ?? "";
      if (s.index.has(path) || s.worktree.has(path)) continue;
      s.worktree.set(path, { status: "untracked", text });
    }
    return { state: s, effect: { kind: "none" } };
  }
  function edit(state, path, text) {
    const s = cloneState(state);
    const tracked = trackedPaths(s, headCommit2(s));
    s.worktree.set(path, {
      status: tracked.has(path) ? "modified" : "untracked",
      text
    });
    return { state: s, effect: { kind: "none" } };
  }
  function stage(state, paths) {
    const s = cloneState(state);
    for (const p of paths) {
      if (!s.worktree.has(p) && !s.index.has(p)) {
        throw new GitError(`fatal: pathspec '${p}' did not match any files`);
      }
      const entry = s.worktree.get(p);
      if (entry) s.index.set(p, entry.text);
      else if (!s.index.has(p)) s.index.set(p, "");
      s.worktree.delete(p);
    }
    return { state: s, effect: { kind: "none" } };
  }
  function amend(state, message) {
    const s = cloneState(state);
    const h = headCommit2(s);
    if (h === null) throw new GitError("You do not have anything to amend.");
    const old = s.commits.get(h);
    const parents = old.parents;
    const paths = [.../* @__PURE__ */ new Set([...old.paths, ...s.index.keys()])];
    const msg = message ?? old.message;
    const id = makeHash(parents, msg, s.seq);
    s.seq += 1;
    const blobs = new Map(old.blobs);
    for (const [p, text] of s.index) blobs.set(p, text);
    s.commits.set(id, { id, parents, message: msg, paths, blobs });
    moveHead(s, id, `commit (amend): ${msg}`);
    s.index.clear();
    return { state: s, effect: { kind: "commit", id } };
  }
  function unstage(state, paths) {
    const s = cloneState(state);
    const tracked = trackedPaths(s, headCommit2(s));
    for (const p of paths) {
      if (!s.index.has(p)) continue;
      const text = s.index.get(p);
      s.index.delete(p);
      s.worktree.set(p, {
        status: tracked.has(p) ? "modified" : "untracked",
        text
      });
    }
    return { state: s, effect: { kind: "none" } };
  }
  function commit(state, message) {
    const s = cloneState(state);
    const head = headCommit2(s);
    if (s.merge) {
      if (s.merge.conflicted.length > 0) {
        throw new GitError("cannot commit: unresolved conflicts remain");
      }
      if (head === null) throw new GitError("cannot merge into an unborn branch");
      const other = s.merge.mergeHead;
      const parents2 = [head, other];
      const paths2 = mergeCommitPaths(s, head, other);
      const id2 = makeHash(parents2, message, s.seq);
      s.seq += 1;
      const blobs2 = treeAt(s, head);
      for (const [p, text] of treeAt(s, other)) if (!blobs2.has(p)) blobs2.set(p, text);
      for (const [p, text] of s.index) blobs2.set(p, text);
      s.commits.set(id2, { id: id2, parents: parents2, message, paths: paths2, blobs: blobs2 });
      moveHead(s, id2, `commit (merge): ${message}`);
      s.merge = void 0;
      s.index.clear();
      return { state: s, effect: { kind: "merge", id: id2 } };
    }
    if (s.index.size === 0) throw new GitError("nothing to commit");
    const parents = head === null ? [] : [head];
    const paths = [...s.index.keys()];
    const id = makeHash(parents, message, s.seq);
    s.seq += 1;
    const blobs = treeWithIndex(s, head);
    s.commits.set(id, { id, parents, message, paths, blobs });
    moveHead(s, id, `commit: ${message}`);
    s.index.clear();
    return { state: s, effect: { kind: "commit", id } };
  }
  function branch(state, name, at) {
    const s = cloneState(state);
    const ref = `refs/heads/${name}`;
    if (s.refs.has(ref)) throw new GitError(`branch '${name}' already exists`);
    const target = at !== void 0 ? revParse(s, at) : headCommit2(s);
    if (target === null) throw new GitError("cannot create a branch: HEAD is unborn");
    s.refs.set(ref, target);
    return { state: s, effect: { kind: "branch", ref, commit: target } };
  }
  function tag(state, name, at) {
    const s = cloneState(state);
    const ref = `refs/tags/${name}`;
    if (s.refs.has(ref)) throw new GitError(`tag '${name}' already exists`);
    const target = at !== void 0 ? revParse(s, at) : headCommit2(s);
    if (target === null) throw new GitError("cannot create a tag: HEAD is unborn");
    s.refs.set(ref, target);
    return { state: s, effect: { kind: "tag", ref, commit: target } };
  }
  function checkout(state, target, opts) {
    const s = cloneState(state);
    if (opts?.create) {
      const ref = `refs/heads/${target}`;
      if (s.refs.has(ref)) throw new GitError(`branch '${target}' already exists`);
      const at = headCommit2(s);
      if (at === null) throw new GitError("cannot create a branch: HEAD is unborn");
      s.refs.set(ref, at);
      s.head = { kind: "branch", name: ref };
      return { state: s, effect: { kind: "checkout", ref } };
    }
    const bref = `refs/heads/${target}`;
    if (s.refs.has(bref)) {
      moveWorktreeTo(s, s.refs.get(bref));
      s.head = { kind: "branch", name: bref };
      s.reflog.push({ commit: s.refs.get(bref), label: `checkout: moving to ${target}` });
      return { state: s, effect: { kind: "checkout", ref: bref } };
    }
    if (target.startsWith("refs/heads/") && s.refs.has(target)) {
      moveWorktreeTo(s, s.refs.get(target));
      s.head = { kind: "branch", name: target };
      return { state: s, effect: { kind: "checkout", ref: target } };
    }
    const commitId = revParse(s, target);
    moveWorktreeTo(s, commitId);
    s.head = { kind: "detached", commit: commitId };
    s.reflog.push({ commit: commitId, label: `checkout: moving to ${target}` });
    return { state: s, effect: { kind: "checkout", commit: commitId } };
  }
  function moveWorktreeTo(s, to) {
    const from = headCommit2(s);
    const target = treeAt(s, to);
    const blocked = [];
    for (const [path, entry] of s.worktree) {
      if (entry.status === "untracked") continue;
      if (target.get(path) !== entry.text) blocked.push(path);
    }
    if (blocked.length > 0) {
      throw new GitError(
        "error: Your local changes to the following files would be overwritten by checkout:\n" + blocked.sort().map((p) => `        ${p}`).join("\n") + "\nPlease commit your changes before you switch branches."
      );
    }
    for (const [path, entry] of [...s.worktree]) {
      if (entry.status !== "untracked") s.worktree.delete(path);
    }
    void from;
  }
  function merge(state, otherRev) {
    const s = cloneState(state);
    const h = headCommit2(s);
    if (h === null) throw new GitError("cannot merge into an unborn branch");
    const o = revParse(s, otherRev);
    const hAnc = ancestors(s, h);
    if (hAnc.has(o)) {
      return { state: s, effect: { kind: "none" } };
    }
    const oAnc = ancestors(s, o);
    if (oAnc.has(h)) {
      moveHead(s, o, `merge ${otherRev}: Fast-forward`);
      return { state: s, effect: { kind: "ff", from: h, to: o } };
    }
    const base = mergeBases(s, h, o)[0] ?? null;
    const hPaths = changedPaths(s, h, base);
    const oPaths = changedPaths(s, o, base);
    const both = [...hPaths].filter((p) => oPaths.has(p)).sort();
    const conflicted = [];
    const resolvedText = /* @__PURE__ */ new Map();
    const markedText = /* @__PURE__ */ new Map();
    for (const p of both) {
      const baseText = fileAt(s, base, p) ?? "";
      const ourText = fileAt(s, h, p) ?? "";
      const theirText = fileAt(s, o, p) ?? "";
      if (baseText === "" && ourText === "" && theirText === "") {
        conflicted.push(p);
        continue;
      }
      const r = merge3(baseText, ourText, theirText, {
        ours: refLabel(s) ?? "HEAD",
        base: "ancestor",
        theirs: otherRev
      });
      if (r.clean) {
        resolvedText.set(p, r.text);
      } else {
        conflicted.push(p);
        markedText.set(p, r.text);
      }
    }
    if (conflicted.length > 0) {
      s.merge = { mergeHead: o, conflicted };
      for (const p of conflicted) {
        const text = markedText.get(p) ?? fileAt(s, h, p) ?? s.worktree.get(p)?.text ?? "";
        s.worktree.set(p, { status: "modified", text });
      }
      return { state: s, effect: { kind: "conflict", paths: conflicted } };
    }
    const message = `Merge ${otherRev}`;
    const parents = [h, o];
    const paths = mergeCommitPaths(s, h, o);
    const id = makeHash(parents, message, s.seq);
    s.seq += 1;
    const blobs = treeAt(s, h);
    for (const [p, text] of treeAt(s, o)) {
      if (!blobs.has(p) || fileAt(s, h, p) === fileAt(s, base, p)) blobs.set(p, text);
    }
    for (const [p, text] of resolvedText) blobs.set(p, text);
    s.commits.set(id, { id, parents, message, paths, blobs });
    moveHead(s, id, `merge ${otherRev}: Merge made by the recursive strategy.`);
    return { state: s, effect: { kind: "merge", id } };
  }
  function rebase(state, upstreamRev) {
    const s = cloneState(state);
    const h = headCommit2(s);
    if (h === null) throw new GitError("cannot rebase: HEAD is unborn");
    const o = revParse(s, upstreamRev);
    const hAnc = ancestors(s, h);
    if (hAnc.has(o)) return { state: s, effect: { kind: "none" } };
    const oAnc = ancestors(s, o);
    if (oAnc.has(h)) {
      moveHead(s, o, `rebase: fast-forward to ${upstreamRev}`);
      return { state: s, effect: { kind: "ff", from: h, to: o } };
    }
    const base = mergeBases(s, h, o)[0] ?? null;
    const replay = [...s.commits.keys()].filter((id) => hAnc.has(id) && !oAnc.has(id));
    let tip = o;
    for (const id of replay) {
      const c = s.commits.get(id);
      for (const path of c.paths) {
        const upstreamText = fileAt(s, o, path);
        const baseText = fileAt(s, base, path);
        const mineText = c.blobs.get(path) ?? null;
        const upstreamMoved = upstreamText !== baseText;
        if (upstreamMoved && upstreamText !== mineText) {
          throw new GitError(
            `CONFLICT (content): could not apply ${c.id}... ${c.message}
Both this commit and ${upstreamRev} changed ${path}.
Resolving a rebase by hand is not part of this course yet - use \`git merge\` instead.`
          );
        }
      }
      const blobs = treeAt(s, tip);
      for (const path of c.paths) {
        const text = c.blobs.get(path);
        if (text === void 0) blobs.delete(path);
        else blobs.set(path, text);
      }
      const newId = makeHash([tip], c.message, s.seq);
      s.seq += 1;
      s.commits.set(newId, {
        id: newId,
        parents: [tip],
        message: c.message,
        paths: c.paths.slice(),
        blobs
      });
      tip = newId;
    }
    moveHead(s, tip, `rebase: ${upstreamRev}`);
    return { state: s, effect: { kind: "commit", id: tip } };
  }
  function mergeAbort(state) {
    const s = cloneState(state);
    if (!s.merge) throw new GitError("no merge in progress");
    const head = headCommit2(s);
    for (const p of s.merge.conflicted) {
      if (fileAt(s, head, p) !== null) s.worktree.delete(p);
    }
    s.merge = void 0;
    return { state: s, effect: { kind: "none" } };
  }
  function resolvePaths(state, paths) {
    const s = cloneState(state);
    if (!s.merge) throw new GitError("no merge in progress");
    for (const p of paths) {
      const entry = s.worktree.get(p);
      if (entry) {
        s.index.set(p, entry.text);
        s.worktree.delete(p);
      }
    }
    const remaining = s.merge.conflicted.filter((p) => !paths.includes(p));
    s.merge = { mergeHead: s.merge.mergeHead, conflicted: remaining };
    return { state: s, effect: { kind: "none" } };
  }
  function reset(state, mode, targetRev) {
    const s = cloneState(state);
    const before = headCommit2(s);
    const target = revParse(s, targetRev);
    moveHead(s, target, `reset: moving to ${targetRev}`);
    const tracked = trackedPaths(s, target);
    const undone = before ? changedPaths(s, before, target) : /* @__PURE__ */ new Set();
    const restingStatus = (p) => tracked.has(p) ? "modified" : "untracked";
    const undoneText = (p) => fileAt(s, before, p) ?? s.index.get(p) ?? s.worktree.get(p)?.text ?? "";
    const rest = (p, text) => s.worktree.set(p, { status: restingStatus(p), text });
    if (mode === "soft") {
      for (const p of undone) s.index.set(p, undoneText(p));
    } else if (mode === "mixed") {
      for (const [p, text] of s.index) rest(p, text);
      s.index.clear();
      for (const p of undone) rest(p, undoneText(p));
    } else if (mode === "hard") {
      const staged = [...s.index];
      s.index.clear();
      for (const [path, entry] of [...s.worktree]) {
        if (entry.status !== "untracked") s.worktree.delete(path);
      }
      for (const [path, text] of staged) {
        if (!tracked.has(path)) s.worktree.set(path, { status: "untracked", text });
      }
      for (const path of undone) if (!tracked.has(path)) s.worktree.delete(path);
    }
    return { state: s, effect: { kind: "reset", mode, to: target } };
  }
  function trackedPaths(s, tip) {
    return tip ? changedPaths(s, tip, null) : /* @__PURE__ */ new Set();
  }
  function revParse(state, rev) {
    const m = rev.match(/^([^~^]+)(.*)$/);
    if (!m) throw new GitError(`unknown revision: ${rev}`);
    let commitId = resolveBase(state, m[1]);
    const ops = m[2];
    let i = 0;
    while (i < ops.length) {
      const ch = ops[i];
      i++;
      let num = "";
      while (i < ops.length && ops[i] >= "0" && ops[i] <= "9") {
        num += ops[i];
        i++;
      }
      if (ch === "~") {
        const n = num === "" ? 1 : parseInt(num, 10);
        for (let k = 0; k < n; k++) commitId = firstParent(state, commitId);
      } else if (ch === "^") {
        const n = num === "" ? 1 : parseInt(num, 10);
        commitId = nthParent(state, commitId, n);
      } else {
        throw new GitError(`unknown revision: ${rev}`);
      }
    }
    return commitId;
  }
  function revList(state, range) {
    let set;
    if (range.trim() === "--all") {
      set = /* @__PURE__ */ new Set();
      for (const ref of state.refs.values()) {
        for (const h of ancestors(state, ref)) set.add(h);
      }
      if (state.head.kind === "detached") {
        for (const h of ancestors(state, state.head.commit)) set.add(h);
      }
    } else if (range.includes("...")) {
      const [a, b] = range.split("...");
      const aAnc = ancestors(state, revParse(state, a.trim()));
      const bAnc = ancestors(state, revParse(state, b.trim()));
      set = /* @__PURE__ */ new Set();
      for (const h of aAnc) if (!bAnc.has(h)) set.add(h);
      for (const h of bAnc) if (!aAnc.has(h)) set.add(h);
    } else if (range.includes("..")) {
      const [a, b] = range.split("..");
      const aAnc = ancestors(state, revParse(state, a.trim()));
      set = /* @__PURE__ */ new Set();
      for (const h of ancestors(state, revParse(state, b.trim()))) {
        if (!aAnc.has(h)) set.add(h);
      }
    } else {
      set = ancestors(state, revParse(state, range.trim()));
    }
    return [...state.commits.keys()].filter((h) => set.has(h)).reverse();
  }

  // src/core/text-diff.ts
  function diffLines(a, b) {
    const out = [];
    let ai = 0;
    let bi = 0;
    for (const m of lcsLines(a, b)) {
      while (ai < m.ai) out.push({ kind: "-", text: a[ai++] });
      while (bi < m.bi) out.push({ kind: "+", text: b[bi++] });
      out.push({ kind: " ", text: a[m.ai] });
      ai = m.ai + 1;
      bi = m.bi + 1;
    }
    while (ai < a.length) out.push({ kind: "-", text: a[ai++] });
    while (bi < b.length) out.push({ kind: "+", text: b[bi++] });
    return out;
  }
  function hunksOf(lines2, context) {
    const changed = lines2.map((l) => l.kind !== " ");
    const keep = lines2.map(
      (_, i) => changed.slice(Math.max(0, i - context), i + context + 1).some(Boolean)
    );
    const hunks = [];
    let ai = 0;
    let bi = 0;
    let current = null;
    for (let i = 0; i < lines2.length; i++) {
      const l = lines2[i];
      if (keep[i]) {
        if (!current) {
          current = { aStart: ai + 1, aCount: 0, bStart: bi + 1, bCount: 0, lines: [] };
          hunks.push(current);
        }
        current.lines.push(l);
        if (l.kind !== "+") current.aCount++;
        if (l.kind !== "-") current.bCount++;
      } else {
        current = null;
      }
      if (l.kind !== "+") ai++;
      if (l.kind !== "-") bi++;
    }
    return hunks;
  }
  function formatFileDiff(path, oldText, newText, context = 3) {
    if (oldText === newText) return "";
    const a = splitLines(oldText);
    const b = splitLines(newText);
    const hunks = hunksOf(diffLines(a, b), context);
    if (hunks.length === 0) return "";
    const out = [
      `diff --git a/${path} b/${path}`,
      `--- a/${path}`,
      `+++ b/${path}`
    ];
    for (const h of hunks) {
      out.push(`@@ -${h.aCount === 0 ? 0 : h.aStart},${h.aCount} +${h.bCount === 0 ? 0 : h.bStart},${h.bCount} @@`);
      for (const l of h.lines) out.push(l.kind + l.text);
    }
    return out.join("\n");
  }

  // src/core/file-panel.ts
  var PANEL_ZONES = ["tree", "index", "repo"];
  function copyIn(state, zone, path) {
    if (zone === "tree") return state.worktree.get(path)?.text ?? null;
    if (zone === "index") return state.index.get(path) ?? null;
    return fileAt(state, headCommit2(state), path);
  }
  function panelFiles(state) {
    const all = /* @__PURE__ */ new Set();
    for (const p of state.worktree.keys()) all.add(p);
    for (const p of state.index.keys()) all.add(p);
    const head = headCommit2(state);
    if (head !== null) {
      const c = state.commits.get(head);
      if (c && c.blobs) for (const p of c.blobs.keys()) all.add(p);
    }
    return [...all].sort();
  }
  function behind(zones, zone) {
    const i = PANEL_ZONES.indexOf(zone);
    for (let k = i + 1; k < PANEL_ZONES.length; k++) {
      const z = zones.find((c) => c.zone === PANEL_ZONES[k]);
      if (z && z.present) return z;
    }
    return null;
  }
  function resolveFilePanel(state, path, selected) {
    const files = panelFiles(state);
    const chosen = path && files.includes(path) ? path : files[0] ?? null;
    const anyText = files.some((f) => PANEL_ZONES.some((z) => (copyIn(state, z, f) ?? "") !== ""));
    if (chosen === null || !anyText) {
      return { path: null, files, zones: [], selected: "tree", diff: null, comparedWith: null };
    }
    const zones = PANEL_ZONES.map((zone) => {
      const text = copyIn(state, zone, chosen);
      return { zone, present: text !== null, text: text ?? "", differs: false };
    });
    for (const z of zones) {
      const prev3 = behind(zones, z.zone);
      z.differs = z.present && prev3 !== null && prev3.text !== z.text;
    }
    const wanted = selected && zones.some((z) => z.zone === selected && z.present) ? selected : null;
    const interesting = zones.find((z) => z.present && z.differs)?.zone;
    const sel = wanted ?? interesting ?? (zones.find((z) => z.present)?.zone ?? "tree");
    const selCopy = zones.find((z) => z.zone === sel);
    const prev2 = behind(zones, sel);
    const showDiff = selCopy.present && prev2 !== null && prev2.text !== selCopy.text;
    return {
      path: chosen,
      files,
      zones,
      selected: sel,
      diff: showDiff ? diffLines(splitLines(prev2.text), splitLines(selCopy.text)) : null,
      comparedWith: showDiff ? prev2.zone : null
    };
  }

  // src/core/conflict-file.ts
  var OPEN = /^<{7}\s*(.*)$/;
  var BASE = /^\|{7}\s*(.*)$/;
  var SPLIT = /^={7}\s*$/;
  var CLOSE = /^>{7}\s*(.*)$/;
  function lines(text) {
    if (text === "") return [];
    const out = text.split("\n");
    if (out.length > 0 && out[out.length - 1] === "") out.pop();
    return out;
  }
  function findConflicts(text) {
    const src = lines(text);
    const out = [];
    for (let i = 0; i < src.length; i++) {
      const open = OPEN.exec(src[i]);
      if (!open) continue;
      const region = {
        start: i,
        end: i,
        ourLabel: open[1] || "ours",
        theirLabel: "theirs",
        ours: [],
        base: [],
        theirs: []
      };
      let side = "ours";
      let closed = false;
      for (let j = i + 1; j < src.length; j++) {
        const line = src[j];
        const baseMark = BASE.exec(line);
        const closeMark = CLOSE.exec(line);
        if (baseMark) {
          side = "base";
          continue;
        }
        if (SPLIT.test(line)) {
          side = "theirs";
          continue;
        }
        if (closeMark) {
          region.theirLabel = closeMark[1] || "theirs";
          region.end = j + 1;
          closed = true;
          break;
        }
        region[side].push(line);
      }
      if (!closed) continue;
      out.push(region);
      i = region.end - 1;
    }
    return out;
  }
  function resolveConflicts(text, choice) {
    const src = lines(text);
    const regions = findConflicts(text);
    if (regions.length === 0) return text;
    const out = [];
    let cursor = 0;
    for (const r of regions) {
      out.push(...src.slice(cursor, r.start));
      if (choice === "ours") out.push(...r.ours);
      else if (choice === "theirs") out.push(...r.theirs);
      else out.push(...r.ours, ...r.theirs);
      cursor = r.end;
    }
    out.push(...src.slice(cursor));
    return out.join("\n");
  }
  function hasConflictMarkers(text) {
    return findConflicts(text).length > 0;
  }

  // src/dom/git-file-panel.ts
  var ZONE_LABEL = {
    tree: "Working tree",
    index: "Staging",
    repo: "Last commit"
  };
  var ZONE_PHRASE = {
    tree: "working tree",
    index: "staging",
    repo: "the last commit"
  };
  var GitFilePanel = class {
    constructor() {
      this.path = null;
      this.zone = null;
      this.state = null;
      /** null = decide from the repo; true/false = the learner said so. */
      this.open = null;
      this.editHandler = null;
      this.editor = null;
      /** The path Monaco is currently mounted for, so it is not torn down on every
       *  repaint while the learner is typing in it. */
      this.editorPath = null;
      this.onClick = (ev) => {
        const t = ev.target?.closest(
          "[data-file],[data-zone],[data-toggle],[data-keep],[data-save]"
        );
        if (!t || !this.state) return;
        if (t.dataset.keep) {
          const path = t.dataset.path;
          const text = this.currentConflictText(path);
          if (text !== null && this.editHandler) {
            this.editHandler(path, resolveConflicts(text, t.dataset.keep));
          }
          return;
        }
        if (t.dataset.save) {
          const path = t.dataset.path;
          if (this.editor && this.editHandler) this.editHandler(path, this.editor.getValue());
          return;
        }
        if (t.dataset.toggle) {
          this.open = t.getAttribute("aria-expanded") !== "true";
        } else if (t.dataset.file) {
          this.path = t.dataset.file;
          this.zone = null;
        } else if (t.dataset.zone) {
          this.zone = t.dataset.zone;
        }
        this.paint(resolveFilePanel(this.state, this.path, this.zone));
      };
      this.el = document.createElement("div");
      this.el.className = "cl-git-fp";
      this.el.addEventListener("click", this.onClick);
    }
    /** Told when the learner writes a file. */
    onEdit(fn) {
      this.editHandler = fn;
    }
    /** Repaint for a new repo state, keeping the learner's file and zone choice
     *  when they still make sense. */
    sync(state) {
      this.state = state;
      this.paint(resolveFilePanel(state, this.path, this.zone));
    }
    paint(p) {
      if (p.path === null) {
        this.el.hidden = true;
        this.el.innerHTML = "";
        return;
      }
      this.el.hidden = false;
      this.path = p.path;
      const chips = p.files.map(
        (f) => `<button type="button" class="cl-git-fp-tab" data-file="${escapeHtml4(f)}" aria-selected="${f === p.path}">${escapeHtml4(f)}</button>`
      ).join("");
      const zoneButtons = PANEL_ZONES.map((z) => {
        const copy = p.zones.find((c) => c.zone === z);
        const dot = copy.differs ? '<i class="cl-git-fp-dot" aria-hidden="true"></i>' : "";
        const title = copy.present ? copy.differs ? `${ZONE_LABEL[z]} - this copy differs from the one behind it` : ZONE_LABEL[z] : `${ZONE_LABEL[z]} - does not hold this file`;
        return `<button type="button" class="cl-git-fp-zone" data-zone="${z}" aria-pressed="${z === p.selected}"${copy.present ? "" : " disabled"} title="${escapeHtml4(title)}">${ZONE_LABEL[z]}${dot}</button>`;
      }).join("");
      const anyDifference = p.zones.some((z) => z.differs);
      const expanded = this.open === null ? anyDifference : this.open;
      const selected = p.zones.find((c) => c.zone === p.selected);
      const conflicted = p.selected === "tree" && selected.present && hasConflictMarkers(selected.text);
      const body = conflicted ? this.conflictBody(p.path) : p.diff ? this.diffBody(p) : this.flatBody(selected.text);
      const foot = p.comparedWith ? `${ZONE_PHRASE[p.selected]}, compared with ${ZONE_PHRASE[p.comparedWith]}` : selected.present ? `${ZONE_PHRASE[p.selected]} - no change behind it` : "not in this zone";
      const summary = anyDifference ? `${p.files.length > 1 ? escapeHtml4(p.path) + " - " : ""}the copies differ` : "the files read the same everywhere";
      const toggle = `<button type="button" class="cl-git-fp-toggle" data-toggle="1" aria-expanded="${expanded}"><span class="cl-git-fp-caret" aria-hidden="true"></span><span>File contents</span><span class="cl-git-fp-summary">${summary}</span></button>`;
      this.el.innerHTML = toggle + (expanded ? `<div class="cl-git-fp-tabs" role="tablist">${chips}</div><div class="cl-git-fp-box"><div class="cl-git-fp-hd"><strong>${escapeHtml4(p.path)}</strong><span class="cl-git-fp-seg">${zoneButtons}</span></div>` + body + `<div class="cl-git-fp-ft">${escapeHtml4(foot)}</div></div>` : "");
      if (expanded && conflicted) this.mountEditor(p.path, selected.text);
      else {
        this.editor = null;
        this.editorPath = null;
      }
    }
    /** The shell the editor mounts into, plus the shortcuts. */
    conflictBody(path) {
      const p = escapeHtml4(path);
      return `<div class="cl-git-fp-conflict"><div class="cl-git-fp-actions"><span class="cl-git-fp-note">Git could not choose. Leave the lines you want.</span><button type="button" class="cl-git-fp-keep" data-keep="ours" data-path="${p}">Keep ours</button><button type="button" class="cl-git-fp-keep" data-keep="theirs" data-path="${p}">Keep theirs</button><button type="button" class="cl-git-fp-keep" data-keep="both" data-path="${p}">Keep both</button></div><div class="cl-git-fp-editor" data-editor-host="1"></div><div class="cl-git-fp-actions is-end"><button type="button" class="cl-git-fp-save" data-save="1" data-path="${p}">Save the file</button></div></div>`;
    }
    /** Mount Monaco once per file. Re-mounting on every repaint would take the
     *  cursor away mid-word, so an editor already showing this path is left be. */
    mountEditor(path, text) {
      const host = this.el.querySelector("[data-editor-host]");
      if (!host) return;
      if (this.editorPath === path && this.editor) {
        if (this.editor.getValue() !== text) this.editor.setValue(text);
        return;
      }
      this.editorPath = path;
      const editor = new MonacoEditor();
      this.editor = editor;
      void loadMonaco().then(
        () => editor.mount(host, {
          value: text,
          language: "plaintext",
          readOnly: false,
          wordWrap: true
        })
      ).catch(() => {
        host.innerHTML = `<pre class="cl-git-fp-body">${escapeHtml4(text)}</pre><p class="cl-git-fp-ft">The editor could not load - use the buttons above.</p>`;
        this.editor = null;
      });
    }
    /** The marked-up text as it stands, for the shortcut buttons. */
    currentConflictText(path) {
      if (this.editor) return this.editor.getValue();
      return this.state?.worktree.get(path)?.text ?? null;
    }
    flatBody(text) {
      const lines2 = text === "" ? [] : text.split("\n");
      if (lines2.length === 0) {
        return `<pre class="cl-git-fp-body is-empty">(empty file)</pre>`;
      }
      return `<pre class="cl-git-fp-body">` + lines2.map((l, i) => `<span class="cl-git-fp-ln">${i + 1}</span>${escapeHtml4(l)}`).join("\n") + `</pre>`;
    }
    diffBody(p) {
      const cls = { " ": "", "-": " is-del", "+": " is-add" };
      return `<pre class="cl-git-fp-body is-diff">` + p.diff.map(
        (l) => `<span class="cl-git-fp-line${cls[l.kind]}"><span class="cl-git-fp-mark">${l.kind === " " ? "&nbsp;" : l.kind}</span>${escapeHtml4(l.text)}</span>`
      ).join("\n") + `</pre>`;
    }
  };

  // src/dom/git-graph-view.ts
  var SVG_NS3 = "http://www.w3.org/2000/svg";
  var COL_GAP = 128;
  var ROW_GAP = 112;
  var PAD_X = 64;
  var PAD_TOP = 76;
  var LABEL_BELOW = 54;
  var NODE_R = 10;
  var LANE_FALLBACK = ["#6366f1", "#14b8a6", "#f97316", "#a855f7", "#0ea5e9", "#e11d48"];
  function laneVar(lane) {
    const n = LANE_FALLBACK.length;
    const i = (lane % n + n) % n;
    return `var(--clg-lane-${i}, ${LANE_FALLBACK[i]})`;
  }
  function laneChipVar(lane) {
    return `color-mix(in srgb, ${laneVar(lane)} 70%, #000)`;
  }
  function headCommit3(state) {
    if (state.head.kind === "detached") return state.head.commit;
    return state.refs.get(state.head.name) ?? null;
  }
  var GitGraph = class {
    constructor() {
      this.state = null;
      this.handlers = [];
      this.editHandlers = [];
      // The ghost overlay for the current state (see the header note).
      this.ghost = /* @__PURE__ */ new Set();
      this.diverged = /* @__PURE__ */ new Set();
      // Diff bookkeeping across renders, so only NEW nodes/edges animate.
      this.prevNodeIds = /* @__PURE__ */ new Set();
      this.prevEdgeKeys = /* @__PURE__ */ new Set();
      this.prevGhostIds = /* @__PURE__ */ new Set();
      this.prevZoneOf = /* @__PURE__ */ new Map();
      // --- event delegation --------------------------------------------------
      this.onClick = (ev) => {
        const target = ev.target;
        if (!target || typeof target.closest !== "function") return;
        const refEl = target.closest("[data-ref]");
        if (refEl) {
          this.emit({ ref: refEl.dataset.ref });
          return;
        }
        const commitEl = target.closest("[data-commit]");
        if (!commitEl) return;
        const commit2 = commitEl.dataset?.commit;
        this.emit(commit2 !== void 0 && this.ghost.has(commit2) ? { commit: commit2, ghost: true } : { commit: commit2 });
      };
    }
    // --- lifecycle ---------------------------------------------------------
    mount(host, opts) {
      this.root = document.createElement("div");
      this.root.className = "cl-git";
      this.graphWrap = document.createElement("div");
      this.graphWrap.className = "cl-git-graph";
      this.svg = document.createElementNS(SVG_NS3, "svg");
      this.svg.setAttribute("class", "cl-git-svg");
      this.chipLayer = document.createElement("div");
      this.chipLayer.className = "cl-git-chips";
      this.headEl = document.createElement("button");
      this.headEl.setAttribute("type", "button");
      this.headEl.className = "cl-git-chip is-head";
      this.headEl.textContent = "HEAD";
      this.headEl.dataset.ref = "HEAD";
      this.headEl.hidden = true;
      this.graphWrap.append(this.svg, this.chipLayer, this.headEl);
      this.graphViewport = document.createElement("div");
      this.graphViewport.className = "cl-git-viewport";
      this.graphViewport.append(this.graphWrap);
      this.filePanel = new GitFilePanel();
      this.root.append(this.graphViewport, this.buildWorkArea(), this.filePanel.el);
      this.root.addEventListener("click", this.onClick);
      host.appendChild(this.root);
      this.state = opts.state;
      this.setOverlay(opts);
      this.render(false);
    }
    setState(state, opts) {
      this.state = state;
      this.setOverlay(opts);
      this.render(opts?.animate ?? false);
    }
    /** Replace the overlay wholesale. Omitting a list means "none": the overlay
     *  belongs to the state snapshot, so a caller that stops passing ghosts gets a
     *  fully solid graph rather than stale fading. A commit named in both lists is
     *  treated as diverged - the learner has it, so it is not missing. */
    setOverlay(opts) {
      this.diverged = new Set(opts?.diverged ?? []);
      this.ghost = new Set((opts?.ghost ?? []).filter((id) => !this.diverged.has(id)));
    }
    on(event, handler) {
      if (event === "fileEdit") {
        this.editHandlers.push(handler);
        this.filePanel.onEdit((path, text) => {
          for (const h of this.editHandlers) h(path, text);
        });
        return;
      }
      if (event === "inspect") this.handlers.push(handler);
    }
    destroy() {
      this.root.removeEventListener("click", this.onClick);
      this.handlers.length = 0;
      this.root.remove();
    }
    emit(p) {
      for (const h of this.handlers) h(p);
    }
    // --- render ------------------------------------------------------------
    render(animate) {
      const state = this.state;
      if (!state) return;
      const g = layout(state);
      const laneOf = /* @__PURE__ */ new Map();
      const posOf = /* @__PURE__ */ new Map();
      for (const node of g.nodes) {
        laneOf.set(node.id, node.y);
        posOf.set(node.id, this.px(node));
      }
      const width = PAD_X * 2 + Math.max(0, g.width - 1) * COL_GAP;
      const height = PAD_TOP + Math.max(0, g.height - 1) * ROW_GAP + LABEL_BELOW;
      this.svg.setAttribute("width", String(width));
      this.svg.setAttribute("height", String(height));
      this.svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      this.graphWrap.style.width = `${width}px`;
      this.graphWrap.style.height = `${height}px`;
      const newNodeIds = /* @__PURE__ */ new Set();
      const newEdgeKeys = /* @__PURE__ */ new Set();
      this.svg.replaceChildren();
      this.drawEdges(g.edges, posOf, laneOf, animate, newEdgeKeys);
      this.drawNodes(g.nodes, state, animate, newNodeIds);
      this.drawChips(g.chips.filter((c) => c.kind !== "head"), posOf, laneOf);
      this.placeHead(g.chips.find((c) => c.kind === "head"), posOf, animate);
      this.renderZones(state, animate);
      this.filePanel.sync(state);
      this.prevNodeIds = newNodeIds;
      this.prevEdgeKeys = newEdgeKeys;
      this.prevGhostIds = new Set(this.ghost);
    }
    px(node) {
      return { x: PAD_X + node.x * COL_GAP, y: PAD_TOP + node.y * ROW_GAP };
    }
    drawEdges(edges, posOf, laneOf, animate, newEdgeKeys) {
      for (const edge of edges) {
        const child = posOf.get(edge.from);
        const parent = posOf.get(edge.to);
        if (!child || !parent) continue;
        const key = `${edge.from}>${edge.to}`;
        newEdgeKeys.add(key);
        const branchLane = Math.max(laneOf.get(edge.from) ?? 0, laneOf.get(edge.to) ?? 0);
        let d;
        if (child.y === parent.y) {
          d = `M${parent.x},${parent.y} L${child.x},${child.y}`;
        } else {
          const midX = (parent.x + child.x) / 2;
          d = `M${parent.x},${parent.y} C${midX},${parent.y} ${midX},${child.y} ${child.x},${child.y}`;
        }
        const isNew = animate && !this.prevEdgeKeys.has(key);
        const ghosted = this.ghost.has(edge.from);
        const classes = ["cl-git-edge"];
        if (isNew && !ghosted) classes.push("cl-git-edge-draw");
        if (ghosted) classes.push("cl-git-edge-ghost");
        const path = svgEl("path", {
          d,
          class: classes.join(" "),
          stroke: laneVar(branchLane),
          fill: "none",
          pathLength: 1
        });
        this.svg.appendChild(path);
      }
    }
    drawNodes(nodes, state, animate, newNodeIds) {
      for (const node of nodes) {
        newNodeIds.add(node.id);
        const { x, y } = this.px(node);
        const ghosted = this.ghost.has(node.id);
        const isNew = animate && !ghosted && (!this.prevNodeIds.has(node.id) || this.prevGhostIds.has(node.id));
        const classes = ["cl-git-node"];
        if (isNew) classes.push("cl-git-appear");
        if (ghosted) classes.push("cl-git-ghost");
        else if (this.diverged.has(node.id)) classes.push("cl-git-diverged");
        const group = svgEl("g", {
          class: classes.join(" "),
          "data-commit": node.id
        });
        group.appendChild(
          svgEl("circle", {
            cx: x,
            cy: y,
            r: NODE_R,
            class: "cl-git-dot",
            fill: "var(--clg-node, #fff)",
            stroke: laneVar(node.y),
            "stroke-width": 3
          })
        );
        const hash = svgEl("text", { x, y: y + 26, class: "cl-git-hash", "text-anchor": "middle" });
        hash.textContent = node.id;
        group.appendChild(hash);
        const commit2 = state.commits.get(node.id);
        const msg = svgEl("text", { x, y: y + 41, class: "cl-git-msg", "text-anchor": "middle" });
        msg.textContent = commit2?.message ?? "";
        group.appendChild(msg);
        this.svg.appendChild(group);
      }
    }
    drawChips(chips, posOf, laneOf) {
      this.chipLayer.replaceChildren();
      const byCommit = /* @__PURE__ */ new Map();
      for (const chip of chips) {
        const bucket = byCommit.get(chip.commit) ?? [];
        bucket.push(chip);
        byCommit.set(chip.commit, bucket);
      }
      for (const [commit2, bucket] of byCommit) {
        const pos = posOf.get(commit2);
        if (!pos) continue;
        const stack = document.createElement("div");
        stack.className = "cl-git-chipstack";
        stack.style.left = `${pos.x}px`;
        stack.style.top = `${pos.y - 30}px`;
        for (const chip of bucket) {
          const pill = document.createElement("button");
          pill.type = "button";
          pill.className = `cl-git-chip is-${chip.kind}`;
          if (this.ghost.has(commit2)) pill.classList.add("cl-git-ghost");
          pill.textContent = chip.label;
          if (chip.kind === "branch") {
            pill.style.background = laneChipVar(laneOf.get(commit2) ?? 0);
            pill.dataset.ref = `refs/heads/${chip.label}`;
          } else {
            pill.dataset.ref = `refs/tags/${chip.label}`;
          }
          stack.appendChild(pill);
        }
        this.chipLayer.appendChild(stack);
      }
    }
    placeHead(head, posOf, animate) {
      if (!head) {
        this.headEl.hidden = true;
        return;
      }
      const pos = posOf.get(head.commit);
      if (!pos) {
        this.headEl.hidden = true;
        return;
      }
      if (!animate) {
        this.headEl.style.transition = "none";
      }
      this.headEl.hidden = false;
      this.headEl.dataset.ref = "HEAD";
      this.headEl.dataset.on = head.on ?? "";
      this.headEl.textContent = head.on ? `HEAD \u2192 ${head.on}` : "HEAD detached";
      this.headEl.title = head.on ? `HEAD -> ${head.on}` : "HEAD (detached)";
      this.headEl.classList.toggle("is-detached", head.on === void 0);
      this.headEl.classList.toggle("cl-git-ghost", this.ghost.has(head.commit));
      this.headEl.style.left = `${pos.x}px`;
      this.headEl.style.top = `${pos.y - 54}px`;
      if (!animate) {
        void this.headEl.offsetWidth;
        this.headEl.style.transition = "";
      }
    }
    // --- working area ------------------------------------------------------
    buildWorkArea() {
      const work = document.createElement("div");
      work.className = "cl-git-work";
      const tree = this.zone("tree", "Working tree");
      const staging = this.zone("index", "Staging");
      const repo = this.zone("repo", "Repository");
      work.append(
        tree.wrap,
        this.arrow("git add"),
        staging.wrap,
        this.arrow("git commit"),
        repo.wrap
      );
      this.zoneBodies = { tree: tree.body, index: staging.body, repo: repo.body };
      return work;
    }
    zone(kind, title) {
      const wrap = document.createElement("div");
      wrap.className = `cl-git-zone is-${kind}`;
      const head = document.createElement("h3");
      head.textContent = title;
      const body = document.createElement("div");
      body.className = "cl-git-zone-body";
      wrap.append(head, body);
      return { wrap, body };
    }
    arrow(label) {
      const arrow = document.createElement("div");
      arrow.className = "cl-git-arrow";
      const kbd = document.createElement("span");
      kbd.className = "cl-git-kbd";
      kbd.textContent = label;
      arrow.append(kbd, document.createTextNode("\u2192"));
      return arrow;
    }
    renderZones(state, animate) {
      const tree = [...state.worktree.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([path, entry]) => ({ path, status: entry.status }));
      const staged = [...state.index.keys()].sort();
      const committed = this.reachablePaths(state);
      for (const f of tree) committed.delete(f.path);
      for (const p of staged) committed.delete(p);
      const repo = [...committed].sort();
      const nextZoneOf = /* @__PURE__ */ new Map();
      this.fillZone("tree", tree, nextZoneOf, animate);
      this.fillZone("index", staged.map((path) => ({ path })), nextZoneOf, animate);
      this.fillZone("repo", repo.map((path) => ({ path })), nextZoneOf, animate);
      this.prevZoneOf = nextZoneOf;
    }
    fillZone(zone, files, nextZoneOf, animate) {
      const body = this.zoneBodies[zone];
      body.replaceChildren();
      for (const { path, status } of files) {
        nextZoneOf.set(path, zone);
        const moved = animate && this.prevZoneOf.get(path) !== zone;
        const row = document.createElement("div");
        row.className = "cl-git-file";
        if (status) row.classList.add(`is-${status}`);
        if (moved) row.classList.add("is-moved");
        const dot = document.createElement("span");
        dot.className = "cl-git-fdot";
        const name = document.createElement("span");
        name.className = "cl-git-fname";
        name.textContent = path;
        row.append(dot, name);
        body.appendChild(row);
      }
    }
    /** Union of `paths` over every commit reachable from HEAD (empty when unborn). */
    reachablePaths(state) {
      const start = headCommit3(state);
      const paths = /* @__PURE__ */ new Set();
      if (start === null) return paths;
      const seen = /* @__PURE__ */ new Set();
      const stack = [start];
      while (stack.length) {
        const id = stack.pop();
        if (seen.has(id)) continue;
        seen.add(id);
        const commit2 = state.commits.get(id);
        if (!commit2) continue;
        for (const p of commit2.paths) paths.add(p);
        for (const parent of commit2.parents) stack.push(parent);
      }
      return paths;
    }
  };

  // src/core/repo-scene.ts
  function resolveRepo(scene) {
    if (!scene || !Array.isArray(scene.commands)) return null;
    const commands = scene.commands.slice();
    const want = scene.ran === void 0 ? 1 : Math.max(0, Math.min(scene.ran, commands.length));
    return {
      files: Array.isArray(scene.files) ? scene.files.slice() : [],
      commands,
      note: scene.note,
      ran: want === 0 ? [] : commands.slice(commands.length - want)
    };
  }

  // src/terminal/shell.ts
  var BUILTINS = [
    { name: "clear", summary: "Clear the terminal screen." },
    { name: "help", summary: "List the commands, or explain one: help <name>." }
  ];
  var SUGGEST_MAX_DISTANCE = 2;
  function tokenize(line) {
    return tokenizeLine(line).tokens;
  }
  function tokenizeLine(line) {
    const tokens = [];
    let cur = "";
    let quoted = false;
    let inDouble = false;
    let inSingle = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inDouble) {
        if (ch === '"') inDouble = false;
        else cur += ch;
      } else if (inSingle) {
        if (ch === "'") inSingle = false;
        else cur += ch;
      } else if (ch === '"') {
        inDouble = true;
        quoted = true;
      } else if (ch === "'") {
        inSingle = true;
        quoted = true;
      } else if (ch === " " || ch === "	") {
        if (cur !== "" || quoted) {
          tokens.push(cur);
          cur = "";
          quoted = false;
        }
      } else {
        cur += ch;
      }
    }
    if (cur !== "" || quoted) tokens.push(cur);
    if (inDouble || inSingle) {
      const mark = inDouble ? '"' : "'";
      return {
        tokens,
        error: `unexpected EOF while looking for matching ${mark}
(the ${mark} you opened is never closed)`
      };
    }
    return { tokens };
  }
  function editDistance(a, b) {
    if (a === b) return 0;
    if (a === "") return b.length;
    if (b === "") return a.length;
    let prev2 = Array.from({ length: b.length + 1 }, (_, i) => i);
    let row = new Array(b.length + 1);
    for (let i = 1; i <= a.length; i++) {
      row[0] = i;
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        row[j] = Math.min(row[j - 1] + 1, (prev2[j] ?? 0) + 1, (prev2[j - 1] ?? 0) + cost);
      }
      const swap = prev2;
      prev2 = row;
      row = swap;
    }
    return prev2[b.length] ?? 0;
  }
  var Shell = class {
    constructor() {
      this.registry = /* @__PURE__ */ new Map();
    }
    /** Add a command set. Registering a name twice replaces the first. The
     *  built-ins (`help`, `clear`) always win at dispatch time. */
    register(cmd) {
      this.registry.set(cmd.name, cmd);
      return this;
    }
    /** The registered commands, sorted by name. Built-ins are not in here - they
     *  belong to the shell, not to a command set. */
    commands() {
      return [...this.registry.values()].sort((a, b) => a.name.localeCompare(b.name));
    }
    /** Run one typed line. Never throws. */
    run(line, state) {
      const { tokens: argv, error: syntax } = tokenizeLine(line);
      if (syntax) return { state, output: syntax, error: true };
      const name = argv[0];
      if (name === void 0) return { state, output: "" };
      const rest = argv.slice(1);
      if (name === "clear") return { state, output: "", effect: { kind: "clear" } };
      if (name === "help") return { state, output: this.helpText(rest), error: this.helpMissing(rest) };
      const cmd = this.registry.get(name);
      if (!cmd) return { state, output: this.notFound(name), error: true };
      try {
        return cmd.run(rest, state);
      } catch (err) {
        return { state, output: err instanceof Error ? err.message : String(err), error: true };
      }
    }
    // --- built-ins ---------------------------------------------------------
    /** Every name the shell answers to, with its one-line summary, sorted. A
     *  built-in's summary wins over a registered command of the same name,
     *  because the built-in is what actually runs. */
    catalogue() {
      const byName = /* @__PURE__ */ new Map();
      for (const cmd of this.registry.values()) byName.set(cmd.name, cmd.summary);
      for (const b of BUILTINS) byName.set(b.name, b.summary);
      return [...byName.entries()].map(([name, summary]) => ({ name, summary })).sort((a, b) => a.name.localeCompare(b.name));
    }
    helpText(argv) {
      const wanted = argv[0];
      if (wanted === void 0) {
        const all = this.catalogue();
        const width = all.reduce((w, c) => Math.max(w, c.name.length), 0);
        return all.map((c) => `${c.name.padEnd(width)}  ${c.summary}`).join("\n");
      }
      const builtin = BUILTINS.find((b) => b.name === wanted);
      if (builtin) return builtin.summary;
      const cmd = this.registry.get(wanted);
      if (!cmd) return `help: no such command: ${wanted}`;
      return cmd.help ? cmd.help(argv.slice(1)) : cmd.summary;
    }
    helpMissing(argv) {
      const wanted = argv[0];
      if (wanted === void 0) return void 0;
      if (BUILTINS.some((b) => b.name === wanted)) return void 0;
      return this.registry.has(wanted) ? void 0 : true;
    }
    notFound(name) {
      const near = this.suggest(name);
      return `${name}: command not found` + (near ? `  Did you mean '${near}'?` : "");
    }
    /** The closest known name within `SUGGEST_MAX_DISTANCE` edits, ties broken
     *  alphabetically so the message is stable. */
    suggest(name) {
      let best = null;
      let bestDistance = SUGGEST_MAX_DISTANCE + 1;
      for (const { name: candidate } of this.catalogue()) {
        const d = editDistance(name, candidate);
        if (d < bestDistance) {
          best = candidate;
          bestDistance = d;
        }
      }
      return bestDistance <= SUGGEST_MAX_DISTANCE ? best : null;
    }
  };

  // src/terminal/commands/git.ts
  var SUBCOMMANDS = [
    {
      name: "init",
      summary: "Start a new, empty repository.",
      usage: ["init"]
    },
    {
      name: "status",
      summary: "Show what is staged, changed, and untracked.",
      usage: ["status"]
    },
    {
      name: "rebase",
      summary: "Make this branch's commits again, on top of another branch.",
      usage: ["rebase <branch>"]
    },
    {
      name: "reflog",
      summary: "List where HEAD has been, newest first.",
      usage: ["reflog"]
    },
    {
      name: "diff",
      summary: "Show what changed, line by line.",
      usage: ["diff", "diff --staged", "diff <commit>"]
    },
    {
      name: "add",
      summary: "Stage a path for the next commit, or mark a conflict resolved.",
      usage: ["add <path>...", "add ."]
    },
    {
      name: "commit",
      summary: "Record the staged changes as a new commit.",
      usage: ["commit -m <message>", "commit --amend [-m <message>]"]
    },
    {
      name: "log",
      summary: "Show the history behind HEAD, newest first.",
      usage: ["log [--oneline]"]
    },
    {
      name: "branch",
      summary: "List the branches, or create one.",
      usage: ["branch", "branch <name> [<start-point>]"]
    },
    {
      name: "switch",
      summary: "Move HEAD to another branch.",
      usage: ["switch <branch>", "switch -c <new-branch>"]
    },
    {
      name: "checkout",
      summary: "Move HEAD to a branch, or straight to a commit (detached HEAD).",
      usage: ["checkout <branch>", "checkout <commit>", "checkout -b <new-branch>"]
    },
    {
      name: "merge",
      summary: "Join another branch into the current one.",
      usage: ["merge <branch>", "merge --abort"]
    },
    {
      name: "reset",
      summary: "Move the current branch to another commit.",
      usage: ["reset [--soft | --mixed | --hard] [<commit>]"]
    },
    {
      name: "tag",
      summary: "List the tags, or put a name on a commit.",
      usage: ["tag", "tag <name> [<commit>]"]
    },
    {
      name: "rev-parse",
      summary: "Print the commit a revision resolves to.",
      usage: ["rev-parse <revision>"]
    },
    {
      name: "rev-list",
      summary: "List the commits in a range.",
      usage: ["rev-list <revision>", "rev-list <a>..<b>", "rev-list <a>...<b>", "rev-list --all"]
    },
    {
      name: "help",
      summary: "List these commands, or explain one.",
      usage: ["help [<command>]"]
    }
  ];
  var DOC_BY_NAME = new Map(SUBCOMMANDS.map((d) => [d.name, d]));
  var SUGGEST_MAX_DISTANCE2 = 2;
  function helpList() {
    const width = SUBCOMMANDS.reduce((w, d) => Math.max(w, d.name.length), 0);
    return [
      "usage: git <command> [<args>]",
      "",
      "These are the git commands this course supports:",
      "",
      ...SUBCOMMANDS.map((d) => `   ${d.name.padEnd(width)}   ${d.summary}`),
      "",
      "Run 'git help <command>' to see one command's usage."
    ].join("\n");
  }
  function helpFor(doc) {
    const lines2 = doc.usage.map((u, i) => `${i === 0 ? "usage:" : "   or:"} git ${u}`);
    return lines2.join("\n") + "\n\n" + doc.summary;
  }
  function suggest(name) {
    let best = null;
    let bestDistance = SUGGEST_MAX_DISTANCE2 + 1;
    for (const { name: candidate } of SUBCOMMANDS) {
      const d = editDistance(name, candidate);
      if (d < bestDistance) {
        best = candidate;
        bestDistance = d;
      }
    }
    return bestDistance <= SUGGEST_MAX_DISTANCE2 ? best : null;
  }
  function unknownText(sub) {
    const near = suggest(sub);
    const head = `git: '${sub}' is not a git command. See 'git help'.`;
    return near ? `${head}

The most similar command is
	${near}` : head;
  }
  function currentBranch(s) {
    return s.head.kind === "branch" ? s.head.name.replace("refs/heads/", "") : null;
  }
  function commitLine(s, id) {
    const c = s.commits.get(id);
    const label = currentBranch(s) ?? "detached HEAD";
    const root = c.parents.length === 0 ? " (root-commit)" : "";
    return `[${label}${root} ${id}] ${c.message}`;
  }
  function decorate(s, id) {
    const parts = [];
    if (s.head.kind === "branch" && s.refs.get(s.head.name) === id) {
      parts.push(`HEAD -> ${s.head.name.replace("refs/heads/", "")}`);
    } else if (s.head.kind === "detached" && s.head.commit === id) {
      parts.push("HEAD");
    }
    const branches = [];
    const tags = [];
    for (const [ref, h] of s.refs) {
      if (h !== id) continue;
      if (ref.startsWith("refs/heads/")) {
        const name = ref.replace("refs/heads/", "");
        if (!(s.head.kind === "branch" && s.head.name === ref)) branches.push(name);
      } else if (ref.startsWith("refs/tags/")) {
        tags.push("tag: " + ref.replace("refs/tags/", ""));
      }
    }
    parts.push(...branches.sort(), ...tags.sort());
    return parts.length ? ` (${parts.join(", ")})` : "";
  }
  function worktreeOf(s) {
    return new Map([...s.worktree].map(([p, e]) => [p, e.status]));
  }
  function knownPaths(s) {
    const all = /* @__PURE__ */ new Set();
    for (const p of s.worktree.keys()) all.add(p);
    for (const p of s.index.keys()) all.add(p);
    for (const c of s.commits.values()) if (c.blobs) for (const p of c.blobs.keys()) all.add(p);
    return all;
  }
  function parseDiffArgs(s, argv) {
    const out = { staged: false, revs: [], paths: [] };
    const known = knownPaths(s);
    let sawSeparator = false;
    for (const a of argv) {
      if (sawSeparator) {
        out.paths.push(a);
        continue;
      }
      if (a === "--") {
        sawSeparator = true;
        continue;
      }
      if (a === "--staged" || a === "--cached") {
        out.staged = true;
        continue;
      }
      if (a.startsWith("-")) return `error: unknown option \`${a}\``;
      if (known.has(a)) {
        out.paths.push(a);
        continue;
      }
      try {
        revParse(s, a);
        out.revs.push(a);
      } catch {
        return `fatal: ambiguous argument '${a}': unknown revision or path not in the working tree.`;
      }
    }
    if (out.revs.length > 2) return "fatal: too many revisions given";
    return out;
  }
  function diffText(s, a) {
    const head = headCommit2(s);
    const wanted = (path) => a.paths.length === 0 || a.paths.includes(path);
    const chunks = [];
    const sorted = (m) => [...m].sort((x, y) => x[0].localeCompare(y[0]));
    if (a.revs.length === 2) {
      const from = treeAt(s, revParse(s, a.revs[0]));
      const to = treeAt(s, revParse(s, a.revs[1]));
      for (const path of [.../* @__PURE__ */ new Set([...from.keys(), ...to.keys()])].sort()) {
        if (!wanted(path)) continue;
        const d = formatFileDiff(path, from.get(path) ?? "", to.get(path) ?? "");
        if (d) chunks.push(d);
      }
      return chunks.join("\n");
    }
    if (a.staged) {
      for (const [path, text] of sorted(s.index)) {
        if (!wanted(path)) continue;
        const d = formatFileDiff(path, fileAt(s, head, path) ?? "", text);
        if (d) chunks.push(d);
      }
      return chunks.join("\n");
    }
    const rev = a.revs[0];
    const against = rev ? revParse(s, rev) : head;
    for (const [path, entry] of sorted(s.worktree)) {
      if (!wanted(path)) continue;
      if (!rev && entry.status === "untracked") continue;
      const before = !rev && s.index.has(path) ? s.index.get(path) : fileAt(s, against, path) ?? "";
      const d = formatFileDiff(path, before, entry.text);
      if (d) chunks.push(d);
    }
    return chunks.join("\n");
  }
  function headLabel(s) {
    return s.head.kind === "branch" ? s.head.name : "HEAD";
  }
  function reflogText(s) {
    const entries = s.reflog || [];
    if (entries.length === 0) return "fatal: your current branch does not have any commits yet";
    return entries.slice().reverse().map((e, i) => `${e.commit} HEAD@{${i}}: ${e.label}`).join("\n");
  }
  function statusText(s) {
    const blocks = [];
    const header = [];
    if (s.head.kind === "branch") {
      header.push(`On branch ${s.head.name.replace("refs/heads/", "")}`);
      if (headCommit2(s) === null) header.push("No commits yet");
    } else {
      header.push(`HEAD detached at ${s.head.commit}`);
    }
    blocks.push(header);
    if (s.merge && s.merge.conflicted.length > 0) {
      const block = [
        "You have unmerged paths.",
        '  (fix conflicts and run "git commit")',
        "Unmerged paths:",
        '  (use "git add <file>..." to mark resolution)'
      ];
      for (const p of [...s.merge.conflicted].sort()) block.push(`	both modified:   ${p}`);
      blocks.push(block);
    }
    const staged = [...s.index.keys()].sort();
    if (staged.length > 0) {
      const block = [
        "Changes to be committed:",
        '  (use "git reset <file>..." to unstage)'
      ];
      for (const p of staged) block.push(`	modified:   ${p}`);
      blocks.push(block);
    }
    const modified = [];
    const untracked = [];
    for (const [path, kind] of worktreeOf(s)) {
      if (kind === "untracked") untracked.push(path);
      else modified.push(path);
    }
    modified.sort();
    untracked.sort();
    if (modified.length > 0) {
      const block = [
        "Changes not staged for commit:",
        '  (use "git add <file>..." to update what will be committed)'
      ];
      for (const p of modified) block.push(`	modified:   ${p}`);
      blocks.push(block);
    }
    if (untracked.length > 0) {
      const block = [
        "Untracked files:",
        '  (use "git add <file>..." to include in what will be committed)'
      ];
      for (const p of untracked) block.push(`	${p}`);
      blocks.push(block);
    }
    if (!s.merge && staged.length === 0 && modified.length === 0) {
      blocks.push([
        untracked.length > 0 ? 'nothing added to commit but untracked files present (use "git add" to track)' : "nothing to commit, working tree clean"
      ]);
    }
    return blocks.map((b) => b.join("\n")).join("\n\n");
  }
  function logText(s, oneline) {
    const ids = revList(s, "HEAD");
    if (oneline) {
      return ids.map((id) => `${id}${decorate(s, id)} ${s.commits.get(id).message}`).join("\n");
    }
    return ids.map((id) => {
      const c = s.commits.get(id);
      return `commit ${id}${decorate(s, id)}

    ${c.message}`;
    }).join("\n\n");
  }
  function ok(state, output, effect) {
    return { state, output, effect };
  }
  function fail(state, output, message = output) {
    return { state, output, effect: { kind: "none" }, error: message };
  }
  function wantsHelp(args) {
    return args.includes("--help") || args.includes("-h");
  }
  function runGit(argv, state) {
    const tokens = argv[0] === "git" ? argv.slice(1) : argv;
    if (tokens.length === 0) return ok(state, helpList(), { kind: "none" });
    const sub = tokens[0];
    const args = tokens.slice(1);
    if (sub === "help" || sub === "--help" || sub === "-h") {
      const wanted = args.find((a) => !a.startsWith("-"));
      if (wanted === void 0) return ok(state, helpList(), { kind: "none" });
      const doc2 = DOC_BY_NAME.get(wanted);
      return doc2 ? ok(state, helpFor(doc2), { kind: "none" }) : fail(state, unknownText(wanted));
    }
    const doc = DOC_BY_NAME.get(sub);
    if (!doc) return fail(state, unknownText(sub));
    if (wantsHelp(args)) return ok(state, helpFor(doc), { kind: "none" });
    try {
      switch (sub) {
        case "init": {
          if (state.commits.size > 0 || state.refs.size > 0) {
            return ok(state, "Reinitialized existing Git repository", { kind: "none" });
          }
          const fresh = init();
          return ok(
            { ...fresh, index: new Map(state.index), worktree: new Map(state.worktree) },
            "Initialized empty Git repository",
            { kind: "none" }
          );
        }
        case "add": {
          if (state.merge) {
            const paths2 = args.includes(".") ? [...state.merge.conflicted] : args;
            if (paths2.length === 0) return fail(state, "Nothing specified, nothing added.");
            const r2 = resolvePaths(state, paths2);
            return ok(r2.state, "", r2.effect);
          }
          if (args.length === 0) return fail(state, "Nothing specified, nothing added.");
          const paths = [];
          for (const a of args) {
            if (a === ".") paths.push(...state.worktree.keys());
            else paths.push(a);
          }
          const r = stage(state, paths);
          return ok(r.state, "", r.effect);
        }
        case "status": {
          return ok(state, statusText(state), { kind: "none" });
        }
        case "reflog": {
          return ok(state, reflogText(state), { kind: "none" });
        }
        case "rebase": {
          const onto = args.find((a) => !a.startsWith("-"));
          if (!onto) return fail(state, "usage: git rebase <branch>");
          const r = rebase(state, onto);
          if (r.effect.kind === "none") return ok(r.state, "Current branch is up to date.", r.effect);
          return ok(r.state, `Successfully rebased and updated ${headLabel(state)}.`, r.effect);
        }
        case "diff": {
          const parsed = parseDiffArgs(state, args);
          if (typeof parsed === "string") return fail(state, parsed);
          return ok(state, diffText(state, parsed), { kind: "none" });
        }
        case "commit": {
          const amendFlag = args.includes("--amend");
          const mi = args.indexOf("-m");
          const message = mi >= 0 ? args[mi + 1] : void 0;
          if (amendFlag) {
            const r2 = amend(state, message);
            return ok(r2.state, commitLine(r2.state, r2.effect.id), r2.effect);
          }
          if (message === void 0 || message === "") {
            return fail(state, "Aborting commit due to empty commit message.");
          }
          const r = commit(state, message);
          const id = r.effect.id;
          return ok(r.state, commitLine(r.state, id), r.effect);
        }
        case "branch": {
          const positional = args.filter((a) => !a.startsWith("-"));
          if (positional.length === 0) {
            const names = [...state.refs.keys()].filter((r2) => r2.startsWith("refs/heads/")).map((r2) => r2.replace("refs/heads/", "")).sort();
            const cur = currentBranch(state);
            const out = names.map((n) => n === cur ? `* ${n}` : `  ${n}`).join("\n");
            return ok(state, out, { kind: "none" });
          }
          const r = branch(state, positional[0], positional[1]);
          return ok(r.state, "", r.effect);
        }
        case "switch":
        case "checkout": {
          const create = args.includes("-c") || args.includes("-b");
          const positional = args.filter((a) => !a.startsWith("-"));
          if (positional.length === 0) {
            return fail(
              state,
              "fatal: missing branch or commit argument",
              "missing branch or commit argument"
            );
          }
          const target = positional[0];
          const r = checkout(state, target, { create });
          let out;
          if (create) {
            out = `Switched to a new branch '${target}'`;
          } else if (r.effect.kind === "checkout" && "commit" in r.effect && r.effect.commit) {
            const c = r.state.commits.get(r.effect.commit);
            out = `HEAD is now at ${r.effect.commit} ${c.message}`;
          } else {
            out = `Switched to branch '${target}'`;
          }
          return ok(r.state, out, r.effect);
        }
        case "merge": {
          if (args.includes("--abort")) {
            const r2 = mergeAbort(state);
            return ok(r2.state, "", r2.effect);
          }
          const rev = args.find((a) => !a.startsWith("-"));
          if (rev === void 0) {
            return fail(
              state,
              "fatal: No commit specified and merge.defaultToUpstream not set.",
              "No commit specified"
            );
          }
          const r = merge(state, rev);
          let out;
          switch (r.effect.kind) {
            case "none":
              out = "Already up to date.";
              break;
            case "ff":
              out = `Updating ${r.effect.from}..${r.effect.to}
Fast-forward`;
              break;
            case "merge":
              out = "Merge made by the 'ort' strategy.";
              break;
            case "conflict":
              out = r.effect.paths.map((p) => `CONFLICT (content): Merge conflict in ${p}`).join("\n") + "\nAutomatic merge failed; fix conflicts and then commit the result.";
              break;
            default:
              out = "";
          }
          return ok(r.state, out, r.effect);
        }
        case "reset": {
          let mode = "mixed";
          if (args.includes("--soft")) mode = "soft";
          else if (args.includes("--hard")) mode = "hard";
          else if (args.includes("--mixed")) mode = "mixed";
          const positional = args.filter((a) => !a.startsWith("-"));
          const looksLikeRev = (name) => {
            try {
              revParse(state, name);
              return true;
            } catch {
              return false;
            }
          };
          if (positional.length > 0 && !positional.some(looksLikeRev)) {
            const r2 = unstage(state, positional);
            return ok(r2.state, "", r2.effect);
          }
          const rev = positional[0] ?? "HEAD";
          const r = reset(state, mode, rev);
          let out = "";
          if (mode === "hard") {
            const to = r.effect.to;
            out = `HEAD is now at ${to} ${r.state.commits.get(to).message}`;
          }
          return ok(r.state, out, r.effect);
        }
        case "tag": {
          const positional = args.filter((a) => !a.startsWith("-"));
          if (positional.length === 0) {
            const names = [...state.refs.keys()].filter((ref) => ref.startsWith("refs/tags/")).map((ref) => ref.replace("refs/tags/", "")).sort();
            return ok(state, names.join("\n"), { kind: "none" });
          }
          const r = tag(state, positional[0], positional[1]);
          return ok(r.state, "", r.effect);
        }
        case "log": {
          const oneline = args.includes("--oneline");
          return ok(state, logText(state, oneline), { kind: "none" });
        }
        case "rev-parse": {
          const rev = args.find((a) => !a.startsWith("-"));
          if (rev === void 0) {
            return fail(state, "fatal: rev-parse: no revision given", "no revision given");
          }
          return ok(state, revParse(state, rev), { kind: "none" });
        }
        case "rev-list": {
          const range = args.find((a) => a === "--all" || !a.startsWith("-"));
          if (range === void 0) {
            return fail(state, "fatal: rev-list: no revision given", "no revision given");
          }
          return ok(state, revList(state, range).join("\n"), { kind: "none" });
        }
        default:
          return fail(state, unknownText(sub));
      }
    } catch (e) {
      if (e instanceof GitError) return fail(state, e.message);
      const msg = e instanceof Error ? e.message : String(e);
      return fail(state, `fatal: ${msg}`, msg);
    }
  }
  function gitSubcommands() {
    return SUBCOMMANDS.map((d) => d.name);
  }
  function createGitCommand() {
    return {
      name: "git",
      summary: "Run a git command against the lesson's repository.",
      run(argv, state) {
        const r = runGit(argv, state);
        return {
          state: r.state,
          output: r.output,
          error: r.error === void 0 ? void 0 : true,
          effect: r.effect
        };
      },
      help(argv) {
        const wanted = argv.find((a) => !a.startsWith("-"));
        if (wanted === void 0) return helpList();
        const doc = DOC_BY_NAME.get(wanted);
        return doc ? helpFor(doc) : unknownText(wanted);
      }
    };
  }

  // src/terminal/commands/echo.ts
  function currentText(state, path) {
    const inTree = state.worktree.get(path);
    if (inTree) return inTree.text;
    if (state.index.has(path)) return state.index.get(path);
    return fileAt(state, headCommit2(state), path);
  }
  function echoCommand() {
    return {
      name: "echo",
      summary: 'Print a line, or write it into a file: echo "text" > notes.md',
      help() {
        return [
          "echo <text>              print it",
          "echo -e <text>           turn \\n into a real line break",
          "echo <text> > <file>     replace the file with it",
          "echo <text> >> <file>    add it as a new line at the end",
          "",
          "Quote text that has spaces in it."
        ].join("\n");
      },
      run(argv, state) {
        const escapes = argv[0] === "-e";
        if (escapes) argv = argv.slice(1);
        const at = argv.findIndex((a) => a === ">" || a === ">>");
        const expand = (t) => escapes ? t.replace(/\\n/g, "\n").replace(/\\t/g, "	").replace(/\\\\/g, "\\") : t;
        if (at < 0) return { state, output: expand(argv.join(" ")) };
        const path = argv[at + 1];
        if (!path) {
          return { state, output: `bash: syntax error near unexpected token 'newline'`, error: true };
        }
        if (argv.length > at + 2) {
          return { state, output: `bash: ${argv[at + 2]}: ambiguous redirect`, error: true };
        }
        const written = expand(argv.slice(0, at).join(" "));
        const append = argv[at] === ">>";
        const before = currentText(state, path);
        const text = append && before !== null && before !== "" ? `${before}
${written}` : written;
        return { state: edit(state, path, text).state, output: "" };
      }
    };
  }

  // src/core/git-cli.ts
  var ECHO = echoCommand();
  function run(line, state) {
    const { tokens, error } = tokenizeLine(line);
    if (error) return { state, output: error, error, effect: { kind: "none" } };
    if (tokens.length === 0) return { state, output: "", effect: { kind: "none" } };
    if (tokens[0] === "echo") {
      const r = ECHO.run(tokens.slice(1), state);
      return {
        state: r.state,
        output: r.output,
        error: r.error ? r.output : void 0,
        effect: { kind: "none" }
      };
    }
    return runGit(tokens, state);
  }

  // src/dom/repo-view.ts
  var RepoView = class {
    constructor() {
      this.graph = new GitGraph();
      this.mounted = false;
      this.el = document.createElement("div");
      this.el.className = "cl-rp";
      this.graphHost = document.createElement("div");
      this.graphHost.className = "cl-rp-graph";
      this.noteEl = document.createElement("p");
      this.noteEl.className = "cl-rp-cap";
      this.ranEl = document.createElement("p");
      this.ranEl.className = "cl-rp-ran";
      this.el.append(this.ranEl, this.graphHost, this.noteEl);
    }
    /** Replay a step's commands into the repository it describes. A command that
     *  errors is an authoring bug, not a learner mistake: it is reported and the
     *  replay continues, so the graph shows the shortfall instead of vanishing. */
    build(files, commands) {
      let state = files.length ? addFiles(init(), files).state : init();
      for (const line of commands) {
        let res;
        try {
          res = run(line, state);
        } catch (err) {
          console.warn(`repo scene: setup command failed - '${line}':`, err);
          continue;
        }
        if (res.error) console.warn(`repo scene: setup command failed - '${line}': ${res.output}`);
        if (res.state) state = res.state;
      }
      return state;
    }
    sync(ctx) {
      const scene = resolveRepo(ctx.model.repo);
      if (!scene) return;
      const state = this.build(scene.files, scene.commands);
      if (!this.mounted) {
        this.graph.mount(this.graphHost, { state });
        this.mounted = true;
      } else {
        this.graph.setState(state, { animate: true });
      }
      this.noteEl.innerHTML = scene.note ? escapeHtml4(scene.note) : "";
      this.noteEl.hidden = !scene.note;
      this.ranEl.innerHTML = scene.ran.map((c) => `<code class="cl-rp-cmd">$ ${escapeHtml4(c)}</code>`).join("");
      this.ranEl.hidden = scene.ran.length === 0;
    }
  };

  // src/core/git-objects.ts
  var MODE_FILE = "100644";
  var MODE_EXEC = "100755";
  var MODE_DIR = "40000";
  var encoder = null;
  function bytesOf(text) {
    if (!encoder) encoder = new TextEncoder();
    return encoder.encode(text);
  }
  function concat(chunks) {
    let total = 0;
    for (const chunk of chunks) total += chunk.length;
    const out = new Uint8Array(total);
    let at = 0;
    for (const chunk of chunks) {
      out.set(chunk, at);
      at += chunk.length;
    }
    return out;
  }
  function hexToBytes(hex) {
    const out = new Uint8Array(hex.length / 2);
    for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.substr(i * 2, 2), 16);
    return out;
  }
  function sha1(bytes) {
    const length = bytes.length;
    const padded = new Uint8Array((length + 8 >> 6) + 1 << 6);
    padded.set(bytes);
    padded[length] = 128;
    const view = new DataView(padded.buffer);
    view.setUint32(padded.length - 4, length << 3 >>> 0, false);
    view.setUint32(padded.length - 8, Math.floor(length / 536870912), false);
    let h0 = 1732584193, h1 = 4023233417, h2 = 2562383102, h3 = 271733878, h4 = 3285377520;
    const w = new Int32Array(80);
    for (let offset = 0; offset < padded.length; offset += 64) {
      for (let i = 0; i < 16; i++) w[i] = view.getInt32(offset + i * 4, false);
      for (let i = 16; i < 80; i++) {
        const mixed = w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16];
        w[i] = mixed << 1 | mixed >>> 31;
      }
      let a = h0, b = h1, c = h2, d = h3, e = h4;
      for (let i = 0; i < 80; i++) {
        let f, k;
        if (i < 20) {
          f = b & c | ~b & d;
          k = 1518500249;
        } else if (i < 40) {
          f = b ^ c ^ d;
          k = 1859775393;
        } else if (i < 60) {
          f = b & c | b & d | c & d;
          k = 2400959708;
        } else {
          f = b ^ c ^ d;
          k = 3395469782;
        }
        const next2 = (a << 5 | a >>> 27) + f + e + k + w[i] | 0;
        e = d;
        d = c;
        c = b << 30 | b >>> 2;
        b = a;
        a = next2;
      }
      h0 = h0 + a | 0;
      h1 = h1 + b | 0;
      h2 = h2 + c | 0;
      h3 = h3 + d | 0;
      h4 = h4 + e | 0;
    }
    return [h0, h1, h2, h3, h4].map((n) => (n >>> 0).toString(16).padStart(8, "0")).join("");
  }
  function objectBytes(type, body) {
    return concat([bytesOf(`${type} ${body.length}\0`), body]);
  }
  function hashObject(type, body) {
    return sha1(objectBytes(type, body));
  }
  function compareBytes(left, right) {
    const shared = Math.min(left.length, right.length);
    for (let i = 0; i < shared; i++) {
      if (left[i] !== right[i]) return left[i] - right[i];
    }
    return left.length - right.length;
  }
  function treeSortKey(entry) {
    return bytesOf(entry.mode === MODE_DIR ? `${entry.name}/` : entry.name);
  }
  function treeBody(entries) {
    const sorted = entries.slice().sort((a, b) => compareBytes(treeSortKey(a), treeSortKey(b)));
    const chunks = [];
    for (const entry of sorted) {
      chunks.push(bytesOf(`${entry.mode} ${entry.name}\0`), hexToBytes(entry.id));
    }
    return concat(chunks);
  }
  function commitBody(commit2) {
    const lines2 = [`tree ${commit2.tree}
`];
    for (const parent of commit2.parents) lines2.push(`parent ${parent}
`);
    lines2.push(`author ${commit2.author}
`);
    lines2.push(`committer ${commit2.committer || commit2.author}
`);
    lines2.push("\n");
    lines2.push(commit2.message.endsWith("\n") ? commit2.message : `${commit2.message}
`);
    return bytesOf(lines2.join(""));
  }
  var ObjectStore = class {
    constructor() {
      this.objects = /* @__PURE__ */ new Map();
      /** Ref name -> object id, e.g. "refs/heads/main". A file holding one id. */
      this.refs = /* @__PURE__ */ new Map();
      /** Path -> blob id. `.git/index`, the list of what you picked. */
      this.index = /* @__PURE__ */ new Map();
      /** Path -> text. Your folder. Not part of git at all. */
      this.worktree = /* @__PURE__ */ new Map();
      this.head = { kind: "ref", ref: "refs/heads/main" };
    }
    put(type, body, decoded) {
      const id = hashObject(type, body);
      if (!this.objects.has(id)) this.objects.set(id, { id, type, body, ...decoded });
      return id;
    }
    writeBlob(text) {
      return this.put("blob", bytesOf(text), { text });
    }
    writeTree(entries) {
      return this.put("tree", treeBody(entries), { entries: entries.slice() });
    }
    writeCommit(commit2) {
      return this.put("commit", commitBody(commit2), { commit: { ...commit2 } });
    }
    headId() {
      if (this.head.kind === "detached") return this.head.id;
      return this.refs.get(this.head.ref) || null;
    }
    /** Every object reachable by following names from the refs and HEAD. What is
     *  outside this set is still on disk, byte for byte, and no name reaches it -
     *  which is the whole difference between undone and gone. */
    reachable() {
      const seen = /* @__PURE__ */ new Set();
      const queue = [...this.refs.values()];
      const head = this.headId();
      if (head) queue.push(head);
      while (queue.length) {
        const id = queue.pop();
        if (!id || seen.has(id)) continue;
        const object = this.objects.get(id);
        if (!object) continue;
        seen.add(id);
        if (object.commit) queue.push(object.commit.tree, ...object.commit.parents);
        else if (object.entries) for (const entry of object.entries) queue.push(entry.id);
      }
      return seen;
    }
  };

  // src/core/objects-scene.ts
  var DEFAULT_AUTHOR = "A Learner <learner@example.com> 1700000000 +0000";
  function resolveObjects(scene) {
    if (!scene || !Array.isArray(scene.acts)) return null;
    const acts = scene.acts.slice();
    const want = scene.fresh === void 0 ? 1 : Math.max(0, Math.min(scene.fresh, acts.length));
    const OPENABLE = ["blob", "tree", "commit"];
    return {
      lens: scene.lens === "chain" || scene.lens === "both" ? scene.lens : "folder",
      acts,
      fresh: want === 0 ? [] : acts.slice(acts.length - want),
      detail: scene.detail === "full" ? "full" : "core",
      open: OPENABLE.includes(scene.open) ? scene.open : void 0,
      openRaw: scene.openRaw === true,
      note: scene.note,
      author: scene.author || DEFAULT_AUTHOR
    };
  }
  function replayObjects(scene) {
    const store = new ObjectStore();
    const added = /* @__PURE__ */ new Set();
    const freshFrom = scene.acts.length - scene.fresh.length;
    const stored = /* @__PURE__ */ new Map();
    const savedByMessage = /* @__PURE__ */ new Map();
    let latestTree = null;
    let latestCommit = null;
    scene.acts.forEach((act, at) => {
      const before = new Set(store.objects.keys());
      switch (act.act) {
        case "write":
          store.worktree.set(act.path, act.text);
          break;
        case "store": {
          const text = store.worktree.get(act.path);
          if (text === void 0) break;
          stored.set(act.path, store.writeBlob(text));
          break;
        }
        case "pick": {
          const id = stored.get(act.path);
          if (id) store.index.set(act.path, id);
          break;
        }
        case "list": {
          if (!stored.size) break;
          latestTree = writeNested(store, stored);
          break;
        }
        case "save": {
          if (!latestTree) break;
          latestCommit = store.writeCommit({
            tree: latestTree,
            parents: latestCommit ? [latestCommit] : [],
            author: scene.author,
            message: act.message
          });
          savedByMessage.set(act.message, latestCommit);
          break;
        }
        case "name": {
          const target = act.at ? savedByMessage.get(act.at) : latestCommit;
          if (target) store.refs.set(act.ref, target);
          break;
        }
        case "switch": {
          store.head = { kind: "ref", ref: act.ref };
          break;
        }
        case "detach": {
          const target = act.at ? savedByMessage.get(act.at) : latestCommit;
          if (target) store.head = { kind: "detached", id: target };
          break;
        }
        case "amend": {
          if (!latestCommit) break;
          const old = store.objects.get(latestCommit);
          if (!old?.commit) break;
          const replacement = store.writeCommit({
            tree: old.commit.tree,
            parents: old.commit.parents,
            author: old.commit.author,
            committer: old.commit.committer,
            message: act.message
          });
          savedByMessage.set(act.message, replacement);
          latestCommit = replacement;
          if (store.head.kind === "ref") {
            const ref = store.head.ref;
            if (store.refs.has(ref)) store.refs.set(ref, replacement);
          }
          break;
        }
        case "reset": {
          const target = savedByMessage.get(act.to);
          if (target) {
            store.refs.set(act.ref, target);
            if (store.head.kind === "ref" && store.head.ref === act.ref) {
              latestCommit = target;
            }
          }
          break;
        }
      }
      if (at >= freshFrom) {
        for (const id of store.objects.keys()) if (!before.has(id)) added.add(id);
      }
    });
    return { store, added };
  }
  function chainRows(replay) {
    const { store, added } = replay;
    const live = store.reachable();
    const rows = [];
    const seen = /* @__PURE__ */ new Set();
    const push = (kind, label, id, depth, body) => {
      if (seen.has(id)) return;
      seen.add(id);
      const object = store.objects.get(id);
      const names = object?.commit ? [
        { role: "tree", id: object.commit.tree },
        ...object.commit.parents.map((p) => ({ role: "parent", id: p }))
      ] : [];
      rows.push({
        kind,
        label,
        id,
        body,
        depth,
        names: names.filter((n) => !body?.includes(short(n.id))),
        fresh: added.has(id),
        unreachable: !live.has(id)
      });
    };
    const head = store.headId();
    if (head) {
      for (const [name, id] of store.refs) {
        rows.push({
          kind: "ref",
          label: name.replace(/^refs\/heads\//, ""),
          id,
          names: [],
          depth: 0,
          fresh: false,
          unreachable: false
        });
      }
    }
    const walkTree = (id, depth) => {
      const node = id ? store.objects.get(id) : void 0;
      if (!node?.entries) return;
      push("tree", "tree", id, depth, treeBodyText(node.entries));
      for (const entry of node.entries) {
        if (store.objects.get(entry.id)?.entries) walkTree(entry.id, depth + 1);
        else push("blob", "blob", entry.id, depth + 1, store.objects.get(entry.id)?.text);
      }
    };
    let walk = head;
    let sawCommit = false;
    let guard = 0;
    while (walk && store.objects.get(walk)?.commit && guard++ < 64) {
      const commit2 = store.objects.get(walk).commit;
      sawCommit = true;
      push("commit", "commit", walk, 0, commit2.message);
      walkTree(commit2.tree, 1);
      walk = commit2.parents[0];
    }
    if (!sawCommit) walkTree(lastTreeOf(store), 0);
    for (const [id, object] of store.objects) {
      if (seen.has(id)) continue;
      push(
        object.type,
        object.type,
        id,
        0,
        object.entries ? treeBodyText(object.entries) : object.text || object.commit?.message
      );
    }
    return rows;
  }
  function writeNested(store, stored) {
    const build = (prefix) => {
      const entries = [];
      const dirs = /* @__PURE__ */ new Set();
      for (const [path, id] of stored) {
        if (!path.startsWith(prefix)) continue;
        const rest = path.slice(prefix.length);
        const slash = rest.indexOf("/");
        if (slash < 0) entries.push({ mode: MODE_FILE, name: rest, id });
        else dirs.add(rest.slice(0, slash));
      }
      for (const dir of dirs) {
        entries.push({ mode: MODE_DIR, name: dir, id: build(`${prefix}${dir}/`) });
      }
      return store.writeTree(entries);
    };
    return build("");
  }
  function treeBodyText(entries) {
    return entries.map((entry) => `${entry.mode.padStart(6, "0")} ${entry.name} -> ${short(entry.id)}`).join("   ");
  }
  function lastTreeOf(store) {
    let found = null;
    for (const [id, object] of store.objects) if (object.entries) found = id;
    return found;
  }
  function short(id) {
    return id.slice(0, 7);
  }
  function openObject(replay, type, raw = false) {
    let found = null;
    for (const object of replay.store.objects.values()) {
      if (object.type === type) found = object;
    }
    if (!found) return null;
    const header = raw && !found.entries ? `${type} ${found.body.length}\\0` : void 0;
    if (found.entries) {
      const kindOf = (id) => replay.store.objects.get(id)?.entries ? "tree" : "blob";
      return {
        id: found.id,
        type,
        text: found.entries.map((e) => `${e.mode.padStart(6, "0")} ${kindOf(e.id)} ${e.id}	${e.name}`).join("\n")
      };
    }
    return {
      id: found.id,
      type,
      header,
      text: new TextDecoder().decode(found.body)
    };
  }

  // src/dom/objects-view.ts
  var ObjectsView = class {
    constructor(labels = DEFAULT_VIZ_LABELS) {
      this.labels = labels;
      this.el = document.createElement("div");
      this.el.className = "cl-ob";
      this.folderEl = document.createElement("pre");
      this.folderEl.className = "cl-ob-folder";
      this.chainEl = document.createElement("div");
      this.chainEl.className = "cl-ob-chain";
      this.openEl = document.createElement("pre");
      this.openEl.className = "cl-ob-open";
      this.noteEl = document.createElement("p");
      this.noteEl.className = "cl-ob-cap";
      this.el.append(this.folderEl, this.chainEl, this.openEl, this.noteEl);
    }
    sync(ctx) {
      const scene = resolveObjects(ctx.model.objects);
      if (!scene) return;
      const replay = replayObjects(scene);
      const wantsFolder = scene.lens === "folder" || scene.lens === "both";
      const wantsChain = scene.lens === "chain" || scene.lens === "both";
      this.folderEl.hidden = !wantsFolder;
      this.chainEl.hidden = !wantsChain;
      if (wantsFolder) this.folderEl.innerHTML = folderHtml(replay, this.labels, scene.detail);
      if (wantsChain) this.chainEl.innerHTML = chainHtml(chainRows(replay), this.labels);
      const opened = scene.open ? openObject(replay, scene.open, scene.openRaw) : null;
      this.openEl.hidden = !opened;
      if (opened) {
        const rawHead = opened.header ? `<span class="cl-ob-rawhead">${escapeHtml4(opened.header)}</span>
` : "";
        this.openEl.innerHTML = `<span class="cl-ob-openhead">${escapeHtml4(opened.type)} ${short(opened.id)}</span>
` + rawHead + escapeHtml4(opened.text);
      }
      this.noteEl.innerHTML = scene.note ? escapeHtml4(scene.note) : "";
      this.noteEl.hidden = !scene.note;
    }
  };
  function folderHtml(replay, labels, detail) {
    const { store, added } = replay;
    const lines2 = [".git/"];
    if (detail === "full") {
      lines2.push(`  ${dim("config")}`, `  ${dim("description")}`, `  ${dim("hooks/")}`, `  ${dim("info/")}`);
    }
    lines2.push("  objects/");
    if (detail === "full") lines2.push(`    ${dim("info/")}`, `    ${dim("pack/")}`);
    if (!store.objects.size) lines2.push(`    ${dim(escapeHtml4(labels.objEmpty))}`);
    for (const [id, object] of store.objects) {
      const body = `${id.slice(0, 2)}/${id.slice(2, 8)}...  <span class="cl-ob-type">${object.type}</span>`;
      lines2.push(`    ${added.has(id) ? `<span class="cl-ob-new">${body}</span>` : body}`);
    }
    lines2.push("  refs/heads/");
    if (!store.refs.size) lines2.push(`    ${dim(escapeHtml4(labels.objNoNames))}`);
    for (const [name, id] of store.refs) {
      lines2.push(`    ${escapeHtml4(name.replace(/^refs\/heads\//, ""))}   ${dim(short(id))}`);
    }
    if (detail === "full") lines2.push(`  ${dim("refs/tags/")}`);
    const headLine = store.head.kind === "ref" ? `ref: ${store.head.ref}` : short(store.head.id);
    lines2.push(`  HEAD    ${dim(escapeHtml4(headLine))}`);
    if (store.index.size) {
      lines2.push("  index");
      for (const [path, id] of store.index) {
        lines2.push(`    ${dim(`${escapeHtml4(path)}  ${short(id)}`)}`);
      }
    }
    if (store.worktree.size) {
      lines2.push("", escapeHtml4(labels.objYourFolder));
      const width = Math.max(...[...store.worktree.keys()].map((p) => p.length));
      for (const [path, text] of store.worktree) {
        const firstLine = text.split("\n")[0];
        const shown = firstLine.length > 30 ? `${firstLine.slice(0, 29)}\u2026` : firstLine;
        const pad = " ".repeat(width - path.length);
        lines2.push(`  ${escapeHtml4(path)}${pad}   ${dim(escapeHtml4(shown))}`);
      }
    }
    return lines2.join("\n");
  }
  function dim(text) {
    return `<span class="cl-ob-dim">${text}</span>`;
  }
  function chainHtml(rows, labels) {
    if (!rows.length) return `<p class="cl-ob-empty">${escapeHtml4(labels.objNothingYet)}</p>`;
    return rows.map((row) => {
      if (row.kind === "ref") {
        return `<span class="cl-ob-ref">${escapeHtml4(row.label)}</span>`;
      }
      const classes = ["cl-ob-row"];
      if (row.fresh) classes.push("cl-ob-fresh");
      if (row.unreachable) classes.push("cl-ob-orphan");
      const kind = row.unreachable ? `${escapeHtml4(row.label)} (${escapeHtml4(labels.objUnnamed)})` : escapeHtml4(row.label);
      const names = row.names.length ? ` ${escapeHtml4(labels.objNames)} ${row.names.map(
        (n) => `<span class="cl-ob-role">${escapeHtml4(n.role)}</span><span class="cl-ob-names">${short(n.id)}</span>`
      ).join(" ")}` : "";
      const indent = row.depth > 0 ? ` style="margin-left:${row.depth * 1.1}rem"` : "";
      return `<div class="${classes.join(" ")}"${indent}><span class="cl-ob-kind">${kind}</span><span class="cl-ob-id">${short(row.id)}</span><span class="cl-ob-body">${escapeHtml4(row.body || "")}${names}</span></div>`;
    }).join("");
  }

  // src/dom/viz-controls.ts
  var DEFAULT_LEGEND = [
    { sw: "#37d3a6", label: "data in RAM" },
    { sw: "#2b6a5b", label: "active CPU core" },
    { sw: "#ffd479", label: "signal on the bus", round: true },
    { sw: "#2563eb", label: "stack frame (a call)" },
    { sw: "#1f6f5f", label: "reference to an object", round: true }
  ];
  var SVG_NS4 = "http://www.w3.org/2000/svg";
  function legendHtml(items) {
    return items.map((i) => {
      const round = i.round ? ";border-radius:50%" : "";
      return `<span><i class="cl-mv-sw" style="background:${i.sw}${round}"></i>${i.label}</span>`;
    }).join("");
  }
  function stepPercent(step, total) {
    return total <= 1 ? 0 : step / (total - 1) * 100;
  }
  function notableLabel(kind) {
    return kind === "new-object" ? "new object" : kind;
  }
  var VizControls = class {
    constructor(actions, handlers, nextHref, legend, nextLabel = DEFAULT_VIZ_LABELS.nextLesson, labels = DEFAULT_VIZ_LABELS) {
      this.nextHref = nextHref;
      this.nextLabel = nextLabel;
      this.labels = labels;
      this.el = document.createElement("div");
      this.el.innerHTML = `
      <div class="cl-mv-controls">
        <button data-c="prev">${labels.prev}</button>
        <button data-c="play" class="cl-mv-primary">${labels.play}</button>
        <button data-c="next" class="cl-mv-primary">${labels.next}</button>
        <button data-c="reset">${labels.reset}</button>
        <span class="cl-mv-spacer"></span>
        <div class="cl-mv-textsize" role="group" aria-label="${labels.textSize}">
          <span class="cl-mv-aa" aria-hidden="true">Aa</span>
          <button data-size="0.9" title="${labels.textSmall}" aria-label="${labels.textSmall}">S</button>
          <button data-size="1" title="${labels.textDefault}" aria-label="${labels.textDefault}">M</button>
          <button data-size="1.2" title="${labels.textLarge}" aria-label="${labels.textLarge}">L</button>
        </div>
      </div>
      <div class="cl-mv-scrubwrap">
        <svg class="cl-mv-depth" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"></svg>
        <input type="range" class="cl-mv-scrub" data-scrub min="0" value="0" step="1" aria-label="${labels.step}" />
        <div class="cl-mv-marks" data-marks></div>
      </div>
      <div class="cl-mv-legend">${legendHtml(legend && legend.length ? legend : DEFAULT_LEGEND)}</div>`;
      const controls = this.el.querySelector(".cl-mv-controls");
      actions.forEach((a, i) => {
        const b = document.createElement("button");
        b.className = "cl-mv-action";
        b.textContent = a.label;
        b.dataset.action = String(i);
        controls.appendChild(b);
      });
      this.el.addEventListener("click", (e) => {
        const btn = e.target.closest("button");
        if (!btn) return;
        if (btn.dataset.size != null) return handlers.onFontSize(Number(btn.dataset.size));
        switch (btn.dataset.c) {
          case "prev":
            return handlers.onPrev();
          case "next":
            return handlers.onNext();
          case "play":
            return handlers.onPlay();
          case "reset":
            return handlers.onReset();
          default:
            if (btn.dataset.action != null) handlers.onAction(Number(btn.dataset.action));
        }
      });
      const scrub = this.el.querySelector("[data-scrub]");
      scrub.addEventListener("input", () => handlers.onSeek(Number(scrub.value)));
    }
    sync(ctx) {
      this.update(ctx);
    }
    setActiveSize(scale) {
      this.el.querySelectorAll(".cl-mv-textsize button").forEach((b) => {
        b.classList.toggle("is-active", Number(b.dataset.size) === scale);
      });
    }
    setDerived(derived, onJump) {
      const depth = this.el.querySelector(".cl-mv-depth");
      const marks = this.el.querySelector("[data-marks]");
      const total = derived.callDepth.length;
      depth.textContent = "";
      marks.textContent = "";
      if (total > 0) {
        const maxDepth = Math.max(1, ...derived.callDepth);
        const points = derived.callDepth.map((d, i) => {
          const x = stepPercent(i, total);
          const y = 90 - Math.max(0, d) / maxDepth * 75;
          return `${x},${y}`;
        }).join(" ");
        const line = document.createElementNS(SVG_NS4, "polyline");
        line.setAttribute("points", points);
        line.setAttribute("fill", "none");
        line.setAttribute("vector-effect", "non-scaling-stroke");
        depth.appendChild(line);
      }
      derived.notables.forEach((notable) => {
        const label = notableLabel(notable.kind);
        const mark = document.createElement("button");
        mark.type = "button";
        mark.className = `cl-mv-mark is-${notable.kind}`;
        mark.style.left = `${stepPercent(notable.step, total)}%`;
        mark.setAttribute("aria-label", `Jump to ${label} at step ${notable.step}`);
        mark.title = `Jump to ${label} at step ${notable.step}`;
        mark.addEventListener("click", () => onJump(notable.step));
        marks.appendChild(mark);
      });
    }
    update(state) {
      this.el.querySelector('[data-c="prev"]').disabled = state.atStart;
      const next2 = this.el.querySelector('[data-c="next"]');
      if (state.atEnd && this.nextHref) {
        next2.disabled = false;
        next2.textContent = this.nextLabel;
      } else {
        next2.disabled = state.atEnd;
        next2.textContent = this.labels.next;
      }
      const scrub = this.el.querySelector("[data-scrub]");
      scrub.max = String(Math.max(0, state.total - 1));
      scrub.value = String(state.index);
    }
    setPlaying(playing) {
      this.el.querySelector('[data-c="play"]').textContent = playing ? this.labels.pause : this.labels.play;
    }
    resetActions() {
      this.el.querySelectorAll("button.cl-mv-action").forEach((b) => b.disabled = false);
    }
    disableAction(index) {
      const btn = this.el.querySelector(`button[data-action="${index}"]`);
      if (btn) btn.disabled = true;
    }
  };

  // src/dom/memory-viz.ts
  var instanceSeq = 0;
  var WORDS_PER_MINUTE = 300;
  var MIN_STEP_MS = 2600;
  var MemoryViz = class _MemoryViz {
    constructor(host, config) {
      this.panels = [];
      this.controls = null;
      this.scale = 1;
      this.panelFactories = {
        board: (_spec, ctx) => new BoardView(ctx.uid),
        die: (spec, ctx) => new MemoryDieView(ctx.uid, ctx.code, ctx.labels, spec.regions ?? ctx.regions, ctx.zoomTab, ctx.regionTags),
        code: (_spec, ctx) => new CodePanel(ctx.code),
        vartable: () => new VarTableView(),
        callstack: () => new CallStackView(),
        heapcards: (_spec, ctx) => new HeapCardsView(ctx.uid, ctx.vizLabels),
        narration: (_spec, ctx) => new NarrationView(ctx.vizLabels),
        console: (_spec, ctx) => new ConsoleView(ctx.vizLabels),
        agent: (spec, ctx) => new AgentView(spec.fan, ctx.vizLabels),
        agentloop: () => new AgentLoopView(),
        memoryshelf: () => new MemoryShelfView(),
        toolrack: (_spec, ctx) => new ToolRackView(ctx.vizLabels),
        transcript: (_spec, ctx) => new TranscriptView(ctx.vizLabels),
        retrieval: () => new RetrievalView(),
        planboard: () => new PlanboardView(),
        repo: () => new RepoView(),
        objects: (_spec, ctx) => new ObjectsView(ctx.vizLabels),
        controls: (_spec, ctx) => this.controls = new VizControls(ctx.actions, ctx.handlers, ctx.nextHref, ctx.legend, ctx.nextLabel, ctx.vizLabels)
      };
      this.onResize = () => {
        this.relayout();
      };
      const uid = instanceSeq++;
      const scene = config.scene ?? {};
      const regions = scene.regions ?? ALL_REGIONS;
      const showBoard = scene.board !== false;
      const zoomTab = scene.zoomTab !== false;
      this.actions = config.actions ?? [];
      this.nextHref = config.nextHref;
      this.nextLabel = config.nextLabel;
      this.onXpChange = config.onXpChange;
      this.onStep = config.onStep;
      this.progress = new ProgressStore(
        config.xpKey ?? "codelab_xp",
        config.awardedKey,
        typeof config.awardAmount === "number" ? config.awardAmount : 20
      );
      this.deriveRefs = config.deriveRefs !== false;
      this.autoDim = config.autoDim !== false;
      this.steps = config.steps ?? [];
      this.player = new VizPlayer(this.steps, {
        deriveRefs: this.deriveRefs,
        autoDim: this.autoDim
      });
      this.autoplay = new Autoplay({
        stepMs: () => this.stepDurationMs(),
        atEnd: () => this.player.state.atEnd,
        advance: () => this.step(this.player.next()),
        onStop: () => this.controls?.setPlaying(false)
      });
      this.scale = config.fontScale ?? 1;
      this.handlers = {
        onPrev: () => this.step(this.player.prev(), false),
        onNext: () => {
          if (this.player.state.atEnd && this.nextHref) {
            window.location.href = this.nextHref;
            return;
          }
          this.step(this.player.next());
        },
        onReset: () => {
          this.stop();
          this.step(this.player.reset(), false);
        },
        onPlay: () => this.autoplay.isPlaying ? this.stop() : this.play(),
        onAction: (i) => this.runAction(i),
        onFontSize: (s) => this.setFont(s),
        onSeek: (i) => {
          this.stop();
          this.step(this.player.goTo(i), false);
        }
      };
      const vizLabels = { ...DEFAULT_VIZ_LABELS, ...config.labels };
      this.buildCtx = {
        uid,
        code: config.code ?? [],
        labels: {
          chipName: config.chipName ?? "LPDDR5 RAM",
          chipAddr: config.chipAddr ?? "address space  0x0000 \u2192 0xFFFF"
        },
        regions,
        zoomTab,
        actions: this.actions,
        handlers: this.handlers,
        regionTags: config.regionTags ?? {},
        legend: config.legend,
        nextHref: this.nextHref,
        nextLabel: this.nextLabel ?? vizLabels.nextLesson,
        vizLabels
      };
      this.layout = config.layout ?? {
        visual: [
          ...showBoard ? [{ type: "board" }] : [],
          { type: "die", regions }
        ],
        aside: [{ type: "narration" }, { type: "controls" }]
      };
      this.root = document.createElement("div");
      this.root.className = "cl-mv";
      this.root.style.setProperty("--mv-fs", String(this.scale));
      if (config.background) this.root.style.setProperty("--mv-bg", config.background);
      this.visualCol = document.createElement("div");
      this.visualCol.className = "cl-mv-visual";
      this.asideCol = document.createElement("div");
      this.asideCol.className = "cl-mv-aside";
      this.root.append(this.visualCol);
      this.buildPanels();
      host.appendChild(this.root);
      this.wireControls();
      window.addEventListener("resize", this.onResize);
      this.refreshXp();
      this.step(this.player.state, false);
    }
    /** Replace the scene without tearing the widget down: rebuild the player and
     *  the panels in place, and (by default) hold the current step index so a
     *  level toggle does not send the learner back to the first step. `code` and
     *  `layout` override the code lines and the panel arrangement when given. */
    setSteps(steps, opts = {}) {
      if (steps.length === 0) throw new Error("MemoryViz.setSteps needs at least one step");
      this.stop();
      const keepIndex = opts.preserveIndex !== false ? this.player.state.index : 0;
      this.steps = steps;
      if (opts.code) this.buildCtx.code = opts.code;
      if (opts.layout) this.layout = opts.layout;
      this.player = new VizPlayer(steps, { deriveRefs: this.deriveRefs, autoDim: this.autoDim });
      this.buildPanels();
      this.wireControls();
      this.step(this.player.goTo(Math.min(keepIndex, steps.length - 1)), false);
    }
    /** (Re)build the visual + aside panels from the current layout into the two
     *  columns. Clears any prior panels first, so it is safe to call repeatedly. */
    buildPanels() {
      this.controls = null;
      this.panels.length = 0;
      this.visualCol.textContent = "";
      this.asideCol.textContent = "";
      (this.layout.visual ?? []).forEach((spec) => {
        const p = this.makePanel(spec, this.buildCtx);
        this.panels.push(p);
        this.visualCol.appendChild(p.el);
      });
      (this.layout.aside ?? []).forEach((spec) => {
        const p = this.makePanel(spec, this.buildCtx);
        this.panels.push(p);
        this.asideCol.appendChild(p.el);
      });
      if (this.asideCol.childElementCount > 0) {
        if (!this.asideCol.parentNode) this.root.append(this.asideCol);
        this.root.classList.remove("cl-mv-single");
      } else {
        if (this.asideCol.parentNode) this.asideCol.remove();
        this.root.classList.add("cl-mv-single");
      }
    }
    /** Feed the freshly built controls panel the font size and the derived-trace
     *  scrubber for the current steps. No-op when the layout has no controls. */
    wireControls() {
      if (!this.controls) return;
      this.controls.setActiveSize(this.scale);
      this.controls.setDerived(deriveTrace(this.steps), this.handlers.onSeek);
    }
    static create(host, config) {
      return new _MemoryViz(host, config);
    }
    destroy() {
      this.stop();
      window.removeEventListener("resize", this.onResize);
      this.root.remove();
    }
    // ---- composition ------------------------------------------------------
    makePanel(spec, ctx) {
      const build = this.panelFactories[spec.type];
      if (!build) throw new Error("MemoryViz: unknown panel type " + String(spec.type));
      return build(spec, ctx);
    }
    // ---- orchestration ----------------------------------------------------
    step(state, animate = true) {
      if (this.controls) this.controls.resetActions();
      this.syncAll(state);
      this.onStep?.({ pc: state.model.pc ?? -1, index: state.index, total: state.total });
      if (animate) this.animateAll(state);
      if (state.atEnd) {
        this.stop();
        this.markComplete();
      }
    }
    /** Report the current tracked XP to the host, which owns any XP label. */
    refreshXp() {
      this.onXpChange?.(this.progress.xp());
    }
    /** Mark the lesson complete and grant XP once, when the last step is reached. */
    markComplete() {
      this.progress.awardOnce();
      this.refreshXp();
    }
    runAction(index) {
      const action = this.actions[index];
      if (!action) return;
      const state = this.player.applyAction(action);
      this.syncAll(state);
      this.animateAll(state);
      if (action.once && this.controls) this.controls.disableAction(index);
    }
    syncAll(state) {
      const ctx = {
        model: state.model,
        index: state.index,
        total: state.total,
        atStart: state.atStart,
        atEnd: state.atEnd
      };
      for (const p of this.panels) p.sync(ctx);
    }
    animateAll(state) {
      for (const p of this.panels) if (p.animate) void p.animate(state.model);
    }
    play() {
      if (!this.controls) return;
      if (this.player.state.atEnd) this.step(this.player.reset(), false);
      this.controls.setPlaying(true);
      this.autoplay.start();
    }
    /** Hold each step long enough to read its narration at ~300 words/minute. */
    stepDurationMs() {
      const words = (this.player.state.model.narr ?? "").trim().split(/\s+/).filter(Boolean).length;
      const readMs = words / WORDS_PER_MINUTE * 6e4;
      return Math.max(MIN_STEP_MS, Math.round(readMs) + 500);
    }
    stop() {
      this.autoplay.stop();
    }
    setFont(scale) {
      this.scale = scale;
      this.root.style.setProperty("--mv-fs", String(scale));
      if (this.controls) this.controls.setActiveSize(scale);
      this.relayout();
    }
    relayout() {
      const model = this.player.state.model;
      for (const p of this.panels) if (p.onResize) p.onResize(model);
    }
  };

  // src/core/trace-narration.ts
  var DEFAULT_TRACE_NARRATION = {
    entered: "Entered `{name}`",
    calledCtor: "Called the `{type}` constructor",
    calledOn: "Called `{method}` on `{recv}`",
    called: "Called `{method}`",
    ctorFinishedBack: "The `{type}` constructor finished - back in `{caller}`",
    ctorFinished: "The `{type}` constructor finished",
    returnedTo: "`{method}` returned to `{caller}`",
    returned: "`{method}` returned",
    printed: "Printed `{text}`",
    printedBlank: "Printed a blank line",
    setToNew: "Set `{name}` to a new `{type}`",
    createdNumbered: "Created a `{type}` (`{label}`)",
    created: "Created a `{type}`",
    pointedAt: "Pointed `{name}` at `{label}`",
    setTo: "Set `{name}` to `{value}`",
    runningLine: "Running this line: `{line}`",
    running: "Running the program.",
    // Singular and plural are separate templates rather than one string with an
    // "s" glued on: not every language pluralises by adding a letter, and the
    // English original had the suffix baked into the sentence.
    finishedPrintedOne: "The program finished. It printed {n} line.",
    finishedPrintedMany: "The program finished. It printed {n} lines.",
    finishedNoPrint: "The program finished without printing anything.",
    truncated: "Stopped early - there were too many steps to show the rest.",
    anObject: "an object"
  };
  function resolveNarration(overrides) {
    const { merged, issues } = mergeTemplates(DEFAULT_TRACE_NARRATION, overrides);
    return { narration: merged, issues };
  }

  // src/core/exec-tracer-model.ts
  function traceToSteps(trace, narration) {
    const t = resolveNarration(narration).narration;
    const src = trace.code ?? [];
    const steps = collapseCallEntries(trace.steps ?? []);
    const out = [];
    let prevValues = /* @__PURE__ */ new Map();
    let prevFields = /* @__PURE__ */ new Map();
    let prevGlobals = /* @__PURE__ */ new Map();
    let prevStdout = "";
    steps.forEach((ts, i) => {
      const values = /* @__PURE__ */ new Map();
      const stack = (ts.frames ?? []).map(
        (f) => frameToFrame(f, values, prevValues, i === 0)
      );
      const fields = /* @__PURE__ */ new Map();
      const heap = (ts.heap ?? []).map(
        (o) => objectToObject(o, fields, prevFields, i === 0)
      );
      const globalValues = /* @__PURE__ */ new Map();
      const globals = globalSlots(ts.statics ?? [], globalValues, prevGlobals, i === 0);
      const rodata = globalSlots(ts.consts ?? []);
      const stdout = ts.stdout ?? "";
      const printed = stdout.startsWith(prevStdout) ? stdout.slice(prevStdout.length) : stdout;
      const prevFrames = i > 0 ? steps[i - 1].frames ?? [] : [];
      const prevHeapIds = new Set((i > 0 ? steps[i - 1].heap ?? [] : []).map((o) => o.id));
      const step = {
        narr: describeStep(prevFrames, ts, stack, heap, prevHeapIds, globals, printed, src, t),
        pc: typeof ts.line === "number" && ts.line > 0 ? ts.line - 1 : -1,
        codeLive: true,
        stack,
        heap
      };
      if (globals.length) step.globals = globals;
      if (rodata.length) step.rodata = rodata;
      if (printed) step.printed = printed;
      if (stdout) step.output = stdout;
      out.push(step);
      prevValues = values;
      prevFields = fields;
      prevGlobals = globalValues;
      prevStdout = stdout;
    });
    const lastTs = steps[steps.length - 1];
    if (lastTs) {
      const values = /* @__PURE__ */ new Map();
      const stack = (lastTs.frames ?? []).map(
        (f) => frameToFrame(f, values, prevValues, false)
      );
      const fields = /* @__PURE__ */ new Map();
      const heap = (lastTs.heap ?? []).map(
        (o) => objectToObject(o, fields, prevFields, false)
      );
      const globals = globalSlots(lastTs.statics ?? [], /* @__PURE__ */ new Map(), prevGlobals, false);
      const rodata = globalSlots(lastTs.consts ?? []);
      const printedLines = prevStdout ? prevStdout.replace(/\n+$/, "").split("\n").length : 0;
      const terminal = {
        narr: trace.truncated ? t.truncated : printedLines > 0 ? fill(printedLines === 1 ? t.finishedPrintedOne : t.finishedPrintedMany, { n: printedLines }) : t.finishedNoPrint,
        pc: -1,
        codeLive: true,
        stack,
        heap
      };
      if (globals.length) terminal.globals = globals;
      if (rodata.length) terminal.rodata = rodata;
      if (prevStdout) terminal.output = prevStdout;
      out.push(terminal);
    }
    return out;
  }
  function collapseCallEntries(steps) {
    const drop = /* @__PURE__ */ new Set();
    for (let i = 1; i + 1 < steps.length; i++) {
      const prev2 = steps[i - 1];
      const cur = steps[i];
      const next2 = steps[i + 1];
      const curLen = cur.frames?.length ?? 0;
      const pushed = curLen > (prev2.frames?.length ?? 0);
      if (!pushed) continue;
      if (cur.line !== next2.line) continue;
      if (curLen !== (next2.frames?.length ?? 0)) continue;
      const curTop = cur.frames?.[curLen - 1];
      const nextTop = next2.frames?.[curLen - 1];
      if (!curTop || !nextTop || curTop.id !== nextTop.id) continue;
      drop.add(i);
    }
    return drop.size ? steps.filter((_, i) => !drop.has(i)) : steps;
  }
  function frameToFrame(f, values, prevValues, firstStep) {
    const vars = (f.vars ?? []).map((v) => {
      const id = `${f.id}:${v.name}`;
      const display = v.ref != null ? refDisplay(v) : v.value ?? "";
      values.set(id, display);
      const hot = !firstStep && prevValues.get(id) !== display;
      const slot = { id, k: v.name, hot };
      if (v.ref != null) slot.ref = v.ref;
      else slot.v = v.value ?? "";
      if (v.role) slot.role = v.role;
      return slot;
    });
    const frame = { id: f.id, name: f.name, vars };
    if (f.kind) frame.kind = f.kind;
    if (f.recv) frame.recv = f.recv;
    if (f.recvId) frame.recvId = f.recvId;
    if (typeof f.line === "number") frame.line = f.line;
    return frame;
  }
  function objectToObject(o, fields, prevFields, firstStep) {
    const hotFields = [];
    (o.fields ?? []).forEach(([name, value]) => {
      const key = `${o.id}:${name}`;
      fields.set(key, value);
      if (!firstStep && prevFields.get(key) !== value) hotFields.push(name);
    });
    const obj = { id: o.id, type: o.type, fields: o.fields ?? [], hotFields };
    if (typeof o.no === "number") obj.no = o.no;
    return obj;
  }
  function globalSlots(globals, values, prevValues, firstStep = false) {
    return (globals ?? []).map((g) => {
      const owner = g.owner ?? "";
      const id = `${owner}.${g.name}`;
      const v = g.value ?? "";
      values?.set(id, v);
      const slot = {
        id,
        k: owner ? `${owner}.${g.name}` : g.name,
        v
      };
      if (prevValues && !firstStep && prevValues.get(id) !== v) slot.hot = true;
      return slot;
    });
  }
  function refDisplay(v) {
    return v.ref != null ? `\u2192${v.ref}` : v.value ?? "null";
  }
  function describeStep(prevFrames, ts, stack, heap, prevHeapIds, globals, printed, src, t) {
    const curFrames = ts.frames ?? [];
    const prevLen = prevFrames.length;
    const curLen = curFrames.length;
    if (curLen > prevLen) return callNarration(curFrames[curLen - 1], t);
    if (curLen < prevLen) return returnNarration(prevFrames[prevLen - 1], curFrames[curLen - 1], t);
    if (printed) return printedNarration(printed, t);
    const topFrame = stack[stack.length - 1];
    const hotSlot = topFrame ? topFrame.vars.find((v) => v.hot) : void 0;
    const created = heap.find((o) => !prevHeapIds.has(o.id));
    if (created && hotSlot && hotSlot.ref != null && hotSlot.ref === created.id) {
      return fill(t.setToNew, { name: hotSlot.k ?? "", type: created.type });
    }
    if (created) {
      const label = typeof created.no === "number" ? `${created.type} #${created.no}` : created.type;
      return typeof created.no === "number" ? fill(t.createdNumbered, { type: created.type, label }) : fill(t.created, { type: created.type });
    }
    if (hotSlot) {
      if (hotSlot.ref != null)
        return fill(t.pointedAt, { name: hotSlot.k ?? "", label: heapLabel(hotSlot.ref, heap, t) });
      return fill(t.setTo, { name: hotSlot.k ?? "", value: hotSlot.v ?? "" });
    }
    const g = globals.find((s) => s.hot);
    if (g) return fill(t.setTo, { name: g.k, value: g.v });
    return runningNarration(ts.line, src, t);
  }
  function callNarration(top, t) {
    if (top.kind === "entry") return fill(t.entered, { name: top.name || "Main" });
    if (top.kind === "ctor") {
      const type = (top.name || "").replace(/^new\s+/, "") || "object";
      return fill(t.calledCtor, { type });
    }
    const m = methodLabel(top);
    return top.recv ? fill(t.calledOn, { method: m, recv: top.recv }) : fill(t.called, { method: m });
  }
  function returnNarration(left, back, t) {
    const backName = back ? back.name : null;
    if (left.kind === "ctor") {
      const type = (left.name || "").replace(/^new\s+/, "") || "object";
      return backName ? fill(t.ctorFinishedBack, { type, caller: backName }) : fill(t.ctorFinished, { type });
    }
    const m = methodLabel(left);
    return backName ? fill(t.returnedTo, { method: m, caller: backName }) : fill(t.returned, { method: m });
  }
  function methodLabel(f) {
    const name = f.name || "?";
    return name.endsWith(")") ? name : name + "()";
  }
  function printedNarration(printed, t) {
    const parts = printed.replace(/\n+$/, "").split("\n");
    const first = (parts[0] ?? "").replace(/`/g, "");
    if (first === "") return t.printedBlank;
    const shown = parts.length > 1 ? first + " \u2026" : first;
    return fill(t.printed, { text: shown });
  }
  function heapLabel(ref, heap, t) {
    const o = heap.find((h) => h.id === ref);
    if (!o) return t.anObject;
    return typeof o.no === "number" ? `${o.type} #${o.no}` : o.type;
  }
  function runningNarration(line, src, t) {
    const text = typeof line === "number" && line > 0 ? (src[line - 1] ?? "").trim() : "";
    if (!text) return t.running;
    return fill(t.runningLine, { line: text });
  }

  // src/dom/error-panel.ts
  var DEFAULT_LABELS3 = {
    heading: "Let's fix this first",
    note: "Often a single early mistake (a missing or extra { } ( ) ;) is enough to confuse the rest. Fix the top one first, then run again.",
    why: "Learn why",
    hideWhy: "Hide why",
    warningHeading: "It ran - but read this",
    warningNote: "The compiler built this, so it is not an error. It is telling you these lines cannot be doing what they look like they do. Code that runs and is still wrong is the expensive kind."
  };
  function locText(e) {
    if (e.line == null) return "";
    return e.column != null ? `Line ${e.line}, col ${e.column}` : `Line ${e.line}`;
  }
  function renderErrorPanel(errors, labels = {}, options = {}) {
    const l = { ...DEFAULT_LABELS3, ...labels };
    const isWarning = options.kind === "warning";
    const section2 = document.createElement("section");
    section2.className = isWarning ? "cl-errors cl-errors--warning" : "cl-errors";
    const heading = document.createElement("h3");
    heading.textContent = isWarning ? l.warningHeading : l.heading;
    section2.appendChild(heading);
    const note = document.createElement("p");
    note.className = "cl-errors-note";
    note.textContent = isWarning ? l.warningNote : l.note;
    section2.appendChild(note);
    const list = document.createElement("ul");
    for (const e of errors) {
      const li = document.createElement("li");
      const loc = locText(e);
      if (loc) {
        const locEl = document.createElement("span");
        locEl.className = "cl-error-loc";
        locEl.textContent = loc;
        li.appendChild(locEl);
      }
      if (e.friendly) {
        const friendly = document.createElement("span");
        friendly.className = "cl-error-friendly";
        friendly.textContent = e.friendly;
        li.appendChild(friendly);
      }
      const raw = document.createElement("span");
      raw.className = "cl-error-raw";
      raw.textContent = e.raw;
      li.appendChild(raw);
      if (e.why) {
        const toggle = document.createElement("button");
        toggle.type = "button";
        toggle.className = "cl-error-why-toggle";
        toggle.textContent = l.why;
        toggle.setAttribute("aria-expanded", "false");
        const why = document.createElement("p");
        why.className = "cl-error-why";
        why.textContent = e.why;
        why.hidden = true;
        toggle.addEventListener("click", () => {
          why.hidden = !why.hidden;
          toggle.textContent = why.hidden ? l.why : l.hideWhy;
          toggle.setAttribute("aria-expanded", why.hidden ? "false" : "true");
        });
        li.appendChild(toggle);
        li.appendChild(why);
      }
      list.appendChild(li);
    }
    section2.appendChild(list);
    return section2;
  }
  function showErrorPanel(host, errors, labels, options) {
    host.textContent = "";
    if (!errors || errors.length === 0) {
      host.hidden = true;
      return false;
    }
    host.appendChild(renderErrorPanel(errors, labels, options));
    host.hidden = false;
    return true;
  }

  // src/core/viz-trace-outcome.ts
  function classifyTraceOutcome(result) {
    if (!result.compiled) {
      return { status: "did-not-compile", truncated: false, errors: result.errors ?? [] };
    }
    const trace = result.trace;
    const truncated = trace?.truncated === true;
    const runtimeError = result.runtimeError ?? void 0;
    if (!trace || (trace.steps?.length ?? 0) === 0) {
      const empty = { status: "empty", truncated, errors: [] };
      if (trace) empty.trace = trace;
      if (runtimeError) empty.runtimeError = runtimeError;
      return empty;
    }
    const status = runtimeError ? "threw" : truncated ? "budget" : "traced";
    const outcome = { status, trace, truncated, errors: [] };
    if (runtimeError) outcome.runtimeError = runtimeError;
    return outcome;
  }
  function tracerFailedOutcome(message) {
    return { status: "failed", truncated: false, errors: [], failure: message };
  }

  // src/core/wait-progress.ts
  function bootWait(labels, phase, percent) {
    if (phase === "download") {
      const pct = Math.max(0, Math.min(100, Math.round(percent)));
      return { label: fill(labels.vlBootDownload, { percent: pct }), percent: pct };
    }
    return {
      label: phase === "start" ? labels.vlBootStart : labels.vlBootWarm,
      percent: null
    };
  }
  function traceWait(labels, elapsedMs) {
    const secs = Math.floor(Math.max(0, elapsedMs) / 1e3);
    return {
      label: secs < 1 ? labels.vlTracing : fill(labels.vlTracingSecs, { secs }),
      percent: null
    };
  }

  // src/dom/viz-lab.ts
  function normalizeErrors(errors) {
    return errors.map((e) => ({
      line: e.line ?? void 0,
      friendly: e.friendly ?? void 0,
      raw: e.raw
    }));
  }
  var DEFAULT_STARTER = [
    "class Program",
    "{",
    "    static void Main()",
    "    {",
    "        int a = 3;",
    "        int b = 4;",
    "        int total = a + b;",
    "        System.Console.WriteLine(total);",
    "    }",
    "}"
  ].join("\n");
  var VizLab = class _VizLab {
    constructor(host, config) {
      this.editor = new MonacoEditor();
      this.lastTrace = null;
      this.lastSteps = null;
      this.viz = null;
      this.ready = false;
      this.mounted = false;
      this.pendingSource = null;
      this.traceTimer = null;
      this.legend = config.legend;
      this.language = config.language ?? "csharp";
      this.labels = mergeTemplates(DEFAULT_VIZ_LABELS, config.labels).merged;
      this.narration = config.narration;
      this.onTrace = config.onTrace;
      this.runner = new IframeRunner({
        url: config.runnerUrl,
        readyTimeout: config.readyTimeout ?? 18e4,
        // The runtime is ~30MB, so this wait is tens of seconds on a slow line.
        // Reporting the phase is what answers "is it stuck?" - only the download
        // has a number, and it is the phase most likely to be the slow one.
        onProgress: (progress) => this.showBootPhase(progress.phase, progress.percent)
      });
      this.root = document.createElement("div");
      this.root.className = "cl-vl";
      const editorPane = document.createElement("div");
      editorPane.className = "cl-vl-editor";
      const toolbar = document.createElement("div");
      toolbar.className = "cl-vl-toolbar";
      this.vizBtn = document.createElement("button");
      this.vizBtn.type = "button";
      this.vizBtn.className = "cl-btn cl-primary cl-vl-run";
      this.vizBtn.textContent = this.labels.vlPreparing;
      this.vizBtn.disabled = true;
      this.vizBtn.setAttribute("aria-busy", "true");
      this.vizBtn.setAttribute("data-viz", "");
      this.vizBtn.addEventListener("click", () => void this.visualize());
      this.statusEl = document.createElement("span");
      this.statusEl.className = "cl-vl-status";
      this.statusEl.setAttribute("role", "status");
      this.statusEl.setAttribute("aria-live", "polite");
      toolbar.append(this.vizBtn, this.statusEl);
      this.editorHost = document.createElement("div");
      this.editorHost.className = "cl-vl-monaco";
      editorPane.append(toolbar, this.editorHost);
      this.stage = document.createElement("div");
      this.stage.className = "cl-vl-stage";
      this.showHint(this.labels.vlHint);
      this.root.append(editorPane, this.stage);
      host.appendChild(this.root);
      void this.boot(config.starter ?? DEFAULT_STARTER);
    }
    static create(host, config) {
      return new _VizLab(host, config);
    }
    /** Paint a wait inside the button: a label naming the phase, over a bar.
     *
     *  `percent` null means "no measurable progress" - the bar then animates
     *  instead of filling, because a fake percentage that creeps to 90% and stops
     *  is worse than an honest "this is still going". Every wait longer than a
     *  second lands here, so none of them can look like a hang. */
    showWait(label, percent) {
      let bar = this.vizBtn.querySelector(".cl-vl-wait-fill");
      let text = this.vizBtn.querySelector(".cl-vl-wait-label");
      if (!bar || !text) {
        this.vizBtn.textContent = "";
        const wrap = document.createElement("span");
        wrap.className = "cl-vl-wait";
        text = document.createElement("span");
        text.className = "cl-vl-wait-label";
        const track = document.createElement("span");
        track.className = "cl-vl-wait-bar";
        bar = document.createElement("span");
        bar.className = "cl-vl-wait-fill";
        track.appendChild(bar);
        wrap.append(text, track);
        this.vizBtn.appendChild(wrap);
      }
      text.textContent = label;
      if (percent === null) {
        bar.classList.add("is-indeterminate");
        bar.style.width = "";
        this.vizBtn.removeAttribute("aria-valuenow");
      } else {
        const pct = Math.max(0, Math.min(100, Math.round(percent)));
        bar.classList.remove("is-indeterminate");
        bar.style.width = pct + "%";
        this.vizBtn.setAttribute("aria-valuenow", String(pct));
      }
    }
    /** Put the button back to a plain label, ending whatever wait it was showing. */
    endWait(label) {
      if (this.traceTimer !== null) {
        clearInterval(this.traceTimer);
        this.traceTimer = null;
      }
      this.vizBtn.textContent = label;
      this.vizBtn.removeAttribute("aria-busy");
      this.vizBtn.removeAttribute("aria-valuenow");
    }
    showBootPhase(phase, percent) {
      if (this.ready) return;
      const wait = bootWait(this.labels, phase, percent);
      this.showWait(wait.label, wait.percent);
    }
    async boot(starter) {
      await loadMonaco();
      await this.editor.mount(this.editorHost, {
        value: this.pendingSource ?? starter,
        language: this.language,
        readOnly: false,
        autoHeight: { minHeight: 220, maxHeight: 640 }
      });
      this.mounted = true;
      if (this.pendingSource !== null) {
        this.editor.setValue(this.pendingSource);
        this.pendingSource = null;
      }
      try {
        await this.runner.warm();
      } catch {
      } finally {
        this.ready = true;
        this.vizBtn.disabled = false;
        this.endWait(this.labels.vlVisualize);
      }
    }
    async visualize() {
      if (!this.ready) return;
      const code = this.editor.getValue();
      this.vizBtn.disabled = true;
      this.vizBtn.setAttribute("aria-busy", "true");
      const startedAt = Date.now();
      const tick = () => {
        const wait = traceWait(this.labels, Date.now() - startedAt);
        this.showWait(wait.label, wait.percent);
      };
      tick();
      if (this.traceTimer !== null) clearInterval(this.traceTimer);
      this.traceTimer = setInterval(tick, 1e3);
      this.setStatus("");
      let report = null;
      try {
        const result = await this.runner.trace(code);
        report = classifyTraceOutcome({
          compiled: result.compiled,
          trace: result.trace,
          runtimeError: result.runtimeError,
          errors: normalizeErrors(result.errors)
        });
        if (!result.compiled) {
          const errors = normalizeErrors(result.errors);
          this.showErrors(errors);
          this.setStatus(this.labels.vlDidNotCompile);
          if (this.editor.setMarkers) this.editor.setMarkers(errors);
          return;
        }
        if (this.editor.setMarkers) this.editor.setMarkers([]);
        if (!result.trace || result.trace.steps.length === 0) {
          this.showHint(this.labels.vlNoStepsHint);
          this.setStatus(this.labels.vlNoSteps);
          return;
        }
        this.lastTrace = result.trace;
        this.lastSteps = traceToSteps(result.trace, this.narration);
        this.render();
        const n = Math.max(0, this.lastSteps.length - 1);
        let msg = fill(n === 1 ? this.labels.vlTracedOne : this.labels.vlTracedMany, { n });
        if (result.trace.truncated) msg += this.labels.vlTruncated;
        if (result.runtimeError) msg += fill(this.labels.vlThrew, { message: result.runtimeError });
        this.setStatus(msg);
      } catch (err) {
        const message = String(err.message || err);
        report = tracerFailedOutcome(message);
        this.showHint(this.labels.vlFailedHint);
        this.setStatus(message);
      } finally {
        this.vizBtn.disabled = false;
        this.endWait(this.labels.vlVisualize);
        if (report) this.onTrace?.(report);
      }
    }
    /** The one layout: the memory view (call stack + heap objects) in the wide
     *  column, then narration, the console output, and the transport controls in
     *  the reading rail. The console sits right under the narration so "this line
     *  runs" and "this is what it printed" read together. */
    memoryLayout() {
      return {
        visual: [{ type: "heapcards" }],
        aside: [{ type: "narration" }, { type: "console" }, { type: "controls" }]
      };
    }
    render() {
      if (!this.lastTrace || !this.lastSteps) return;
      const layout2 = this.memoryLayout();
      if (this.viz) {
        this.viz.setSteps(this.lastSteps, {
          code: this.lastTrace.code,
          layout: layout2,
          preserveIndex: false
        });
        return;
      }
      this.stage.textContent = "";
      this.viz = MemoryViz.create(this.stage, {
        code: this.lastTrace.code,
        steps: this.lastSteps,
        layout: layout2,
        legend: this.legend,
        labels: this.labels,
        deriveRefs: true,
        autoDim: true,
        onStep: (info) => this.editor.highlightLine?.(info.pc)
      });
    }
    showHint(text) {
      this.editor.highlightLine?.(null);
      this.teardownViz();
      this.stage.textContent = "";
      const hint = document.createElement("p");
      hint.className = "cl-vl-hint";
      hint.textContent = text;
      this.stage.appendChild(hint);
    }
    showErrors(errors) {
      this.editor.highlightLine?.(null);
      this.teardownViz();
      this.stage.textContent = "";
      this.stage.appendChild(renderErrorPanel(errors));
    }
    teardownViz() {
      this.viz?.destroy();
      this.viz = null;
      this.lastTrace = null;
      this.lastSteps = null;
    }
    setStatus(text) {
      this.statusEl.textContent = text;
    }
    /** Load a different exercise into the editor without tearing the widget down,
     *  so a lesson can move between cards while keeping the one warmed compiler
     *  this surface owns. Clears the stage back to its hint - the picture on
     *  screen belongs to the code that produced it, never to the next exercise. */
    setSource(code) {
      if (!this.mounted) {
        this.pendingSource = code;
        return;
      }
      this.editor.setValue(code);
      if (this.editor.setMarkers) this.editor.setMarkers([]);
      this.setStatus("");
      this.showHint(this.labels.vlHint);
    }
    /** The learner's current code. A host grades the trace, not the text; this is
     *  for saving work and for restoring it, not for marking. */
    getSource() {
      if (!this.mounted) return this.pendingSource ?? "";
      return this.editor.getValue();
    }
    destroy() {
      this.teardownViz();
      this.editor.destroy();
      this.runner.destroy();
      this.root.remove();
    }
  };

  // src/terminal/history.ts
  var DEFAULT_LIMIT = 100;
  var CommandHistory = class {
    constructor(limit = DEFAULT_LIMIT) {
      this.items = [];
      /** Index into `items`; `items.length` means "on the live line". */
      this.cursor = 0;
      this.draft = "";
      this.limit = Math.max(1, limit);
    }
    /** Entered commands, oldest first. */
    get entries() {
      return this.items;
    }
    /** Record a command and return to the live line. Blank lines are not stored,
     *  and a command identical to the previous one is not stored twice. */
    push(line) {
      const value = line.trim();
      if (value !== "" && this.items[this.items.length - 1] !== value) {
        this.items.push(value);
        if (this.items.length > this.limit) this.items.shift();
      }
      this.reset();
    }
    /** Older entry, or `null` when already at the oldest (or history is empty).
     *  `current` is the text on the live line, parked on the first step back. */
    prev(current) {
      if (this.cursor === 0) return null;
      if (this.cursor === this.items.length) this.draft = current;
      this.cursor -= 1;
      return this.items[this.cursor] ?? null;
    }
    /** Newer entry, the parked draft when stepping back onto the live line, or
     *  `null` when already on the live line. */
    next() {
      if (this.cursor >= this.items.length) return null;
      this.cursor += 1;
      return this.cursor === this.items.length ? this.draft : this.items[this.cursor] ?? null;
    }
    /** Drop the walk position and the parked draft. */
    reset() {
      this.cursor = this.items.length;
      this.draft = "";
    }
  };

  // src/terminal/line-terminal.ts
  var DEFAULT_PROMPT = "$";
  var LineTerminal = class {
    constructor() {
      this.root = null;
      this.scroll = null;
      this.input = null;
      this.prompt = DEFAULT_PROMPT;
      this.onCommand = null;
      this.shell = null;
      this.onState = null;
      this.history = new CommandHistory();
      // --- input -------------------------------------------------------------
      this.onKeyDown = (ev) => {
        const input = this.input;
        if (!input) return;
        if (ev.key === "Enter") {
          ev.preventDefault();
          this.submit(input.value);
          return;
        }
        if (ev.key === "ArrowUp") {
          ev.preventDefault();
          this.recall(this.history.prev(input.value));
          return;
        }
        if (ev.key === "ArrowDown") {
          ev.preventDefault();
          this.recall(this.history.next());
        }
      };
      /** Clicking anywhere in the console puts the caret back on the live line -
       *  except when the click ended a selection, so output stays copyable. */
      this.onRootClick = (ev) => {
        if (ev.target === this.input) return;
        const sel = typeof document.getSelection === "function" ? document.getSelection() : null;
        if (sel && sel.toString() !== "") return;
        this.focus();
      };
    }
    // --- lifecycle ---------------------------------------------------------
    mount(host, opts) {
      this.prompt = opts.prompt ?? DEFAULT_PROMPT;
      this.onCommand = opts.onCommand ?? null;
      this.shell = opts.shell ?? null;
      this.state = opts.state;
      this.onState = opts.onState ?? null;
      const root = document.createElement("div");
      root.className = "cl-term";
      const scroll = document.createElement("div");
      scroll.className = "cl-term-scroll";
      scroll.setAttribute("role", "log");
      scroll.setAttribute("aria-live", "polite");
      scroll.setAttribute("aria-label", "Terminal output");
      const row = document.createElement("div");
      row.className = "cl-term-row";
      row.append(this.promptSpan());
      const input = document.createElement("input");
      input.className = "cl-term-input";
      input.type = "text";
      input.setAttribute("aria-label", "Terminal command");
      input.autocomplete = "off";
      input.spellcheck = false;
      input.setAttribute("autocapitalize", "off");
      input.setAttribute("autocorrect", "off");
      row.append(input);
      root.append(scroll, row);
      root.addEventListener("click", this.onRootClick);
      input.addEventListener("keydown", this.onKeyDown);
      host.appendChild(root);
      this.root = root;
      this.scroll = scroll;
      this.input = input;
      for (const line of opts.intro ?? []) this.write(line);
    }
    destroy() {
      this.root?.removeEventListener("click", this.onRootClick);
      this.input?.removeEventListener("keydown", this.onKeyDown);
      this.root?.remove();
      this.root = null;
      this.scroll = null;
      this.input = null;
      this.onCommand = null;
      this.shell = null;
      this.onState = null;
      this.history.reset();
    }
    // --- public API --------------------------------------------------------
    /** Append output to the scrollback. Embedded newlines become separate lines,
     *  so a caller can hand over a whole command result in one call. */
    write(text, kind = "out") {
      if (!this.scroll) return;
      for (const line of String(text).split("\n")) {
        const el = document.createElement("div");
        el.className = `cl-term-line is-${kind}`;
        el.textContent = line;
        this.scroll.appendChild(el);
      }
      this.scrollToEnd();
    }
    /** Wipe the scrollback. The prompt line, its text, and focus are untouched. */
    clear() {
      if (this.scroll) this.scroll.textContent = "";
    }
    focus() {
      this.input?.focus();
    }
    submit(raw) {
      const line = raw.trim();
      if (this.input) this.input.value = "";
      this.echo(line);
      this.history.push(line);
      if (line === "") return;
      if (this.shell) {
        this.dispatch(line);
        this.onCommand?.(line);
        return;
      }
      this.onCommand?.(line);
    }
    /** Run the line through the shell, if there is one, and show what came back. */
    dispatch(line) {
      const shell = this.shell;
      if (!shell) return;
      const result = shell.run(line, this.state);
      if (isClear(result.effect)) this.clear();
      if (result.output !== "") this.write(result.output, result.error ? "err" : "out");
      this.state = result.state;
      this.onState?.(result.state, result);
    }
    /** Put a recalled entry on the live line, caret at the end. `null` means the
     *  walk hit an end, so the line stays as it is. */
    recall(value) {
      const input = this.input;
      if (!input || value === null) return;
      input.value = value;
      const end = value.length;
      if (typeof input.setSelectionRange === "function") input.setSelectionRange(end, end);
    }
    // --- rendering helpers -------------------------------------------------
    /** Echo what was entered into the scrollback, so the transcript reads like a
     *  real session. A blank line echoes a bare prompt. */
    echo(line) {
      if (!this.scroll) return;
      const el = document.createElement("div");
      el.className = "cl-term-line is-cmd";
      el.append(this.promptSpan());
      el.append(document.createTextNode(line === "" ? "" : ` ${line}`));
      this.scroll.appendChild(el);
      this.scrollToEnd();
    }
    promptSpan() {
      const el = document.createElement("span");
      el.className = "cl-term-prompt";
      el.textContent = this.prompt;
      el.setAttribute("aria-hidden", "true");
      return el;
    }
    scrollToEnd() {
      if (this.scroll) this.scroll.scrollTop = this.scroll.scrollHeight;
    }
  };
  function isClear(effect) {
    return typeof effect === "object" && effect !== null && effect.kind === "clear";
  }

  // src/core/quiz-model.ts
  function shuffle(arr, rng = Math.random) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      const tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  }
  function neededToPass(askCount, passRatio) {
    return Math.max(1, Math.ceil(askCount * passRatio));
  }
  function drawQuiz(config, rng = Math.random) {
    const bank = config.questions ?? [];
    const askCount = Math.max(1, Math.min(config.askCount ?? bank.length, bank.length));
    const passRatio = typeof config.passRatio === "number" ? config.passRatio : 0.7;
    const questions = shuffle(bank, rng).slice(0, askCount).map((q) => ({
      concept: q.concept ?? "",
      conceptId: q.conceptId ?? "",
      stem: q.stem,
      why: q.why ?? "",
      chosen: -1,
      options: shuffle(
        (q.options ?? []).map((text, i) => ({ text, correct: i === q.correct })),
        rng
      )
    }));
    return { questions, askCount, needed: neededToPass(askCount, passRatio) };
  }
  function firstUnanswered(plan) {
    return plan.questions.findIndex((q) => q.chosen < 0);
  }
  function scoreQuiz(plan) {
    let score = 0;
    for (const q of plan.questions) {
      if (q.chosen >= 0 && q.options[q.chosen] && q.options[q.chosen].correct) score += 1;
    }
    return { score, total: plan.questions.length, passed: score >= plan.needed };
  }
  function conceptResults(plan) {
    const out = {};
    for (const q of plan.questions) {
      const id = q.conceptId;
      if (!id) continue;
      const right = q.chosen >= 0 && !!q.options[q.chosen] && q.options[q.chosen].correct;
      out[id] = (out[id] ?? false) || right;
    }
    return out;
  }

  // src/dom/quiz-view.ts
  var DEFAULT_QUIZ_LABELS = {
    knowledgeCheck: "Knowledge check",
    submit: "Submit answers",
    retry: "Try a fresh set",
    continue: "Continue",
    progressPassed: "Passed before \xB7 {n} questions",
    progressFresh: "{n} questions \xB7 {m} to pass",
    progressScored: "Scored {score}/{total}",
    answerAll: "Answer every question",
    stillNeeds: "Question {n} still needs an answer.",
    correctPrefix: "Correct. ",
    notQuitePrefix: "Not quite. ",
    passTitle: "Checkpoint passed",
    failTitle: "Not passed yet",
    scoredLine: "You scored <strong>{score} / {total}</strong> - {needed} needed to pass.",
    passTail: " The explanations below cover anything you missed.",
    failTail: " Read the explanations below, then try a fresh set of questions.",
    xpLine: " +{xp} XP.",
    courseXp: "Course XP: {xp}"
  };
  function fill2(tpl, vars) {
    return tpl.replace(/\{(\w+)\}/g, (_m, k) => k in vars ? String(vars[k]) : `{${k}}`);
  }
  var CONCEPT_PROGRESS_KEY = "course_concept_progress";
  function localStore(xpKey, awardedKey, kv = globalThis.localStorage) {
    const read = () => {
      try {
        return JSON.parse(kv.getItem(awardedKey) || "{}");
      } catch {
        return {};
      }
    };
    const xp = () => parseInt(kv.getItem(xpKey) || "0", 10);
    return {
      hasPassed: () => Boolean(read().passed),
      markPassed: () => kv.setItem(awardedKey, JSON.stringify({ passed: true })),
      getXP: xp,
      addXP: (amount) => kv.setItem(xpKey, String(xp() + amount)),
      saveConceptResults: (results) => {
        try {
          const prev2 = JSON.parse(kv.getItem(CONCEPT_PROGRESS_KEY) || "{}");
          for (const [id, passed] of Object.entries(results)) {
            if (passed) prev2[id] = true;
          }
          kv.setItem(CONCEPT_PROGRESS_KEY, JSON.stringify(prev2));
        } catch {
        }
      }
    };
  }
  function escapeHtml5(text) {
    return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function inline2(text) {
    return escapeHtml5(text).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  }
  function inlineOption(text) {
    return escapeHtml5(text).replace(/\*\*([^*]+)\*\*/g, "$1").replace(/`([^`]+)`/g, "<code>$1</code>");
  }
  var Quiz = class _Quiz {
    constructor(host, config, store) {
      this.graded = false;
      this.cfg = config;
      this.awardAmount = typeof config.awardAmount === "number" ? config.awardAmount : 40;
      this.store = store ?? localStore(config.xpKey || "course_global_xp", config.awardedKey || `${config.prefix || "quiz"}_awarded`);
      this.labels = { ...DEFAULT_QUIZ_LABELS, ...config.labels || {} };
      this.root = document.createElement("section");
      this.root.className = "cl-quiz";
      this.root.setAttribute("aria-live", "polite");
      this.root.innerHTML = `
      <header class="cl-quiz-head">
        <p class="cl-quiz-meta">${escapeHtml5(config.metaLabel || "")}</p>
        <h2 class="cl-quiz-title">${escapeHtml5(config.title || this.labels.knowledgeCheck)}</h2>
        <p class="cl-quiz-intro">${inline2(config.intro || "")}</p>
        <span class="cl-quiz-progress" data-progress></span>
      </header>
      <div class="cl-quiz-questions" data-questions></div>
      <div class="cl-quiz-actions">
        <button type="button" class="cl-quiz-btn cl-quiz-primary" data-submit>${escapeHtml5(this.labels.submit)}</button>
        <button type="button" class="cl-quiz-btn" data-retry hidden>${escapeHtml5(this.labels.retry)}</button>
      </div>
      <section class="cl-quiz-result" data-result hidden>
        <h3 data-result-title></h3>
        <p data-result-body></p>
        <div class="cl-quiz-continue" data-continue></div>
      </section>`;
      const q = (sel) => this.root.querySelector(sel);
      this.els = {
        questions: q("[data-questions]"),
        submit: q("[data-submit]"),
        retry: q("[data-retry]"),
        result: q("[data-result]"),
        resultTitle: q("[data-result-title]"),
        resultBody: q("[data-result-body]"),
        continue: q("[data-continue]"),
        progress: q("[data-progress]")
      };
      this.els.submit.addEventListener("click", () => this.onSubmit());
      this.els.retry.addEventListener("click", () => this.start());
      host.appendChild(this.root);
      this.refreshXpLabel();
      this.start();
    }
    static create(host, config, store) {
      return new _Quiz(host, config, store);
    }
    destroy() {
      this.root.remove();
    }
    // ---- attempt lifecycle -------------------------------------------------
    start() {
      this.plan = drawQuiz(this.cfg);
      this.graded = false;
      this.renderQuestions();
      this.els.result.hidden = true;
      this.els.result.classList.remove("is-pass", "is-fail");
      this.els.submit.hidden = false;
      this.els.retry.hidden = true;
      this.els.progress.textContent = this.store.hasPassed() ? fill2(this.labels.progressPassed, { n: this.plan.questions.length }) : fill2(this.labels.progressFresh, { n: this.plan.questions.length, m: this.plan.needed });
    }
    renderQuestions() {
      this.els.questions.innerHTML = "";
      this.plan.questions.forEach((question, qi) => {
        const block = document.createElement("fieldset");
        block.className = "cl-quiz-q";
        block.innerHTML = `<legend class="cl-quiz-stem"><span class="cl-quiz-num">${qi + 1}</span><span>${inline2(question.stem)}</span></legend><div class="cl-quiz-opts"></div><p class="cl-quiz-why" hidden></p>`;
        const opts = block.querySelector(".cl-quiz-opts");
        question.options.forEach((opt, oi) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "cl-quiz-opt";
          btn.innerHTML = inlineOption(opt.text);
          btn.addEventListener("click", () => {
            if (this.graded) return;
            question.chosen = oi;
            Array.prototype.forEach.call(opts.children, (c) => c.classList.remove("is-chosen"));
            btn.classList.add("is-chosen");
          });
          opts.appendChild(btn);
        });
        this.els.questions.appendChild(block);
      });
    }
    onSubmit() {
      const missing = firstUnanswered(this.plan);
      if (missing >= 0) {
        this.els.result.hidden = false;
        this.els.result.classList.remove("is-pass", "is-fail");
        this.els.resultTitle.textContent = this.labels.answerAll;
        this.els.resultBody.textContent = fill2(this.labels.stillNeeds, { n: missing + 1 });
        this.els.continue.innerHTML = "";
        const block = this.els.questions.children[missing];
        if (block) block.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      this.grade();
    }
    grade() {
      const blocks = this.els.questions.children;
      this.plan.questions.forEach((question, qi) => {
        const block = blocks[qi];
        const opts = block.querySelector(".cl-quiz-opts");
        const why = block.querySelector(".cl-quiz-why");
        question.options.forEach((opt, oi) => {
          const btn = opts.children[oi];
          btn.disabled = true;
          if (opt.correct) btn.classList.add("is-correct");
          if (oi === question.chosen && !opt.correct) btn.classList.add("is-wrong");
        });
        const right = question.chosen >= 0 && question.options[question.chosen].correct;
        if (question.why) {
          why.hidden = false;
          why.innerHTML = (right ? this.labels.correctPrefix : this.labels.notQuitePrefix) + inline2(question.why);
          why.classList.toggle("is-good", right);
          why.classList.toggle("is-bad", !right);
        }
      });
      this.graded = true;
      this.store.saveConceptResults(conceptResults(this.plan));
      this.showResult();
    }
    showResult() {
      const { score, total, passed } = scoreQuiz(this.plan);
      if (passed && !this.store.hasPassed()) {
        this.store.markPassed();
        if (this.awardAmount) this.store.addXP(this.awardAmount);
        this.refreshXpLabel();
      }
      this.els.result.hidden = false;
      this.els.result.classList.toggle("is-pass", passed);
      this.els.result.classList.toggle("is-fail", !passed);
      this.els.resultTitle.textContent = passed ? this.labels.passTitle : this.labels.failTitle;
      const xpLine = passed && this.awardAmount ? fill2(this.labels.xpLine, { xp: this.awardAmount }) : "";
      this.els.resultBody.innerHTML = fill2(this.labels.scoredLine, { score, total, needed: this.plan.needed }) + (passed ? xpLine + this.labels.passTail : this.labels.failTail);
      this.els.continue.innerHTML = "";
      if (passed && this.cfg.nextHref) {
        const link = document.createElement("a");
        link.className = "cl-quiz-btn cl-quiz-primary";
        link.href = this.cfg.nextHref;
        link.textContent = this.cfg.nextLabel || this.labels.continue;
        this.els.continue.appendChild(link);
      }
      this.els.submit.hidden = true;
      this.els.retry.hidden = false;
      this.els.progress.textContent = fill2(this.labels.progressScored, { score, total });
      this.els.result.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
    /** Report the current XP to the host, which owns any XP label. */
    refreshXpLabel() {
      this.cfg.onXpChange?.(this.store.getXP());
      const label = document.getElementById("courseXpLabel");
      if (label) label.textContent = fill2(this.labels.courseXp, { xp: this.store.getXP() });
    }
  };
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=code-lab.global.js.map