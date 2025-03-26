import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ProductsController } from './products/product.controller';
import { GlobalValidationInterceptor } from './interceptors/validator.interceptor';
import { CatchEverythingFilter } from './filters/catch-all.filter';
import { HttpExceptionFilter } from './filters/http.filter';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './modules/database/database.module';
import { UserModule } from './models/user.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: '.env',
    }),
    ProductsModule,
    DatabaseModule,
    UserModule,
  ],
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
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
