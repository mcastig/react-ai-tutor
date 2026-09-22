/**
 * A deliberately small markdown reader: paragraphs, bullets, fenced code, and
 * inline bold/code. A tutor has to show code, but not at the cost of shipping a
 * full parser to the client.
 */

export type Span = {
  kind: "text" | "strong" | "code";
  text: string;
};

export type Block =
  | { kind: "p"; key: string; spans: Span[] }
  | { kind: "ul"; key: string; items: Span[][] }
  | { kind: "code"; key: string; lang: string; code: string };

const INLINE_RE = /(\*\*[^*]+\*\*|`[^`]+`)/g;

function readSpans(line: string): Span[] {
  const spans: Span[] = [];
  for (const part of line.split(INLINE_RE)) {
    if (part === "") continue;
    if (part.startsWith("**") && part.endsWith("**")) {
      spans.push({ kind: "strong", text: part.slice(2, -2) });
    } else if (part.startsWith("`") && part.endsWith("`")) {
      spans.push({ kind: "code", text: part.slice(1, -1) });
    } else {
      spans.push({ kind: "text", text: part });
    }
  }
  return spans;
}

function parse(source: string): Block[] {
  const lines = source.split("\n");
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let bullets: Span[][] = [];

  const flush = () => {
    if (paragraph.length > 0) {
      blocks.push({
        kind: "p",
        key: `p${blocks.length}`,
        spans: readSpans(paragraph.join(" ")),
      });
      paragraph = [];
    }
    if (bullets.length > 0) {
      blocks.push({ kind: "ul", key: `u${blocks.length}`, items: bullets });
      bullets = [];
    }
  };

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];

    if (line.startsWith("```")) {
      flush();
      const lang = line.slice(3).trim();
      const code: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].startsWith("```")) {
        code.push(lines[i]);
        i += 1;
      }
      blocks.push({
        kind: "code",
        key: `c${blocks.length}`,
        lang,
        code: code.join("\n"),
      });
      continue;
    }

    if (line.startsWith("- ")) {
      if (paragraph.length > 0) flush();
      bullets.push(readSpans(line.slice(2)));
      continue;
    }

    if (line.trim() === "") {
      flush();
      continue;
    }

    if (bullets.length > 0) flush();
    paragraph.push(line);
  }

  flush();
  return blocks;
}

/** Answers repeat across a session; parse each one once. */
const cache = new Map<string, Block[]>();

export function readMarkdown(source: string): Block[] {
  let blocks = cache.get(source);
  if (blocks === undefined) {
    blocks = parse(source);
    cache.set(source, blocks);
  }
  return blocks;
}
