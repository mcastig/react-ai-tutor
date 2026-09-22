# DevTutor Bot

An Angular & TypeScript mentor interface: a chat tutor whose answers are
grounded in an indexed markdown corpus, alongside views for the knowledge base
and adapter eval runs.

Built on Next.js 16 (App Router) and React 19 with CSS Modules.

## Retrieval is local

**No model is called.** Despite the Llama 3 branding in the UI, answers are not
generated — they are retrieved from four markdown docs in
[`src/lib/corpus.ts`](src/lib/corpus.ts) by lexical keyword matching, and
returned verbatim. There is no API key, no backend, and no network request.

This is deliberate rather than a stub: the interface is built to *show* its
grounding, and it can only honestly do that over a corpus it actually has. Every
answer carries the sections it came from and a match score, and a question the
corpus does not cover says so instead of inventing an answer.

If you wire this to a real model, the piece to keep is the citation contract —
the UI promises grounding on every answer, so the generation path has to be able
to produce it.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Script | Does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |

## The three views

**Chat Tutor** — Ask a question, or pick one of the four suggestions. The
retrieval trace fills a bar per indexed doc showing how much of the question
landed in each, then the answer arrives with its source chunks.

**RAG Knowledge Base** — The indexed corpus: each doc's file, sections, and
summary, including anything added at runtime.

**Fine-Tuning & Eval** — Adapter run metrics. This data is static sample data
from [`src/lib/eval-runs.ts`](src/lib/eval-runs.ts); it does not poll a training
job. The headline delta is computed from the runs, so the sidebar badge and the
table cannot disagree.

Chat stays mounted behind React's `Activity` while you are in another view, so
switching does not discard the conversation.

## Adding a doc

**Add Doc** in the top bar indexes a `.md` or `.txt` file (up to 500 KB) into the
session corpus. It becomes retrievable immediately and appears in the knowledge
base. Terms are derived from repeated words and the filename.

This lives in memory only — a refresh returns you to the four built-in docs. To
add one permanently, append a `CorpusDoc` to `INDEXED_CORPUS` in
[`src/lib/corpus.ts`](src/lib/corpus.ts) with the terms that should route a
question to it.

## Layout

```
src/
  app/            layout (fonts, tokens), page shell, global CSS
  lib/
    corpus.ts     the four docs + lexical retrieval
    chat.ts       message model, timestamps, answer construction
    markdown.ts   small markdown reader (paragraphs, bullets, fenced code)
    eval-runs.ts  sample adapter metrics
  components/
    providers.tsx corpus + active view state
    shell/        sidebar, top bar, Add Doc
    chat/         chat panel, composer, messages, retrieval trace
    panels/       view switch, knowledge base, eval
```

Server components render what they can: the sidebar shell and the entire eval
view are server-rendered, the latter passed through the client boundary as a
prop so it ships no client JavaScript. Client islands are kept to the parts that
actually hold state.

## Design notes

Three typefaces, each carrying a role rather than decorating:

- **Sora** — the product voice (brand, headings)
- **Manrope** — the mentor voice (prose, answers)
- **JetBrains Mono** — the machine voice (model IDs, versions, citations, traces)

Tokens live at the top of [`src/app/globals.css`](src/app/globals.css). A single
teal accent is spent almost entirely on the retrieval trace and its citations;
everything else stays quiet.

### One CSS trap worth knowing

`.hero` carries `overflow: hidden` to clip its watermark, which zeroes a flex
item's automatic minimum size. Without the explicit `flex: none`, a short
viewport crushes the card instead of letting the log scroll. The same guard is
on `.log`. Both are commented in
[`chat.module.css`](src/components/chat/chat.module.css) — removing them
silently reintroduces the bug, and only at short window heights.
