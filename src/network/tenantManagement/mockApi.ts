export type TenantStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";
export type ProjectStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";
export type ApiKeyStatus = "ACTIVE" | "INACTIVE" | "REVOKED";

export interface SuccessResponseWrapper<T> {
  data: T;
}

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

export interface Pagination {
  current_page: number;
  page_size: number;
  total_count: number;
}

export interface TenantsListResponse {
  tenants: TenantSummary[];
  pagination: Pagination;
}

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

type StoredTenant = TenantDetails;
type StoredProject = ProjectDetailsResponse & { project_key: string; status: TenantStatus };

type StoredApiKey = {
  key_id: string;
  tenant_id: string;
  project_id: string;
  project_key: string;
  name: string;
  status: TenantStatus;
  created_at: string;
  last_rotated_at: string;
  // We do NOT store the raw secret here (it is “shown once”).
  api_key_masked: string;
};

type Store = {
  tenants: Record<string, StoredTenant>;
  tenantOrder: string[];
  projects: Record<string, StoredProject>;
  projectsByTenant: Record<string, string[]>;
  apiKeys: Record<string, StoredApiKey>;
  apiKeyByProject: Record<string, string | undefined>;
};

const STORAGE_KEY = "ascend_mock_tenant_mgmt_v1";

function nowIso() {
  return new Date().toISOString();
}

function uuid() {
  // Browser-safe UUID
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  // Fallback: not a “real” UUID, but sufficient for mocks
  return `id_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

function slugifyProjectKey(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function loadStore(): Store {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw) as Store;
    return {
      ...emptyStore(),
      ...parsed,
    };
  } catch {
    return emptyStore();
  }
}

function saveStore(store: Store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function emptyStore(): Store {
  return {
    tenants: {},
    tenantOrder: [],
    projects: {},
    projectsByTenant: {},
    apiKeys: {},
    apiKeyByProject: {},
  };
}

export class MockApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export const tenantManagementMockApi = {
  async createTenant(
    payload: TenantCreateRequest,
  ): Promise<SuccessResponseWrapper<TenantCreateResponse>> {
    await delay(200);
    const name = payload.name?.trim() || "";
    const contactEmail = payload.contact_email?.trim() || "";

    if (name.length < 3) throw new MockApiError(400, "name must be at least 3 characters");
    if (!isValidEmail(contactEmail)) throw new MockApiError(400, "contact_email must be a valid email");

    const store = loadStore();
    if (store.tenantOrder.length > 0) {
      throw new MockApiError(409, "Only one tenant can be created in this mock UI");
    }
    const tenant_id = uuid();
    const created_at = nowIso();

    const tenant: StoredTenant = {
      tenant_id,
      name,
      description: payload.description?.trim() || undefined,
      contact_email: contactEmail,
      status: "ACTIVE",
      created_at,
      updated_at: created_at,
    };

    store.tenants[tenant_id] = tenant;
    store.tenantOrder = [tenant_id, ...store.tenantOrder];
    store.projectsByTenant[tenant_id] = store.projectsByTenant[tenant_id] || [];
    saveStore(store);

    return {
      data: {
        tenant_id,
        name,
        status: tenant.status,
        created_at,
      },
    };
  },

  async getTenants(params?: {
    page?: number;
    limit?: number;
  }): Promise<SuccessResponseWrapper<TenantsListResponse>> {
    await delay(250);
    const page = Math.max(1, params?.page ?? 1);
    const limit = Math.max(1, params?.limit ?? 20);

    const store = loadStore();
    const total = store.tenantOrder.length;
    const start = (page - 1) * limit;
    const ids = store.tenantOrder.slice(start, start + limit);
    const tenants: TenantSummary[] = ids
      .map((id) => store.tenants[id])
      .filter(Boolean)
      .map((t) => ({
        tenant_id: t.tenant_id,
        name: t.name,
        contact_email: t.contact_email,
      }));

    return {
      data: {
        tenants,
        pagination: {
          current_page: page,
          page_size: limit,
          total_count: total,
        },
      },
    };
  },

  async getTenantDetails(
    tenant_id: string,
  ): Promise<SuccessResponseWrapper<TenantDetails>> {
    await delay(250);
    const store = loadStore();
    const tenant = store.tenants[tenant_id];
    if (!tenant) throw new MockApiError(404, "Tenant not found");
    return { data: tenant };
  },

  async createProject(
    tenant_id: string,
    payload: ProjectCreateRequest,
  ): Promise<SuccessResponseWrapper<ProjectCreateResponse>> {
    await delay(200);
    const name = payload.name?.trim() || "";
    if (!name) throw new MockApiError(400, "name is required");

    const store = loadStore();
    const tenant = store.tenants[tenant_id];
    if (!tenant) throw new MockApiError(404, "Tenant not found");

    const project_key = slugifyProjectKey(name);
    if (!/^[a-z0-9-]+$/.test(project_key) || !project_key) {
      throw new MockApiError(400, "project_key validation failed");
    }

    const existingProjectIds = store.projectsByTenant[tenant_id] || [];
    const conflict = existingProjectIds
      .map((pid) => store.projects[pid])
      .some((p) => p?.project_key === project_key);
    if (conflict) throw new MockApiError(409, "Duplicate project_key within tenant");

    const project_id = uuid();
    const created_at = nowIso();
    const project: StoredProject = {
      project_id,
      tenant_id,
      name,
      created_at,
      updated_at: created_at,
      description: undefined,
      stats_engine: "ORG_DEFAULT",
      project_key,
      status: "ACTIVE",
    };
    store.projects[project_id] = project;
    store.projectsByTenant[tenant_id] = [project_id, ...(store.projectsByTenant[tenant_id] || [])];
    saveStore(store);

    return {
      data: {
        tenant_id,
        project_key,
        name,
        status: project.status,
      },
    };
  },

  async getProjects(
    tenant_id: string,
    params?: { page?: number; limit?: number },
  ): Promise<SuccessResponseWrapper<ProjectsListResponse>> {
    await delay(250);
    const page = Math.max(1, params?.page ?? 1);
    const limit = Math.max(1, params?.limit ?? 20);

    const store = loadStore();
    if (!store.tenants[tenant_id]) throw new MockApiError(404, "Tenant not found");

    const allIds = store.projectsByTenant[tenant_id] || [];
    const total = allIds.length;
    const start = (page - 1) * limit;
    const ids = allIds.slice(start, start + limit);
    const projects: ProjectSummary[] = ids
      .map((id) => store.projects[id])
      .filter(Boolean)
      .map((p) => ({
        project_id: p.project_id,
        project_key: p.project_key,
        name: p.name,
        created_at: p.created_at,
        updated_at: p.updated_at,
      }));

    return {
      data: {
        projects,
        pagination: {
          current_page: page,
          page_size: limit,
          total_count: total,
        },
      },
    };
  },

  async getProjectDetails(
    tenant_id: string,
    project_id: string,
  ): Promise<SuccessResponseWrapper<ProjectDetailsResponse>> {
    await delay(250);
    const store = loadStore();
    const project = store.projects[project_id];
    if (!project || project.tenant_id !== tenant_id) throw new MockApiError(404, "Project not found");
    return {
      data: {
        project_id: project.project_id,
        tenant_id: project.tenant_id,
        name: project.name,
        created_at: project.created_at,
        updated_at: project.updated_at,
        description: project.description,
        stats_engine: project.stats_engine,
      },
    };
  },

  async updateProjectSettings(
    tenant_id: string,
    project_id: string,
    payload: ProjectUpdateRequest,
  ): Promise<SuccessResponseWrapper<ProjectDetailsResponse>> {
    await delay(200);
    const store = loadStore();
    const project = store.projects[project_id];
    if (!project || project.tenant_id !== tenant_id) throw new MockApiError(404, "Project not found");

    project.description = payload.description?.trim() || undefined;
    project.stats_engine = payload.stats_engine || "ORG_DEFAULT";
    project.updated_at = nowIso();
    store.projects[project_id] = project;
    saveStore(store);

    return {
      data: {
        project_id: project.project_id,
        tenant_id: project.tenant_id,
        name: project.name,
        created_at: project.created_at,
        updated_at: project.updated_at,
        description: project.description,
        stats_engine: project.stats_engine,
      },
    };
  },

  async generateApiKey(
    tenant_id: string,
    project_id: string,
    payload?: ApiKeyGenerateRequest,
  ): Promise<SuccessResponseWrapper<ApiKeyGenerateResponse>> {
    await delay(200);
    const store = loadStore();
    const project = store.projects[project_id];
    if (!project || project.tenant_id !== tenant_id) throw new MockApiError(404, "Project not found");

    const existingKeyId = store.apiKeyByProject[project_id];
    if (existingKeyId) {
      throw new MockApiError(409, "This project already has an API key. Rotate it instead.");
    }

    const key_id = `key_${uuid()}`;
    const created_at = nowIso();
    const rawKey = `exp_live_${Math.random().toString(36).slice(2)}${Math.random()
      .toString(36)
      .slice(2)}`;
    const api_key_masked = `${rawKey.slice(0, 10)}...${rawKey.slice(-4)}`;
    const name = payload?.name?.trim() || project.name;

    const stored: StoredApiKey = {
      key_id,
      tenant_id,
      project_id,
      project_key: project.project_key,
      name,
      status: "ACTIVE",
      created_at,
      last_rotated_at: created_at,
      api_key_masked,
    };

    store.apiKeys[key_id] = stored;
    store.apiKeyByProject[project_id] = key_id;
    saveStore(store);

    return {
      data: {
        key_id,
        name,
        api_key: rawKey,
        created_at,
      },
    };
  },

  async rotateApiKey(
    tenant_id: string,
    project_id: string,
    key_id: string,
  ): Promise<SuccessResponseWrapper<ApiKeyRotateResponse>> {
    await delay(200);
    const store = loadStore();
    const project = store.projects[project_id];
    if (!project || project.tenant_id !== tenant_id) throw new MockApiError(404, "Project not found");
    const existing = store.apiKeys[key_id];
    if (!existing || existing.project_id !== project_id) throw new MockApiError(404, "API key not found");

    const rotated_at = nowIso();
    const rawKey = `exp_live_NEW_SECRET_${Math.random().toString(36).slice(2)}${Math.random()
      .toString(36)
      .slice(2)}`;
    existing.last_rotated_at = rotated_at;
    existing.api_key_masked = `${rawKey.slice(0, 10)}...${rawKey.slice(-4)}`;
    store.apiKeys[key_id] = existing;
    project.updated_at = rotated_at;
    store.projects[project_id] = project;
    saveStore(store);

    return {
      data: {
        key_id: existing.key_id,
        name: existing.name,
        api_key: rawKey,
        rotated_at,
      },
    };
  },

  async getApiKeyMetadata(
    tenant_id: string,
    project_id: string,
    key_id: string,
  ): Promise<SuccessResponseWrapper<ApiKeyMetadataResponse>> {
    await delay(250);
    const store = loadStore();
    const project = store.projects[project_id];
    if (!project || project.tenant_id !== tenant_id) throw new MockApiError(404, "Project not found");
    const existing = store.apiKeys[key_id];
    if (!existing || existing.project_id !== project_id) throw new MockApiError(404, "API key not found");

    return {
      data: {
        key_id: existing.key_id,
        project_id: existing.project_id,
        project_key: existing.project_key,
        name: existing.name,
        status: existing.status,
        created_at: existing.created_at,
        last_rotated_at: existing.last_rotated_at,
      },
    };
  },

  async getProjectApiKey(
    tenant_id: string,
    project_id: string,
  ): Promise<StoredApiKey | null> {
    await delay(150);
    const store = loadStore();
    const project = store.projects[project_id];
    if (!project || project.tenant_id !== tenant_id) throw new MockApiError(404, "Project not found");
    const keyId = store.apiKeyByProject[project_id];
    if (!keyId) return null;
    return store.apiKeys[keyId] || null;
  },
};


