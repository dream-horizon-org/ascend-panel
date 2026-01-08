// Status types
export type TenantStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";
export type ProjectStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";
export type ApiKeyStatus = "ACTIVE" | "INACTIVE" | "REVOKED";

// Generic response wrapper
export interface SuccessResponseWrapper<T> {
  data: T;
}

// Pagination
export interface Pagination {
  current_page: number;
  page_size: number;
  total_count: number;
}

// Tenant types
export interface TenantCreateRequest {
  name: string;
  description?: string;
  contact_email: string;
}

export interface TenantSummary {
  tenant_id: string;
  name: string;
  contact_email: string;
}

export interface TenantDetails extends TenantSummary {
  description?: string;
  status: TenantStatus;
  created_at: string;
  updated_at: string;
}

export interface TenantCreateResponse {
  tenant_id: string;
  name: string;
  status: TenantStatus;
  created_at: string;
}

export interface TenantsListResponse {
  tenants: TenantSummary[];
  pagination: Pagination;
}

// Project types
export interface ProjectCreateRequest {
  name: string;
}

export interface ProjectSummary {
  project_id: string;
  tenant_id: string;
  project_key: string;
  name: string;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
  api_key?: string;
  api_key_id?: string;
  api_key_name?: string;
  api_key_status?: ApiKeyStatus;
  last_rotated_at?: string | null;
  last_used_at?: string | null;
  api_key_created_at?: string;
}

export interface ProjectCreateResponse {
  tenant_id: string;
  project_id: string;
  project_key: string;
  name: string;
  status: ProjectStatus;
  api_key: string;
  api_key_id: string;
  api_key_name: string;
}

export interface ProjectsListResponse {
  projects: ProjectSummary[];
  pagination: Pagination;
}

export interface ProjectDetailsResponse {
  project_id: string;
  tenant_id: string;
  name: string;
  created_at: string;
  updated_at: string;
  description?: string;
  stats_engine?: "ORG_DEFAULT" | "BAYESIAN" | "FREQUENTIST";
}

export interface ProjectUpdateRequest {
  description?: string;
  stats_engine?: "ORG_DEFAULT" | "BAYESIAN" | "FREQUENTIST";
}

// API Key types
export interface ApiKeyGenerateRequest {
  name?: string;
}

export interface ApiKeyGenerateResponse {
  key_id: string;
  name: string;
  api_key: string;
  created_at: string;
}

export interface ApiKeyRotateResponse {
  key_id: string;
  name: string;
  api_key: string;
  rotated_at: string;
}

export interface ApiKeyMetadataResponse {
  key_id: string;
  project_id: string;
  project_key: string;
  name: string;
  status: ApiKeyStatus;
  created_at: string;
  last_rotated_at: string | null;
}

