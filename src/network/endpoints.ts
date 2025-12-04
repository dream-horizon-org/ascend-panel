/**
 * Central place for all API endpoints
 * Organize endpoints by feature/resource
 *
 * API Base: /v1 (version 1 of the API)
 */

const API_BASE = "";

export const endpoints = {
  // Experiment endpoints
  experiments: {
    list: `${API_BASE}/experiments`,
    detail: (id: string | number) => `${API_BASE}/experiments/${id}`,
    create: `${API_BASE}/experiments`, // POST to singular endpoint
    update: (id: string | number) => `${API_BASE}/experiments/${id}`,
    tags: `${API_BASE}/experiments/tags`,
  },
  // Tenant endpoints
  tenants: {
    list: `${API_BASE}/tenants`,
  },

  // Project endpoints
  projects: {
    list: (tenantId: string) => `${API_BASE}/tenants/${tenantId}/projects`,
    create: (tenantId: string) => `${API_BASE}/tenants/${tenantId}/projects`,
  },

  // API Key endpoints
  apiKeys: {
    list: (tenantId: string, projectId: string) =>
      `${API_BASE}/tenants/${tenantId}/projects/${projectId}/api-keys`,
    generate: (tenantId: string, projectId: string) =>
      `${API_BASE}/tenants/${tenantId}/projects/${projectId}/api-keys`,
    rotate: (tenantId: string, projectId: string, keyId: string) =>
      `${API_BASE}/tenants/${tenantId}/projects/${projectId}/api-keys/${keyId}/rotate`,
    detail: (tenantId: string, projectId: string, keyId: string) =>
      `${API_BASE}/tenants/${tenantId}/projects/${projectId}/api-keys/${keyId}`,
  },
  // Audience/Cohort endpoints
  audiences: {
    import: (id: string | number) => `${API_BASE}/audiences/${id}/imports`,
  },
} as const;

export type Endpoints = typeof endpoints;
