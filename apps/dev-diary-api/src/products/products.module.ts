import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './product.controller';

@Module({
  providers: [ProductsService, ProductsController],
  exports: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
