import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.string().optional(),
  filter: z.record(z.string(), z.any()).optional(),
});

