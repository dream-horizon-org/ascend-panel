// Request type
export interface GenerateApiKeyRequest {
  tenant_id: string;
  project_id: string;
  name?: string; // Optional, defaults to project_name
}

// API response types
export interface GenerateApiKeyResponse {
  key_id: string;
  name: string;
  api_key: string; // RAW KEY - shown only once
  created_at: string;
}

export interface GenerateApiKeyApiResponse {
  data: GenerateApiKeyResponse;
}
