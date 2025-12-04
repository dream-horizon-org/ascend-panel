import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { api } from "../../apiClient";
import { endpoints } from "../../endpoints";
import { settingsKeys } from "../settingsKeys";
import type { ProjectsApiResponse, ProjectsResponse } from "./types";
import { parseProjectsResponse } from "./parser";

// Fetch projects function
export const fetchProjects = async (
  tenantId: string,
): Promise<ProjectsResponse> => {
  const response = await api.get<ProjectsApiResponse>(
    endpoints.projects.list(tenantId),
  );
  return parseProjectsResponse(response.data);
};

// React Query hook for projects
export const useProjects = (
  tenantId: string,
  options?: Omit<
    UseQueryOptions<ProjectsResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<ProjectsResponse, Error>({
    queryKey: settingsKeys.projects.list(tenantId),
    queryFn: () => fetchProjects(tenantId),
    enabled: !!tenantId, // Only fetch when tenantId is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

// Export types
export type { Project, ProjectsApiResponse, ProjectsResponse } from "./types";
