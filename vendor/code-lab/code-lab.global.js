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
    FULL_REGIONS: () => FULL_REGIONS,
    MemoryViz: () => MemoryViz,
    MonacoEditor: () => MonacoEditor,
    PlainHighlighter: () => PlainHighlighter,
    PrismHighlighter: () => PrismHighlighter,
    Quiz: () => Quiz,
    ReadOnlyView: () => ReadOnlyView,
    RoslynIframeRunner: () => RoslynIframeRunner,
    TextareaEditor: () => TextareaEditor,
    Tour: () => Tour,
    atFirst: () => atFirst,
    atLast: () => atLast,
    computeLineFlags: () => computeLineFlags,
    counterLabel: () => counterLabel,
    defaultHighlighter: () => defaultHighlighter,
    deriveRefs: () => deriveRefs,
    drawQuiz: () => drawQuiz,
    firstUnanswered: () => firstUnanswered,
    goTo: () => goTo,
    loadMonaco: () => loadMonaco,
    makeTour: () => makeTour,
    markedLineHtml: () => markedLineHtml,
    neededToPass: () => neededToPass,
    next: () => next,
    normalizeLines: () => normalizeLines,
    presentRun: () => presentRun,
    prev: () => prev,
    referencedIds: () => referencedIds,
    renderErrorPanel: () => renderErrorPanel,
    resolveMarks: () => resolveMarks,
    resolveModel: () => resolveModel,
    scoreQuiz: () => scoreQuiz,
    selectRunCode: () => selectRunCode,
    showErrorPanel: () => showErrorPanel,
    shuffleQuiz: () => shuffle,
    spansForLine: () => spansForLine,
    splitCodeLines: () => splitCodeLines
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
    // eslint-disable-line @typescript-eslint/no-explicit-any
    constructor(config = {}) {
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

  // src/editors/load-monaco.ts
  var DEFAULT_BASE = "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs";
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
        const suggestions = [];
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
  var RoslynIframeRunner = class {
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
      if (data.type === "coderunner:result" && data.id != null && this.pending.has(data.id)) {
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
        this.pending.set(id, { resolve, reject, timer });
        this.iframe.contentWindow.postMessage(
          { type: "coderunner:run", id, code },
          window.location.origin
        );
      });
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

  // src/core/memory-model.ts
  var ALL_REGIONS = ["code", "global", "stack", "heap"];
  var FULL_REGIONS = ["code", "rodata", "data", "bss", "heap", "stack", "mmap"];
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
    }
  };

  // src/core/narration.ts
  function escapeHtml4(text) {
    return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function inline(text) {
    return escapeHtml4(text).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
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
    constructor() {
      this.el = document.createElement("div");
      this.el.className = "cl-mv-narr";
      this.el.innerHTML = `<span class="cl-mv-stepno" data-stepno></span><div class="cl-mv-narr-body" data-narr></div>`;
    }
    sync(ctx) {
      this.set(ctx.model.narr ?? "", `STEP ${ctx.index + 1} / ${ctx.total}`);
    }
    set(text, stepLabel) {
      this.el.querySelector("[data-narr]").innerHTML = renderNarration(text);
      this.el.querySelector("[data-stepno]").textContent = stepLabel;
    }
  };

  // src/dom/viz-controls.ts
  var VizControls = class {
    constructor(actions, handlers, nextHref) {
      this.nextHref = nextHref;
      this.el = document.createElement("div");
      this.el.innerHTML = `
      <div class="cl-mv-controls">
        <button data-c="prev">\u25C0 Prev</button>
        <button data-c="play" class="cl-mv-primary">\u25B6 Play</button>
        <button data-c="next" class="cl-mv-primary">Next \u25B6</button>
        <button data-c="reset">Reset</button>
        <span class="cl-mv-spacer"></span>
        <div class="cl-mv-textsize" role="group" aria-label="Text size">
          <span class="cl-mv-aa" aria-hidden="true">Aa</span>
          <button data-size="0.9" title="Small text" aria-label="Small text">S</button>
          <button data-size="1" title="Default text" aria-label="Default text">M</button>
          <button data-size="1.2" title="Large text" aria-label="Large text">L</button>
        </div>
      </div>
      <input type="range" class="cl-mv-scrub" data-scrub min="0" value="0" step="1" aria-label="Step" />
      <div class="cl-mv-legend">
        <span><i class="cl-mv-sw" style="background:#37d3a6"></i>data in RAM</span>
        <span><i class="cl-mv-sw" style="background:#2b6a5b"></i>active CPU core</span>
        <span><i class="cl-mv-sw" style="background:#ffd479;border-radius:50%"></i>signal on the bus</span>
        <span><i class="cl-mv-sw" style="background:#2563eb"></i>stack frame (a call)</span>
        <span><i class="cl-mv-sw" style="background:#1f6f5f;border-radius:50%"></i>reference to an object</span>
      </div>`;
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
    update(state) {
      this.el.querySelector('[data-c="prev"]').disabled = state.atStart;
      const next2 = this.el.querySelector('[data-c="next"]');
      if (state.atEnd && this.nextHref) {
        next2.disabled = false;
        next2.textContent = "Next lesson \u25B6";
      } else {
        next2.disabled = state.atEnd;
        next2.textContent = "Next \u25B6";
      }
      const scrub = this.el.querySelector("[data-scrub]");
      scrub.max = String(Math.max(0, state.total - 1));
      scrub.value = String(state.index);
    }
    setPlaying(playing) {
      this.el.querySelector('[data-c="play"]').textContent = playing ? "\u23F8 Pause" : "\u25B6 Play";
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
      this.timer = null;
      this.playing = false;
      this.scale = 1;
      this.awarded = false;
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
      this.awardedKey = config.awardedKey;
      this.xpKey = config.xpKey ?? "course_global_xp";
      this.awardAmount = typeof config.awardAmount === "number" ? config.awardAmount : 20;
      this.player = new VizPlayer(config.steps ?? [], {
        deriveRefs: config.deriveRefs !== false,
        autoDim: config.autoDim !== false
      });
      this.scale = config.fontScale ?? 1;
      const handlers = {
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
        onPlay: () => this.timer ? this.stop() : this.play(),
        onAction: (i) => this.runAction(i),
        onFontSize: (s) => this.setFont(s),
        onSeek: (i) => {
          this.stop();
          this.step(this.player.goTo(i), false);
        }
      };
      const buildCtx = {
        uid,
        code: config.code ?? [],
        labels: {
          chipName: config.chipName ?? "LPDDR5 RAM",
          chipAddr: config.chipAddr ?? "address space  0x0000 \u2192 0xFFFF"
        },
        regions,
        zoomTab,
        actions: this.actions,
        handlers,
        regionTags: config.regionTags ?? {},
        nextHref: this.nextHref
      };
      const layout = config.layout ?? {
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
      const visualCol = document.createElement("div");
      visualCol.className = "cl-mv-visual";
      (layout.visual ?? []).forEach((spec) => {
        const p = this.makePanel(spec, buildCtx);
        this.panels.push(p);
        visualCol.appendChild(p.el);
      });
      const asideCol = document.createElement("div");
      asideCol.className = "cl-mv-aside";
      (layout.aside ?? []).forEach((spec) => {
        const p = this.makePanel(spec, buildCtx);
        this.panels.push(p);
        asideCol.appendChild(p.el);
      });
      this.root.append(visualCol);
      if (asideCol.childElementCount > 0) this.root.append(asideCol);
      else this.root.classList.add("cl-mv-single");
      host.appendChild(this.root);
      if (this.controls) this.controls.setActiveSize(this.scale);
      window.addEventListener("resize", this.onResize);
      this.refreshXp();
      this.step(this.player.state, false);
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
      switch (spec.type) {
        case "board":
          return new BoardView(ctx.uid);
        case "die":
          return new MemoryDieView(ctx.uid, ctx.code, ctx.labels, spec.regions ?? ctx.regions, ctx.zoomTab, ctx.regionTags);
        case "code":
          return new CodePanel(ctx.code);
        case "narration":
          return new NarrationView();
        case "controls": {
          this.controls = new VizControls(ctx.actions, ctx.handlers, ctx.nextHref);
          return this.controls;
        }
        default:
          throw new Error("MemoryViz: unknown panel type " + String(spec.type));
      }
    }
    // ---- orchestration ----------------------------------------------------
    step(state, animate = true) {
      if (this.controls) this.controls.resetActions();
      this.syncAll(state);
      if (animate) this.animateAll(state);
      if (state.atEnd) {
        this.stop();
        this.markComplete();
      }
    }
    /** Refresh the course XP label in the hero, if the page has one. */
    refreshXp() {
      const label = document.getElementById("courseXpLabel");
      if (label) label.textContent = `Course XP: ${this.storedXp()}`;
    }
    storedXp() {
      return parseInt(localStorage.getItem(this.xpKey) || "0", 10);
    }
    /** Mark the lesson complete and grant XP once, when the last step is reached. */
    markComplete() {
      if (this.awarded || !this.awardedKey) return;
      this.awarded = true;
      try {
        const done = JSON.parse(localStorage.getItem(this.awardedKey) || "{}");
        if (!done.done) {
          localStorage.setItem(this.awardedKey, JSON.stringify({ done: true }));
          localStorage.setItem(this.xpKey, String(this.storedXp() + this.awardAmount));
        }
        this.refreshXp();
      } catch {
      }
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
      this.playing = true;
      this.controls.setPlaying(true);
      if (this.player.state.atEnd) this.step(this.player.reset(), false);
      this.scheduleAdvance();
    }
    /** Hold each step long enough to read its narration at ~300 words/minute. */
    scheduleAdvance() {
      this.timer = setTimeout(() => {
        if (!this.playing) return;
        if (this.player.state.atEnd) return this.stop();
        this.step(this.player.next());
        if (this.player.state.atEnd) this.stop();
        else this.scheduleAdvance();
      }, this.stepDurationMs());
    }
    stepDurationMs() {
      const words = (this.player.state.model.narr ?? "").trim().split(/\s+/).filter(Boolean).length;
      const readMs = words / WORDS_PER_MINUTE * 6e4;
      return Math.max(MIN_STEP_MS, Math.round(readMs) + 500);
    }
    stop() {
      this.playing = false;
      if (this.timer) clearTimeout(this.timer);
      this.timer = null;
      if (this.controls) this.controls.setPlaying(false);
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

  // src/dom/quiz-view.ts
  function localStore(xpKey, awardedKey) {
    const read = () => {
      try {
        return JSON.parse(localStorage.getItem(awardedKey) || "{}");
      } catch {
        return {};
      }
    };
    return {
      hasPassed: () => Boolean(read().passed),
      markPassed: () => localStorage.setItem(awardedKey, JSON.stringify({ passed: true })),
      getXP: () => parseInt(localStorage.getItem(xpKey) || "0", 10),
      addXP: (amount) => localStorage.setItem(xpKey, String(parseInt(localStorage.getItem(xpKey) || "0", 10) + amount))
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
      this.root = document.createElement("section");
      this.root.className = "cl-quiz";
      this.root.setAttribute("aria-live", "polite");
      this.root.innerHTML = `
      <header class="cl-quiz-head">
        <p class="cl-quiz-meta">${escapeHtml5(config.metaLabel || "")}</p>
        <h2 class="cl-quiz-title">${escapeHtml5(config.title || "Knowledge check")}</h2>
        <p class="cl-quiz-intro">${inline2(config.intro || "")}</p>
        <span class="cl-quiz-progress" data-progress></span>
      </header>
      <div class="cl-quiz-questions" data-questions></div>
      <div class="cl-quiz-actions">
        <button type="button" class="cl-quiz-btn cl-quiz-primary" data-submit>Submit answers</button>
        <button type="button" class="cl-quiz-btn" data-retry hidden>Try a fresh set</button>
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
      this.els.progress.textContent = this.store.hasPassed() ? `Passed before \xB7 ${this.plan.questions.length} questions` : `${this.plan.questions.length} questions \xB7 ${this.plan.needed} to pass`;
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
        this.els.resultTitle.textContent = "Answer every question";
        this.els.resultBody.textContent = `Question ${missing + 1} still needs an answer.`;
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
          why.innerHTML = (right ? "Correct. " : "Not quite. ") + inline2(question.why);
          why.classList.toggle("is-good", right);
          why.classList.toggle("is-bad", !right);
        }
      });
      this.graded = true;
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
      this.els.resultTitle.textContent = passed ? "Checkpoint passed" : "Not passed yet";
      const xpLine = passed && this.awardAmount ? ` +${this.awardAmount} XP.` : "";
      this.els.resultBody.innerHTML = `You scored <strong>${score} / ${total}</strong> - ${this.plan.needed} needed to pass.` + (passed ? xpLine + " The explanations below cover anything you missed." : " Read the explanations below, then try a fresh set of questions.");
      this.els.continue.innerHTML = "";
      if (passed && this.cfg.nextHref) {
        const link = document.createElement("a");
        link.className = "cl-quiz-btn cl-quiz-primary";
        link.href = this.cfg.nextHref;
        link.textContent = this.cfg.nextLabel || "Continue";
        this.els.continue.appendChild(link);
      }
      this.els.submit.hidden = true;
      this.els.retry.hidden = false;
      this.els.progress.textContent = `Scored ${score}/${total}`;
      this.els.result.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
    /** Best-effort refresh of the course's shared XP label, if the page has one. */
    refreshXpLabel() {
      const label = document.getElementById("courseXpLabel");
      if (label) label.textContent = `Course XP: ${this.store.getXP()}`;
    }
  };

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
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=code-lab.global.js.map