"use client";

import { useCorpus } from "@/components/providers";
import { DocIcon } from "@/components/icons";
import styles from "./panels.module.css";

export function KnowledgePanel() {
  const { docs } = useCorpus();

  return (
    <div className={styles.view}>
      <header className={styles.viewHead}>
        <h2 className={styles.viewTitle}>Corpus indexado</h2>
        <p className={styles.viewLead}>
          Cada respuesta del tutor sale de uno de estos archivos y cita la
          sección de la que procede. Usa <strong>Añadir doc</strong> para indexar
          un archivo markdown en esta sesión: queda consultable de inmediato.
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
                {doc.origin === "local" ? "local" : "indexado"}
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
