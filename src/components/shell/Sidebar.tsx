import { TerminalMark } from "@/components/icons";
import { NavList } from "./NavList";
import styles from "./shell.module.css";

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span className={styles.mark}>
          <TerminalMark className={styles.markGlyph} />
        </span>
        <div className={styles.brandText}>
          <div className={styles.brandLine}>
            <span className={styles.brandName}>DevTutor Bot</span>
            <span className={styles.badge}>Llama 3</span>
          </div>
          <p className={styles.brandTag}>Angular &amp; TypeScript AI Mentor</p>
        </div>
      </div>

      <div className={styles.rule} />

      <NavList />

      <div className={styles.engine}>
        <div className={styles.engineTop}>
          <span className={styles.dot} />
          <span className={styles.engineName}>Llama 3 + RAG Engine</span>
          <span className={styles.engineVersion}>v1.8.4</span>
        </div>
        <p className={styles.engineBody}>
          Corpus indexed:{" "}
          <span className={styles.engineStrong}>Angular 18 &amp; TS 5.4</span>
          <br />
          Retrieval runs on-device, in this tab.
        </p>
      </div>
    </aside>
  );
}
