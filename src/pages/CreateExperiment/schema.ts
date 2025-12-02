import { z } from "zod";

export const experimentSchema = z.object({
    name: z.string().min(1, "Experiment name is required"),
    id: z.string().min(1, "Experiment ID is required"),
    hypothesis: z
      .string()
      .min(1, "Hypothesis is required")
      .max(120, "Maximum 120 characters allowed"),
    description: z.string().max(300, "Maximum 300 characters allowed").optional(),
    tags: z.array(z.string()).optional(),
    rateLimit: z.string().optional(),
    maxUsers: z.string().optional(),
    variants: z.array(
      z.object({
        name: z.string().min(1, "Variant name is required"),
        trafficSplit: z.string(),
        variables: z.array(
          z.object({
            key: z.string(),
            data_type: z.string(),
            value: z.string(),
          }),
        ),
        cohorts: z.array(z.string()).optional(),
      }),
    ),
    targeting: z
      .object({
        filters: z.array(
          z.object({
            operand: z.string(),
            operandDataType: z.string(),
            operator: z.string(),
            value: z.string(),
            condition: z.string(),
          }),
        ),
        cohorts: z.array(z.string()),
        isAssignCohortsDirectly: z.boolean(),
      })
      .optional(),
  });