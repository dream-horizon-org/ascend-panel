import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { api } from "../apiClient";
import { endpoints } from "../endpoints";

// Types (camelCase - used throughout the app)
export interface VariantVariable {
  value: string;
  key: string;
  dataType: string;
}

export interface Variant {
  variables: VariantVariable[];
  display_name: string;
}

export interface VariantWeights {
  type: string;
  weights: Record<string, number>;
}

export interface RuleCondition {
  operand: string;
  operandDataType: string;
  operator: string;
  value: string;
}

export interface RuleAttribute {
  name: string;
  conditions: RuleCondition[];
}

export interface WinningVariant {
  p_value: number;
  variant: string;
}

export interface Experiment {
  experimentId: string;
  projectKey: string;
  name: string;
  key: string;
  description?: string;
  hypothesis: string;
  status: string; // "LIVE", "DRAFT", "PAUSED", "CONCLUDED", etc.
  type: string;
  guardrailHealthStatus?: string;
  cohorts: any[];
  variantWeights: VariantWeights;
  variants: Record<string, Variant>;
  ruleAttributes: RuleAttribute[];
  distributionStrategy: string;
  assignmentDomain: string;
  overrides: string[];
  winningVariant?: WinningVariant;
  exposure: number;
  threshold: number;
  startTime: number; // Unix timestamp
  endTime: number; // Unix timestamp
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  owners: string[];
}

export interface Pagination {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  hasNext: boolean;
}

export interface ExperimentApiResponse {
  data: Experiment;
}

export interface ExperimentsResponse {
  experiments: Experiment[];
  pagination: Pagination;
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

// API returns experiment wrapped in { data: Experiment }
export type ExperimentResponse = Experiment;

// Raw API response types (snake_case - as received from API)
interface RawExperiment {
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

interface RawPagination {
  current_page: number;
  page_size: number;
  total_count: number;
  has_next: boolean;
}

interface RawExperimentsApiResponse {
  data: {
    experiments: RawExperiment[];
    pagination: RawPagination;
  };
}

// Transform functions (snake_case to camelCase)
const transformExperiment = (raw: RawExperiment): Experiment => ({
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

const transformPagination = (raw: RawPagination): Pagination => ({
  currentPage: raw.current_page,
  pageSize: raw.page_size,
  totalCount: raw.total_count,
  hasNext: raw.has_next,
});

// Tags API response
export interface TagsApiResponse {
  data: {
    tags: string[];
  };
}

// Query keys
export const experimentKeys = {
  all: ["experiments"] as const,
  lists: () => [...experimentKeys.all, "list"] as const,
  list: (filters?: Record<string, any>) =>
    [...experimentKeys.lists(), filters] as const,
  details: () => [...experimentKeys.all, "detail"] as const,
  detail: (id: string | number) => [...experimentKeys.details(), id] as const,
  tags: () => [...experimentKeys.all, "tags"] as const,
};

// Fetch functions
export const fetchExperiments = async (
  params?: ExperimentFilters,
): Promise<ExperimentsResponse> => {
  const response = await api.get<RawExperimentsApiResponse>(
    endpoints.experiments.list,
    {
      params,
    },
  );
  const rawData = response.data.data;
  return {
    experiments: rawData.experiments.map(transformExperiment),
    pagination: transformPagination(rawData.pagination),
  };
};

export const fetchExperiment = async (
  id: string | number,
): Promise<ExperimentResponse> => {
  const response = await api.get<ExperimentApiResponse>(
    endpoints.experiments.detail(id),
  );
  // API returns experiment wrapped in { data: Experiment }
  return response.data.data;
};

export const fetchTags = async (): Promise<string[]> => {
  const response = await api.get<TagsApiResponse>(endpoints.experiments.tags);
  return response.data.data.tags;
};

// React Query hooks
export const useExperiments = (params?: ExperimentFilters) => {
  return useQuery<ExperimentsResponse, Error>({
    queryKey: experimentKeys.list(params),
    queryFn: () => fetchExperiments(params),
  });
};

export const useExperiment = (id: string | number | null) => {
  return useQuery<ExperimentResponse, Error>({
    queryKey: experimentKeys.detail(id!),
    queryFn: () => fetchExperiment(id!),
    enabled: !!id, // Only fetch if id is provided
  });
};

export const useTags = (
  options?: Omit<UseQueryOptions<string[], Error>, "queryKey" | "queryFn">,
) => {
  return useQuery<string[], Error>({
    queryKey: experimentKeys.tags(),
    queryFn: fetchTags,
    staleTime: 10 * 60 * 1000, // 10 minutes - tags don't change often
    ...options,
  });
};
