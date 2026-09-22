import { LOSS_DELTA, SAMPLE_EVAL_RUNS, WORST_LOSS } from "@/lib/eval-runs";
import styles from "./panels.module.css";

const latest = SAMPLE_EVAL_RUNS[0];

/** Server component: this view is static, so none of it ships as JS. */
export function EvalPanel() {
  return (
    <div className={styles.view}>
      <header className={styles.viewHead}>
        <h2 className={styles.viewTitle}>Ejecuciones de adaptadores</h2>
        <p className={styles.viewLead}>
          Adaptadores LoRA entrenados con el corpus de Angular 18 y TypeScript
          5.4, medidos frente al modelo instruct base.
        </p>
      </header>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <p className={styles.statLabel}>Pérdida de eval.</p>
          <p className={styles.statValue}>{latest.loss.toFixed(4)}</p>
          <p className={styles.statFoot}>{latest.label}</p>
        </div>
        <div className={styles.stat}>
          <p className={styles.statLabel}>Frente al base</p>
          <p className={`${styles.statValue} ${styles.statValueSignal}`}>
            {LOSS_DELTA}
          </p>
          <p className={styles.statFoot}>base-8b-instruct, 2 mar</p>
        </div>
        <div className={styles.stat}>
          <p className={styles.statLabel}>Respuestas fundamentadas</p>
          <p className={styles.statValue}>
            {Math.round(latest.grounded * 100)}%
          </p>
          <p className={styles.statFoot}>evaluadas en 250 preguntas reservadas</p>
        </div>
        <div className={styles.stat}>
          <p className={styles.statLabel}>Pasos</p>
          <p className={styles.statValue}>
            {latest.steps.toLocaleString("es-MX")}
          </p>
          <p className={styles.statFoot}>rango 16, lote 8</p>
        </div>
      </div>

      <p className={styles.runsLabel}>Pérdida por ejecución: más corto es mejor</p>
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
        Métricas de muestra de ejecuciones registradas. Esta vista no consulta
        ningún entrenamiento en curso.
      </p>
    </div>
  );
}
