import { NO_MATCH_ANSWER, type Retrieval } from "./corpus";

export type Citation = {
  file: string;
  section: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "bot";
  /** Pre-formatted label, so nothing re-formats a date during render. */
  time: string;
  text: string;
  citations: readonly Citation[];
  match: number;
};

export const NO_CITATIONS: readonly Citation[] = [];

export const SEED_MESSAGE: ChatMessage = {
  id: "seed",
  role: "bot",
  time: "Ahora mismo",
  text: "👋 ¡Hola, desarrollador! Soy **DevTutor Bot**, tu mentor de IA especializado en Angular y TypeScript, con Llama 3 y nuestra base de conocimiento RAG. ¿En qué puedo ayudarte hoy con tu arquitectura?",
  citations: NO_CITATIONS,
  match: 0,
};

export const SEED_MESSAGES: readonly ChatMessage[] = [SEED_MESSAGE];


let sequence = 0;

export function nextId(prefix: string): string {
  sequence += 1;
  return `${prefix}-${sequence}`;
}

const TIME_FORMAT = new Intl.DateTimeFormat("es-MX", {
  hour: "numeric",
  minute: "2-digit",
});

export function stamp(): string {
  return TIME_FORMAT.format(new Date());
}

export function askMessage(text: string): ChatMessage {
  return {
    id: nextId("ask"),
    role: "user",
    time: stamp(),
    text,
    citations: NO_CITATIONS,
    match: 0,
  };
}

export function answerMessage(result: Retrieval): ChatMessage {
  if (result.doc === null) {
    return {
      id: nextId("answer"),
      role: "bot",
      time: stamp(),
      text: NO_MATCH_ANSWER,
      citations: NO_CITATIONS,
      match: 0,
    };
  }

  const file = result.doc.file;
  const citations: Citation[] = [];
  for (const chunk of result.doc.chunks) {
    citations.push({ file, section: chunk.section });
  }

  return {
    id: nextId("answer"),
    role: "bot",
    time: stamp(),
    text: result.doc.answer,
    citations,
    match: result.match,
  };
}
