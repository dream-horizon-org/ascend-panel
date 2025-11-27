import {
  useMutation,
  useQueryClient,
  UseMutationOptions,
} from "@tanstack/react-query";
import { api } from "../apiClient";
import { endpoints } from "../endpoints";
import {
  experimentKeys,
  Experiment,
} from "../queries/experiments";

// Types
export interface CreateExperimentRequest {
  name: string;
  experimentId: string;
  hypothesis: string;
  description?: string;
}

export interface UpdateExperimentRequest {
  name?: string;
  hypothesis?: string;
  description?: string;
}

export interface ConcludeExperimentRequest {
  winner: "Control Group" | "Variant 1";
}

// Response types
// API returns experiment wrapped in { data: Experiment }
export interface ExperimentMutationApiResponse {
  data: Experiment;
}

export type ExperimentMutationResponse = Experiment;

// Mutation functions
export const createExperiment = async (
  data: CreateExperimentRequest
): Promise<ExperimentMutationResponse> => {
  const response = await api.post<ExperimentMutationApiResponse>(
    endpoints.experiments.create,
    data
  );
  // API returns experiment wrapped in { data: Experiment }
  return response.data.data;
};

export const updateExperiment = async (
  id: string | number,
  data: UpdateExperimentRequest
): Promise<ExperimentMutationResponse> => {
  const response = await api.put<ExperimentMutationApiResponse>(
    endpoints.experiments.update(id),
    data
  );
  // API returns experiment wrapped in { data: Experiment }
  return response.data.data;
};

export const deleteExperiment = async (
  id: string | number
): Promise<{ message: string }> => {
  const response = await api.delete<{ data: { message: string } }>(
    endpoints.experiments.delete(id)
  );
  // API might return wrapped response
  return response.data.data || response.data;
};

export const concludeExperiment = async (
  id: string | number,
  data: ConcludeExperimentRequest
): Promise<ExperimentMutationResponse> => {
  const response = await api.post<ExperimentMutationApiResponse>(
    endpoints.experiments.declareWinner(id),
    data
  );
  // API returns experiment wrapped in { data: Experiment }
  return response.data.data;
};

export const cloneExperiment = async (
  id: string | number
): Promise<ExperimentMutationResponse> => {
  const response = await api.post<ExperimentMutationApiResponse>(
    endpoints.experiments.clone(id)
  );
  // API returns experiment wrapped in { data: Experiment }
  return response.data.data;
};

export const terminateExperiment = async (
  id: string | number
): Promise<ExperimentMutationResponse> => {
  const response = await api.post<ExperimentMutationApiResponse>(
    endpoints.experiments.terminate(id)
  );
  // API returns experiment wrapped in { data: Experiment }
  return response.data.data;
};

// React Query mutation hooks
export const useCreateExperiment = (
  options?: Omit<
    UseMutationOptions<ExperimentMutationResponse, Error, CreateExperimentRequest>,
    "mutationFn"
  >
) => {
  const queryClient = useQueryClient();

  return useMutation<ExperimentMutationResponse, Error, CreateExperimentRequest>({
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
  >
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

export const useDeleteExperiment = (
  options?: Omit<
    UseMutationOptions<{ message: string }, Error, string | number>,
    "mutationFn"
  >
) => {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, string | number>({
    mutationFn: deleteExperiment,
    onSuccess: () => {
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
  >
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

export const useCloneExperiment = (
  options?: Omit<
    UseMutationOptions<ExperimentMutationResponse, Error, string | number>,
    "mutationFn"
  >
) => {
  const queryClient = useQueryClient();

  return useMutation<ExperimentMutationResponse, Error, string | number>({
    mutationFn: cloneExperiment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: experimentKeys.lists() });
    },
    ...options,
  });
};

export const useTerminateExperiment = (
  options?: Omit<
    UseMutationOptions<ExperimentMutationResponse, Error, string | number>,
    "mutationFn"
  >
) => {
  const queryClient = useQueryClient();

  return useMutation<ExperimentMutationResponse, Error, string | number>({
    mutationFn: terminateExperiment,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: experimentKeys.detail(variables),
      });
      queryClient.invalidateQueries({ queryKey: experimentKeys.lists() });
    },
    ...options,
  });
};

