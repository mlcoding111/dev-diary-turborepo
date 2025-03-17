import { z } from "zod";

export const productSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.number().min(0),
});

export const createProductSchema = productSchema.omit({ id: true });

export type TProduct = z.infer<typeof productSchema>;
export type TCreateProduct = Omit<TProduct, 'id'>;
