import { Controller, Get, Post, Body } from '@nestjs/common';
import { ProductsService } from './products.service';
import { type Product } from '@repo/types';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  createProduct(@Body() createProductRequest: Product) {
    console.log(createProductRequest);
    return this.productsService.createProduct(createProductRequest);
  }

  @Get()
  getProducts() {
    return this.productsService.getProducts();
  }
}
