// Shared query keys for experiments (used by both list and detail queries, and mutations)
export const experimentKeys = {
  all: ["experiments"] as const,
  lists: () => [...experimentKeys.all, "list"] as const,
  list: (filters?: Record<string, any>) =>
    [...experimentKeys.lists(), filters] as const,
  details: () => [...experimentKeys.all, "detail"] as const,
  detail: (id: string | number) => [...experimentKeys.details(), id] as const,
  tags: () => [...experimentKeys.all, "tags"] as const,
};
