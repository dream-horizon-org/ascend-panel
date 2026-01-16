// Types
export interface VariantVariable {
  value: string;
  key: string;
  dataType: string;
}

export interface Variant {
  variables: VariantVariable[];
  display_name: string;
}

export interface VariantWeights {
  type: string;
  weights: Record<string, number>;
}

export interface RuleCondition {
  operand: string;
  operandDataType: string;
  operator: string;
  value: string;
}

export interface RuleAttribute {
  name: string;
  conditions: RuleCondition[];
}

export interface WinningVariant {
  p_value: number;
  variant: string;
}

export interface ExperimentOverrides {
  override_ids: Record<string, string[]>;
}

export interface Experiment {
  experimentId: string;
  projectKey: string;
  name: string;
  key: string;
  description?: string;
  hypothesis: string;
  status: string; // "LIVE", "DRAFT", "PAUSED", "CONCLUDED", etc.
  type: string;
  guardrailHealthStatus?: string;
  cohorts: any[];
  variantWeights: VariantWeights;
  variants: Record<string, Variant>;
  ruleAttributes: RuleAttribute[];
  distributionStrategy: string;
  assignmentDomain: string;
  overrides?: ExperimentOverrides;
  winningVariant?: WinningVariant;
  exposure: number;
  threshold: number;
  startTime: number; // Unix timestamp
  endTime: number; // Unix timestamp
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  owners: string[];
  variantCounts?: Record<string, number>;
}

export interface ExperimentApiResponse {
  data: Experiment;
}

// API returns experiment wrapped in { data: Experiment }
export type ExperimentResponse = Experiment;
