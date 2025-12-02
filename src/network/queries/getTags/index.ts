import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { api } from "../../apiClient";
import { endpoints } from "../../endpoints";
import { experimentKeys } from "../sharedKeys";
import type { RawTagsApiResponse, TagsResponse } from "./types";
import { parseTagsResponse } from "./parser";

// Fetch tags function
export const fetchTags = async (): Promise<TagsResponse> => {
  const response = await api.get<RawTagsApiResponse>(
    endpoints.experiments.tags,
  );
  return parseTagsResponse(response.data);
};

// React Query hook for tags
export const useTags = (
  options?: Omit<UseQueryOptions<TagsResponse, Error>, "queryKey" | "queryFn">,
) => {
  return useQuery<TagsResponse, Error>({
    queryKey: experimentKeys.tags(),
    queryFn: fetchTags,
    staleTime: 10 * 60 * 1000, // 10 minutes - tags don't change often
    ...options,
  });
};

// Export types
export type { RawTagsApiResponse, TagsResponse } from "./types";
