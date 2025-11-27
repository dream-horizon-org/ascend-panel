import { useMutation, useQueryClient, UseMutationOptions } from "@tanstack/react-query";
import { api } from "../apiClient";
import { endpoints } from "../endpoints";
import { userKeys, User, UserResponse } from "../queries/users";

// Types
export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: string;
}

export interface UpdateUserResponse {
  user: User;
  message?: string;
}

// Mutation function
export const updateUser = async (
  id: string | number,
  data: UpdateUserRequest
): Promise<UpdateUserResponse> => {
  const response = await api.put<UpdateUserResponse>(
    endpoints.users.update(id),
    data
  );
  return response.data;
};

// React Query mutation hook
export const useUpdateUser = (
  options?: Omit<
    UseMutationOptions<UpdateUserResponse, Error, { id: string | number; data: UpdateUserRequest }>,
    "mutationFn"
  >
) => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateUserResponse,
    Error,
    { id: string | number; data: UpdateUserRequest }
  >({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: (data, variables) => {
      // Invalidate and refetch user queries
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });

      // Optionally update the cache directly for optimistic updates
      queryClient.setQueryData<UserResponse>(
        userKeys.detail(variables.id),
        (old) => {
          if (old) {
            return {
              ...old,
              user: data.user,
            };
          }
          return { user: data.user };
        }
      );

      // Call custom onSuccess if provided
      options?.onSuccess?.(data, variables, undefined);
    },
    onError: (error, variables, context) => {
      // Call custom onError if provided
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
};

