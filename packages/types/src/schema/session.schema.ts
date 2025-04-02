import { z } from "zod";
import { baseSchema, baseCreateSchema, baseUpdateSchema } from "./base.schema";

export const sessionSchema = baseSchema.extend({
  // Add fields here
});

export const sessionSchemaSerialized = sessionSchema
  .omit({
    // Add fields here
  })
  .strict();

export const createSessionSchema = sessionSchema
  .omit({
    id: true,
    created_at: true,
    updated_at: true,
  })
  .strict();

export const updateSessionSchema = sessionSchema
  .omit({
    id: true,
    created_at: true,
    updated_at: true,
  })
  .strict();

export type TCreateSession = z.infer<typeof createSessionSchema>;
export type TUpdateSession = z.infer<typeof updateSessionSchema>;
export type TSerializedSession = z.infer<typeof sessionSchemaSerialized>;
export type TSession = z.infer<typeof sessionSchema>;
