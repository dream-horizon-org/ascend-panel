import { ExperimentsResponse } from "./types";
import { AxiosResponse } from "axios";

export const parseExperimentsResponse = (
  response: AxiosResponse<ExperimentsResponse>,
): ExperimentsResponse => {
  // If the response structure matches exactly, return as is
  // Add any transformations here if needed in the future
  return response.data;
};
