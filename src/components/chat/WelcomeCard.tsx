"use client";

import type { MouseEvent } from "react";
import { memo, useCallback } from "react";
import { SparkIcon } from "@/components/icons";
import styles from "./chat.module.css";

const QUESTIONS = [
  "How to use Angular Signals?",
  "Explain TypeScript Generics",
  "Standalone Components routing",
  "RxJS toSignal migration guide",
];

const WATERMARK = (
  <svg
    className={styles.watermark}
    viewBox="0 0 100 100"
    fill="none"
    stroke="currentColor"
    strokeWidth="6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 22 48 50 20 78" />
    <path d="M52 22 80 50 52 78" />
  </svg>
);

function WelcomeCardBase({ onPick }: { onPick: (question: string) => void }) {
  const pick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      onPick(event.currentTarget.dataset.question as string);
    },
    [onPick],
  );

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      {WATERMARK}

      <span className={styles.heroIcon}>
        <SparkIcon className={styles.heroIconGlyph} />
      </span>

      <div className={styles.heroBody}>
        <h2 id="hero-title" className={styles.heroTitle}>
          DevTutor Llama RAG Assistant
        </h2>
        <p className={styles.heroText}>
          Ask any question about Angular 18+ Signals, Standalone APIs, RxJS
          Interop, or advanced TypeScript generics. Responses are grounded
          directly in our verified markdown knowledge base.
        </p>

        <div className={styles.chips}>
          {QUESTIONS.map((question) => (
            <button
              key={question}
              type="button"
              data-question={question}
              onClick={pick}
              className={styles.chip}
            >
              <SparkIcon className={styles.chipIcon} />
              {question}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export const WelcomeCard = memo(WelcomeCardBase);
