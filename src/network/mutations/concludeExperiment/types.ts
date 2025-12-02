// Types for Conclude Experiment API
export interface ConcludeExperimentRequest {
  status: "CONCLUDED";
}

// Response type - reuse Experiment from queries
export { Experiment as ConcludeExperimentResponse } from "../../queries/getExperimentDetails/types";

