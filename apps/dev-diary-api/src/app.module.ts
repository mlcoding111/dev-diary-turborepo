import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { TRPcModule } from './trpc/trpc.module';

@Module({
  imports: [ProductsModule, TRPcModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
