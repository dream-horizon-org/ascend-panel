import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../apiClient";
import { endpoints } from "../../endpoints";
import { experimentKeys } from "../../queries/sharedKeys";
import { ConcludeExperimentRequest, ConcludeExperimentResponse } from "./types";

// API response wrapper
interface ConcludeExperimentApiResponse {
  data: ConcludeExperimentResponse;
}

// Mutation function
export const concludeExperiment = async (
  id: string | number,
  data: ConcludeExperimentRequest,
): Promise<ConcludeExperimentResponse> => {
  const response = await api.patch<ConcludeExperimentApiResponse>(
    endpoints.experiments.update(id),
    data,
  );
  return response.data.data;
};

// React Query mutation hook
export const useConcludeExperiment = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ConcludeExperimentResponse,
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
  });
};

// Export types
export type {
  ConcludeExperimentRequest,
  ConcludeExperimentResponse,
} from "./types";
