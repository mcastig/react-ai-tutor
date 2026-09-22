"use client";

import type { ChangeEvent, FormEvent, Ref } from "react";
import {
  memo,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { SendIcon } from "@/components/icons";
import styles from "./chat.module.css";

export type ComposerHandle = {
  fill: (question: string) => void;
};

type ComposerProps = {
  onSend: (question: string) => void;
  busy: boolean;
  ref?: Ref<ComposerHandle>;
};

/** The draft lives here so a keystroke never re-renders the message log. */
function ComposerBase({ onSend, busy, ref }: ComposerProps) {
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(
    ref,
    () => ({
      fill(question) {
        setDraft(question);
        inputRef.current?.focus();
      },
    }),
    [],
  );

  const change = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setDraft(event.target.value);
  }, []);

  const submit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const question = draft.trim();
      if (question === "") return;
      setDraft("");
      onSend(question);
    },
    [draft, onSend],
  );

  return (
    <form className={styles.composer} onSubmit={submit}>
      <label className={styles.srOnly} htmlFor="ask">
        Ask DevTutor Bot a question
      </label>
      <input
        id="ask"
        ref={inputRef}
        className={styles.input}
        value={draft}
        onChange={change}
        disabled={busy}
        autoComplete="off"
        placeholder="Ask about Angular Signals, Generics, Standalone routing..."
      />
      <button
        type="submit"
        className={styles.send}
        disabled={busy || draft.trim() === ""}
      >
        Send
        <SendIcon className={styles.sendIcon} />
      </button>
    </form>
  );
}

export const Composer = memo(ComposerBase);
