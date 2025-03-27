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

export type TUserLoginOutputSerialized = z.infer<typeof userLoginOutputSchemaSerialized>;
export type TUserLoginOutput = z.infer<typeof userLoginOutputSchema>;