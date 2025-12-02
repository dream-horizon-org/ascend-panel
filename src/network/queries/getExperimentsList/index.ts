import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { api } from "../../apiClient";
import { endpoints } from "../../endpoints";
import { experimentKeys } from "../sharedKeys";
import type {
  ExperimentsResponse,
  ExperimentFilters,
  RawExperimentsApiResponse,
  TagsApiResponse,
} from "./types";
import { parseExperimentsResponse } from "./parser";

// Fetch experiments function
export const fetchExperiments = async (
  params?: ExperimentFilters,
): Promise<ExperimentsResponse> => {
  const response = await api.get<RawExperimentsApiResponse>(
    endpoints.experiments.list,
    {
      params,
    },
  );
  return parseExperimentsResponse(response.data);
};

// Fetch tags function
export const fetchTags = async (): Promise<string[]> => {
  const response = await api.get<TagsApiResponse>(endpoints.experiments.tags);
  return response.data.data.tags;
};

// React Query hook for experiments list
export const useExperiments = (params?: ExperimentFilters) => {
  return useQuery<ExperimentsResponse, Error>({
    queryKey: experimentKeys.list(params),
    queryFn: () => fetchExperiments(params),
  });
};

// Legacy alias for backwards compatibility
export const useExperimentsList = useExperiments;

// React Query hook for tags
export const useTags = (
  options?: Omit<UseQueryOptions<string[], Error>, "queryKey" | "queryFn">,
) => {
  return useQuery<string[], Error>({
    queryKey: experimentKeys.tags(),
    queryFn: fetchTags,
    staleTime: 10 * 60 * 1000, // 10 minutes - tags don't change often
    ...options,
  });
};

// Export types
export type {
  ExperimentsResponse,
  ExperimentFilters,
  Pagination,
  TagsApiResponse,
} from "./types";
