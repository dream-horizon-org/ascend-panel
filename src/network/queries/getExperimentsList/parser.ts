import type { Experiment } from "../getExperimentDetails/types";
import type {
  ApiExperiment,
  ApiPagination,
  Pagination,
  ExperimentsApiResponse,
  ExperimentsResponse,
} from "./types";

// Transform functions (snake_case to camelCase)
export const transformExperiment = (api: ApiExperiment): Experiment => ({
  experimentId: api.experiment_id,
  projectKey: api.project_key,
  name: api.name,
  key: api.experiment_key,
  description: api.description,
  hypothesis: api.hypothesis,
  status: api.status,
  type: api.type,
  guardrailHealthStatus: api.guardrail_health_status,
  cohorts: api.cohorts,
  variantWeights: api.variant_weights,
  variants: api.variants,
  ruleAttributes: api.rule_attributes,
  distributionStrategy: api.distribution_strategy,
  assignmentDomain: api.assignment_domain,
  overrides: api.overrides,
  winningVariant: api.winning_variant
    ? { p_value: 0, variant: api.winning_variant.variant_name || "" }
    : undefined,
  exposure: api.exposure,
  threshold: api.threshold,
  startTime: api.start_time,
  endTime: api.end_time,
  createdBy: api.created_by,
  createdAt: api.created_at,
  updatedAt: api.updated_at,
  tags: api.tags ?? [],
  owners: api.owners ?? [],
});

export const transformPagination = (api: ApiPagination): Pagination => ({
  currentPage: api.current_page,
  pageSize: api.page_size,
  totalCount: api.total_count,
  hasNext: api.has_next,
});

export const parseExperimentsResponse = (
  response: ExperimentsApiResponse,
): ExperimentsResponse => {
  const data = response.data;
  return {
    experiments: data.experiments.map(transformExperiment),
    pagination: transformPagination(data.pagination),
  };
};
