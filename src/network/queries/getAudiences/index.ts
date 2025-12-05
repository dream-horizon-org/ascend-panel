import { useQuery } from "@tanstack/react-query";
import { api } from "../../apiClient";
import { endpoints } from "../../endpoints";
import { audienceKeys } from "../sharedKeys";
import type { AudiencesResponse, AudienceFilters } from "./types";
import { parseAudiencesResponse } from "./parser";
import { SERVICE_NAME } from "../../../utils/contants";

export const fetchAudiences = async (
  params?: AudienceFilters
): Promise<AudiencesResponse> => {
  const response = await api.get<any>(
    endpoints.audiences.list,
    {
      params,
      headers: {
        service: SERVICE_NAME.AUDIENCE,
      },
    }
  );
  return parseAudiencesResponse(response.data);
};

export const useAudiences = (params?: AudienceFilters) => {
  return useQuery<AudiencesResponse, Error>({
    queryKey: audienceKeys.list(params),
    queryFn: () => fetchAudiences(params),
    retry: 3,
    retryDelay: 1000,
  });
};

export type { AudiencesResponse, AudienceFilters } from "./types";

