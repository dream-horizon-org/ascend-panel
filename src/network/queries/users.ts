import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { api } from "../apiClient";
import { endpoints } from "../endpoints";

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

export interface UserResponse {
  user: User;
}

// Query keys
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters?: Record<string, any>) =>
    [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string | number) => [...userKeys.details(), id] as const,
};

// Fetch functions
export const fetchUsers = async (
  params?: Record<string, any>,
): Promise<UsersResponse> => {
  const response = await api.get<UsersResponse>(endpoints.users.list, {
    params,
  });
  return response.data;
};

export const fetchUser = async (id: string | number): Promise<UserResponse> => {
  const response = await api.get<UserResponse>(endpoints.users.detail(id));
  return response.data;
};

// React Query hooks
export const useUsers = (
  params?: Record<string, any>,
  options?: Omit<UseQueryOptions<UsersResponse, Error>, "queryKey" | "queryFn">,
) => {
  return useQuery<UsersResponse, Error>({
    queryKey: userKeys.list(params),
    queryFn: () => fetchUsers(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

export const useUser = (
  id: string | number | null,
  options?: Omit<UseQueryOptions<UserResponse, Error>, "queryKey" | "queryFn">,
) => {
  return useQuery<UserResponse, Error>({
    queryKey: userKeys.detail(id!),
    queryFn: () => fetchUser(id!),
    enabled: !!id, // Only fetch if id is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};
