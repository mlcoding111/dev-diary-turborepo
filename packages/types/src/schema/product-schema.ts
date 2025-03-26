import { z } from "zod";

export const productSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.number().min(0),
});

export const productSchemaSerialized = productSchema.omit({
  description: true,
  price: true,
}).strict();

export const createProductSchema = productSchema.omit({ id: true });

export type TProduct = z.infer<typeof productSchema>;
export type TCreateProduct = Omit<z.infer<typeof productSchema>, 'id'>;
export type TSerializedProduct = Omit<z.infer<typeof productSchema>, 'description' | 'price'>;
