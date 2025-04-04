import { z } from 'zod';
import { baseSchema } from './base.schema';

export const userSchema = baseSchema.extend({
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
  password: z.string(),
  hashed_refresh_token: z.string().nullable(),
  refresh_token: z.string().nullable(),
  github_token: z.string().nullable().optional(),
});

export const userSchemaSerialized = userSchema.omit({
  password: true,
  hashed_refresh_token: true,
}).strict();

export const createUserSchema = userSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
}).strict();

export const registerUserSchema = userSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  hashed_refresh_token: true,
  refresh_token: true,
}).strict();

export type TCreateUser = z.infer<typeof createUserSchema>;
export type TRegisterUser = z.infer<typeof registerUserSchema>;
export type TSerializedUser = z.infer<typeof userSchemaSerialized>;
export type TUser = z.infer<typeof userSchema>;

// Ensure type correctness with TSerializedUser and TCreateUser
