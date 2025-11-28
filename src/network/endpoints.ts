/**
 * Central place for all API endpoints
 * Organize endpoints by feature/resource
 *
 * API Base: /v1 (version 1 of the API)
 */

const API_BASE = "";

export const endpoints = {
  // User endpoints
  users: {
    list: `${API_BASE}/users`,
    detail: (id: string | number) => `${API_BASE}/users/${id}`,
    create: `${API_BASE}/users`,
    update: (id: string | number) => `${API_BASE}/users/${id}`,
    delete: (id: string | number) => `${API_BASE}/users/${id}`,
    search: `${API_BASE}/users/search`,
  },

  // Experiment endpoints
  experiments: {
    list: `${API_BASE}/experiments`,
    detail: (id: string | number) => `${API_BASE}/experiments/${id}`,
    create: `${API_BASE}/experiments`,
    update: (id: string | number) => `${API_BASE}/experiments/${id}`,
    delete: (id: string | number) => `${API_BASE}/experiments/${id}`,
    conclude: (id: string | number) => `${API_BASE}/experiments/${id}/conclude`,
    clone: (id: string | number) => `${API_BASE}/experiments/${id}/clone`,
    terminate: (id: string | number) =>
      `${API_BASE}/experiments/${id}/terminate`,
    declareWinner: (id: string | number) =>
      `${API_BASE}/experiments/${id}/declare-winner`,
  },

  // Auth endpoints
  auth: {
    login: `${API_BASE}/auth/login`,
    logout: `${API_BASE}/auth/logout`,
    refresh: `${API_BASE}/auth/refresh`,
    me: `${API_BASE}/auth/me`,
  },
} as const;

export type Endpoints = typeof endpoints;
