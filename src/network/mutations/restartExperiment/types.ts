// Types for Restart Experiment API
export interface RestartExperimentRequest {
  status: "LIVE";
}

// Response type - reuse Experiment from queries
export type { Experiment as RestartExperimentResponse } from "../../queries/getExperimentDetails/types";
