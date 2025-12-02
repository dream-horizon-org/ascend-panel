import type {
  Experiment,
  VariantWeights,
  Variant,
  RuleAttribute,
} from "../getExperimentDetails/types";

// Pagination types
export interface Pagination {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  hasNext: boolean;
}

// Filter params for experiments list API
export interface ExperimentFilters {
  name?: string;
  status?: string; // comma-separated for multiple
  tag?: string; // comma-separated for multiple
  owner?: string;
  type?: string;
  limit?: number;
  page?: number;
}

// Response Types
export interface ExperimentsResponse {
  experiments: Experiment[];
  pagination: Pagination;
}

// Raw API response types (snake_case - as received from API)
export interface RawExperiment {
  experiment_id: string;
  project_key: string;
  name: string;
  experiment_key: string;
  description?: string;
  hypothesis: string;
  status: string;
  type: string;
  guardrail_health_status?: string;
  cohorts: any[];
  variant_weights: VariantWeights;
  variants: Record<string, Variant>;
  rule_attributes: RuleAttribute[];
  distribution_strategy: string;
  assignment_domain: string;
  overrides: string[];
  winning_variant?: { variant_name: string | null };
  exposure: number;
  threshold: number;
  start_time: number;
  end_time: number;
  created_by: string;
  created_at: string;
  updated_at: string;
  tags?: string[];
  owners?: string[];
}

export interface RawPagination {
  current_page: number;
  page_size: number;
  total_count: number;
  has_next: boolean;
}

export interface RawExperimentsApiResponse {
  data: {
    experiments: RawExperiment[];
    pagination: RawPagination;
  };
}
