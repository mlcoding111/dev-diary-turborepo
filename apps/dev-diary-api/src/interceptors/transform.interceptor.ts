import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TApiResponseSuccess } from '@repo/types/api';
import { PaginationResult } from '@/core/utils/service/pagination';
import { Reflector } from '@nestjs/core';
import { omit } from 'lodash';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, TApiResponseSuccess<any>>
{
  constructor(private readonly reflector: Reflector) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<TApiResponseSuccess<any>> {
    // const isPaginated = this.reflector.get<boolean>(
    //   'pagination',
    //   context.getHandler(),
    // );
    // get reflection
    return next.handle().pipe(map((data) => this.formatResponse(data)));
  }

  private formatResponse(
    data: T | T[] | PaginationResult<T>,
  ): TApiResponseSuccess<any> {
    // Check if data has the structure of a PaginationResult
    if (
      data &&
      typeof data === 'object' &&
      'metadata' in data &&
      data.metadata &&
      '_isPaginated' in data.metadata
    ) {
      return {
        success: true,
        data: data.data,
        message: 'success',
        metadata: omit(data.metadata, '_isPaginated'),
      };
    }
    return {
      success: true,
      data: data,
      message: 'success',
      metadata: {},
    };
  }
}
