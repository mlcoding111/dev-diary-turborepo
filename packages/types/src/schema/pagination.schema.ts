import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.union([z.string(), z.number()]).optional().transform((val) => Number(val)),
  limit: z.union([z.string(), z.number()]).optional().transform((val) => Number(val)),
  sortBy: z.string().optional(),
  sortOrder: z.string().optional(),
  filter: z.record(z.string(), z.any()).optional(),
});

