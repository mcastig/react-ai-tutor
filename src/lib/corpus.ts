/**
 * The indexed corpus behind DevTutor. Retrieval is lexical over these docs —
 * the UI reports what it actually did, so nothing here pretends to be a
 * vector search it isn't.
 */

export type Chunk = {
  /** Anchor inside the source file, shown in the citation chip. */
  section: string;
};

export type CorpusDoc = {
  id: string;
  file: string;
  title: string;
  summary: string;
  /** Terms that route a question to this doc. */
  terms: readonly string[];
  chunks: readonly Chunk[];
  answer: string;
  /** Docs added at runtime carry the name of the file they came from. */
  origin: "indexed" | "local";
};

const SIGNALS: CorpusDoc = {
  id: "signals",
  file: "angular-signals.md",
  title: "Signals & the reactivity graph",
  summary: "signal, computed, effect, and signal inputs in Angular 18.",
  origin: "indexed",
  terms: [
    "angular",
    "signal",
    "signals",
    "computed",
    "effect",
    "reactive",
    "reactivity",
    "state",
    "set",
    "update",
    "input",
    "change",
    "detection",
    "zoneless",
  ],
  chunks: [{ section: "reactivity-graph" }, { section: "signal-inputs" }],
  answer: `Signals are the reactive primitive Angular 18 builds on. \`signal()\` holds a value, \`computed()\` derives one lazily, and \`effect()\` syncs the graph with the world outside it.

\`\`\`ts
import { signal, computed, effect } from '@angular/core';

const filter = signal('');
const visible = computed(() => items().filter(i => i.name.includes(filter())));

effect(() => console.log('matches:', visible().length));

filter.set('routing');          // replace the value
filter.update(v => v.trim());   // derive from the previous one
\`\`\`

- \`computed()\` is lazy and memoized. It recomputes only when a dependency it actually read during the last run has changed.
- Never mutate an object in place. \`set()\` a new reference, or the graph never learns anything changed.
- \`effect()\` is for logging, storage, and DOM work. Deriving state inside one is the most common signals mistake — that is what \`computed()\` is for.
- \`input()\` and \`input.required<T>()\` replace \`@Input()\` and join the same graph, so a template that reads them needs no change detection help.`,
};

const ROUTING: CorpusDoc = {
  id: "routing",
  file: "standalone-routing.md",
  title: "Standalone components & the router",
  summary: "bootstrapApplication, provideRouter, lazy routes, functional guards.",
  origin: "indexed",
  terms: [
    "angular",
    "standalone",
    "routing",
    "router",
    "route",
    "routes",
    "navigation",
    "bootstrap",
    "lazy",
    "guard",
    "guards",
    "ngmodule",
    "module",
    "modules",
    "provider",
    "providers",
  ],
  chunks: [{ section: "bootstrap" }, { section: "lazy-routes" }],
  answer: `Standalone components drop NgModules entirely. The app bootstraps once and providers live in one readable list.

\`\`\`ts
bootstrapApplication(App, {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch()),
  ],
});
\`\`\`

Routes lazy-load either a single component or a nested route array:

\`\`\`ts
export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard),
  },
  {
    path: 'admin',
    canMatch: [isAdmin],
    loadChildren: () => import('./admin/routes').then(m => m.ADMIN_ROUTES),
  },
];
\`\`\`

- \`withComponentInputBinding()\` binds route params straight into \`input()\` signals, which retires most \`ActivatedRoute\` subscriptions.
- Guards are plain functions: \`const isAdmin: CanMatchFn = () => inject(Auth).isAdmin();\`
- Put \`providers\` on a route to scope a service to that subtree instead of the whole application.`,
};

const INTEROP: CorpusDoc = {
  id: "interop",
  file: "rxjs-interop.md",
  title: "RxJS interop",
  summary: "toSignal, toObservable, and takeUntilDestroyed.",
  origin: "indexed",
  terms: [
    "angular",
    "rxjs",
    "tosignal",
    "toobservable",
    "observable",
    "interop",
    "subscribe",
    "subscription",
    "unsubscribe",
    "stream",
    "async",
    "pipe",
    "takeuntildestroyed",
    "teardown",
    "destroy",
    "leak",
    "memory",
    "migration",
    "migrate",
    "debounce",
    "switchmap",
  ],
  chunks: [{ section: "to-signal" }, { section: "teardown" }],
  answer: `\`@angular/core/rxjs-interop\` bridges both directions: \`toSignal()\` reads a stream, \`toObservable()\` feeds one.

\`\`\`ts
import { toSignal, toObservable } from '@angular/core/rxjs-interop';

readonly query = signal('');

readonly results = toSignal(
  toObservable(this.query).pipe(
    debounceTime(250),
    switchMap(q => this.api.search(q)),
  ),
  { initialValue: [] },
);
\`\`\`

- \`toSignal()\` subscribes immediately and tears down with the injection context, so call it in a field initializer or constructor — not inside a lifecycle hook.
- Pass \`initialValue\`, or \`requireSync: true\` when the source emits synchronously such as a \`BehaviorSubject\`. With neither, the signal type widens to include \`undefined\`.
- For streams you own, \`takeUntilDestroyed()\` replaces the \`destroy$\` Subject boilerplate.
- Migrate leaf-first: convert what the template reads, and leave the stream plumbing in RxJS where debouncing, retries, and cancellation still earn their keep.`,
};

const GENERICS: CorpusDoc = {
  id: "generics",
  file: "typescript-generics.md",
  title: "Generics in TypeScript 5.4",
  summary: "Constraints, keyof, satisfies, and NoInfer.",
  origin: "indexed",
  terms: [
    "typescript",
    "ts",
    "generic",
    "generics",
    "type",
    "types",
    "keyof",
    "constraint",
    "constraints",
    "infer",
    "noinfer",
    "satisfies",
    "conditional",
    "inference",
    "extends",
  ],
  chunks: [{ section: "constraints" }, { section: "inference-control" }],
  answer: `Generics are functions over types. The ones worth writing constrain their parameters so the compiler can infer everything else.

\`\`\`ts
function pluck<T, K extends keyof T>(rows: readonly T[], key: K): T[K][] {
  return rows.map(row => row[key]);
}

const names = pluck(users, 'name'); // string[]
\`\`\`

- Constrain with \`extends\` so \`keyof\`, indexed access, and editor autocomplete all work at the call site.
- \`NoInfer<T>\`, new in TypeScript 5.4, stops one parameter from widening the inference: \`function pick<T>(items: T[], fallback: NoInfer<T>)\`.
- \`satisfies\` checks a value against a type without erasing its literal types, which is what you want for route tables and config objects.
- Reach for conditional types and \`infer\` only when overloads cannot express the signature. They read worse and type-check slower.`,
};

export const INDEXED_CORPUS: readonly CorpusDoc[] = [
  SIGNALS,
  ROUTING,
  INTEROP,
  GENERICS,
];

export const NO_MATCH_ANSWER = `Nothing in the indexed corpus covers that yet, so there is no grounded answer to give.

The knowledge base currently holds **Angular 18 signals**, **standalone routing**, **RxJS interop**, and **TypeScript 5.4 generics**. Ask about one of those, or use **Add Doc** to index a markdown file and make it retrievable.`;

export type ScoredDoc = {
  file: string;
  /** Score relative to the best-matching doc, for the trace bars. */
  weight: number;
};

export type Retrieval = {
  doc: CorpusDoc | null;
  /** Share of the question's meaningful terms that landed in the winning doc. */
  match: number;
  /** How many docs matched at all — reported verbatim in the trace. */
  hits: number;
  /** Every doc that was scanned, in corpus order. */
  scores: readonly ScoredDoc[];
};

const NOTHING: Retrieval = { doc: null, match: 0, hits: 0, scores: [] };

const TOKEN_RE = /[a-z0-9+#]+/g;

const STOP_WORDS = new Set([
  "a", "an", "and", "the", "to", "of", "in", "on", "for", "with", "how",
  "do", "does", "i", "is", "are", "what", "why", "when", "use", "using", "can",
  "my", "me", "you", "it", "this", "that", "about", "please", "explain", "tell",
  "should", "best", "way", "between", "vs", "or", "be", "not", "get", "make",
]);

/** doc.id → its terms as a Set, so scoring is O(1) per token. */
const TERM_SETS = new Map<string, Set<string>>();

function termsFor(doc: CorpusDoc): Set<string> {
  let set = TERM_SETS.get(doc.id);
  if (set === undefined) {
    set = new Set(doc.terms);
    TERM_SETS.set(doc.id, set);
  }
  return set;
}

function matches(terms: Set<string>, token: string): boolean {
  if (terms.has(token)) return true;
  // Cheap plural handling, so "subscriptions" still finds "subscription".
  return token.endsWith("s") && terms.has(token.slice(0, -1));
}

export function retrieve(
  question: string,
  docs: readonly CorpusDoc[],
): Retrieval {
  const tokens = question.toLowerCase().match(TOKEN_RE);
  if (tokens === null) return NOTHING;

  const meaningful: string[] = [];
  for (const token of tokens) {
    if (token.length > 1 && !STOP_WORDS.has(token)) meaningful.push(token);
  }
  if (meaningful.length === 0) return NOTHING;

  const raw: number[] = [];
  let best: CorpusDoc | null = null;
  let bestScore = 0;
  let hits = 0;

  for (const doc of docs) {
    const terms = termsFor(doc);
    let score = 0;
    for (const token of meaningful) {
      if (matches(terms, token)) score += 1;
    }
    raw.push(score);
    if (score === 0) continue;
    hits += 1;
    if (score > bestScore) {
      bestScore = score;
      best = doc;
    }
  }

  const scores: ScoredDoc[] = [];
  for (let i = 0; i < docs.length; i += 1) {
    scores.push({
      file: docs[i].file,
      weight: bestScore === 0 ? 0 : raw[i] / bestScore,
    });
  }

  if (best === null) return { doc: null, match: 0, hits: 0, scores };

  return {
    doc: best,
    match: Math.min(0.99, bestScore / meaningful.length),
    hits,
    scores,
  };
}

const WORD_RE = /\S+/g;

/** Turn an uploaded markdown file into something retrievable. */
export function indexLocalDoc(fileName: string, text: string): CorpusDoc {
  const words = text.toLowerCase().match(TOKEN_RE) ?? [];
  const counts = new Map<string, number>();
  for (const word of words) {
    if (word.length < 4 || STOP_WORDS.has(word)) continue;
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }

  const terms: string[] = [];
  for (const [word, count] of counts) {
    if (count > 1) terms.push(word);
  }

  const stem = fileName.replace(/\.[^.]+$/, "");
  for (const part of stem.toLowerCase().split(/[^a-z0-9]+/)) {
    if (part.length > 1) terms.push(part);
  }

  const wordCount = text.match(WORD_RE)?.length ?? 0;
  const excerpt = text.trim().slice(0, 700);

  return {
    id: `local-${stem}-${Date.now()}`,
    file: fileName,
    title: stem.replace(/[-_]+/g, " "),
    summary: `${wordCount.toLocaleString("en-US")} words, added in this session.`,
    origin: "local",
    terms,
    chunks: [{ section: "excerpt" }],
    answer: `From **${fileName}**, the doc you added to the corpus:\n\n${excerpt}${
      text.length > 700 ? "…" : ""
    }`,
  };
}
