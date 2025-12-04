// Request type
export interface CreateProjectRequest {
  tenant_id: string;
  name: string; // Validation: ^[a-z0-9-]+$, lowercase, no spaces
}

// API response types
export interface CreateProjectResponse {
  tenant_id: string;
  project_key: string;
  name: string;
  status: "ACTIVE";
}

export interface CreateProjectApiResponse {
  data: CreateProjectResponse;
}
