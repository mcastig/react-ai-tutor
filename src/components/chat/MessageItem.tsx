"use client";

import { memo } from "react";
import type { ChatMessage } from "@/lib/chat";
import { DocIcon, TerminalMark } from "@/components/icons";
import { Markdown } from "./Markdown";
import styles from "./chat.module.css";

function MessageItemBase({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <li className={isUser ? `${styles.row} ${styles.rowUser}` : styles.row}>
      {isUser ? null : (
        <span className={styles.avatar}>
          <TerminalMark className={styles.avatarGlyph} />
        </span>
      )}

      <div
        className={
          isUser ? `${styles.bubble} ${styles.bubbleUser}` : styles.bubble
        }
      >
        <div className={styles.bubbleHead}>
          <span className={styles.author}>
            {isUser ? "You" : "DevTutor Bot (Llama + RAG)"}
          </span>
          <span className={styles.time}>{message.time}</span>
        </div>

        <div className={styles.body}>
          <Markdown source={message.text} />
        </div>

        {message.citations.length > 0 ? (
          <div className={styles.cites}>
            <span className={styles.citesLabel}>Grounded in</span>
            {message.citations.map((citation) => (
              <span key={citation.section} className={styles.cite}>
                <DocIcon className={styles.citeIcon} />
                {citation.file}
                <span className={styles.citeSection}>§{citation.section}</span>
              </span>
            ))}
            <span className={styles.citeScore}>
              match {message.match.toFixed(2)}
            </span>
          </div>
        ) : null}
      </div>
    </li>
  );
}

export const MessageItem = memo(MessageItemBase);
