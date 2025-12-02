import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../apiClient";
import { endpoints } from "../../endpoints";
import { experimentKeys } from "../../queries/sharedKeys";
import { CreateExperimentRequest, CreateExperimentResponse } from "./types";

// API response wrapper
interface CreateExperimentApiResponse {
  data: CreateExperimentResponse;
}

// Mutation function
export const createExperiment = async (
  data: CreateExperimentRequest,
): Promise<CreateExperimentResponse> => {
  const response = await api.post<CreateExperimentApiResponse>(
    endpoints.experiments.create,
    data,
  );
  // API returns experiment wrapped in { data: Experiment }
  return response.data.data;
};

// React Query mutation hook
export const useCreateExperiment = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateExperimentResponse, Error, CreateExperimentRequest>({
    mutationFn: createExperiment,
    onSuccess: () => {
      // Invalidate experiments list to refetch
      queryClient.invalidateQueries({ queryKey: experimentKeys.lists() });
    },
  });
};

// Export types
export type { CreateExperimentRequest, CreateExperimentResponse } from "./types";

// Export parser
export { transformToRequestBody } from "./parser";
export type { ExperimentFormData } from "./parser";

