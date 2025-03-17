import { Module } from '@nestjs/common';
import { ProductRouter } from './product.router';
import { ProductsService } from './products.service';
import { ProductsController } from './product.controller';

@Module({
  providers: [ProductsService, ProductsController],
  exports: [ProductsService],
})
export class ProductsModule {}
