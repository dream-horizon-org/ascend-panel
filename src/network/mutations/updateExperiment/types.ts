// Types for Update Experiment API
export interface UpdateExperimentMetrics {
  primary?: string[];
  secondary?: string[];
}

export interface UpdateExperimentVariantVariable {
  data_type: string;
  value: string;
  key: string;
}

export interface UpdateExperimentVariant {
  display_name: string;
  variables: UpdateExperimentVariantVariable[];
}

export interface UpdateExperimentRuleCondition {
  operand: string;
  operandDataType: string;
  operator: string;
  value: string;
}

export interface UpdateExperimentRuleAttribute {
  name: string;
  conditions: UpdateExperimentRuleCondition[];
}

export interface UpdateExperimentVariantWeights {
  type: string;
}

export interface UpdateExperimentWinningVariant {
  variant_name: string;
}

export interface UpdateExperimentRequest {
  name?: string;
  experiment_key?: string;
  metrics?: UpdateExperimentMetrics;
  tags?: string[];
  owner?: string[];
  description?: string;
  hypothesis?: string;
  status?: string;
  type?: string;
  assignment_domain?: string;
  distribution_strategy?: string;
  guardrail_health_status?: string;
  cohorts?: string[];
  variant_weights?: UpdateExperimentVariantWeights;
  variants?: Record<string, UpdateExperimentVariant>;
  rule_attributes?: UpdateExperimentRuleAttribute[];
  overrides?: string[];
  winning_variant?: UpdateExperimentWinningVariant;
  exposure?: number;
  threshold?: number;
  start_time?: number;
  end_time?: number;
  updated_by?: string;
}

// Response type - reuse Experiment from queries
export { Experiment as UpdateExperimentResponse } from "../../queries/getExperimentDetails/types";

