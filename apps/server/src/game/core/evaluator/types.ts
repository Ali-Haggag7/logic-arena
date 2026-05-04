/** Shared mutable counter passed by reference across the entire tick execution stack. */
export interface OpsCounter {
  count: number;
  /** Set to true after the first TLE warning to suppress duplicate log spam. */
  warned?: boolean;
}

export interface EvaluatorConstants {
  MAX_WHILE_ITERS: number;
  /** Hard cap on AST-node evaluations per tick — hardware-independent. */
  MAX_OPERATIONS_PER_TICK: number;
}

export const CONSTANTS: EvaluatorConstants = {
  MAX_WHILE_ITERS: 10,
  MAX_OPERATIONS_PER_TICK: 2000,
};
