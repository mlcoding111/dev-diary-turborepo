import { z } from 'zod';
import { baseSchema } from './base.schema';
import { OAuthProviderType } from '../types/integrations';

export const integrationSchema = baseSchema.extend({
  user_id: z.string(),
  access_token: z.string(),
  refresh_token: z.string().nullable().optional(),
  provider: z.nativeEnum(OAuthProviderType),
  data: z.any(),
  is_active: z.boolean().default(true),
  first_name: z.string().nullable().optional(),
  last_name: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  avatar_url: z.string().nullable().optional(),
  username: z.string().nullable().optional(),
  profile_url: z.string().nullable().optional(),
}).describe('Integration');

export const integrationSchemaSerialized = integrationSchema
  .omit({
    access_token: true,
    refresh_token: true,
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
