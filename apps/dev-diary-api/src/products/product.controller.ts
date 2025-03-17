import { Controller, Get, Post, Body } from '@nestjs/common';
import { ProductsService } from './products.service';
// import { type Product } from '@repo/types';
import { Validate } from 'src/decorators/validation.decorator';
import { z } from 'zod';
// import { productSchema, type TProduct } from '@repo/types';
import {
  productSchema,
  type TProduct,
  type TCreateProduct,
} from '@repo/types/schema';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  createProduct(@Body() createProductRequest: TCreateProduct): TProduct {
    // type Test = z.infer<typeof productSchema>;
    // const zodSchema: ZodSchema<Test> = productSchema;
    return this.productsService.createProduct(createProductRequest);
  }

  @Validate({
    output: z.array(productSchema),
  })
  @Get()
  getProducts(): TProduct[] {
    return this.productsService.getProducts();
  }
}
