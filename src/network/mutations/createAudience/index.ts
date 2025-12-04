import { useMutation } from "@tanstack/react-query";
import apiClient from "../../apiClient";
import { endpoints } from "../../endpoints";

export interface CreateAudienceRequest {
  name: string;
  description: string;
  type: "STATIC" | "DYNAMIC";
  expireDate: number; // Unix timestamp
  sinkIds: number[];
}

export interface CreateAudienceResponse {
  data: number; // Returns just the audience ID
}

// Transform camelCase request to snake_case for API
const transformRequest = (data: CreateAudienceRequest) => ({
  name: data.name,
  description: data.description,
  type: data.type,
  expire_date: data.expireDate,
  sink_ids: data.sinkIds,
});

export const createAudience = async (
  data: CreateAudienceRequest,
): Promise<CreateAudienceResponse> => {
  const response = await apiClient.post<CreateAudienceResponse>(
    endpoints.audiences.create,
    transformRequest(data),
  );
  return response.data;
};

export const useCreateAudience = () => {
  return useMutation<CreateAudienceResponse, Error, CreateAudienceRequest>({
    mutationFn: createAudience,
  });
};
