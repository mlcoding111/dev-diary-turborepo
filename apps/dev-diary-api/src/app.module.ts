import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { TRPcModule } from './trpc/trpc.module';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ProductsController } from './products/product.controller';

@Module({
  imports: [ProductsModule],
  controllers: [ProductsController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
