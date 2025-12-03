import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../apiClient";
import { endpoints } from "../../endpoints";
import { settingsKeys } from "../../queries/settingsKeys";
import type {
  CreateProjectRequest,
  CreateProjectResponse,
  CreateProjectApiResponse,
} from "./types";

// Mutation function
export const createProject = async (
  data: CreateProjectRequest,
): Promise<CreateProjectResponse> => {
  const response = await api.post<CreateProjectApiResponse>(
    endpoints.projects.create(data.tenant_id),
    { name: data.name },
  );
  return response.data.data;
};

// React Query mutation hook
export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateProjectResponse, Error, CreateProjectRequest>({
    mutationFn: createProject,
    onSuccess: (_data, variables) => {
      // Invalidate projects list for the tenant to refetch
      queryClient.invalidateQueries({
        queryKey: settingsKeys.projects.list(variables.tenant_id),
      });
    },
  });
};

// Export types
export type { CreateProjectRequest, CreateProjectResponse } from "./types";
