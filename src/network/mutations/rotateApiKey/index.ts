import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../apiClient";
import { endpoints } from "../../endpoints";
import { settingsKeys } from "../../queries/settingsKeys";
import type {
  RotateApiKeyRequest,
  RotateApiKeyResponse,
  RotateApiKeyApiResponse,
} from "./types";

// Mutation function
export const rotateApiKey = async (
  data: RotateApiKeyRequest,
): Promise<RotateApiKeyResponse> => {
  const response = await api.post<RotateApiKeyApiResponse>(
    endpoints.apiKeys.rotate(data.tenant_id, data.project_id, data.key_id),
    {},
  );
  return response.data.data;
};

// React Query mutation hook
export const useRotateApiKey = () => {
  const queryClient = useQueryClient();

  return useMutation<RotateApiKeyResponse, Error, RotateApiKeyRequest>({
    mutationFn: rotateApiKey,
    onSuccess: (_data, variables) => {
      // Invalidate API keys list for the project to refetch
      queryClient.invalidateQueries({
        queryKey: settingsKeys.apiKeys.list(
          variables.tenant_id,
          variables.project_id,
        ),
      });
      // Also invalidate the specific key detail
      queryClient.invalidateQueries({
        queryKey: settingsKeys.apiKeys.detail(
          variables.tenant_id,
          variables.project_id,
          variables.key_id,
        ),
      });
    },
  });
};

// Export types
export type { RotateApiKeyRequest, RotateApiKeyResponse } from "./types";
