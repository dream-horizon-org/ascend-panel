// Request type
export interface RotateApiKeyRequest {
  tenant_id: string;
  project_id: string;
  key_id: string;
}

// API response types
export interface RotateApiKeyResponse {
  key_id: string;
  name: string;
  api_key: string; // NEW RAW KEY - shown only once
  rotated_at: string;
}

export interface RotateApiKeyApiResponse {
  data: RotateApiKeyResponse;
}
