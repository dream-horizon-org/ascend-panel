import type { ProjectsApiResponse, ProjectsResponse } from "./types";

export const parseProjectsResponse = (
  response: ProjectsApiResponse,
): ProjectsResponse => {
  return response.data.projects;
};
