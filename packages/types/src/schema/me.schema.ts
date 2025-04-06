import { z } from 'zod';
import { userSchema, userSchemaSerialized } from './user.schema';

export const meSchema = userSchema.extend({
  // Add fields here
});

export const meSchemaSerialized = userSchemaSerialized;

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
export type TSerializedMe = z.infer<typeof userSchemaSerialized>;
export type TMe = z.infer<typeof meSchema>;
