import { Input, Mutation, Query, Router } from 'nestjs-trpc';
import { ProductsService } from './products.service';
// import { productSchema } from './product.schema';
// import { type Product } from '@repo/types';

@Router({ alias: 'products' })
export class ProductRouter {
  constructor(private readonly productsService: ProductsService) {}

  // @Mutation({
  //   input: productSchema,
  //   output: productSchema,
  // })
  // createProduct(@Input() productData: Product) {
  //   return this.productsService.createProduct(productData);
  // }

  // @Query({
  //   output: productSchema.array(),
  // })
  // getProducts() {
  //   return this.productsService.getProducts();
  // }
}
