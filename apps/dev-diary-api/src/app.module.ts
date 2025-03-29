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
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserModule } from './models/user/user.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt.guard';
import { APP_GUARD } from '@nestjs/core';
import { ClsModule } from 'nestjs-cls';
import { AuthModule } from './modules/auth/auth.module';
import { jwtConfig, refreshJwtConfig, databaseConfig } from './config';
import { RequestContextModule } from './modules/request/request-context.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: '.env',
      load: [jwtConfig, refreshJwtConfig, databaseConfig],
    }),
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),
    RequestContextModule,
    ProductsModule,
    DatabaseModule,
    AuthModule,
    UserModule,
  ],
  controllers: [ProductsController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
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
