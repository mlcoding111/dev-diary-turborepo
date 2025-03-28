import { Global, Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { ClsService } from 'nestjs-cls';
import { RequestContextService } from './request-context.service';

@Global()
@Module({
  imports: [ClsModule.forFeature()],
  providers: [
    {
      provide: RequestContextService,
      useExisting: ClsService,
    },
  ],
  exports: [RequestContextService],
})
export class RequestContextModule {}
