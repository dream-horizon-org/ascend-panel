/**
 * Queries index file
 * Central export point for all queries
 */

// Shared keys (used by mutations)
export { experimentKeys } from "./sharedKeys";
export { settingsKeys } from "./settingsKeys";

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

// Get Tenants
export { fetchTenants, useTenants } from "./getTenants";
export type { Tenant, TenantsResponse } from "./getTenants";

// Get Projects
export { fetchProjects, useProjects } from "./getProjects";
export type { Project, ProjectsResponse } from "./getProjects";
