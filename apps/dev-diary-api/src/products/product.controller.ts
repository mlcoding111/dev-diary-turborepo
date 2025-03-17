import { Controller, Get, Post, Body } from '@nestjs/common';
import { ProductsService } from './products.service';
import { type Product } from '@repo/types';
import { Validate } from 'src/decorators/validation.decorator';
import { z, ZodSchema } from 'zod';
import { productSchema, type TProduct } from '@repo/types';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  createProduct(@Body() createProductRequest: Product) {
    // type Test = z.infer<typeof productSchema>;
    // const zodSchema: ZodSchema<Test> = productSchema;
    return this.productsService.createProduct(createProductRequest);
  }

  @Validate({
    output: z.array(productSchema),
  })
  @Get()
  getProducts() {
    return this.productsService.getProducts();
  }
}
