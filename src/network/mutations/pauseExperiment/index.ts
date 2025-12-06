import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../apiClient";
import { endpoints } from "../../endpoints";
import { experimentKeys } from "../../queries/sharedKeys";
import { PauseExperimentRequest, PauseExperimentResponse } from "./types";

// API response wrapper
interface PauseExperimentApiResponse {
  data: PauseExperimentResponse;
}

// Mutation function
export const pauseExperiment = async (
  id: string | number,
  data: PauseExperimentRequest,
): Promise<PauseExperimentResponse> => {
  const response = await api.patch<PauseExperimentApiResponse>(
    endpoints.experiments.update(id),
    data,
  );
  return response.data.data;
};

// React Query mutation hook
export const usePauseExperiment = () => {
  const queryClient = useQueryClient();

  return useMutation<
    PauseExperimentResponse,
    Error,
    { id: string | number; data: PauseExperimentRequest }
  >({
    mutationFn: ({ id, data }) => pauseExperiment(id, data),
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
  PauseExperimentRequest,
  PauseExperimentResponse,
} from "./types";

