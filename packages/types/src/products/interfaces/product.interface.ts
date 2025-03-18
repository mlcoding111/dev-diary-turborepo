import { CreateProductRequest } from "../dto/create-product.request";
import { z } from "zod";


export interface Product extends CreateProductRequest {
    id: string;
}

export const testSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    price: z.number().min(0),
});
