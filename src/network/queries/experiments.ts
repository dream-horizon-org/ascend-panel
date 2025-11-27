import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { api } from "../apiClient";
import { endpoints } from "../endpoints";

// Types
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

export interface ExperimentApiResponse {
  data: Experiment;
}

export interface ExperimentsResponse {
  experiments: Experiment[];
  total: number;
  page: number;
  limit: number;
}

// API returns experiment wrapped in { data: Experiment }
export type ExperimentResponse = Experiment;

// Query keys
export const experimentKeys = {
  all: ["experiments"] as const,
  lists: () => [...experimentKeys.all, "list"] as const,
  list: (filters?: Record<string, any>) =>
    [...experimentKeys.lists(), filters] as const,
  details: () => [...experimentKeys.all, "detail"] as const,
  detail: (id: string | number) => [...experimentKeys.details(), id] as const,
};

// Fetch functions
export const fetchExperiments = async (
  params?: Record<string, any>
): Promise<ExperimentsResponse> => {
  const response = await api.get<ExperimentsResponse>(
    endpoints.experiments.list,
    {
      params,
    }
  );
  return response.data;
};

export const fetchExperiment = async (
  id: string | number
): Promise<ExperimentResponse> => {
  const response = await api.get<ExperimentApiResponse>(
    endpoints.experiments.detail(id)
  );
  // API returns experiment wrapped in { data: Experiment }
  return response.data.data;
};

// React Query hooks
export const useExperiments = (
  params?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<ExperimentsResponse, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<ExperimentsResponse, Error>({
    queryKey: experimentKeys.list(params),
    queryFn: () => fetchExperiments(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

export const useExperiment = (
  id: string | number | null,
  options?: Omit<
    UseQueryOptions<ExperimentResponse, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<ExperimentResponse, Error>({
    queryKey: experimentKeys.detail(id!),
    queryFn: () => fetchExperiment(id!),
    enabled: !!id, // Only fetch if id is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

