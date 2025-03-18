import { z } from 'zod';

export const apiResponseSchema = z.object({
  http_status_code: z.number(),
  message: z.string(),
  data: z.any(),
});
