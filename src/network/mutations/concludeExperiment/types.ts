// Types for Conclude Experiment API
export interface ConcludeExperimentWinningVariant {
  variant_name: string;
}

export interface ConcludeExperimentRequest {
  status: "CONCLUDED";
  winning_variant?: ConcludeExperimentWinningVariant;
}

// Response type - reuse Experiment from queries
export type { Experiment as ConcludeExperimentResponse } from "../../queries/getExperimentDetails/types";
