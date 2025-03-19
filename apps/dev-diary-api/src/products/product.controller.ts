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
import { ApiException } from 'src/core/utils/api/exception/ApiError.exception';
import { InternalServerError } from 'src/core/utils/api/exception/InternalServerError.exception';

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
    output: productSchema,
  })
  @Get()
  getProducts(): TSerializedProduct[] {
    throw new ApiException({
      message: 'test',
      error_code: 'TEST_ERROR',
      status_code: 401,
      data: null,
    });
    return this.productsService.getProducts();
  }
  // @Validate({
  //   output: productSchema,
  // })
  // @Get()
  // getProducts(): TSerializedProduct[] {
  //   // throw new Error('This is a test');

  //   // throw new InternalServerError({
  //   //   metadata: {
  //   //     test: 'test',
  //   //   },
  //   // });

  //   // throw new ApiException({
  //   //   message: 'test',
  //   //   error_code: 'TEST_ERROR',
  //   //   status_code: 500,
  //   //   data: null,
  //   // });

  //   // This would throw and error if the output is not matching the expected schema.
  //   // const transformedProducts = this.productsService
  //   //   .getProducts()
  //   //   .map((product) => ({
  //   //     id: product.id,
  //   //     name: product.name,
  //   //     title: product.title,
  //   //     test: 'yop',
  //   //   }));
  //   // return transformedProducts;
  //   return this.productsService.getProducts();
  // }
}
