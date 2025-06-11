import { z } from 'zod';
import { baseSchema } from './base.schema';
import { TIntegrationData } from '../types/integrations';

export const userSchema = baseSchema.extend({
  first_name: z.string().trim().min(1, "First name is required"),
  last_name: z.string().trim().min(1, "Last name is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  email: z.string().email(),
  hashed_refresh_token: z.string().nullable(),
  refresh_token: z.string().nullable(),
  access_token: z.string().nullable(),
  active_integration_id: z.string().uuid().nullable(),
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
  access_token: true,
  active_integration_id: true,
}).strict();

export type TCreateUser = z.infer<typeof createUserSchema>;
export type TRegisterUser = z.infer<typeof registerUserSchema>;
export type TSerializedUser = z.infer<typeof userSchemaSerialized>;
export type TUser = z.infer<typeof userSchema>;