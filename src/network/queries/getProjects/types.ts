// API response types (as received from API)
export interface Project {
  tenant_id: string;
  project_key: string;
  name: string;
  status: "ACTIVE" | "INACTIVE";
  created_at?: string;
}

export interface ProjectsApiResponse {
  data: {
    projects: Project[];
  };
}

// Transformed response type (used in app)
export type ProjectsResponse = Project[];
