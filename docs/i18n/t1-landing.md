# T1 - Landing page (`index.html`) string catalogue

Every user-facing English string on the course landing page, with a proposed
Spanish (`es`) translation and a locator so a developer can find and wire it.

Legend for "Source":
- **static** - literal text in `index.html`.
- **course-index.js** - rendered by `course-index.js` at runtime.
- **course-nav.js** - rendered by the jump bar in `course-nav.js`.
- **course-data.js** - data from `generated/course-data.js` (built from
  `course-registry.js`); track/part labels and per-lesson card copy.

Strings marked **[chrome]** were added to `res/chrome/en.json` + `es.json` under
the `landing.*` namespace (the key is given). Strings marked **[content]** come
from data files (`course-registry.js` for tracks/parts, `meta.js` per lesson) and
are translated there, not in the chrome catalog - they are listed here for
completeness only.

Do NOT translate code, identifiers, backticked terms, or `C#`.

---

## 1. Document head

| English | Spanish | Locator / key |
|---|---|---|
| The C# Object-Oriented Course | El curso de C# orientado a objetos | `<title>` - static **[chrome]** `landing.title` |

## 2. Jump bar (fixed header, appears on scroll)

| English | Spanish | Locator / key |
|---|---|---|
| Scroll chapters left | Desplazar capítulos a la izquierda | `#cJbEdgeL` `aria-label` - static **[chrome]** `landing.scrollLeft` |
| Scroll chapters right | Desplazar capítulos a la derecha | `#cJbEdgeR` `aria-label` - static **[chrome]** `landing.scrollRight` |
| Continue | Continuar | `#cJbCta` button - static **[chrome]** `landing.jumpbarCta` |
| `N lessons · done` | `N lecciones · listo` | `.c-part-badge` (`course-nav.js` ~L97): the word "lessons" -> `landing.lessons`, "done" -> **[chrome]** `landing.partDone` |
| `done / tracked` (e.g. `3 / 12`) | same numerals | `#cJbCount` (`course-nav.js` L189) - numbers only, no words |

## 3. Header / hero

| English | Spanish | Locator / key |
|---|---|---|
| From junior to software architect | De junior a arquitecto de software | `.c-eyebrow` - static **[chrome]** `landing.eyebrow` |
| Learn C# - and how software really works | Aprende C# - y cómo funciona de verdad el software | `.c-title` - static **[chrome]** `landing.heading` |
| Three ways in. The **practical** track teaches C# by building and running real code in your browser. The **theory** track starts from zero - what software is and how a computer actually runs it. The **AI** track opens up how large language models and agents work under the hood. Pick one - you can switch any time. | Tres formas de empezar. La ruta **práctica** enseña C# construyendo y ejecutando código real en tu navegador. La ruta **teórica** arranca desde cero - qué es el software y cómo lo ejecuta de verdad un ordenador. La ruta de **IA** destapa cómo funcionan por dentro los grandes modelos de lenguaje y los agentes. Elige una - puedes cambiar cuando quieras. | `.c-lead` - static, contains `<strong>` tags **[chrome]** `landing.lead` (source whitespace normalised to one line; the three `<strong>` spans are preserved) |

## 4. Track chooser + track switch

The chooser cards and the switch tabs are rendered by `course-index.js` from
`CourseData.tracks()`. Track `name`, `kicker`, `blurb` are **[content]** in
`course-registry.js` / `generated/course-data.js`.

| English | Spanish | Locator / key |
|---|---|---|
| Choose track | Elige una ruta | `#trackSwitch` `aria-label` - static **[chrome]** `landing.chooseTrack` |
| Practical | Práctica | track `name` (`practical`) - **[content]** course-data |
| Hands on | Manos a la obra | track `kicker` (`practical`) - **[content]** |
| Learn C# by writing and running real code, one small win at a time - up to a SOLID capstone. | Aprende C# escribiendo y ejecutando código real, un pequeño logro cada vez - hasta un proyecto final SOLID. | track `blurb` (`practical`) - **[content]** |
| Theory | Teoría | track `name` (`theory`) - **[content]** |
| From zero | Desde cero | track `kicker` (`theory`) - **[content]** |
| No background needed. Understand what software is and how a computer actually runs it, from the ground up. | Sin conocimientos previos. Entiende qué es el software y cómo lo ejecuta de verdad un ordenador, desde la base. | track `blurb` (`theory`) - **[content]** |
| AI | IA | track `name` (`ai`) - **[content]** |
| Agents from scratch | Agentes desde cero | track `kicker` (`ai`) - **[content]** |
| A first look at how large language models and AI agents really work - tokens, context, memory, tools, planning, and keeping an agent reliable. | Un primer vistazo a cómo funcionan de verdad los grandes modelos de lenguaje y los agentes de IA - tokens, contexto, memoria, herramientas, planificación y cómo mantener fiable a un agente. | track `blurb` (`ai`) - **[content]** |

## 5. Progress panel + smart CTA

Rendered by `course-index.js` (`renderTrack`).

| English | Spanish | Locator / key |
|---|---|---|
| Your progress | Tu progreso | `#cTrackLabel` - static **[chrome]** `landing.progressLabel` |
| 0 / 0 lessons | 0 / 0 lecciones | `#cStats` initial static value **[chrome]** `landing.statsEmpty` |
| `done / tracked lessons · xp XP` | `done / tracked lecciones · xp XP` | `#cStats` runtime (`course-index.js` L~118): "lessons" -> `landing.lessons`, "XP" -> `landing.xp` |
| Start | Empezar | `#cCta` (done === 0) **[chrome]** `landing.ctaStart` |
| Continue where you left off | Continúa donde lo dejaste | `#cCta` (has open lesson) **[chrome]** `landing.ctaContinue` |
| You finished this track | Has terminado esta ruta | `#cCta` (all done) **[chrome]** `landing.ctaFinished` |

## 6. Stage / part headings

Rendered by `course-index.js` (`partHTML`) from `CourseData`. `kicker` and
`title` are **[content]** in `course-registry.js`.

Practical track:

| English kicker | English title | Spanish kicker | Spanish title |
|---|---|---|---|
| Part one | Understand the ideas | Parte uno | Entiende las ideas |
| Part two | Everyday essentials | Parte dos | Lo esencial del día a día |
| Part three | Know the language | Parte tres | Conoce el lenguaje |
| Part four | Build with objects | Parte cuatro | Construye con objetos |
| Part five | Prove it works | Parte cinco | Demuestra que funciona |
| Part six | Design for change | Parte seis | Diseña para el cambio |

Theory track (`partPrefix` "Theory · Part "):

| English kicker | English title | Spanish kicker | Spanish title |
|---|---|---|---|
| Theory · Part one | What a computer really is | Teoría · Parte uno | Qué es de verdad un ordenador |
| Theory · Part two | From idea to running code | Teoría · Parte dos | De la idea al código en marcha |
| Theory · Part three | How software runs and connects | Teoría · Parte tres | Cómo se ejecuta y se conecta el software |
| Theory · Part four | The development world | Teoría · Parte cuatro | El mundo del desarrollo |

AI track (`partPrefix` "AI · Part "):

| English kicker | English title | Spanish kicker | Spanish title |
|---|---|---|---|
| AI · Part one | The building blocks of AI | IA · Parte uno | Los cimientos de la IA |
| AI · Part two | From model to agent | IA · Parte dos | Del modelo al agente |
| AI · Part three | How an agent thinks | IA · Parte tres | Cómo piensa un agente |
| AI · Part four | Making agents reliable | IA · Parte cuatro | Hacer fiables a los agentes |

Note: the track `name` and part `kicker` share the word "Theory"/"AI" and the
number word ("one".."six"). Wiring these means translating them at the data
layer (`course-registry.js`), not in the chrome catalog.

## 7. Lesson cards

Each card (`course-index.js` `cardHTML`) shows: a **title**, a **blurb**, a
**status** label, a **pill** (difficulty), and a **time**.

- **title**, **blurb**, **time** are **[content]** per lesson in each lesson's
  `meta.js` (surfaced via `generated/course-data.js`). Translated per-lesson in
  the resource work, not in the chrome catalog. Example (foundations):
  - Title: "Foundations" -> "Fundamentos"
  - Blurb: "Start here. Write and run your first C#: printing, variables, the common datatypes, changing a value, what null means, and what an object is." -> "Empieza aquí. Escribe y ejecuta tu primer C#: imprimir, variables, los tipos de datos comunes, cambiar un valor, qué significa `null` y qué es un objeto."
  - Time: "20 min" -> "20 min" (unchanged)
- **status** label - **[chrome]**, rendered from `STATUS_LABEL` in
  `course-index.js`:

| English | Spanish | Key |
|---|---|---|
| Not started | Sin empezar | `landing.statusNotStarted` |
| In progress | En curso | `landing.statusInProgress` |
| Completed | Completada | `landing.statusCompleted` |
| Final challenge | Reto final | `landing.statusFinal` |

- **pill** difficulty - **[chrome]**, `cap(pill)` in `course-index.js`:

| English | Spanish | Key |
|---|---|---|
| Gentle | Suave | `landing.pillGentle` |
| Steady | Media | `landing.pillSteady` |
| Challenging | Exigente | `landing.pillChallenging` |

## 8. Footer + back-to-top

| English | Spanish | Locator / key |
|---|---|---|
| Progress is stored in this browser. Clearing site data resets the course. | El progreso se guarda en este navegador. Si borras los datos del sitio, el curso se reinicia. | `.c-foot` - static **[chrome]** `landing.footerNote` |
| Concept glossary | Glosario de conceptos | `.c-foot` link to `glossary.html` - static **[chrome]** `landing.glossary` |
| Back to top | Volver arriba | `#cTotop` `aria-label` - static **[chrome]** `landing.backToTop` |

---

## Counts

- **Landing strings catalogued: 47.**
  - Chrome (`landing.*` keys, fixed): 26 - `title`, `eyebrow`, `heading`,
    `lead`, `progressLabel`, `statsEmpty`, `lessons`, `xp`, `ctaStart`,
    `ctaContinue`, `ctaFinished`, `jumpbarCta`, `statusCompleted`,
    `statusInProgress`, `statusNotStarted`, `statusFinal`, `pillGentle`,
    `pillSteady`, `pillChallenging`, `partDone`, `footerNote`, `glossary`,
    `scrollLeft`, `scrollRight`, `chooseTrack`, `backToTop`.
  - Content (track/part labels, data layer): 21 - 3 track names + 3 track
    kickers + 3 track blurbs + 14 part titles + 14 part kickers (kicker/title
    counted once per part = 14 parts x 2 - listed above; track-level = 9).
- **Per-lesson card copy** (title/blurb/time) is NOT counted here - it is
  translated per lesson in each `meta.js`.

## Judgement calls (chrome vs content)

- **Track names / part titles / kickers** - treated as **content** (they live in
  `course-registry.js`, are course structure, and read like lesson copy), so they
  are documented here but NOT added to the chrome catalog. If the project prefers
  them in the shared catalog, they could move to `landing.*` later.
- **`landing.lead`** - it is header prose with three inline `<strong>` spans. Put
  it in the chrome catalog (header text, unlikely to vary per lesson) but had to
  normalise the source's multi-line whitespace to a single line; the `<strong>`
  markup is kept verbatim.
- **Language option endonyms** (`English`, `Español`) - kept identical in both
  `en.json` and `es.json` (not translated), matching the picker convention.
- **`landing.partDone` ("done") and `landing.lessons` ("lessons")** - these are
  fragments concatenated in `course-nav.js`/`course-index.js`
  (`N + " lessons · done"`, `done + " / " + tracked + " lessons · " + xp + " XP"`).
  Catalogued as separate word keys; a developer wiring them must rebuild the
  concatenation, since Spanish word order/agreement may differ.
