/**
 * Queries index file
 * Central export point for all experiment queries
 */

// Shared keys (used by mutations)
export { experimentKeys, audienceKeys } from "./sharedKeys";

// Get Experiments List
export {
  fetchExperiments,
  useExperiments,
  useExperimentsList,
} from "./getExperimentsList";
export type {
  ExperimentsResponse,
  ExperimentFilters,
  Pagination,
} from "./getExperimentsList";

// Get Experiment Details
export { fetchExperiment, useExperiment } from "./getExperimentDetails";
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
} from "./getExperimentDetails";

// Get Tags
export { fetchTags, useTags } from "./getTags";
export type { TagsResponse } from "./getTags";

// Get Audiences List
export { fetchAudiences, useAudiences } from "./getAudiences";
export type { AudiencesResponse, AudienceFilters } from "./getAudiences";
