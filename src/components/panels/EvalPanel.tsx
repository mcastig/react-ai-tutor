import { LOSS_DELTA, SAMPLE_EVAL_RUNS, WORST_LOSS } from "@/lib/eval-runs";
import styles from "./panels.module.css";

const latest = SAMPLE_EVAL_RUNS[0];

/** Server component: this view is static, so none of it ships as JS. */
export function EvalPanel() {
  return (
    <div className={styles.view}>
      <header className={styles.viewHead}>
        <h2 className={styles.viewTitle}>Adapter runs</h2>
        <p className={styles.viewLead}>
          LoRA adapters trained on the Angular 18 and TypeScript 5.4 corpus,
          measured against the base instruct model.
        </p>
      </header>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <p className={styles.statLabel}>Eval loss</p>
          <p className={styles.statValue}>{latest.loss.toFixed(4)}</p>
          <p className={styles.statFoot}>{latest.label}</p>
        </div>
        <div className={styles.stat}>
          <p className={styles.statLabel}>Against base</p>
          <p className={`${styles.statValue} ${styles.statValueSignal}`}>
            {LOSS_DELTA}
          </p>
          <p className={styles.statFoot}>base-8b-instruct, Mar 2</p>
        </div>
        <div className={styles.stat}>
          <p className={styles.statLabel}>Grounded answers</p>
          <p className={styles.statValue}>
            {Math.round(latest.grounded * 100)}%
          </p>
          <p className={styles.statFoot}>graded on 250 held-out questions</p>
        </div>
        <div className={styles.stat}>
          <p className={styles.statLabel}>Steps</p>
          <p className={styles.statValue}>
            {latest.steps.toLocaleString("en-US")}
          </p>
          <p className={styles.statFoot}>rank 16, batch 8</p>
        </div>
      </div>

      <p className={styles.runsLabel}>Loss by run — shorter is better</p>
      <ul className={styles.runs}>
        {SAMPLE_EVAL_RUNS.map((run, index) => (
          <li
            key={run.id}
            className={index === 0 ? `${styles.run} ${styles.runLatest}` : styles.run}
          >
            <span className={styles.runName}>
              {run.label} <span className={styles.runDate}>{run.date}</span>
            </span>
            <span className={styles.runBar}>
              <span
                className={
                  index === 0
                    ? styles.runFill
                    : `${styles.runFill} ${styles.runFillPast}`
                }
                style={{ width: `${(run.loss / WORST_LOSS) * 100}%` }}
              />
            </span>
            <span className={styles.runLoss}>{run.loss.toFixed(4)}</span>
          </li>
        ))}
      </ul>

      <p className={styles.note}>
        Sample metrics from recorded runs. This view does not poll a live
        training job.
      </p>
    </div>
  );
}
