// API response types (as received from API)
export interface Tenant {
  tenant_id: string;
  name: string;
  status: "ACTIVE" | "INACTIVE";
  created_at: string;
}

export interface TenantsApiResponse {
  data: {
    tenants: Tenant[];
  };
}

// Transformed response type (used in app)
export type TenantsResponse = Tenant[];
