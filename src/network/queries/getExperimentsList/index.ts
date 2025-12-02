import { useQuery } from "@tanstack/react-query";
import { api } from "../../apiClient";
import { endpoints } from "../../endpoints";
import { experimentKeys } from "../sharedKeys";
import { ExperimentsResponse } from "./types";
import { parseExperimentsResponse } from "./parser";

// Fetch function
export const fetchExperiments = async (
  params?: Record<string, any>,
): Promise<ExperimentsResponse> => {
  const response = await api.get<ExperimentsResponse>(
    endpoints.experiments.list,
    {
      params,
    },
  );
  return parseExperimentsResponse(response);
};

// React Query hook
export const useExperimentsList = (params?: Record<string, any>) => {
  return useQuery<ExperimentsResponse, Error>({
    queryKey: experimentKeys.list(params),
    queryFn: () => fetchExperiments(params),
  });
};

// Export types
export type { ExperimentsResponse } from "./types";
