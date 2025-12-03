import { useMutation } from "@tanstack/react-query";
import apiClient from "../../apiClient";
import { endpoints } from "../../endpoints";

// Types
export interface ImportCohortRequest {
  file: File;
  fileName: string;
}

export interface ImportCohortResponse {
  data: any;
}

// Mutation function
export const importCohort = async (
  audienceId: string | number,
  data: ImportCohortRequest,
): Promise<ImportCohortResponse> => {
  const formData = new FormData();
  formData.append("file", data.file);
  formData.append("fileName", data.fileName);

  const url = endpoints.audiences.import(audienceId);
  console.log("[Import Cohort] Uploading to:", url);
  console.log("[Import Cohort] File:", data.file.name, "Size:", data.file.size);

  const response = await apiClient.post<ImportCohortResponse>(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      "X-Project-Id": "project1",
    },
  });
  return response.data;
};

// React Query mutation hook
export const useImportCohort = () => {
  return useMutation<
    ImportCohortResponse,
    Error,
    { audienceId: string | number; data: ImportCohortRequest }
  >({
    mutationFn: ({ audienceId, data }) => importCohort(audienceId, data),
  });
};
