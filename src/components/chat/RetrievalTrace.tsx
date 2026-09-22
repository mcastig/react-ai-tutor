"use client";

import type { CSSProperties } from "react";
import type { ScoredDoc } from "@/lib/corpus";
import { TerminalMark } from "@/components/icons";
import styles from "./chat.module.css";

/**
 * The receipt, drawn live: one bar per indexed doc, sized by how much of the
 * question actually landed in it.
 */
export function RetrievalTrace({ scores }: { scores: readonly ScoredDoc[] }) {
  return (
    <li className={styles.row}>
      <span className={styles.avatar}>
        <TerminalMark className={styles.avatarGlyph} />
      </span>

      <div className={styles.traceCard}>
        <p className={styles.traceHead}>
          scanning {scores.length} indexed docs
          <span className={styles.cursor} />
        </p>

        <ul className={styles.traceList}>
          {scores.map((score, index) => (
            <li key={score.file} className={styles.traceRow}>
              <span className={styles.traceFile}>{score.file}</span>
              <span className={styles.traceBar}>
                <span
                  className={styles.traceFill}
                  style={
                    {
                      "--i": index,
                      "--w": `${Math.round(6 + score.weight * 94)}%`,
                    } as CSSProperties
                  }
                />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}
