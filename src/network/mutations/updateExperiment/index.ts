import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../apiClient";
import { endpoints } from "../../endpoints";
import { experimentKeys } from "../../queries/sharedKeys";
import { UpdateExperimentRequest, UpdateExperimentResponse } from "./types";

// API response wrapper
interface UpdateExperimentApiResponse {
  data: UpdateExperimentResponse;
}

// Mutation function
export const updateExperiment = async (
  id: string | number,
  data: UpdateExperimentRequest,
): Promise<UpdateExperimentResponse> => {
  const response = await api.patch<UpdateExperimentApiResponse>(
    endpoints.experiments.update(id),
    data,
  );
  return response.data.data;
};

// React Query mutation hook
export const useUpdateExperiment = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateExperimentResponse,
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
  });
};

// Export types
export type { UpdateExperimentRequest, UpdateExperimentResponse } from "./types";

