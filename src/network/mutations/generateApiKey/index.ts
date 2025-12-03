import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../apiClient";
import { endpoints } from "../../endpoints";
import { settingsKeys } from "../../queries/settingsKeys";
import type {
  GenerateApiKeyRequest,
  GenerateApiKeyResponse,
  GenerateApiKeyApiResponse,
} from "./types";

// Mutation function
export const generateApiKey = async (
  data: GenerateApiKeyRequest,
): Promise<GenerateApiKeyResponse> => {
  const response = await api.post<GenerateApiKeyApiResponse>(
    endpoints.apiKeys.generate(data.tenant_id, data.project_id),
    { name: data.name },
  );
  return response.data.data;
};

// React Query mutation hook
export const useGenerateApiKey = () => {
  const queryClient = useQueryClient();

  return useMutation<GenerateApiKeyResponse, Error, GenerateApiKeyRequest>({
    mutationFn: generateApiKey,
    onSuccess: (_data, variables) => {
      // Invalidate API keys list for the project to refetch
      queryClient.invalidateQueries({
        queryKey: settingsKeys.apiKeys.list(
          variables.tenant_id,
          variables.project_id,
        ),
      });
    },
  });
};

// Export types
export type { GenerateApiKeyRequest, GenerateApiKeyResponse } from "./types";
