import { Controller, Get, Post, Body } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Validate } from 'src/decorators/validation.decorator';
import {
  type TCreateProduct,
  createProductSchema,
  productSchemaSerialized,
} from '@repo/types/schema';
import type { TSerializedProduct } from '@repo/types/schema';
import z from 'zod';
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Validate({
    input: createProductSchema,
  })
  createProduct(
    @Body() createProductRequest: TCreateProduct,
  ): TSerializedProduct {
    return this.productsService.createProduct(createProductRequest);
  }

  @Validate({
    output: z.array(productSchemaSerialized),
  })
  @Get()
  getProducts(): TSerializedProduct[] {
    // TODO: Replace with serializer
    const serializedProducts = this.productsService
      .getProducts()
      .map((product: TSerializedProduct) => ({
        id: product.id,
        name: product.name,
        title: product.title,
      }));

    return serializedProducts;
  }
}
