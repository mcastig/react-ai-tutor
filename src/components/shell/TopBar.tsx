"use client";

import { useWorkspace, type View } from "@/components/providers";
import { CaretIcon, ChipIcon } from "@/components/icons";
import { AddDocButton } from "./AddDocButton";
import styles from "./shell.module.css";

const CRUMB: Record<View, string> = {
  chat: "Interactive Chat Tutor",
  knowledge: "RAG Knowledge Base",
  eval: "Fine-Tuning & Eval",
};

export function TopBar() {
  const { view } = useWorkspace();

  return (
    <header className={styles.topbar}>
      <span className={styles.crumbPill}>Active Mode</span>
      <CaretIcon className={styles.caret} />
      <h1 className={styles.crumbCurrent}>{CRUMB[view]}</h1>
      <span className={styles.crumbMeta}>
        <ChipIcon className={styles.crumbMetaIcon} />
        Model: Llama-3-8B-Instruct
      </span>
      <AddDocButton />
    </header>
  );
}
