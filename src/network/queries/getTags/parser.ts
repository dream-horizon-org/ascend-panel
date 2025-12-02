import type { TagsApiResponse, TagsResponse } from "./types";

/**
 * Parse the API response for tags
 * Extracts the tags array from the nested API response
 */
export const parseTagsResponse = (response: TagsApiResponse): TagsResponse => {
  return response.data.tags;
};
