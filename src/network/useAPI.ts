import { useState, useCallback } from "react";
import { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { api } from "./apiClient";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface UseAPIOptions<T = any> {
  method?: HttpMethod;
  url: string;
  data?: any;
  config?: AxiosRequestConfig;
  immediate?: boolean; // Whether to execute immediately on mount
}

interface UseAPIResult<T = any> {
  data: T | null;
  error: AxiosError | null;
  isLoading: boolean;
  execute: (overrideOptions?: Partial<UseAPIOptions<T>>) => Promise<T | null>;
  reset: () => void;
}

/**
 * Generic hook for making API calls
 * Supports GET, POST, PUT, PATCH, DELETE methods
 * Returns data, error, loading state, and execute function
 */
export function useAPI<T = any>(
  options: UseAPIOptions<T>
): UseAPIResult<T> {
  const { method = "GET", url, data, config, immediate = false } = options;

  const [dataState, setDataState] = useState<T | null>(null);
  const [error, setError] = useState<AxiosError | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(immediate);

  const execute = useCallback(
    async (overrideOptions?: Partial<UseAPIOptions<T>>): Promise<T | null> => {
      const finalOptions = {
        method,
        url,
        data,
        config,
        ...overrideOptions,
      };

      setIsLoading(true);
      setError(null);

      try {
        let response: AxiosResponse<T>;

        switch (finalOptions.method) {
          case "GET":
            response = await api.get<T>(finalOptions.url, finalOptions.config);
            break;
          case "POST":
            response = await api.post<T>(
              finalOptions.url,
              finalOptions.data,
              finalOptions.config
            );
            break;
          case "PUT":
            response = await api.put<T>(
              finalOptions.url,
              finalOptions.data,
              finalOptions.config
            );
            break;
          case "PATCH":
            response = await api.patch<T>(
              finalOptions.url,
              finalOptions.data,
              finalOptions.config
            );
            break;
          case "DELETE":
            response = await api.delete<T>(
              finalOptions.url,
              finalOptions.config
            );
            break;
          default:
            throw new Error(`Unsupported HTTP method: ${finalOptions.method}`);
        }

        const responseData = response.data;
        setDataState(responseData);
        setIsLoading(false);
        return responseData;
      } catch (err) {
        const axiosError = err as AxiosError;
        setError(axiosError);
        setIsLoading(false);
        return null;
      }
    },
    [method, url, data, config]
  );

  const reset = useCallback(() => {
    setDataState(null);
    setError(null);
    setIsLoading(false);
  }, []);

  // Execute immediately if requested
  if (immediate && !dataState && !error && !isLoading) {
    execute();
  }

  return {
    data: dataState,
    error,
    isLoading,
    execute,
    reset,
  };
}

