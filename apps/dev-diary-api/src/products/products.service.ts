import { Injectable } from '@nestjs/common';
import type {
  TProduct,
  TCreateProduct,
  TSerializedProduct,
} from '@repo/types/schema';

@Injectable()
export class ProductsService {
  private readonly products: TSerializedProduct[] = [];

  createProduct(productData: TCreateProduct): TProduct {
    const product: TProduct = {
      ...productData,
      id: Math.random().toString(36).substring(7),
    };
    this.products.push(product);
    return product;
  }

  getProducts(): TSerializedProduct[] {
    return this.products;
  }
}
