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
} as const;

export type Endpoints = typeof endpoints;
