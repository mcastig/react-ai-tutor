"use client";

import type { MouseEvent } from "react";
import { useCallback } from "react";
import { useCorpus, useWorkspace, type View } from "@/components/providers";
import { LOSS_DELTA } from "@/lib/eval-runs";
import { BookIcon, ChatIcon, GaugeIcon } from "@/components/icons";
import styles from "./shell.module.css";

export function NavList() {
  const { view, setView } = useWorkspace();
  const { docs } = useCorpus();

  const select = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      setView(event.currentTarget.dataset.view as View);
    },
    [setView],
  );

  return (
    <nav className={styles.nav} aria-label="Espacio de trabajo">
      <button
        type="button"
        data-view="chat"
        onClick={select}
        aria-current={view === "chat" ? "page" : undefined}
        className={
          view === "chat"
            ? `${styles.navItem} ${styles.navItemActive}`
            : styles.navItem
        }
      >
        <ChatIcon className={styles.navIcon} />
        <span className={styles.navLabel}>Tutor de chat</span>
        <span className={`${styles.badge} ${styles.badgeSignal}`}>RAG activo</span>
      </button>

      <button
        type="button"
        data-view="knowledge"
        onClick={select}
        aria-current={view === "knowledge" ? "page" : undefined}
        className={
          view === "knowledge"
            ? `${styles.navItem} ${styles.navItemActive}`
            : styles.navItem
        }
      >
        <BookIcon className={styles.navIcon} />
        <span className={styles.navLabel}>Base de conocimiento</span>
        <span className={styles.badge}>{docs.length} docs</span>
      </button>

      <button
        type="button"
        data-view="eval"
        onClick={select}
        aria-current={view === "eval" ? "page" : undefined}
        className={
          view === "eval"
            ? `${styles.navItem} ${styles.navItemActive}`
            : styles.navItem
        }
      >
        <GaugeIcon className={styles.navIcon} />
        <span className={styles.navLabel}>Ajuste y evaluación</span>
        <span
          className={`${styles.badge} ${styles.badgeSignal}`}
          title="Pérdida de evaluación frente al modelo base"
        >
          {LOSS_DELTA}
        </span>
      </button>
    </nav>
  );
}
