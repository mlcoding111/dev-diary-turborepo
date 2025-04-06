import { z } from "zod";
import { baseSchema, baseCreateSchema, baseUpdateSchema } from "./base.schema";

export const meSchema = baseSchema.extend({
  // Add fields here
});

export const meSchemaSerialized = meSchema
  .omit({
    // Add fields here
  })
  .strict();

export const createMeSchema = meSchema
  .omit({
    id: true,
    created_at: true,
    updated_at: true,
  })
  .strict();

export const updateMeSchema = meSchema
  .omit({
    id: true,
    created_at: true,
    updated_at: true,
  })
  .strict();

export type TCreateMe = z.infer<typeof createMeSchema>;
export type TUpdateMe = z.infer<typeof updateMeSchema>;
export type TSerializedMe = z.infer<typeof meSchemaSerialized>;
export type TMe = z.infer<typeof meSchema>;
