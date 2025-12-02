import { AxiosResponse } from "axios";
import {
  Experiment,
  ExperimentResponse,
  VariantVariable,
  Variant,
  VariantWeights,
  RuleCondition,
  RuleAttribute,
  WinningVariant,
} from "./types";

// API Response types (snake_case)
interface ApiVariantVariable {
  value: string;
  key: string;
  data_type: string | null;
}

interface ApiVariant {
  display_name: string;
  variables: ApiVariantVariable[];
}

interface ApiVariantWeights {
  type: string;
  weights: Record<string, number>;
}

interface ApiRuleCondition {
  operand: string;
  operandDataType: string;
  operator: string;
  value: string;
}

interface ApiRuleAttribute {
  name: string;
  conditions: ApiRuleCondition[];
}

interface ApiWinningVariant {
  variant_name: string | null;
}

interface ApiExperiment {
  experiment_id: string;
  project_key: string;
  name: string;
  experiment_key: string;
  description?: string;
  hypothesis: string;
  status: string;
  type: string;
  guardrail_health_status?: string;
  cohorts: any[];
  variant_weights: ApiVariantWeights;
  variants: Record<string, ApiVariant>;
  rule_attributes: ApiRuleAttribute[];
  distribution_strategy: string;
  assignment_domain: string;
  overrides: string[];
  winning_variant?: ApiWinningVariant;
  exposure: number;
  threshold: number;
  start_time: number;
  end_time: number;
  created_by: string;
  created_at: string;
  updated_at: string;
  tags?: string[];
  owners?: string[];
}

interface ApiExperimentResponse {
  data: ApiExperiment;
}

const parseVariantVariable = (apiVar: ApiVariantVariable): VariantVariable => ({
  value: apiVar.value,
  key: apiVar.key,
  dataType: apiVar.data_type || "",
});

const parseVariant = (apiVariant: ApiVariant): Variant => ({
  display_name: apiVariant.display_name,
  variables: apiVariant.variables.map(parseVariantVariable),
});

const parseVariantWeights = (
  apiWeights: ApiVariantWeights,
): VariantWeights => ({
  type: apiWeights.type,
  weights: apiWeights.weights,
});

const parseRuleCondition = (apiCondition: ApiRuleCondition): RuleCondition => ({
  operand: apiCondition.operand,
  operandDataType: apiCondition.operandDataType,
  operator: apiCondition.operator,
  value: apiCondition.value,
});

const parseRuleAttribute = (apiAttribute: ApiRuleAttribute): RuleAttribute => ({
  name: apiAttribute.name,
  conditions: apiAttribute.conditions.map(parseRuleCondition),
});

const parseWinningVariant = (
  apiWinning: ApiWinningVariant,
): WinningVariant | undefined => {
  if (!apiWinning.variant_name) {
    return undefined;
  }
  return {
    p_value: 0,
    variant: apiWinning.variant_name,
  };
};

const parseExperiment = (apiExperiment: ApiExperiment): Experiment => {
  const parsedVariants = Object.entries(apiExperiment.variants).reduce(
    (acc, [key, value]) => {
      acc[key] = parseVariant(value);
      return acc;
    },
    {} as Record<string, Variant>,
  );

  return {
    experimentId: apiExperiment.experiment_id,
    projectKey: apiExperiment.project_key,
    name: apiExperiment.name,
    key: apiExperiment.experiment_key,
    description: apiExperiment.description,
    hypothesis: apiExperiment.hypothesis,
    status: apiExperiment.status,
    type: apiExperiment.type,
    guardrailHealthStatus: apiExperiment.guardrail_health_status,
    cohorts: apiExperiment.cohorts,
    variantWeights: parseVariantWeights(apiExperiment.variant_weights),
    variants: parsedVariants,
    ruleAttributes: apiExperiment.rule_attributes.map(parseRuleAttribute),
    distributionStrategy: apiExperiment.distribution_strategy,
    assignmentDomain: apiExperiment.assignment_domain,
    overrides: apiExperiment.overrides,
    winningVariant: apiExperiment.winning_variant
      ? parseWinningVariant(apiExperiment.winning_variant)
      : undefined,
    exposure: apiExperiment.exposure,
    threshold: apiExperiment.threshold,
    startTime: apiExperiment.start_time,
    endTime: apiExperiment.end_time,
    createdBy: apiExperiment.created_by,
    createdAt: apiExperiment.created_at,
    updatedAt: apiExperiment.updated_at,
    tags: apiExperiment.tags || [],
    owners: apiExperiment.owners || [],
  };
};

/**
 * Parse the raw API response for experiment details
 * Transforms snake_case API response to camelCase app format
 */
export const parseExperimentResponse = (
  response: AxiosResponse<ApiExperimentResponse>,
): ExperimentResponse => {
  return parseExperiment(response.data.data);
};
