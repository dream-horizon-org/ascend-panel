import { useQuery } from "@tanstack/react-query";
import { api } from "../../apiClient";
import { endpoints } from "../../endpoints";
import { experimentKeys } from "../sharedKeys";
import { ExperimentResponse } from "./types";
import { parseExperimentResponse } from "./parser";

// Fetch function
export const fetchExperiment = async (
  id: string | number,
): Promise<ExperimentResponse> => {
  // API returns snake_case response, parser will handle the transformation
  const response = await api.get(endpoints.experiments.detail(id));
  return parseExperimentResponse(response);
};

// React Query hook
export const useExperiment = (id: string | number | null) => {
  return useQuery<ExperimentResponse, Error>({
    queryKey: experimentKeys.detail(id!),
    queryFn: () => fetchExperiment(id!),
    enabled: !!id,
  });
};

// Export types
export type {
  VariantVariable,
  Variant,
  VariantWeights,
  RuleCondition,
  RuleAttribute,
  WinningVariant,
  Experiment,
  ExperimentApiResponse,
  ExperimentResponse,
} from "./types";
