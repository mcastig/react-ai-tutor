"use client";

import { useCorpus } from "@/components/providers";
import { DocIcon } from "@/components/icons";
import styles from "./panels.module.css";

export function KnowledgePanel() {
  const { docs } = useCorpus();

  return (
    <div className={styles.view}>
      <header className={styles.viewHead}>
        <h2 className={styles.viewTitle}>Indexed corpus</h2>
        <p className={styles.viewLead}>
          Every answer in Chat Tutor is drawn from one of these files and cites
          the section it came from. Use <strong>Add Doc</strong> to index a
          markdown file for this session — it becomes retrievable immediately.
        </p>
      </header>

      <ul className={styles.docs}>
        {docs.map((doc) => (
          <li key={doc.id} className={styles.doc}>
            <div className={styles.docHead}>
              <DocIcon className={styles.docIcon} />
              <span className={styles.docFile}>{doc.file}</span>
              <span
                className={
                  doc.origin === "local"
                    ? `${styles.docTag} ${styles.docTagLocal}`
                    : styles.docTag
                }
              >
                {doc.origin}
              </span>
            </div>

            <h3 className={styles.docTitle}>{doc.title}</h3>
            <p className={styles.docSummary}>{doc.summary}</p>

            <ul className={styles.chunks}>
              {doc.chunks.map((chunk) => (
                <li key={chunk.section} className={styles.chunk}>
                  §{chunk.section}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
