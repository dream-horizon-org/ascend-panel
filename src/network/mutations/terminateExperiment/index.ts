import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../apiClient";
import { endpoints } from "../../endpoints";
import { experimentKeys } from "../../queries/sharedKeys";
import {
  TerminateExperimentRequest,
  TerminateExperimentResponse,
} from "./types";

// API response wrapper
interface TerminateExperimentApiResponse {
  data: TerminateExperimentResponse;
}

// Mutation function
export const terminateExperiment = async (
  id: string | number,
  data: TerminateExperimentRequest,
): Promise<TerminateExperimentResponse> => {
  const response = await api.patch<TerminateExperimentApiResponse>(
    endpoints.experiments.update(id),
    data,
  );
  return response.data.data;
};

// React Query mutation hook
export const useTerminateExperiment = () => {
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
  });
};

// Export types
export type {
  TerminateExperimentRequest,
  TerminateExperimentResponse,
} from "./types";
