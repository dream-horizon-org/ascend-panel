import {
  useMutation,
  useQueryClient,
  UseMutationOptions,
} from "@tanstack/react-query";
import { api } from "../apiClient";
import { endpoints } from "../endpoints";
import { experimentKeys, Experiment } from "../queries/experiments";

// Types
export interface CreateExperimentRequest {
  name: string;
  experimentId: string;
  hypothesis: string;
  description?: string;
}

export interface UpdateExperimentMetrics {
  primary?: string[];
  secondary?: string[];
}

export interface UpdateExperimentVariantVariable {
  data_type: string;
  value: string;
  key: string;
}

export interface UpdateExperimentVariant {
  display_name: string;
  variables: UpdateExperimentVariantVariable[];
}

export interface UpdateExperimentRuleCondition {
  operand: string;
  operandDataType: string;
  operator: string;
  value: string;
}

export interface UpdateExperimentRuleAttribute {
  name: string;
  conditions: UpdateExperimentRuleCondition[];
}

export interface UpdateExperimentVariantWeights {
  type: string;
}

export interface UpdateExperimentWinningVariant {
  variant_name: string;
}

export interface UpdateExperimentRequest {
  name?: string;
  experiment_key?: string;
  metrics?: UpdateExperimentMetrics;
  tags?: string[];
  owner?: string[];
  description?: string;
  hypothesis?: string;
  status?: string;
  type?: string;
  assignment_domain?: string;
  distribution_strategy?: string;
  guardrail_health_status?: string;
  cohorts?: string[];
  variant_weights?: UpdateExperimentVariantWeights;
  variants?: Record<string, UpdateExperimentVariant>;
  rule_attributes?: UpdateExperimentRuleAttribute[];
  overrides?: string[];
  winning_variant?: UpdateExperimentWinningVariant;
  exposure?: number;
  threshold?: number;
  start_time?: number;
  end_time?: number;
  updated_by?: string;
}

export interface ConcludeExperimentRequest {
  status: "CONCLUDED";
}

export interface TerminateExperimentRequest {
  status: "TERMINATED";
}

// Response types
// API returns experiment wrapped in { data: Experiment }
export interface ExperimentMutationApiResponse {
  data: Experiment;
}

export type ExperimentMutationResponse = Experiment;

// Terminate experiment response
export interface TerminateExperimentApiResponse {
  data: {
    experiment_id: string;
    status: boolean;
  };
}

export interface TerminateExperimentResponse {
  experiment_id: string;
  status: boolean;
}

// Mutation functions
export const createExperiment = async (
  data: CreateExperimentRequest,
): Promise<ExperimentMutationResponse> => {
  const response = await api.post<ExperimentMutationApiResponse>(
    endpoints.experiments.create,
    data,
  );
  // API returns experiment wrapped in { data: Experiment }
  return response.data.data;
};

export const updateExperiment = async (
  id: string | number,
  data: UpdateExperimentRequest,
): Promise<ExperimentMutationResponse> => {
  const response = await api.patch<ExperimentMutationApiResponse>(
    endpoints.experiments.update(id),
    data,
  );
  // API returns experiment wrapped in { data: Experiment }
  return response.data.data;
};

export const concludeExperiment = async (
  id: string | number,
  data: ConcludeExperimentRequest,
): Promise<ExperimentMutationResponse> => {
  const response = await api.patch<ExperimentMutationApiResponse>(
    endpoints.experiments.update(id),
    data,
  );
  // API returns experiment wrapped in { data: Experiment }
  return response.data.data;
};

export const terminateExperiment = async (
  id: string | number,
  data: TerminateExperimentRequest,
): Promise<TerminateExperimentResponse> => {
  const response = await api.patch<TerminateExperimentApiResponse>(
    endpoints.experiments.terminate(id),
    data,
  );
  // API returns { data: { experiment_id: string, status: boolean } }
  return response.data.data;
};

// React Query mutation hooks
export const useCreateExperiment = (
  options?: Omit<
    UseMutationOptions<
      ExperimentMutationResponse,
      Error,
      CreateExperimentRequest
    >,
    "mutationFn"
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation<
    ExperimentMutationResponse,
    Error,
    CreateExperimentRequest
  >({
    mutationFn: createExperiment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: experimentKeys.lists() });
    },
    ...options,
  });
};

export const useUpdateExperiment = (
  options?: Omit<
    UseMutationOptions<
      ExperimentMutationResponse,
      Error,
      { id: string | number; data: UpdateExperimentRequest }
    >,
    "mutationFn"
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation<
    ExperimentMutationResponse,
    Error,
    { id: string | number; data: UpdateExperimentRequest }
  >({
    mutationFn: ({ id, data }) => updateExperiment(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: experimentKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: experimentKeys.lists() });
    },
    ...options,
  });
};

export const useConcludeExperiment = (
  options?: Omit<
    UseMutationOptions<
      ExperimentMutationResponse,
      Error,
      { id: string | number; data: ConcludeExperimentRequest }
    >,
    "mutationFn"
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation<
    ExperimentMutationResponse,
    Error,
    { id: string | number; data: ConcludeExperimentRequest }
  >({
    mutationFn: ({ id, data }) => concludeExperiment(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: experimentKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: experimentKeys.lists() });
    },
    ...options,
  });
};

export const useTerminateExperiment = (
  options?: Omit<
    UseMutationOptions<
      TerminateExperimentResponse,
      Error,
      { id: string | number; data: TerminateExperimentRequest }
    >,
    "mutationFn"
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation<
    TerminateExperimentResponse,
    Error,
    { id: string | number; data: TerminateExperimentRequest }
  >({
    mutationFn: ({ id, data }) => terminateExperiment(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: experimentKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: experimentKeys.lists() });
    },
    ...options,
  });
};
