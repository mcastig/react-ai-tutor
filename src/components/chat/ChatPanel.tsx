"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { retrieve, type ScoredDoc } from "@/lib/corpus";
import {
  answerMessage,
  askMessage,
  SEED_MESSAGES,
  type ChatMessage,
} from "@/lib/chat";
import { useCorpus } from "@/components/providers";
import { Composer, type ComposerHandle } from "./Composer";
import { MessageItem } from "./MessageItem";
import { RetrievalTrace } from "./RetrievalTrace";
import { WelcomeCard } from "./WelcomeCard";
import styles from "./chat.module.css";

/** Long enough to read the trace, short enough not to feel staged. */
const RETRIEVAL_MS = 900;

export function ChatPanel() {
  const { docs } = useCorpus();
  const [messages, setMessages] =
    useState<readonly ChatMessage[]>(SEED_MESSAGES);
  const [trace, setTrace] = useState<readonly ScoredDoc[] | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<ComposerHandle>(null);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const send = useCallback(
    (question: string) => {
      // Retrieval is synchronous and cheap; only the reveal is paced.
      const result = retrieve(question, docs);

      setMessages((current) => [...current, askMessage(question)]);
      setTrace(result.scores);

      window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        setMessages((current) => [...current, answerMessage(result)]);
        setTrace(null);
      }, RETRIEVAL_MS);
    },
    [docs],
  );

  const pick = useCallback((question: string) => {
    composerRef.current?.fill(question);
  }, []);

  const retrieving = trace !== null;

  // Follow the conversation, but let the first paint rest on the hero.
  // Comparing against the count we last scrolled for keeps this idempotent,
  // so Strict Mode's double-invoked effects can't jump the view on mount.
  const scrolledFor = useRef(SEED_MESSAGES.length);
  useEffect(() => {
    if (messages.length === scrolledFor.current && !retrieving) return;
    scrolledFor.current = messages.length;
    const node = scrollRef.current;
    if (node === null) return;
    node.scrollTop = node.scrollHeight;
  }, [messages.length, retrieving]);

  return (
    <section className={styles.panel}>
      <div className={styles.scroll} ref={scrollRef}>
        <WelcomeCard onPick={pick} />

        <ol
          className={styles.log}
          role="log"
          aria-live="polite"
          aria-busy={retrieving}
          aria-label="Conversation"
        >
          {messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}
          {trace !== null ? <RetrievalTrace scores={trace} /> : null}
        </ol>
      </div>

      <Composer ref={composerRef} onSend={send} busy={retrieving} />
    </section>
  );
}
