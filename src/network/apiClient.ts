import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// Create axios instance with base configuration
// In development, use relative URL to go through Vite proxy
// In production, use the full API URL
const getBaseURL = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  // In development, use relative URL to leverage Vite proxy
  if (import.meta.env.DEV) {
    return "/v1";
  }
  // Fallback for production
  return "http://localhost:8080/v1";
};

const apiClient: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add project key header (required for all requests)
    // const projectKey =
    //   import.meta.env.VITE_PROJECT_KEY || localStorage.getItem("projectKey");
    const projectKey = "666118b4-a1a5-4849-9837-9f7685a09569"; //Hardcoded project Key remove when merging
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
        `[API Request] ${config.method?.toUpperCase()} ${config.url}`,
        {
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
    console.error("[API Request Error]", error);
    return Promise.reject(error);
  },
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
            data?.message || error.message,
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
          "\n3. The backend allows requests from the frontend origin",
        );
      }
    } else {
      // Error in request setup
      console.error("[API] Request Error:", error.message);
    }

    return Promise.reject(error);
  },
);

// Typed API methods
export const api = {
  get: <T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    return apiClient.get<T>(url, config);
  },

  post: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    return apiClient.post<T>(url, data, config);
  },

  put: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    return apiClient.put<T>(url, data, config);
  },

  patch: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    return apiClient.patch<T>(url, data, config);
  },

  delete: <T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    return apiClient.delete<T>(url, config);
  },
};

export default apiClient;
