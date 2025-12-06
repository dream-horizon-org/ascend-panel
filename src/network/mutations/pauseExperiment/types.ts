// Types for Pause Experiment API
export interface PauseExperimentRequest {
  status: "PAUSED";
}

// Response type - reuse Experiment from queries
export type { Experiment as PauseExperimentResponse } from "../../queries/getExperimentDetails/types";
