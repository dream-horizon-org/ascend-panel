import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../apiClient";
import { endpoints } from "../../endpoints";
import { experimentKeys } from "../../queries/sharedKeys";
import { RestartExperimentRequest, RestartExperimentResponse } from "./types";

// API response wrapper
interface RestartExperimentApiResponse {
  data: RestartExperimentResponse;
}

// Mutation function
export const restartExperiment = async (
  id: string | number,
  data: RestartExperimentRequest,
): Promise<RestartExperimentResponse> => {
  const response = await api.patch<RestartExperimentApiResponse>(
    endpoints.experiments.update(id),
    data,
  );
  return response.data.data;
};

// React Query mutation hook
export const useRestartExperiment = () => {
  const queryClient = useQueryClient();

  return useMutation<
    RestartExperimentResponse,
    Error,
    { id: string | number; data: RestartExperimentRequest }
  >({
    mutationFn: ({ id, data }) => restartExperiment(id, data),
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
  RestartExperimentRequest,
  RestartExperimentResponse,
} from "./types";
