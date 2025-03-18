import { Controller, Get, Post, Body } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Validate } from 'src/decorators/validation.decorator';
import {
  type TCreateProduct,
  createProductSchema,
  productSchema,
} from '@repo/types/schema';
import z from 'zod';
import type { TProduct, TSerializedProduct } from '@repo/types/schema';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Validate({
    input: createProductSchema,
  })
  createProduct(@Body() createProductRequest: TCreateProduct): TProduct {
    return this.productsService.createProduct(createProductRequest);
  }

  @Validate({
    output: z.array(productSchema),
  })
  @Get()
  getProducts(): TSerializedProduct[] {
    // This would throw and error if the output is not matching the expected schema.
    // const transformedProducts = this.productsService
    //   .getProducts()
    //   .map((product) => ({
    //     id: product.id,
    //     name: product.name,
    //     title: product.title,
    //   }));
    // return transformedProducts;
    return this.productsService.getProducts();
  }
}
