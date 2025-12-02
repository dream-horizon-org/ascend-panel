import type { Experiment } from "../getExperimentDetails/types";

// Response Types
export interface ExperimentsResponse {
  experiments: Experiment[];
  total: number;
  page: number;
  limit: number;
}
