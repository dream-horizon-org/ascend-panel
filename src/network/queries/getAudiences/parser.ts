import type { AudiencesResponse } from "./types";

export const parseAudiencesResponse = (response: any): AudiencesResponse => {
  const data = response.data;
  
  return {
    audiences: data.data || [],
    pagination: data.page_info || {},
  };
};

