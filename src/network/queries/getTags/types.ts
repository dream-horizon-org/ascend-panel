// Raw API response types (snake_case - as received from API)
export interface RawTagsApiResponse {
  data: {
    tags: string[];
  };
}

// Transformed response type (camelCase - used in app)
export type TagsResponse = string[];
