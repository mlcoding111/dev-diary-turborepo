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

export const createSessionSchema = baseCreateSchema.extend({
  // Add fields here
});

export const updateSessionSchema = baseUpdateSchema.extend({
  // Add fields here
});

export type TCreateSession = z.infer<typeof createSessionSchema>;
export type TUpdateSession = z.infer<typeof updateSessionSchema>;
export type TSerializedSession = z.infer<typeof sessionSchemaSerialized>;
export type TSession = z.infer<typeof sessionSchema>;
