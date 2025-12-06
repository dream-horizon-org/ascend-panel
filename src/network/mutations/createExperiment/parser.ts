import { CreateExperimentRequest } from "./types";

// Form data types (matching the form schema)
interface FormVariant {
  name: string;
  trafficSplit: string;
  variables: {
    key: string;
    data_type: string;
    value: string;
  }[];
  cohorts?: string; // Stored as string in form, converted to array for API
}

interface FormTargeting {
  filters: {
    operand: string;
    operandDataType: string;
    operator: string;
    value: string;
    condition: string;
  }[];
  cohorts: string; // Stored as string in form, converted to array for API
  isAssignCohortsDirectly: boolean;
}

export interface ExperimentFormData {
  name: string;
  id: string;
  hypothesis?: string;
  description?: string;
  tags?: string[];
  rateLimit?: string;
  maxUsers?: string;
  variants: FormVariant[];
  targeting?: FormTargeting;
}

/**
 * Transform form data to API request body
 */
export const transformToRequestBody = (
  data: ExperimentFormData,
): CreateExperimentRequest => {
  // Check if cohorts are assigned directly to variants
  const isAssignCohortsDirectly =
    data.targeting?.isAssignCohortsDirectly || false;
  const assignmentType = isAssignCohortsDirectly ? "STRATIFIED" : "COHORT";

  // Build weights object based on assignment type
  const weights: Record<string, number | string[]> = {};
  data.variants.forEach((variant, index) => {
    const key = index === 0 ? "control" : `variant${index}`;
    if (assignmentType === "STRATIFIED") {
      // For STRATIFIED, use variant's cohorts - convert string to array
      weights[key] = variant.cohorts ? [variant.cohorts] : [];
    } else {
      // For COHORT, use trafficSplit percentage
      weights[key] = parseInt(variant.trafficSplit) || 0;
    }
  });

  // Build variants object
  const variants: Record<
    string,
    {
      display_name: string;
      variables: { key: string; value: string; data_type: string }[];
    }
  > = {};
  data.variants.forEach((variant, index) => {
    const key = index === 0 ? "control" : `variant${index}`;

    const variables = variant.variables
      .filter((v) => v.key && v.data_type)
      .map((v) => ({
        key: v.key,
        value: v.value,
        data_type: v.data_type,
      }));

    variants[key] = {
      display_name: variant.name,
      variables: variables,
    };
  });

  // Transform filters to rule_attributes - direct 1:1 mapping
  // Filter out any filters where any required field is empty
  const validFilters =
    data.targeting?.filters?.filter(
      ({ operand, operandDataType, operator, value }) =>
        operand && operandDataType && operator && value,
    ) || [];

  const rule_attributes =
    validFilters.length > 0
      ? [
          {
            name: "Targeting Rule",
            conditions: validFilters.map(
              ({ operand, operandDataType, operator, value }) => ({
                operand,
                operandDataType,
                operator,
                value,
              }),
            ),
          },
        ]
      : [];

  // Extract cohorts from targeting - convert string to array
  const cohorts = data.targeting?.cohorts ? [data.targeting.cohorts] : [];

  return {
    name: data.name,
    experiment_key: data.id,
    description: data.description || "",
    hypothesis: data.hypothesis || "",
    status: "LIVE",
    assignment_domain: assignmentType,
    distribution_strategy: "RANDOM",
    cohorts: cohorts,
    type: "A/B",
    variant_weights: {
      type: assignmentType,
      weights: weights,
    },
    variants: variants,
    rule_attributes: rule_attributes,
    exposure: data.rateLimit ? Number(data.rateLimit) : 0,
    threshold: data.maxUsers ? Number(data.maxUsers) : 0,
    created_by: "user@example.com",
    tags: data.tags || [],
  };
};
