import { z } from 'zod';

export const baseSchema = z.object({
  id: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
});


export const baseCreateSchema = baseSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
}).strict();

export const baseUpdateSchema = baseSchema.partial().strict();
