import { useQuery } from "@tanstack/react-query";
import { api } from "../../apiClient";
import { endpoints } from "../../endpoints";
import { experimentKeys } from "../sharedKeys";
import type {
  ExperimentsResponse,
  ExperimentFilters,
  ExperimentsApiResponse,
} from "./types";
import { parseExperimentsResponse } from "./parser";
import { SERVICE_NAME } from "../../../utils/contants";

// Fetch experiments function
export const fetchExperiments = async (
  params?: ExperimentFilters,
): Promise<ExperimentsResponse> => {
  const response = await api.get<ExperimentsApiResponse>(
    endpoints.experiments.list,
    {
      params,
      headers: {
        service: SERVICE_NAME.EXPERIMENT,
      },
    },
  );
  return parseExperimentsResponse(response.data);
};

// React Query hook for experiments list
export const useExperiments = (params?: ExperimentFilters) => {
  return useQuery<ExperimentsResponse, Error>({
    queryKey: experimentKeys.list(params),
    queryFn: () => fetchExperiments(params),
    retry: 3, // Only retry once for faster error feedback
    retryDelay: 1000, // 1 second delay before retry
  });
};

// Legacy alias for backwards compatibility
export const useExperimentsList = useExperiments;

// Export types
export type {
  ExperimentsResponse,
  ExperimentFilters,
  Pagination,
} from "./types";
