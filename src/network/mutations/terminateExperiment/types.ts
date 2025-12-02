// Types for Terminate Experiment API
export interface TerminateExperimentRequest {
  status: "TERMINATED";
}

export interface TerminateExperimentResponse {
  experiment_id: string;
  status: boolean;
}

