import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// Declare window.__ENV__ type
declare global {
  interface Window {
    __ENV__?: {
      API_BASE_URL?: string;
      EXPERIMENT_API_BASE_URL?: string;
      AUDIENCE_API_BASE_URL?: string;
    };
  }
}

// Helper to get base URL with priority order
const getBaseURL = (
  envKey: "API_BASE_URL" | "EXPERIMENT_API_BASE_URL" | "AUDIENCE_API_BASE_URL",
  defaultPort: number,
  defaultPath: string = "/v1",
): string => {
  // 1. Runtime env (injected by Docker at container startup)
  if (window.__ENV__?.[envKey]) {
    const url = window.__ENV__[envKey];
    return url ? `${url}${defaultPath}` : "";
  }

  // 2. Fallback to general API_BASE_URL if provided
  if (envKey !== "API_BASE_URL" && window.__ENV__?.API_BASE_URL) {
    const url = window.__ENV__.API_BASE_URL;
    return url ? `${url}${defaultPath}` : "";
  }

  // 3. Build-time env (Vite)
  const viteEnvKey = `VITE_${envKey}` as keyof ImportMetaEnv;
  if (import.meta.env[viteEnvKey]) {
    return import.meta.env[viteEnvKey] as string;
  }

  // 4. Development - use relative URL to leverage Vite proxy
  if (import.meta.env.DEV) {
    return defaultPath;
  }

  // 5. Fallback for production
  return `http://localhost:${defaultPort}${defaultPath}`;
};

// Factory function to create API client with shared interceptors
const createApiClient = (baseURL: string, clientName: string): AxiosInstance => {
  const client: AxiosInstance = axios.create({
    baseURL,
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  // Request interceptor
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Add project key header (required for all requests)
      const projectKey =
        import.meta.env.VITE_PROJECT_KEY ||
        localStorage.getItem("projectKey") ||
        "550e8400-e29b-41d4-a716-446655440001"; // Hardcoded project Key remove when merging
      if (projectKey && config.headers) {
        config.headers["x-project-key"] = projectKey;
      }

      // Add auth token if available
      const token = localStorage.getItem("authToken");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Log request in development
      if (import.meta.env.DEV) {
        console.log(
          `[API Request - ${clientName}] ${config.method?.toUpperCase()} ${config.url}`,
          {
            baseURL: config.baseURL,
            data: config.data,
            params: config.params,
            headers: {
              "x-project-key": projectKey ? "***" : "missing",
            },
          },
        );
      }

      return config;
    },
    (error) => {
      console.error(`[API Request Error - ${clientName}]`, error);
      return Promise.reject(error);
    },
  );

  // Response interceptor
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      // Log response in development
      if (import.meta.env.DEV) {
        console.log(
          `[API Response - ${clientName}] ${response.config.method?.toUpperCase()} ${response.config.url}`,
          {
            status: response.status,
            data: response.data,
          },
        );
      }

      return response;
    },
    (error) => {
      // Handle common error cases
      if (error.response) {
        // Server responded with error status
        const { status, data } = error.response;

        switch (status) {
          case 401:
            // Unauthorized - clear token and redirect to login
            localStorage.removeItem("authToken");
            console.error(`[API - ${clientName}] Unauthorized - Please login again`);
            break;
          case 403:
            console.error(`[API - ${clientName}] Forbidden - Access denied`);
            break;
          case 404:
            console.error(`[API - ${clientName}] Not Found - Resource not available`);
            break;
          case 500:
            console.error(`[API - ${clientName}] Server Error - Please try again later`);
            break;
          default:
            console.error(
              `[API Error - ${clientName}] ${status}:`,
              data?.message || error.message,
            );
        }
      } else if (error.request) {
        // Request made but no response received
        console.error(`[API - ${clientName}] Network Error - No response from server`);
        // Check if it's a CORS error
        if (error.message?.includes("CORS") || error.code === "ERR_NETWORK") {
          console.error(
            `[API - ${clientName}] CORS Error detected. Make sure:`,
            "\n1. The backend server is running",
            "\n2. The Vite proxy is configured correctly (vite.config.js)",
            "\n3. The backend allows requests from the frontend origin",
          );
        }
      } else {
        // Error in request setup
        console.error(`[API - ${clientName}] Request Error:`, error.message);
      }

      return Promise.reject(error);
    },
  );

  return client;
};

// Create API clients for different services
// Experiments API - Port 8080
export const experimentApiClient = createApiClient(
  getBaseURL("EXPERIMENT_API_BASE_URL", 8100),
  "Experiments",
);

// Audiences API - Port 8000
export const audienceApiClient = createApiClient(
  getBaseURL("AUDIENCE_API_BASE_URL", 8250),
  "Audiences",
);

// Default API client (for backward compatibility - uses experiment API)
// Note: apiClient is just a reference to experimentApiClient, so it already has interceptors
const apiClient: AxiosInstance = experimentApiClient;

// Helper function to create typed API methods for a client
const createApiMethods = (client: AxiosInstance) => ({
  get: <T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    return client.get<T>(url, config);
  },

  post: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    return client.post<T>(url, data, config);
  },

  put: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    return client.put<T>(url, data, config);
  },

  patch: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    return client.patch<T>(url, data, config);
  },

  delete: <T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    return client.delete<T>(url, config);
  },
});

// Export typed API methods for each client
export const experimentApi = createApiMethods(experimentApiClient);
export const audienceApi = createApiMethods(audienceApiClient);

// Default API (for backward compatibility - uses experiment API)
export const api = experimentApi;
export default apiClient;
