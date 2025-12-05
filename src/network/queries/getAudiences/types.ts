// Filter params for audiences list API
export interface AudienceFilters {
  pageSize?: number;
  page?: number;
  nameSearch?: string;
}

// Response Types
export interface AudiencesResponse {
  audiences: any[];
  pagination: any;
}

