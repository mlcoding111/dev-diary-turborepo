import { Injectable } from '@nestjs/common';
// import type { Product, TProduct } from '@repo/types';
import { type TProduct, type TCreateProduct } from '@repo/types/schema';

@Injectable()
export class ProductsService {
  private readonly products: TProduct[] = [];

  createProduct(productData: TCreateProduct): TProduct {
    const product: TProduct = {
      ...productData,
      id: Math.random().toString(36).substring(7),
    };
    this.products.push(product);
    return product;
  }

  getProducts(): TProduct[] {
    return this.products;
  }
}
