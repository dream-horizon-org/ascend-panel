import type { RawTagsApiResponse, TagsResponse } from "./types";

/**
 * Parse the raw API response for tags
 * Extracts the tags array from the nested API response
 */
export const parseTagsResponse = (
  response: RawTagsApiResponse,
): TagsResponse => {
  return response.data.tags;
};
