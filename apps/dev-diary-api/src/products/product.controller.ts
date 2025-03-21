import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Validate } from 'src/decorators/validation.decorator';
import {
  type TCreateProduct,
  createProductSchema,
  productSchema,
  productSchemaSerialized,
} from '@repo/types/schema';
import type { TProduct, TSerializedProduct } from '@repo/types/schema';
import { ApiException } from 'src/core/utils/api/exception/ApiError.exception';
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
    // This is giving error: unsafe assigment of an error typed value
    output: z.array(productSchemaSerialized),

    // But somehow this is working:
    // output: productSchema,
  })
  @Get()
  getProducts(): TSerializedProduct[] {
    // throw new Error('User Not Found');
    // throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    // throw new ApiException({
    //   status_code: HttpStatus.NOT_FOUND,
    //   error_code: 'USER_NOT_FOUND',

    //   // Optional
    //   message: 'User Not Found',
    //   data: {
    //     test: 'test',
    //   },
    // });

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
