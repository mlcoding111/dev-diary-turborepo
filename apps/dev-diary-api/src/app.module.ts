import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ProductsController } from './products/product.controller';
import { GlobalValidationInterceptor } from './interceptors/validator.interceptor';
import { CatchEverythingFilter } from './filters/catch-all.filter';

@Module({
  imports: [ProductsModule],
  controllers: [ProductsController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: GlobalValidationInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: CatchEverythingFilter,
    },
  ],
})
export class AppModule {}
