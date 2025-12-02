import type { Experiment } from "../getExperimentDetails/types";
import type {
  RawExperiment,
  RawPagination,
  Pagination,
  RawExperimentsApiResponse,
  ExperimentsResponse,
} from "./types";

// Transform functions (snake_case to camelCase)
export const transformExperiment = (raw: RawExperiment): Experiment => ({
  experimentId: raw.experiment_id,
  projectKey: raw.project_key,
  name: raw.name,
  key: raw.experiment_key,
  description: raw.description,
  hypothesis: raw.hypothesis,
  status: raw.status,
  type: raw.type,
  guardrailHealthStatus: raw.guardrail_health_status,
  cohorts: raw.cohorts,
  variantWeights: raw.variant_weights,
  variants: raw.variants,
  ruleAttributes: raw.rule_attributes,
  distributionStrategy: raw.distribution_strategy,
  assignmentDomain: raw.assignment_domain,
  overrides: raw.overrides,
  winningVariant: raw.winning_variant
    ? { p_value: 0, variant: raw.winning_variant.variant_name || "" }
    : undefined,
  exposure: raw.exposure,
  threshold: raw.threshold,
  startTime: raw.start_time,
  endTime: raw.end_time,
  createdBy: raw.created_by,
  createdAt: raw.created_at,
  updatedAt: raw.updated_at,
  tags: raw.tags ?? [],
  owners: raw.owners ?? [],
});

export const transformPagination = (raw: RawPagination): Pagination => ({
  currentPage: raw.current_page,
  pageSize: raw.page_size,
  totalCount: raw.total_count,
  hasNext: raw.has_next,
});

export const parseExperimentsResponse = (
  response: RawExperimentsApiResponse,
): ExperimentsResponse => {
  const rawData = response.data;
  return {
    experiments: rawData.experiments.map(transformExperiment),
    pagination: transformPagination(rawData.pagination),
  };
};
