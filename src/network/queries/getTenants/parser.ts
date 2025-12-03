import type { TenantsApiResponse, TenantsResponse } from "./types";

export const parseTenantsResponse = (
  response: TenantsApiResponse,
): TenantsResponse => {
  return response.data.tenants;
};
