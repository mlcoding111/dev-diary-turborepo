import { Module } from '@nestjs/common';
import { ProductRouter } from './product.router';
import { ProductsService } from './products.service';

@Module({
  providers: [ProductsService, ProductRouter],
})
export class ProductsModule {}
