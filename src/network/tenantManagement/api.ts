import { AxiosError } from "axios";
import { api } from "../apiClient";
import { SERVICE_NAME } from "../../utils/contants";
import {
  TenantCreateRequest,
  TenantCreateResponse,
  TenantsListResponse,
  TenantDetails,
  ProjectCreateRequest,
  ProjectCreateResponse,
  ProjectsListResponse,
  ProjectDetailsResponse,
  ProjectUpdateRequest,
  ApiKeyGenerateRequest,
  ApiKeyGenerateResponse,
  ApiKeyRotateResponse,
  ApiKeyMetadataResponse,
  SuccessResponseWrapper,
} from "./types";

// Error response format from API
interface ApiErrorResponse {
  error: {
    message: string;
    code: string;
    cause?: string;
  };
}

// Error class for API errors
export class TenantApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string,
    public cause?: string,
  ) {
    super(message);
    this.name = "TenantApiError";
  }
}

// Helper to handle API errors
const handleApiError = (error: unknown): never => {
  if (error instanceof AxiosError) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const status = axiosError.response?.status || 500;
    const errorData = axiosError.response?.data;
    // Handle new error format: { error: { message, code, cause? } }
    if (errorData?.error) {
      throw new TenantApiError(
        status,
        errorData.error.message,
        errorData.error.code,
        errorData.error.cause,
      );
    }

    // Fallback for old format or network errors
    const message =
      errorData?.error?.message || axiosError.message || "An error occurred";
    throw new TenantApiError(status, message);
  }
  throw new TenantApiError(500, "An unexpected error occurred");
};

// Helper to create request config with tenant management service
const getTenantConfig = () => ({
  headers: {
    service: SERVICE_NAME.TENANT_MANAGEMENT,
  },
});

/**
 * Wrapper function for tenant management API calls
 * This implements the Higher-Order Function (HOF) / Wrapper pattern
 * to provide consistent error handling and service configuration
 *
 * Automatically injects the tenant management service config into all API calls
 *
 * @param apiCall - A function that accepts a config parameter and returns a Promise with the API response
 * @returns The unwrapped response data
 */
async function withTenantApi<T>(
  apiCall: (config: { headers: { service: string } }) => Promise<{ data: T }>,
): Promise<T> {
  try {
    const response = await apiCall(getTenantConfig());
    return response.data;
  } catch (error) {
    handleApiError(error);
    // This will never be reached as handleApiError always throws
    return undefined as never;
  }
}

export const tenantManagementApi = {
  // Tenant Management
  async createTenant(
    payload: TenantCreateRequest,
  ): Promise<SuccessResponseWrapper<TenantCreateResponse>> {
    return withTenantApi((config) =>
      api.post<SuccessResponseWrapper<TenantCreateResponse>>(
        "/tenants",
        payload,
        config,
      ),
    );
  },

  async getTenants(params?: {
    page?: number;
    limit?: number;
  }): Promise<SuccessResponseWrapper<TenantsListResponse>> {
    return withTenantApi((config) =>
      api.get<SuccessResponseWrapper<TenantsListResponse>>("/tenants", {
        ...config,
        params,
      }),
    );
  },

  async getTenantDetails(
    tenant_id: string,
  ): Promise<SuccessResponseWrapper<TenantDetails>> {
    return withTenantApi((config) =>
      api.get<SuccessResponseWrapper<TenantDetails>>(
        `/tenants/${tenant_id}`,
        config,
      ),
    );
  },

  // Project Management
  async createProject(
    tenant_id: string,
    payload: ProjectCreateRequest,
  ): Promise<SuccessResponseWrapper<ProjectCreateResponse>> {
    return withTenantApi((config) =>
      api.post<SuccessResponseWrapper<ProjectCreateResponse>>(
        `/tenants/${tenant_id}/projects`,
        payload,
        config,
      ),
    );
  },

  async getProjects(
    tenant_id: string,
    params?: { page?: number; limit?: number },
  ): Promise<SuccessResponseWrapper<ProjectsListResponse>> {
    return withTenantApi((config) =>
      api.get<SuccessResponseWrapper<ProjectsListResponse>>(
        `/tenants/${tenant_id}/projects`,
        { ...config, params },
      ),
    );
  },

  async getProjectDetails(
    tenant_id: string,
    project_id: string,
  ): Promise<SuccessResponseWrapper<ProjectDetailsResponse>> {
    return withTenantApi((config) =>
      api.get<SuccessResponseWrapper<ProjectDetailsResponse>>(
        `/tenants/${tenant_id}/projects/${project_id}`,
        config,
      ),
    );
  },

  async updateProjectSettings(
    tenant_id: string,
    project_id: string,
    payload: ProjectUpdateRequest,
  ): Promise<SuccessResponseWrapper<ProjectDetailsResponse>> {
    return withTenantApi((config) =>
      api.patch<SuccessResponseWrapper<ProjectDetailsResponse>>(
        `/tenants/${tenant_id}/projects/${project_id}`,
        payload,
        config,
      ),
    );
  },

  // API Key Management
  async generateApiKey(
    tenant_id: string,
    project_id: string,
    payload?: ApiKeyGenerateRequest,
  ): Promise<SuccessResponseWrapper<ApiKeyGenerateResponse>> {
    return withTenantApi((config) =>
      api.post<SuccessResponseWrapper<ApiKeyGenerateResponse>>(
        `/tenants/${tenant_id}/projects/${project_id}/api-keys`,
        payload || {},
        config,
      ),
    );
  },

  async rotateApiKey(
    tenant_id: string,
    project_id: string,
    key_id: string,
  ): Promise<SuccessResponseWrapper<ApiKeyRotateResponse>> {
    return withTenantApi((config) =>
      api.post<SuccessResponseWrapper<ApiKeyRotateResponse>>(
        `/tenants/${tenant_id}/projects/${project_id}/api-keys/${key_id}/rotate`,
        undefined,
        config,
      ),
    );
  },

  /**
   * Get API key metadata for a project
   * Note: This endpoint doesn't exist in the OpenAPI spec, but we keep it for backward compatibility
   * The spec shows API keys are included in ListProjectsResponse
   * This method is deprecated - use getApiKey() with a key_id instead
   */
  async getProjectApiKey(
    _tenant_id: string,
    _project_id: string,
  ): Promise<ApiKeyMetadataResponse | null> {
    // Since the OpenAPI spec shows API keys are included in ListProjectsResponse,
    // this method is kept for backward compatibility but returns null
    // Use getApiKey() with a key_id for the new API
    return null;
  },

  /**
   * Get API key metadata by key_id
   * This matches the OpenAPI spec: GET /tenants/{tenant_id}/projects/{project_id}/api-keys/{key_id}
   */
  async getApiKey(
    tenant_id: string,
    project_id: string,
    key_id: string,
  ): Promise<SuccessResponseWrapper<ApiKeyMetadataResponse>> {
    return withTenantApi((config) =>
      api.get<SuccessResponseWrapper<ApiKeyMetadataResponse>>(
        `/tenants/${tenant_id}/projects/${project_id}/api-keys/${key_id}`,
        config,
      ),
    );
  },
};
