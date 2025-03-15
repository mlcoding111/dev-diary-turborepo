import { z } from 'zod';

export const productSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  price: z.number(),
});

export type Product = z.infer<typeof productSchema>;
