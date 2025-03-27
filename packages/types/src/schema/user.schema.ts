import { z } from 'zod';

const userSchema = z.object({
  id: z.number(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
  password: z.string(),
  hashed_refresh_token: z.string().nullable(),
  refresh_token: z.string().nullable(),
  created_at: z.date(),
  updated_at: z.date(),
});

export const userSchemaSerialized = userSchema.omit({
  password: true,
}).strict();

export const createUserSchema = userSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
}).strict();

export type TCreateUser = Omit<z.infer<typeof userSchema>, 'id' | 'created_at' | 'updated_at'>;
export type TSerializedUser = z.infer<typeof userSchemaSerialized>;


