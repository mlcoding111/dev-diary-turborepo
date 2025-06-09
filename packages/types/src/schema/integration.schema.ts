import { z } from "zod";
import { baseSchema, baseCreateSchema, baseUpdateSchema } from "./base.schema";

export const integrationSchema = baseSchema.extend({
  // Add fields here
});

export const integrationSchemaSerialized = integrationSchema
  .omit({
    // Add fields here
  })
  .strict();

export const createIntegrationSchema = integrationSchema
  .omit({
    id: true,
    created_at: true,
    updated_at: true,
  })
  .strict();

export const updateIntegrationSchema = integrationSchema
  .omit({
    id: true,
    created_at: true,
    updated_at: true,
  })
  .strict();

export type TCreateIntegration = z.infer<typeof createIntegrationSchema>;
export type TUpdateIntegration = z.infer<typeof updateIntegrationSchema>;
export type TSerializedIntegration = z.infer<
  typeof integrationSchemaSerialized
>;
export type TIntegration = z.infer<typeof integrationSchema>;
