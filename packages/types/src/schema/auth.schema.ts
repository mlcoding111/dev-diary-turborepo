import { z } from 'zod';
import { userSchemaSerialized, userSchema } from './user.schema';

export const userLoginOutputSchemaSerialized = z.object({
  user: userSchemaSerialized,
  access_token: z.string(),
  refresh_token: z.string(),
});

export const userLoginOutputSchema = z.object({
  user: userSchema,
  access_token: z.string(),
  refresh_token: z.string(),
});

export const userLoginInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type TUserLoginOutputSerialized = z.infer<typeof userLoginOutputSchemaSerialized>;
export type TUserLoginOutput = z.infer<typeof userLoginOutputSchema>;
export type TUserLoginInput = z.infer<typeof userLoginInputSchema>;