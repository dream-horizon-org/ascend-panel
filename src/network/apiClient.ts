import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { SERVICE_NAME, STORAGE_KEYS } from "../utils/contants";

// Declare window.__ENV__ type
declare global {
  interface Window {
    __ENV__?: {
      API_BASE_URL?: string;
      AUDIENCE_API_BASE_URL?: string;
      EXPERIMENT_API_BASE_URL?: string;
      TENANT_MANAGEMENT_API_BASE_URL?: string;
      PROJECT_NAME?: string;
      PROJECT_KEY?: string;
      PROJECT_API?: string;
      // Backward compatibility
      VITE_PROJECT_NAME?: string;
      VITE_PROJECT_KEY?: string;
      VITE_API_KEY?: string;
    };
  }
}

// Create axios instance with base configuration
// All services use the same API gateway URL
// Priority: runtime env (Docker) > build-time env > fallback
const getBaseURL = () => {
  return "http://localhost:8000/v1"
  // Use API_BASE_URL for all services (API gateway handles routing)
  const apiBaseURL =
    window.__ENV__?.API_BASE_URL ||
    import.meta.env.VITE_API_BASE_URL;

  if (!apiBaseURL) {
    // Fallback to localhost (for development)
    return "http://localhost:8000/v1";
  }

  // Ensure the URL ends with /v1
  if (apiBaseURL.endsWith("/v1")) {
    return apiBaseURL;
  }
  return `${apiBaseURL}/v1`;
};

const apiClient: AxiosInstance = axios.create({
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Check for service header (used for determining headers, not base URL)
    const service = (config?.headers as any)?.service as string | undefined;
    if (service) {
      delete (config.headers as any).service;
    }

    // All services use the same base URL (API gateway handles routing)
    const baseURL = getBaseURL();
    config.baseURL = baseURL;

    // For experiment calls (non-tenant-management), add project_key header
    // Tenant management calls don't need project_key in headers
    if (service !== SERVICE_NAME.TENANT_MANAGEMENT) {
      // project_key is the primary identifier stored in localStorage
      const projectApiKey = localStorage.getItem(STORAGE_KEYS.PROJECT_API_KEY);

      if (projectApiKey && config.headers) {
        config.headers["x-api-key"] = projectApiKey;
      }
    }

    return config;
  },
  (error) => {
    console.error("[API Request Error]", error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log(
        `[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`,
        {
          status: response.status,
          data: response.data,
        }
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
          // You can add redirect logic here
          console.error("[API] Unauthorized - Please login again");
          break;
        case 403:
          console.error("[API] Forbidden - Access denied");
          break;
        case 404:
          console.error("[API] Not Found - Resource not available");
          break;
        case 500:
          console.error("[API] Server Error - Please try again later");
          break;
        default:
          console.error(
            `[API Error] ${status}:`,
            data?.message || error.message
          );
      }
    } else if (error.request) {
      // Request made but no response received
      console.error("[API] Network Error - No response from server");
      // Check if it's a CORS error
      if (error.message?.includes("CORS") || error.code === "ERR_NETWORK") {
        console.error(
          "[API] CORS Error detected. Make sure:",
          "\n1. The backend server is running",
          "\n2. The Vite proxy is configured correctly (vite.config.js)",
          "\n3. The backend allows requests from the frontend origin"
        );
      }
    } else {
      // Error in request setup
      console.error("[API] Request Error:", error.message);
    }

    return Promise.reject(error);
  }
);

// Typed API methods
export const api = {
  get: <T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return apiClient.get<T>(url, config);
  },

  post: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return apiClient.post<T>(url, data, config);
  },

  put: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return apiClient.put<T>(url, data, config);
  },

  patch: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return apiClient.patch<T>(url, data, config);
  },

  delete: <T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return apiClient.delete<T>(url, config);
  },
};

export default apiClient;
