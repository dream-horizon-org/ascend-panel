// Request types for Create Experiment API
export interface VariableInput {
  key: string;
  value: string;
  data_type: string;
}

export interface VariantInput {
  display_name: string;
  variables: VariableInput[];
}

export interface RuleConditionInput {
  operand: string;
  operandDataType: string;
  operator: string;
  value: string;
}

export interface RuleAttributeInput {
  name: string;
  conditions: RuleConditionInput[];
}

export interface VariantWeightsInput {
  type: string;
  weights: Record<string, number | string[]>;
}

export interface CreateExperimentRequest {
  name: string;
  experiment_key: string;
  description?: string;
  hypothesis: string;
  status: "DRAFT" | "LIVE" | "PAUSED";
  assignment_domain: string;
  distribution_strategy: string;
  cohorts: string[];
  type: string;
  variant_weights: VariantWeightsInput;
  variants: Record<string, VariantInput>;
  rule_attributes: RuleAttributeInput[];
  exposure: number;
  threshold: number;
  created_by: string;
  tags: string[];
}

// Response type for Create Experiment API
export interface CreateExperimentResponse {
  experiment_id: string;
  status: boolean;
}
