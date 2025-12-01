# Network Layer Documentation

This directory contains the network layer implementation using TanStack Query (React Query) and Axios.

## Structure

```
network/
├── apiClient.ts          # Axios instance with interceptors
├── endpoints.ts          # Central place for all API URLs
├── useAPI.ts             # Generic hook for API calls
├── queryClient.ts        # TanStack Query client configuration
├── queries/              # React Query hooks for data fetching
│   ├── users.ts
│   └── experiments.ts
└── mutations/            # React Query hooks for data mutations
    ├── updateUser.ts
    └── experiments.ts
```

## Setup

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## Usage Examples

### Using Queries (Data Fetching)

```tsx
import { useExperiments, useExperiment } from "@/network/queries/experiments";

function ExperimentsList() {
  const { data, isLoading, error } = useExperiments();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.experiments.map((exp) => (
        <div key={exp.id}>{exp.name}</div>
      ))}
    </div>
  );
}

function ExperimentDetail({ id }: { id: string }) {
  const { data, isLoading } = useExperiment(id);

  if (isLoading) return <div>Loading...</div>;

  return <div>{data?.experiment.name}</div>;
}
```

### Using Mutations (Data Updates)

```tsx
import { useConcludeExperiment } from "@/network/mutations/experiments";

function ConcludeButton({ experimentId }: { experimentId: string }) {
  const { mutate, isPending } = useConcludeExperiment({
    onSuccess: (data) => {
      console.log("Experiment concluded:", data);
      // Show success notification
    },
    onError: (error) => {
      console.error("Error:", error);
      // Show error notification
    },
  });

  const handleConclude = () => {
    mutate({
      id: experimentId,
      data: { winner: "Control Group" },
    });
  };

  return (
    <button onClick={handleConclude} disabled={isPending}>
      {isPending ? "Concluding..." : "Conclude"}
    </button>
  );
}
```

### Using the Generic useAPI Hook

```tsx
import { useAPI } from "@/network/useAPI";
import { endpoints } from "@/network/endpoints";

function CustomComponent() {
  const { data, error, isLoading, execute } = useAPI({
    method: "GET",
    url: endpoints.experiments.list,
    immediate: false, // Don't execute on mount
  });

  const handleFetch = async () => {
    const result = await execute();
    console.log("Fetched data:", result);
  };

  return (
    <div>
      <button onClick={handleFetch}>Fetch Data</button>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {data && <div>Data: {JSON.stringify(data)}</div>}
    </div>
  );
}
```

### Direct API Calls (Without React Query)

```tsx
import { api } from "@/network/apiClient";
import { endpoints } from "@/network/endpoints";

async function fetchData() {
  try {
    const response = await api.get(endpoints.experiments.list);
    console.log(response.data);
  } catch (error) {
    console.error("Error:", error);
  }
}
```

## Features

### API Client (`apiClient.ts`)

- **Base URL Configuration**: Set via `VITE_API_BASE_URL` environment variable
- **Request Interceptor**: Automatically adds auth token from localStorage
- **Response Interceptor**: Handles common error cases (401, 403, 404, 500)
- **Typed Methods**: `get`, `post`, `put`, `patch`, `delete` with TypeScript support
- **Development Logging**: Logs requests/responses in development mode

### Query Client Configuration

- **Stale Time**: 5 minutes (data considered fresh)
- **Garbage Collection**: 10 minutes (inactive queries)
- **Retry Logic**: 3 retries with exponential backoff
- **Refetch Strategy**: Configurable refetch on window focus, mount, reconnect

### Query Keys Pattern

Query keys are organized hierarchically for easy invalidation:

```tsx
experimentKeys.all; // ["experiments"]
experimentKeys.lists(); // ["experiments", "list"]
experimentKeys.list(filters); // ["experiments", "list", filters]
experimentKeys.details(); // ["experiments", "detail"]
experimentKeys.detail(id); // ["experiments", "detail", id]
```

This allows you to invalidate all experiment queries or just specific ones:

```tsx
// Invalidate all experiment queries
queryClient.invalidateQueries({ queryKey: experimentKeys.all });

// Invalidate only list queries
queryClient.invalidateQueries({ queryKey: experimentKeys.lists() });
```

## Best Practices

1. **Use Queries for Data Fetching**: Prefer `useQuery` hooks for GET requests
2. **Use Mutations for Data Updates**: Use `useMutation` hooks for POST/PUT/DELETE
3. **Centralize Endpoints**: Always use `endpoints.ts` for API URLs
4. **Type Safety**: Leverage TypeScript types for request/response data
5. **Error Handling**: Implement error handling in `onError` callbacks
6. **Optimistic Updates**: Use `onMutate` for optimistic UI updates
7. **Cache Management**: Use `invalidateQueries` to refresh data after mutations

## Authentication

The API client automatically adds the auth token from `localStorage.getItem("authToken")` to all requests. On 401 errors, it automatically removes the token.

To set the token:

```tsx
localStorage.setItem("authToken", "your-token-here");
```

## Error Handling

Errors are automatically handled by interceptors. For custom error handling:

```tsx
const { mutate } = useUpdateExperiment({
  onError: (error) => {
    if (error.response?.status === 404) {
      // Handle not found
    } else if (error.response?.status === 403) {
      // Handle forbidden
    }
  },
});
```
