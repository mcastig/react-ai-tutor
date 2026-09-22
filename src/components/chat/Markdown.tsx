import { Fragment } from "react";
import { readMarkdown, type Span } from "@/lib/markdown";
import styles from "./chat.module.css";

function spans(parts: Span[]) {
  return parts.map((part, index) => {
    if (part.kind === "strong") {
      return (
        <strong key={index} className={styles.mdStrong}>
          {part.text}
        </strong>
      );
    }
    if (part.kind === "code") {
      return (
        <code key={index} className={styles.mdCode}>
          {part.text}
        </code>
      );
    }
    return <Fragment key={index}>{part.text}</Fragment>;
  });
}

export function Markdown({ source }: { source: string }) {
  return (
    <>
      {readMarkdown(source).map((block) => {
        if (block.kind === "code") {
          return (
            <div key={block.key} className={styles.mdPre}>
              {block.lang !== "" ? (
                <span className={styles.mdLang}>{block.lang}</span>
              ) : null}
              <pre>
                <code className={styles.mdCodeBlock}>{block.code}</code>
              </pre>
            </div>
          );
        }

        if (block.kind === "ul") {
          return (
            <ul key={block.key} className={styles.mdList}>
              {block.items.map((item, index) => (
                <li key={index} className={styles.mdItem}>
                  {spans(item)}
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={block.key} className={styles.mdP}>
            {spans(block.spans)}
          </p>
        );
      })}
    </>
  );
}
