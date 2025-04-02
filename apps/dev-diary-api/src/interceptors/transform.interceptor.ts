import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TApiResponseSuccess } from '@repo/types/api';
import { PaginatedResult } from '@/core/utils/service/base.service';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, TApiResponseSuccess<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<TApiResponseSuccess<T>> {
    return next.handle().pipe(map((data) => this.formatResponse(data)));
  }

  private formatResponse(data: T): TApiResponseSuccess<T> {
    return {
      success: true,
      data: data,
      message: 'success',
      metadata: {},
    };
  }
}
