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
  title: "Signals y el grafo de reactividad",
  summary: "signal, computed, effect y las entradas signal en Angular 18.",
  origin: "indexed",
  terms: [
    "angular", "signal", "signals", "computed", "effect", "reactive",
    "reactivity", "state", "set", "update", "input", "change", "detection",
    "zoneless",
    "señal", "señales", "reactividad", "reactivo", "estado", "computado",
    "cómputo", "efecto", "detección", "cambios", "entrada", "entradas",
  ],
  chunks: [{ section: "reactivity-graph" }, { section: "signal-inputs" }],
  answer: `Las signals son la primitiva reactiva sobre la que se construye Angular 18. \`signal()\` guarda un valor, \`computed()\` deriva uno de forma perezosa y \`effect()\` sincroniza el grafo con el mundo exterior.

\`\`\`ts
import { signal, computed, effect } from '@angular/core';

const filter = signal('');
const visible = computed(() => items().filter(i => i.name.includes(filter())));

effect(() => console.log('matches:', visible().length));

filter.set('routing');          // reemplaza el valor
filter.update(v => v.trim());   // deriva del anterior
\`\`\`

- \`computed()\` es perezoso y memoizado: solo recalcula cuando cambia una dependencia que realmente leyó en la última ejecución.
- Nunca mutes un objeto en el sitio. Asigna una referencia nueva con \`set()\`, o el grafo no se entera de que algo cambió.
- \`effect()\` es para logging, almacenamiento y trabajo con el DOM. Derivar estado dentro de uno es el error más común con signals: para eso está \`computed()\`.
- \`input()\` e \`input.required<T>()\` sustituyen a \`@Input()\` y se integran en el mismo grafo, así que una plantilla que los lee no necesita ayuda de la detección de cambios.`,
};

const ROUTING: CorpusDoc = {
  id: "routing",
  file: "standalone-routing.md",
  title: "Componentes standalone y el router",
  summary: "bootstrapApplication, provideRouter, rutas perezosas y guards funcionales.",
  origin: "indexed",
  terms: [
    "angular", "standalone", "routing", "router", "route", "routes",
    "navigation", "bootstrap", "lazy", "guard", "guards", "ngmodule",
    "module", "modules", "provider", "providers",
    "ruta", "rutas", "enrutamiento", "navegación", "arranque", "arrancar",
    "perezosa", "perezosas", "guardia", "guardias", "módulo", "módulos",
    "proveedor", "proveedores",
  ],
  chunks: [{ section: "bootstrap" }, { section: "lazy-routes" }],
  answer: `Los componentes standalone eliminan los NgModules por completo. La aplicación arranca una sola vez y los providers viven en una única lista legible.

\`\`\`ts
bootstrapApplication(App, {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch()),
  ],
});
\`\`\`

Las rutas cargan de forma perezosa un componente suelto o un array de rutas anidadas:

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

- \`withComponentInputBinding()\` enlaza los parámetros de ruta directamente con signals \`input()\`, lo que elimina casi todas las suscripciones a \`ActivatedRoute\`.
- Los guards son funciones normales: \`const isAdmin: CanMatchFn = () => inject(Auth).isAdmin();\`
- Pon \`providers\` en una ruta para limitar un servicio a ese subárbol en lugar de a toda la aplicación.`,
};

const INTEROP: CorpusDoc = {
  id: "interop",
  file: "rxjs-interop.md",
  title: "Interoperabilidad con RxJS",
  summary: "toSignal, toObservable y takeUntilDestroyed.",
  origin: "indexed",
  terms: [
    "angular", "rxjs", "tosignal", "toobservable", "observable", "interop",
    "subscribe", "subscription", "unsubscribe", "stream", "async", "pipe",
    "takeuntildestroyed", "teardown", "destroy", "leak", "memory",
    "migration", "migrate", "debounce", "switchmap",
    "interoperabilidad", "suscripción", "suscripciones", "suscribir",
    "desuscribir", "flujo", "flujos", "fuga", "fugas", "memoria",
    "migración", "migrar", "destruir", "limpieza", "observables",
  ],
  chunks: [{ section: "to-signal" }, { section: "teardown" }],
  answer: `\`@angular/core/rxjs-interop\` conecta en ambos sentidos: \`toSignal()\` lee un flujo y \`toObservable()\` alimenta uno.

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

- \`toSignal()\` se suscribe de inmediato y se limpia junto con el contexto de inyección, así que llámalo al inicializar un campo o en el constructor, no dentro de un hook del ciclo de vida.
- Pasa \`initialValue\`, o \`requireSync: true\` cuando la fuente emite de forma síncrona, como un \`BehaviorSubject\`. Sin ninguno de los dos, el tipo de la signal se amplía para incluir \`undefined\`.
- Para los flujos que tú controlas, \`takeUntilDestroyed()\` sustituye al típico Subject \`destroy$\`.
- Migra desde las hojas hacia dentro: convierte lo que lee la plantilla y deja la fontanería de flujos en RxJS, donde el debounce, los reintentos y la cancelación siguen valiendo la pena.`,
};

const GENERICS: CorpusDoc = {
  id: "generics",
  file: "typescript-generics.md",
  title: "Genéricos en TypeScript 5.4",
  summary: "Restricciones, keyof, satisfies y NoInfer.",
  origin: "indexed",
  terms: [
    "typescript", "ts", "generic", "generics", "type", "types", "keyof",
    "constraint", "constraints", "infer", "noinfer", "satisfies",
    "conditional", "inference", "extends",
    "genérico", "genéricos", "tipo", "tipos", "restricción", "restricciones",
    "inferencia", "inferir", "condicional", "condicionales", "parámetro",
    "parámetros",
  ],
  chunks: [{ section: "constraints" }, { section: "inference-control" }],
  answer: `Los genéricos son funciones sobre tipos. Los que merece la pena escribir restringen sus parámetros para que el compilador pueda inferir todo lo demás.

\`\`\`ts
function pluck<T, K extends keyof T>(rows: readonly T[], key: K): T[K][] {
  return rows.map(row => row[key]);
}

const names = pluck(users, 'name'); // string[]
\`\`\`

- Restringe con \`extends\` para que \`keyof\`, el acceso indexado y el autocompletado del editor funcionen en el punto de llamada.
- \`NoInfer<T>\`, nuevo en TypeScript 5.4, impide que un parámetro amplíe la inferencia: \`function pick<T>(items: T[], fallback: NoInfer<T>)\`.
- \`satisfies\` comprueba un valor contra un tipo sin borrar sus tipos literales, que es justo lo que quieres en tablas de rutas y objetos de configuración.
- Recurre a los tipos condicionales y a \`infer\` solo cuando las sobrecargas no puedan expresar la firma. Se leen peor y el chequeo de tipos es más lento.`,
};

export const INDEXED_CORPUS: readonly CorpusDoc[] = [
  SIGNALS,
  ROUTING,
  INTEROP,
  GENERICS,
];

export const NO_MATCH_ANSWER = `Todavía no hay nada en el corpus indexado sobre eso, así que no puedo dar una respuesta fundamentada.

Ahora mismo la base de conocimiento cubre **signals de Angular 18**, **rutas standalone**, **interoperabilidad con RxJS** y **genéricos de TypeScript 5.4**. Pregunta por alguno de esos temas, o usa **Añadir doc** para indexar un archivo markdown y dejarlo consultable.`;

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

const DIACRITICS_RE = /[\u0300-\u036f]/g;

/**
 * Fold accents so "genéricos" and "genericos" are the same token, and "ñ"
 * survives as "n". Applied to both the question and the indexed terms, so
 * terms can be written naturally with accents.
 */
function normalize(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(DIACRITICS_RE, "");
}

const STOP_WORDS = new Set([
  // English
  "a", "an", "and", "the", "to", "of", "in", "on", "for", "with", "how",
  "do", "does", "i", "is", "are", "what", "why", "when", "use", "using", "can",
  "my", "me", "you", "it", "this", "that", "about", "please", "explain", "tell",
  "should", "best", "way", "between", "vs", "or", "be", "not", "get", "make",
  // Spanish (already accent-folded)
  "el", "la", "los", "las", "un", "una", "unos", "unas", "de", "del", "en",
  "con", "para", "por", "que", "como", "cual", "cuales", "cuando", "donde",
  "y", "o", "al", "se", "su", "sus", "mi", "mis", "lo", "le", "les", "es",
  "son", "esta", "este", "esto", "estos", "estas", "ese", "esa", "eso",
  "usar", "uso", "usan", "hacer", "hago", "puedo", "puede", "podria",
  "explica", "explicar", "dime", "sobre", "entre", "mas", "mejor", "forma",
  "manera", "quiero", "necesito", "tengo", "hay", "ser", "si", "no", "me",
]);

/** doc.id → its normalized terms as a Set, so scoring is O(1) per token. */
const TERM_SETS = new Map<string, Set<string>>();

function termsFor(doc: CorpusDoc): Set<string> {
  let set = TERM_SETS.get(doc.id);
  if (set === undefined) {
    set = new Set<string>();
    for (const term of doc.terms) set.add(normalize(term));
    TERM_SETS.set(doc.id, set);
  }
  return set;
}

function matches(terms: Set<string>, token: string): boolean {
  if (terms.has(token)) return true;
  // Cheap plural handling for both languages: "subscriptions" finds
  // "subscription", and "senales" finds "senal".
  if (token.endsWith("es") && terms.has(token.slice(0, -2))) return true;
  return token.endsWith("s") && terms.has(token.slice(0, -1));
}

export function retrieve(
  question: string,
  docs: readonly CorpusDoc[],
): Retrieval {
  const tokens = normalize(question).match(TOKEN_RE);
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
  const words = normalize(text).match(TOKEN_RE) ?? [];
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
  for (const part of normalize(stem).split(/[^a-z0-9]+/)) {
    if (part.length > 1) terms.push(part);
  }

  const wordCount = text.match(WORD_RE)?.length ?? 0;
  const excerpt = text.trim().slice(0, 700);

  return {
    id: `local-${stem}-${Date.now()}`,
    file: fileName,
    title: stem.replace(/[-_]+/g, " "),
    summary: `${wordCount.toLocaleString("es-MX")} palabras, añadido en esta sesión.`,
    origin: "local",
    terms,
    chunks: [{ section: "excerpt" }],
    answer: `De **${fileName}**, el doc que añadiste al corpus:\n\n${excerpt}${
      text.length > 700 ? "…" : ""
    }`,
  };
}
