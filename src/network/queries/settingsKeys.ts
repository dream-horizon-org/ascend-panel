// Shared query keys for settings (tenants, projects, api keys)
export const settingsKeys = {
  // Tenants
  tenants: {
    all: ["tenants"] as const,
    list: () => [...settingsKeys.tenants.all, "list"] as const,
  },

  // Projects
  projects: {
    all: ["projects"] as const,
    lists: () => [...settingsKeys.projects.all, "list"] as const,
    list: (tenantId: string) =>
      [...settingsKeys.projects.lists(), tenantId] as const,
  },

  // API Keys
  apiKeys: {
    all: ["apiKeys"] as const,
    lists: () => [...settingsKeys.apiKeys.all, "list"] as const,
    list: (tenantId: string, projectId: string) =>
      [...settingsKeys.apiKeys.lists(), tenantId, projectId] as const,
    detail: (tenantId: string, projectId: string, keyId: string) =>
      [
        ...settingsKeys.apiKeys.all,
        "detail",
        tenantId,
        projectId,
        keyId,
      ] as const,
  },
};
