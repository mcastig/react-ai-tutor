"use client";

import type { ChangeEvent } from "react";
import { useCallback, useRef, useState } from "react";
import { useCorpus } from "@/components/providers";
import { UploadIcon } from "@/components/icons";
import styles from "./shell.module.css";

const MAX_BYTES = 512_000;

export function AddDocButton() {
  const { addDoc, lastAdded } = useCorpus();
  const inputRef = useRef<HTMLInputElement>(null);
  const [problem, setProblem] = useState("");

  const openPicker = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleFile = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (file === undefined) return;

      if (file.size > MAX_BYTES) {
        setProblem("File is over 500 KB — split it and add the part you need.");
        return;
      }

      setProblem("");
      addDoc(file.name, await file.text());
    },
    [addDoc],
  );

  return (
    <div className={styles.addDocWrap}>
      <span className={styles.addDocNote} role="status">
        {problem !== "" ? problem : null}
        {problem === "" && lastAdded !== null
          ? `indexed ${lastAdded.file}`
          : null}
      </span>

      <input
        ref={inputRef}
        type="file"
        accept=".md,.markdown,.txt,text/markdown,text/plain"
        className={styles.hiddenInput}
        onChange={handleFile}
        tabIndex={-1}
        aria-hidden="true"
      />

      <button type="button" className={styles.addDoc} onClick={openPicker}>
        <UploadIcon className={styles.addDocIcon} />
        Add Doc
      </button>
    </div>
  );
}
