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
    DEFAULT_LOOP_MEMORIES: () => DEFAULT_LOOP_MEMORIES,
    DEFAULT_LOOP_TOOLS: () => DEFAULT_LOOP_TOOLS,
    DEFAULT_MEMORY_STORES: () => DEFAULT_MEMORY_STORES,
    DEFAULT_VIZ_LABELS: () => DEFAULT_VIZ_LABELS,
    FULL_REGIONS: () => FULL_REGIONS,
    GitGraph: () => GitGraph,
    IframeRunner: () => IframeRunner,
    MemoryViz: () => MemoryViz,
    MonacoEditor: () => MonacoEditor,
    PlainHighlighter: () => PlainHighlighter,
    PrismHighlighter: () => PrismHighlighter,
    Quiz: () => Quiz,
    ReadOnlyView: () => ReadOnlyView,
    RoslynIframeRunner: () => RoslynIframeRunner,
    TextareaEditor: () => TextareaEditor,
    Tour: () => Tour,
    VizLab: () => VizLab,
    activeStores: () => activeStores,
    agentFanRows: () => agentFanRows,
    agentLoopActiveSet: () => agentLoopActiveSet,
    atFirst: () => atFirst,
    atLast: () => atLast,
    authorOf: () => authorOf,
    computeLineFlags: () => computeLineFlags,
    conceptResults: () => conceptResults,
    counterLabel: () => counterLabel,
    defaultHighlighter: () => defaultHighlighter,
    deriveRefs: () => deriveRefs,
    drawQuiz: () => drawQuiz,
    firstUnanswered: () => firstUnanswered,
    formatToolSignature: () => formatToolSignature,
    gitLayout: () => layout,
    goTo: () => goTo,
    loadMonaco: () => loadMonaco,
    makeTour: () => makeTour,
    markedLineHtml: () => markedLineHtml,
    membersOf: () => membersOf,
    neededToPass: () => neededToPass,
    next: () => next,
    normalizeLines: () => normalizeLines,
    planProgress: () => planProgress,
    presentRun: () => presentRun,
    prev: () => prev,
    receiverBefore: () => receiverBefore,
    referencedIds: () => referencedIds,
    renderErrorPanel: () => renderErrorPanel,
    resolveMarks: () => resolveMarks,
    resolveModel: () => resolveModel,
    resolvePlan: () => resolvePlan,
    resolveRackTools: () => resolveRackTools,
    resolveRetrieval: () => resolveRetrieval,
    resolveTranscript: () => resolveTranscript,
    scanCSharp: () => scanCSharp,
    scoreQuiz: () => scoreQuiz,
    selectRunCode: () => selectRunCode,
    shelfStores: () => shelfStores,
    showErrorPanel: () => showErrorPanel,
    shuffleQuiz: () => shuffle,
    spansForLine: () => spansForLine,
    splitCodeLines: () => splitCodeLines,
    stripCommentsAndStrings: () => stripCommentsAndStrings,
    toolRackRows: () => toolRackRows,
    traceToSteps: () => traceToSteps
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
  function normalizeLines(lines) {
    if (lines === void 0 || lines === null) return [];
    const list = Array.isArray(lines) ? lines : [lines];
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
    normalizeLines(lines) {
      return normalizeLines(lines);
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
      const lines = splitCodeLines(code);
      this.codePane.innerHTML = "";
      this.state.lineEls = lines.map((text, i) => {
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
        bracketPairColorization: { enabled: true }
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
  function bareType(raw) {
    return raw.replace(/<.*>/, "").replace(/\[[\s,]*\]/g, "").replace(/\?$/, "").trim();
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
  function takeDeclaration(stmt, push, blockFollows) {
    const text = stmt.replace(/\s+/g, " ").trim();
    if (!text) return;
    if (/^\[/.test(text)) return;
    const isStatic = /\bstatic\b/.test(text);
    const method = text.match(/([A-Za-z_][A-Za-z0-9_<>,.\[\]\?]*)\s+([A-Za-z_][A-Za-z0-9_]*)\s*(<[^>]*>)?\s*\(([^)]*)\)\s*$/);
    if (method) {
      const name = method[2];
      if (!NOT_A_DECLARATION.has(name) && !MODIFIERS.has(name)) {
        const ret = bareType(method[1]);
        push({ name, kind: "method", type: ret, isStatic, detail: `${ret} ${name}(${method[4].trim()})` });
        return;
      }
    }
    const ctor = text.match(/^(?:[a-z]+\s+)*([A-Z][A-Za-z0-9_]*)\s*\(([^)]*)\)\s*$/);
    if (ctor && blockFollows) return;
    if (blockFollows) {
      const prop = text.match(/([A-Za-z_][A-Za-z0-9_<>,.\[\]\?]*)\s+([A-Za-z_][A-Za-z0-9_]*)\s*$/);
      if (prop) {
        const name = prop[2];
        if (!NOT_A_DECLARATION.has(name) && !MODIFIERS.has(name) && !TYPE_KEYWORDS.has(name)) {
          const t = bareType(prop[1]);
          push({ name, kind: "property", type: t, isStatic, detail: `${t} ${name} { get; set; }` });
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
      if (isIdent(name) && !types.some((t) => t.name === name)) types.push({ name, kind, members });
    }
    const seenVar = /* @__PURE__ */ new Set();
    const varRe = /\bvar\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*new\s+([A-Za-z_][A-Za-z0-9_<>,.\[\]]*)/g;
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
  function membersOf(symbols, receiver) {
    if (!receiver) return null;
    const asType = symbols.types.find((t2) => t2.name === receiver);
    if (asType) {
      const statics = asType.members.filter((mm) => mm.isStatic || mm.kind === "enumMember");
      return statics.length ? statics : null;
    }
    const v = symbols.vars.find((x) => x.name === receiver);
    if (!v || !v.type) return null;
    const t = symbols.types.find((x) => x.name === v.type);
    if (!t) return null;
    const instance = t.members.filter((mm) => !mm.isStatic && mm.kind !== "enumMember");
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
      { label: "foreach", insert: "foreach (var ${1:item} in ${2:items})\n{\n    $0\n}", doc: "Foreach loop" }
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
          const own = membersOf(scanned, receiver);
          if (!own) return { suggestions: [] };
          return {
            suggestions: own.map((m) => ({
              label: m.name,
              kind: memberKind(m),
              detail: m.detail,
              insertText: m.kind === "method" ? `${m.name}($0)` : m.name,
              insertTextRules: m.kind === "method" ? R : void 0,
              range
            }))
          };
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
          reject(new Error("The code runner took too long to load."));
        }, this.readyTimeout);
        const ready = (event) => {
          if (event.origin !== window.location.origin) return;
          if ((event.data || {}).type !== "coderunner:ready") return;
          window.removeEventListener("message", ready);
          clearTimeout(timer);
          resolve();
        };
        window.addEventListener("message", ready);
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
    fanCaption: "Probability of the next token"
  };
  function deriveRefs(stack = []) {
    const refs = [];
    for (const frame of stack) {
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
  function svgEl(tag, attrs) {
    const node = document.createElementNS(SVG_NS, tag);
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
        el.innerHTML = `<div class="cl-mv-oname">${o.type} <span style="color:#94a3b8">@${o.at ?? "heap"}</span></div>` + (o.fields ?? []).map((field) => {
          const hot = (o.hotFields ?? []).includes(field[0]);
          return `<div class="cl-mv-field${hot ? " is-hot" : ""}">${field[0]} = ${field[1]}</div>`;
        }).join("");
        return el;
      };
      const regionHtml = regions.map((name) => {
        const d = REGIONS[name];
        const tag = tagOverrides[name] ?? d.tag;
        return `<div class="cl-mv-region ${d.cls}" data-region="${name}"${d.regionAttr ? " " + d.regionAttr : ""}><span class="cl-mv-tag">${tag}</span>${d.body}</div>`;
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
        const lines = model.code ?? this.code;
        const pc = model.pc ?? -1;
        this.el.querySelector("[data-codepanel]").classList.toggle("dimmed", !model.codeLive);
        if (this.codeList.children.length !== lines.length) {
          this.codeList.innerHTML = "";
          for (let i = 0; i < lines.length; i++) this.codeList.appendChild(document.createElement("li"));
        }
        Array.from(this.codeList.children).forEach((li, i) => {
          const line = lines[i] ?? "";
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
      const lines = ctx.model.code ?? this.code;
      const pc = ctx.model.pc ?? -1;
      const pcChanged = pc !== this.lastPc;
      this.el.classList.toggle("dimmed", !ctx.model.codeLive);
      if (this.list.children.length !== lines.length) {
        this.list.innerHTML = "";
        for (let i = 0; i < lines.length; i++) this.list.appendChild(document.createElement("li"));
      }
      Array.from(this.list.children).forEach((li, i) => {
        const line = lines[i] ?? "";
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

  // src/dom/heapcards-view.ts
  var HeapCardsView = class {
    constructor(uid) {
      // Arrow paths reused across renders (keyed "from->to"), so a reference that
      // stays put keeps its path and only its geometry updates - no flicker.
      this.refPaths = /* @__PURE__ */ new Map();
      // Bumped each render; the redraw loop stops once its generation is stale.
      this.arrowGen = 0;
      this.markerId = `clmv-hp-ah-${uid}`;
      this.el = document.createElement("div");
      this.el.className = "cl-mv-region cl-mv-heapcards";
      this.el.innerHTML = `<span class="cl-mv-tag">MEMORY <span>\xB7 the call stack on the left, objects on the heap on the right</span></span><div class="cl-mv-hp-statics" data-hpstatics></div><div class="cl-mv-hp-cols"><div class="cl-mv-hp-roots" data-hproots></div><div class="cl-mv-hp-objs" data-hpobjs></div><svg class="cl-mv-hp-arrows"><defs><marker id="${this.markerId}" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill="#2563eb" stroke="none" /></marker></defs></svg></div>`;
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
      this.statics.innerHTML = staticsHtml(model.globals ?? [], model.rodata ?? []);
      const stack = model.stack ?? [];
      const frames = stack.map((f, i) => ({ ...f, active: i === stack.length - 1 }));
      reconcile(this.roots, frames, frameNode);
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
  function staticsHtml(globals, rodata) {
    return [
      globals.length ? staticGroupHtml("STATICS", "values shared across the program", globals, true) : "",
      rodata.length ? staticGroupHtml("CONSTANTS", "fixed at compile time", rodata, false) : ""
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
  function kindLabel(kind) {
    switch (kind) {
      case "entry":
        return "entry point";
      case "static":
        return "static method";
      case "method":
        return "instance method";
      case "ctor":
        return "constructor";
      default:
        return "";
    }
  }
  function frameNode(f, existing) {
    const el = existing ?? document.createElement("div");
    el.className = "cl-mv-hp-frame" + (f.active ? " is-active" : " is-caller");
    const label = kindLabel(f.kind);
    const badge = label ? `<span class="cl-mv-hp-fkind">${esc3(label)}</span>` : "";
    const recv = f.recv ? `<div class="cl-mv-hp-frecv">on ${esc3(f.recv)}</div>` : "";
    const paused = !f.active && typeof f.line === "number" ? `<div class="cl-mv-hp-fpaused">paused at line ${f.line}</div>` : "";
    const rows = (f.vars ?? []).map(rowHtml3).join("");
    el.innerHTML = `<div class="cl-mv-hp-fname"><span class="cl-mv-hp-fn">${esc3(f.name ?? f.id)}</span>${badge}</div>` + recv + paused + `<div class="cl-mv-hp-rows">${rows}</div>`;
    return el;
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
    const no = typeof o.no === "number" ? ` <span class="cl-mv-hp-no">#${o.no}</span>` : "";
    const fields = (o.fields ?? []).map((field) => {
      const isHot = (o.hotFields ?? []).includes(field[0]);
      return `<div class="cl-mv-hp-field${isHot ? " is-hot" : ""}"><span class="cl-mv-hp-fkey">${esc3(field[0])}</span><span class="cl-mv-hp-fval">${esc3(field[1])}</span></div>`;
    }).join("");
    el.innerHTML = `<div class="cl-mv-hp-type">${esc3(o.type)}${no}</div>` + fields;
    return el;
  }
  function esc3(s) {
    return s.replace(/[&<>]/g, (c) => c === "&" ? "&amp;" : c === "<" ? "&lt;" : "&gt;");
  }

  // src/core/narration.ts
  function escapeHtml4(text) {
    return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function inline(text) {
    return escapeHtml4(text).replace(/`([^`]+)`/g, "<code>$1</code>").split(/(<code>[\s\S]*?<\/code>)/).map(
      (seg) => seg.startsWith("<code>") ? seg : seg.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\*([^*]+)\*/g, "<em>$1</em>")
    ).join("");
  }
  function renderNarration(text) {
    const lines = String(text ?? "").split("\n");
    let html = "";
    let bullets = [];
    const flush = () => {
      if (bullets.length) {
        html += "<ul>" + bullets.map((b) => `<li>${inline(b)}</li>`).join("") + "</ul>";
        bullets = [];
      }
    };
    for (const raw of lines) {
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
    constructor() {
      this.el = document.createElement("div");
      this.el.className = "cl-mv-console";
      this.el.innerHTML = `<div class="cl-mv-console-head">Console</div><pre class="cl-mv-console-body" data-out></pre>`;
      this.body = this.el.querySelector("[data-out]");
    }
    sync(ctx) {
      const output = ctx.model.output ?? "";
      const printed = ctx.model.printed ?? "";
      if (output === "") {
        this.body.innerHTML = `<span class="cl-mv-console-idle">Nothing printed yet.</span>`;
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

  // src/dom/viz-controls.ts
  var DEFAULT_LEGEND = [
    { sw: "#37d3a6", label: "data in RAM" },
    { sw: "#2b6a5b", label: "active CPU core" },
    { sw: "#ffd479", label: "signal on the bus", round: true },
    { sw: "#2563eb", label: "stack frame (a call)" },
    { sw: "#1f6f5f", label: "reference to an object", round: true }
  ];
  var SVG_NS3 = "http://www.w3.org/2000/svg";
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
        const line = document.createElementNS(SVG_NS3, "polyline");
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
        heapcards: (_spec, ctx) => new HeapCardsView(ctx.uid),
        narration: (_spec, ctx) => new NarrationView(ctx.vizLabels),
        console: () => new ConsoleView(),
        agent: (spec, ctx) => new AgentView(spec.fan, ctx.vizLabels),
        agentloop: () => new AgentLoopView(),
        memoryshelf: () => new MemoryShelfView(),
        toolrack: (_spec, ctx) => new ToolRackView(ctx.vizLabels),
        transcript: (_spec, ctx) => new TranscriptView(ctx.vizLabels),
        retrieval: () => new RetrievalView(),
        planboard: () => new PlanboardView(),
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

  // src/core/exec-tracer-model.ts
  function traceToSteps(trace) {
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
        narr: describeStep(prevFrames, ts, stack, heap, prevHeapIds, globals, printed, src),
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
        narr: trace.truncated ? "Stopped early - there were too many steps to show the rest." : printedLines > 0 ? `The program finished. It printed ${printedLines} line${printedLines === 1 ? "" : "s"}.` : "The program finished without printing anything.",
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
      return slot;
    });
    const frame = { id: f.id, name: f.name, vars };
    if (f.kind) frame.kind = f.kind;
    if (f.recv) frame.recv = f.recv;
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
  function describeStep(prevFrames, ts, stack, heap, prevHeapIds, globals, printed, src) {
    const curFrames = ts.frames ?? [];
    const prevLen = prevFrames.length;
    const curLen = curFrames.length;
    if (curLen > prevLen) return callNarration(curFrames[curLen - 1]);
    if (curLen < prevLen) return returnNarration(prevFrames[prevLen - 1], curFrames[curLen - 1]);
    if (printed) return printedNarration(printed);
    const topFrame = stack[stack.length - 1];
    const hotSlot = topFrame ? topFrame.vars.find((v) => v.hot) : void 0;
    const created = heap.find((o) => !prevHeapIds.has(o.id));
    if (created && hotSlot && hotSlot.ref != null && hotSlot.ref === created.id) {
      return "Set `" + hotSlot.k + "` to a new `" + created.type + "`";
    }
    if (created) {
      const label = typeof created.no === "number" ? `${created.type} #${created.no}` : created.type;
      return typeof created.no === "number" ? "Created a `" + created.type + "` (`" + label + "`)" : "Created a `" + created.type + "`";
    }
    if (hotSlot) {
      if (hotSlot.ref != null) return "Pointed `" + hotSlot.k + "` at `" + heapLabel(hotSlot.ref, heap) + "`";
      return "Set `" + hotSlot.k + "` to `" + (hotSlot.v ?? "") + "`";
    }
    const g = globals.find((s) => s.hot);
    if (g) return "Set `" + g.k + "` to `" + g.v + "`";
    return runningNarration(ts.line, src);
  }
  function callNarration(top) {
    if (top.kind === "entry") return "Entered `" + (top.name || "Main") + "`";
    if (top.kind === "ctor") {
      const type = (top.name || "").replace(/^new\s+/, "") || "object";
      return "Called the `" + type + "` constructor";
    }
    const m = methodLabel(top);
    return top.recv ? "Called `" + m + "` on `" + top.recv + "`" : "Called `" + m + "`";
  }
  function returnNarration(left, back) {
    const backName = back ? back.name : null;
    if (left.kind === "ctor") {
      const type = (left.name || "").replace(/^new\s+/, "") || "object";
      return backName ? "The `" + type + "` constructor finished - back in `" + backName + "`" : "The `" + type + "` constructor finished";
    }
    const m = methodLabel(left);
    return backName ? "`" + m + "` returned to `" + backName + "`" : "`" + m + "` returned";
  }
  function methodLabel(f) {
    const name = f.name || "?";
    return name.endsWith(")") ? name : name + "()";
  }
  function printedNarration(printed) {
    const parts = printed.replace(/\n+$/, "").split("\n");
    const first = (parts[0] ?? "").replace(/`/g, "");
    if (first === "") return "Printed a blank line";
    const shown = parts.length > 1 ? first + " \u2026" : first;
    return "Printed `" + shown + "`";
  }
  function heapLabel(ref, heap) {
    const o = heap.find((h) => h.id === ref);
    if (!o) return "an object";
    return typeof o.no === "number" ? `${o.type} #${o.no}` : o.type;
  }
  function runningNarration(line, src) {
    const text = typeof line === "number" && line > 0 ? (src[line - 1] ?? "").trim() : "";
    if (!text) return "Running the program.";
    return "Running this line: `" + text + "`";
  }

  // src/dom/error-panel.ts
  var DEFAULT_LABELS2 = {
    heading: "Let's fix this first",
    note: "Often a single early mistake (a missing or extra { } ( ) ;) is enough to confuse the rest. Fix the top one first, then run again."
  };
  function locText(e) {
    if (e.line == null) return "";
    return e.column != null ? `Line ${e.line}, col ${e.column}` : `Line ${e.line}`;
  }
  function renderErrorPanel(errors, labels = {}) {
    const l = { ...DEFAULT_LABELS2, ...labels };
    const section = document.createElement("section");
    section.className = "cl-errors";
    const heading = document.createElement("h3");
    heading.textContent = l.heading;
    section.appendChild(heading);
    const note = document.createElement("p");
    note.className = "cl-errors-note";
    note.textContent = l.note;
    section.appendChild(note);
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
      list.appendChild(li);
    }
    section.appendChild(list);
    return section;
  }
  function showErrorPanel(host, errors, labels) {
    host.textContent = "";
    if (!errors || errors.length === 0) {
      host.hidden = true;
      return false;
    }
    host.appendChild(renderErrorPanel(errors, labels));
    host.hidden = false;
    return true;
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
      this.legend = config.legend;
      this.language = config.language ?? "csharp";
      this.runner = new IframeRunner({
        url: config.runnerUrl,
        readyTimeout: config.readyTimeout ?? 18e4
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
      this.vizBtn.textContent = "Preparing compiler...";
      this.vizBtn.disabled = true;
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
      this.showHint("Write a small program, then press Visualize to watch it run.");
      this.root.append(editorPane, this.stage);
      host.appendChild(this.root);
      void this.boot(config.starter ?? DEFAULT_STARTER);
    }
    static create(host, config) {
      return new _VizLab(host, config);
    }
    async boot(starter) {
      await loadMonaco();
      await this.editor.mount(this.editorHost, {
        value: starter,
        language: this.language,
        readOnly: false,
        autoHeight: { minHeight: 220, maxHeight: 640 }
      });
      try {
        await this.runner.warm();
      } catch {
      } finally {
        this.ready = true;
        this.vizBtn.disabled = false;
        this.vizBtn.textContent = "Visualize";
      }
    }
    async visualize() {
      if (!this.ready) return;
      const code = this.editor.getValue();
      this.vizBtn.disabled = true;
      this.vizBtn.textContent = "Tracing...";
      this.setStatus("");
      try {
        const outcome = await this.runner.trace(code);
        if (!outcome.compiled) {
          const errors = normalizeErrors(outcome.errors);
          this.showErrors(errors);
          this.setStatus("Did not compile.");
          if (this.editor.setMarkers) this.editor.setMarkers(errors);
          return;
        }
        if (this.editor.setMarkers) this.editor.setMarkers([]);
        if (!outcome.trace || outcome.trace.steps.length === 0) {
          this.showHint("That program produced no steps to show. Add a statement or two inside Main.");
          this.setStatus("Nothing to trace.");
          return;
        }
        this.lastTrace = outcome.trace;
        this.lastSteps = traceToSteps(outcome.trace);
        this.render();
        const n = Math.max(0, this.lastSteps.length - 1);
        let msg = `Traced ${n} step${n === 1 ? "" : "s"}.`;
        if (outcome.trace.truncated) msg += " Stopped early - the program ran too long.";
        if (outcome.runtimeError) msg += ` It threw: ${outcome.runtimeError}`;
        this.setStatus(msg);
      } catch (err) {
        this.showHint("The tracer took too long or could not load. Try again.");
        this.setStatus(String(err.message || err));
      } finally {
        this.vizBtn.disabled = false;
        this.vizBtn.textContent = "Visualize";
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
    destroy() {
      this.teardownViz();
      this.editor.destroy();
      this.runner.destroy();
      this.root.remove();
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
      const commit = state.commits.get(id);
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
      const parents = commit.parents;
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

  // src/dom/git-graph-view.ts
  var SVG_NS4 = "http://www.w3.org/2000/svg";
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
  function headCommit2(state) {
    if (state.head.kind === "detached") return state.head.commit;
    return state.refs.get(state.head.name) ?? null;
  }
  var GitGraph = class {
    constructor() {
      this.state = null;
      this.handlers = [];
      // Diff bookkeeping across renders, so only NEW nodes/edges animate.
      this.prevNodeIds = /* @__PURE__ */ new Set();
      this.prevEdgeKeys = /* @__PURE__ */ new Set();
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
        if (commitEl) this.emit({ commit: commitEl.dataset?.commit });
      };
    }
    // --- lifecycle ---------------------------------------------------------
    mount(host, opts) {
      this.root = document.createElement("div");
      this.root.className = "cl-git";
      this.graphWrap = document.createElement("div");
      this.graphWrap.className = "cl-git-graph";
      this.svg = document.createElementNS(SVG_NS4, "svg");
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
      this.root.append(this.graphWrap, this.buildWorkArea());
      this.root.addEventListener("click", this.onClick);
      host.appendChild(this.root);
      this.state = opts.state;
      this.render(false);
    }
    setState(state, opts) {
      this.state = state;
      this.render(opts?.animate ?? false);
    }
    on(event, handler) {
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
      this.prevNodeIds = newNodeIds;
      this.prevEdgeKeys = newEdgeKeys;
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
        const path = svgEl("path", {
          d,
          class: isNew ? "cl-git-edge cl-git-edge-draw" : "cl-git-edge",
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
        const isNew = animate && !this.prevNodeIds.has(node.id);
        const group = svgEl("g", {
          class: isNew ? "cl-git-node cl-git-appear" : "cl-git-node",
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
        const commit = state.commits.get(node.id);
        const msg = svgEl("text", { x, y: y + 41, class: "cl-git-msg", "text-anchor": "middle" });
        msg.textContent = commit?.message ?? "";
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
      for (const [commit, bucket] of byCommit) {
        const pos = posOf.get(commit);
        if (!pos) continue;
        const stack = document.createElement("div");
        stack.className = "cl-git-chipstack";
        stack.style.left = `${pos.x}px`;
        stack.style.top = `${pos.y - 30}px`;
        for (const chip of bucket) {
          const pill = document.createElement("button");
          pill.type = "button";
          pill.className = `cl-git-chip is-${chip.kind}`;
          pill.textContent = chip.label;
          if (chip.kind === "branch") {
            pill.style.background = laneVar(laneOf.get(commit) ?? 0);
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
      this.headEl.title = head.on ? `HEAD -> ${head.on}` : "HEAD (detached)";
      this.headEl.classList.toggle("is-detached", head.on === void 0);
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
      const tree = [...state.worktree.keys()].sort();
      const staged = [...state.index.keys()].sort();
      const committed = this.reachablePaths(state);
      for (const p of tree) committed.delete(p);
      for (const p of staged) committed.delete(p);
      const repo = [...committed].sort();
      const nextZoneOf = /* @__PURE__ */ new Map();
      this.fillZone("tree", tree, nextZoneOf, animate);
      this.fillZone("index", staged, nextZoneOf, animate);
      this.fillZone("repo", repo, nextZoneOf, animate);
      this.prevZoneOf = nextZoneOf;
    }
    fillZone(zone, paths, nextZoneOf, animate) {
      const body = this.zoneBodies[zone];
      body.replaceChildren();
      for (const path of paths) {
        nextZoneOf.set(path, zone);
        const moved = animate && this.prevZoneOf.get(path) !== zone;
        const row = document.createElement("div");
        row.className = moved ? "cl-git-file is-moved" : "cl-git-file";
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
      const start = headCommit2(state);
      const paths = /* @__PURE__ */ new Set();
      if (start === null) return paths;
      const seen = /* @__PURE__ */ new Set();
      const stack = [start];
      while (stack.length) {
        const id = stack.pop();
        if (seen.has(id)) continue;
        seen.add(id);
        const commit = state.commits.get(id);
        if (!commit) continue;
        for (const p of commit.paths) paths.add(p);
        for (const parent of commit.parents) stack.push(parent);
      }
      return paths;
    }
  };

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
  function fill(tpl, vars) {
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
      this.els.progress.textContent = this.store.hasPassed() ? fill(this.labels.progressPassed, { n: this.plan.questions.length }) : fill(this.labels.progressFresh, { n: this.plan.questions.length, m: this.plan.needed });
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
        this.els.resultBody.textContent = fill(this.labels.stillNeeds, { n: missing + 1 });
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
      const xpLine = passed && this.awardAmount ? fill(this.labels.xpLine, { xp: this.awardAmount }) : "";
      this.els.resultBody.innerHTML = fill(this.labels.scoredLine, { score, total, needed: this.plan.needed }) + (passed ? xpLine + this.labels.passTail : this.labels.failTail);
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
      this.els.progress.textContent = fill(this.labels.progressScored, { score, total });
      this.els.result.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
    /** Report the current XP to the host, which owns any XP label. */
    refreshXpLabel() {
      this.cfg.onXpChange?.(this.store.getXP());
      const label = document.getElementById("courseXpLabel");
      if (label) label.textContent = fill(this.labels.courseXp, { xp: this.store.getXP() });
    }
  };
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=code-lab.global.js.map