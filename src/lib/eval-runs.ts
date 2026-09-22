/**
 * Sample metrics from the adapter runs shown in the Fine-Tuning & Eval view.
 * Static demo data — nothing here is read from a live training job.
 */

export type EvalRun = {
  id: string;
  label: string;
  date: string;
  /** Eval loss, lower is better. */
  loss: number;
  /** Share of answers a grader judged grounded in a retrieved chunk. */
  grounded: number;
  steps: number;
};

/** Newest run first. */
export const SAMPLE_EVAL_RUNS: readonly EvalRun[] = [
  {
    id: "r4",
    label: "ng18-lora-r16",
    date: "Mar 14",
    loss: 0.7118,
    grounded: 0.94,
    steps: 1800,
  },
  {
    id: "r3",
    label: "ng18-lora-r8",
    date: "Mar 11",
    loss: 0.8306,
    grounded: 0.9,
    steps: 1200,
  },
  {
    id: "r2",
    label: "ts54-mix",
    date: "Mar 6",
    loss: 0.9041,
    grounded: 0.86,
    steps: 900,
  },
  {
    id: "r1",
    label: "base-8b-instruct",
    date: "Mar 2",
    loss: 0.917,
    grounded: 0.71,
    steps: 0,
  },
];

const latest = SAMPLE_EVAL_RUNS[0];
const base = SAMPLE_EVAL_RUNS[SAMPLE_EVAL_RUNS.length - 1];

/** Headline delta in the sidebar badge: latest run against the base model. */
export const LOSS_DELTA = `${(((latest.loss - base.loss) / base.loss) * 100).toFixed(2)}%`;

export const WORST_LOSS = base.loss;
