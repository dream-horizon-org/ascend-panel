import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { api } from "../../apiClient";
import { endpoints } from "../../endpoints";
import { settingsKeys } from "../settingsKeys";
import type { TenantsApiResponse, TenantsResponse } from "./types";
import { parseTenantsResponse } from "./parser";

// Fetch tenants function
export const fetchTenants = async (): Promise<TenantsResponse> => {
  const response = await api.get<TenantsApiResponse>(endpoints.tenants.list);
  return parseTenantsResponse(response.data);
};

// React Query hook for tenants
export const useTenants = (
  options?: Omit<
    UseQueryOptions<TenantsResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<TenantsResponse, Error>({
    queryKey: settingsKeys.tenants.list(),
    queryFn: fetchTenants,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

// Export types
export type { Tenant, TenantsApiResponse, TenantsResponse } from "./types";
